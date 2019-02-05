import { Deserializable } from './deserializable.model';

export class RouteInventoryModel implements Deserializable {
  routes: IRouteInventory[] = []
  pageMeta: IPageMeta

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}

export interface IPageMeta {
  totalPages: number
  page: number
  totalResults: number
  pageSize: number
}

export interface IRouteInventory {
  id: number;
  status: string;
  takeOff: string;
  capacity: number;
  batch: string;
  comments: string;
  inUse: number;
  name: string;
  destination: string;
  driverName: string;
  driverPhoneNo: string;
  regNumber: string;
}
