using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ballotbox.Models;
using Microsoft.Extensions.Logging;
using Microsoft.Data.Entity;

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
                                     .Include(p => p.Choices).ToList();

            } catch (Exception ex)
            {
                _logger.LogError("Could not get polls from database", ex);
                return null;
            }
        }

        public bool SaveAll()
        {
            return _context.SaveChanges() > 0;
        }
    }
}
