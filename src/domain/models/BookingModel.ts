import { BaseModel } from './BaseModel';
import type { IPaginationResponse } from '../vo/Pagination';

export type BookingType = 'equipment' | 'room';

export type BookingStatus = 'process' | 'approved' | 'rejected' | 'completed';

export type BookingRepeat = 'none' | 'daily' | 'weekly' | 'monthly';

export interface IBookingItem {
  id: string;
  inventory_id: string;
  quantity: number;
  inventory_name?: string;
  inventory_category?: string;
}

export interface IBooking {
  id: string;
  borrower: string;
  type: BookingType;
  letter_file?: string;
  title?: string;
  reason_rejected?: string;
  items?: IBookingItem[];
  date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  repeat?: BookingRepeat;
  repeat_end?: string;
  status: BookingStatus;
  note?: string;
}

export interface BookingItemInput {
  inventory_id: string;
  quantity: number;
}

export interface BookingInput {
  borrower: string;
  type: BookingType;
  letter_file?: string;
  title?: string;
  reason_rejected?: string;
  items?: BookingItemInput[];
  date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  repeat?: BookingRepeat;
  repeat_end?: string;
  status?: BookingStatus;
  note?: string;
}

export interface BookingFilters {
  type?: BookingType;
  status?: BookingStatus;
  borrower?: string;
  title?: string;
  page: number;
  limit: number;
}

export interface IBookingPaginationResponse extends IPaginationResponse {
  bookings: IBooking[];
}

export class BookingModel extends BaseModel {
  borrower: string;
  type: BookingType;
  letter_file?: string;
  title?: string;
  reason_rejected?: string;
  items?: IBookingItem[];
  date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  repeat?: BookingRepeat;
  repeat_end?: string;
  status: BookingStatus;
  note?: string;

  constructor(data: IBooking) {
    super(data.id);
    this.borrower = data.borrower;
    this.type = data.type;
    this.letter_file = data.letter_file;
    this.title = data.title;
    this.reason_rejected = data.reason_rejected;
    this.items = data.items;
    this.date = data.date;
    this.end_date = data.end_date;
    this.start_time = data.start_time;
    this.end_time = data.end_time;
    this.repeat = data.repeat;
    this.repeat_end = data.repeat_end;
    this.status = data.status;
    this.note = data.note;
  }
}
