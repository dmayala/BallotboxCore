using Ballotbox.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ballotbox.Database
{
    public interface IBallotboxRepository
    {
        IEnumerable<Poll> GetAllPolls();
        IEnumerable<Poll> GetAllPollsByUserId(string userId);
        Poll GetPollById(int pollId);
        void AddPoll(Poll newPoll);
        void RemovePollById(int pollId);
        void AddVote(int choiceId, Vote newVote);
        bool SaveAll();
    }
}
