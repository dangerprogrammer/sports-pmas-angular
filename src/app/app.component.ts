import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CadastroService } from './services/cadastro.service';
import { User } from './interfaces';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(
    private cadastro: CadastroService
  ) { }

  generatedUsers: any[] = [];
  generateSize = 1e3;

  ngOnInit(): void {
    // this.generateUser(0);
  }

  generateUser = (i: number) => {
    const generateCPF = `${i}`;

    let spaces = '';
    while (spaces.length < (11 - generateCPF.length)) spaces += '0';

    const cpf = spaces + generateCPF;

    const userGenerated: User = {
      nome_comp: `Aluno ${i}`,
      cpf,
      password: '123456',
      tel: '00 00000-0000',
      email: `aluno${i}@gmail.com`,
      inscricoes: [],
      solic: {
        roles: ['ALUNO']
      },
      aluno: {
        endereco: 'Avenida X',
        bairro: 'Bairro Y',
        data_nasc: new Date(2004, 11, 10),
        sexo: 'MASCULINO'
      }
    };

    const prismaUser = this.cadastro.createUser(userGenerated);
    const findedUser = this.cadastro.searchUser(cpf);

    findedUser.subscribe(user => {
      if (!user) prismaUser.subscribe({
        error: () => this.generateUser(i),
        next: value => {
          this.generatedUsers.push(value);
        }, complete: () => {
          if (i < (this.generateSize - 1)) this.generateUser(i + 1);
          console.clear();
          console.log(`Aluno ${i} cadastrado!`, this.generatedUsers[this.generatedUsers.length - 1]);
          console.log(this.generatedUsers);
        }
      });
      else if (i < (this.generateSize - 1)) this.generateUser(i + 1);
    });
  }
}
