import { useMutation, useQueryClient } from 'react-query';
import * as BookingDataSource from '../../sources/BookingDataSource';
import type { DeleteBookingResult } from '../../../domain/repositories/BookingRepositories';
import { Result } from '../../../domain/vo/Result';

export const useDeleteBooking = (): DeleteBookingResult => {
  const result = new Result<boolean>();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (id: string) => BookingDataSource.deleteBooking(id),
    {
      onSuccess: () => queryClient.invalidateQueries(['bookings']),
    }
  );

  const deleteBooking = async (id: string) => {
    try {
      await mutation.mutateAsync(id);
      result.setData(true);
    } catch (error) {
      result.setError(error);
    }
    return result;
  };

  result.setLoading(mutation.isLoading);
  return { result, deleteBooking };
};
