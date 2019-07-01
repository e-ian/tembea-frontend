import * as moment from 'moment';
import { TripRequest, TripStatus } from '../models/trip-request.model';
import {Users} from '../models/users.model';

const user = new Users().deserialize({
  'id': 123,
  'name': 'OOOOOO PPPPPP',
  'email': 'AAA.BBB@CCC.DDD',
  'slackId': 'ZZZZZZ',
});
export const tripRequestMock: TripRequest = new TripRequest().deserialize({
  'name': 'From Jomo Kenyatta Airport to Andela Nairobi on 22/12/2019 22:00',
  'status': TripStatus.APPROVED,
  'arrivalTime': null,
  'type': 'Regular Trip',
  'departureTime': moment('2019-12-22T21:00:00.000Z'),
  'requestedOn': moment('2019-02-26T09:07:52.185Z'),
  'department': 'Finance-demo-update',
  'destination': 'Andela Nairobi',
  'pickup': 'Jomo Kenyatta Airport',
  'rider': user,
  'requester': user,
  'approvedBy': user,
  'provider': {
    name: 'Uber Kenya',
    email: 'uberkenya@uber.com',
    phoneNumber: '08040404040'
  },
  id: 1
});

export const pastTripMock: TripRequest[] = [
  new TripRequest().deserialize({
  'name': 'From Jomo Kenyatta Airport to Andela Nairobi on 22/12/2019 22:00',
  'status': TripStatus.COMPLETED,
  'arrivalTime': null,
  'type': 'Regular Trip',
  'departureTime': '2019-12-22T21:00:00.000Z',
  'requestedOn': '2019-02-26T09:07:52.185Z',
  'department': 'Finance-demo-update',
  'destination': 'Andela Nairobi',
  'pickup': 'Jomo Kenyatta Airport',
  'rider': user,
  'requester': user,
  'approvedBy': user
}),
new TripRequest().deserialize({
  'name': 'From Jomo Kenyatta Airport to Andela Nairobi on 22/12/2019 22:00',
  'status': TripStatus.OPSDECLINE,
  'arrivalTime': null,
  'type': 'Regular Trip',
  'departureTime': '2019-12-22T21:00:00.000Z',
  'requestedOn': '2019-02-26T09:07:52.185Z',
  'department': 'Finance-demo-update',
  'destination': 'Andela Nairobi',
  'pickup': 'Jomo Kenyatta Airport',
  'rider': user,
  'requester': user,
  'approvedBy': user
}),
new TripRequest().deserialize({
  'name': 'From Jomo Kenyatta Airport to Andela Nairobi on 22/12/2019 22:00',
  'status': TripStatus.MANAGERDECLINE,
  'arrivalTime': null,
  'type': 'Regular Trip',
  'departureTime': '2019-12-22T21:00:00.000Z',
  'requestedOn': '2019-02-26T09:07:52.185Z',
  'department': 'Finance-demo-update',
  'destination': 'Andela Nairobi',
  'pickup': 'Jomo Kenyatta Airport',
  'rider': user,
  'requester': user,
  'approvedBy': user
}),
new TripRequest().deserialize({
  'name': 'From Jomo Kenyatta Airport to Andela Nairobi on 22/12/2019 22:00',
  'status': TripStatus.CANCELLED,
  'arrivalTime': null,
  'type': 'Regular Trip',
  'departureTime': '2019-12-22T21:00:00.000Z',
  'requestedOn': '2019-02-26T09:07:52.185Z',
  'department': 'Finance-demo-update',
  'destination': 'Andela Nairobi',
  'pickup': 'Jomo Kenyatta Airport',
  'rider': user,
  'requester': user,
  'approvedBy': user
}),
new TripRequest().deserialize({
  'name': 'From Jomo Kenyatta Airport to Andela Nairobi on 22/12/2019 22:00',
  'status': TripStatus.APPROVED,
  'arrivalTime': null,
  'type': 'Regular Trip',
  'departureTime': '3019-12-22T21:00:00.000Z',
  'requestedOn': '2019-02-26T09:07:52.185Z',
  'department': 'Finance-demo-update',
  'destination': 'Andela Nairobi',
  'pickup': 'Jomo Kenyatta Airport',
  'rider': user,
  'requester': user,
  'approvedBy': user
}),
new TripRequest().deserialize({
  'name': 'From Jomo Kenyatta Airport to Andela Nairobi on 22/12/2019 22:00',
  'status': TripStatus.APPROVED,
  'arrivalTime': null,
  'type': 'Regular Trip',
  'departureTime': '2018-12-22T21:00:00.000Z',
  'requestedOn': '2019-02-26T09:07:52.185Z',
  'department': 'Finance-demo-update',
  'destination': 'Andela Nairobi',
  'pickup': 'Jomo Kenyatta Airport',
  'rider': user,
  'requester': user,
  'approvedBy': user
})];
