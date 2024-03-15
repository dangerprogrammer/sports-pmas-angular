import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CadastroService } from '../../../../services/cadastro.service';
import { User } from '../../../../interfaces';

@Component({
  selector: 'form-submit',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-submit.component.html',
  styleUrl: './form-submit.component.scss'
})
export class FormSubmitComponent {
  constructor(
    private cadastro: CadastroService
  ) { }

  @Input() form!: FormGroup;

  submitForm(ev: Event) {
    ev.preventDefault();

    const userPrismaObj = this.form.value;

    if (userPrismaObj.aluno) userPrismaObj.aluno = {
      ...userPrismaObj.aluno,
      data_nasc: new Date(userPrismaObj.aluno.data_nasc).toISOString()
    };

    const prismaUser = this.cadastro.createUser(userPrismaObj as User);
    const findedUser = this.cadastro.searchUser(userPrismaObj.cpf);

    findedUser.subscribe(user => {
      if (!user) prismaUser.subscribe({
        error: (err) => {
          console.log(err);
        }, complete: () => {
          this.form.reset();
        }
      });
      else console.table(user);
    });
  }
}
