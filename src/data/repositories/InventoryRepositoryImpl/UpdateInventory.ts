import { useMutation, useQueryClient } from 'react-query';
import { mapToInventoryModel } from '../../mappers/InventoryMapper';
import * as InventoryDataSource from '../../sources/InventoryDataSource';
import type {
  InventoryInput,
  InventoryModel,
} from '../../../domain/models/InventoryModel';
import type { UpdateInventoryResult } from '../../../domain/repositories/InventoryRepositories';
import { Result } from '../../../domain/vo/Result';

export const useUpdateInventory = (): UpdateInventoryResult => {
  const result = new Result<InventoryModel>();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    ({ id, input }: { id: string; input: InventoryInput }) =>
      InventoryDataSource.updateInventory(id, input),
    { onSuccess: () => queryClient.invalidateQueries(['inventories']) }
  );
  const updateInventory = async (id: string, input: InventoryInput) => {
    try {
      result.setData(
        mapToInventoryModel(await mutation.mutateAsync({ id, input }))
      );
    } catch (error) {
      result.setError(error);
    }
    return result;
  };
  result.setLoading(mutation.isLoading);
  return { result, updateInventory };
};
