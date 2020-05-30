using Microsoft.AspNetCore.Authorization;
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
    [Route("api/profile")]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        #region Private Members

        private ProfileService _profileService;

        #endregion

        #region Constructor

        public ProfileController
        (
            ProfileService profileService
        )
        {
            _profileService = profileService;
        }

        #endregion

        #region API Calls

        /// <summary>
        /// Отримати профіль
        /// </summary>
        /// <response code="200">User model</response>
        /// <response code="404">User Not Found</response>
        [HttpGet]
        [Route("")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UserModel>> GetProfile()
        {
            return await this.ExecuteWithOkResponse(async () => await _profileService.GetProfile(this.GetUserId()));
        }

        /// <summary>
        /// Зміна паролю
        /// </summary>
        /// <response code="200">Changed</response>
        /// <response code="400">Wrong password</response>
        /// <response code="404">User Not Found</response>
        [HttpPost]
        [Route("change-password")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<bool>> ChangePassword([FromBody]ChangePasswordModel model)
        {
            return await this.ExecuteWithOkResponse(async () => await _profileService.ChangePassword(model));
        }

        /// <summary>
        /// Редагувати профіль
        /// </summary>
        /// <response code="200">Changed</response>
        /// <response code="400">Email is already exist</response>
        /// <response code="404">User Not Found</response>
        [HttpPost]
        [Route("edit")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UserModel>> EditProfile([FromBody]EditProfileModel model)
        {
            return await this.ExecuteWithOkResponse(async () => await _profileService.EditProfile(this.GetUserId(), model));
        }
        
        /// <summary>
        /// Лайк
        /// </summary>
        /// <response code="200">Changed</response>
        /// <response code="404">User or Product does not exist</response>
        [HttpGet]
        [Route("like/{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<bool>> AddLike(int id)
        {
            return await this.ExecuteWithOkResponse(async () => await _profileService.AddLike(this.GetUserId(), id));
        }

        /// <summary>
        /// Забрати лайк
        /// </summary>
        /// <response code="200">Changed</response>
        /// <response code="404">User or Product does not exist</response>
        [HttpDelete]
        [Route("like/{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<bool>> RemoveLike(int id)
        {
            return await this.ExecuteWithOkResponse(async () => await _profileService.RemoveLike(this.GetUserId(), id));
        }

        #endregion
    }
}
