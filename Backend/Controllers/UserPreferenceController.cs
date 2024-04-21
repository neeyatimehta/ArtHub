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
    public class UserPreferenceController : ControllerBase
    {
        private readonly UserPreferenceService _userPreferenceService;

        public UserPreferenceController(UserPreferenceService userPreferenceService)
        {
            _userPreferenceService = userPreferenceService;
        }

        [HttpPost]
        public ActionResult CreateUserPreference([FromBody] CreateUserPreferenceDto userPreferenceDto)
        {
            if (userPreferenceDto == null)
            {
                return BadRequest("Invalid user preference data");
            }
            List<UserPreference> userPreferences = new List<UserPreference>();
            foreach(int catId in userPreferenceDto.CategoryIds)
            {
                UserPreference createdUserPreference = new UserPreference(catId, userPreferenceDto.UserId, DateTime.Now, DateTime.Now);

                createdUserPreference = _userPreferenceService.CreateUserPreference(createdUserPreference);
                userPreferences.Add(createdUserPreference);
            }

            return Ok(userPreferences);
        }

        [HttpGet("{id:int}")]
        public ActionResult GetUserPreference(int id)
        {
            UserPreference userPreference = _userPreferenceService.GetUserPreferenceById(id);

            if (userPreference == null)
            {
                return NotFound("User preference not found");
            }

            return Ok(userPreference);
        }

        [HttpGet("user/{id}")]
        public ActionResult GetAllUserPreferences(int id)
        {
            List<UserPreferenceResponse> userPreferences = _userPreferenceService.GetUserPreferencesByUserId(id);

            return Ok(userPreferences);
        }

        [HttpDelete("{id:int}")]
        public ActionResult DeleteUserPreference(int id)
        {
            UserPreference userPreference = _userPreferenceService.DeleteUserPreferenceById(id);

            if (userPreference == null)
            {
                return NotFound("User preference not found");
            }

            return Ok(userPreference);
        }
    }

}
