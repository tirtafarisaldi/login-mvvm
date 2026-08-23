import { useMutation, useQueryClient } from 'react-query';
import { mapToInventoryModel } from '../../mappers/InventoryMapper';
import * as InventoryDataSource from '../../sources/InventoryDataSource';
import type {
  InventoryInput,
  InventoryModel,
} from '../../../domain/models/InventoryModel';
import type { CreateInventoryResult } from '../../../domain/repositories/InventoryRepositories';
import { Result } from '../../../domain/vo/Result';

export const useCreateInventory = (): CreateInventoryResult => {
  const result = new Result<InventoryModel>();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (input: InventoryInput) => InventoryDataSource.createInventory(input),
    {
      onSuccess: () => queryClient.invalidateQueries(['inventories']),
    }
  );

  const createInventory = async (input: InventoryInput) => {
    try {
      result.setData(mapToInventoryModel(await mutation.mutateAsync(input)));
    } catch (error) {
      result.setError(error);
    }
    return result;
  };

  result.setLoading(mutation.isLoading);
  return { result, createInventory };
};
