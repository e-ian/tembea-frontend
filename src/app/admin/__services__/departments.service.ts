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
  departmentsUrl: string;
  teamUrl = environment.teamUrl;
  constructor(private http: HttpClient) {
    this.departmentsUrl = `${environment.tembeaBackEndUrl}/api/v1/departments`;
  }
  getDepartments(size: number, page: number): Observable<DepartmentsModel> {
    return this.http.get<any>(`${this.departmentsUrl}?size=${size}&page=${page}`).map(departments => {
      return new DepartmentsModel().deserialize(departments);
    });
  }

  addDepartment(data: Object): Observable<any> {
    return this.http.post<any>(this.departmentsUrl, {...data, slackUrl: this.teamUrl})
  }
}
