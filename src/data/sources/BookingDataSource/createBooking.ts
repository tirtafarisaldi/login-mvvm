import http from 'service/http';
import type { IBooking } from '../../../domain/models/BookingModel';
import {
  toBookingFormData,
  multipartConfig,
  type BookingPayload,
} from './BookingFormData';

export const createBooking = async (
  input: BookingPayload
): Promise<IBooking> =>
  http.post(
    '/booking',
    toBookingFormData(input),
    multipartConfig
  ) as Promise<IBooking>;

export type { BookingPayload };
