import { Component, OnInit } from '@angular/core';
import { CadastrosHeaderComponent } from '../../../components/cadastros-header/cadastros-header.component';
import { MainComponent } from '../../../components/main/main.component';
import { FormComponent } from '../../../components/form/form.component';
import { FormInputComponent } from '../../../components/form/form-table/form-input/form-input.component';
import { formTitle, genders, options } from '../../../types';
import { FormTableComponent } from '../../../components/form/form-table/form-table.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CadastroService } from '../../../services/cadastro.service';
import { User } from '../../../interfaces';
import { FormLinkComponent } from '../../../components/form-link/form-link.component';

@Component({
  selector: 'app-funcionario',
  standalone: true,
  imports: [
    CadastrosHeaderComponent,
    MainComponent,
    FormComponent,
    FormInputComponent,
    FormTableComponent,
    FormLinkComponent
  ],
  templateUrl: './funcionario.component.html',
  styleUrl: './funcionario.component.scss'
})
export class FuncionarioComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private cadastro: CadastroService
  ) { }

  genders: genders = [
    { id: 'MASCULINO', text: 'Masculino', status: !0 },
    { id: 'FEMININO', text: 'Feminino', status: !1 },
    { id: 'OUTRO', text: 'Outro', status: !1 }
  ];

  logTeste(){
    console.log(this.cadastro);
  }

  submitFunction = (res: any, form: FormGroup) => {
    const prismaUser = this.cadastro.createUser(res as User);
    const findedUser = this.cadastro.searchUser(res.cpf);

    findedUser.subscribe(user => {
      if (!user) prismaUser.subscribe({
        error(err) {
          console.log(err);
        }, complete() {
          form.reset();
        }
      });
      else console.table(user);
    });
  };

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
  }

  alunoEnable: boolean = !0;
  professorEnable: boolean = !1;
  adminEnable: boolean = !1;

  roles: options = [
    {
      id: 'ALUNO', text: 'Aluno', status: this.alunoEnable, action: () => {
        this.alunoEnable = !this.alunoEnable;
        this.findRole('ALUNO').status = this.alunoEnable;

        this.switchValidators(this.alunoEnable, this.alunoGroup, {
          email: [Validators.required, Validators.email],
          tel: [Validators.required, Validators.minLength(11)],
          endereco: [Validators.required],
          bairro: [Validators.required],
          data_nasc: [Validators.required],
          sexo: [Validators.required]
        });

        this.updateRoles();
      }
    },
    {
      id: 'PROFESSOR', text: 'Professor', status: this.professorEnable, action: () => {
        this.professorEnable = !this.professorEnable;
        this.findRole('PROFESSOR').status = this.professorEnable;

        this.switchValidators(this.professorEnable, this.professorGroup, {});

        this.updateRoles();
      }
    },
    {
      id: 'ADMIN', text: 'Admin', status: this.adminEnable, action: () => {
        this.adminEnable = !this.adminEnable;
        this.findRole('ADMIN').status = this.adminEnable;

        this.switchValidators(this.adminEnable, this.adminGroup, {});

        this.updateRoles();
      }
    }
  ];

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
    { id: 'professor', title: 'Professor' },
    { id: 'admin', title: 'Admin' },
    { id: 'custom', title: 'Customizado' }
  ];

  professor = this.switchForms[0];
  admin = this.switchForms[1];
  custom = this.switchForms[2];

  professorForm = this.fb.group({
    nome_comp: ['', Validators.required],
    cpf: ['', [Validators.required, Validators.minLength(11)]],
    password: ['', Validators.required],
    solic: this.fb.group({ roles: [['PROFESSOR']] }),
    professor: this.fb.group({})
  });

  adminForm = this.fb.group({
    nome_comp: ['', Validators.required],
    cpf: ['', [Validators.required, Validators.minLength(11)]],
    password: ['', Validators.required],
    solic: this.fb.group({ roles: [['ADMIN']] }),
    admin: this.fb.group({})
  });

  customForm = this.fb.group({
    nome_comp: ['', Validators.required],
    cpf: ['', [Validators.required, Validators.minLength(11)]],
    password: ['', Validators.required],
    solic: this.fb.group({ roles: [[]] }),
    aluno: this.fb.group({
      email: [''],
      tel: [''],
      endereco: [''],
      bairro: [''],
      data_nasc: [''],
      sexo: ['']
    }),
    professor: this.fb.group({}),
    admin: this.fb.group({})
  });

  solicForm = this.customForm.get('solic') as FormGroup;

  alunoGroup = this.customForm.get('aluno') as FormGroup;
  professorGroup = this.customForm.get('professor') as FormGroup;
  adminGroup = this.customForm.get('admin') as FormGroup;
}