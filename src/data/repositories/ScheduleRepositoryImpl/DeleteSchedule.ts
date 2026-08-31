import { useMutation, useQueryClient } from 'react-query';
import * as ScheduleDataSource from '../../sources/ScheduleDataSource';
import type { DeleteScheduleResult } from '../../../domain/repositories/ScheduleRepositories';
import { Result } from '../../../domain/vo/Result';

export const useDeleteSchedule = (): DeleteScheduleResult => {
  const result = new Result<boolean>();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (id: string) => ScheduleDataSource.deleteSchedule(id),
    {
      onSuccess: () => queryClient.invalidateQueries(['schedules']),
    }
  );
  const deleteSchedule = async (id: string) => {
    try {
      await mutation.mutateAsync(id);
      result.setData(true);
    } catch (error) {
      result.setError(error);
    }
    return result;
  };
  result.setLoading(mutation.isLoading);
  return { result, deleteSchedule };
};
