import { Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
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
    private cadastro: CadastroService
  ) { }

  @Input() controlName!: string;
  @Input() form!: FormGroup;

  @ViewChild('horarios', { read: ViewContainerRef }) horarios!: ViewContainerRef;

  horariosList: any[] = [];
  hideAdd: boolean = !1;
  modalidades: modalidade[] = [];

  addHorario = (modalidade: modalidade, horarios: horario[] = []) => {
    this.horariosList.push({ component: HorarioHeaderComponent });
    
    const headerRef = this.horarios.createComponent(HorarioHeaderComponent);

    headerRef.setInput('modalidade', modalidade);
    headerRef.setInput('horarios', horarios);
    headerRef.setInput('form', this.form);
  };

  ngOnInit(): void {
    const prismaModalidades = this.cadastro.searchModalidades();

    prismaModalidades.subscribe(modalidades => {
      this.modalidades = modalidades;

      for (const modalidade of modalidades) {
        const prismaHorarios = this.cadastro.searchHorarios(modalidade);

        prismaHorarios.subscribe(horarios => {
          if (horarios.length) this.addHorario(modalidade, horarios);
        });
      };
    });
  }
}
