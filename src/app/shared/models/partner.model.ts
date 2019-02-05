import {Deserializable} from './deserializable.model';

export class Partner implements Deserializable {
  id: number | string;
  name:  string;
  createdAt: Date | string;
  updatedAt: Date | string;

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
