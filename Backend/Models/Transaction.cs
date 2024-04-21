using System;
using Microsoft.VisualBasic;
using System.Diagnostics.Metrics;
using System.Reflection;
using System.Text.RegularExpressions;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArtHub.Models
{
	public class Transaction
	{
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int BidId { get; set; }
        public string CardHolderFirstName { get; set; }
        public string CardHolderLastName { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string PostalCode { get; set; }
        [NotMapped]public string CardType { get; set; }
        [NotMapped] public string CardNumber { get; set; }
        [NotMapped] public string ExpiryDate { get; set; }
        [NotMapped] public string CVV { get; set; }

        public Transaction()
        {

        }

        public Transaction(int bidId, string cardHolderFirstName, string cardHolderLastName, string city, string state, string country, string postalCode, string cardType, string cardNumber, string expiryDate, string cvv)
        {
            BidId = bidId;
            CardHolderFirstName = cardHolderFirstName;
            CardHolderLastName = cardHolderLastName;
            City = city;
            State = state;
            Country = country;
            PostalCode = postalCode;
            CardType = cardType;
            CardNumber = cardNumber;
            ExpiryDate = expiryDate;
            CVV = cvv;
        }

        public (bool isValid, string errorMessage) Validate()
        {
            // Validate last name, first name, city, province/state, and credit card holder’s name
            if (ContainsInvalidCharacters(CardHolderFirstName) || ContainsInvalidCharacters(CardHolderLastName) || ContainsInvalidCharacters(City) || ContainsInvalidCharacters(State))
            {
                return (false,"Invalid characters found in last name, first name, city, province/state.");
            }

            // Validate postal code based on country
            if(Country == "USA" || Country == "Canada")
            {
                if ((Country.Equals("Canada") && !IsValidCanadianPostalCode(PostalCode)) ||
                    (Country.Equals("USA") && !IsValidUSZipCode(PostalCode)))
                    return (false, "Invalid postal code.");

               
            }

            // Validate credit card information
            if (!IsValidCreditCard())
            {
                return (false,"Invalid credit card information.");
            }

            return (true,"");
        }

        private bool ContainsInvalidCharacters(string value)
        {
            string invalidCharacters = ";:!@#$%^*+?\\/<>1234567890";

            return value?.IndexOfAny(invalidCharacters.ToCharArray()) >= 0;
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

        private bool IsValidCreditCard()
        {
            // Ensure the credit card number consists of digits only
            if (!Regex.IsMatch(CardNumber, @"^\d+$"))
            {
                return false;
            }

            switch (CardType)
            {
                case "MasterCard":
                    return IsValidMasterCard();
                case "Visa":
                    return IsValidVisa();
                case "American Express":
                    return IsValidAmericanExpress();
                default:
                    return false;
            }
        }

        private bool IsValidMasterCard()
        {
            // MasterCard prefix is 51-55, and length is 16
            return Regex.IsMatch(CardNumber, @"^5[1-5]\d{14}$");
        }

        private bool IsValidVisa()
        {
            // Visa prefix is 4, and length is 16
            return Regex.IsMatch(CardNumber, @"^4\d{15}$");
        }

        private bool IsValidAmericanExpress()
        {
            // American Express prefixes are 34 or 37, and length is 15
            return Regex.IsMatch(CardNumber, @"^3[47]\d{13}$");
        }

    }

}
    


