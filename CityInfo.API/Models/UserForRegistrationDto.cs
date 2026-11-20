using System.ComponentModel.DataAnnotations;

namespace CityInfo.API.Models;

public class UserForRegistrationDto
{
    [Required(ErrorMessage = "You must provide a username")]
    [MaxLength(50)]
    public string UserName { get; set; } = string.Empty;

    [Required(ErrorMessage = "You must provide a first name")]
    [MaxLength(50)]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "You must provide a last name")]
    [MaxLength(50)]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "You must provide a password")]
    [MinLength(8, ErrorMessage = "Your password must be at least 8 characters long.")]
    [MaxLength(100)]
    public string Password { get; set; } = string.Empty;
}
