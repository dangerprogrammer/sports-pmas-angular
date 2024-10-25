import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { weekDays } from '../../../../types';

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
  @Input() removePassword: boolean = !1;

  ngOnInit(): void {
    const nome_comp = this.form.get<string>("nome_comp");

    if (nome_comp) nome_comp.valueChanges.subscribe(nome => {
      if (nome == '@d') {
        nome_comp.setValue('Patrick Vieira Léo', { emitEvent: !1 });

        this.appendValues(
          { field: 'cpf', value: '52591490848' },
          { field: 'password', value: '123456' },
          { field: 'email', value: 'papatrileo@gmail.com' },
          { field: 'tel', value: '15 98100-4777' },
          { field: 'aluno.endereco', value: 'Avenida Itália' },
          { field: 'aluno.bairro', value: 'Monte Bianco' },
          { field: 'aluno.data_nasc', value: '2004-12-10' }
        );

        this.form.updateValueAndValidity();
      };
    });
  }

  appendValues = (...values: { field: string, value: string }[]) => {
    for (const { field, value } of values) this.form.get(field)?.setValue(value);
  }

  hasRole = (roles: any[], role: string) => roles.find(r => r == role);

  submitForm(ev?: Event) {
    ev?.preventDefault();

    const prismaRes = this.form.value;

    if (prismaRes.solic) {
      if (typeof prismaRes.solic.roles == "string") prismaRes.solic.roles = prismaRes.solic.roles.split(',');

      if (this.hasRole(prismaRes.solic.roles, "ALUNO")) prismaRes.aluno = {
        ...prismaRes.aluno,
        data_nasc: new Date(prismaRes.aluno.data_nasc).toISOString()
      };
    };

    if (prismaRes.aluno) prismaRes.aluno = {
      ...prismaRes.aluno,
      data_nasc: new Date(prismaRes.aluno.data_nasc).toISOString()
    };

    if (prismaRes.horarios) {
      prismaRes.horarios = prismaRes.horarios.map(({ text }: { text: any }) => {
        const [day, time]: [weekDays, string] = text.split(' - ');
        const daysList: weekDays[] = ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA'];
        const [hora, minuto] = time.split(':').map(c => +c);
        const data = new Date();
        const indexDay = daysList.indexOf(day);

        data.setUTCHours(hora, minuto, 0, 0);

        return {
          time: data.toISOString(), day: daysList[indexDay],
          periodo: hora >= 5 && hora < 12 ? 'MANHA' : hora >= 12 && hora < 18 ? 'TARDE' : 'NOITE'
        };
      });
    }

    if (this.removePassword) delete prismaRes.password;

    if (this.submitEvent) {
      this.freezeFormFunc(!0);
      return this.submitEvent(prismaRes, this.form);
    };
  }
}
