import { Component } from '@angular/core';
import { CadastrosHeaderComponent } from '../../../components/cadastros-header/cadastros-header.component';
import { MainComponent } from '../../../components/main/main.component';
import { FormCadastroComponent } from '../../../components/form-cadastro/form-cadastro.component';
import { FormInputComponent } from '../../../components/form-cadastro/form-table/form-input/form-input.component';
import { formTitle, gender, options } from '../../../types';
import { FormTableComponent } from '../../../components/form-cadastro/form-table/form-table.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-funcionario',
  standalone: true,
  imports: [CadastrosHeaderComponent, MainComponent, FormCadastroComponent, FormInputComponent, FormTableComponent],
  templateUrl: './funcionario.component.html',
  styleUrl: './funcionario.component.scss'
})
export class FuncionarioComponent {
  constructor(
    private fb: FormBuilder
  ) {}

  genders: gender[] = [
    { id: 'MASCULINO', text: 'Masculino' },
    { id: 'FEMININO', text: 'Feminino' },
    { id: 'OUTRO', text: 'Outro' }
  ];

  roles: options = [
    { id: 'ALUNO', text: 'Aluno', action: () => {
      this.alunoEnable = !this.alunoEnable;
      // VERIFICAR COMO FAZ PRA ALUNO NÃO SER REQUIRIDO
      // this.alunoGroup
    } },
    { id: 'PROFESSOR', text: 'Professor', action: () => {this.professorEnable = !this.professorEnable} },
    { id: 'ADMIN', text: 'Admin', action: () => {this.adminEnable = !this.adminEnable} }
  ];

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
      email: ['', [Validators.required, Validators.email]],
      tel: ['', [Validators.required, Validators.minLength(11)]],
      endereco: ['', Validators.required],
      bairro: ['', Validators.required],
      data_nasc: ['', Validators.required],
      sexo: ['', Validators.required]
    }),
    professor: this.fb.group({}),
    admin: this.fb.group({})
  });

  solicForm = this.customForm.get('solic') as FormGroup;

  alunoGroup = this.customForm.get('aluno') as FormGroup;
  professorGroup = this.customForm.get('professor') as FormGroup;
  adminGroup = this.customForm.get('admin') as FormGroup;

  alunoEnable: boolean = !1;
  professorEnable: boolean = !1;
  adminEnable: boolean = !1;
  
  protected activeState: string = this.switchForms[0].title;
}