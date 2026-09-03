import http from 'service/http';

export const getBookingLetter = async (id: string): Promise<Blob> =>
  http.get(`/booking/${id}/letter`, {
    responseType: 'blob',
  }) as Promise<Blob>;
