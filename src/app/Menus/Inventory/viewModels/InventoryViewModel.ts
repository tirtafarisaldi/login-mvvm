import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { inventoryRepository } from '../../../../data/repositories/InventoryRepositoryImpl';
import type {
  InventoryInput,
  InventoryModel,
} from '../../../../domain/models/InventoryModel';

const inventoryQueryKey = ['inventories'];

const dummyInventories: InventoryModel[] = [
  {
    id: 'INV-001',
    description: 'Kamera mirrorless untuk dokumentasi produksi.',
    name: 'Kamera Sony A7 III',
    category: 'Kamera',
    stock: 2,
    location: 'Lemari Kamera',
    status: 'Tersedia',
    information: 'Kamera mirrorless untuk dokumentasi produksi.',
    image:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'INV-002',
    description: 'Mixer audio 10 kanal dengan efek bawaan.',
    name: 'Mixer Yamaha MG10XU',
    category: 'Audio',
    stock: 1,
    location: 'Ruang Audio',
    status: 'Dipinjam',
    information: 'Mixer audio 10 kanal dengan efek bawaan.',
    image:
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'INV-003',
    name: 'LED Panel Light',
    description: 'Lampu LED panel dengan temperatur warna yang dapat diatur.',
    category: 'Pencahayaan',
    stock: 4,
    location: 'Gudang Peralatan',
    status: 'Tersedia',
    information: 'Lampu LED panel dengan temperatur warna yang dapat diatur.',
    image:
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80',
  },
];

export const useInventoryViewModel = () => {
  const queryClient = useQueryClient();
  const inventoriesQuery = useQuery(inventoryQueryKey, () =>
    inventoryRepository.getInventories()
  );
  const refresh = () => queryClient.invalidateQueries(inventoryQueryKey);
  const createMutation = useMutation(
    (input: InventoryInput) => inventoryRepository.createInventory(input),
    { onSuccess: refresh }
  );
  const updateMutation = useMutation(
    ({ id, input }: { id: string; input: InventoryInput }) =>
      inventoryRepository.updateInventory(id, input),
    { onSuccess: refresh }
  );
  const deleteMutation = useMutation(
    (id: string) => inventoryRepository.deleteInventory(id),
    { onSuccess: refresh }
  );
  const getInventoryById = useCallback(
    (id: string): Promise<InventoryModel> =>
      inventoryRepository.getInventoryById(id),
    []
  );
  const saveInventory = (input: InventoryInput, id?: string) =>
    id
      ? updateMutation.mutateAsync({ id, input })
      : createMutation.mutateAsync(input);

  return {
    inventories:
      inventoriesQuery.data && inventoriesQuery.data.length > 0
        ? inventoriesQuery.data
        : dummyInventories,
    isLoading: false,
    error: inventoriesQuery.error,
    getInventoryById,
    saveInventory,
    deleteInventory: deleteMutation.mutateAsync,
    isSaving: createMutation.isLoading || updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
  };
};
