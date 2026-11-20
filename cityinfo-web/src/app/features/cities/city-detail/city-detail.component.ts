import { Component, inject, input, numberAttribute } from '@angular/core';
import { CityService } from '../../../core/services/city.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  imports: [],
  selector: 'app-city-detail',
  styleUrl: './city-detail.component.css',
  templateUrl: './city-detail.component.html',
})
export class CityDetailComponent {
  private readonly cityService = inject(CityService);

  readonly id = input.required<number, string>({ transform: numberAttribute });

  protected readonly cityResource = rxResource({
    params: () => this.id(),
    stream: ({ params: id }) => this.cityService.getCity(id),
  });
}
