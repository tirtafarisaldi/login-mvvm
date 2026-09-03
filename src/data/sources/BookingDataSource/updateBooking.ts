import http from 'service/http';
import type { IBooking } from '../../../domain/models/BookingModel';
import {
  toBookingFormData,
  multipartConfig,
  type BookingPayload,
} from './BookingFormData';

export const updateBooking = async (
  id: string,
  input: BookingPayload
): Promise<IBooking> =>
  http.put(
    `/booking/${id}`,
    toBookingFormData(input),
    multipartConfig
  ) as Promise<IBooking>;

export type { BookingPayload };
