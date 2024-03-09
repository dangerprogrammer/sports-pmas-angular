import { Routes } from '@angular/router';
import { tokenGuard } from './guards/token.guard';
import { AlunoComponent } from './pages/cadastro/aluno/aluno.component';
import { HomeComponent } from './pages/home/home.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { cadastroGuard } from './guards/cadastro.guard';
import { cadChildGuard } from './guards/cad-child.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [tokenGuard] },
    {
        path: 'cadastro', component: CadastroComponent,
        canActivate: [cadastroGuard], canActivateChild: [cadChildGuard],
        children: [
            { path: 'aluno', component: AlunoComponent }
        ]
    }
];
