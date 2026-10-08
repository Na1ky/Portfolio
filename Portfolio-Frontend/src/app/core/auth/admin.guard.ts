import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminAuthService } from './admin-auth.service';

export const adminGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(AdminAuthService);
  const router = inject(Router);
  return await auth.checkSession() || router.createUrlTree(['/admin/login'], { queryParams: { returnUrl: state.url } });
};
