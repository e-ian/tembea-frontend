import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { filterDateParameters } from 'src/app/utils/helpers';



@Injectable({
  providedIn: 'root'
})
export class RouteRatingsService implements OnInit {
  constructor(private http: HttpClient) { }
  ngOnInit() {
  }

  getRouteAverages(dateFilter): Observable<any> {
    const { startDate, endDate } = filterDateParameters(dateFilter);
    const fromStr = startDate ? `from=${startDate}` : null;
    const toStr = endDate ? `to=${endDate}` : null;
    return this.http.get(`${environment.tembeaBackEndUrl}/api/v1/routes/ratings?${fromStr}&${toStr}`);
  }
}
