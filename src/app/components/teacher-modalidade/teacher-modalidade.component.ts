import { AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { horario, modName, PrismaAluno } from '../../types';
import { DateTools, StringTools } from '../../tools';
import { ModalidadeItemComponent } from './modalidade-item/modalidade-item.component';
import { DividerComponent } from './divider/divider.component';

@Component({
  selector: 'teacher-modalidade',
  standalone: true,
  imports: [ModalidadeItemComponent],
  templateUrl: './teacher-modalidade.component.html',
  styleUrl: './teacher-modalidade.component.scss'
})
export class TeacherModalidadeComponent extends StringTools implements AfterViewInit {
  @Input() horarios!: horario[];
  @Input() vagas!: number;
  @Input() title!: modName;
  @Input() createAlert!: Function;

  constructor(
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  date = new DateTools();

  @ViewChild('listHorarios', { read: ViewContainerRef }) listHorarios!: ViewContainerRef;

  ngAfterViewInit(): void {
    this.listHorarios.clear();
    for (const horario of this.horarios) {
      const i = this.horarios.indexOf(horario);
      const itemRef = this.listHorarios.createComponent(ModalidadeItemComponent);

      if (i != (this.horarios.length - 1)) this.listHorarios.createComponent(DividerComponent);

      itemRef.setInput('horario', horario);
      itemRef.setInput('vagas', this.vagas);

      const { location: { nativeElement: itemElem } } = itemRef;
      itemRef.instance.clickEvent.subscribe(alunos => {
        const formattedHorario = this.date.formatTime(horario.time);
        const title = `Alunos cadastrados às ${formattedHorario} em ${this.title}`;

        if (alunos) itemElem.addEventListener('click', () => this.createAlert({ title, alunos }));
        else itemElem.classList.add('no-click');
      });
      this.cdr.detectChanges();
    };
  }
}
