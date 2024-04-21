using System;
using ArtHub.dto;
using ArtHub.Models;

namespace ArtHub.Services
{
    public interface CategoryService
    {
        Category CreateCategory(Category category);
        List<Category> GetAllCategories();
        Category GetCategoryById(int id);
        Category UpdateCategory(UpdateCategoryDto dto, Category existingCategory);
    }
}

