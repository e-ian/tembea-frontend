import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DepartmentsModel } from 'src/app/shared/models/departments.model';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root',
})
export class DepartmentsService {
  departmentsUrl: string = `${environment.tembeaBackEndUrl}/api/v1/departments`;
  constructor(private http: HttpClient) {}

  getDepartments(size: number, page: number): Observable<DepartmentsModel> {
    return this.http.get<any>(`${this.departmentsUrl}?size=${size}&page=${page}`).map(departments => {
      return new DepartmentsModel().deserialize(departments);
    });
  }
}
