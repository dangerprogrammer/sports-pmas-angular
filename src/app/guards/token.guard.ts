import { CanActivateFn, Router } from "@angular/router";
import { CadastroService } from "../services/cadastro.service";
import { inject } from "@angular/core";

export const tokenGuard: CanActivateFn = (_route, _state) => {
    const { token } = inject(CadastroService);
    const router = inject(Router);

    if (token) return !0;

    router.navigate(['/cadastro']);
    return !1;
}