using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace products_katalog.Services
{
    public class FileService
    {
        #region Private Properties

        private IConfiguration _configuration;
        private IWebHostEnvironment _appEnvironment;

        #endregion

        #region Constructor

        public FileService
        (
            IConfiguration configuration,
            IWebHostEnvironment appEnvironment
        )
        {
            _configuration = configuration;
            _appEnvironment = appEnvironment;
        }

        #endregion

        #region Methods

        public async Task<(string Name, string Link)> UploadFile(IFormFile file)
        {
            string path = _appEnvironment.WebRootPath + "/" + _configuration["FilesPath"] + "/";
            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);

            var guid = Guid.NewGuid();
            string extention = Path.GetExtension(file.FileName);

            var fileName = guid.ToString() + extention;
            var fileLink = path + fileName;
            var link = _configuration["FilesPath"] + "/" + fileName;

            using (var filestream = new FileStream(fileLink, FileMode.Create))
            {
                await file.CopyToAsync(filestream);
            }

            return (fileName, link);
        }

        public async Task<bool> DeleteFile(string link)
        {
            if (!Directory.Exists(link))
                return false;

            try
            {
                File.Delete(link);
            }
            catch (Exception)
            {
                return false;
            }

            return true;
        }

        #endregion
    }
}
