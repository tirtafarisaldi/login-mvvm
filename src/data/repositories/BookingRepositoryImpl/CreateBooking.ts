import { useMutation, useQueryClient } from 'react-query';
import { mapToBookingModel } from '../../mappers/BookingMapper';
import * as BookingDataSource from '../../sources/BookingDataSource';
import type { BookingModel } from '../../../domain/models/BookingModel';
import type {
  BookingPayload,
  CreateBookingResult,
} from '../../../domain/repositories/BookingRepositories';
import { Result } from '../../../domain/vo/Result';

export const useCreateBooking = (): CreateBookingResult => {
  const result = new Result<BookingModel>();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (input: BookingPayload) => BookingDataSource.createBooking(input),
    {
      onSuccess: () => queryClient.invalidateQueries(['bookings']),
    }
  );

  const createBooking = async (input: BookingPayload) => {
    try {
      result.setData(mapToBookingModel(await mutation.mutateAsync(input)));
    } catch (error) {
      result.setError(error);
    }
    return result;
  };

  result.setLoading(mutation.isLoading);
  return { result, createBooking };
};
