import { Deserializable } from './deserializable.model';

export class DepartmentsModel implements Deserializable {
  departments: IDepartmentsModel[] = []
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

export interface IDepartmentsModel {
  id: number;
  department: string;
  location: string;
  lead: string;
  status: string;
}
