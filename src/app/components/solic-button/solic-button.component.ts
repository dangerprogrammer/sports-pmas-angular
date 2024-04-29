import { Component, Input, OnInit } from '@angular/core';
import { PrismaSolic, PrismaUser } from '../../types';
import { CadastroService } from '../../services/cadastro.service';
import { DateTools, StringTools } from '../../tools';
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
  @Input() onlyRead: boolean = !1;

  userSolic?: PrismaSolic;
  doneBy?: PrismaUser;

  date = new DateTools();

  ngOnInit(): void {
    const searchSolic = this.cadastro.search.searchSolic(this.solicUser.id);

    searchSolic.subscribe(solic => {
      this.userSolic = solic;
    
      const adminPrisma = this.cadastro.search.searchUserById(this.userSolic.adminId);

      if (this.userSolic.done) adminPrisma.subscribe(admin => this.doneBy = admin);
    });
  }

  acceptUser(accept: boolean, ev: Event) {
    ev.stopPropagation();

    const acceptPrisma = this.cadastro.auth.acceptUser({
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
