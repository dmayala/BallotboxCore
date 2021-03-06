﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ballotbox.ViewModels
{
    public class ChoiceViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<VoteViewModel> Votes { get; set; } = new List<VoteViewModel>();
    }
}
