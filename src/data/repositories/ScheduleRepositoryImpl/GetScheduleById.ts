import { mapToScheduleModel } from '../../mappers/ScheduleMapper';
import * as ScheduleDataSource from '../../sources/ScheduleDataSource';
import type { GetScheduleByIdResult } from '../../../domain/repositories/ScheduleRepositories';

export const useGetScheduleById = (): GetScheduleByIdResult => ({
  getScheduleById: async (id) =>
    mapToScheduleModel(await ScheduleDataSource.getScheduleById(id)),
});
