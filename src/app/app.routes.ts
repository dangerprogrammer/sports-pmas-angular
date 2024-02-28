import { Routes } from '@angular/router';
import { CadastroAlunoComponent } from './pages/cadastro-aluno/cadastro-aluno.component';
import { CadastroProfessorComponent } from './pages/cadastro-professor/cadastro-professor.component';
import { CadastroModalidadeComponent } from './pages/cadastro-modalidade/cadastro-modalidade.component';
import { CadastroHorarioComponent } from './pages/cadastro-horario/cadastro-horario.component';
import { CadastroLocalComponent } from './pages/cadastro-local/cadastro-local.component';

export const routes: Routes = [
    { path: '', redirectTo: 'cadastro-aluno', pathMatch: 'full' },
    { path: 'cadastro-aluno', component: CadastroAlunoComponent },
    { path: 'cadastro-professor', component: CadastroProfessorComponent },
    { path: 'cadastro-modalidade', component: CadastroModalidadeComponent },
    { path: 'cadastro-horario', component: CadastroHorarioComponent },
    { path: 'cadastro-local', component: CadastroLocalComponent }
];
