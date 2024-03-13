import { Component } from '@angular/core';
import { CadastrosHeaderComponent } from '../../../components/cadastros-header/cadastros-header.component';
import { MainComponent } from '../../../components/main/main.component';
import { FormCadastroComponent } from '../../../components/form-cadastro/form-cadastro.component';
import { FormInputComponent } from '../../../components/form-cadastro/form-input/form-input.component';
import { FormTableComponent } from '../../../components/form-cadastro/form-table/form-table.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { gender } from '../../../types';

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

  /**
   * inscricoes: [{aula, horario}, {aula, horario}]
   * }
   */

  genders: gender[] = [
    { id: 'MASCULINO', text: 'Masculino' },
    { id: 'FEMININO', text: 'Feminino' },
    { id: 'OUTRO', text: 'Outro' }
  ];

  form = this.fb.group({
    nome_comp: ['', Validators.required],
    cpf: ['', [Validators.required, Validators.minLength(11)]],
    solic: this.fb.group({
      desc: '',
      role: 'ALUNO'
    }),
    aluno: this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      tel: ['', [Validators.required, Validators.minLength(11)]],
      endereco: ['', Validators.required],
      bairro: ['', Validators.required],
      data_nasc: ['', Validators.required],
      sexo: ['', Validators.required]
    })
  });

  solicGroup = this.form.get('solic') as FormGroup;
  alunoGroup = this.form.get('aluno') as FormGroup;
}