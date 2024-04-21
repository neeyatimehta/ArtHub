using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Net.NetworkInformation;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations.Schema;
using ArtHub.dto;

namespace ArtHub.Models
{
    public enum StatusType
    {
        Draft,
        Active,
        Sold,
        Archived
    }

    public class Artwork
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key] public int Id { get; set; }
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

        public Artwork(string title, string description, string imageUrl, double minimumBid, string live, int sellerId,
                   int categoryId, DateTime createdOn, DateTime lastUpdatedOn, double currentHighestBid, String status)
        {
            Title = title;
            Description = description;
            ImageUrl = imageUrl;
            MinimumBid = minimumBid;
            Live = live;
            SellerId = sellerId;
            CategoryId = categoryId;
            CreatedOn = createdOn;
            LastUpdatedOn = lastUpdatedOn;
            CurrentHighestBid = currentHighestBid;
            Status = status;
        }

        public Artwork()
        {
        }

        public Artwork(ArtworkResponse existingArtworkResponse)
        {
            Id = existingArtworkResponse.Id;
            Title = existingArtworkResponse.Title;
            Description = existingArtworkResponse.Description;
            ImageUrl = existingArtworkResponse.ImageUrl;
            MinimumBid = existingArtworkResponse.MinimumBid;
            Live = existingArtworkResponse.Live;
            SellerId = existingArtworkResponse.SellerId;
            CategoryId = existingArtworkResponse.CategoryId;
            CreatedOn = existingArtworkResponse.CreatedOn;
            LastUpdatedOn = existingArtworkResponse.LastUpdatedOn;
            LiveStartTime = existingArtworkResponse.LiveStartTime;
            CurrentHighestBid = existingArtworkResponse.CurrentHighestBid;
            Status = existingArtworkResponse.Status;
        }

        public (bool isValid, string errorMessage) Validate()
        {

            if (string.IsNullOrWhiteSpace(Title))
            {
                return (false, "Title is required.");
            }

            if (string.IsNullOrWhiteSpace(Description))
            {
                return (false, "Description is required.");
            }

            if (MinimumBid < 0)
            {
                return (false, "MinimumBid must be a non-negative number.");
            }

            return (true,"");
        }


    }

    
}

