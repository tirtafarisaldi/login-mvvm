import { Pagination } from './Pagination';
import { Result } from './Result';

interface IPaginationResult<TData> extends Result<Array<TData>> {
  pagination: Pagination | null;

  setPagination(pagination: Pagination): void;
}

export class PaginationResult<TData>
  extends Result<Array<TData>>
  implements IPaginationResult<TData>
{
  public pagination;

  constructor(data?: Array<TData>, pagination?: Pagination) {
    super(data);
    this.pagination = pagination || null;
  }

  setPagination(pagination: Pagination) {
    this.pagination = pagination;
  }
}
