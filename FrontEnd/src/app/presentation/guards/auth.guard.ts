import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (_route, _state) => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  if (token) return true;
  inject(Router).navigate(['/login']);
  return false;
};
