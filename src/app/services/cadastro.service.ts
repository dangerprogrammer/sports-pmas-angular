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
  }));

  loginUser = (user: User) => this.http.post('nest-api/auth/local/signin', user).pipe(tap((response: any) => {
    this.token = JSON.stringify(response as token);

    localStorage.removeItem("cadastro-type");
    localStorage.removeItem("subscribe-type");
  }));

  searchUser = (cpf: string) => this.http.get(`nest-api/search/user/${cpf}`);

  createSolic = (data:
    { roles: ('ALUNO' | 'PROFESSOR' | 'ADMIN')[], cpf: string }
  ) => this.http.patch('nest-api/auth/create/solic', data);

  searchUserById = (id: number) => this.http.get(`nest-api/search/user/id/${id}`);

  searchByAdmin = (id: number) => this.http.get(`nest-api/search/admin/${id}`);

  acceptUser = (data: { cpf: string, accepted: boolean }) => {
    const { access_token } = JSON.parse(this.token) as token;
    const headers = new HttpHeaders({ Authorization: `bearer ${access_token}` });

    return this.http.post('nest-api/auth/user', data, { headers });
  };

  searchUserByToken() {
    const { access_token } = JSON.parse(this.token) as token;
    const headers = new HttpHeaders({ Authorization: `bearer ${access_token}` });

    return this.http.get('nest-api/search/token', { headers });
  };

  refreshToken() {
    const { refresh_token } = JSON.parse(this.token) as token;
    const headers = new HttpHeaders({ Authorization: `bearer ${refresh_token}` });

    return this.http.post('nest-api/auth/refresh', {}, { headers }).pipe(tap((response: any) => {
      this.token = JSON.stringify(response as token);
    }));
  }
}
