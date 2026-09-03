import * as BookingRepositoryImpl from '../../../../data/repositories/BookingRepositoryImpl';
import type { BookingStatus } from '../../../../domain/models/BookingModel';

interface UpdateBookingStatusViewModelProps {
  onSuccess: () => void;
  onFailure: (errorMessage?: string) => void;
}

export const useUpdateBookingStatusViewModel = (
  props: UpdateBookingStatusViewModelProps
) => {
  const repository = BookingRepositoryImpl.useUpdateBookingStatus();
  const updateBookingStatus = async (
    id: string,
    status: BookingStatus,
    reason?: string
  ) => {
    const result = await repository.updateBookingStatus(id, status, reason);
    result.data ? props.onSuccess() : props.onFailure();
  };
  return { updateBookingStatus, loading: repository.result.loading };
};
