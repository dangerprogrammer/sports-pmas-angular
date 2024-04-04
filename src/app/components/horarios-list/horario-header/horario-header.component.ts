import { AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { horario, PrismaModalidade } from '../../../types';
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

  @ViewChild('horarios', { read: ViewContainerRef }) horariosContainer!: ViewContainerRef;

  ngAfterViewInit(): void {
    if (this.form) this.horarios.forEach(horario => {
      const horarioRef = this.horariosContainer.createComponent(HorarioInputComponent);
      const time = new Date(horario.time).toLocaleTimeString();

      horarioRef.setInput('horario', { ...horario, time });
      horarioRef.setInput('horarios', this.horarios);
      horarioRef.setInput('modalidade', this.modalidade);
      horarioRef.setInput('form', this.form);
      this.cdr.detectChanges();
    });
  }
}
