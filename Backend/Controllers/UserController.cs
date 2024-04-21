using ArtHub.dto;
using ArtHub.Models;
using ArtHub.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

namespace ArtHub.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly IWebHostEnvironment _hostEnvironment;

        public UserController(UserService userService, IWebHostEnvironment hostEnvironment)
        {
            _userService = userService;
            this._hostEnvironment = hostEnvironment;
        }

        [HttpGet("{id:int}")]
        public ActionResult Get(int id)
        {
            User user = _userService.GetUserById(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpPost, AllowAnonymous]
        public async Task<ActionResult> CreateUserAsync(
            [FromForm] string FirstName,
            [FromForm] string LastName,
            [FromForm] string Username,
            [FromForm] string Email,
            [FromForm] string Password,
            [FromForm] string Mobile,
            [FromForm] IFormFile ImageFile,
            [FromForm] string Gender,
            [FromForm] DateTime BirthDate,
            [FromForm] string City,
            [FromForm] string Province,
            [FromForm] string Country,
            [FromForm] string PostalCode
            )
        {
            CreateUserDto userDto = new CreateUserDto();
            userDto.FirstName = FirstName;
            userDto.LastName = LastName;
            userDto.Username = Username;
            userDto.Email = Email;
            userDto.Password = Password;
            userDto.Mobile = Mobile;
            userDto.ImageFile = ImageFile;
            userDto.Gender = Gender;
            userDto.BirthDate = BirthDate;
            userDto.City = City;
            userDto.Province = Province;
            userDto.Country = Country;
            userDto.PostalCode = PostalCode;

            if (userDto == null)
            {
                return BadRequest("Invalid user data");
            }
            userDto.ProfilePictureUrl = await SaveImage(userDto.ImageFile);

            User createdUser = new User( userDto.FirstName, userDto.LastName, userDto.Username, userDto.Email, userDto.Password, userDto.Mobile, userDto.ProfilePictureUrl, userDto.Gender, userDto.BirthDate, DateTime.Now, DateTime.Now, userDto.City, userDto.Province, userDto.Country, userDto.PostalCode,"true");
            try
            {
                if (createdUser.Validate().isValid)
                {
                    createdUser = _userService.CreateUser(createdUser);
                    return Ok(createdUser);
                }
                else
                {
                    return BadRequest(createdUser.Validate().errorMessage);
                }
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUserAsync(
            [FromForm] int Id,
            [FromForm] string FirstName,
            [FromForm] string LastName,
            [FromForm] string Username,
            [FromForm] string Email,
            [FromForm] string Password,
            [FromForm] string Mobile,
            [FromForm] IFormFile ImageFile,
            [FromForm] string Gender,
            [FromForm] DateTime BirthDate,
            [FromForm] string City,
            [FromForm] string Province,
            [FromForm] string Country,
            [FromForm] string PostalCode)
        {
            UpdateUserDto userDto = new UpdateUserDto();
            userDto.FirstName = FirstName;
            userDto.LastName = LastName;
            userDto.Username = Username;
            userDto.Email = Email;
            userDto.Password = Password;
            userDto.Mobile = Mobile;
            userDto.ImageFile = ImageFile;
            userDto.Gender = Gender;
            userDto.BirthDate = BirthDate;
            userDto.City = City;
            userDto.Province = Province;
            userDto.Country = Country;
            userDto.PostalCode = PostalCode;

            if (userDto == null)
            {
                return BadRequest("Invalid user data");
            }
            if (userDto.Id == 0)
            {
                return BadRequest("No Id Added");
            }

            User oldUser = _userService.GetUserById(userDto.Id);

            if (oldUser == null)
            {
                return NotFound("User not Found");
            }
            userDto.ProfilePictureUrl = await SaveImage(userDto.ImageFile);


            User newUser = _userService.UpdateUser(userDto, oldUser);

            return Ok(newUser);
        }

        [HttpDelete("{id:int}")]
        public ActionResult DeleteUser(int id)
        {
            try
            {
                _userService.DeleteUser(id);
                return Ok("User deleted successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error deleting user: {ex.Message}");
            }
        }

        [HttpGet]
        public ActionResult GetAll()
        {
            List<User> users = _userService.GetAllUsers();
            return Ok(users);
        }

        [NonAction]
        public async Task<string> SaveImage(IFormFile image)
        {
            string imageName = new String(Path.GetFileNameWithoutExtension(image.FileName).Take(10).ToArray()).Replace(" ", "-");
            imageName = imageName + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(image.FileName);
            var relativeImagePath = Path.Combine("Images", imageName);

            var webRootPath = _hostEnvironment.WebRootPath;

            var imagePath = Path.Combine(webRootPath, relativeImagePath);

            using (var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                await image.CopyToAsync(fileStream);
            }
            var imageUrl = "/" + relativeImagePath.Replace("\\", "/");
            return imageUrl;
        }
    }
}
