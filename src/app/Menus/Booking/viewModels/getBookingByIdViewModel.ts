import * as BookingRepositoryImpl from '../../../../data/repositories/BookingRepositoryImpl';

export const useGetBookingByIdViewModel = () =>
  BookingRepositoryImpl.useGetBookingById();
