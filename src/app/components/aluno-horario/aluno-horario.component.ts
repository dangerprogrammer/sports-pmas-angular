import { Component, Input, OnInit } from '@angular/core';
import { horario, PrismaModalidade, PrismaUser } from '../../types';
import { DateTools } from '../../tools';
import { CadastroService } from '../../services/cadastro.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'aluno-horario',
  standalone: true,
  imports: [],
  templateUrl: './aluno-horario.component.html',
  styleUrl: './aluno-horario.component.scss'
})
export class AlunoHorarioComponent extends DateTools implements OnInit {
  @Input() modalidade?: PrismaModalidade;
  @Input() horario?: horario;

  constructor(
    private cadastro: CadastroService
  ) {
    super();
  }

  professores?: PrismaUser[];
  nomes?: string[];

  ngOnInit(): void {
    if (this.horario) {
      const searchUsersHorario = this.cadastro.search.searchUsersHorario(this.horario.time);
  
      searchUsersHorario.subscribe(inscricoes => {
        const professores = inscricoes.filter(({ professorId, aula }) => professorId && aula == (this.modalidade as PrismaModalidade).name)
          .map(({ professorId }) => this.cadastro.search.searchUserById(professorId));
  
        forkJoin(professores).subscribe(professores => {
          professores = professores.filter((professor, i) => i == professores.findIndex(pro => pro.id == professor.id));
  
          this.professores = professores;
          this.nomes = professores.map(({ nome_comp }) => nome_comp.split(' ')[0]);
        });
      });
    }
  }
}
