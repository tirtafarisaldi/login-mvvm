import { useMutation, useQueryClient } from 'react-query';
import { mapToScheduleModel } from '../../mappers/ScheduleMapper';
import * as ScheduleDataSource from '../../sources/ScheduleDataSource';
import type {
  ScheduleInput,
  ScheduleModel,
} from '../../../domain/models/ScheduleModel';
import type { UpdateScheduleResult } from '../../../domain/repositories/ScheduleRepositories';
import { Result } from '../../../domain/vo/Result';

export const useUpdateSchedule = (): UpdateScheduleResult => {
  const result = new Result<ScheduleModel>();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    ({ id, input }: { id: string; input: ScheduleInput }) =>
      ScheduleDataSource.updateSchedule(id, input),
    { onSuccess: () => queryClient.invalidateQueries(['schedules']) }
  );
  const updateSchedule = async (id: string, input: ScheduleInput) => {
    try {
      result.setData(
        mapToScheduleModel(await mutation.mutateAsync({ id, input }))
      );
    } catch (error) {
      result.setError(error);
    }
    return result;
  };
  result.setLoading(mutation.isLoading);
  return { result, updateSchedule };
};
