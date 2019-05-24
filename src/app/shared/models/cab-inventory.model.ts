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
  capacity: string;
  driverName: string;
  driverPhoneNo?: string;
  location: string;
  model?: string;
  providerId: number;
}

export class CabModel implements ICabInventory {
  constructor(
    public regNumber: string,
    public capacity: string,
    public driverName: string,
    public location: string,
    public model: string,
    public driverPhoneNo: string,
    public providerId: number

  ) {}
}
export interface IDeleteCabInventory {
  success: boolean,
  message: string
}
