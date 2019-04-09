import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FellowsModel } from 'src/app/shared/models/fellows.model';

@Injectable({
  providedIn: 'root'
})
export class FellowsService {
  fellowsUrl: string;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {
    this.fellowsUrl = `${environment.tembeaBackEndUrl}/api/v1/fellows`;
  }
  getFellows(size = 9, page = 1): Observable<any> {
    const queryParams = `size=${size}&page=${page}`;
    return this.http
      .get<any>(`${this.fellowsUrl}?${queryParams}`)
      .map(fellows => {
        return new FellowsModel().deserialize(fellows);
      });
  }
}
