using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using products_katalog.Helpers;
using products_katalog.Models;
using products_katalog.Models.Auth;
using products_katalog.Models.Entities;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace products_katalog.Services
{
    public class AuthService
    {
        #region Private Properties

        private IConfiguration _configuration;
        private ApplicationContext _db;

        #endregion

        #region Constructor

        public AuthService
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

        public async Task<LoginResponse> Login(LoginModel model)
        {
            var user = await _db.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(v => v.Email == model.Email);

            if (user == null)
                throw new Exception("404");

            var hasher = new PasswordHasher<string>();
            var passwordCheck = hasher.VerifyHashedPassword(user.Id.ToString(), user.Password, model.Password);

            if (passwordCheck == PasswordVerificationResult.Failed)
                throw new Exception("401");


            var authClaims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role),
            };

            var authOptions = _configuration.GetSection("AuthOptions").Get<AuthOptions>();

            var token = new JwtSecurityToken(
                issuer: authOptions.Issuer,
                audience: authOptions.Audience,
                expires: DateTime.Now.AddHours(authOptions.ExpiresInMinutes),
                claims: authClaims,
                signingCredentials: new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authOptions.SecureKey)),
                    SecurityAlgorithms.HmacSha256Signature)
                );

            var response = new LoginResponse()
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                User = new UserModel(user)
            };

            return response;
        }

        public async Task<bool> SignUp(SignUpModel model)
        {
            var user = await _db.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(v => v.Email == model.Email);

            if (user != null)
                throw new Exception("400");

            user = new UserEntity()
            {
                Email = model.Email,
                Name = model.Name,
                Role = Roles.Customer
            };

            var hasher = new PasswordHasher<string>();
            user.Password = hasher.HashPassword(user.Id.ToString(), model.Password);

            await _db.Users.AddAsync(user);
            await _db.SaveChangesAsync();

            return true;
        }

        #endregion
    }
}
