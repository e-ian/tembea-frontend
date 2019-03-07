import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { createRequestOption } from 'src/app/utils/request-util';
import { TripRequestService } from './trip-request.service';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  exportToPDFUrl = `${environment.tembeaBackEndUrl}/api/v1/export/pdf`;

  constructor(
    private http: HttpClient
  ) { }

  exportToPDF(tableName, sort, filterParams) {
    let params;
    if (filterParams) {
      const reqDate = TripRequestService.flattenDateFilter(filterParams);
      params = createRequestOption(reqDate);
    }
    return this.http.get(`${this.exportToPDFUrl}?table=${tableName}&sort=${sort}`,
    {
      params,
      responseType: 'arraybuffer',
      headers: { 'Accept': 'application/pdf' }
    }).pipe(retry(3));
  }
}
