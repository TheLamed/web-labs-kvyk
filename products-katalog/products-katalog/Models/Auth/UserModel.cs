using products_katalog.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace products_katalog.Models.Auth
{
    public class UserModel
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string Role { get; set; }

        public UserModel()
        {

        }

        public UserModel(UserEntity entity)
        {
            Id = entity.Id;
            Email = entity.Email;
            Name = entity.Email;
            Role = entity.Role;
        }
    }
}
