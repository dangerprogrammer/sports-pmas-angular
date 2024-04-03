import { FormGroup } from "@angular/forms";
import { Observable } from "rxjs";
import { User } from "../interfaces";
import { NotificationService } from "../services/notification.service";
import { ComponentRef, inject, ViewContainerRef } from "@angular/core";
import { CadastroService } from "../services/cadastro.service";
import { Router } from "@angular/router";
import { FormComponent } from "../components/form/form.component";
import { modalidade, modName, options } from "../types";

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

export class ModSubmit {
  private cadastro = inject(CadastroService);

  enableCreateMod: boolean = !0;
  modalidadesList: modalidade[] = [];
  modalidadesView!: ViewContainerRef;
  availableNames: modName[] = ['HIDRO', 'NATACAO'];

  submitExistingMod = (name: string, update: Partial<modalidade>) => {
    const updateMod = this.cadastro.updateModalidade(name, update);
    const prismaModalidades = this.cadastro.searchModalidades();

    updateMod.subscribe(modalidade => {
      prismaModalidades.subscribe(modalidades => {
        this.modalidadesList = modalidades;

        this.onFreezeForm(!1);
        this.form.setErrors({ 'equal': !0 });

        this.form.patchValue({
          name: modalidade.name
        });

        const { value: oldValue } = this.form;
        const availableOptions = this.availableNames.filter(name =>
          !this.modalidadesList.find(({ name: modName }) => modName == name) || modalidade.name == name
        );
        const options: options = availableOptions.map(option => {
          return {
            id: option, text: option, status: option == modalidade.name, action: () => {
              this.form.get("name")?.setValue(option, { emitEvent: !1 });
            }
          }
        });

        const some = this.availableNames.find(name => !modalidades.find(({ name: modName }) => modName == name));

        this.enableCreateMod = !!some;

        this.modalidadesView.clear();
        const formRef = this.modalidadesView.createComponent(FormComponent);

        this.formRef = formRef;

        this.formRef.setInput('titleForm', modalidade.name);
        this.formRef.setInput('createMod', {
          form: this.form,
          formInputsList: [
            { controlName: 'name', inputText: 'Modalidades', options }
          ],
          oldValue,
          autoGenerateForms: !0,
          submitEvent: (res: any, form: FormGroup) => this.submitExistingMod(modalidade.name, res),
          submitText: 'Salvar'
        });
        this.formRef.setInput('isFreeze', this.isFreeze);
        this.formRef.changeDetectorRef.detectChanges();
      });
    });
  };

  submitNewMod = () => {
    console.log("Opa!");
  }

  isFreeze: boolean = !1;
  formRef!: ComponentRef<FormComponent>;
  form!: FormGroup;

  onFreezeForm = (freeze: boolean) => {
    this.isFreeze = freeze;

    this.formRef.setInput('isFreeze', this.isFreeze);
  }
}