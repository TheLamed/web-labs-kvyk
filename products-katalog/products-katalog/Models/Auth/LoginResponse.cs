using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace products_katalog.Models.Auth
{
    public class LoginResponse
    {
        public string Token { get; set; }
        public UserModel User { get; set; }
    }
}
