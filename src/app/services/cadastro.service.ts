import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { cadastroTypes, subscribeTypes } from '../types';
import { tap } from 'rxjs';
import { User, token } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {
  http = inject(HttpClient);
  token!: token;

  get subscribe() {
    return localStorage.getItem("subscribe-type") as subscribeTypes;
  }

  set subscribe(type: subscribeTypes) {
    localStorage.setItem("subscribe-type", type);
  }

  get cadastroType() {
    return localStorage.getItem("cadastro-type") as cadastroTypes;
  }

  set cadastroType(type: cadastroTypes) {
    localStorage.setItem("cadastro-type", type);
  }

  createUser = (user: User) => {
    return this.http.post('nest-api/auth/local/signup', user).pipe(tap((response: any) => {
      this.token = response as token;
      localStorage.removeItem("cadastro-type");
      localStorage.setItem('auth', JSON.stringify(this.token));
      this.subscribe = "login";
    }))
  }

  searchUser = (cpf: string) => this.http.get(`nest-api/search/user/${cpf}`);
}
