import type { InventoryItem } from '../../../domain/models/InventoryModel';

export interface CmsFeature {
  id: string;
  label: string;
  description: string;
}

interface HomeViewModel {
  features: CmsFeature[];
  inventoryItems: InventoryItem[];
  availableInventoryCount: number;
}

const features: CmsFeature[] = [
  {
    id: 'inventory',
    label: 'Inventaris Barang',
    description: 'Kelola data dan stok peralatan studio.',
  },
  {
    id: 'borrowing',
    label: 'Peminjaman',
    description: 'Pantau permohonan dan pengembalian barang.',
  },
  {
    id: 'schedules',
    label: 'Jadwal Ruangan',
    description: 'Atur agenda penggunaan ruangan studio.',
  },
  {
    id: 'users',
    label: 'Manajemen Pengguna',
    description: 'Kelola akses pengguna laboratorium.',
  },
];

const inventoryItems: InventoryItem[] = [
  {
    id: 'INV-001',
    name: 'Kamera Sony A7 III',
    category: 'Kamera',
    stock: 2,
    location: 'Lemari A-01',
    status: 'Tersedia',
  },
  {
    id: 'INV-002',
    name: 'Mixer Audio Yamaha MG10XU',
    category: 'Audio',
    stock: 1,
    location: 'Rak B-02',
    status: 'Dipinjam',
  },
  {
    id: 'INV-003',
    name: 'Lampu Studio LED',
    category: 'Pencahayaan',
    stock: 4,
    location: 'Gudang C-01',
    status: 'Tersedia',
  },
  {
    id: 'INV-004',
    name: 'Tripod Manfrotto',
    category: 'Aksesori',
    stock: 1,
    location: 'Lemari A-03',
    status: 'Perlu Perawatan',
  },
];

export const useHomeViewModel = (): HomeViewModel => ({
  features,
  inventoryItems,
  availableInventoryCount: inventoryItems.filter(
    (item) => item.status === 'Tersedia'
  ).length,
});
