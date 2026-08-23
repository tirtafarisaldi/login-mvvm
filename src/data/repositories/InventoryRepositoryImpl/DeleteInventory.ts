import { useMutation, useQueryClient } from 'react-query';
import * as InventoryDataSource from '../../sources/InventoryDataSource';
import type { DeleteInventoryResult } from '../../../domain/repositories/InventoryRepositories';
import { Result } from '../../../domain/vo/Result';

export const useDeleteInventory = (): DeleteInventoryResult => {
  const result = new Result<boolean>();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (id: string) => InventoryDataSource.deleteInventory(id),
    {
      onSuccess: () => queryClient.invalidateQueries(['inventories']),
    }
  );
  const deleteInventory = async (id: string) => {
    try {
      await mutation.mutateAsync(id);
      result.setData(true);
    } catch (error) {
      result.setError(error);
    }
    return result;
  };
  result.setLoading(mutation.isLoading);
  return { result, deleteInventory };
};
