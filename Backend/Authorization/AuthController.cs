using ArtHub.dto;
using ArtHub.Models;
using ArtHub.poco;
using ArtHub.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Collections.Generic;
using ArtHub.Authorization;
using Microsoft.EntityFrameworkCore;

namespace ArtHub.Authorization
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly UserService _userService;
        private readonly IServiceScopeFactory _scopeFactory;

        public AuthController(IConfiguration configuration, UserService userService, IServiceScopeFactory scopeFactory)
        {
            _userService = userService;
            _configuration = configuration;
            _scopeFactory = scopeFactory;

        }



        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(UserLoginDto request)
        {
            User user = _userService.FindUserByIdentity(request.Identity);
            if(user == null)
            {
                return NotFound("User Not Found");
            }

            if(user.Password != request.Password)
            {
                return BadRequest("Wrong Password");
            }

            LoggedInUser loggedInUser = new(user);

            user.FirstLogin = "false";

            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                context.Entry(user).State = EntityState.Modified;
                context.SaveChanges();
            }


            var refreshToken = GenerateRefreshToken();
            SetRefreshToken(refreshToken, loggedInUser);

            string token = CreateToken(loggedInUser);

            

            return Ok(token);
        }

        private RefreshToken GenerateRefreshToken()
        {
            var refreshToken = new RefreshToken
            {
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                Expires = DateTime.Now.AddDays(7),
                Created = DateTime.Now
            };

            return refreshToken;
        }

        private void SetRefreshToken(RefreshToken newRefreshToken, LoggedInUser loggedInUser)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = newRefreshToken.Expires
            };
            Response.Cookies.Append("refreshToken", newRefreshToken.Token, cookieOptions);

            loggedInUser.RefreshToken = newRefreshToken.Token;
            loggedInUser.TokenCreated = newRefreshToken.Created;
            loggedInUser.TokenExpires = newRefreshToken.Expires;
        }

        private string CreateToken(LoggedInUser user)
        {
            var claims = new List<Claim>
            {
                new Claim("id",user.Id.ToString(), ClaimValueTypes.Integer),
                new Claim("gender", user.Gender),
                new Claim("exp", user.TokenExpires.ToString(), ClaimValueTypes.Integer),
                new Claim("email", user.Email),
                new Claim("mobile", user.Mobile),
                new Claim("birthDate", user.BirthDate.ToString(), ClaimValueTypes.DateTime),
                new Claim("lastName", user.LastName),
                new Claim("firstName", user.FirstName),
                new Claim("username", user.Username),
                new Claim("firstLogin",user.FirstLogin)

            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: user.TokenExpires,
                signingCredentials: creds);

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }


        [HttpGet("get-user-info")]
        public LoggedInUser BuildLoggedInUser()
        {
            

            return AuthorizationMethods.BuildLoggedInUser(User.Claims); 
           
        }
    }
}
