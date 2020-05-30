using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using products_katalog.Helpers;
using products_katalog.Models;
using products_katalog.Models.Products;
using products_katalog.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace products_katalog.Controllers.Admin
{
    [ApiController]
    [Authorize(Roles = Roles.Admin)]
    [Route("api/admin/products")]
    public class AdminProductsController : ControllerBase
    {
        #region Private Members

        private ProductService _productService;

        #endregion

        #region Constructor

        public AdminProductsController
        (
            ProductService productService
        )
        {
            _productService = productService;
        }

        #endregion

        #region API Calls

        /// <summary>
		/// Додати продукт
		/// </summary>
		/// <response code="200">Added</response>
		/// <response code="400">Bad model</response>
        [HttpPost]
        [Route("")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ProductModel>> AddProduct([FromBody]AddProductModel model)
        {
            return await this.ExecuteWithOkResponse(async () => await _productService.AddProduct(model));
        }
        
        /// <summary>
		/// Видалити продукт
		/// </summary>
		/// <response code="200">Deleted</response>
        [HttpDelete]
        [Route("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> DeleteProduct(int id)
        {
            return await this.ExecuteWithOkResponse(async () => await _productService.DeleteProduct(id));
        }

        /// <summary>
        /// Редагувати продукт
        /// </summary>
        /// <response code="200">Edited</response>
        /// <response code="400">Bad model</response>
        /// <response code="404">Product not found</response>
        [HttpPut]
        [Route("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductModel>> EditProduct(int id, [FromBody]AddProductModel model)
        {
            return await this.ExecuteWithOkResponse(async () => await _productService.EditProduct(id, model));
        }
        
        /// <summary>
        /// Додати зображення продукту
        /// </summary>
        /// <response code="200">Added</response>
        /// <response code="400">Bad model</response>
        /// <response code="404">Product not found</response>
        [HttpPost]
        [Route("image/{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductModel>> AddImage(int id, IFormFile image)
        {
            if (image == null)
                return BadRequest();

            return await this.ExecuteWithOkResponse(async () => await _productService.AddImage(id, image));
        }
        
        /// <summary>
        /// Видалити зображення продукту
        /// </summary>
        /// <response code="200">Added</response>
        /// <response code="400">Bad model</response>
        /// <response code="404">Product not found</response>
        [HttpPost]
        [Route("image/{id:int}/remove")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<bool>> RemoveImage(int id, [FromBody]StringModel model)
        {
            return await this.ExecuteWithOkResponse(async () => await _productService.RemoveImage(id, model.Value));
        }

        #endregion
    }
}
