using System;
using ArtHub.dto;
using ArtHub.Filters;
using ArtHub.Models;

namespace ArtHub.Services
{
    public interface BidService
    {
        Bid CreateBid(Bid bid);
        List<BidResponse> filter(BidFilter filter);
        Bid FindBidById(int id);
        void UpdateBidStatusByArtworkIdAndBidAmount(int id, double currentHighestBid);
    }
}

