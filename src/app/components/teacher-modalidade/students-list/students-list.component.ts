import { Component, ElementRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { horario, PrismaAluno, weekDays } from '../../../types';
import { PdfPrinterComponent } from '../../pdf-printer/pdf-printer.component';
import { DateTools } from '../../../tools';

@Component({
  selector: 'app-students-list',
  standalone: true,
  imports: [],
  templateUrl: './students-list.component.html',
  styleUrl: './students-list.component.scss'
})
export class StudentsListComponent implements OnInit {
  constructor() { }

  date = new DateTools();

  @Input() setAlunos!: PrismaAluno[];
  @Input() setHorario!: horario;
  @Input() setTitle!: string;

  localDate: Date = new Date();
  weekDays: weekDays[] = ['DOMINGO', 'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO'];

  @ViewChild('content') content!: ElementRef;
  @ViewChild('tableList', { read: ViewContainerRef, static: !0 }) tableList!: ViewContainerRef;

  pdf = new PdfPrinterComponent();

  printStudents = () => {
    this.pdf.content = this.content;

    const { time } = this.horario!;


    this.pdf.printPDF(`Chamada ${this.title} ${this.date.formatTime(time)}`);
  }

  alunos?: PrismaAluno[];
  horario?: horario;
  title?: string;
  time?: string;
  day?: weekDays;
  dateLocale?: string;

  ngOnInit(): void {
    this.alunos = this.setAlunos;
    this.horario = this.setHorario;
    this.time = this.date.formatTime(this.horario.time);
    this.day = this.horario.day;
    this.title = this.setTitle;

    const { day, time } = this.horario, date = new Date(time), diff = this.weekDays.indexOf(day) - date.getDay();

    date.setDate(date.getDate() + (diff + 7) % 7);

    this.localDate = date;
    this.dateLocale = date.toLocaleDateString();
  }
}
