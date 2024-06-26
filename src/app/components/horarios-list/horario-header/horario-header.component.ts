import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { horario, inscricao, modName, PrismaModalidade } from '../../../types';
import { HorarioInputComponent } from '../horario-input/horario-input.component';
import { StringTools } from '../../../tools';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'horario-header',
  standalone: true,
  imports: [],
  templateUrl: './horario-header.component.html',
  styleUrl: './horario-header.component.scss'
})
export class HorarioHeaderComponent extends StringTools implements AfterViewInit {
  constructor(
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  @Input() modalidade!: PrismaModalidade;
  @Input() horarios!: horario[];
  @Input() form?: FormGroup;
  @Input() inscricoes?: inscricao[];

  @ViewChild('horarios', { read: ViewContainerRef }) horariosContainer!: ViewContainerRef;

  @Output() updateHorario = new EventEmitter();

  setUpdateHorario = (horario: { aula: modName, horario: Date }) => this.updateHorario.emit(horario);

  ngAfterViewInit(): void {
    if (this.form) this.horarios.forEach(horario => {
      const horarioRef = this.horariosContainer.createComponent(HorarioInputComponent);

      horarioRef.setInput('horario', horario);
      horarioRef.setInput('horarios', this.horarios);
      horarioRef.setInput('modalidade', this.modalidade);
      horarioRef.setInput('form', this.form);
      horarioRef.setInput('inscricoes', this.inscricoes);
      horarioRef.setInput('updateHorario', this.setUpdateHorario);

      this.cdr.detectChanges();
    });
  }
}
