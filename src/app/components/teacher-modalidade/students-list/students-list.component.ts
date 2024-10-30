import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { horario, PrismaAluno } from '../../../types';
import { PdfPrinterComponent } from '../../pdf-printer/pdf-printer.component';
import { DateTools } from '../../../tools';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-students-list',
  standalone: true,
  imports: [NgFor],
  templateUrl: './students-list.component.html',
  styleUrl: './students-list.component.scss'
})
export class StudentsListComponent implements OnInit {
  constructor(
    private cdr: ChangeDetectorRef
  ) {}
  
  date = new DateTools();

  @Input() alunos!: PrismaAluno[];
  @Input() horario!: horario;
  @Input() title!: string;

  loadAlunos: PrismaAluno[] = [];
  
  @ViewChild('content') content!: ElementRef;
  @ViewChild('tableList', { read: ViewContainerRef, static: !0 }) tableList!: ViewContainerRef;

  pdf = new PdfPrinterComponent();

  printStudents = () => {
    this.pdf.content = this.content;

    const { day, time } = this.horario, date = new Date(time);

    this.pdf.printPDF(`Chamada ${day.toLowerCase()} ${this.date.formatTime(time)} - ${date.toLocaleDateString()}`);
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.loadAlunos = this.alunos;

      this.cdr.detectChanges();
    });
  }
}
