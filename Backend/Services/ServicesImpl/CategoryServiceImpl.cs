using System;
using System.Collections.Generic;
using System.Linq;
using ArtHub.dto;
using ArtHub.Models;
using Microsoft.Extensions.DependencyInjection;

namespace ArtHub.Services.ServicesImpl
{
    public class CategoryServiceImpl : CategoryService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public CategoryServiceImpl(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        public Category CreateCategory(Category category)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                Console.WriteLine($"Before adding to DbContext - Id: {category.Id}, Title: {category.Title}, CreatedOn: {category.CreatedOn}, CreatedBy: {category.CreatedBy}");
                context.Categories.Add(category);
                Console.WriteLine($"After adding to DbContext - Id: {category.Id}, Title: {category.Title}, CreatedOn: {category.CreatedOn}, CreatedBy: {category.CreatedBy}");

                context.SaveChanges();
                Console.WriteLine($"After adding to DbContext - Id: {category.Id}, Title: {category.Title}, CreatedOn: {category.CreatedOn}, CreatedBy: {category.CreatedBy}");

                return category;
            }
        }

        public List<Category> GetAllCategories()
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                List<Category> categoryList = context.Categories.ToList();
                return categoryList;
            }
        }

        public Category GetCategoryById(int id)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                Category category = context.Categories.Find(id);
                return category;
            }
        }

        public Category UpdateCategory(UpdateCategoryDto dto, Category existingCategory)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                if (existingCategory != null)
                {
                    if (!context.Categories.Local.Contains(existingCategory))
                    {
                        context.Categories.Attach(existingCategory);
                    }

                    existingCategory.Title = dto.Title;
                    context.SaveChanges();
                }

                return existingCategory;
            }
        }
    }
}
