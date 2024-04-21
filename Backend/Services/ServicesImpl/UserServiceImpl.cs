using ArtHub.dto;
using ArtHub.Models;

namespace ArtHub.Services.ServicesImpl
{
    public class UserServiceImpl : UserService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public UserServiceImpl(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        public User CreateUser(User newUser)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                User existingUserByUsername = FindUserByIdentity(newUser.Username);
                User existingUserByEmail = FindUserByIdentity(newUser.Email);

                if (existingUserByUsername != null || existingUserByEmail != null)
                {
                    throw new InvalidOperationException("Username or email is already taken.");
                }
                context.Users.Add(newUser);
                context.SaveChanges();
                return newUser;
            }
        }

        public void DeleteUser(int id)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var userToDelete = context.Users.Find(id);

                if (userToDelete != null)
                {
                    context.Users.Remove(userToDelete);
                    context.SaveChanges();
                }
            }
        }

        public User FindUserByIdentity(string identity)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                return context.Users.FirstOrDefault(u => u.Username == identity || u.Email == identity);
            }
        }

        public List<User> GetAllUsers()
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                return context.Users.ToList();
            }
        }

        public User GetUserById(int id)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                return context.Users.Find(id);
            }
        }
        public User UpdateUser(UpdateUserDto userDto, User oldUser)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                if (oldUser != null)
                {
                    oldUser.FirstName = userDto.FirstName;
                    oldUser.LastName = userDto.LastName;
                    oldUser.Username = userDto.Username;
                    oldUser.Email = userDto.Email;
                    oldUser.Password = userDto.Password;
                    oldUser.Mobile = userDto.Mobile;
                    oldUser.ProfilePictureUrl = userDto.ProfilePictureUrl;
                    oldUser.Gender = userDto.Gender;
                    context.SaveChanges();
                }

                return oldUser;
            }
        }
    }
}