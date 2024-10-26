import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { CadastrosHeaderComponent } from '../../../components/cadastros-header/cadastros-header.component';
import { MainComponent } from '../../../components/main/main.component';
import { FormComponent } from '../../../components/form/form.component';
import { FormInputComponent } from '../../../components/form/form-table/form-input/form-input.component';
import { FormTableComponent } from '../../../components/form/form-table/form-table.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { genders, PrismaUser } from '../../../types';
import { CadastroService } from '../../../services/cadastro.service';
import { FormLinkComponent } from '../../../components/form-link/form-link.component';
import { NgComponentOutlet } from '@angular/common';
import { NotificationsListComponent } from '../../../components/notifications-list/notifications-list.component';
import { NotificationService } from '../../../services/notification.service';
import { HorariosListComponent } from '../../../components/horarios-list/horarios-list.component';
import { CadastroSubmit } from '../../../tools';
import { Router } from '@angular/router';
import { User } from '../../../interfaces';

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
    FormLinkComponent,
    NgComponentOutlet,
    NotificationsListComponent,
    HorariosListComponent
  ],
  templateUrl: './aluno.component.html',
  styleUrl: './aluno.component.scss'
})
export class AlunoComponent extends CadastroSubmit implements OnInit, AfterViewInit {
  constructor(
    private fb: FormBuilder,
    private route: Router,
    private service: CadastroService
  ) {
    super();
  }

  @ViewChild('notifications', { read: ViewContainerRef }) notifications!: ViewContainerRef;

  notificationsCount: number = 0;

  genders: genders = [
    { id: 'MASCULINO', text: 'Masculino', status: !0 },
    { id: 'FEMININO', text: 'Feminino', status: !1 },
    { id: 'OUTRO', text: 'Outro', status: !1 }
  ];

  submitText: string = 'Cadastrar';

  submit = (res: User, form: FormGroup) => this.submitFunction(res, form, this.user);

  user?: PrismaUser;

  ngOnInit(): void {
    if (!this.service.token) return;
    
    const userByToken = this.service.search.searchUserByToken();
    const refresh = this.service.auth.refreshToken();

    refresh.subscribe({
      error: this.logout, complete: () => userByToken.subscribe({
        error: this.logout, next: user => this.user = user
      })
    })
  }

  logout = () => {
    localStorage.removeItem("auth");
    this.route.navigate(["/login"]);
  }

  ngAfterViewInit(): void {
    this.notification = new NotificationService(this.notifications);
  }

  form = this.fb.group({
    nome_comp: ['', Validators.required],
    cpf: ['', this.myvalidators.validCPFAndTel],
    password: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    tel: [''],
    solic: this.fb.group({ roles: [['ALUNO']] }),
    aluno: this.fb.group({
      endereco: ['', Validators.required],
      bairro: ['', Validators.required],
      data_nasc: ['', Validators.required],
      sexo: ['', Validators.required]
    }),
    inscricoes: [[], Validators.required]
  });

  alunoGroup = this.form.get('aluno') as FormGroup;
}