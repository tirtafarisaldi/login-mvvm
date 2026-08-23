import { mapToInventoryModel } from '../../mappers/InventoryMapper';
import * as InventoryDataSource from '../../sources/InventoryDataSource';
import type { GetInventoryByIdResult } from '../../../domain/repositories/InventoryRepositories';

export const useGetInventoryById = (): GetInventoryByIdResult => ({
  getInventoryById: async (id) =>
    mapToInventoryModel(await InventoryDataSource.getInventoryById(id)),
});
