import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { HeaderButtonComponent } from '../../components/header/header-button/header-button.component';
import { Router } from '@angular/router';
import { MainComponent } from '../../components/main/main.component';
import { FormTableComponent } from '../../components/form/form-table/form-table.component';
import { FormInputComponent } from '../../components/form/form-table/form-input/form-input.component';
import { FormBuilder, Validators } from '@angular/forms';
import { CadastroService } from '../../services/cadastro.service';
import { PrismaAluno, PrismaUser } from '../../types';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    HeaderComponent,
    HeaderButtonComponent,
    MainComponent,
    FormTableComponent,
    FormInputComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  constructor(
    private router: Router,
    private cadastro: CadastroService,
    private fb: FormBuilder
  ) {}

  user!: PrismaUser;
  aluno?: PrismaAluno;

  ngOnInit(): void {
    const user = this.cadastro.search.searchUserByToken();

    user.subscribe(prismaUser => {
      this.user = prismaUser;

      const aluno = this.cadastro.search.searchAlunoById(prismaUser.id);

      if (prismaUser.roles.includes('ALUNO')) aluno.subscribe(prismaAluno => this.aluno = prismaAluno);
      console.log(prismaUser);
    });
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
    cpf: ['', ],
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
}
