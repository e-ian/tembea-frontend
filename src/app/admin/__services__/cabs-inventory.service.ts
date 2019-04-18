import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CabInventoryModel } from 'src/app/shared/models/cab-inventory.model';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root',
})

export class CabsInventoryService {
  cabsUrl = `${environment.tembeaBackEndUrl}/api/v1/cabs`;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(
    private http: HttpClient,
  ) { }

  getCabs(size: number, page: number, sort: string): Observable<CabInventoryModel> {
    return this.http
    .get<any>(`${this.cabsUrl}?sort=${sort}&size=${size}&page=${page}`)
    .map(cabs => {
      const cabInventoryModel = new CabInventoryModel().deserialize(cabs.data);
      return cabInventoryModel;
    });
  }
  addCab(data: Object): Observable<any> {
    return this.http.post<any>(this.cabsUrl, {...data});
  }

  deleteCab(id: number) {
    return this.http.delete(`${this.cabsUrl}/${id}`, this.httpOptions);
  }
}
