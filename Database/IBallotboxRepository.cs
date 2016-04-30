﻿using Ballotbox.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ballotbox.Database
{
    public interface IBallotboxRepository
    {
        IEnumerable<Poll> GetAllPolls();
        void AddPoll(Poll newPoll);
        bool SaveAll();
    }
}