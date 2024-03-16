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

  hasRole = (roles: any[], role: string) => roles.find(r => r == role);

  submitForm(ev: Event) {
    ev.preventDefault();

    const userPrisma = this.form.value;

    if (typeof userPrisma.solic.roles == "string") userPrisma.solic.roles = userPrisma.solic.roles.split(',');

    if (this.hasRole(userPrisma.solic.roles, "ALUNO")) userPrisma.aluno = {
      ...userPrisma.aluno,
      data_nasc: new Date(userPrisma.aluno.data_nasc).toISOString()
    };

    const prismaUser = this.cadastro.createUser(userPrisma as User);
    const findedUser = this.cadastro.searchUser(userPrisma.cpf);

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
