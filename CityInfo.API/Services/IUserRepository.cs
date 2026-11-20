using CityInfo.API.Entities;

namespace CityInfo.API.Services;

public interface IUserRepository
{
    Task<User?> GetUserByUserNameAsync(string userName, CancellationToken cancellationToken);

    Task<bool> UserNameExistsAsync(string userName, CancellationToken cancellationToken);

    void AddUser(User user);

    Task<bool> SaveChangesAsync(CancellationToken cancellationToken);
}
