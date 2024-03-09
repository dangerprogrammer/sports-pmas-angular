import { CanActivateFn, Router } from "@angular/router";
import { CadastroService } from "../services/cadastro.service";

export const cadChildGuard: CanActivateFn = ({ routeConfig }, _state) => {
    const { getToken, getCadastroType } = new CadastroService();
    const routerService = new Router();

    const token = getToken();
    const cadastroType = getCadastroType();

    if (!token) {
        if (!cadastroType) {
            routerService.navigate(["/cadastro"]);
            return !1;
        } else if (routeConfig && cadastroType != routeConfig.path) {
            routerService.navigate([`/cadastro/${cadastroType}`]);
            return !1;
        };

        return !0;
    };

    routerService.navigate(["/"]);
    return !1;
}