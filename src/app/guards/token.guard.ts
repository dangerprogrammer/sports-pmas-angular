import { ActivatedRoute, CanActivateFn, Router } from "@angular/router";
import { CadastroService } from "../services/cadastro.service";
import { inject } from "@angular/core";

export const tokenGuard: CanActivateFn = (_route, _state) => {
    const { getToken } = inject(CadastroService);
    const router = inject(Router);
    const activeRoute = inject(ActivatedRoute);

    const token = getToken();

    if (token) return !0;

    router.navigate(["/cadastro"]);
    return !1;
}