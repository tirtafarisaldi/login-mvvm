import { useQuery } from 'react-query';
import { mapToBookingModel } from '../../mappers/BookingMapper';
import * as BookingDataSource from '../../sources/BookingDataSource';
import type {
  BookingFilters,
  BookingModel,
} from '../../../domain/models/BookingModel';
import type { GetBookingsResult } from '../../../domain/repositories/BookingRepositories';
import { Pagination } from '../../../domain/vo/Pagination';
import { PaginationResult } from '../../../domain/vo/PaginationResult';

export const useGetBookings = (
  filters: BookingFilters
): GetBookingsResult => {
  const result = new PaginationResult<BookingModel>();
  const bookingsQuery = useQuery(
    [
      'bookings',
      filters.type,
      filters.status,
      filters.borrower,
      filters.title,
      filters.page,
      filters.limit,
    ],
    () => BookingDataSource.getBookings(filters)
  );

  if (bookingsQuery.data) {
    result.setData(
      bookingsQuery.data.bookings.map((booking) =>
        mapToBookingModel(booking)
      )
    );
    result.setPagination(new Pagination(bookingsQuery.data.page));
  }

  result.setLoading(bookingsQuery.isLoading);
  if (bookingsQuery.error) result.setError(bookingsQuery.error);

  return { result };
};
