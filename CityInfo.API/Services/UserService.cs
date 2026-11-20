using AutoMapper;
using CityInfo.API.Entities;
using CityInfo.API.Models;
using Microsoft.AspNetCore.Identity;

namespace CityInfo.API.Services;

public class UserService(IUserRepository userRepository, IPasswordHasher<User> passwordHasher, IMapper mapper) : IUserService
{
    public async Task<UserRegistrationResult> RegisterAsync(UserForRegistrationDto userForRegistration, CancellationToken cancellationToken)
    {
        // 1. bestaat de gebruikersnaam al?
        if (await userRepository.UserNameExistsAsync(userForRegistration.UserName, cancellationToken))
        {
            return UserRegistrationResult.Failed("This username is already taken.");
        }

        // 2. nieuwe user aanmaken (zonder wachtwoord)
        var user = new User
        {
            UserName = userForRegistration.UserName.Trim().ToLowerInvariant(),
            FirstName = userForRegistration.FirstName.Trim(),
            LastName = userForRegistration.LastName.Trim()
        };

        // 3. wachtwoord hashen
        user.PasswordHash = passwordHasher.HashPassword(user, userForRegistration.Password);

        // 4. opslaan
        userRepository.AddUser(user);
        await userRepository.SaveChangesAsync(cancellationToken);

        // 5. na het opslaan mappen → Id is nu ingevuld
        var userToReturn = mapper.Map<UserDto>(user);
        return UserRegistrationResult.Successful(userToReturn);
    }

    public async Task<UserDto?> ValidateCredentialsAsync(AuthenticationRequestDto credentials, CancellationToken cancellationToken)
    {
        // 1. haal user op
        var user = await userRepository.GetUserByUserNameAsync(credentials.UserName, cancellationToken);

        // 2. bestaat de user?
        if (user is null)
        {
            return null;
        }

        // 3. verifier wachtwoord
        var result = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, credentials.Password);

        if (result == PasswordVerificationResult.Failed)
        {
            return null;
        }

        // 4. mappen naar UserDto
        return mapper.Map<UserDto>(user);
    }
}
