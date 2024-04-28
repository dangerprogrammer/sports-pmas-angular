import { CanActivateFn, Router } from "@angular/router";
import { CadastroService } from "../services/cadastro.service";
import { inject } from "@angular/core";

export const acceptGuard: CanActivateFn = (_route, _state) => {
    const { token, auth: { refreshToken }, search: { searchUserByToken } } = inject(CadastroService);
    const router = inject(Router);

    if (token) {
        refreshToken().subscribe({
            error: () => {
                router.navigate(['/login']);
                return !1;
            },
            complete: () => searchUserByToken().subscribe(user => {
                if (user.accepted) return user.accepted;

                router.navigate(['/login']);
                return !1;
            })
        });

        return !0;
    };

    router.navigate(['/login']);
    return !1;
}