using System;
namespace ArtHub.dto
{
	public class CreateBidDto
	{
        public required int BidderId { get; set; }
        public required int ArtworkId { get; set; }
        public required double BidAmount { get; set; }

    }
}

