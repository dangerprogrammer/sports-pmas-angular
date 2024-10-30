import { AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { horario } from '../../types';
import { DateTools } from '../../tools';
import { ModalidadeItemComponent } from './modalidade-item/modalidade-item.component';
import { DividerComponent } from './divider/divider.component';
import { AlertService } from '../../services/alert.service';
import { StudentsListComponent } from './students-list/students-list.component';

@Component({
  selector: 'teacher-modalidade',
  standalone: true,
  imports: [ModalidadeItemComponent],
  templateUrl: './teacher-modalidade.component.html',
  styleUrl: './teacher-modalidade.component.scss'
})
export class TeacherModalidadeComponent extends DateTools implements AfterViewInit {
  @Input() horarios!: horario[];
  @Input() vagas!: number;
  @Input() title!: string;
  @Input() alert!: AlertService;

  constructor(
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  @ViewChild('listHorarios', { read: ViewContainerRef }) listHorarios!: ViewContainerRef;

  ngAfterViewInit(): void {
    this.listHorarios.clear();

    for (const horario of this.horarios) {
      const i = this.horarios.indexOf(horario);
      const itemRef = this.listHorarios.createComponent(ModalidadeItemComponent);

      if (i != (this.horarios.length - 1)) this.listHorarios.createComponent(DividerComponent);

      itemRef.setInput('horario', horario);
      itemRef.setInput('vagas', this.vagas);
      itemRef.setInput('title', this.title);

      const { location: { nativeElement: itemElem } } = itemRef;
      itemRef.instance.clickEvent.subscribe(alunos => {
        const formattedHorario = this.formatTime(horario.time);
        const title = `Alunos cadastrados às ${formattedHorario} em ${this.title}`;

        const listStudents = (content: ViewContainerRef) => {
          const list = content.createComponent(StudentsListComponent);

          list.setInput('alunos', alunos);
          list.setInput('horario', horario);
          list.setInput('title', this.title);

          return list;
        };

        if (alunos) itemElem.addEventListener('click', () => this.alert.createAlert({ title, renderComponent: listStudents }));
        else itemElem.classList.add('no-click');
      });
      this.cdr.detectChanges();
    };
  }
}
