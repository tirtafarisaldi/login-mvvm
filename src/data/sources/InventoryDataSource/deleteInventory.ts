import http from 'service/http';

export const deleteInventory = async (id: string) =>
  http.delete(`/inventory/${id}`);
