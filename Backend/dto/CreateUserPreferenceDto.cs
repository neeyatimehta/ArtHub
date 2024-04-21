using System;
namespace ArtHub.dto
{
    public class CreateUserPreferenceDto
    {
        public List<int> CategoryIds { get; set; }
        public int UserId { get; set; }
    }
}

