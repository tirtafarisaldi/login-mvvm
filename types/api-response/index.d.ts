declare module 'api-response' {
  import { UserStatusSlug } from 'common-types';
  export interface ErrorResponse {
    response?: {
      data?: {
        error?: {
          message: string;
          error_user_msg: string;
          error_user_title: string;
        };
        message: string;
        status: number;
      };
    };
  }

  export interface Page {
    total: number;
    current: number;
    total_data: number;
  }

  export interface PagedResponse<T> {
    status: number;
    message: string;
    data: T;
  }
}
