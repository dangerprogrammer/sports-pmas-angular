import { CanActivateFn, Router } from "@angular/router";
import { CadastroService } from "../services/cadastro.service";

export const cadastroGuard: CanActivateFn = (_route, _state) => {
    const { getToken, getCadastroType } = new CadastroService();
    const routerService = new Router();

    const token = getToken();
    const cadastroType = getCadastroType();

    if (!token) {
        if (cadastroType) routerService.navigate([`/cadastro/${cadastroType}`]);
        return !0;
    };

    routerService.navigate(["/"]);
    return !1;
}