import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { cadastroTypes, horario, loginData, modalidade, PrismaSolic, PrismaUser, subscribeTypes } from '../types';
import { Observable, tap } from 'rxjs';
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
    return JSON.parse(localStorage.getItem("auth") as string) as token;
  }
  set token(auth: token) {
    localStorage.setItem("auth", JSON.stringify(auth));
  }

  get loginData() {
    return JSON.parse(localStorage.getItem("login-data") as string) as loginData;
  }
  set loginData(data: loginData) {
    localStorage.setItem("login-data", JSON.stringify(data));
  }

  private adminData: loginData = { cpf: 'ROOT', password: '@pmas1234@' };

  public isROOT(data: loginData) {
    for (let field in data) 
      if (data[field as 'cpf' | 'password'] != this.adminData[field as 'cpf' | 'password']) return !1;

    return !0;
  }

  removeFromStorage(...keys: string[]) {
    keys.forEach(key => localStorage.removeItem(key));
  }

  createUser = (user: User) => (this.http.post('nest-api/auth/local/signup', user) as Observable<PrismaUser>).pipe(tap(() => {
    this.subscribe = "login";

    this.removeFromStorage("cadastro-type");
  }));

  loginUser = (user: User) => (this.http.post('nest-api/auth/local/signin', user) as Observable<PrismaUser>).pipe(tap((response: any) => {
    this.token = response;

    this.removeFromStorage("cadastro-type", "subscribe-type");
  }));

  searchUser = (cpf: string) => this.http.get(`nest-api/search/user/${cpf}`) as Observable<PrismaUser>;

  createSolic = (data:
    { roles: ('ALUNO' | 'PROFESSOR' | 'ADMIN')[], cpf: string }
  ) => this.http.patch('nest-api/auth/create/solic', data);

  searchUserById = (id: number) => this.http.get(`nest-api/search/user/id/${id}`) as Observable<PrismaUser>;

  searchByAdmin = (id: number) => this.http.get(`nest-api/search/admin/${id}`) as Observable<PrismaSolic[]>;

  acceptUser = (data: { cpf: string, accepted: boolean }) => {
    const { access_token } = this.token;
    const headers = new HttpHeaders({ Authorization: `bearer ${access_token}` });

    return this.http.post('nest-api/auth/user', data, { headers });
  };

  searchModalidades = () => this.http.get('nest-api/search/modalidades') as Observable<modalidade[]>;

  searchHorarios = ({ name }: modalidade) => this.http.get(`nest-api/search/horarios/${name}`) as Observable<horario[]>;

  searchUserByToken = () => {
    const { access_token } = this.token;
    const headers = new HttpHeaders({ Authorization: `bearer ${access_token}` });

    return this.http.get('nest-api/search/token', { headers }) as Observable<PrismaUser>;
  };

  refreshToken = () => {
    const { refresh_token } = this.token;
    const headers = new HttpHeaders({ Authorization: `bearer ${refresh_token}` });

    return this.http.post('nest-api/auth/refresh', undefined, { headers }).pipe(tap((response: any) => {
      this.token = response;
    }));
  }
}
