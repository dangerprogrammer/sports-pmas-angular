import { Component } from '@angular/core';
import { CadastrosHeaderComponent } from '../../../components/cadastros-header/cadastros-header.component';
import { MainComponent } from '../../../components/main/main.component';
import { FormComponent } from '../../../components/form/form.component';
import { FormInputComponent } from '../../../components/form/form-table/form-input/form-input.component';
import { FormTableComponent } from '../../../components/form/form-table/form-table.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { genders } from '../../../types';
import { CadastroService } from '../../../services/cadastro.service';
import { User } from '../../../interfaces';
import { FormLinkComponent } from '../../../components/form-link/form-link.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aluno',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CadastrosHeaderComponent,
    MainComponent,
    FormComponent,
    FormInputComponent,
    FormTableComponent,
    FormLinkComponent
  ],
  templateUrl: './aluno.component.html',
  styleUrl: './aluno.component.scss'
})
export class AlunoComponent {
  constructor(
    private fb: FormBuilder,
    private cadastro: CadastroService,
    private router: Router
  ) { }

  genders: genders = [
    { id: 'MASCULINO', text: 'Masculino', status: !0 },
    { id: 'FEMININO', text: 'Feminino', status: !0 },
    { id: 'OUTRO', text: 'Outro', status: !1 }
  ];

  submitFunction = (res: any, form: FormGroup) => {
    const prismaUser = this.cadastro.createUser(res as User);
    const findedUser = this.cadastro.searchUser(res.cpf);

    findedUser.subscribe(user => {
      if (!user) prismaUser.subscribe({
        error: (err) => {
          console.log(err);
        }, complete: () => {
          form.reset();
          this.router.navigate(["/dashboard"]);
        }
      });
      else console.table(user);
    });
  };

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