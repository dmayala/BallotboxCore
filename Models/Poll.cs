using Ballotbox.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ballotbox.Models
{
    public class Poll
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public BallotboxUser User { get; set; }
        public virtual ICollection<Choice> Choices { get; set; }
    }
}
