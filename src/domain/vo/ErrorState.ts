/**
 * Errors that are related to the business
 */

export interface ReactQueryError {
  config: any;
  data: {
    status: number;
    data: any;
    error: {
      message: string;
      reason: string;
      validation: string | string[];
    };
    user_message: {
      title: string;
      message: string;
    };
  };
  headers: any;
  request: any;
  status: number;
  statusText: string;
}

export enum ErrorReason {
  NOT_FOUND = 'not_found',
  UNAUTHORIZED = 'unauthorized',
  UNKNOWN = 'unknown',
  BAD_REQUEST = 'bad_request',
  DUPLICATED = 'Duplicated'
}

export enum ErrorType {
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  UNKNOWN = 'UNKNOWN',
  BAD_REQUEST = 'BAD_REQUEST',
  DUPLICATED = 'DUPLICATED'
}

export type ErrorMessage = string | string[];

interface IErrorState {
  type: ErrorType;
  message: ErrorMessage;

  setType(type: ErrorType): void;
  setMessage(message: ErrorMessage): void;

  isNotFound(): boolean;
  isUnauthorized(): boolean;
  isUnknown(): boolean;
  isBadRequest(): boolean;
}

export class ErrorState implements IErrorState {
  public type;
  public message;

  constructor(type: ErrorType = ErrorType.UNKNOWN, message: string | string[] = '') {
    this.type = type;
    this.message = message;
  }

  setType(type: ErrorType) {
    this.type = type;
  }

  setMessage(message: string | string[]) {
    this.message = message;
  }

  isNotFound() {
    return this.type === ErrorType.NOT_FOUND;
  }

  isUnauthorized() {
    return this.type === ErrorType.UNAUTHORIZED;
  }

  isUnknown() {
    return this.type === ErrorType.UNKNOWN;
  }

  isBadRequest() {
    return this.type === ErrorType.BAD_REQUEST;
  }
}
