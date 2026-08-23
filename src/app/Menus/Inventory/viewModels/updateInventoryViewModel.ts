import * as InventoryRepositoryImpl from '../../../../data/repositories/InventoryRepositoryImpl';
import type { InventoryInput } from '../../../../domain/models/InventoryModel';

interface UpdateInventoryViewModelProps {
  onSuccess: () => void;
  onFailure: () => void;
}

export const useUpdateInventoryViewModel = (
  props: UpdateInventoryViewModelProps
) => {
  const repository = InventoryRepositoryImpl.useUpdateInventory();
  const updateInventory = async (id: string, input: InventoryInput) => {
    const result = await repository.updateInventory(id, input);
    result.data ? props.onSuccess() : props.onFailure();
  };
  return { updateInventory, loading: repository.result.loading };
};
