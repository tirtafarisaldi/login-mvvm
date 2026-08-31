import http from 'service/http';
import type {
  ISchedule,
  ScheduleInput,
} from '../../../domain/models/ScheduleModel';

export const updateSchedule = async (
  id: string,
  input: ScheduleInput
): Promise<ISchedule> =>
  http.put(`/schedule/${id}`, input) as Promise<ISchedule>;
