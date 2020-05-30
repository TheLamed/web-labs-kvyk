using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace products_katalog.Controllers
{
    public static class ControllerBaseExtentions
    {
        public static async Task<ActionResult<T>> ExecuteWithOkResponse<T>(this ControllerBase controller, Func<Task<T>> func)
        {
			try
			{
				return controller.Ok(await func());
			}
			catch (Exception e)
			{
				switch (e.Message)
				{
					case "400": return controller.BadRequest("Bad Request!");
					case "401": return controller.Unauthorized("Unauthorized");
					case "404": return controller.NotFound("Not Found!");
					case "404 P": return controller.NotFound("Product Not Found!");
					case "404 U": return controller.NotFound("User Not Found!");
					default: throw;
				}
			}
        }

        public static int GetUserId(this ControllerBase controller)
        {
            var idClaim = controller.User.FindFirst(ClaimTypes.NameIdentifier);

            if (idClaim == null)
                throw new Exception("401");

            int id;

            try
            {
                id = Convert.ToInt32(idClaim.Value);
            }
            catch (Exception)
            {
                throw new Exception("401");
            }

            return id;
        }

    }
}
