import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CadastroService } from '../../services/cadastro.service';
import { Observable } from 'rxjs';
import { horario, modalidade } from '../../types';
import { HorarioHeaderComponent } from './horario-header/horario-header.component';

@Component({
  selector: 'horarios-list',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './horarios-list.component.html',
  styleUrl: './horarios-list.component.scss'
})
export class HorariosListComponent implements OnInit {
  constructor(
    private cadastro: CadastroService,
    private cdr: ChangeDetectorRef
  ) { }

  @Input() controlName!: string;
  @Input() form!: FormGroup;

  @ViewChild('horarios', { read: ViewContainerRef }) horarios!: ViewContainerRef;

  horariosList: any[] = [];
  hideAdd: boolean = !1;
  modalidades: modalidade[] = [];

  addHorario = (modName: string, horarios: horario[] = []) => {
    this.horariosList.push({ component: HorarioHeaderComponent });
    
    const headerRef = this.horarios.createComponent(HorarioHeaderComponent);

    headerRef.setInput('title', modName);
    headerRef.setInput('horarios', horarios);
  };

  ngOnInit(): void {
    const prismaModalidades = this.cadastro.searchModalidades();

    (prismaModalidades as Observable<modalidade[]>).subscribe(modalidades => {
      this.modalidades = modalidades;

      for (const modalidade of modalidades) {
        const prismaHorarios = this.cadastro.searchHorarios(modalidade.name);

        (prismaHorarios as Observable<horario[]>).subscribe(horarios => this.addHorario(modalidade.name, horarios));
      };
    });
  }
}
