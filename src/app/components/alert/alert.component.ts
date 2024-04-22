import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { PrismaAluno } from '../../types';
import { JsonPipe } from '@angular/common';
import { AlunoDescComponent } from './aluno-desc/aluno-desc.component';
import { DividerComponent } from '../teacher-modalidade/divider/divider.component';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [JsonPipe, AlunoDescComponent],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent implements AfterViewInit {
  @Input() index: number = 0;
  @Input() deleting: boolean = !1;
  @Input() title: string = `Alert ${this.index}`;
  @Input() alunos?: PrismaAluno[];
  @Output() delete = new EventEmitter();

  constructor(
    private cdr: ChangeDetectorRef
  ) {}

  @ViewChild('alunosList', { read: ViewContainerRef }) alunosList?: ViewContainerRef;

  ngAfterViewInit(): void {
    if (this.alunos) this.alunos.forEach((aluno, ind) => {
      if (!this.alunosList) return;

      const descRef = this.alunosList.createComponent(AlunoDescComponent);

      if (ind != (this.alunos?.length || 0) - 1) this.alunosList.createComponent(DividerComponent);

      descRef.setInput('aluno', aluno);
      this.cdr.detectChanges();
    });
  }

  deleteAlert() {
    this.delete.emit();
  }
}
