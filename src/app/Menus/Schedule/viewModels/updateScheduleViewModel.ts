import * as ScheduleRepositoryImpl from '../../../../data/repositories/ScheduleRepositoryImpl';
import type { ScheduleInput } from '../../../../domain/models/ScheduleModel';

interface UpdateScheduleViewModelProps {
  onSuccess: () => void;
  onFailure: () => void;
}

export const useUpdateScheduleViewModel = (
  props: UpdateScheduleViewModelProps
) => {
  const repository = ScheduleRepositoryImpl.useUpdateSchedule();
  const updateSchedule = async (id: string, input: ScheduleInput) => {
    const result = await repository.updateSchedule(id, input);
    result.data ? props.onSuccess() : props.onFailure();
  };
  return { updateSchedule, loading: repository.result.loading };
};
