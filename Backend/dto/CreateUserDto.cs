﻿using System;
namespace ArtHub.dto
{
	public class CreateUserDto
	{
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Mobile { get; set; }
        public IFormFile ImageFile { get; set; }
        public string ProfilePictureUrl { get; set; }
        public string Gender { get; set; }
        public DateTime BirthDate { get; set; }
        public string City { get; set; }
        public string Province { get; set; }
        public string Country { get; set; }
        public string PostalCode { get; set; }

    }

}

