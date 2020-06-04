using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using products_katalog.Models;
using products_katalog.Models.Entities;
using products_katalog.Models.Products;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace products_katalog.Services
{
    public class ProductService
    {
        #region Private Properties

        private ApplicationContext _db;
        private FileService _fileService;

        #endregion

        #region Constructor

        public ProductService
        (
            ApplicationContext db,
            FileService fileService
        )
        {
            _db = db;
            _fileService = fileService;
        }

        #endregion

        #region Methods

        public async Task<PagingList<ProductModel>> GetProducts(int pn = 0, int ps = 10, string sort = null, string sortDir = "asc", string find = null, int userId = 0, bool onlyLikes = false)
        {
            if (pn < 0) pn = 0;
            if (ps < 0) ps = 0;
            if (sortDir != "asc" && sortDir != "desc")
                sortDir = "asc";

            var user = await _db.Users
                .Include(v => v.UserLikes)
                .AsNoTracking()
                .FirstOrDefaultAsync(v => v.Id == userId);

            var likesList = new List<int>();

            if (user != null)
                likesList = user.UserLikes.Select(v => v.ProductId).ToList();

            var query = _db.Products
                .Include(v => v.Images)
                .AsQueryable();

            if (!string.IsNullOrEmpty(find))
                query = query.Where(v => EF.Functions.Like(v.Name, $"%{find}%"));

            if (onlyLikes)
                query = query.Where(v => likesList.Contains(v.Id));

            query = AddSorting(query, sort, sortDir);

            var response = new PagingList<ProductModel>();

            response.TotalCount = await query.CountAsync();

            var products = await query
                .Skip(pn * ps)
                .Take(ps)
                .AsNoTracking()
                .ToListAsync();

            response.Items = products
                .Select(v => new ProductModel(v, likesList.Contains(v.Id)))
                .ToList();

            return response;
        }

        public async Task<ProductModel> AddProduct(AddProductModel model)
        {
            var product = new ProductEntity()
            {
                Name = model.Name,
                Price = model.Price,
                Description = model.Description
            };

            var entity = await _db.Products.AddAsync(product);
            await _db.SaveChangesAsync();

            await entity.ReloadAsync();

            product = await _db.Products
                .AsNoTracking()
                .FirstOrDefaultAsync(v => v.Id == entity.Entity.Id);

            return new ProductModel(product);
        }

        public async Task<bool> DeleteProduct(int id)
        {
            var product = await _db.Products
                .Include(v => v.Images)
                .AsNoTracking()
                .FirstOrDefaultAsync(v => v.Id == id);

            if(product == null)
                return true;

            foreach (var item in product.Images)
                await _fileService.DeleteFile(item.Link);

            _db.Products.Remove(product);
            await _db.SaveChangesAsync();

            return true;
        }

        public async Task<ProductModel> EditProduct(int id, AddProductModel model)
        {
            var product = await _db.Products
                .Include(v => v.Images)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (product == null)
                throw new Exception("404");

            product.Name = model.Name;
            product.Price = model.Price;
            product.Description = model.Description;

            _db.Products.Update(product);
            await _db.SaveChangesAsync();

            return new ProductModel(product);
        }

        public async Task<ProductModel> AddImage(int id, IFormFile image)
        {
            var product = await _db.Products
                .Include(v => v.Images)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (product == null)
                throw new Exception("404");

            var entity = new ProductImageEntity()
            {
                ProductId = product.Id
            };

            var img = await _fileService.UploadFile(image);

            entity.Link = img.Link;
            entity.Name = img.Name;

            product.Images.Add(entity);

            _db.Products.Update(product);
            await _db.SaveChangesAsync();

            return new ProductModel(product);
        }

        public async Task<bool> RemoveImage(int id, string link)
        {
            var product = await _db.Products
                .Include(v => v.Images)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (product == null)
                throw new Exception("404");

            var img = product.Images.FirstOrDefault(v => v.Link == link);

            _db.Images.Remove(img);
            await _db.SaveChangesAsync();

            await _fileService.DeleteFile(link);

            return true;
        }

        #endregion

        #region Private Members

        private IQueryable<ProductEntity> AddSorting(IQueryable<ProductEntity> query, string sort, string sortDir)
            => ((sort?.ToLower(), sortDir?.ToLower())) switch
            {
                ("name", "asc") => query.OrderBy(v => v.Name),
                ("name", "desc") => query.OrderByDescending(v => v.Name),
                ("price", "asc") => query.OrderBy(v => v.Price),
                ("price", "desc") => query.OrderByDescending(v => v.Price),
                ("id", "asc") => query.OrderBy(v => v.Id),
                ("id", "desc") => query.OrderByDescending(v => v.Id),
                _ => query.OrderBy(v => v.Id)
            };

        #endregion
    }
}
