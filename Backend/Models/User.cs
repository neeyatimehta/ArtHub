using System.ComponentModel.DataAnnotations;
using System.Diagnostics.Metrics;
using System.Text.RegularExpressions;

namespace ArtHub.Models
{
    public class User
    {

        [Key] public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Mobile { get; set; }
        public string ProfilePictureUrl { get; set; }
        public string Gender { get; set; }
        public DateTime BirthDate { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime LastUpdatedOn { get; set; }
        public string City { get; set; }
        public string Province { get; set; }
        public string Country { get; set; }
        public string PostalCode { get; set; }
        public string FirstLogin { get; set; }


        public User(string firstName, string lastName, string username, string email, string password,
                string mobile, string profilePictureUrl, string gender, DateTime birthDate, DateTime createdOn, DateTime lastUpdatedOn,
            string city, string province, string country, string postalCode, string firstLogin)
        {
            FirstName = firstName;
            LastName = lastName;
            Username = username;
            Email = email;
            Password = password;
            Mobile = mobile;
            ProfilePictureUrl = profilePictureUrl;
            Gender = gender;
            BirthDate = birthDate;
            CreatedOn = createdOn;
            LastUpdatedOn = lastUpdatedOn;
            City = city;
            Province = province;
            Country = country;
            PostalCode = postalCode;
            FirstLogin = firstLogin;
        }

        public (bool isValid, string errorMessage) Validate()
        {
            if (!IsValidString(FirstName) || !IsValidString(LastName) || !IsValidString(City) || !IsValidString(Province) || !IsValidString(Country))
                return (false, "Invalid characters in last name, first name, city, province/state, or country");

            //if (!IsValidPhoneNumber(Mobile))
            //    return (false, "Invalid phone number.");

            if (Country == "USA" || Country == "Canada")
            {
                if ((Country.Equals("Canada") && !IsValidCanadianPostalCode(PostalCode)) ||
                    (Country.Equals("USA") && !IsValidUSZipCode(PostalCode)))
                    return (false, "Invalid postal code.");

                if ((Country.Equals("Canada") || Country.Equals("USA")) && !IsValidCanadaUSPhoneNumber(Mobile))
                    return (false, "Invalid phone number.");
            }

            if (!IsValidEmail(Email))
                return (false, "Invalid email address.");

            return (true, "");
        }

        private bool IsValidCanadaUSPhoneNumber(string mobile)
        {
            string pattern = @"^(?:\+?1\s*(?:[.-]\s*)?)?\(?([2-9][0-8][0-9])\)?[-.\s]?([2-9][0-9]{2})[-.\s]?([0-9]{4})$";
            return Regex.IsMatch(mobile, pattern);
        }

        private bool IsValidString(string input)
        {
            string disallowedChars = ";:!@#$%^*+?\\/<>1234567890";

            return !input.Intersect(disallowedChars).Any();
        }


        private bool IsValidCanadianPostalCode(string postalCode)
        {
            string pattern = @"^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$";
            return Regex.IsMatch(postalCode, pattern);
        }

        private bool IsValidUSZipCode(string zipCode)
        {
            string pattern = @"^\d{5}(?:[-\s]\d{4})?$";
            return Regex.IsMatch(zipCode, pattern);
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        private bool IsValidPhoneNumber(string phoneNumber)
        {
            return Regex.IsMatch(phoneNumber, @"^\d{10}$");
        }

        

    }

}