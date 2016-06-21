using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ballotbox.Models;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace Ballotbox.Database
{
    public class BallotboxRepository : IBallotboxRepository
    {
        private BallotboxContext _context;
        private ILogger<BallotboxRepository> _logger;

        public BallotboxRepository(BallotboxContext context, ILogger<BallotboxRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public void AddPoll(Poll newPoll)
        {
            _context.Polls.Add(newPoll);
        }

        public void RemovePollById(int pollId)
        {
            var poll = _context.Polls.Where(p => p.Id == pollId)
                                     .Include(p => p.Choices)
                                     .FirstOrDefault();
            _context.Polls.Remove(poll);
        }

        public IEnumerable<Poll> GetAllPolls()
        {
            try
            {
                return _context.Polls.Include(p => p.User)
                                     .Include(p => p.Choices).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError("Could not get polls from database", ex);
                return null;
            }
        }

        public IEnumerable<Poll> GetAllPollsByUserId(string userId)
        {
            try
            {
                return _context.Polls.Where(p => p.User.Id == userId)
                                     .Include(p => p.User)
                                     .Include(p => p.Choices).ThenInclude(c => c.Votes)
                                     .ToList();

            } catch (Exception ex)
            {
                _logger.LogError("Could not get polls from database", ex);
                return null;
            }
        }
        
        public Poll GetPollById(int pollId) {
            try {
                return _context.Polls.Include(p => p.Choices)
                                     .First(p => p.Id == pollId);
                
            } catch (Exception ex) {
                _logger.LogError("Could not get poll from database", ex);
                return null;
            }
        }

        public Poll GetRandomPoll(string userId)
        {
            try
            {
                var votedPolls = _context.Polls.Where(p => p.Choices.Any(
                                            c => c.Votes.Any(v => v.User.Id == userId))
                                         ).Select(p => p.Id).ToList();

                var unvotedPolls = _context.Polls.Include(p => p.Choices)
                                           .Where(p => !votedPolls.Contains(p.Id));

                int toSkip = new Random().Next(0, unvotedPolls.Count() - 1);

                return unvotedPolls.OrderBy(p => Guid.NewGuid()).Skip(toSkip).Take(1).First();
            }

            catch (Exception ex)
            {
                _logger.LogError("Could not get random poll from database", ex);
                return null;
            }
        }

        public void AddVote(int choiceId, Vote newVote) {
            try {
                var choice = _context.Choices.Include(c => c.Votes)
                                             .Where(c => c.Id == choiceId)
                                             .FirstOrDefault();
                choice.Votes.Add(newVote);
            } catch (Exception ex) {
                _logger.LogError("Could not add vote to database", ex);
            }        
        }

        public bool SaveAll()
        {
            return _context.SaveChanges() > 0;
        }
    }
}
