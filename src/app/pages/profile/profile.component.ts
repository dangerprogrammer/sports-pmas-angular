import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { HeaderButtonComponent } from '../../components/header/header-button/header-button.component';
import { Router } from '@angular/router';
import { MainComponent } from '../../components/main/main.component';
import { FormTableComponent } from '../../components/form/form-table/form-table.component';
import { FormInputComponent } from '../../components/form/form-table/form-input/form-input.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CadastroService } from '../../services/cadastro.service';
import { inscricao, PrismaAluno, PrismaUser } from '../../types';
import { MyValidators } from '../../tools';
import { HorariosListComponent } from '../../components/horarios-list/horarios-list.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    HeaderComponent,
    HeaderButtonComponent,
    MainComponent,
    FormTableComponent,
    FormInputComponent,
    HorariosListComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent extends MyValidators implements OnInit {
  constructor(
    private router: Router,
    private cadastro: CadastroService,
    private fb: FormBuilder
  ) {
    super();
  }

  user!: PrismaUser;
  aluno?: PrismaAluno;
  inscricoes?: inscricao[];
  hasHorarios: boolean = !1;

  ngOnInit(): void {
    const user = this.cadastro.search.searchUserByToken();
    const refresh = this.cadastro.auth.refreshToken();

    refresh.subscribe({
      error: this.logoutButton, complete: () => user.subscribe({
        error: this.logoutButton, next: prismaUser => {
          this.user = prismaUser;
        }, complete: () => {
          const { roles } = this.user;
          const aluno = this.cadastro.search.searchAlunoById(this.user.id);

          this.appendValues(this.form, this.user, 'nome_comp');

          const nome_comp = this.form.get("nome_comp");
          const cpf = this.form.get("cpf");
          const email = this.form.get("email");
          const tel = this.form.get("tel");
          const formInscricoes = this.form.get("inscricoes");

          nome_comp?.setValue(this.user.nome_comp);
          cpf?.setValue(this.user.cpf);
          email?.setValue(this.user.email);
          tel?.setValue(this.user.tel);

          if (roles.includes('ALUNO') || roles.includes('PROFESSOR')) {
            this.hasHorarios = !0;
            this.cadastro.search.searchInscricoes(this.user.id).subscribe(({ inscricoes, modalidades }) => {
              this.inscricoes = inscricoes;
            });
          };
          if (roles.includes('ALUNO')) aluno.subscribe(prismaAluno => this.aluno = prismaAluno);
        }
      })
    });
  }

  appendValues(form: FormGroup, prisma: PrismaUser, ...values: ('nome_comp' | 'cpf' | 'email' | 'tel')[]) {
    for (const value of values) form.get(value)?.setValue(prisma[value]);
  }

  goDashboard = () => {
    this.router.navigate(["/dashboard"]);
  }

  logoutButton = () => {
    localStorage.removeItem("auth");
    this.router.navigate(["/login"]);
  }

  updateUser = () => {
    console.log("submit update!");
  }

  form = this.fb.group({
    nome_comp: ['', Validators.required],
    cpf: ['', this.validCPFAndTel],
    email: ['', [Validators.required, Validators.email]],
    tel: [''],
    password: ['', Validators.required],
    solic: this.fb.group({ roles: [[]] }),
    aluno: this.fb.group({
      endereco: [''],
      bairro: [''],
      data_nasc: [''],
      sexo: ['']
    }),
    professor: this.fb.group({}),
    admin: this.fb.group({}),
    inscricoes: [[], Validators.required]
  });

  formAluno = this.form.get("aluno") as FormGroup;
}
