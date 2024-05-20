import { Routes } from '@angular/router';
import { AlunoComponent } from './pages/cadastro/aluno/aluno.component';
import { HomeComponent } from './pages/home/home.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { FuncionarioComponent } from './pages/cadastro/funcionario/funcionario.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ModalidadesComponent } from './pages/modalidades/modalidades.component';
import { acceptGuard, cadChildGuard, loginGuard, modGuard } from './guards';

export const routes: Routes = [
    {
        path: '', component: HomeComponent, canActivate: [loginGuard], title: 'Home'
    },
    {
        path: 'cadastro', component: CadastroComponent, title: 'Cadastro'
    },
    {
        path: 'cadastro', canActivateChild: [cadChildGuard], children: [
            { path: 'aluno', component: AlunoComponent },
            { path: 'funcionario', component: FuncionarioComponent }
        ]
    },
    {
        path: 'login', component: LoginComponent, title: 'Login',
        canActivate: [loginGuard]
    },
    {
        path: 'dashboard', component: DashboardComponent, title: 'Dashboard',
        canActivate: [acceptGuard]
    },
    {
        path: 'profile', component: ProfileComponent,
        canActivate: [acceptGuard]
    },
    {
        path: 'modalidades', component: ModalidadesComponent,
        canActivate: [modGuard]
    },
    {
        path: 'users/:cpf', component: ProfileComponent,
        canActivate: [modGuard]
    }
];
