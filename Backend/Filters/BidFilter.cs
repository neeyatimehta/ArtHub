using System;
using System.Net.NetworkInformation;
using ArtHub.dto;
using ArtHub.Models;

namespace ArtHub.Filters
{
	public class BidFilter
	{
        public int? BidderId { get; set; }
        public int? ArtworkId { get; set; }
        public string? Successful { get; set; }
        public IQueryable<Bid> ApplyFilter(IQueryable<Bid> query)
        {

            if (BidderId != null)
            {
                query = query.Where(a => a.BidderId == BidderId);

            }

            if (ArtworkId != null)
            {
                query = query.Where(a => a.ArtworkId == ArtworkId);
            }

            if (Successful != null)
            {
                query = query.Where(a => a.Successful == Successful);
            }

            return query;
        }

    }
}

