import { FormGroup } from "@angular/forms";
import { Observable } from "rxjs";
import { User } from "../interfaces";
import { NotificationService } from "../services/notification.service";
import { inject } from "@angular/core";
import { CadastroService } from "../services/cadastro.service";
import { Router } from "@angular/router";

export class CadastroSubmit {
  private cadastro = inject(CadastroService);
  private router = inject(Router);

  notification!: NotificationService;
  isFreeze: boolean = !1;

  onFreezeForm(freeze: boolean) {
    this.isFreeze = freeze;
  }

  submitFunction = (res: any, form: FormGroup) => {
    const prismaUser = this.cadastro.createUser(res as User);
    const findedUser = this.cadastro.searchUser(res.cpf);

    findedUser.subscribe(user => {
      if (!user) prismaUser.subscribe({
        error: (err: any) => {
          console.log(err);
          this.notification.addNotification({
            text: err.message,
            error: !0,
            headerText: err.status
          });
        }, complete: () => {
          form.reset();
          this.notification.addNotification({
            text: 'Cadastro realizado com sucesso!\nRedirecionando para login...',
            duration: 3
          });

          const { cpf, password } = res;
          this.cadastro.loginData = { cpf, password };
          setTimeout(() => this.router.navigate(["/login"]), 3.5e3);
        }
      });
      else {
        const { cpf } = res, { roles } = res.solic;
        const createSolic = this.cadastro.createSolic({ roles, cpf });
        let notifConfigs: any = {};

        createSolic.subscribe({
          error: () => {
            this.notification.addNotification({
              text: 'Solicitação falhou!',
              error: !0
            });
          },
          next: (value: any) => {
            const { submitAction } = value;
            if (value.createdAt) notifConfigs = { text: 'Solicitação já foi enviada!' };
            else if (value.backAPI) notifConfigs = {
              ...value,
              actionClick: () => this.submitActions[submitAction as ('goLogin')](form),
              backAPI: undefined
            };
            else notifConfigs = {
              text: 'Seu usuário já é aceito! Clique aqui e faça login!',
              actionClick: () => this.submitActions.goLogin(form)
            }
          },
          complete: () => {
            this.notification.addNotification(notifConfigs);
          }
        });
      };
    });
  }

  private submitActions = {
    'goLogin': (form: FormGroup) => {
      this.cadastro.subscribe = "login";
      this.cadastro.loginData = { cpf: form.get('cpf')?.value };

      this.cadastro.removeFromStorage("cadastro-type");
      this.router.navigate(["/login"]);
    }
  }
}

export class LoginSubmit {
  private cadastro = inject(CadastroService);
  private router = inject(Router);
  
  hasError: boolean = !1;
  errorMsg: string = 'Erro! CPF ou senha inválidas!';

  submitFunction = (res: any) => {
    const findedUser = this.cadastro.searchUser(res.cpf);

    this.hasError = !1;
    findedUser.subscribe((user: any) => {
      if (!user) {
        this.hasError = !0;
        return;
      };

      const login = this.cadastro.loginUser(res as User);

      this.hasError = !1;
      login.subscribe({
        error: () => this.hasError = !0, complete: () => {
          this.cadastro.removeFromStorage("login-data");

          this.router.navigate(['/dashboard']);
        },
      });
    });
  };
}