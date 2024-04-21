using System;
using ArtHub.dto;
using ArtHub.Filters;
using ArtHub.Models;
using ArtHub.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArtHub.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class BidController : ControllerBase
    {
        private readonly BidService _bidService;
        private readonly ILogger<BidController> _logger; 

        public BidController(BidService bidService, ILogger<BidController> logger) 
        {
            _bidService = bidService;
            _logger = logger;
        }

        [HttpPost]
        public ActionResult CreateBid([FromBody] CreateBidDto dto)
        {
            try
            {
                _logger.LogInformation("Creating bid");

                if (dto == null)
                {
                    _logger.LogWarning("Invalid bid data received");
                    return BadRequest("Bad Bid Data");
                }

                Bid bid = new Bid(dto.BidderId, dto.ArtworkId, dto.BidAmount, DateTime.Now, "false");

                if (bid.Validate().isValid)
                {
                    bid = _bidService.CreateBid(bid);
                    _logger.LogInformation($"Bid created successfully with ID: {bid.Id}");
                    return Ok(bid);
                }
                else
                {
                    _logger.LogWarning($"Failed to create bid: {bid.Validate().errorMessage}");
                    return BadRequest(bid.Validate().errorMessage);
                }
            }
            catch(InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating bid: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("filter")]
        public ActionResult BidFilter([FromBody] BidFilter filter)
        {
            try
            {
                _logger.LogInformation("Filtering bids");

                List<BidResponse> bids = _bidService.filter(filter);
                _logger.LogInformation($"Filtered {bids.Count} bids");
                return Ok(bids);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error filtering bids: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
