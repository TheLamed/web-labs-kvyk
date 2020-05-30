using Microsoft.EntityFrameworkCore;
using products_katalog.Helpers;
using products_katalog.Models;
using products_katalog.Models.Auth;
using products_katalog.Models.Entities;
using products_katalog.Models.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace products_katalog.Services
{
    public class UserService
    {
        #region Private Properties

        private ApplicationContext _db;

        #endregion

        #region Constructor

        public UserService
        (
            ApplicationContext db
        )
        {
            _db = db;
        }

        #endregion

        #region Methods

        public async Task<PagingList<ViewUserModel>> GetUsers(int pn = 0, int ps = 10, string sort = null, string sortDir = "asc", string find = null, int? like = null)
        {
            if (pn < 0) pn = 0;
            if (ps < 0) ps = 0;
            if (sortDir != "asc" && sortDir != "desc")
                sortDir = "asc";

            var query = _db.Users.AsQueryable();

            if (like != null)
                query = query
                    .Include(v => v.UserLikes.Where(f => f.ProductId == like))
                        .ThenInclude(v => v.Product);
            else
                query = query
                    .Include(v => v.UserLikes)
                        .ThenInclude(v => v.Product);

            if (!string.IsNullOrEmpty(find))
                query = query.Where(v => EF.Functions.Like(v.Name, $"%{find}%") || EF.Functions.Like(v.Email, $"%{find}%"));

            query = AddSorting(query, sort, sortDir);

            var response = new PagingList<ViewUserModel>();

            response.TotalCount = await query.CountAsync();

            var products = await query
                .Skip(pn * ps)
                .Take(ps)
                .AsNoTracking()
                .ToListAsync();

            response.Items = products
                .Select(v => new ViewUserModel(v))
                .ToList();

            return response;
        }

        public async Task<bool> DeleteUser(int id)
        {
            var user = await _db.Users
                .FirstOrDefaultAsync(v => v.Role == Roles.Customer && v.Id == id);

            if (user == null)
                return true;

            _db.Users.Remove(user);
            await _db.SaveChangesAsync();

            return true;
        }

        #endregion

        #region Private Members

        private IQueryable<UserEntity> AddSorting(IQueryable<UserEntity> query, string sort, string sortDir)
            => (sort?.ToLower(), sortDir?.ToLower()) switch
            {
                ("name", "asc") => query.OrderBy(v => v.Name),
                ("name", "desc") => query.OrderByDescending(v => v.Name),
                ("email", "asc") => query.OrderBy(v => v.Email),
                ("email", "desc") => query.OrderByDescending(v => v.Email),
                ("id", "asc") => query.OrderBy(v => v.Id),
                ("id", "desc") => query.OrderByDescending(v => v.Id),
                _ => query.OrderBy(v => v.Id)
            };


        #endregion
    }
}
