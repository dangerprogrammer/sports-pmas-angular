import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { CadastrosHeaderComponent } from '../../../components/cadastros-header/cadastros-header.component';
import { MainComponent } from '../../../components/main/main.component';
import { FormComponent } from '../../../components/form/form.component';
import { FormInputComponent } from '../../../components/form/form-table/form-input/form-input.component';
import { formTitle, genders, option } from '../../../types';
import { FormTableComponent } from '../../../components/form/form-table/form-table.component';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CadastroService } from '../../../services/cadastro.service';
import { FormLinkComponent } from '../../../components/form-link/form-link.component';
import { NotificationsListComponent } from '../../../components/notifications-list/notifications-list.component';
import { NotificationService } from '../../../services/notification.service';
import { CadastroSubmit } from '../../../tools';
import { HorariosListComponent } from '../../../components/horarios-list/horarios-list.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-funcionario',
  standalone: true,
  imports: [
    CadastrosHeaderComponent,
    MainComponent,
    FormComponent,
    FormInputComponent,
    FormTableComponent,
    FormLinkComponent,
    NotificationsListComponent,
    HorariosListComponent,
    NgIf
  ],
  templateUrl: './funcionario.component.html',
  styleUrl: './funcionario.component.scss'
})
export class FuncionarioComponent extends CadastroSubmit implements OnInit, AfterViewInit {
  constructor(
    private fb: FormBuilder,
    private service: CadastroService
  ) {
    super()
  }

  @ViewChild('notifications', { read: ViewContainerRef }) notifications!: ViewContainerRef;

  genders: genders = [
    { id: 'MASCULINO', text: 'Masculino', status: !0 },
    { id: 'FEMININO', text: 'Feminino', status: !1 },
    { id: 'OUTRO', text: 'Outro', status: !1 }
  ];
  submitTexts: string[] = ['Cadastrar', 'Cadastrar', 'Cadastrar'];

  ngOnInit(): void {
    this.switchValidators(this.alunoEnable, this.alunoGroup, {
      email: [Validators.required, Validators.email],
      tel: [Validators.required, Validators.minLength(11)],
      endereco: [Validators.required],
      bairro: [Validators.required],
      data_nasc: [Validators.required],
      sexo: [Validators.required]
    });

    this.switchValidators(this.professorEnable, this.professorGroup, {});

    this.switchValidators(this.adminEnable, this.adminGroup, {});

    this.updateRoles();

    [this.professorForm, this.adminForm, this.customForm].forEach(this.verifyCPFFrom);
  }

  verifyCPFFrom = (form: FormGroup, indexForm: number) => {
    const cpf = form.get('cpf');

    cpf?.valueChanges.subscribe((data: string) => {
      const searchUser = this.service.search.searchUser(data as string);

      if (data) searchUser.subscribe(user => this.switchForms[indexForm].submitText = user ? 'Solicitar' : 'Cadastrar');
    });
  }

  ngAfterViewInit(): void {
    this.notification = new NotificationService(this.notifications);
  }

  alunoEnable: boolean = !0;
  professorEnable: boolean = !1;
  adminEnable: boolean = !1;

  findRole = (roleId: 'ALUNO' | 'PROFESSOR' | 'ADMIN') => this.roles.find(({ id }) => roleId == id) as any;

  switchValidators(enable: boolean, form: FormGroup, fields: any) {
    for (const field in fields) {
      const formField = form.get(field);

      if (enable) formField?.setValidators(fields[field]);
      else formField?.removeValidators(fields[field]);

      formField?.updateValueAndValidity();
    }
  };

  updateRoles() {
    this.solicForm.get("roles")?.setValue(this.roles.filter(({ status }) => status).map(({ id }) => id));
  }

  switchForms: formTitle[] = [
    { id: 'professor', title: 'Professor', submitText: 'Cadastrar' },
    { id: 'admin', title: 'Admin', submitText: 'Cadastrar' },
    { id: 'custom', title: 'Customizado', submitText: 'Cadastrar' }
  ];

  professor = this.switchForms[0];
  admin = this.switchForms[1];
  custom = this.switchForms[2];

  professorForm = this.fb.group({
    nome_comp: ['', Validators.required],
    cpf: ['', this.myvalidators.validCPFAndTel],
    email: ['', [Validators.required, Validators.email]],
    tel: [''],
    password: ['', Validators.required],
    solic: this.fb.group({ roles: [['PROFESSOR']] }),
    professor: this.fb.group({}),
    inscricoes: [[], Validators.required]
  });

  adminForm = this.fb.group({
    nome_comp: ['', Validators.required],
    cpf: ['', this.myvalidators.validCPFAndTel],
    email: ['', [Validators.required, Validators.email]],
    tel: [''],
    password: ['', Validators.required],
    solic: this.fb.group({ roles: [['ADMIN']] }),
    admin: this.fb.group({})
  });

  customForm = this.fb.group({
    nome_comp: ['', Validators.required],
    cpf: ['', this.myvalidators.validCPFAndTel],
    email: ['', [Validators.required, Validators.email]],
    tel: [''],
    password: ['', Validators.required],
    solic: this.fb.group({ roles: [[]] }),
    aluno: this.fb.group({
      endereco: [''],
      bairro: [''],
      data_nasc: [''],
      sexo: ['']
    }),
    professor: this.fb.group({}),
    admin: this.fb.group({}),
    inscricoes: [[], Validators.required]
  });

  solicForm = this.customForm.get('solic') as FormGroup;

  alunoGroup = this.customForm.get('aluno') as FormGroup;
  professorGroup = this.customForm.get('professor') as FormGroup;
  adminGroup = this.customForm.get('admin') as FormGroup;

  roles: option[] = [
    {
      id: 'ALUNO', text: 'Aluno', submitText: 'Cadastrar', form: this.alunoGroup, status: this.alunoEnable, action: () => {
        this.alunoEnable = !this.alunoEnable;
        this.findRole('ALUNO').status = this.alunoEnable;

        this.switchValidators(this.alunoEnable, this.alunoGroup, {
          endereco: [Validators.required],
          bairro: [Validators.required],
          data_nasc: [Validators.required],
          sexo: [Validators.required]
        });

        this.updateRoles();
      }
    },
    {
      id: 'PROFESSOR', text: 'Professor', submitText: 'Cadastrar', form: this.professorGroup, status: this.professorEnable, action: () => {
        this.professorEnable = !this.professorEnable;
        this.findRole('PROFESSOR').status = this.professorEnable;

        this.switchValidators(this.professorEnable, this.professorGroup, {});

        this.updateRoles();
      }
    },
    {
      id: 'ADMIN', text: 'Admin', submitText: 'Cadastrar', form: this.adminGroup, status: this.adminEnable, action: () => {
        this.adminEnable = !this.adminEnable;
        this.findRole('ADMIN').status = this.adminEnable;

        this.switchValidators(this.adminEnable, this.adminGroup, {});

        this.updateRoles();
      }
    }
  ];
}