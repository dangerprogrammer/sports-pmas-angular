import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { CadastrosHeaderComponent } from '../../../components/cadastros-header/cadastros-header.component';
import { MainComponent } from '../../../components/main/main.component';
import { FormComponent } from '../../../components/form/form.component';
import { FormInputComponent } from '../../../components/form/form-table/form-input/form-input.component';
import { FormTableComponent } from '../../../components/form/form-table/form-table.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { genders } from '../../../types';
import { CadastroService } from '../../../services/cadastro.service';
import { FormLinkComponent } from '../../../components/form-link/form-link.component';
import { NgComponentOutlet } from '@angular/common';
import { NotificationsListComponent } from '../../../components/notifications-list/notifications-list.component';
import { NotificationService } from '../../../services/notification.service';
import { cadastroSubmit } from '../cadastro-submit';
import { HorariosListComponent } from '../../../components/horarios-list/horarios-list.component';
import { Router } from '@angular/router';

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
export class AlunoComponent implements OnInit, AfterViewInit {
  notification!: NotificationService;

  constructor(
    private fb: FormBuilder,
    private cadastro: CadastroService,
    private router: Router
  ) { }

  @ViewChild('notifications', { read: ViewContainerRef }) notifications!: ViewContainerRef;

  notificationsCount: number = 0;

  genders: genders = [
    { id: 'MASCULINO', text: 'Masculino', status: !0 },
    { id: 'FEMININO', text: 'Feminino', status: !0 },
    { id: 'OUTRO', text: 'Outro', status: !1 }
  ];

  submitText: string = 'Cadastrar';

  ngOnInit(): void {
    const cpf = this.form.get('cpf');

    cpf?.valueChanges.subscribe(data => {
      const searchUser = this.cadastro.searchUser(data as string);

      searchUser.subscribe(user => this.submitText = user ? 'Solicitar' : 'Cadastrar');
    });
  }

  ngAfterViewInit(): void {
    this.notification = new NotificationService(this.notifications);
  }

  submitFunction = (res: any, form: FormGroup) => cadastroSubmit(res, form, this);

  form = this.fb.group({
    nome_comp: ['', Validators.required],
    cpf: ['', [Validators.required, Validators.minLength(11)]],
    password: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    tel: ['', [Validators.required, Validators.minLength(11)]],
    solic: this.fb.group({ roles: [['ALUNO']] }),
    aluno: this.fb.group({
      endereco: ['', Validators.required],
      bairro: ['', Validators.required],
      data_nasc: ['', Validators.required],
      sexo: ['', Validators.required]
    }),
    // inscricoes: [[], ]
  });

  alunoGroup = this.form.get('aluno') as FormGroup;
}