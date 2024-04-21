using System;
namespace ArtHub.dto
{
	public class BidResponse
	{
        public int Id { get; set; }
        public int BidderId { get; set; }
        public int ArtworkId { get; set; }
        public double BidAmount { get; set; }
        public DateTime CreatedOn { get; set; }
        public string Successful { get; set; }
        public string BidderName { get; set; }
        public BidResponse()
		{
		}
	}
}

