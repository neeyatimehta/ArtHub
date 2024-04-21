
using ArtHub.dto;
using ArtHub.Filters;
using ArtHub.Models;
using ArtHub.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace ArtHub.Controllers
{

    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class ArtworkController : ControllerBase
    {
        private readonly ArtworkService _artworkService;
        private readonly BidService _bidService;
        private readonly IWebHostEnvironment _hostEnvironment;
        private readonly ILogger<ArtworkController> _logger;
        private readonly UserPreferenceService _userPreferenceService;


        public ArtworkController(ArtworkService artworkService, ILogger<ArtworkController> logger, BidService bidService, UserPreferenceService userPreferenceService, IWebHostEnvironment hostEnvironment)
        {
            _artworkService = artworkService;
            _logger = logger;
            _bidService = bidService;
            this._hostEnvironment = hostEnvironment;
            _userPreferenceService = userPreferenceService;
        }

        [HttpGet("{id:int}"),AllowAnonymous]
        public ActionResult GetArtworkById(int id)
        {
            try
            {
                _logger.LogInformation($"Getting artwork by ID: {id}");

                ArtworkResponse artwork = _artworkService.GetArtworkById(id);

                if (artwork == null)
                {
                    _logger.LogWarning($"Artwork with ID {id} not found");
                    return NotFound();
                }

                return Ok(artwork);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting artwork by ID {id}: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        public async Task<ActionResult> CreateArtworkAsync(
            [FromForm] string title,
            [FromForm] string description,
            [FromForm] IFormFile imageFile,
            [FromForm] double minimumBid,
            [FromForm] int sellerId,
            [FromForm] int categoryId
            )
        {
            CreateArtworkDto artworkDto = new CreateArtworkDto();
            artworkDto.Title = title;
            artworkDto.Description = description;
            artworkDto.ImageFile = imageFile;
            artworkDto.ImageUrl = "";
            artworkDto.MinimumBid = minimumBid;
            artworkDto.SellerId = sellerId;
            artworkDto.CategoryId = categoryId;
            try
            {
                _logger.LogInformation("Creating artwork");

                if (artworkDto == null)
                {
                    _logger.LogWarning("Invalid artwork data received");
                    return BadRequest("Invalid artwork data");
                }

                artworkDto.ImageUrl = await SaveImage(artworkDto.ImageFile);

                Artwork createdArtwork = new Artwork(artworkDto.Title, artworkDto.Description, artworkDto.ImageUrl, artworkDto.MinimumBid, "false", artworkDto.SellerId, artworkDto.CategoryId, DateTime.Now, DateTime.Now, 0, StatusType.Draft.ToString());

                if (createdArtwork.Validate().isValid)
                {
                    createdArtwork = _artworkService.CreateArtwork(createdArtwork);
                    _logger.LogInformation($"Artwork created successfully with ID: {createdArtwork.Id}");
                    return Ok(createdArtwork);
                }
                else
                {
                    _logger.LogWarning($"Failed to create artwork: {createdArtwork.Validate().errorMessage}");
                    return BadRequest(createdArtwork.Validate().errorMessage);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating artwork: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }

        }

        [HttpPut]
        public async Task<ActionResult> UpdateArtworkAsync(
            [FromForm] int Id,
            [FromForm] string title,
            [FromForm] string description,
            [FromForm] IFormFile imageFile,
            [FromForm] double minimumBid,
            [FromForm] int categoryId
            )
        {
            UpdateArtworkDto artworkDto = new UpdateArtworkDto();
            artworkDto.Id = Id;
            artworkDto.Title = title;
            artworkDto.Description = description;
            artworkDto.ImageFile = imageFile;
            artworkDto.ImageUrl = "";
            artworkDto.MinimumBid = minimumBid;
            artworkDto.CategoryId = categoryId;

            try
            {
                _logger.LogInformation("Updating artwork");

                if (artworkDto == null)
                {
                    _logger.LogWarning("Invalid artwork data received");
                    return BadRequest("Invalid artwork data");
                }

                ArtworkResponse existingArtworkResponse = _artworkService.GetArtworkById(artworkDto.Id);

                if (existingArtworkResponse == null)
                {
                    _logger.LogWarning($"Artwork with ID {artworkDto.Id} not found for update");
                    return NotFound("Artwork not found");
                }

                Artwork existingArtwork = new Artwork(existingArtworkResponse);

                artworkDto.ImageUrl = await SaveImage(artworkDto.ImageFile);

                Artwork updatedArtwork = _artworkService.UpdateArtwork(artworkDto, existingArtwork);
                _logger.LogInformation($"Artwork updated successfully with ID: {updatedArtwork.Id}");
                return Ok(updatedArtwork);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating artwork: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet, AllowAnonymous]
        public ActionResult GetAllArtworks()
        {
            try
            {
                _logger.LogInformation("Getting all artworks");

                List<ArtworkResponse> artworks = _artworkService.GetAllArtworks();
               Console.Write($"Retrieved {artworks.Count} artworks: {JsonConvert.SerializeObject(artworks)}");

                _logger.LogInformation($"Retrieved {artworks.Count} artworks");
                return Ok(artworks);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting all artworks: {ex.Message}");
                return StatusCode(500, ex);
            }
        }


        [HttpPost("filter"), AllowAnonymous]

        public ActionResult ArtworkFilter([FromBody] ArtworkFilter filter)
        {
            try
            {
                _logger.LogInformation("Filtering artworks");

                List<ArtworkResponse> artworks = _artworkService.filter(filter);
                _logger.LogInformation($"Filtered {artworks.Count} artworks");
                return Ok(artworks);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error filtering artworks: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("startAuction/{id:int}")]
        public ActionResult StartAuction(int id)
        {
            try
            {
                _logger.LogInformation($"Starting auction for artwork ID: {id}");

                Artwork artwork = _artworkService.StartAuction(id);
                _logger.LogInformation($"Auction started successfully for artwork ID: {id}");
                return Ok(artwork);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error starting auction for artwork ID {id}: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("stopAuction/{id:int}")]
        public ActionResult StopAuction(int id)
        {
            try
            {
                _logger.LogInformation($"Stopping auction for artwork ID: {id}");

                Artwork artwork = _artworkService.StopAuction(id);
                _bidService.UpdateBidStatusByArtworkIdAndBidAmount(id, artwork.CurrentHighestBid);
                _logger.LogInformation($"Auction stopped successfully for artwork ID: {id}");
                return Ok(artwork);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error stoping auction for artwork ID {id}: {ex.Message}");
                return StatusCode(500, "Internal server error");

            }
        }

        [NonAction]
        public async Task<string> SaveImage(IFormFile image)
        {
            string imageName = new String(Path.GetFileNameWithoutExtension(image.FileName).Take(10).ToArray()).Replace(" ", "-");
            imageName = imageName + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(image.FileName);
            var relativeImagePath = Path.Combine("Images", imageName);

            var webRootPath = _hostEnvironment.WebRootPath;

            var imagePath = Path.Combine(webRootPath, relativeImagePath);

            using (var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                await image.CopyToAsync(fileStream);
            }
            var imageUrl = "/" + relativeImagePath.Replace("\\", "/");
            return imageUrl;
        }


        [HttpGet("user/{id:int}")]
        public ActionResult GetArtworksBasedOnUserId(int id)
        {
            try
            {
                _logger.LogInformation($"Fetching Artwork Based on User Preference for User: {id}");

                List<int> categoryIds = _userPreferenceService.GetCategoryIdsByUserId(id);
                ArtworkFilter filter = new ArtworkFilter();
                filter.CategoryIds = categoryIds;
                List<ArtworkResponse> artworks = _artworkService.filter(filter);

                return Ok(artworks);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching Artwork Based on User Preference for User: {id}: {ex.Message}");
                return StatusCode(500, "Internal server error");

            }
        }


    }

}

