import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { alunoType, horario, PrismaAluno } from '../../../types';
import { DateTools, StringTools } from '../../../tools';
import { CadastroService } from '../../../services/cadastro.service';
import { JsonPipe } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'modalidade-item',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './modalidade-item.component.html',
  styleUrl: './modalidade-item.component.scss'
})
export class ModalidadeItemComponent extends DateTools implements OnInit {
  @Input() horario!: horario;
  @Input() vagas!: number;
  @Input() title!: string;
  @Input() isTitle: boolean = !1;

  @Output() clickEvent = new EventEmitter<PrismaAluno[] | false>();

  constructor(
    private cadastro: CadastroService
  ) {
    super();
  }

  alunos: PrismaAluno[] = [];
  alunoTypes: alunoType[] = [];
  formattedTypes: string = 'Nenhuma';
  string = new StringTools();

  ngOnInit(): void {
    if (this.horario) {
      const searchUsersHorario = this.cadastro.search.searchUsersHorario(this.horario.time);

      searchUsersHorario.subscribe(inscricoes => {
        const alunos = inscricoes.filter(({ alunoId, aula }) => alunoId && aula == this.title).map(({ alunoId }) => this.cadastro.search.searchAlunoById(alunoId));

        if (!alunos.length) this.clickEvent.emit(!1);
        forkJoin(alunos).subscribe(alunos => {
          alunos = alunos.filter((aluno, i) => i == alunos.findIndex(al => al.id == aluno.id));

          this.alunos = alunos;
          this.clickEvent.emit(alunos);

          const infantil = alunos.find(({ data_nasc }) => this.yearsOld(data_nasc) <= 11);
          const juvenil = alunos.find(({ data_nasc }) => this.yearsOld(data_nasc) > 11 && this.yearsOld(data_nasc) <= 17);
          const adulto = alunos.find(({ data_nasc }) => this.yearsOld(data_nasc) > 17 && this.yearsOld(data_nasc) <= 59);
          const idoso = alunos.find(({ data_nasc }) => this.yearsOld(data_nasc) > 59);

          const has = (aType: alunoType) => this.alunoTypes.find(aT => aT == aType);

          if (infantil && !has('INFANTIL')) this.alunoTypes.push('INFANTIL');
          if (juvenil && !has('JUVENIL')) this.alunoTypes.push('JUVENIL');
          if (adulto && !has('ADULTO')) this.alunoTypes.push('ADULTO');
          if (idoso && !has('IDOSO')) this.alunoTypes.push('IDOSO');

          this.formattedTypes = this.alunoTypes.map(aType => this.string.capitalize(aType)).join(', ');
        });
      });
    };
  }
}
