import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { User } from "../interfaces";
import { NotificationService } from "../services/notification.service";
import { ComponentRef, inject, ViewContainerRef } from "@angular/core";
import { CadastroService } from "../services/cadastro.service";
import { Router } from "@angular/router";
import { FormComponent } from "../components/form/form.component";
import { horario, modalidade, modName, options, PrismaModalidade } from "../types";

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
  private fb = inject(FormBuilder);

  enableCreateMod: boolean = !0;
  modalidadesList: PrismaModalidade[] = [];
  modalidadesView!: ViewContainerRef;
  availableNames: modName[] = ['HIDRO', 'NATACAO'];

  submitExistingMod = (name: string, update: Partial<modalidade>, { form, formRef }: { form: FormGroup, formRef: ComponentRef<FormComponent> }) => {
    const updateMod = this.cadastro.updateModalidade(name, update);
    const prismaModalidades = this.cadastro.searchModalidades();

    updateMod.subscribe(() => {
      prismaModalidades.subscribe(modalidades => {
        this.modalidadesList = modalidades;

        formRef.setInput('isFreeze', !1);
        form.setErrors({ 'equal': !0 });

        const some = this.availableNames.find(name =>
          !modalidades.find(({ name: modName }) => modName == name)
        );

        this.enableCreateMod = !!some;

        this.modalidadesView.clear();
        for (const modalidade of modalidades) {
          const prismaHorarios = this.cadastro.searchHorarios(modalidade);

          prismaHorarios.subscribe(horarios => this.addExistingMod(modalidade, horarios, { form }));
        };
      });
    });
  };

  addExistingMod = (modalidade: PrismaModalidade, horarios: horario[], data?: { form?: FormGroup }) => {
    const formRef = this.modalidadesView.createComponent(FormComponent);
    const formatHorarios = horarios.map(horario => {
      const time = new Date(horario.time).toLocaleTimeString();

      return { ...horario, time };
    });

    let form = this.fb.group({
      name: [modalidade.name, Validators.required],
      horarios: [horarios, horarios.length && Validators.required],
      local: this.fb.group({
        endereco: ['', Validators.required],
        bairro: ['', Validators.required]
      })
    });

    if (data?.form) {
      data.form.setErrors(null);

      form = data.form;
    };

    const { value: oldValue } = form;
    const availableOptions = this.availableNames.filter(name =>
      !this.modalidadesList.find(({ name: modName }) => modName == name) || modalidade.name == name
    );
    const optionsName: options = availableOptions.map(option => {
      return {
        id: option, text: option, status: option == modalidade.name, action() {
          form.get("name")?.setValue(option, { emitEvent: false });
        }
      }
    }).sort(({ status: a }, { status: b }) => {
      if (a > b) return -1;

      return 0;
    });
    const optionsHorario: options = formatHorarios.map(({ id, time }) => { return { id, text: time } });

    formRef.setInput('titleForm', modalidade.name);
    formRef.setInput('createMod', {
      form,
      formInputsList: [
        { controlName: 'name', inputText: 'Modalidades', options: optionsName },
        { controlName: 'horarios', inputText: 'Horarios', builderOptions: optionsHorario }
      ],
      oldValue,
      autoGenerateForms: !0,
      submitEvent: (update: Partial<modalidade>) => this.submitExistingMod(modalidade.name, update, { form, formRef }),
      submitText: 'Salvar'
    });
    formRef.setInput('freezeForm', (freeze: boolean) => formRef.setInput('isFreeze', freeze));
  }

  submitNewMod = () => {
    console.log("Opa!");
  }

  addNewMod = (modNames: modName[]) => {
    const formRef = this.modalidadesView.createComponent(FormComponent);

    const form = this.fb.group({
      name: ['', Validators.required]
    });

    formRef.setInput('titleForm', 'Escolha uma modalidade!');
    formRef.setInput('titleSmall', !0);
    formRef.setInput('createMod', {
      form,
      formInputsList: [
        { controlName: 'name', inputText: 'Modalidades' }
      ],
      autoGenerateForms: !0,
      submitEvent: this.submitNewMod,
    });
    formRef.setInput('freezeForm', (freeze: boolean) => formRef.setInput('isFreeze', freeze));

    this.enableCreateMod = !1;
  }
}