import http from 'service/http';
import type { IInventory } from '../../../domain/models/InventoryModel';

export const getInventoryById = async (id: string): Promise<IInventory> =>
  http.get(`/inventory/${id}`) as Promise<IInventory>;
