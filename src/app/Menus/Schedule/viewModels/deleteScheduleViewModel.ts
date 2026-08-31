import * as ScheduleRepositoryImpl from '../../../../data/repositories/ScheduleRepositoryImpl';

interface DeleteScheduleViewModelProps {
  onSuccess: () => void;
  onFailure: () => void;
}

export const useDeleteScheduleViewModel = (
  props: DeleteScheduleViewModelProps
) => {
  const repository = ScheduleRepositoryImpl.useDeleteSchedule();
  const deleteSchedule = async (id: string) => {
    const result = await repository.deleteSchedule(id);
    result.data ? props.onSuccess() : props.onFailure();
  };
  return { deleteSchedule, loading: repository.result.loading };
};
