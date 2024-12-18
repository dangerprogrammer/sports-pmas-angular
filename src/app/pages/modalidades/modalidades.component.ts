import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { HeaderButtonComponent } from '../../components/header/header-button/header-button.component';
import { MainComponent } from '../../components/main/main.component';
import { Router } from '@angular/router';
import { CadastroService } from '../../services/cadastro.service';
import { CreateHorarioComponent } from '../../components/create-horario/create-horario.component';
import { CreateModalidadeComponent } from '../../components/create-modalidade/create-modalidade.component';
import { ModSubmit } from '../../tools';
import { CreatorContentComponent } from '../../components/creator-content/creator-content.component';
import { NotificationsListComponent } from '../../components/notifications-list/notifications-list.component';

@Component({
  selector: 'app-modalidades',
  standalone: true,
  imports: [
    HeaderComponent,
    HeaderButtonComponent,
    MainComponent,
    CreateModalidadeComponent,
    CreateHorarioComponent,
    CreatorContentComponent,
    NotificationsListComponent
  ],
  templateUrl: './modalidades.component.html',
  styleUrl: './modalidades.component.scss'
})
export class ModalidadesComponent extends ModSubmit implements AfterViewInit {
  constructor(
    private service: CadastroService,
    private router: Router
  ) {
    super();
  }

  @ViewChild('modalidades', { read: ViewContainerRef }) modalidades!: ViewContainerRef;

  horariosList: any[] = [];

  ngAfterViewInit(): void {
    this.modalidadesView = this.modalidades;

    setTimeout(() => {
      const prismaModalidades = this.service.search.searchModalidades();

      prismaModalidades.subscribe(modalidades => {
        modalidades = modalidades.sort((a, b) => a.name.localeCompare(b.name));
        
        this.searchModSubmit({ modalidades });
      });
    });
  }

  onCreateMod = () => {
    this.addNewMod();
  }

  goDashboard = () => this.router.navigate(["/dashboard"]);

  logoutButton = () => {
    localStorage.removeItem("auth");
    this.router.navigate(["/login"]);
  }
}
