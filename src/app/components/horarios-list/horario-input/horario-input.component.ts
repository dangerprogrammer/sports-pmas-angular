import { Component, Input } from '@angular/core';
import { horario } from '../../../types';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'horario-input',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './horario-input.component.html',
  styleUrl: './horario-input.component.scss'
})
export class HorarioInputComponent {
  @Input() horario!: horario;

  formatTime(time: Date) {
    const date = new Date(time);
    const hours = `${date.getUTCHours()}`;
    const minutes = `${date.getUTCMinutes()}`;

    return `${
      hours.length > 1 ? hours : `0${hours}`
    }:${
      minutes.length > 1 ? minutes : `0${minutes}`
    }`;
  }
}
