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
import { ProfileComponent } from './pages/profile/profile.component';
import { ModalidadesComponent } from './pages/modalidades/modalidades.component';
import { modGuard } from './guards/mod.guard';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { acceptGuard } from './guards/accept.guard';

export const routes: Routes = [
    {
        path: '', component: HomeComponent, canActivate: [loginGuard], title: 'Home'
    },
    {
        path: 'cadastro', component: CadastroComponent, title: 'Cadastro',
        canActivate: [cadastroGuard, loginGuard]
    },
    {
        path: 'cadastro', canActivateChild: [cadChildGuard, loginGuard], children: [
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
        canActivate: [tokenGuard]
    },
    {
        path: 'profile', component: ProfileComponent,
        canActivate: [acceptGuard]
    },
    {
        path: 'notifications', component: NotificationsComponent,
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
