import * as InventoryRepositoryImpl from '../../../../data/repositories/InventoryRepositoryImpl';
import type { InventoryFilters } from '../../../../domain/models/InventoryModel';

export const useGetInventoriesViewModel = (filters: InventoryFilters) => {
  const { result } = InventoryRepositoryImpl.useGetInventories(filters);

  return {
    inventories: result.data ?? [],
    pagination: result.pagination ?? {
      total: 0,
      current: filters.page,
      total_data: 0,
    },
    loading: result.loading,
    error: result.error,
  };
};
