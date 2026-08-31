import * as ScheduleRepositoryImpl from '../../../../data/repositories/ScheduleRepositoryImpl';
import type { ScheduleInput } from '../../../../domain/models/ScheduleModel';

interface CreateScheduleViewModelProps {
  onSuccess: () => void;
  onFailure: () => void;
}

export const useCreateScheduleViewModel = (
  props: CreateScheduleViewModelProps
) => {
  const repository = ScheduleRepositoryImpl.useCreateSchedule();
  const createSchedule = async (input: ScheduleInput): Promise<boolean> => {
    const result = await repository.createSchedule(input);
    result.data ? props.onSuccess() : props.onFailure();
    return Boolean(result.data);
  };
  return { createSchedule, loading: repository.result.loading };
};
