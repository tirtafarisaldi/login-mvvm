import { useQuery } from 'react-query';
import { mapToScheduleModel } from '../../mappers/ScheduleMapper';
import * as ScheduleDataSource from '../../sources/ScheduleDataSource';
import type {
  ScheduleFilters,
  ScheduleModel,
} from '../../../domain/models/ScheduleModel';
import type { GetSchedulesResult } from '../../../domain/repositories/ScheduleRepositories';
import { Pagination } from '../../../domain/vo/Pagination';
import { PaginationResult } from '../../../domain/vo/PaginationResult';

export const useGetSchedules = (
  filters: ScheduleFilters
): GetSchedulesResult => {
  const result = new PaginationResult<ScheduleModel>();
  const schedulesQuery = useQuery(
    ['schedules', filters.month, filters.year, filters.page, filters.limit],
    () => ScheduleDataSource.getSchedules(filters)
  );

  if (schedulesQuery.data) {
    result.setData(
      schedulesQuery.data.schedules.map((schedule) =>
        mapToScheduleModel(schedule)
      )
    );
    result.setPagination(new Pagination(schedulesQuery.data.page));
  }

  result.setLoading(schedulesQuery.isLoading);
  if (schedulesQuery.error) result.setError(schedulesQuery.error);

  return { result };
};
