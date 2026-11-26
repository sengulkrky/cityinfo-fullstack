import { Component, inject, input, numberAttribute, signal } from '@angular/core';
import { CityService } from '../../../core/services/city.service';
import { PointOfInterestService } from '../../../core/services/point-of-interest.service';
import { firstValueFrom } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-city-detail',
  styleUrl: './city-detail.component.css',
  templateUrl: './city-detail.component.html',
})
export class CityDetailComponent {
  private readonly cityService = inject(CityService);
  private readonly pointsOfInterestService = inject(PointOfInterestService);

  readonly id = input.required<number, string>({ transform: numberAttribute });

  protected readonly cityResource = this.cityService.getCity(this.id);

  protected readonly deleteError = signal<string | null>(null);

  protected async deletePointOfInterest(poiId: number, poiName: string): Promise<void> {
    if (!confirm(`Are you sure you want to delete ${poiName}?`)) {
      return;
    }

    this.deleteError.set(null);

    try {
      await firstValueFrom(this.pointsOfInterestService.deletePointOfInterest(this.id(), poiId));
      this.cityResource.reload();
    } catch {
      this.deleteError.set(`Could not delete ${poiName}. Please try again.`);
    }
  }
}
