export type InventoryStatus = 'Tersedia' | 'Dipinjam' | 'Perlu Perawatan';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  location: string;
  status: InventoryStatus;
}
