import { Routes } from '@angular/router';
import { tokenGuard } from './guards/token.guard';
import { AlunoComponent } from './pages/cadastro/aluno/aluno.component';
import { HomeComponent } from './pages/home/home.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { cadastroGuard } from './guards/cadastro.guard';
import { cadChildGuard } from './guards/cad-child.guard';
import { FuncionarioComponent } from './pages/cadastro/funcionario/funcionario.component';
import { LoginComponent } from './pages/login/login.component';
import { loginGuard } from './guards/login.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
    {
        path: '', component: HomeComponent, canActivate: [loginGuard],
    },
    {
        path: 'cadastro', component: CadastroComponent,
        canActivate: [cadastroGuard, loginGuard]
    },
    {
        path: 'cadastro', canActivateChild: [cadChildGuard, loginGuard], children: [
            { path: 'aluno', component: AlunoComponent },
            { path: 'funcionario', component: FuncionarioComponent }
        ]
    },
    {
        path: 'login', component: LoginComponent,
        canActivate: [loginGuard]
    },
    {
        path: 'dashboard', component: DashboardComponent,
        canActivate: [tokenGuard]
    }
];
