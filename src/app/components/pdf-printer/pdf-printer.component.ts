import { Component, ElementRef, Input } from '@angular/core';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-pdf-printer',
  standalone: true,
  imports: [],
  templateUrl: './pdf-printer.component.html',
  styleUrl: './pdf-printer.component.scss'
})
export class PdfPrinterComponent {
  @Input() content!: ElementRef;

  printPDF(saveName: string) {
    const doc = new jsPDF('portrait', 'mm', 'A4');

    doc.html(this.content.nativeElement, {
      callback(doc) {
          doc.save(`${saveName}.pdf`);
      },
    })
  }
}
