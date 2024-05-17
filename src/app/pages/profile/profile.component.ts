import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { HeaderButtonComponent } from '../../components/header/header-button/header-button.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MainComponent } from '../../components/main/main.component';
import { FormTableComponent } from '../../components/form/form-table/form-table.component';
import { FormInputComponent } from '../../components/form/form-table/form-input/form-input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CadastroService } from '../../services/cadastro.service';
import { genders, inscricao, option, PrismaAluno, PrismaUser } from '../../types';
import { MyValidators } from '../../tools';
import { HorariosListComponent } from '../../components/horarios-list/horarios-list.component';
import { updateUser } from '../../interfaces';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
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
export class ProfileComponent extends MyValidators implements OnInit, AfterContentChecked {
  constructor(
    private router: Router,
    private cadastro: CadastroService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    super();
  }

  user?: PrismaUser;
  aluno?: PrismaAluno;
  inscricoes?: inscricao[];
  isAdmin: boolean = !1;
  hasHorarios: boolean = !1;
  noUsers: boolean = !1;

  oldValue: any = {};

  genders: genders = [
    { id: 'MASCULINO', text: 'Masculino' },
    { id: 'FEMININO', text: 'Feminino' },
    { id: 'OUTRO', text: 'Outro' }
  ];

  status: option[] = [
    {
      id: 'ATIVO', text: 'Ativo', action: (i: number) => {
        this.form.get("status")?.setValue(this.status[i].id);
      }
    },
    {
      id: 'INATIVO', text: 'Inativo', action: (i: number) => {
        this.form.get("status")?.setValue(this.status[i].id);
      }
    }
  ];

  statusLoaded: boolean = !1;

  ngOnInit(): void {
    const refresh = this.cadastro.auth.refreshToken();
    const cpf = this.route.snapshot.paramMap.get("cpf");
    const user = cpf ? this.cadastro.search.searchUser(cpf) : this.cadastro.search.searchUserByToken();

    if (cpf) this.isAdmin = !0;

    refresh.subscribe({
      error: this.logoutButton, complete: () => user.subscribe({
        error: this.logoutButton, next: prismaUser => this.user = prismaUser, complete: () => {
          if (!this.user) this.noUsers = !0;
          else {
            const { roles } = this.user;
            const aluno = this.cadastro.search.searchAlunoById(this.user.id);

            this.appendValues(this.form, this.user, 'nome_comp', 'cpf', 'email', 'tel', 'status');

            const statusValue = this.form.get("status")?.value;

            if (statusValue) {
              const opt = this.status.find(({ id }) => id == statusValue);

              if (opt) {
                opt.status = !0;

                this.statusLoaded = !0;
              }
            };

            if (roles.includes('PROFESSOR') || (roles.includes('ALUNO') && this.isAdmin)) {
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

                const sexoValue = this.formAluno.get("sexo")?.value;

                if (sexoValue) {
                  const opt = this.genders.find(({ id }) => id == sexoValue);

                  if (opt) opt.status = !0;
                };
              }
            });
            else {
              this.form.removeControl('aluno' as never);

              setTimeout(() => this.updateOld(this.form.value));
            };

            if (!roles.includes('PROFESSOR')) this.form.removeControl('professor' as never);

            if (!roles.includes('ADMIN')) this.form.removeControl('admin' as never);
          };
        }
      })
    });
  }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
  }

  updateOld = (value: any) => {
    this.oldValue = value;
  }

  appendValues(form: FormGroup, prisma: PrismaUser | PrismaAluno,
    ...values: string[]) {
    for (const value of values) {
      const prismaValue = (prisma as any)[value];

      if (value == 'data_nasc') {
        const data = new Date(prismaValue);
        const formatted = data.toJSON().split('T')[0];

        form.get(value)?.setValue(formatted, { emitEvent: !1 });
      } else form.get(value)?.setValue(prismaValue, { emitEvent: !1 });
    };
  }

  goDashboard = () => {
    this.router.navigate(["/dashboard"]);
  }

  logoutButton = () => {
    localStorage.removeItem("auth");
    this.router.navigate(["/login"]);
  }

  updateUser = (update: updateUser) => {
    const updatePrismaUser = this.cadastro.auth.updateUser(update.cpf as string, update);

    updatePrismaUser.subscribe(() => location.reload());
  }

  form: FormGroup<any> = this.fb.group({
    nome_comp: ['', Validators.required],
    cpf: ['', this.validCPFAndTel],
    email: ['', [Validators.required, Validators.email]],
    tel: ['', Validators.required],
    password: [''],
    status: [''],
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
