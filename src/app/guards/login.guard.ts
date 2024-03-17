import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CadastroService } from '../services/cadastro.service';

export const loginGuard: CanActivateFn = (_route, _state) => {
  const { token } = inject(CadastroService);
  const router = inject(Router);

  if (!token) return !0;

  router.navigate(['/dashboard']);
  return !1;
};
