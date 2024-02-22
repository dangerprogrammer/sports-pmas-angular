import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlunoService } from './services/aluno.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor (
    private aluno: AlunoService
  ) {}

  ngOnInit(): void {
    const allAlunos = this.aluno.getAllStudents();

    allAlunos.subscribe(alunos => console.log(alunos));
  }
}
