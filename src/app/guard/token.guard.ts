import { CanDeactivateFn, Router } from '@angular/router';
import { AdminComponent } from '../admin/admin.component';
import { TokenService } from '../services/token.service';
import { inject } from '@angular/core';

export const tokenGuard:  CanDeactivateFn<AdminComponent> = (component, currentRoute, currentState, nextState) => {
  const tokenService = inject(TokenService);
  return tokenService.canDeactivate();
};
