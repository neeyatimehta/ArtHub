namespace ArtHub.Models
{
	public class Bid
	{
        public int Id { get; set; }
        public int BidderId { get; set; }
        public int ArtworkId { get; set; }
        public double BidAmount { get; set; }
        public DateTime CreatedOn { get; set; }
        public string  Successful { get; set; }

        
        public Bid( int bidderId, int artworkId, double bidAmount, DateTime createdOn, string successful)
        {
        
            BidderId = bidderId;
            ArtworkId = artworkId;
            BidAmount = bidAmount;
            CreatedOn = createdOn;
            Successful = successful;
        }


        public (bool isValid, string errorMessage) Validate()
        {

            if (BidAmount < 0)
            {
                return (false, "BidAmount must be a non-negative number.");
            }

            return (true, "");
        }

    }
}

