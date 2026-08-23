import http from 'service/http';
import type {
  IInventory,
  InventoryInput,
} from '../../../domain/models/InventoryModel';

export const createInventory = async (
  input: InventoryInput
): Promise<IInventory> => http.post('/inventory', input) as Promise<IInventory>;
