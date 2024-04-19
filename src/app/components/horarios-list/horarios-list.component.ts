import { Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CadastroService } from '../../services/cadastro.service';
import { horario, modName, PrismaModalidade } from '../../types';
import { HorarioHeaderComponent } from './horario-header/horario-header.component';
import { forkJoin } from 'rxjs';

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
  modalidades: PrismaModalidade[] = [];
  activeHorarios: { aula: modName, horario: Date }[] = [];

  addHorario = (modalidade: PrismaModalidade, horarios: horario[] = []) => {
    this.horariosList.push({ component: HorarioHeaderComponent });

    const headerRef = this.horarios.createComponent(HorarioHeaderComponent);

    headerRef.setInput('modalidade', modalidade);
    headerRef.setInput('horarios', horarios);
    headerRef.setInput('form', this.form);

    headerRef.instance.updateHorario.subscribe((horario: { aula: modName, horario: Date }) => {
      const compareHorarios = (a: any, b: any) => JSON.stringify(a) == JSON.stringify(b);
      const findedHorario = this.activeHorarios.find(h => compareHorarios(horario, h));

      if (!findedHorario) this.activeHorarios.push(horario);
      else this.activeHorarios.splice(this.activeHorarios.indexOf(findedHorario), 1);

      const inscricoes = this.form.get('inscricoes') as FormGroup;

      inscricoes.setValue(this.activeHorarios);
    });
  };

  ngOnInit(): void {
    const prismaModalidades = this.cadastro.search.searchModalidades();

    prismaModalidades.subscribe(modalidades => {
      this.modalidades = modalidades;

      const prismaHorariosList = this.modalidades.map(this.cadastro.search.searchHorarios);

      forkJoin(prismaHorariosList).subscribe(data => {
        for (const index in data) {
          const modalidade = this.modalidades[index];
          const horarios = data[index];

          if (horarios.length) this.addHorario(modalidade, horarios);
        };
      });
    });
  }
}