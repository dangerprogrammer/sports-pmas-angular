import { Component, Input, OnInit } from '@angular/core';
import { horario, modalidade } from '../../../types';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'horario-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './horario-input.component.html',
  styleUrl: './horario-input.component.scss'
})
export class HorarioInputComponent {
  @Input() horario!: horario;
  @Input() horarios!: horario[];
  @Input() modalidade!: modalidade;
  @Input() form!: FormGroup;

  formatTime(time: Date) {
    const date = new Date(time);
    const hours = `${date.getUTCHours()}`;
    const minutes = `${date.getUTCMinutes()}`;

    return `${hours.length > 1 ? hours : `0${hours}`}:${minutes.length > 1 ? minutes : `0${minutes}`}`;
  }

  updateInscricoes({ target: t }: Event) {
    const target = t as HTMLLabelElement,
      optionsHTML = target.parentElement?.parentElement?.children as any,
      options = [...optionsHTML].map(({ firstChild }) => firstChild),
      index = options.findIndex(({ id }) => id == target.htmlFor),
      optionsChecked = options
        .map(({ checked }, ind) => (ind == index ? !checked : checked) ?
          { aula: this.modalidade.name, horario: this.horarios[ind].time } :
          false)
        .filter(horario => horario);

    const inscricoes = this.form.get('inscricoes') as FormGroup;

    return console.log(...optionsChecked);
    inscricoes.setValue(optionsChecked);
  }
}
