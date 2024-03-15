import { Component } from '@angular/core';
import { CadastrosHeaderComponent } from '../../../components/cadastros-header/cadastros-header.component';
import { MainComponent } from '../../../components/main/main.component';
import { FormCadastroComponent } from '../../../components/form-cadastro/form-cadastro.component';
import { FormInputComponent } from '../../../components/form-cadastro/form-table/form-input/form-input.component';
import { formTitle } from '../../../types';
import { FormTableComponent } from '../../../components/form-cadastro/form-table/form-table.component';
import { FormBuilder, Validators } from '@angular/forms';

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
  
  protected activeState: string = this.switchForms[0].title;
}