import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
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
    private cadastro: CadastroService,
    private router: Router
  ) { }

  generateSize = 1e3;

  ngOnInit(): void {
    document.addEventListener('visibilitychange', () => this.visibilityChange());
    document.addEventListener('click', () => this.visibilityChange(!0));
    // this.generateUser(0);
  }

  clickable: boolean = !0;
  timeoutClick: number = 10e3;

  visibilityChange = (click: boolean = !1) => {
    const clickCondition = click ? this.clickable : !0;

    if (document.visibilityState == 'visible' && this.cadastro.token && clickCondition) {
      const userByToken = this.cadastro.search.searchUserByToken();
      const refresh = this.cadastro.auth.refreshToken();

      refresh.subscribe({ error: this.logout, complete: () =>
        userByToken.subscribe({ error: this.logout })
      });

      if (click) {
        this.clickable = !1;
        setTimeout(() => this.clickable = !0, this.timeoutClick);
      };
    };
  }

  logout = () => {
    localStorage.removeItem("auth");
    this.router.navigate(["/login"]);
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

    const prismaUser = this.cadastro.auth.createUser(userGenerated);
    const findedUser = this.cadastro.search.searchUser(cpf);

    findedUser.subscribe(user => {
      if (!user) prismaUser.subscribe({
        error: () => this.generateUser(i),
        next: value => {
        }, complete: () => {
          if (i < (this.generateSize - 1)) this.generateUser(i + 1);
          console.clear();
          console.log(`Aluno ${i} cadastrado!`);
        }
      });
      else if (i < (this.generateSize - 1)) {
        console.clear();
        console.log(`Aluno ${i} já existente!`);
        this.generateUser(i + 1);
      };
    });
  }
}
