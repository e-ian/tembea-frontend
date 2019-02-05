import {Deserializable} from './deserializable.model';

export class Location implements Deserializable {
  id: number | string;
  locationId: number | string;
  address: string;
  createdAt: Date | string;
  updatedAt: Date | string;

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
