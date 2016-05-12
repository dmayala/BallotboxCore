using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ballotbox.Models
{
    public class Choice
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<Vote> Votes { get; set; } = new List<Vote>();
    }
}
