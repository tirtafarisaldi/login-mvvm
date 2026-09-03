import * as BookingRepositoryImpl from '../../../../data/repositories/BookingRepositoryImpl';

interface DeleteBookingViewModelProps {
  onSuccess: () => void;
  onFailure: () => void;
}

export const useDeleteBookingViewModel = (
  props: DeleteBookingViewModelProps
) => {
  const repository = BookingRepositoryImpl.useDeleteBooking();
  const deleteBooking = async (id: string) => {
    const result = await repository.deleteBooking(id);
    result.data ? props.onSuccess() : props.onFailure();
  };
  return { deleteBooking, loading: repository.result.loading };
};
