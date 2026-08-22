import {
  type IInventory,
  InventoryModel,
  type InventoryStatus,
} from '../../domain/models/InventoryModel';

type InventoryPayload = Record<string, unknown>;

const getStatus = (value: unknown): InventoryStatus => {
  if (value === 'Dipinjam' || value === 'Perlu Perawatan') return value;
  return 'Tersedia';
};

export const mapToInventoryModel = (
  payload: InventoryPayload
): InventoryModel => {
  const inventory: IInventory = {
    id: String(payload.id ?? payload.uuid ?? payload.inventory_id ?? ''),
    name: String(payload.name ?? payload.item_name ?? ''),
    description: String(payload.description ?? payload.item_description ?? ''),
    category: String(payload.category ?? ''),
    stock: Number(payload.stock ?? payload.quantity ?? 0),
    location: String(payload.location ?? ''),
    status: getStatus(payload.status),
    information:
      typeof payload.information === 'string' ? payload.information : undefined,
    image: String(payload.image ?? payload.image_url ?? ''),
  };

  return new InventoryModel(inventory);
};
