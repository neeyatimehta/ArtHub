using ArtHub.dto;
using ArtHub.Filters;
using ArtHub.Models;
using Microsoft.EntityFrameworkCore;

namespace ArtHub.Services.ServicesImpl
{
    public class ArtworkServiceImpl : ArtworkService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public ArtworkServiceImpl(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;

        }

        public Artwork CreateArtwork(Artwork createdArtwork)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                createdArtwork = context.Artworks.Add(createdArtwork).Entity;

                context.SaveChanges();

                return createdArtwork;
            }
        }

        public List<ArtworkResponse> filter(ArtworkFilter filter)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                IQueryable<Artwork> query = context.Artworks;

                query = filter.ApplyFilter(query);

                List<ArtworkResponse> filteredArtworks = query
                    .Select(a => new ArtworkResponse
                    {
                        Id = a.Id,
                        Title = a.Title,
                        Description = a.Description,
                        ImageUrl = a.ImageUrl,
                        MinimumBid = a.MinimumBid,
                        Live = a.Live,
                        SellerId = a.SellerId,
                        CategoryId = a.CategoryId,
                        CreatedOn = a.CreatedOn,
                        LastUpdatedOn = a.LastUpdatedOn,
                        LiveStartTime = a.LiveStartTime,
                        CurrentHighestBid = a.CurrentHighestBid,
                        Status = a.Status,
                        CategoryName = GetCategoryName(context, a.CategoryId),
                        SellerName = GetSellerName(context, a.SellerId)
                    })
                    .ToList();

                return filteredArtworks;
            }
        }

/*
        //public List<Artwork> GetAllArtworks()
        //{
        //    using (var scope = _scopeFactory.CreateScope())
        //    {
        //        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        //        List<Artwork> artworks = context.Artworks.ToList();

        //        return artworks;

        //    }
        //}
*/
        public List<ArtworkResponse> GetAllArtworks()
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                List<ArtworkResponse> artworks = context.Artworks
                    .Select(a => new ArtworkResponse
                    {
                        Id = a.Id,
                        Title = a.Title,
                        Description = a.Description,
                        ImageUrl = a.ImageUrl,
                        MinimumBid = a.MinimumBid,
                        Live = a.Live,
                        SellerId = a.SellerId,
                        CategoryId = a.CategoryId,
                        CreatedOn = a.CreatedOn,
                        LastUpdatedOn = a.LastUpdatedOn,
                        LiveStartTime = a.LiveStartTime,
                        CurrentHighestBid = a.CurrentHighestBid,
                        Status = a.Status,
                        CategoryName = GetCategoryName(context, a.CategoryId),
                        SellerName = GetSellerName(context, a.SellerId) 
                    })
                    .ToList();

                return artworks;
            }
        }

        private static string GetSellerName(AppDbContext context, int sellerId)
        {
            var seller = context.Users.FirstOrDefault(s => s.Id == sellerId);
            return seller != null ? seller.FirstName + " " + seller.LastName : null;
        }

        private static string GetCategoryName(AppDbContext context, int categoryId)
        {
            var category = context.Categories.FirstOrDefault(c => c.Id == categoryId);
            return category != null ? category.Title : null;
        }


        public ArtworkResponse GetArtworkById(int id)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                ArtworkResponse artworkResponse = context.Artworks
                    .Where(a => a.Id == id)
                    .Select(a => new ArtworkResponse
                    {
                        Id = a.Id,
                        Title = a.Title,
                        Description = a.Description,
                        ImageUrl = a.ImageUrl,
                        MinimumBid = a.MinimumBid,
                        Live = a.Live,
                        SellerId = a.SellerId,
                        CategoryId = a.CategoryId,
                        CreatedOn = a.CreatedOn,
                        LastUpdatedOn = a.LastUpdatedOn,
                        LiveStartTime = a.LiveStartTime,
                        CurrentHighestBid = a.CurrentHighestBid,
                        Status = a.Status,
                        CategoryName = GetCategoryName(context, a.CategoryId),
                        SellerName = GetSellerName(context, a.SellerId)
                    })
                    .FirstOrDefault();

                return artworkResponse;
            }
        }


        public Artwork StartAuction(int id)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                Artwork selectedArtwork = new Artwork(GetArtworkById(id));
                if (selectedArtwork.Live == "false" && selectedArtwork.Status == StatusType.Draft.ToString())
                {
                    selectedArtwork.Live = "true";
                    selectedArtwork.Status = StatusType.Active.ToString();
                    selectedArtwork.LiveStartTime = DateTime.Now;
                    context.Entry(selectedArtwork).State = EntityState.Modified;
                    context.SaveChanges();
                }

               

                return selectedArtwork;
            }


        }

        public Artwork StopAuction(int id)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                Artwork selectedArtwork = new Artwork(GetArtworkById(id));
                if (selectedArtwork.Live=="true")
                {
                    selectedArtwork.Live = "false";
                    selectedArtwork.Status = StatusType.Sold.ToString();
                    context.Entry(selectedArtwork).State = EntityState.Modified;

                }
              

                context.SaveChanges();
                return selectedArtwork;

            }



        }

        public Artwork UpdateArtwork(UpdateArtworkDto artworkDto, Artwork existingArtwork)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                if (!context.Artworks.Local.Contains(existingArtwork))
                {
                    context.Artworks.Attach(existingArtwork);
                }

                existingArtwork.Title = artworkDto.Title;
                existingArtwork.Description = artworkDto.Description;
                existingArtwork.ImageUrl = artworkDto.ImageUrl;
                existingArtwork.MinimumBid = artworkDto.MinimumBid;
                existingArtwork.CategoryId = artworkDto.CategoryId;
                existingArtwork.LastUpdatedOn = DateTime.Now;

                context.SaveChanges();

            }

            return existingArtwork;
        }
    }
}