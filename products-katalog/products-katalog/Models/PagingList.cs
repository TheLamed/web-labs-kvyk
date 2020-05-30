using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace products_katalog.Models
{
    public class PagingList<T>
    {
        public int TotalCount { get; set; }
        public List<T> Items { get; set; }
    }
}
