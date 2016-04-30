using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ballotbox.Models
{
    public class Vote
    {
        public int Id { get; set; }
        public BallotboxUser User { get; set; }
    }
}
