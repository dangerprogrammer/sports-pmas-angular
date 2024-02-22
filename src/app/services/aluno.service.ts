import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import aluno from '../interfaces/aluno';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {
  http = inject(HttpClient);

  getAllStudents = () => this.http.get<aluno[]>('nest-api/alunos');
}
