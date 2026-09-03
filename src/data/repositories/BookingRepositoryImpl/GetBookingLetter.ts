import * as BookingDataSource from '../../sources/BookingDataSource';
import type { GetBookingLetterResult } from '../../../domain/repositories/BookingRepositories';

export const useGetBookingLetter = (): GetBookingLetterResult => ({
  getBookingLetter: (id) => BookingDataSource.getBookingLetter(id),
});
