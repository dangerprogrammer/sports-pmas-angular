import { Component, Input, OnInit } from '@angular/core';
import { PrismaSolic, PrismaUser } from '../../types';
import { CadastroService } from '../../services/cadastro.service';
import { StringTools } from '../../tools';
import { SolicContentComponent } from '../solic-content/solic-content.component';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'solic-button',
  standalone: true,
  imports: [SolicContentComponent, JsonPipe],
  templateUrl: './solic-button.component.html',
  styleUrl: './solic-button.component.scss'
})
export class SolicButtonComponent extends StringTools implements OnInit {
  constructor(
    private cadastro: CadastroService
  ) {
    super();
  }

  @Input() solicUser!: PrismaUser;
  @Input() adminUser!: PrismaUser;
  @Input() refresh?: Function;

  userSolic!: PrismaSolic;

  ngOnInit(): void {
    const searchSolic = this.cadastro.searchSolic(this.solicUser.id);

    searchSolic.subscribe(data => this.userSolic = data);
  }

  acceptUser(accept: boolean, ev: Event) {
    ev.stopPropagation();

    const acceptPrisma = this.cadastro.acceptUser({
      cpf: this.solicUser.cpf,
      accepted: accept
    });

    acceptPrisma.subscribe(() => {
      if (this.refresh) this.refresh();
    });
  }
  
  show: boolean = !1;

  showMore = (showing: boolean, ev: Event) => {
    ev.stopPropagation();

    this.show = showing;
  }
}
