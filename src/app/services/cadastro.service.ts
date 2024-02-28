import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import findTypes from '../interfaces/find-types';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {
  http = inject(HttpClient);

  getAll = ({ typeName }: findTypes) => this.http.get(`nest-api/${typeName}`);
}
