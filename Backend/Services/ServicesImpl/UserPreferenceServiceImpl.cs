using System;
using System.Security.Cryptography;
using ArtHub.dto;
using ArtHub.Models;

namespace ArtHub.Services.ServicesImpl
{
	public class UserPreferenceServiceImpl : UserPreferenceService
	{
        private readonly IServiceScopeFactory _scopeFactory;

        public UserPreferenceServiceImpl(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }
        public UserPreference CreateUserPreference(UserPreference createdUserPreference)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                createdUserPreference = context.UserPreferences.Add(createdUserPreference).Entity;
                context.SaveChanges();
                return createdUserPreference;
            }
                 
        }

        public List<int> GetCategoryIdsByUserId(int id)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                var categoryIds = context.UserPreferences
                                              .Where(up => up.UserId == id)
                                              .Select(up => up.CategoryId)
                                              .ToList();

                return categoryIds;
            }
        }

        public UserPreference GetUserPreferenceById(int id)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                UserPreference userPreference = context.UserPreferences.Find(id);

                return userPreference;

            }
        }

        public List<UserPreferenceResponse> GetUserPreferencesByUserId(int id)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                var userPreferences = context.UserPreferences.Where(up => up.UserId == id).
                    Select(a => new UserPreferenceResponse
                {
                    Id = a.Id,
                    CategoryId = a.CategoryId,
                    CreatedOn = a.CreatedOn,
                    LastUpdatedOn = a.LastUpdatedOn,
                    CategoryName = GetCategoryName(context, a.CategoryId),
                }).ToList();

                return userPreferences;

            }
        }

        private static string GetCategoryName(AppDbContext context, int categoryId)
        {
            var category = context.Categories.FirstOrDefault(c => c.Id == categoryId);
            return category != null ? category.Title : null;
        }

        public UserPreference DeleteUserPreferenceById(int id)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                UserPreference userPreferenceToDelete = context.UserPreferences.Find(id);
                if (userPreferenceToDelete != null)
                {
                    context.UserPreferences.Remove(userPreferenceToDelete);
                    context.SaveChanges();
                }
                return userPreferenceToDelete;
            }


        }
    }
}

