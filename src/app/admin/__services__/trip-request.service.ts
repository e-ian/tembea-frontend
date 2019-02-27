import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs';
import * as moment from 'moment';
import {map, retry, filter} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {createRequestOption} from 'src/app/utils/request-util';
import {IPageMeta} from '../../shared/models/page-meta.model';
import {TripRequest} from 'src/app/shared/models/trip-request.model';
import {DepartmentsModel} from 'src/app/shared/models/departments.model';

export interface TripResponseData {
  pageInfo: IPageMeta;
  trips: TripRequest[];
}

@Injectable({ providedIn: 'root' })
export class TripRequestService {
  private routesUrl = `${environment.tembeaBackEndUrl}/api/v1/trips`;
  private departmentsUrl = `${environment.tembeaBackEndUrl}/api/v1/departments`;

  constructor(private http: HttpClient) {
  }

  query(req?): Observable<TripResponseData> {
    const params = createRequestOption(req);
    return this.http.get<any>(`${this.routesUrl}`, { params, observe: 'response' })
      .pipe(
        retry(3),
        map((res) => {
          const { trips, pageMeta: pageInfo } = res.body.data;
          trips.forEach((trip: TripRequest) => {
            trip.requestedOn = moment(trip.requestedOn )
            trip.departureTime = moment(trip.departureTime)
          });
          return { trips, pageInfo };
        })
      );
  }

  getDepartments(): Observable<DepartmentsModel> {
    return this.http.get<any>(`${this.departmentsUrl}`)
      .pipe(
        retry(3),
        map((res) => {
          const { departments } = res;
          return departments;
        })
      );

  }
}


