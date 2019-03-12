import { Deserializable } from './deserializable.model';
import { IPageMeta } from './page-meta.model';

export class DepartmentsModel implements Deserializable<DepartmentsModel> {
  departments: IDepartmentsModel[] = [];
  pageMeta: IPageMeta;

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}

export interface IDepartmentsModel {
  id?: number;
  department?: string;
  location?: string;
  lead?: string;
  status?: string;
  email?: string;
}

export class Department implements IDepartmentsModel {
  constructor(
    public location?: string,
    public name?: string,
    public email?: string,
  ) {}
}
