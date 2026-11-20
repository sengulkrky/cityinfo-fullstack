namespace CityInfo.API.Models;

public class UserRegistrationResult
{
    public bool Success { get; private set; }
    public string? ErrorMessage { get; private set; }
    public UserDto? User { get; private set; }

    public static UserRegistrationResult Successful(UserDto user) =>
        new()
        {
            Success = true,
            User = user
        };

    public static UserRegistrationResult Failed(string error) =>
        new()
        {
            Success = false,
            ErrorMessage = error
        };
}
