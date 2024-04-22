import { Component, Input } from '@angular/core';
import { PrismaAluno } from '../../../types';
import { DateTools, StringTools } from '../../../tools';

@Component({
  selector: 'aluno-desc',
  standalone: true,
  imports: [],
  templateUrl: './aluno-desc.component.html',
  styleUrl: './aluno-desc.component.scss'
})
export class AlunoDescComponent extends DateTools {
  @Input() aluno?: PrismaAluno;

  string = new StringTools();
}
