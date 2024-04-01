import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { HeaderButtonComponent } from '../../components/header/header-button/header-button.component';
import { MainComponent } from '../../components/main/main.component';
import { Router } from '@angular/router';
import { horario, modalidade } from '../../types';
import { CadastroService } from '../../services/cadastro.service';
import { HorarioHeaderComponent } from '../../components/horarios-list/horario-header/horario-header.component';
import { CreateHorarioComponent } from '../../components/create-horario/create-horario.component';
import { CreateModalidadeComponent } from '../../components/create-modalidade/create-modalidade.component';

@Component({
  selector: 'app-modalidades',
  standalone: true,
  imports: [HeaderComponent, HeaderButtonComponent, MainComponent, CreateModalidadeComponent, CreateHorarioComponent],
  templateUrl: './modalidades.component.html',
  styleUrl: './modalidades.component.scss'
})
export class ModalidadesComponent implements OnInit {
  constructor(
    private cadastro: CadastroService,
    private router: Router
  ) {}

  @ViewChild('horarios', { read: ViewContainerRef }) horarios!: ViewContainerRef;

  horariosList: any[] = [];
  modalidades: modalidade[] = [];

  addHorario = (modalidade: modalidade, horarios: horario[] = []) => {
    this.horariosList.push({ component: HorarioHeaderComponent });
    
    const headerRef = this.horarios.createComponent(HorarioHeaderComponent);

    headerRef.setInput('modalidade', modalidade);
    headerRef.setInput('horarios', horarios);
  };

  ngOnInit(): void {
    const prismaModalidades = this.cadastro.searchModalidades();

    prismaModalidades.subscribe(modalidades => {
      this.modalidades = modalidades;
      console.log(modalidades);

      for (const modalidade of modalidades) {
        const prismaHorarios = this.cadastro.searchHorarios(modalidade);

        prismaHorarios.subscribe(horarios => {
          if (horarios.length) this.addHorario(modalidade, horarios);
        });
      };
    });
  }

  goDashboard = () => {
    this.router.navigate(["/dashboard"]);
  }

  logoutButton = () => {
    localStorage.removeItem("auth");
    this.router.navigate(["/login"]);
  }
}
