import { CanActivateFn, Router } from "@angular/router";
import { CadastroService } from "../services/cadastro.service";
import { inject } from "@angular/core";

export const modGuard: CanActivateFn = (_route, _state) => {
    const { token, auth, search } = inject(CadastroService);
    const router = inject(Router);

    if (token) {
        auth.refreshToken().subscribe({
            error: () => {
                router.navigate(['/login']);
                return !1;
            },
            complete: () => search.searchUserByToken().subscribe(data => {
                if (data) {
                    const isMod = data.roles.find(role => role == 'ADMIN');

                    if (isMod) return !0;
                };

                router.navigate(['/login']);
                return !1;
            })
        });
        return !0;
    };

    router.navigate(['/login']);
    return !1;
}