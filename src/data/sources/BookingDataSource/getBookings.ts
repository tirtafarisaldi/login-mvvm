import http from 'service/http';
import type {
  BookingFilters,
  IBookingPaginationResponse,
} from '../../../domain/models/BookingModel';

export const getBookings = async (
  filters: BookingFilters
): Promise<IBookingPaginationResponse> => {
  const response = (await http.get('/bookings', {
    params: filters,
  })) as unknown;

  if (typeof response !== 'object' || response === null) {
    throw new Error('Respons daftar booking tidak valid.');
  }

  const payload = response as Record<string, unknown>;
  const nestedPayload =
    typeof payload.data === 'object' &&
    payload.data !== null &&
    !Array.isArray(payload.data)
      ? (payload.data as Record<string, unknown>)
      : payload;
  const bookings = Array.isArray(payload.bookings)
    ? payload.bookings
    : Array.isArray(payload.data)
      ? payload.data
      : Array.isArray(nestedPayload.bookings)
        ? nestedPayload.bookings
        : [];
  const page = nestedPayload.page ?? payload.page;

  return { bookings, page } as IBookingPaginationResponse;
};
