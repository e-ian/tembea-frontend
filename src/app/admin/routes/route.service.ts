import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class RouteService {

  constructor(
    private http: HttpClient
  ) { }

  createRoute(data): any {
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http
      .post(environment.tembeaBackEndUrl, data, options)
      .toPromise();
  }
}
