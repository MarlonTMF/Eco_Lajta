// presentation/guards/admin-auth.guard.ts
import { inject }        from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserState }     from '../../application/state/user.state';

export const adminAuthGuard: CanActivateFn = () => {
  const userState = inject(UserState);
  const router    = inject(Router);

  const role = userState.role();
  if (role === 'admin') return true;

  return router.createUrlTree(['/dashboard']);
};
