import { AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { horario } from '../../../types';
import { HorarioInputComponent } from '../horario-input/horario-input.component';

@Component({
  selector: 'horario-header',
  standalone: true,
  imports: [],
  templateUrl: './horario-header.component.html',
  styleUrl: './horario-header.component.scss'
})
export class HorarioHeaderComponent implements AfterViewInit {
  constructor(
    private cdr: ChangeDetectorRef
  ) {}

  @Input() title!: string;
  @Input() horarios!: horario[];

  @ViewChild('horarios', { read: ViewContainerRef }) horariosContainer!: ViewContainerRef;

  ngAfterViewInit(): void {
    this.horarios.forEach(horario => {
      const horarioRef = this.horariosContainer.createComponent(HorarioInputComponent);

      horarioRef.setInput('horario', horario);
      this.cdr.detectChanges();
    });
  }
}
