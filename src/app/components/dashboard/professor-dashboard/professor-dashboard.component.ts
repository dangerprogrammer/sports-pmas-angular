import { Component, Input } from '@angular/core';
import { CadastroService } from '../../../services/cadastro.service';
import { horario, PrismaModalidade, PrismaUser } from '../../../types';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'professor-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './professor-dashboard.component.html',
  styleUrl: './professor-dashboard.component.scss'
})
export class ProfessorDashboardComponent {
  constructor(
    private cadastro: CadastroService
  ) {}

  @Input() user!: PrismaUser;

  ngOnInit(): void {
    const searchInscricoes = this.cadastro.searchInscricoes(this.user.id);
    
    searchInscricoes.subscribe(({inscricoes, modalidades}) => {
      const horariosList = modalidades.map(modalidade => this.cadastro.searchHorariosSubscribe(modalidade, inscricoes));
      
      forkJoin(horariosList).subscribe(data => {
        for (const index in data) {
          const modalidade = modalidades[index];
          const horarios = data[index];

          if (horarios.length) this.addHorario(modalidade, horarios);
        };
      });
    });
  }

  addHorario = (modalidade: PrismaModalidade, horarios: horario[]) => {
    console.group(modalidade.name);
    for (const horario of horarios) console.log(horario);
    console.groupEnd();
  }
}
