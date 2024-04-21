using System;
using ArtHub.dto;
using ArtHub.Models;
using ArtHub.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArtHub.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly CategoryService _categoryService;
        private readonly ILogger<CategoryController> _logger; 

        public CategoryController(CategoryService categoryService, ILogger<CategoryController> logger) 
        {
            _categoryService = categoryService;
            _logger = logger; 
        }

        [HttpPost]
        public ActionResult CreateCategory([FromBody] CreateCategoryDto dto)
        {
            try
            {
                _logger.LogInformation("Creating category");

                if (dto == null)
                {
                    _logger.LogWarning("Invalid category data received");
                    return BadRequest("Invalid category data");
                }

                Category category = new Category
                {
                    Title = dto.Title,
                    CreatedOn = DateTime.Now,
                    CreatedBy = dto.CreatedBy
                };

                if (category.Validate().isValid)
                {
                    category = _categoryService.CreateCategory(category);
                    _logger.LogInformation($"Category created successfully with ID: {category.Id}");
                    return Ok(category);
                }
                else
                {
                    _logger.LogWarning($"Failed to create category: {category.Validate().errorMessage}");
                    return BadRequest(category.Validate().errorMessage);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating category: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id:int}")]
        public ActionResult GetCategoryById(int id)
        {
            try
            {
                _logger.LogInformation($"Fetching category with ID: {id}");

                Category category = _categoryService.GetCategoryById(id);

                if (category == null)
                {
                    _logger.LogWarning($"Category with ID {id} not found");
                    return NotFound();
                }

                _logger.LogInformation($"Category with ID {id} fetched successfully");
                return Ok(category);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching category: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet, AllowAnonymous]
        public ActionResult GetAllCategories()
        {
            try
            {
                _logger.LogInformation("Fetching all categories");

                List<Category> categories = _categoryService.GetAllCategories();

                _logger.LogInformation($"Fetched {categories.Count} categories");
                return Ok(categories);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching all categories: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut]
        public ActionResult UpdateCategory([FromBody] UpdateCategoryDto dto)
        {
            try
            {
                _logger.LogInformation($"Updating category with ID: {dto?.Id}");

                if (dto == null)
                {
                    _logger.LogWarning("Invalid category data received for update");
                    return BadRequest("Invalid category data");
                }

                Category existingCategory = _categoryService.GetCategoryById(dto.Id);

                if (existingCategory == null)
                {
                    _logger.LogWarning($"Category with ID {dto.Id} not found for update");
                    return NotFound("Category not found");
                }

                Category updatedCategory = _categoryService.UpdateCategory(dto, existingCategory);

                _logger.LogInformation($"Category with ID {dto.Id} updated successfully");
                return Ok(updatedCategory);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating category: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        
    }
}
