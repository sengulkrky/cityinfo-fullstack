import { inject, Service } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PagedResult, Pagination } from '../../models/pagination.model';
import { City, CityWithoutPointsOfInterest } from '../../models/city.model';
import { environment } from '../../../environments/environment';
import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';

@Service()
export class CityService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/v2/cities`;

  getCities(
    searchQuery = '',
    pageNumber = 1,
    pageSize = 10,
  ): Observable<PagedResult<CityWithoutPointsOfInterest>> {
    const params: Record<string, string | number> = { pageNumber, pageSize };

    if (searchQuery.trim()) {
      params['searchQuery'] = searchQuery.trim();
    }

    return this.http
      .get<CityWithoutPointsOfInterest[]>(this.baseUrl, { params, observe: 'response' })
      .pipe(
        map((response) => ({
          items: response.body ?? [],
          pagination: JSON.parse(response.headers.get('X-Pagination') ?? '{}') as Pagination,
        })),
      );
  }

  getCity(id: () => number): HttpResourceRef<City | undefined> {
    return httpResource<City>(() => ({
      url: `${this.baseUrl}/${id()}`,
      params: { includePointsOfInterest: true },
    }));
  }
}
