import { Component, computed, inject, signal } from '@angular/core';
import { CityService } from '../../../core/services/city.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-city-list',
  styleUrl: './city-list.component.css',
  templateUrl: './city-list.component.html',
})
export class CityListComponent {
  private readonly cityService = inject(CityService);

  protected readonly searchQuery = signal('');
  protected readonly pageNumber = signal(1);

  protected readonly citiesResource = rxResource({
    params: () => ({ search: this.searchQuery(), page: this.pageNumber() }),
    stream: ({ params }) => this.cityService.getCities(params.search, params.page),
  });

  protected readonly pagination = computed(() =>
    this.citiesResource.hasValue() ? this.citiesResource.value()?.pagination : undefined,
  );
  protected readonly isFirstPage = computed(() => this.pageNumber() <= 1);
  protected readonly isLastPage = computed(
    () => this.pageNumber() >= (this.pagination()?.totalPageCount ?? 1),
  );

  protected search(event: Event, query: string): void {
    event.preventDefault();
    this.searchQuery.set(query.trim());
    this.pageNumber.set(1);
  }

  protected previousPage(): void {
    this.pageNumber.update((n) => n - 1);
  }

  protected nextPage(): void {
    this.pageNumber.update((n) => n + 1);
  }
}
