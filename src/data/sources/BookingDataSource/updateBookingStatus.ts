import http from 'service/http';
import type {
  BookingStatus,
  IBooking,
} from '../../../domain/models/BookingModel';

export const updateBookingStatus = async (
  id: string,
  status: BookingStatus,
  reason?: string
): Promise<IBooking> =>
  http.patch(`/booking/${id}/status`, {
    status,
    reason_rejected: reason,
  }) as Promise<IBooking>;
