﻿using Ballotbox.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Ballotbox.ViewModels
{
    public class PollViewModel
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public IEnumerable<Choice> Choices { get; set; }
    }
}
