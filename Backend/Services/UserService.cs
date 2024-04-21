using System;
using ArtHub.dto;
using ArtHub.Models;

namespace ArtHub.Services
{

    public interface UserService
    {
        User GetUserById(int id);

        List<User> GetAllUsers();

        User CreateUser(User newUser);

        User UpdateUser(UpdateUserDto userDto, User oldUser);

        void DeleteUser(int id);

        User FindUserByIdentity(string identity);
    }

}

