import { Component, Input, OnInit } from '@angular/core';
import { horario, inscricao, modalidade } from '../../../types';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DateTools } from '../../../tools';

@Component({
  selector: 'horario-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './horario-input.component.html',
  styleUrl: './horario-input.component.scss'
})
export class HorarioInputComponent extends DateTools implements OnInit {
  @Input() horario!: horario;
  @Input() horarios!: horario[];
  @Input() modalidade!: modalidade;
  @Input() form!: FormGroup;
  @Input() inscricoes?: inscricao[];
  @Input() updateHorario!: Function;

  checked: boolean = !1;

  ngOnInit(): void {
    this.checked = !!this.inscricoes?.find(({ aula, horarioId }) => this.horario.id == horarioId && this.modalidade.name == aula);
  }

  updateInscricoes({ target: t }: Event) {
    const target = t as HTMLLabelElement,
      optionsHTML = target.parentElement?.parentElement?.children as any,
      options = [...optionsHTML].map(({ firstChild }) => firstChild),
      index = options.findIndex(({ id }) => id == target.htmlFor),
      option = options
        .map((_, ind) => { return { aula: this.modalidade.name, horario: this.horarios[ind].time } })[index];

    return this.updateHorario(option);
  }
}
