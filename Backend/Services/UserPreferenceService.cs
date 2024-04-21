using System;
using ArtHub.dto;
using ArtHub.Models;

namespace ArtHub.Services
{
    public interface UserPreferenceService
    {
        UserPreference CreateUserPreference(UserPreference createdUserPreference);
        UserPreference DeleteUserPreferenceById(int id);
        List<int> GetCategoryIdsByUserId(int id);
        UserPreference GetUserPreferenceById(int id);
        List<UserPreferenceResponse> GetUserPreferencesByUserId(int id);
    }
}

