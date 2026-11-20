using CityInfo.API.Models;
using CityInfo.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace CityInfo.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthenticationController(IConfiguration configuration,
    IUserService userService) : ControllerBase
{
    [HttpPost("authenticate")]
    public async Task<ActionResult<AuthenticationResponseDto>> Authenticate(AuthenticationRequestDto authenticationRequest, CancellationToken cancellationToken)
    {
        // Step 1: validate the username/password
        var user = await userService.ValidateCredentialsAsync(authenticationRequest, cancellationToken);

        if (user is null)
        {
            return Unauthorized();
        }

        var securityKey = new SymmetricSecurityKey(
            Convert.FromBase64String(configuration["Authentication:SecretForKey"]!));

        var signingCredentials = new SigningCredentials(securityKey, 
            SecurityAlgorithms.HmacSha256);

        var claimsForToken = new List<Claim>
            {
                new("sub", user.Id.ToString()),
                new("given_name", user.FirstName),
                new("family_name", user.LastName)
            };
        var jwtSecurityToken = new JwtSecurityToken(
            configuration["Authentication:Issuer"],
            configuration["Authentication:Audience"],
            claimsForToken,
            DateTime.UtcNow,
            DateTime.UtcNow.AddHours(1),
            signingCredentials);

        var tokenToReturn = new JwtSecurityTokenHandler()
            .WriteToken(jwtSecurityToken);

        return Ok(new AuthenticationResponseDto { Token = tokenToReturn });
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(UserForRegistrationDto userToRegister, CancellationToken cancellationToken)
    {
        var result = await userService.RegisterAsync(userToRegister, cancellationToken);

        if (!result.Success)
        {
            return Conflict(new { error = result.ErrorMessage });
        }

        return Created("", result.User);
    }
}
