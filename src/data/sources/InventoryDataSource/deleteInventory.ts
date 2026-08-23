import http from 'service/http';

export const deleteInventory = async (id: string): Promise<void> =>
  http.delete(`/inventory/${id}`) as Promise<void>;
