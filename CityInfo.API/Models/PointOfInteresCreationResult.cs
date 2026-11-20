namespace CityInfo.API.Models;

public class PointOfInterestCreationResult
{
    public bool Success { get; private set; }
    public string? ErrorMessage { get; private set; }
    public PointOfInterestDto? PointOfInterest { get; private set; }

    public static PointOfInterestCreationResult Successful(PointOfInterestDto poi) =>
        new()
        {
            Success = true,
            PointOfInterest = poi
        };

    public static PointOfInterestCreationResult Failed(string error) =>
        new()
        {
            Success = false,
            ErrorMessage = error
        };
}
