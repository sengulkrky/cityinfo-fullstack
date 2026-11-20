using System.ComponentModel.DataAnnotations;

namespace CityInfo.API.Models;

public class AuthenticationRequestDto
{
    [Required(ErrorMessage = "You must provide a username")]
    [MaxLength(50)]
    public string UserName { get; set; } = string.Empty;

    [Required(ErrorMessage = "You must provide a password")]
    [MaxLength(100)]
    public string Password { get; set; } = string.Empty;
}
