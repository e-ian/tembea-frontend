import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { riders } from './mock.data';
import {IRider} from '../../../shared/models/rider.model';

@Injectable({
  providedIn: 'root'
})
export class RiderService {

  constructor() { }

  getRiders(): Observable<IRider[]> {
    return of(riders);
  }
}
