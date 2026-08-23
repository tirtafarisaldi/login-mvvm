import http from 'service/http';
import type {
  IInventory,
  InventoryInput,
} from '../../../domain/models/InventoryModel';

export const updateInventory = async (
  id: string,
  input: InventoryInput
): Promise<IInventory> =>
  http.put(`/inventory/${id}`, input) as Promise<IInventory>;
