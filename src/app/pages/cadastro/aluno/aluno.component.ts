import { Component } from '@angular/core';
import { CadastrosHeaderComponent } from '../../../components/cadastros-header/cadastros-header.component';
import { MainComponent } from '../../../components/main/main.component';
import { FormCadastroComponent } from '../../../components/form-cadastro/form-cadastro.component';
import { FormInputComponent } from '../../../components/form-cadastro/form-table/form-input/form-input.component';
import { FormTableComponent } from '../../../components/form-cadastro/form-table/form-table.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { genders } from '../../../types';

@Component({
  selector: 'app-aluno',
  standalone: true,
  imports: [ReactiveFormsModule, CadastrosHeaderComponent, MainComponent, FormCadastroComponent, FormInputComponent, FormTableComponent],
  templateUrl: './aluno.component.html',
  styleUrl: './aluno.component.scss'
})
export class AlunoComponent {
  constructor(
    private fb: FormBuilder
  ) { }

  genders: genders = [
    { id: 'MASCULINO', text: 'Masculino', status: !0 },
    { id: 'FEMININO', text: 'Feminino', status: !0 },
    { id: 'OUTRO', text: 'Outro', status: !1 }
  ];

  form = this.fb.group({
    nome_comp: ['', Validators.required],
    cpf: ['', [Validators.required, Validators.minLength(11)]],
    password: ['', Validators.required],
    solic: this.fb.group({ roles: [['ALUNO']] }),
    aluno: this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      tel: ['', [Validators.required, Validators.minLength(11)]],
      endereco: ['', Validators.required],
      bairro: ['', Validators.required],
      data_nasc: ['', Validators.required],
      sexo: ['', Validators.required]
    })
  });

  alunoGroup = this.form.get('aluno') as FormGroup;
}