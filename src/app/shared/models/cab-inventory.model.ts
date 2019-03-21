import { Deserializable } from './deserializable.model';
import { IPageMeta } from './page-meta.model';

export class CabInventoryModel implements Deserializable<CabInventoryModel> {
  pageMeta?: IPageMeta;
  cabs: ICabInventory[] = [];
  deserialize(input: any): CabInventoryModel {
    Object.assign(this, input);
    return this;
  }
}

export interface ICabInventory {
  id?: number;
  regNumber: string;
  capacity: number;
  driverName: string;
  driverPhoneNo: string;
  location: string;
}
