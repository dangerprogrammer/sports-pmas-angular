import { Component, ElementRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { CadastroService } from '../../../services/cadastro.service';
import { horario, PrismaModalidade, PrismaUser } from '../../../types';
import { forkJoin } from 'rxjs';
import { LoadingContentComponent } from '../../loading-content/loading-content.component';
import { AlunoHorarioComponent } from '../../aluno-horario/aluno-horario.component';

@Component({
  selector: 'aluno-dashboard',
  standalone: true,
  imports: [LoadingContentComponent, AlunoHorarioComponent],
  templateUrl: './aluno-dashboard.component.html',
  styleUrl: './aluno-dashboard.component.scss'
})
export class AlunoDashboardComponent implements OnInit {
  constructor(
    private cadastro: CadastroService
  ) { }

  @Input() user!: PrismaUser;

  @ViewChild('horariosList', { read: ViewContainerRef }) horariosList?: ViewContainerRef;
  @ViewChild('scrollerHorario') scrollerHorario!: ElementRef;

  loaded: boolean = !1;
  modalidades: PrismaModalidade[] = [];

  createHorarios = (modalidade: PrismaModalidade, horarios: horario[]) => {
    console.log(horarios);
    horarios.forEach(horario => {
      const horarioRef = this.horariosList!.createComponent(AlunoHorarioComponent);

      horarioRef.setInput('modalidade', modalidade);
      horarioRef.setInput('horario', horario);
    });
  }

  ngOnInit(): void {
    const searchInscricoes = this.cadastro.search.searchInscricoes(this.user.id);

    searchInscricoes.subscribe(({ inscricoes, modalidades }) => {
      this.modalidades = modalidades;

      const horariosList = modalidades.map(modalidade => this.cadastro.search.searchHorariosSubscribe(modalidade, inscricoes.filter(({ aula }) => aula == modalidade.name)));

      if (!horariosList.length) this.loaded = !0;
      forkJoin(horariosList).subscribe(data => {
        const horarioRef = this.horariosList?.createComponent(AlunoHorarioComponent);

        horarioRef?.location.nativeElement.classList.add('sticky');
        for (const index in data) {
          const modalidade = modalidades[index];
          const horarios = data[index];

          this.loaded = !0;
          if (horarios.length) {
            this.createHorarios(modalidade, horarios);
          };
        };
      });

      setTimeout(() => {
        const scroller = this.scrollerHorario.nativeElement;

        scroller.addEventListener('wheel', (ev: Event) => ev.stopPropagation());
    
        scroller.addEventListener('touchmove', (ev: Event) => ev.stopPropagation());
      });
    });
  }
}
