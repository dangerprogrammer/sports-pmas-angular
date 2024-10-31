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
  constructor() {}

  date = new DateTools();

  @Input() alunos: PrismaAluno[] = [];
  @Input() horario: horario = { id: 0, day: 'DOMINGO', time: new Date(), periodo: 'MANHA', vagas: 0, available: 0 };
  @Input() title: string = '';

  localDate: Date = new Date();
  weekDays: weekDays[] = ['DOMINGO', 'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO'];

  @ViewChild('content') content!: ElementRef;
  @ViewChild('tableList', { read: ViewContainerRef, static: !0 }) tableList!: ViewContainerRef;

  pdf = new PdfPrinterComponent();

  printStudents = () => {
    this.pdf.content = this.content;

    const { day, time } = this.horario;


    this.pdf.printPDF(`Chamada ${day.toLowerCase()} ${this.date.formatTime(time)} - ${this.localDate.toLocaleDateString()}`);
  }

  ngOnInit(): void {
    const { day, time } = this.horario, date = new Date(time), diff = this.weekDays.indexOf(day) - date.getDay();

    date.setDate(date.getDate() + (diff + 7) % 7);

    this.localDate = date;
  }
}
