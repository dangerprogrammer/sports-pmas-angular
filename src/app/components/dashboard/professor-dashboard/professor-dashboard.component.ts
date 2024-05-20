import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { CadastroService } from '../../../services/cadastro.service';
import { horario, PrismaModalidade, PrismaUser } from '../../../types';
import { forkJoin } from 'rxjs';
import { LoadingContentComponent } from '../../loading-content/loading-content.component';
import { TeacherModalidadeComponent } from '../../teacher-modalidade/teacher-modalidade.component';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'professor-dashboard',
  standalone: true,
  imports: [LoadingContentComponent],
  templateUrl: './professor-dashboard.component.html',
  styleUrl: './professor-dashboard.component.scss'
})
export class ProfessorDashboardComponent {
  constructor(
    private cadastro: CadastroService
  ) { }

  @Input() user!: PrismaUser;
  @Input() alert!: AlertService;

  @ViewChild('modalidadesList', { read: ViewContainerRef }) modalidadesList!: ViewContainerRef;

  modalidades: PrismaModalidade[] = [];
  loaded: boolean = !1;

  ngOnInit(): void {
    const searchInscricoes = this.cadastro.search.searchInscricoes(this.user.id);

    searchInscricoes.subscribe(({ inscricoes, modalidades }) => {
      this.modalidades = modalidades;
      
      const horariosList = modalidades.map(modalidade => 
        this.cadastro.search.searchHorariosSubscribe(modalidade, inscricoes.filter(({ aula }) => aula == modalidade.name))
      );

      if (!horariosList.length) this.loaded = !0;
      forkJoin(horariosList).subscribe(data => {
        for (const index in data) {
          const modalidade = modalidades[index];
          const horarios = data[index];

          this.loaded = !0;
          if (horarios.length) this.addModalidade(modalidade, horarios);
        };
      });
    });
  }

  addModalidade = (modalidade: PrismaModalidade, horarios: horario[]) => {
    const modalidadeRef = this.modalidadesList.createComponent(TeacherModalidadeComponent);

    modalidadeRef.setInput('horarios', horarios);
    modalidadeRef.setInput('vagas', modalidade.vagas);
    modalidadeRef.setInput('title', modalidade.name);
    modalidadeRef.setInput('alert', this.alert);
  }
}
