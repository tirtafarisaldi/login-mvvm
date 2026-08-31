import http from 'service/http';
import type { ISchedule } from '../../../domain/models/ScheduleModel';

export const getScheduleById = async (id: string): Promise<ISchedule> =>
  http.get(`/schedule/${id}`) as Promise<ISchedule>;
