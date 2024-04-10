import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { User } from "../interfaces";
import { NotificationService } from "../services/notification.service";
import { ComponentRef, inject, ViewContainerRef } from "@angular/core";
import { CadastroService } from "../services/cadastro.service";
import { Router } from "@angular/router";
import { FormComponent } from "../components/form/form.component";
import { horario, modalidade, modName, option, PrismaModalidade } from "../types";
import { DateTools } from "./date-tools";
import { forkJoin } from "rxjs";
import { MyValidators } from "./validators";

export class CadastroSubmit {
  private cadastro = inject(CadastroService);
  private router = inject(Router);


  myvalidators = new MyValidators();
  notification!: NotificationService;
  isFreeze: boolean = !1;

  onFreezeForm(freeze: boolean) {
    this.isFreeze = freeze;
  }

  submitFunction = (res: User, form: FormGroup) => {
    const prismaUser = this.cadastro.createUser(res);
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
        const { cpf, solic } = res, { roles } = solic;
        const createSolic = this.cadastro.createSolic({ roles, cpf });
        let notifConfigs: any = {};

        createSolic.subscribe({
          error: () => this.notification.addNotification({ text: 'Solicitação falhou!', error: !0 }),
          next: (value: any) => {
            const { submitAction } = value;
            if (value.createdAt) notifConfigs = { text: 'Solicitação já foi enviada!' };
            else if (value.backAPI) notifConfigs = {
              ...value,
              actionClick: () => this.submitActions[submitAction as 'goLogin'](form),
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
      this.cadastro.loginData = { cpf: form.get('cpf')?.value, password: form.get('password')?.value };

      this.cadastro.removeFromStorage("cadastro-type");
      this.router.navigate(["/login"]);
    }
  }
}

export class LoginSubmit {
  private cadastro = inject(CadastroService);
  private router = inject(Router);

  hasError: boolean = !1;
  errorMsg: string = 'Erro! CPF ou senha inválidos!';

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

export class ModSubmit extends DateTools {
  private cadastro = inject(CadastroService);
  private fb = inject(FormBuilder);

  enableCreateMod: boolean = !0;
  modalidadesList: PrismaModalidade[] = [];
  modalidadesView!: ViewContainerRef;
  availableNames: modName[] = ['HIDRO', 'NATACAO'];

  searchModSubmit = (modalidades: PrismaModalidade[], data?: { form: FormGroup, formRef: ComponentRef<any> }) => {
    this.modalidadesList = modalidades.sort(({ name: nameA }, { name: nameB }) =>
      nameA > nameB ? 1 : nameA < nameB ? -1 : 0
    );

    if (data) {
      const { form, formRef } = data;

      formRef.setInput('isFreeze', !1);
      form.setErrors({ 'equal': !0 });
    }

    const some = this.availableNames.find(name =>
      !modalidades.find(({ name: modName }) => modName == name)
    );

    this.enableCreateMod = !!some;

    this.modalidadesView.clear();
    const prismaHorariosList = this.modalidadesList.map(this.cadastro.searchHorarios);

    forkJoin(prismaHorariosList).subscribe(data => {
      for (const index in data) {
        const modalidade = this.modalidadesList[index];
        const horarios = data[index];

        this.addExistingMod(modalidade, horarios);
      };
    });
  }

  submitExistingMod = (name: string, update: Partial<modalidade>, data: { form: FormGroup, formRef: ComponentRef<any> }) => {
    const updateMod = this.cadastro.updateModalidade(name, update);
    const prismaModalidades = this.cadastro.searchModalidades();

    updateMod.subscribe(() => prismaModalidades.subscribe(modalidades => this.searchModSubmit(modalidades, data)));
  };

  addExistingMod = (modalidade: PrismaModalidade, horarios: horario[]) => {
    const formRef = this.modalidadesView.createComponent(FormComponent);
    const formatHorarios = horarios.map(horario => {
      const time = this.formatTime(horario.time);

      return { ...horario, time };
    });

    let form = this.fb.group({
      name: [modalidade.name, Validators.required],
      horarios: [formatHorarios.map(({ time }) => { return { id: 0, text: time, status: !1 } }), horarios.length && Validators.required],
      local: this.fb.group({
        endereco: [modalidade.endereco, Validators.required],
        bairro: [modalidade.bairro, Validators.required]
      })
    });

    const oldValue = { ...form.value };

    const localForm = form.get("local") as FormGroup;
    const availableOptions = this.availableNames.filter(name =>
      !this.modalidadesList.find(({ name: modName }) => modName == name) || modalidade.name == name
    );
    const optionsName: option[] = availableOptions.map(option => {
      return {
        id: option, text: option, status: option == modalidade.name, action() {
          form.get("name")?.setValue(option, { emitEvent: false });
        }
      }
    }).sort(({ status: a }, { status: b }) => {
      if (a > b) return -1;

      return 0;
    });

    formRef.setInput('index', this.modalidadesView.length - 1);
    formRef.setInput('titleForm', modalidade.name);
    formRef.setInput('createMod', {
      form,
      formInputsList: [
        { form, controlName: 'name', inputText: 'Modalidade', options: optionsName },
        { form, controlName: 'horarios', inputText: 'Horarios', builderOptions: formatHorarios.map(({ time }) => { return { id: 0, text: time, status: !1 } }) },
        { form: localForm, controlName: 'endereco', inputText: 'Endereco' },
        { form: localForm, controlName: 'bairro', inputText: 'Bairro' },
      ],
      oldValue,
      autoGenerateForms: !0,
      submitEvent: (update: Partial<modalidade>) => this.submitExistingMod(modalidade.name, update, { form, formRef }),
      submitText: 'Salvar'
    });
    formRef.setInput('freezeForm', (freeze: boolean) => formRef.setInput('isFreeze', freeze));
  }

  submitNewMod = (modalidade: modalidade, data: { form: FormGroup, formRef: ComponentRef<any> }) => {
    const createMod = this.cadastro.createModalidade(modalidade);
    const prismaModalidades = this.cadastro.searchModalidades();

    createMod.subscribe(() => prismaModalidades.subscribe(modalidades => this.searchModSubmit(modalidades, data)));
  }

  addNewMod = (modNames: modName[]) => {
    const formRef = this.modalidadesView.createComponent(FormComponent);

    const form = this.fb.group({
      name: ['', Validators.required],
      horarios: [[], Validators.required],
      local: this.fb.group({
        endereco: ['', Validators.required],
        bairro: ['', Validators.required]
      })
    });

    const localForm = form.get("local") as FormGroup;

    const optionsName: option[] = modNames.map(option => {
      return {
        id: option, text: option, status: !1, action() {
          form.get("name")?.setValue(option, { emitEvent: false });
        }
      }
    }).sort(({ status: a }, { status: b }) => {
      if (a > b) return -1;

      return 0;
    });

    formRef.setInput('index', this.modalidadesView.length - 1);
    formRef.setInput('titleForm', 'Escolha uma modalidade!');
    formRef.setInput('titleSmall', !0);
    formRef.setInput('createMod', {
      form,
      formInputsList: [
        { form, controlName: 'name', inputText: 'Modalidades', options: optionsName },
        { form, controlName: 'horarios', inputText: 'Horarios', builderOptions: [] },
        { form: localForm, controlName: 'endereco', inputText: 'Endereco' },
        { form: localForm, controlName: 'bairro', inputText: 'Bairro' }
      ],
      autoGenerateForms: !0,
      submitEvent: (modalidade: modalidade) => this.submitNewMod(modalidade, { form, formRef }),
    });
    formRef.setInput('freezeForm', (freeze: boolean) => formRef.setInput('isFreeze', freeze));

    this.enableCreateMod = !1;
  }
}