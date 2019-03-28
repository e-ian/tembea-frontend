import { Deserializable } from './deserializable.model';
import { Users } from './users.model';
import { Moment } from 'moment';

export enum TripStatus {
  APPROVED = 'Approved',
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
}

export class TripRequest  implements Deserializable<TripRequest>  {
  constructor(
    public id?: number,
    public status?: TripStatus,
    public type?: string,
    public passenger?: number,
    public department?: string,
    public destination?: string,
    public pickup?: string,
    public departureTime?: Moment,
    public requestedOn?: Moment,
    public rider?: Users,
    public flightNumber?: string,
    public requester?: Users,
    public approvedBy?: Users,
    public confirmedBy?: Users,
  ) {
  }
  deserialize(input: any): TripRequest {
    Object.assign(this, input);
    return this;
  }
}
