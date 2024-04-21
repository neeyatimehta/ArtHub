using Microsoft.EntityFrameworkCore;


namespace ArtHub.Models
{
    public class AppDbContext : DbContext
    {
        private static AppDbContext _instance;

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }


        public static AppDbContext Instance(DbContextOptions<AppDbContext> options)
        {
            if (_instance == null)
            {
                _instance = new AppDbContext(options);
            }

            return _instance;
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Artwork> Artworks { get; set; }
        public DbSet<Bid> Bids { get; set; }
        public DbSet<UserPreference> UserPreferences { get; set; }
        public DbSet<Transaction> Transactions { get; set; }

    }
}