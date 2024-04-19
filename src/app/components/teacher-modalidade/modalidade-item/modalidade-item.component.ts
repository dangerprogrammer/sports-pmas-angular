import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { alunoType, horario, inscricao } from '../../../types';
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
  @Input() isTitle: boolean = !1;

  @Output() clickEvent = new EventEmitter<boolean>();

  constructor(
    private cadastro: CadastroService
  ) {
    super();
  }

  time!: Date;
  inscricoes: inscricao[] = [];
  alunoTypes: alunoType[] = [];
  formattedTypes: string = 'Nenhuma';
  string = new StringTools();

  ngOnInit(): void {
    if (this.horario) {
      this.time = this.horario.time;

      const searchUsersHorario = this.cadastro.search.searchUsersHorario(this.time);

      searchUsersHorario.subscribe(inscricoes => {
        this.inscricoes = inscricoes;

        const alunos = inscricoes.map(({ alunoId }) => this.cadastro.search.searchAlunoById(alunoId));

        forkJoin(alunos).subscribe(alunos => {
          this.clickEvent.emit(!!alunos.length);
          
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
