import { Component, Input } from '@angular/core';
import fileSaver from 'file-saver';
import { AlertService } from 'src/app/shared/alert.service';
import { ExportService } from '../__services__/export.component.service';

@Component({
  selector: 'app-export-view',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent {
  @Input() tableName: string;
  @Input() sort: string;
  @Input() filterParams: any;

  constructor(
    public toastr: AlertService,
    public exportService: ExportService
  ) { }

  async exportToPDF() {
    const infoToastr = this.toastr.info('Hold on tight, we\'re getting your document ready.')

    this.toastr.clear(infoToastr);

    await this.exportService.exportToPDF(this.tableName, this.sort, this.filterParams)
      .subscribe(async(data) => {
        const blob = new Blob([data], {type: 'application/pdf'});
        await fileSaver.saveAs(blob, `${this.tableName}.pdf`);
        this.toastr.success(`Success! ${this.tableName}.pdf downloaded!`);
      }, () => {
        this.toastr.error('Failed to download. Try Again!')
      });
  }

  exportToCSV() {
    // logic for export to csv
  }
}
