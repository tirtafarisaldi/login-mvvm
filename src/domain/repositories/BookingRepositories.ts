import type {
  BookingFilters,
  BookingInput,
  BookingModel,
  BookingStatus,
} from '../models/BookingModel';
import type { IPaginationResponse } from '../vo/Pagination';
import type { PaginationResult } from '../vo/PaginationResult';
import type { Result } from '../vo/Result';

export interface BookingListResult extends IPaginationResponse {
  bookings: BookingModel[];
}

export type BookingPayload = BookingInput & { letter?: File | null };

export interface BookingRepository {
  getBookings: (filters: BookingFilters) => Promise<BookingListResult>;
  getBookingById: (id: string) => Promise<BookingModel>;
  getBookingLetter: (id: string) => Promise<Blob>;
  createBooking: (input: BookingPayload) => Promise<BookingModel>;
  updateBooking: (
    id: string,
    input: BookingPayload
  ) => Promise<BookingModel>;
  updateBookingStatus: (
    id: string,
    status: BookingStatus,
    reason?: string
  ) => Promise<BookingModel>;
  deleteBooking: (id: string) => Promise<void>;
}

export interface GetBookingsResult {
  result: PaginationResult<BookingModel>;
}

export interface CreateBookingResult {
  result: Result<BookingModel>;
  createBooking: (input: BookingPayload) => Promise<Result<BookingModel>>;
}

export interface UpdateBookingResult {
  result: Result<BookingModel>;
  updateBooking: (
    id: string,
    input: BookingPayload
  ) => Promise<Result<BookingModel>>;
}

export interface UpdateBookingStatusResult {
  result: Result<BookingModel>;
  updateBookingStatus: (
    id: string,
    status: BookingStatus,
    reason?: string
  ) => Promise<Result<BookingModel>>;
}

export interface DeleteBookingResult {
  result: Result<boolean>;
  deleteBooking: (id: string) => Promise<Result<boolean>>;
}

export interface GetBookingByIdResult {
  getBookingById: (id: string) => Promise<BookingModel>;
}

export interface GetBookingLetterResult {
  getBookingLetter: (id: string) => Promise<Blob>;
}
