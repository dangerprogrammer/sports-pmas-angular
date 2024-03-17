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

  get token() {
    return localStorage.getItem("auth");
  }

  set token(auth: any) {
    localStorage.setItem("auth", auth);
  }

  createUser = (user: User) => this.http.post('nest-api/auth/local/signup', user).pipe(tap((response: any) => {
    this.token = JSON.stringify(response as token);
    this.subscribe = "login";

    localStorage.removeItem("cadastro-type");
  }))

  loginUser = (user: User) => this.http.post('nest-api/auth/local/signin', user).pipe(tap((response: any) => {
    this.token = JSON.stringify(response as token);

    localStorage.removeItem("cadastro-type");
    localStorage.removeItem("subscribe-type");
  }));

  searchUser = (cpf: string) => this.http.get(`nest-api/search/user/${cpf}`);

  searchUserByToken() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${(JSON.parse(this.token) as token).access_token}`,
      host: 'localhost:3000'
    });

    console.log(headers);

    return this.http.get('nest-api/search/token', { headers });
  };
}
