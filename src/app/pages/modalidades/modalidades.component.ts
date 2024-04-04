import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { HeaderButtonComponent } from '../../components/header/header-button/header-button.component';
import { MainComponent } from '../../components/main/main.component';
import { Router } from '@angular/router';
import { modName } from '../../types';
import { CadastroService } from '../../services/cadastro.service';
import { CreateHorarioComponent } from '../../components/create-horario/create-horario.component';
import { CreateModalidadeComponent } from '../../components/create-modalidade/create-modalidade.component';
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

        prismaHorarios.subscribe(horarios => this.addExistingMod(modalidade, horarios));
      };
    });
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
