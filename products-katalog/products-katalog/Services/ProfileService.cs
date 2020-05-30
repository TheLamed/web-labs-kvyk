using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using products_katalog.Models.Auth;
using products_katalog.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace products_katalog.Services
{
    public class ProfileService
    {
        #region Private Properties

        private IConfiguration _configuration;
        private ApplicationContext _db;

        #endregion

        #region Constructor

        public ProfileService
        (
            ApplicationContext db,
            IConfiguration configuration
        )
        {
            _db = db;
            _configuration = configuration;
        }

        #endregion

        #region Methods

        public async Task<UserModel> GetProfile(int id)
        {
            var user = await _db.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(v => v.Id == id);

            if (user == null)
                throw new Exception("404");

            return new UserModel(user);
        }

        public async Task<bool> ChangePassword(ChangePasswordModel model)
        {
            var user = await _db.Users
                .FirstOrDefaultAsync(v => v.Id == model.Id);

            if (user == null)
                throw new Exception("404");

            var hasher = new PasswordHasher<string>();
            var passwordCheck = hasher.VerifyHashedPassword(user.Id.ToString(), user.Password, model.OldPassword);

            if (passwordCheck == PasswordVerificationResult.Failed)
                throw new Exception("400");

            user.Password = hasher.HashPassword(user.Id.ToString(), model.NewPassword);

            _db.Users.Update(user);
            await _db.SaveChangesAsync();

            return true;
        }

        public async Task<UserModel> EditProfile(int id, EditProfileModel model)
        {
            var user = await _db.Users
                .FirstOrDefaultAsync(v => v.Id == id);

            if (user == null)
                throw new Exception("404");

            if(model.Email != user.Email)
            {
                var emailCheckUser = await _db.Users
                    .AsNoTracking()
                    .FirstOrDefaultAsync(v => v.Email == model.Email);

                if (emailCheckUser != null)
                    throw new Exception("400");
            }

            user.Name = model.Name;
            user.Email = model.Email;

            _db.Users.Update(user);
            await _db.SaveChangesAsync();

            return new UserModel(user);
        }

        public async Task<bool> AddLike(int userId, int productId)
        {
            var user = await _db.Users
               .Include(v => v.UserLikes)
               .FirstOrDefaultAsync(v => v.Id == userId);

            if (user == null)
                throw new Exception("404 U");

            var product = await _db.Products
               .FirstOrDefaultAsync(v => v.Id == productId);

            if (product == null)
                throw new Exception("404 P");

            if (user.UserLikes.FindIndex(v => v.ProductId == productId) > 0)
                return true;

            var like = new UserLikeProductEntity()
            {
                UserId = user.Id,
                ProductId = product.Id
            };

            await _db.Likes.AddAsync(like);
            await _db.SaveChangesAsync();

            return true;
        }

        public async Task<bool> RemoveLike(int userId, int productId)
        {
            var user = await _db.Users
               .Include(v => v.UserLikes)
               .FirstOrDefaultAsync(v => v.Id == userId);

            if (user == null)
                throw new Exception("404 U");

            var product = await _db.Products
               .FirstOrDefaultAsync(v => v.Id == productId);

            if (product == null)
                throw new Exception("404 P");

            var like = user.UserLikes.FirstOrDefault(v => v.ProductId == productId);

            if (like == null)
                return true;

            _db.Likes.Remove(like);
            await _db.SaveChangesAsync();

            return true;
        }

        #endregion
    }
}
