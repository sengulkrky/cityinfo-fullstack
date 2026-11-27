import { computed, inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AuthenticationRequest,
  AuthenticationResponse,
  RegisterRequest,
  User,
} from '../../models/auth.model';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/authentication`;
  private readonly tokenKey = 'cityinfo_token';
  private readonly token = signal<string | null>(localStorage.getItem(this.tokenKey));

  readonly isLoggedIn = computed(() => {
    const token = this.token();

    if (!token) {
      return false;
    }

    try {
      const payloadBase64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const payloadJson = atob(payloadBase64);
      const payload: { exp: number } = JSON.parse(payloadJson);

      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  });

  register(request: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/register`, request);
  }

  login(request: AuthenticationRequest): Observable<AuthenticationResponse> {
    // als het antwoord binnenkomt, noem het response en sla response.token op onder mijn key
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/authenticate`, request).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.token);
        this.token.set(response.token);
      }),
    );
  }

  getToken(): string | null {
    return this.token();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.token.set(null);
  }
}
