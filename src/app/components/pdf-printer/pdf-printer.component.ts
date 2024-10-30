import { Component, ElementRef, Input } from '@angular/core';
import jsPDF from 'jspdf';

@Component({
  selector: 'pdf-printer',
  standalone: true,
  imports: [],
  template: ''
})
export class PdfPrinterComponent {
  @Input() content!: ElementRef;

  printPDF(saveName: string) {
    const doc = new jsPDF('portrait', 'px', 'A4');

    doc.html(this.content.nativeElement, {
      callback(doc) {
          doc.save(`${saveName}.pdf`);
      },
    })
  }
}
