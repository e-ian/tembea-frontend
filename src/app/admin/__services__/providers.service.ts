import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  providersUrl = `${environment.tembeaBackEndUrl}/api/v1/providers`;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(
    private http: HttpClient,
  ) { }

  getProviders(size: number, page: number): Observable<any> {
    return this.http
      .get<any>(`${this.providersUrl}?size=${size}&page=${page}`);
  }
}
