import http from 'service/http';
import type {
  ISchedulePaginationResponse,
  ScheduleFilters,
} from '../../../domain/models/ScheduleModel';

export const getSchedules = async (
  filters: ScheduleFilters
): Promise<ISchedulePaginationResponse> => {
  const response = (await http.get('/schedules', {
    params: filters,
  })) as unknown;

  if (typeof response !== 'object' || response === null) {
    throw new Error('Respons daftar jadwal tidak valid.');
  }

  const payload = response as Record<string, unknown>;
  const nestedPayload =
    typeof payload.data === 'object' &&
    payload.data !== null &&
    !Array.isArray(payload.data)
      ? (payload.data as Record<string, unknown>)
      : payload;
  const schedules = Array.isArray(payload.schedules)
    ? payload.schedules
    : Array.isArray(payload.data)
      ? payload.data
      : Array.isArray(nestedPayload.schedules)
        ? nestedPayload.schedules
        : [];
  const page = nestedPayload.page ?? payload.page;

  return { schedules, page } as ISchedulePaginationResponse;
};
