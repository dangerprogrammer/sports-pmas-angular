import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { cadastroTypes, subscribeTypes } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {
  http = inject(HttpClient);

  getToken = () => localStorage.getItem("token");

  setSubscribe = (type: subscribeTypes) => localStorage.setItem("subscribe-type", type);

  getCadastroType = () => localStorage.getItem("cadastro-type");

  setCadastroType = (type: cadastroTypes) => localStorage.setItem("cadastro-type", type);
}
