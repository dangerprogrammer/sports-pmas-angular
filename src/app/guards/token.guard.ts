import { CanActivateFn, Router } from "@angular/router";
import { CadastroService } from "../services/cadastro.service";

export const tokenGuard: CanActivateFn = (route, state) => {
    const { getToken } = new CadastroService();
    const routerService = new Router();

    const token = getToken();

    if (token) return !0;

    routerService.navigate(["/cadastro"]);
    return !1;
}