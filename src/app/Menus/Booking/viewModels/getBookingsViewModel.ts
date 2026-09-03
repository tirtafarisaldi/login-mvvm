import * as BookingRepositoryImpl from '../../../../data/repositories/BookingRepositoryImpl';
import type { BookingFilters } from '../../../../domain/models/BookingModel';

export const useGetBookingsViewModel = (filters: BookingFilters) => {
  const { result } = BookingRepositoryImpl.useGetBookings(filters);

  return {
    bookings: result.data ?? [],
    pagination: result.pagination ?? {
      total: 0,
      current: filters.page,
      total_data: 0,
    },
    loading: result.loading,
    error: result.error,
  };
};
