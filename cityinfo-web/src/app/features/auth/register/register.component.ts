import { Component, inject, signal } from '@angular/core';
import { RegisterRequest } from '../../../models/auth.model';
import { form, maxLength, minLength, required, FormRoot, FormField } from '@angular/forms/signals';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  imports: [FormRoot, FormField, RouterLink],
  selector: 'app-register',
  styleUrl: './register.component.css',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private readonly authenticationService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly registerModel = signal<RegisterRequest>({
    userName: '',
    firstName: '',
    lastName: '',
    password: '',
  });

  protected readonly registerForm = form(
    this.registerModel,
    (schema) => {
      required(schema.userName, { message: 'Username is required' });
      maxLength(schema.userName, 50, { message: 'Username can be at most 50 characters' });
      required(schema.firstName, { message: 'First name is required' });
      maxLength(schema.firstName, 50, { message: 'First name can be at most 50 characters' });
      required(schema.lastName, { message: 'Last name is required' });
      maxLength(schema.lastName, 50, { message: 'Last name can be at most 50 characters' });
      required(schema.password, { message: 'Password is required' });
      minLength(schema.password, 8, { message: 'Password must be at least 8 characters' });
      maxLength(schema.password, 100, { message: 'Password can be at most 100 characters' });
    },
    {
      submission: {
        action: async (field) => {
          try {
            await firstValueFrom(this.authenticationService.register(field().value()));
            this.router.navigate(['/login']);
            return;
          } catch (error) {
            // 409 Conflict → gebruikersnaam bestaat al, toon de fout bij het username-veld
            if (error instanceof HttpErrorResponse && error.status === 409) {
              return {
                kind: 'serverError',
                message: 'This username is already taken',
                fieldTree: field.userName,
              };
            }
            // andere fouten (400, server onbereikbaar, ...) → algemene melding op formulierniveau
            return { kind: 'serverError', message: this.getErrorMessage(error) };
          }
        },
      },
    },
  );

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 400) {
        return 'Some fields are invalid. Please check your input.';
      }
      if (error.status === 0) {
        return 'Cannot reach the server. Please try again later.';
      }
    }
    return 'Something went wrong. Please try again.';
  }
}
