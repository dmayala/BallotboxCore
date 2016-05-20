using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Ballotbox.Models;

namespace Ballotbox.Database
{
    public class BallotboxContext : IdentityDbContext<BallotboxUser>
    {
        public DbSet<Poll> Polls { get; set; }
        public DbSet<Choice> Choices { get; set; }
        public DbSet<Vote> Votes { get; set; }

        public BallotboxContext(DbContextOptions options) : base(options)
        {
            Database.EnsureCreated();
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);
        }
        
    }
}
