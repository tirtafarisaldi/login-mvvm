import http from 'service/http';
import type { IBooking } from '../../../domain/models/BookingModel';

export const getBookingById = async (id: string): Promise<IBooking> =>
  http.get(`/booking/${id}`) as Promise<IBooking>;
