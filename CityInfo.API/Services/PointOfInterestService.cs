using AutoMapper;
using CityInfo.API.Models;

namespace CityInfo.API.Services;

public class PointOfInterestService(ICityInfoRepository repository,
    IMapper mapper,
    IMailService mailService) : IPointOfInterestService
{
    public async Task<PointOfInterestCreationResult> CreatePointOfInterestAsync(int cityId, 
        PointOfInterestForCreationDto pointOfInterest, 
        CancellationToken cancellationToken)
    {
        // bestaat de stad?
        if (!await repository.CityExistsAsync(cityId, 
            cancellationToken))
        {
            return PointOfInterestCreationResult.Failed("City not found");
        }

        // TODO for future dev: improve memory use and performance by not 
        // returning the POIs
        var existingPOIs = await repository.GetPointsOfInterestForCityAsync(cityId,
            cancellationToken);

        // heeft de stad al 10 POI's?
        if (existingPOIs.Count() >= 10)
        {
            return PointOfInterestCreationResult.Failed(
                "City has reached maximum capacity of 10 points of interest");
        }

        // dto omzetten naar entity
        var pointOfInterestEntity = mapper.Map<Entities.PointOfInterest>(pointOfInterest);

        // toevoegen
        await repository.AddPointOfInterestForCityAsync(cityId,
            pointOfInterestEntity,
            cancellationToken);

        // opslaan
        await repository.SaveChangesAsync(cancellationToken);

        // mail sturen
        await SendCreationNotificationsAsync(cityId, 
            pointOfInterestEntity);

        // successful(dto) teruggeven
        var resultDto = mapper.Map<PointOfInterestDto>(pointOfInterestEntity);
        return PointOfInterestCreationResult.Successful(resultDto);
    }

    private async Task SendCreationNotificationsAsync(int cityId,
        Entities.PointOfInterest pointOfInterest)
    {
        // Send email notification to subscribers
        var subject = "New Point of Interest Added";
        var message = $"A new point of interest '{pointOfInterest.Name}' has been added to city {cityId}.";
        mailService.Send(subject, message);
    }
}
