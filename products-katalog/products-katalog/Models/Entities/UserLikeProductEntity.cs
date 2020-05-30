using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace products_katalog.Models.Entities
{
    public class UserLikeProductEntity
    {
        public int UserId { get; set; }
        public int ProductId { get; set; }

        public UserEntity User { get; set; }
        public ProductEntity Product { get; set; }
    }
}
