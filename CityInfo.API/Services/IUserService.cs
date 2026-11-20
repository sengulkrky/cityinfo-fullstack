using CityInfo.API.Models;

namespace CityInfo.API.Services;

public interface IUserService
{
    Task<UserRegistrationResult> RegisterAsync(UserForRegistrationDto userForRegistration, CancellationToken cancellationToken);
    Task<UserDto?> ValidateCredentialsAsync(AuthenticationRequestDto credentials, CancellationToken cancellationToken);
}
