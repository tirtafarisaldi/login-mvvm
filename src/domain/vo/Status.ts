export type Status = 'active' | ' inactive';

export interface IGeneralStatus {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface IGeneralStatusResponse {
  general_status: IGeneralStatus[];
}

export class GeneralStatus implements IGeneralStatus {
  id;
  name;
  slug;
  description;

  constructor(data: IGeneralStatus) {
    this.id = data.id;
    this.name = data.name;
    this.slug = data.slug;
    this.description = data.slug;
  }
}
