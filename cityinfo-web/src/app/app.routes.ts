import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { CityListComponent } from './features/cities/city-list/city-list.component';
import { authGuard } from './core/guards/auth.guard';
import { CityDetailComponent } from './features/cities/city-detail/city-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'cities', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'cities', component: CityListComponent, canActivate: [authGuard] },
  { path: 'cities/:id', component: CityDetailComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'cities' },
];
