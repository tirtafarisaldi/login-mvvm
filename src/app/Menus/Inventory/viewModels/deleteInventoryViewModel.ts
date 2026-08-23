import * as InventoryRepositoryImpl from '../../../../data/repositories/InventoryRepositoryImpl';

interface DeleteInventoryViewModelProps {
  onSuccess: () => void;
  onFailure: () => void;
}

export const useDeleteInventoryViewModel = (
  props: DeleteInventoryViewModelProps
) => {
  const repository = InventoryRepositoryImpl.useDeleteInventory();
  const deleteInventory = async (id: string) => {
    const result = await repository.deleteInventory(id);
    result.data ? props.onSuccess() : props.onFailure();
  };
  return { deleteInventory, loading: repository.result.loading };
};
