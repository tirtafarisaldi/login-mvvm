import http from 'service/http';
import type { InventoryInput } from '../../../domain/models/InventoryModel';

export const updateInventory = async (id: string, input: InventoryInput) =>
  http.put(`/inventory/${id}`, input);
