import type {
  InventoryFilters,
  InventoryInput,
  InventoryModel,
} from '../models/InventoryModel';
import type { IPaginationResponse } from '../vo/Pagination';
import type { PaginationResult } from '../vo/PaginationResult';
import type { Result } from '../vo/Result';

export interface InventoryListResult extends IPaginationResponse {
  inventories: InventoryModel[];
}

export interface InventoryRepository {
  getInventories: (filters: InventoryFilters) => Promise<InventoryListResult>;
  getInventoryById: (id: string) => Promise<InventoryModel>;
  createInventory: (input: InventoryInput) => Promise<InventoryModel>;
  updateInventory: (
    id: string,
    input: InventoryInput
  ) => Promise<InventoryModel>;
  deleteInventory: (id: string) => Promise<void>;
}

export interface GetInventoriesResult {
  result: PaginationResult<InventoryModel>;
}

export interface CreateInventoryResult {
  result: Result<InventoryModel>;
  createInventory: (input: InventoryInput) => Promise<Result<InventoryModel>>;
}

export interface UpdateInventoryResult {
  result: Result<InventoryModel>;
  updateInventory: (
    id: string,
    input: InventoryInput
  ) => Promise<Result<InventoryModel>>;
}

export interface DeleteInventoryResult {
  result: Result<boolean>;
  deleteInventory: (id: string) => Promise<Result<boolean>>;
}

export interface GetInventoryByIdResult {
  getInventoryById: (id: string) => Promise<InventoryModel>;
}
