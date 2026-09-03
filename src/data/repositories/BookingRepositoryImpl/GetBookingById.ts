import { mapToBookingModel } from '../../mappers/BookingMapper';
import * as BookingDataSource from '../../sources/BookingDataSource';
import type { GetBookingByIdResult } from '../../../domain/repositories/BookingRepositories';

export const useGetBookingById = (): GetBookingByIdResult => ({
  getBookingById: async (id) =>
    mapToBookingModel(await BookingDataSource.getBookingById(id)),
});
