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
  payload: InventoryPayload | IInventory
): InventoryModel => {
  const raw = payload as InventoryPayload;
  const inventory: IInventory = {
    id: String(raw.id ?? raw.uuid ?? raw.inventory_id ?? ''),
    name: String(raw.name ?? raw.item_name ?? ''),
    description: String(raw.description ?? raw.item_description ?? ''),
    category: String(raw.category ?? ''),
    stock: Number(raw.stock ?? raw.quantity ?? 0),
    location: String(raw.location ?? ''),
    status: getStatus(raw.status),
    information:
      typeof raw.information === 'string' ? raw.information : undefined,
    image: String(raw.image ?? raw.image_url ?? ''),
  };

  return new InventoryModel(inventory);
};
