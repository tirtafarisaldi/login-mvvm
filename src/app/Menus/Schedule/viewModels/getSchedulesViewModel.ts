import * as ScheduleRepositoryImpl from '../../../../data/repositories/ScheduleRepositoryImpl';
import type { ScheduleFilters } from '../../../../domain/models/ScheduleModel';

export const useGetSchedulesViewModel = (filters: ScheduleFilters) => {
  const { result } = ScheduleRepositoryImpl.useGetSchedules(filters);

  return {
    schedules: result.data ?? [],
    pagination: result.pagination ?? {
      total: 0,
      current: filters.page,
      total_data: 0,
    },
    loading: result.loading,
    error: result.error,
  };
};
