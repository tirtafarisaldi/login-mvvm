import type { InventoryInput, InventoryModel } from '../models/InventoryModel';

export interface InventoryRepository {
  getInventories: () => Promise<InventoryModel[]>;
  getInventoryById: (id: string) => Promise<InventoryModel>;
  createInventory: (input: InventoryInput) => Promise<InventoryModel>;
  updateInventory: (
    id: string,
    input: InventoryInput
  ) => Promise<InventoryModel>;
  deleteInventory: (id: string) => Promise<void>;
}
