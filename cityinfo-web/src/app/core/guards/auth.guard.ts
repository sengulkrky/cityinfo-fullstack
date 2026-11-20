import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  // 1. injecteer service en router
  const authenticationService = inject(AuthService);
  const router = inject(Router);

  // 2. gebruiker ingelogd
  if (authenticationService.isLoggedIn()) {
    return true;
  }

  // 3. gebruiker niet ingelogd
  return router.createUrlTree(['/login']);
};

// Een guard is een functie die de router aanroept vóór hij een route opent. De guard beslist of de navigatie doorgaat:
// true: ga verder, de pagina wordt getoond.
// een UrlTree: navigeer in plaats daarvan naar een andere URL (bv. /login).
// false: blokkeer de navigatie, zonder omleiding. Dat wordt zelden gebruikt.
