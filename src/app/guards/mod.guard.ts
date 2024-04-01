import { CanActivateFn, Router } from "@angular/router";
import { CadastroService } from "../services/cadastro.service";
import { inject } from "@angular/core";

export const modGuard: CanActivateFn = (_route, _state) => {
    const { token, refreshToken, searchUserByToken } = inject(CadastroService);
    const router = inject(Router);

    if (token) {
        refreshToken().subscribe({
            error: () => {
                router.navigate(['/login']);
                return !1;
            },
            complete: () => {
                searchUserByToken().subscribe(data => {
                    if (data) {
                        const isMod = data.roles.find(role => role == 'ADMIN' || role == 'PROFESSOR');
                        
                        if (isMod) return !0;
                    };

                    router.navigate(['/login']);
                    return !1;
                });
            }
        });
        return !0;
    };

    router.navigate(['/login']);
    return !1;
}