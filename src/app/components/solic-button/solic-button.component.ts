import { Component, Input } from '@angular/core';
import { PrismaUser } from '../../types';
import { CadastroService } from '../../services/cadastro.service';

@Component({
  selector: 'solic-button',
  standalone: true,
  imports: [],
  templateUrl: './solic-button.component.html',
  styleUrl: './solic-button.component.scss'
})
export class SolicButtonComponent {
  constructor(
    private cadastro: CadastroService
  ) {}

  @Input() solicUser!: PrismaUser;
  @Input() adminUser!: PrismaUser;
  @Input() refresh?: any;

  acceptUser(accept: boolean) {
    const acceptPrisma = this.cadastro.acceptUser({
      cpf: this.solicUser.cpf,
      accepted: accept
    });

    acceptPrisma.subscribe(_data => {
      if (this.refresh) this.refresh();
    });
  }
}
