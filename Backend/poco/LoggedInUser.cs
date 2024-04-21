using System;
using System.ComponentModel.DataAnnotations;
using System.Reflection;
using ArtHub.Models;
using Microsoft.AspNetCore.Http.HttpResults;

namespace ArtHub.poco
{
    public class LoggedInUser
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public string ProfilePictureUrl { get; set; }
        public string Gender { get; set; }
        public DateTime BirthDate { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime LastUpdatedOn { get; set; }
        public string FirstLogin { get; set; }
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime TokenCreated { get; set; }
        public DateTime TokenExpires { get; set; }


        public LoggedInUser() { }
        public LoggedInUser(User user)
        {
            Id = user.Id;
            FirstName = user.FirstName;
            LastName = user.LastName;
            Username = user.Username;
            Email = user.Email;
            Mobile = user.Mobile;
            ProfilePictureUrl = user.ProfilePictureUrl;
            Gender = user.Gender;
            BirthDate = user.BirthDate;
            FirstLogin = user.FirstLogin;
        }
    }

}

