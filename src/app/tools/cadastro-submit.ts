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

  submitFunction = (res: any, form: FormGroup) => {
    const prismaUser = this.cadastro.createUser(res as User);
    const findedUser = this.cadastro.searchUser(res.cpf);

    (findedUser as Observable<User>).subscribe(user => {
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
            duration: 5
          });

          setTimeout(() => this.router.navigate(["/login"]), 6e3);
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