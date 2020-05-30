using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using products_katalog.Helpers;
using products_katalog.Models;
using products_katalog.Models.Users;
using products_katalog.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace products_katalog.Controllers.Admin
{
    [ApiController]
    [Authorize(Roles = Roles.Admin)]
    [Route("api/admin/users")]
    public class AdminUsersController : ControllerBase
    {
        #region Private Members

        private UserService _userService;

        #endregion

        #region Constructor

        public AdminUsersController
        (
            UserService userService
        )
        {
            _userService = userService;
        }

        #endregion

        #region API Calls

        /// <summary>
        /// Отримати юзерів
        /// </summary>
        /// <response code="200">User list</response>
        [HttpGet]
        [Route("")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<PagingList<ViewUserModel>>> GetUsers
        (
            [FromQuery]int pn = 0,
            [FromQuery]int ps = 10,
            [FromQuery]string sort = null,
            [FromQuery]string sortDir = "asc",
            [FromQuery]string find = null,
            [FromQuery]int? like = null
        )
        {
            return await this.ExecuteWithOkResponse(async () => await _userService.GetUsers(pn, ps, sort, sortDir, find, like));
        }

        /// <summary>
        /// Видалити юзера
        /// </summary>
        /// <response code="200">Deleted</response>
        [HttpDelete]
        [Route("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> DeleteUser(int id)
        {
            return await this.ExecuteWithOkResponse(async () => await _userService.DeleteUser(id));
        }

        #endregion
    }
}
