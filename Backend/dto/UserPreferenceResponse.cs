using System;
namespace ArtHub.dto
{
	public class UserPreferenceResponse
	{
        public int Id { get; set; }
        public int CategoryId { get; set; }
        public String CategoryName { get; set; }
        public int UserId { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime LastUpdatedOn { get; set; }
	}
}

