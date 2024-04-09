import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'form-submit',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-submit.component.html',
  styleUrl: './form-submit.component.scss'
})
export class FormSubmitComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() submitEvent?: Function;
  @Input() freezeFormFunc!: any;

  ngOnInit(): void {
    const tel = this.form.get("tel");
    const nome_comp = this.form.get("nome_comp");

    if (tel) tel.valueChanges.subscribe(data => {
      console.log(data, tel.errors, tel.valid);
    });
    if (nome_comp) nome_comp.valueChanges.subscribe(nome => {
      if (nome == '@default') {
        const cpf = this.form.get("cpf");
        const password = this.form.get("password");
        const email = this.form.get("email");
        const tel = this.form.get("tel");
        const endereco = this.form.get("aluno.endereco");
        const bairro = this.form.get("aluno.bairro");
        const data_nasc = this.form.get("aluno.data_nasc");

        nome_comp.setValue('Patrick Vieira Léo', { emitEvent: !1 });
        if (cpf) cpf.setValue('52591490848', { emitEvent: !1 });
        if (password) password.setValue('123456', { emitEvent: !1 });
        if (email) email.setValue('papatrileo@gmail.com', { emitEvent: !1 });
        if (tel) tel.setValue('15 98100-4777', { emitEvent: !1 });
        if (endereco) endereco.setValue('Avenida Itália', { emitEvent: !1 });
        if (bairro) bairro.setValue('Monte Bianco', { emitEvent: !1 });
        if (data_nasc) data_nasc.setValue('2004-12-10', { emitEvent: !1 });
      };
    });
  }

  hasRole = (roles: any[], role: string) => roles.find(r => r == role);

  submitForm(ev: Event) {
    ev.preventDefault();

    const prismaRes = this.form.value;

    if (prismaRes.solic) {
      if (typeof prismaRes.solic.roles == "string") prismaRes.solic.roles = prismaRes.solic.roles.split(',');

      if (this.hasRole(prismaRes.solic.roles, "ALUNO")) prismaRes.aluno = {
        ...prismaRes.aluno,
        data_nasc: new Date(prismaRes.aluno.data_nasc).toISOString()
      };
    };

    if (prismaRes.horarios) {
      prismaRes.horarios = prismaRes.horarios.map((horario: any) => {
        const hora = +horario.text.substring(0, 2);
        const minuto = +horario.text.substring(3);
        const data = new Date();

        data.setUTCFullYear(2024, 0, 1);
        data.setUTCHours(hora, minuto, 0, 0);

        return {
          time: data.toISOString(), periodo: hora >= 5 && hora < 12 ?
            'MANHA' : hora >= 12 && hora < 18 ? 'TARDE' : 'NOITE'
        };
      });
    }

    if (this.submitEvent) {
      this.freezeFormFunc(!0);
      return this.submitEvent(prismaRes, this.form);
    };
  }
}
