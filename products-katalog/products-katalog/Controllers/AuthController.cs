using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using products_katalog.Models.Auth;
using products_katalog.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace products_katalog.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        #region Private Members

        private AuthService _authService;

        #endregion

        #region Constructor

        public AuthController
        (
            AuthService authService
        )
        {
            _authService = authService;
        }

        #endregion

        #region API Calls

        /// <summary>
		/// Логін
		/// </summary>
		/// <response code="200">Login response</response>
		/// <response code="400">Bad model</response>
		/// <response code="404">Wrong Email</response>
		/// <response code="401">Wrong Password</response>
        [HttpPost]
        [Route("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<LoginResponse>> Login([FromBody]LoginModel model)
        {
            return await this.ExecuteWithOkResponse(async () => await _authService.Login(model));
        }

        /// <summary>
		/// Реєстрація
		/// </summary>
		/// <response code="200">Registrated</response>
		/// <response code="400">Bad model or Email is already exist</response>
        [HttpPost]
        [Route("signup")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<bool>> SignUp([FromBody]SignUpModel model)
        {
            return await this.ExecuteWithOkResponse(async () => await _authService.SignUp(model));
        }

        #endregion
    }
}
