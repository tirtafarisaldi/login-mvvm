import * as BookingRepositoryImpl from '../../../../data/repositories/BookingRepositoryImpl';
import type { BookingPayload } from '../../../../domain/repositories/BookingRepositories';
import type { Result } from '../../../../domain/vo/Result';
import type { BookingModel } from '../../../../domain/models/BookingModel';

interface UpdateBookingViewModelProps {
  onSuccess: () => void;
  onFailure: () => void;
}

export const useUpdateBookingViewModel = (
  props: UpdateBookingViewModelProps
) => {
  const repository = BookingRepositoryImpl.useUpdateBooking();
  const updateBooking = async (
    id: string,
    input: BookingPayload
  ): Promise<Result<BookingModel>> => {
    const result = await repository.updateBooking(id, input);
    result.data ? props.onSuccess() : props.onFailure();
    return result;
  };
  return { updateBooking, loading: repository.result.loading };
};
