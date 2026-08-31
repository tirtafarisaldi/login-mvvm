import http from 'service/http';
import type {
  ISchedule,
  ScheduleInput,
} from '../../../domain/models/ScheduleModel';

export const createSchedule = async (
  input: ScheduleInput
): Promise<ISchedule> => http.post('/schedule', input) as Promise<ISchedule>;
