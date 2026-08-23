import * as InventoryRepositoryImpl from '../../../../data/repositories/InventoryRepositoryImpl';
import type { InventoryInput } from '../../../../domain/models/InventoryModel';

interface CreateInventoryViewModelProps {
  onSuccess: () => void;
  onFailure: () => void;
}

export const useCreateInventoryViewModel = (
  props: CreateInventoryViewModelProps
) => {
  const repository = InventoryRepositoryImpl.useCreateInventory();
  const createInventory = async (input: InventoryInput) => {
    const result = await repository.createInventory(input);
    result.data ? props.onSuccess() : props.onFailure();
  };
  return { createInventory, loading: repository.result.loading };
};
