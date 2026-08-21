import { ErrorState } from './ErrorState';

export interface IResult<TData> {
  data: TData | null;
  loading?: boolean;
  error?: string;
  status?: number;
  user_message?: string;
  isSuccess(): boolean;
  isLoading(): boolean;
  isFailed(): boolean;
  setData(data: TData): void;
  setLoading(loading: boolean): void;
  setError(error: any): void;
}

export class Result<TData> implements IResult<TData> {
  public data: TData | null;
  public loading = false as boolean;
  public error: any;
  public status?: any;
  public user_message?: any;

  constructor(data?: TData) {
    this.data = data || null;
  }

  isSuccess() {
    return this.data !== undefined || this.data !== null;
  }

  isLoading() {
    return this.loading === true;
  }

  isFailed() {
    return Boolean(this.error);
  }

  setData(data: TData) {
    this.data = data;
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setError(error: any) {
    this.error = error;
  }
}
