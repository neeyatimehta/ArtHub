using System;
namespace ArtHub.Models
{
	public class UserPreference
	{
        public int Id { get; set; }
        public int CategoryId { get; set; }
        public int UserId { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime LastUpdatedOn { get; set; }

        public UserPreference(int categoryId, int userId, DateTime createdOn, DateTime lastUpdatedOn)
        {
            CategoryId = categoryId;
            UserId = userId;
            CreatedOn = createdOn;
            LastUpdatedOn = lastUpdatedOn;
        }
    }
}

