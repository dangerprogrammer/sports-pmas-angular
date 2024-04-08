import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { HeaderButtonComponent } from '../../components/header/header-button/header-button.component';
import { MainComponent } from '../../components/main/main.component';
import { Router } from '@angular/router';
import { modName } from '../../types';
import { CadastroService } from '../../services/cadastro.service';
import { CreateHorarioComponent } from '../../components/create-horario/create-horario.component';
import { CreateModalidadeComponent } from '../../components/create-modalidade/create-modalidade.component';
import { ModSubmit } from '../../tools';
import { CreatorContentComponent } from '../../components/creator-content/creator-content.component';

@Component({
  selector: 'app-modalidades',
  standalone: true,
  imports: [
    HeaderComponent,
    HeaderButtonComponent,
    MainComponent,
    CreateModalidadeComponent,
    CreateHorarioComponent,
    CreatorContentComponent
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
      const prismaModalidades = this.service.searchModalidades();

      prismaModalidades.subscribe(modalidades => this.searchModSubmit(modalidades));
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
