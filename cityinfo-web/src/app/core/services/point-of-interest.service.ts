import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { PointOfInterest, PointOfInterestRequest } from '../../models/point-of-interest.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Service()
export class PointOfInterestService {
  private readonly http = inject(HttpClient);

  private url(cityId: number): string {
    return `${environment.apiUrl}/v2/cities/${cityId}/pointsofinterest`;
  }

  getPointOfInterest(cityId: number, poiId: number): Observable<PointOfInterest> {
    return this.http.get<PointOfInterest>(`${this.url(cityId)}/${poiId}`);
  }

  createPointOfInterest(
    cityId: number,
    request: PointOfInterestRequest,
  ): Observable<PointOfInterest> {
    return this.http.post<PointOfInterest>(this.url(cityId), request);
  }

  updatePointOfInterest(
    cityId: number,
    poiId: number,
    request: PointOfInterestRequest,
  ): Observable<void> {
    return this.http.put<void>(`${this.url(cityId)}/${poiId}`, request);
  }

  deletePointOfInterest(cityId: number, poiId: number): Observable<void> {
    return this.http.delete<void>(`${this.url(cityId)}/${poiId}`);
  }
}
