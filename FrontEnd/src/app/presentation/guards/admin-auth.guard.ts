import { inject }        from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminAuthGuard: CanActivateFn = () => {
  const router = inject(Router);

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) {
    return router.createUrlTree(['/login']);
  }

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padding = '='.repeat((4 - (base64.length % 4)) % 4);
    const jsonPayload = decodeURIComponent(
      atob(base64 + padding)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    const role = payload.role;

    if (role === 'ROLE_ADMIN' || role === 'admin' || role === 'ADMIN') {
      return true;
    }
  } catch (e) {
    console.error('Error decodificando token en adminAuthGuard:', e);
  }

  return router.createUrlTree(['/dashboard']);
};
