using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CityInfo.API.Entities;

public class City(string name)
{
    [Key] // primary key
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // database telt zelf op
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = name;

    [MaxLength(200)]
    public string? Description { get; set; }
    public ICollection<PointOfInterest> PointsOfInterest { get; set; } = []; // one-to-many: 1 stad heeft veel bezienswaardigheden

}
