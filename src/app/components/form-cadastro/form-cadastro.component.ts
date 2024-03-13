import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, ViewChildren } from '@angular/core';
import { formTitle } from '../../types';
import { FormContentComponent } from '../form-content/form-content.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-cadastro',
  standalone: true,
  imports: [ReactiveFormsModule, FormContentComponent],
  templateUrl: './form-cadastro.component.html',
  styleUrl: './form-cadastro.component.scss'
})
export class FormCadastroComponent implements AfterViewInit {
  @Input() titleForm?: string;
  @Input() titlesSwitch?: formTitle[];
  @Input() form!: FormGroup;
  @ViewChildren('title') titles!: ElementRef[];

  constructor(
    private cdr: ChangeDetectorRef
  ) {}

  filterType?: string;

  ngAfterViewInit(): void {
    if (this.titlesSwitch) this.selectTitle(this.titlesSwitch[0]);
  }

  selectTitle(title: formTitle) {
    const nativeTitles = this.titles.map(({ nativeElement }) => nativeElement);
    const titleElem = nativeTitles.find(({ id }) => id == title.id);
    const siblings = nativeTitles.filter(({ id }) => id != title.id);
    
    titleElem.classList.add('active');
    siblings.forEach(sibling => sibling.classList.remove('active'));
    
    this.filterType = title.id;
    this.cdr.detectChanges();
  }

  submitForm() {
    console.log(this.form.value);
  }
}
