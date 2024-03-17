import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { MainComponent } from '../../components/main/main.component';
import { FormComponent } from '../../components/form/form.component';
import { FormTableComponent } from '../../components/form/form-table/form-table.component';
import { FormInputComponent } from '../../components/form/form-table/form-input/form-input.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CadastroService } from '../../services/cadastro.service';
import { User } from '../../interfaces';
import { FormLinkComponent } from '../../components/form-link/form-link.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    HeaderComponent,
    BackButtonComponent,
    MainComponent,
    FormComponent,
    FormTableComponent,
    FormInputComponent,
    FormLinkComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(
    private fb: FormBuilder,
    private cadastro: CadastroService,
    private router: Router
  ) { }

  submitFunction = (res: any, form: FormGroup) => {
    const that = this;
    const findedUser = this.cadastro.searchUser(res.cpf);

    findedUser.subscribe((user: any) => {
      if (!user) return console.log('Não existe alguém com este CPF!');

      const { nome_comp } = user;
      const login = this.cadastro.loginUser({ ...res, nome_comp } as User);

      login.subscribe({
        error(err) {
          console.log(err);
        }, complete() {
          console.log(that.cadastro.token);
          that.router.navigate(['/dashboard']);
        },
      });
    });
  }

  form = this.fb.group({
    cpf: ['', [Validators.required]],
    password: ['', Validators.required]
  });
}
