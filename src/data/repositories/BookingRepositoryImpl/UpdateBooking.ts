import { useMutation, useQueryClient } from 'react-query';
import { mapToBookingModel } from '../../mappers/BookingMapper';
import * as BookingDataSource from '../../sources/BookingDataSource';
import type { BookingModel } from '../../../domain/models/BookingModel';
import type {
  BookingPayload,
  UpdateBookingResult,
} from '../../../domain/repositories/BookingRepositories';
import { Result } from '../../../domain/vo/Result';

export const useUpdateBooking = (): UpdateBookingResult => {
  const result = new Result<BookingModel>();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    ({ id, input }: { id: string; input: BookingPayload }) =>
      BookingDataSource.updateBooking(id, input),
    {
      onSuccess: () => queryClient.invalidateQueries(['bookings']),
    }
  );

  const updateBooking = async (id: string, input: BookingPayload) => {
    try {
      result.setData(
        mapToBookingModel(await mutation.mutateAsync({ id, input }))
      );
    } catch (error) {
      result.setError(error);
    }
    return result;
  };

  result.setLoading(mutation.isLoading);
  return { result, updateBooking };
};
