import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PrismaModalidade } from '../../types';

@Component({
  selector: 'create-modalidade',
  standalone: true,
  imports: [],
  templateUrl: './create-modalidade.component.html',
  styleUrl: './create-modalidade.component.scss'
})
export class CreateModalidadeComponent {
  @Output() createMod = new EventEmitter();

  runCreateMod = () => {
    this.createMod.emit();
  }
}
