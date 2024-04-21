using System;
using ArtHub.dto;
using ArtHub.Filters;
using ArtHub.Models;

namespace ArtHub.Services
{
    public interface ArtworkService
    {
        Artwork CreateArtwork(Artwork createdArtwork);
        List<ArtworkResponse> filter(ArtworkFilter filter);
        List<ArtworkResponse> GetAllArtworks();
        ArtworkResponse GetArtworkById(int id);
        Artwork StartAuction(int id);
        Artwork StopAuction(int id);
        Artwork UpdateArtwork(UpdateArtworkDto artworkDto, Artwork existingArtwork);
    }
}

