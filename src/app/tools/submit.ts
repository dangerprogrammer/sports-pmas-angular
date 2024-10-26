import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { User } from "../interfaces";
import { NotificationService } from "../services/notification.service";
import { ComponentRef, inject, ViewContainerRef } from "@angular/core";
import { CadastroService } from "../services/cadastro.service";
import { Router } from "@angular/router";
import { FormComponent } from "../components/form/form.component";
import { horario, modalidade, option, PrismaModalidade, PrismaUser } from "../types";
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

  submitFunction = (res: User, form: FormGroup, user?: PrismaUser) => {
    const prismaUser = this.cadastro.auth.createUser(res);
    const findedUser = this.cadastro.search.searchUser(res.cpf);

    const isAdmin = user?.roles.includes('ADMIN');

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

          if (isAdmin) {
            const { cpf } = res;

            const acceptPrisma = this.cadastro.auth.acceptUser({ cpf, accepted: !0 });

            acceptPrisma.subscribe({
              error: (err: any) => {
                console.log(err);
                this.notification.addNotification({
                  text: err.message,
                  error: !0,
                  headerText: err.status
                });
              }, complete: () => {
                this.notification.addNotification({
                  text: 'Cadastro realizado com sucesso!',
                  duration: 3
                });

                setTimeout(() => this.router.navigate(["/dashboard"]), 3.5e3);
              }
            });
          } else {
            this.notification.addNotification({
              text: 'Cadastro realizado com sucesso!\nRedirecionando para login...',
              duration: 3
            });

            const { cpf, password } = res;
            this.cadastro.loginData = { cpf, password };
            setTimeout(() => this.router.navigate(["/login"]), 3.5e3);
          };
        }
      });
      else {
        const { cpf, solic } = res, { roles } = solic;
        const createSolic = this.cadastro.auth.createSolic({ roles, cpf });
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
  errorMsg: string = 'Erro! Usuário não encontrado!';

  submitFunction = (res: any) => {
    const findedUser = this.cadastro.search.searchUser(res.cpf);

    this.hasError = !1;
    findedUser.subscribe(user => {
      if (!user || !user.accepted) {
        this.hasError = !0;
        return;
      };

      const login = this.cadastro.auth.loginUser(res as User);

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

  modalidadesList: PrismaModalidade[] = [];
  modalidadesView!: ViewContainerRef;
  availableNames: string[] = [];

  searchModSubmit = ({
    modalidades, data
  }: {
    modalidades: PrismaModalidade[], data?: { form: FormGroup, formRef: ComponentRef<any> }
  }) => {
    this.modalidadesList = modalidades.sort(({ name: nameA }, { name: nameB }) =>
      nameA > nameB ? 1 : nameA < nameB ? -1 : 0
    );

    if (data) {
      const { form, formRef } = data;

      formRef.setInput('isFreeze', !1);
      form.setErrors({ 'equal': !0 });
    };

    this.modalidadesView.clear();

    const prismaHorariosList = this.modalidadesList.map(this.cadastro.search.searchHorarios);

    forkJoin(prismaHorariosList).subscribe(data => {
      for (const index in data) {
        const modalidade = this.modalidadesList[index];
        const horarios = data[index];

        this.addExistingMod(modalidade, horarios);
      };
    });
  }

  submitExistingMod = (name: string, update: Partial<modalidade>, data: { form: FormGroup, formRef: ComponentRef<any> }) => {
    const updateMod = this.cadastro.auth.updateModalidade(name, update);
    const prismaModalidades = this.cadastro.search.searchModalidades();

    updateMod.subscribe(() => prismaModalidades.subscribe(modalidades =>
      this.searchModSubmit({ modalidades, data })
    ));
  };

  addExistingMod = (modalidade: PrismaModalidade, horarios: horario[]) => {
    const formRef = this.modalidadesView.createComponent(FormComponent);
    const formatHorarios = horarios.map(horario => {
      const time = this.formatTime(horario.time);

      return { ...horario, time };
    });

    let form = this.fb.group({
      name: [modalidade.name, Validators.required],
      horarios: [formatHorarios.map(({ day, time }) => { return { id: 0, text: `${day} - ${time}`, status: !1 } }), horarios.length && Validators.required],
      local: this.fb.group({
        endereco: [modalidade.endereco, Validators.required],
        bairro: [modalidade.bairro, Validators.required]
      }),
      vagas: [modalidade.vagas, Validators.required]
    });

    const oldValue = { ...form.value };

    const localForm = form.get("local") as FormGroup;

    formRef.setInput('index', this.modalidadesView.length - 1);
    formRef.setInput('titleForm', modalidade.name);
    formRef.setInput('closeForm', () => this.closeMod(formRef, modalidade));
    formRef.setInput('createMod', {
      form,
      submitEventForms: !0,
      formInputsList: [
        { form, controlName: 'name', inputText: 'Modalidade', readMod: !0, modName: form.get('name')!.value },
        { form, controlName: 'horarios', inputText: 'Horários', builderOptions: formatHorarios.map(({ day, time }) => { return { id: 0, text: `${day} - ${time}`, status: !1 } }) },
        { form: localForm, controlName: 'endereco', inputText: 'Endereço' },
        { form: localForm, controlName: 'bairro', inputText: 'Bairro' },
        { form, controlName: 'vagas', inputText: 'Vagas' }
      ],
      oldValue,
      autoGenerateForms: !0,
      submitEvent: (update: Partial<modalidade>) => this.submitExistingMod(modalidade.name, update, { form, formRef }),
      submitText: 'Salvar',
      deleteEvent: !0,
      deleteText: 'Excluir'
    });
    formRef.setInput('freezeForm', (freeze: boolean) => formRef.setInput('isFreeze', freeze));
  }

  submitNewMod = (modalidade: modalidade, data: { form: FormGroup, formRef: ComponentRef<any> }) => {
    const createMod = this.cadastro.auth.createModalidade(modalidade);
    const prismaModalidades = this.cadastro.search.searchModalidades();

    createMod.subscribe(() => prismaModalidades.subscribe(modalidades => 
      this.searchModSubmit({ modalidades, data })
    ));
  }

  addNewMod = () => {
    const formRef = this.modalidadesView.createComponent(FormComponent);

    const form = this.fb.group({
      name: ['', Validators.required],
      horarios: [[], Validators.required],
      local: this.fb.group({
        endereco: ['', Validators.required],
        bairro: ['', Validators.required]
      }),
      vagas: [15, Validators.required]
    });

    const localForm = form.get("local") as FormGroup;

    formRef.setInput('index', this.modalidadesView.length - 1);
    formRef.setInput('titleForm', 'Crie uma modalidade!');
    formRef.setInput('titleSmall', !0);
    formRef.setInput('createMod', {
      form,
      submitEventForms: !0,
      formInputsList: [
        { form, controlName: 'name', inputText: 'Modalidade', readMod: !0 },
        { form, controlName: 'horarios', inputText: 'Horários', builderOptions: [] },
        { form: localForm, controlName: 'endereco', inputText: 'Endereço' },
        { form: localForm, controlName: 'bairro', inputText: 'Bairro' },
        { form, controlName: 'vagas', inputText: 'Vagas' }
      ],
      autoGenerateForms: !0,
      submitEvent: (modalidade: modalidade) => this.submitNewMod(modalidade, { form, formRef }),
      submitText: 'Criar'
    });
    formRef.setInput('freezeForm', (freeze: boolean) => formRef.setInput('isFreeze', freeze));
  }

  closeMod = (formRef: ComponentRef<any>, { name }: PrismaModalidade) => {
    const deleteMod = this.cadastro.auth.deleteModalidade(name);

    deleteMod.subscribe(() => {
      const prismaModalidades = this.cadastro.search.searchModalidades();

      prismaModalidades.subscribe(modalidades => {
        formRef.destroy();

        this.searchModSubmit({ modalidades });
      });
    });
  }
}