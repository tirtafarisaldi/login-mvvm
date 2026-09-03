import { useMutation, useQueryClient } from 'react-query';
import { mapToBookingModel } from '../../mappers/BookingMapper';
import * as BookingDataSource from '../../sources/BookingDataSource';
import type {
  BookingModel,
  BookingStatus,
} from '../../../domain/models/BookingModel';
import type { UpdateBookingStatusResult } from '../../../domain/repositories/BookingRepositories';
import { Result } from '../../../domain/vo/Result';

export const useUpdateBookingStatus = (): UpdateBookingStatusResult => {
  const result = new Result<BookingModel>();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    ({
      id,
      status,
      reason,
    }: {
      id: string;
      status: BookingStatus;
      reason?: string;
    }) => BookingDataSource.updateBookingStatus(id, status, reason),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bookings']);
        queryClient.invalidateQueries(['schedules']);
      },
    }
  );

  const updateBookingStatus = async (
    id: string,
    status: BookingStatus,
    reason?: string
  ) => {
    try {
      result.setData(
        mapToBookingModel(await mutation.mutateAsync({ id, status, reason }))
      );
    } catch (error) {
      result.setError(error);
    }
    return result;
  };

  result.setLoading(mutation.isLoading);
  return { result, updateBookingStatus };
};
