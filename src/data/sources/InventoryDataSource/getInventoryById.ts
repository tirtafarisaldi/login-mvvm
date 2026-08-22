import http from 'service/http';

export const getInventoryById = async (id: string) =>
  http.get(`/inventory/${id}`);
