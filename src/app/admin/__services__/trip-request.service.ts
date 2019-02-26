import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, retry } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as moment from 'moment';

import { environment } from '../../../environments/environment';
import { createRequestOption } from 'src/app/utils/request-util';
import { IPageMeta } from '../../shared/models/page-meta.model';
import { TripRequest } from '../../shared/models/trip-request.model';

export interface TripResponseData {
  pageInfo: IPageMeta;
  trips: TripRequest[];
}

@Injectable({ providedIn: 'root' })
export class TripRequestService {
  private routesUrl = `${environment.tembeaBackEndUrl}/api/v1/trips`;

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
            trip.requestedOn = moment(trip.requestedOn);
            trip.departureTime = moment(trip.departureTime)
          });
          return { trips, pageInfo };
        })
      );
  }
}
