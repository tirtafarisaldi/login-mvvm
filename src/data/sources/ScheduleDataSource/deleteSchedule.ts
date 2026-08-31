import http from 'service/http';

export const deleteSchedule = async (id: string): Promise<void> =>
  http.delete(`/schedule/${id}`) as Promise<void>;
