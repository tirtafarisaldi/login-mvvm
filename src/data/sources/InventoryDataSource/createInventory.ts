import http from 'service/http';
import type { InventoryInput } from '../../../domain/models/InventoryModel';

export const createInventory = async (input: InventoryInput) =>
  http.post('/inventory', input);
