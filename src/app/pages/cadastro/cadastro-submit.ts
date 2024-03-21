import { FormGroup } from "@angular/forms";
import { Observable } from "rxjs";
import { User } from "../../interfaces";

export function cadastroSubmit(res: any, form: FormGroup, that: any) {
    const prismaUser = that.cadastro.createUser(res as User);
    const findedUser = that.cadastro.searchUser(res.cpf);

    (findedUser as Observable<User>).subscribe(user => {
      if (!user) prismaUser.subscribe({
        error: (err: any) => {
          console.log(err);
          that.notification.addNotification({
            text: err.message,
            error: !0,
            headerText: err.status
          });
        }, complete: () => {
          form.reset();
          that.notification.addNotification({
            text: 'Cadastro realizado com sucesso!\nRedirecionando para login...',
            duration: 5
          });

          setTimeout(() => that.router.navigate(["/login"]), 5e3);
        }
      });
      else {
        const { cpf } = res, { roles } = res.solic;
        const createSolic = that.cadastro.createSolic({ roles, cpf });
        let notifConfigs: any = {};

        createSolic.subscribe({
          error: () => {
            that.notification.addNotification({
              text: 'Solicitação falhou!',
              error: !0
            });
          },
          next: (value: any) => {
            if (value.createdAt) notifConfigs = {
              text: 'Solicitação já foi enviada!'
            };
            else if (value.text) notifConfigs = value;
            else notifConfigs = {
              text: 'Seu usuário já é aceito! Clique aqui e faça login!',
              actionClick: () => {
                that.cadastro.subscribe = "login";
                that.cadastro.loginData = { cpf: form.get('cpf')?.value };

                that.cadastro.removeFromStorage("cadastro-type");
                that.router.navigate(["/login"]);
              }
            }
          },
          complete: () => {
            that.notification.addNotification(notifConfigs);
          }
        });
      };
    });
}