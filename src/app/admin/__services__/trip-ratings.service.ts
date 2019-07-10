import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { filterDateParameters } from 'src/app/utils/helpers';
import { ITripRatingModel } from 'src/app/shared/models/trip-ratings.model';

@Injectable({
  providedIn: 'root'
})
export class TripRatingsService {

  constructor(private http: HttpClient) { }



  getTripData(dateFilter): Observable<any> {
    const { startDate, endDate } = filterDateParameters(dateFilter);
    const data: object = { startDate, endDate };
    const results = this.http.post(`${environment.tembeaBackEndUrl}/api/v1/departments/trips`, { ...data });
    return results;
  }
}
