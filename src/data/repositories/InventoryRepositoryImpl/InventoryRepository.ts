import { mapToInventoryModel } from '../../mappers/InventoryMapper';
import * as InventoryDataSource from '../../sources/InventoryDataSource';
import type { InventoryModel } from '../../../domain/models/InventoryModel';
import type { InventoryRepository } from '../../../domain/repositories/InventoryRepositories';

type Payload = Record<string, unknown>;

const isPayload = (value: unknown): value is Payload =>
  typeof value === 'object' && value !== null;

const unwrap = (response: unknown): unknown =>
  isPayload(response) && 'data' in response ? response.data : response;

const toInventory = (response: unknown): InventoryModel => {
  const payload = unwrap(response);
  if (!isPayload(payload)) throw new Error('Data inventaris tidak valid.');
  return mapToInventoryModel(payload);
};

const toInventories = (response: unknown): InventoryModel[] => {
  const payload = unwrap(response);
  const list = Array.isArray(payload)
    ? payload
    : isPayload(payload) && Array.isArray(payload.inventories)
      ? payload.inventories
      : [];

  return list.filter(isPayload).map(mapToInventoryModel);
};

export const inventoryRepository: InventoryRepository = {
  getInventories: async () =>
    toInventories(await InventoryDataSource.getInventories()),
  getInventoryById: async (id) =>
    toInventory(await InventoryDataSource.getInventoryById(id)),
  createInventory: async (input) =>
    toInventory(await InventoryDataSource.createInventory(input)),
  updateInventory: async (id, input) =>
    toInventory(await InventoryDataSource.updateInventory(id, input)),
  deleteInventory: async (id) => {
    await InventoryDataSource.deleteInventory(id);
  },
};
