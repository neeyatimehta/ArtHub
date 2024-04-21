using System;
namespace ArtHub.dto
{
	public class CreateTransactionDto
	{
        public required int BidId { get; set; }
        public bool SameAsUser { get; set; }
        public string? CardHolderFirstName { get; set; }
        public string? CardHolderLastName { get; set; }
        public string? City { get; set; }
        public string? Province { get; set; }
        public string? Country { get; set; }
        public string? PostalCode { get; set; }
        public string CardType { get; set; }
        public string CardNumber { get; set; }
        public string ExpiryDate { get; set; }
        public string CVV { get; set; }
    }
}

