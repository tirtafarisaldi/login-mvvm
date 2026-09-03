import * as BookingRepositoryImpl from '../../../../data/repositories/BookingRepositoryImpl';
import type { BookingPayload } from '../../../../domain/repositories/BookingRepositories';

interface CreateBookingViewModelProps {
  onSuccess: () => void;
  onFailure: (errorMessage?: string) => void;
}

export const useCreateBookingViewModel = (
  props: CreateBookingViewModelProps
) => {
  const repository = BookingRepositoryImpl.useCreateBooking();
  const createBooking = async (input: BookingPayload): Promise<boolean> => {
    const result = await repository.createBooking(input);
    result.data ? props.onSuccess() : props.onFailure();
    return Boolean(result.data);
  };
  return { createBooking, loading: repository.result.loading };
};
