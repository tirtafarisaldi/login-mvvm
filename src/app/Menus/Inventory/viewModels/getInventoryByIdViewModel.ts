import * as InventoryRepositoryImpl from '../../../../data/repositories/InventoryRepositoryImpl';

export const useGetInventoryByIdViewModel = () =>
  InventoryRepositoryImpl.useGetInventoryById();
