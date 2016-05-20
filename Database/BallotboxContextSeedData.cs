using Ballotbox.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ballotbox.Database
{
    public class BallotboxContextSeedData
    {
        private BallotboxContext _context;
        private UserManager<BallotboxUser> _userManager;

        public BallotboxContextSeedData(BallotboxContext context, UserManager<BallotboxUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task EnsureSeedDataAsync()
        {
            if (await _userManager.FindByNameAsync("bobbytables") == null
                && await _userManager.FindByEmailAsync("bobbytables@example.com") == null)
            {
                // Add the user.
                var newUser = new BallotboxUser()
                {
                    UserName = "bobbytables",                 
                    Email = "bobbytables@example.com"
                };

                await _userManager.CreateAsync(newUser, "P@ssw0rd!");
            }

            if (!_context.Polls.Any())
            {
                // Add new data
                var cokeOrPepsiPoll = new Poll()
                {
                    Name = "Coke or Pepsi?",
                    User = await _userManager.FindByNameAsync("bobbytables"),
                    Choices = new List<Choice>()
                    {
                        new Choice() { Name = "Pepsi" },
                        new Choice() { Name = "Coke" },
                        new Choice() { Name = "Neither" }
                    }
                };

                _context.Polls.Add(cokeOrPepsiPoll);
                _context.Choices.AddRange(cokeOrPepsiPoll.Choices);

                _context.SaveChanges();
            }
        }
    }
}
