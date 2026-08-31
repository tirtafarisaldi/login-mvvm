import * as ScheduleRepositoryImpl from '../../../../data/repositories/ScheduleRepositoryImpl';

export const useGetScheduleByIdViewModel = () =>
  ScheduleRepositoryImpl.useGetScheduleById();
