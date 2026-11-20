import { Component, inject, signal } from '@angular/core';
import { AuthenticationRequest } from '../../../models/auth.model';
import { form, maxLength, required, FormRoot, FormField } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  imports: [FormRoot, FormField, RouterLink],
  selector: 'app-login',
  styleUrl: './login.component.css',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly authenticationService = inject(AuthService);
  private readonly router = inject(Router);

  // 1. het model: data als signal
  protected readonly loginModel = signal<AuthenticationRequest>({
    userName: '',
    password: '',
  });

  // 2. het formulier + validatieregels
  protected readonly loginForm = form(
    this.loginModel,
    (schema) => {
      required(schema.userName, { message: 'Username is required' });
      maxLength(schema.userName, 50, { message: 'Username can be at most 50 characters' });
      required(schema.password, { message: 'Password is required' });
      maxLength(schema.password, 100, { message: 'Password can be at most 100 characters' });
    },
    {
      submission: {
        action: async (field) => {
          try {
            await firstValueFrom(this.authenticationService.login(field().value()));
            this.router.navigate(['/cities']);
            return;
          } catch (error) {
            return { kind: 'serverError', message: this.getErrorMessage(error) };
          }
        },
      },
    },
  );

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        return 'Invalid username or password';
      }
      if (error.status === 0) {
        return 'Cannot reach the server. Please try again later.';
      }
    }
    return 'Something went wrong. Please try again.';
  }
}
