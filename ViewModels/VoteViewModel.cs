using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ballotbox.ViewModels
{
    public class VoteViewModel
    {
        public int Id { get; set; }
        public BallotboxUserViewModel User { get; set; }
    }
}
