import { ActivatedRoute, CanActivateFn, Router } from "@angular/router";
import { CadastroService } from "../services/cadastro.service";
import { inject } from "@angular/core";

export const cadastroGuard: CanActivateFn = (_route, _state) => {
    const { token, cadastroType } = inject(CadastroService);
    const router = inject(Router);

    if (!token) {
        if (cadastroType) {
            router.navigate(['/cadastro', cadastroType]);
            return !1;
        };

        return !0;
    };

    router.navigate(['/dashboard']);
    return !1;
}