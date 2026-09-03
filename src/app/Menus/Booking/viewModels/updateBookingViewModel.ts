import * as BookingRepositoryImpl from '../../../../data/repositories/BookingRepositoryImpl';
import type { BookingPayload } from '../../../../domain/repositories/BookingRepositories';

interface UpdateBookingViewModelProps {
  onSuccess: () => void;
  onFailure: () => void;
}

export const useUpdateBookingViewModel = (
  props: UpdateBookingViewModelProps
) => {
  const repository = BookingRepositoryImpl.useUpdateBooking();
  const updateBooking = async (id: string, input: BookingPayload) => {
    const result = await repository.updateBooking(id, input);
    result.data ? props.onSuccess() : props.onFailure();
  };
  return { updateBooking, loading: repository.result.loading };
};
