import http from 'service/http';

export const deleteBooking = async (id: string): Promise<void> =>
  http.delete(`/booking/${id}`) as Promise<void>;
