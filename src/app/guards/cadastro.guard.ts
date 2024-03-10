import { ActivatedRoute, CanActivateFn, Router } from "@angular/router";
import { CadastroService } from "../services/cadastro.service";
import { inject } from "@angular/core";

export const cadastroGuard: CanActivateFn = (_route, _state) => {
    const { getToken, getCadastroType } = inject(CadastroService);
    const router = inject(Router);
    const activeRoute = inject(ActivatedRoute);

    const token = getToken();
    const cadastroType = getCadastroType();

    if (!token) {
        if (cadastroType) {
            router.navigate(['/cadastro/aluno']);
            return !1;
        };

        return !0;
    };

    router.navigate(["/"]);
    return !1;
}