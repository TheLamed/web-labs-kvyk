using products_katalog.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace products_katalog.Models.Products
{
    public class ProductModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public bool IsLiked { get; set; }
        public List<string> Images { get; set; }

        public ProductModel()
        {

        }

        public ProductModel(ProductEntity entity, bool isLiked = false)
        {
            Id = entity.Id;
            Name = entity.Name;
            Description = entity.Description;
            Price = entity.Price;
            IsLiked = isLiked;
            Images = entity.Images?.Select(v => v.Link).ToList();
        }
    }
}
