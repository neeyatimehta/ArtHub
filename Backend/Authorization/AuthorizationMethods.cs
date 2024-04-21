using System;
using System.Security.Claims;
using ArtHub.poco;

namespace ArtHub.Authorization
{
	public class AuthorizationMethods
	{
        public static LoggedInUser BuildLoggedInUser(IEnumerable<Claim> userClaims)
        {     
            var userIdClaim = userClaims.FirstOrDefault(c => c.Type == "id")?.Value;
            var usernameClaim = userClaims.FirstOrDefault(c => c.Type == "username")?.Value;
            var emailClaim = userClaims.FirstOrDefault(c => c.Type == "email")?.Value;
            var genderClaim = userClaims.FirstOrDefault(c => c.Type == "gender")?.Value;
            var mobileClaim = userClaims.FirstOrDefault(c => c.Type == "mobile")?.Value;
            var birthDateClaim = userClaims.FirstOrDefault(c => c.Type == "birthDate")?.Value;
            var lastNameClaim = userClaims.FirstOrDefault(c => c.Type == "lastName")?.Value;
            var firstNameClaim = userClaims.FirstOrDefault(c => c.Type == "firstName")?.Value;


            var loggedInUser = new LoggedInUser
            {
                Id = int.Parse(userIdClaim),
                FirstName = firstNameClaim,
                LastName = lastNameClaim,
                Username = usernameClaim,
                Email = emailClaim,
                Mobile = mobileClaim,
                Gender = genderClaim,
                BirthDate = DateTime.Parse(birthDateClaim),
            };

            return loggedInUser;

        }

    }
}

