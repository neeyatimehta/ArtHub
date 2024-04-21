using System;
namespace ArtHub.dto
{
	public class ArtworkResponse
	{
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public double MinimumBid { get; set; }
        public string Live { get; set; }
        public int SellerId { get; set; }
        public int CategoryId { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime LastUpdatedOn { get; set; }
        public DateTime LiveStartTime { get; set; }
        public double CurrentHighestBid { get; set; }
        public String Status { get; set; }
        public string CategoryName { get; set; }
        public string SellerName { get; set; }
    }
}

