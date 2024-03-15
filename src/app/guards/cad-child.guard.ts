import { CanActivateFn, Router } from "@angular/router";
import { CadastroService } from "../services/cadastro.service";
import { inject } from "@angular/core";

export const cadChildGuard: CanActivateFn = ({ routeConfig }, _state) => {
    const { token, cadastroType } = inject(CadastroService);
    const routerService = inject(Router);

    if (!token) {
        if (!cadastroType) {
            routerService.navigate(['/cadastro']);
            return !1;
        } else if (routeConfig && routeConfig.path != cadastroType) {
            routerService.navigate(['/cadastro', cadastroType]);
            return !1;
        };

        return !0;
    };

    routerService.navigate(['/']);
    return !1;
}