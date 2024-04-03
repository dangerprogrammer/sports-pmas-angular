import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { HeaderButtonComponent } from '../../components/header/header-button/header-button.component';
import { MainComponent } from '../../components/main/main.component';
import { Router } from '@angular/router';
import { horario, modalidade, modName, options } from '../../types';
import { CadastroService } from '../../services/cadastro.service';
import { CreateHorarioComponent } from '../../components/create-horario/create-horario.component';
import { CreateModalidadeComponent } from '../../components/create-modalidade/create-modalidade.component';
import { FormComponent } from '../../components/form/form.component';
import { FormBuilder, Validators } from '@angular/forms';
import { ModSubmit } from '../../tools';

@Component({
  selector: 'app-modalidades',
  standalone: true,
  imports: [
    HeaderComponent,
    HeaderButtonComponent,
    MainComponent,
    CreateModalidadeComponent,
    CreateHorarioComponent
  ],
  templateUrl: './modalidades.component.html',
  styleUrl: './modalidades.component.scss'
})
export class ModalidadesComponent extends ModSubmit implements OnInit {
  constructor(
    private service: CadastroService,
    private fb: FormBuilder,
    private router: Router
  ) {
    super();
  }

  @ViewChild('modalidades', { read: ViewContainerRef }) modalidades!: ViewContainerRef;

  horariosList: any[] = [];

  ngOnInit(): void {
    const prismaModalidades = this.service.searchModalidades();

    prismaModalidades.subscribe(modalidades => {
      this.modalidadesList = modalidades;
      this.modalidadesView = this.modalidades;

      const some = this.availableNames.find(name => !modalidades.find(({ name: modName }) => modName == name));

      this.enableCreateMod = !!some;

      for (const modalidade of modalidades) {
        const prismaHorarios = this.service.searchHorarios(modalidade);

        prismaHorarios.subscribe(horarios => {
          if (horarios.length) this.addExistingMod(modalidade, horarios);
        });
      };
    });
  }

  addExistingMod = (modalidade: modalidade, horarios: horario[]) => {
    const formRef = this.modalidades.createComponent(FormComponent);

    this.formRef = formRef;

    const form = this.fb.group({
      name: [modalidade.name, Validators.required],
      horarios: [horarios, Validators.required]
    });

    this.form = form;

    const { value: oldValue } = form;
    const availableOptions = this.availableNames.filter(name =>
      !this.modalidadesList.find(({ name: modName }) => modName == name) || modalidade.name == name
    );
    const optionsName: options = availableOptions.map(option => {
      return { id: option, text: option, status: option == modalidade.name, action() {
        form.get("name")?.setValue(option, { emitEvent: false });
      } }
    });
    const optionsHorario: options = horarios.map(({ id, time }) => {
      return { id, text: `${time}`, status: !1 }
    });
    console.log(horarios);

    formRef.setInput('titleForm', modalidade.name);
    formRef.setInput('createMod', {
      form,
      formInputsList: [
        { controlName: 'name', inputText: 'Modalidades', options: optionsName },
        { controlName: 'horarios', inputText: 'Horarios', builderOptions: optionsHorario }
      ],
      oldValue,
      autoGenerateForms: !0,
      submitEvent: (res: any) => this.submitExistingMod(modalidade.name, res),
      submitText: 'Salvar'
    });
    formRef.setInput('isFreeze', this.isFreeze);
    formRef.setInput('freezeForm', this.onFreezeForm);
  }

  addNewMod = (modNames: modName[]) => {
    const formRef = this.modalidades.createComponent(FormComponent);

    const form = this.fb.group({
      name: ['', Validators.required]
    });

    formRef.setInput('titleForm', 'Escolha uma modalidade!');
    formRef.setInput('titleSmall', !0);
    formRef.setInput('createMod', {
      form,
      formInputsList: [
        { controlName: 'name', inputText: 'Modalidades' }
      ],
      autoGenerateForms: !0,
      submitEvent: this.submitNewMod,
    });
    formRef.setInput('isFreeze', this.isFreeze);
    formRef.setInput('freezeForm', this.onFreezeForm);

    this.enableCreateMod = !1;
  }

  onCreateMod = ({ names }: { names: modName[] }) => {
    this.addNewMod(names);
  }

  goDashboard = () => this.router.navigate(["/dashboard"]);

  logoutButton = () => {
    localStorage.removeItem("auth");
    this.router.navigate(["/login"]);
  }
}
