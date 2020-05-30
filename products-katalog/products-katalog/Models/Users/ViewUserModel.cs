using products_katalog.Models.Auth;
using products_katalog.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace products_katalog.Models.Users
{
    public class ViewUserModel : UserModel
    {
        public List<IdValueModel> Likes { get; set; }

        public ViewUserModel() : base()
        {

        }

        public ViewUserModel(UserEntity entity) : base(entity)
        {
            Likes = entity.UserLikes?.Select(v => new IdValueModel()
            {
                Id = v.ProductId,
                Value = v.Product?.Name
            }).ToList();
        }
    }
}
