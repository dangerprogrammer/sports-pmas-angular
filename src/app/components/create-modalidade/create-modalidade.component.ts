import { Component, EventEmitter, Input, Output } from '@angular/core';
import { modName, PrismaModalidade } from '../../types';

@Component({
  selector: 'create-modalidade',
  standalone: true,
  imports: [],
  templateUrl: './create-modalidade.component.html',
  styleUrl: './create-modalidade.component.scss'
})
export class CreateModalidadeComponent {
  @Input() modalidades!: PrismaModalidade[];
  @Input() availableNames!: modName[];
  @Output() createMod = new EventEmitter();

  hasMod = (name: modName) => this.modalidades.find(({ name: modName }) => modName == name);

  runCreateMod = () => {
    const names = this.availableNames.filter(name => !this.hasMod(name));

    this.createMod.emit({ names });
  }
}
