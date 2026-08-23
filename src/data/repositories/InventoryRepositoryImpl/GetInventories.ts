import { useQuery } from 'react-query';
import { mapToInventoryModel } from '../../mappers/InventoryMapper';
import * as InventoryDataSource from '../../sources/InventoryDataSource';
import type {
  InventoryFilters,
  InventoryModel,
} from '../../../domain/models/InventoryModel';
import type { GetInventoriesResult } from '../../../domain/repositories/InventoryRepositories';
import { Pagination } from '../../../domain/vo/Pagination';
import { PaginationResult } from '../../../domain/vo/PaginationResult';

export const useGetInventories = (
  filters: InventoryFilters
): GetInventoriesResult => {
  const result = new PaginationResult<InventoryModel>();
  const inventoriesQuery = useQuery(
    [
      'inventories',
      filters.name,
      filters.category,
      filters.location,
      filters.status,
      filters.page,
      filters.limit,
    ],
    () => InventoryDataSource.getInventories(filters)
  );

  if (inventoriesQuery.data) {
    result.setData(
      inventoriesQuery.data.inventories.map((inventory) =>
        mapToInventoryModel(inventory)
      )
    );
    result.setPagination(new Pagination(inventoriesQuery.data.page));
  }

  result.setLoading(inventoriesQuery.isLoading);
  if (inventoriesQuery.error) result.setError(inventoriesQuery.error);

  return { result };
};
