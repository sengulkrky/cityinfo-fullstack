using CityInfo.API.DbContexts;
using CityInfo.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace CityInfo.API.Services;

public class UserRepository(CityInfoContext context) : IUserRepository
{
    public async Task<User?> GetUserByUserNameAsync(string userName, CancellationToken cancellationToken)
    {
        // parameter normaliseren, niet de kolom → database kan de unieke index gebruiken
        var normalizedUserName = userName.Trim().ToLowerInvariant();

        return await context.Users
            .Where(u => u.UserName == normalizedUserName)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<bool> UserNameExistsAsync(string userName, CancellationToken cancellationToken)
    {
        var normalizedUserName = userName.Trim().ToLowerInvariant();

        return await context.Users
            .AnyAsync(u => u.UserName == normalizedUserName, cancellationToken);
    }

    // geen async: Add doet geen database-call, alleen de change tracker
    public void AddUser(User user)
    {
        context.Users.Add(user);
    }

    public async Task<bool> SaveChangesAsync(CancellationToken cancellationToken)
    {
        return (await context.SaveChangesAsync(cancellationToken) >= 0);
    }
}
