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
  model?: string;
  providerId: number;
  capacity: number;
}

export class CabModel implements ICabInventory {
  constructor(
    public id: number,
    public regNumber: string,
    public capacity: number,
    public model: string,
    public providerId: number,
  ) {}
}
export interface IDeleteCabInventory {
  success: boolean;
  message: string;
}
