using System;
using System.Linq;
using System.Collections.Generic;
using ArtHub.Models;

namespace ArtHub.Filters
{
    public class ArtworkFilter
    {
        public int? SellerId { get; set; }
        public List<int>? CategoryIds { get; set; }
        public StatusType? Status { get; set; }

        public IQueryable<Artwork> ApplyFilter(IQueryable<Artwork> query)
        {
            if (SellerId != null)
            {
                query = query.Where(a => a.SellerId == SellerId);
            }

            if (CategoryIds != null && CategoryIds.Any())
            {
                query = query.Where(a => CategoryIds.Contains(a.CategoryId));
            }

            if (Status != null)
            {
                query = query.Where(a => a.Status == Status.ToString());
            }

            return query;
        }
    }
}