using System;
using System.Net.NetworkInformation;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;


namespace ArtHub.Models
{
	public class Category
	{
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key] public int Id { get; set; }
        public string Title { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }


        public Category()
        {
        }

        public Category( string title, DateTime createdOn, int createdBy)
        {
            Title = title;
            CreatedOn = createdOn;
            CreatedBy = createdBy;
        }

        public (bool isValid, string errorMessage) Validate()
        {

            if (string.IsNullOrWhiteSpace(Title))
            {
                return (false, "Title is required.");
            }

            return (true, "");
        }


    }
}

