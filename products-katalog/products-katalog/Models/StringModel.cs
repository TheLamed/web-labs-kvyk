using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace products_katalog.Models
{
    public class StringModel
    {
        [Required]
        public string Value { get; set; }
    }
}
