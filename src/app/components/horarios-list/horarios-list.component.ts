import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CadastroService } from '../../services/cadastro.service';
import { horario, inscricao, modName, PrismaModalidade } from '../../types';
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

  @Input() form!: FormGroup;
  @Input() inscricoes?: inscricao[];

  @Output() updateOld = new EventEmitter();

  @ViewChild('horarios', { read: ViewContainerRef }) horarios!: ViewContainerRef;

  horariosList: any[] = [];
  hideAdd: boolean = !1;
  modalidades: PrismaModalidade[] = [];
  activeHorarios: { aula: modName, horario: Date }[] = [];

  addHorario = (modalidade: PrismaModalidade, horarios: horario[] = []) => {
    this.horariosList.push({ component: HorarioHeaderComponent });

    const headerRef = this.horarios.createComponent(HorarioHeaderComponent);

    console.log(horarios)
    headerRef.setInput('modalidade', modalidade);
    headerRef.setInput('horarios', horarios);
    headerRef.setInput('form', this.form);
    headerRef.setInput('inscricoes', this.inscricoes);

    headerRef.instance.updateHorario.subscribe(this.updateHorario);
  };

  updateHorario = (horario: { aula: modName, horario: Date }) => {
    const compareHorarios = (a: any, b: any) => JSON.stringify(a) == JSON.stringify(b);
    const findedHorario = this.activeHorarios.find(h => compareHorarios(horario, h));

    if (!findedHorario) this.activeHorarios.push(horario);
    else this.activeHorarios.splice(this.activeHorarios.indexOf(findedHorario), 1);

    const inscricoes = this.form.get('inscricoes');

    if (!this.horariosList.length) inscricoes?.removeValidators(Validators.required);
    else inscricoes?.setValidators(Validators.required);

    this.form.patchValue({ inscricoes: this.activeHorarios });
  }

  ngOnInit(): void {
    const prismaModalidades = this.cadastro.search.searchModalidades();

    prismaModalidades.subscribe(modalidades => {
      this.modalidades = modalidades;

      const prismaHorariosList = this.modalidades.map(this.cadastro.search.searchHorarios);

      forkJoin(prismaHorariosList).subscribe(data => {
        this.inscricoes?.forEach(({ aula, time }) => this.updateHorario({ aula, horario: time }));

        this.updateOld.emit(this.form.value);

        for (const index in data) {
          const modalidade = this.modalidades[index];
          const horarios = data[index];

          if (horarios.length) this.addHorario(modalidade, horarios);
        };
      });
    });
  }
}