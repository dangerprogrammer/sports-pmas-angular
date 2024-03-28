import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChildren } from '@angular/core';
import { formTitle } from '../../types';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements AfterViewInit {
  @Input() titleForm?: string;
  @Input() titlesSwitch?: formTitle[];
  @Input() isFreeze: boolean = !1;
  @Input() loginForm: boolean = !1;
  
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
}
