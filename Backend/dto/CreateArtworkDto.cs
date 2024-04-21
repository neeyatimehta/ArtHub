using ArtHub.Models;

namespace ArtHub.dto
{
    public class CreateArtworkDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public IFormFile ImageFile { get; set; }
        public string ImageUrl { get; set; }
        public double MinimumBid { get; set; }
        public int SellerId { get; set; }
        public int CategoryId { get; set; }
    }
}