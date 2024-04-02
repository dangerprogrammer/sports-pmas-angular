import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { formTitle } from '../../types';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormInputComponent } from './form-table/form-input/form-input.component';
import { NgIf } from '@angular/common';
import { FormTableComponent } from './form-table/form-table.component';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormInputComponent, NgIf],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements AfterViewInit {
  @Input() titleForm?: string;
  @Input() titleSmall: boolean = !1;
  @Input() createMod?: any;
  @Input() titleSelector?: string[];
  @Input() titlesSwitch?: formTitle[];
  @Input() isFreeze: boolean = !1;
  @Input() loginForm: boolean = !1;
  @Input() freezeForm?: Function;

  @ViewChildren('title') titles!: ElementRef[];
  @ViewChild('inputs', { read: ViewContainerRef }) inputs!: ViewContainerRef;

  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  filterType?: string;

  ngAfterViewInit(): void {
    if (this.titlesSwitch) this.selectTitle(this.titlesSwitch[0]);

    if (this.createMod) {
      const tableRef = this.inputs.createComponent(FormTableComponent);

      for (const field in this.createMod) {
        tableRef.setInput(field, this.createMod[field]);
        this.cdr.detectChanges();
      };

      tableRef.instance.freezeForm.subscribe(this.freezeForm);
    };
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
