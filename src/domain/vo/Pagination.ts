export interface IPagination {
  total: number;
  current: number;
  total_data: number;
}

export interface IPaginationResponse {
  page: IPagination;
}

export class Pagination implements IPagination {
  total;
  current;
  total_data;

  constructor(data: IPagination) {
    this.total = data.total;
    this.current = data.current;
    this.total_data = data.total_data;
  }
}
