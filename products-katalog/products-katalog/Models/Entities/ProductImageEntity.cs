using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace products_katalog.Models.Entities
{
    public class ProductImageEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Link { get; set; }
        public int ProductId { get; set; }

        public ProductEntity Product { get; set; }
    }
}
