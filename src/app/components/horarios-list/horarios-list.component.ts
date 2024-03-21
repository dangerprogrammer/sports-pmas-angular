import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HorarioInputComponent } from './horario-input/horario-input.component';
import { CadastroService } from '../../services/cadastro.service';

@Component({
  selector: 'horarios-list',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './horarios-list.component.html',
  styleUrl: './horarios-list.component.scss'
})
export class HorariosListComponent implements OnInit, AfterViewInit {
  constructor(
    private cadastro: CadastroService,
    private cdr: ChangeDetectorRef
  ) { }

  @Input() controlName!: string;
  @Input() form!: FormGroup;

  @ViewChild('horarios', { read: ViewContainerRef }) horarios!: ViewContainerRef;

  horariosList: any[] = [];
  hideAdd: boolean = !1;

  addHorario = (ev?: Event) => {
    ev?.preventDefault();

    this.horariosList.push({ component: HorarioInputComponent });
    this.horarios.createComponent(HorarioInputComponent);

    // if (this.horariosList.length == 3) this.hideAdd = !0;
  };

  ngOnInit(): void {
    console.log(this.cadastro);
  }

  ngAfterViewInit(): void {
    for (let i = 0; i < 5; i++) {
      this.addHorario();
      this.cdr.detectChanges();
    };
  }
}
