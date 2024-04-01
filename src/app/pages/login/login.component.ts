import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { MainComponent } from '../../components/main/main.component';
import { FormComponent } from '../../components/form/form.component';
import { FormTableComponent } from '../../components/form/form-table/form-table.component';
import { FormInputComponent } from '../../components/form/form-table/form-input/form-input.component';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { CadastroService } from '../../services/cadastro.service';
import { FormLinkComponent } from '../../components/form-link/form-link.component';
import { loginData } from '../../types';
import { LoginSubmit } from '../../tools';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    HeaderComponent,
    BackButtonComponent,
    MainComponent,
    FormComponent,
    FormTableComponent,
    FormInputComponent,
    FormLinkComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends LoginSubmit implements OnInit {
  constructor(
    private fb: FormBuilder,
    private service: CadastroService
  ) {
    super();
  }

  cpfValidator(control: AbstractControl) {
    const cpf = control.value;

    if (cpf && cpf.toUpperCase() == 'ROOT') return null;

    if (cpf.length < 11) return { 'invalidCPFLength': true };

    return null;
  }

  ngOnInit(): void {
    this.form.patchValue(this.service.loginData);
    
    const cpf = this.form.get("cpf");

    cpf?.valueChanges.subscribe(cpfData => {
      const upper = cpfData?.toUpperCase();
      if (upper == 'ROOT') cpf.setValue(upper, { emitEvent: false });
    });

    this.form.valueChanges.subscribe(data => {
      const isROOT = this.service.isROOT(data as loginData);

      if (isROOT) this.submitFunction(data);
    });
  }

  form = this.fb.group({
    cpf: ['', this.cpfValidator],
    password: ['', Validators.required]
  });
}
