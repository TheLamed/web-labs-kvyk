using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using products_katalog.Models;
using products_katalog.Models.Products;
using products_katalog.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace products_katalog.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductsController : ControllerBase
    {
        #region Private Members

        private ProductService _productService;

        #endregion

        #region Constructor

        public ProductsController
        (
            ProductService productService
        )
        {
            _productService = productService;
        }

        #endregion

        #region API Calls

        /// <summary>
        /// Отримати продукти
        /// </summary>
        /// <response code="200">Products list</response>
        [HttpGet]
        [Route("")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<PagingList<ProductModel>>> GetProducts
        (
            [FromQuery]int pn = 0,
            [FromQuery]int ps = 10,
            [FromQuery]string sort = null,
            [FromQuery]string sortDir = "asc",
            [FromQuery]string find = null,
            [FromQuery]bool onlyLikes = false
        )
        {
            var userId = 0;
            try
            {
                userId = this.GetUserId();
            }
            catch (Exception)
            {
            }

            return await this.ExecuteWithOkResponse(async () => await _productService.GetProducts(pn, ps, sort, sortDir, find, userId, onlyLikes));
        }

        #endregion
    }
}
