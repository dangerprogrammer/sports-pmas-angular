import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { HeaderButtonComponent } from '../../components/header/header-button/header-button.component';
import { Router } from '@angular/router';
import { MainComponent } from '../../components/main/main.component';
import { FormTableComponent } from '../../components/form/form-table/form-table.component';
import { FormInputComponent } from '../../components/form/form-table/form-input/form-input.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CadastroService } from '../../services/cadastro.service';
import { genders, inscricao, PrismaAluno, PrismaUser } from '../../types';
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
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    super();
  }

  user!: PrismaUser;
  aluno?: PrismaAluno;
  inscricoes?: inscricao[];
  hasHorarios: boolean = !1;

  oldValue: any = {};

  genders: genders = [
    { id: 'MASCULINO', text: 'Masculino', status: !0 },
    { id: 'FEMININO', text: 'Feminino', status: !1 },
    { id: 'OUTRO', text: 'Outro', status: !1 }
  ];

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

          this.appendValues(this.form, this.user, 'nome_comp', 'cpf', 'email', 'tel');

          if (roles.includes('ALUNO') || roles.includes('PROFESSOR')) {
            this.hasHorarios = !0;
            this.cadastro.search.searchInscricoes(this.user.id).subscribe(
              ({ inscricoes }) => this.inscricoes = inscricoes
            );
          };
          if (roles.includes('ALUNO')) aluno.subscribe({
            error: this.logoutButton, next: prismaAluno => this.aluno = prismaAluno,
            complete: () => {
              this.appendValues(this.formAluno, this.aluno as PrismaAluno,
                'endereco', 'bairro', 'data_nasc', 'sexo'
              );
            }
          });
          else setTimeout(() => this.updateOld(this.form.value));
        }
      })
    });
  }

  // FAZER O OUTPUT DE HORARIOS-LIST FUNCIONAR PARA FORM-TABLE
  updateOld = (value: any) => {
    this.oldValue = value;
    this.cdr.detectChanges();
  }

  appendValues(form: FormGroup, prisma: PrismaUser | PrismaAluno,
    ...values: string[]) {
    for (const value of values) {
      if (value == 'data_nasc') {
        const data = new Date((prisma as any)[value]);
        const formatted = data.toJSON().split('T')[0];

        form.get(value)?.setValue(formatted);
      } else form.get(value)?.setValue((prisma as any)[value]);
    };
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
    tel: ['', Validators.required],
    password: ['', Validators.required],
    aluno: this.fb.group({
      endereco: [''],
      bairro: [''],
      data_nasc: [''],
      sexo: ['']
    }),
    professor: this.fb.group({}),
    admin: this.fb.group({}),
    inscricoes: [[]]
  });

  formAluno = this.form.get("aluno") as FormGroup;
  formProfessor = this.form.get("professor") as FormGroup;
  formAdmin = this.form.get("admin") as FormGroup;
}
