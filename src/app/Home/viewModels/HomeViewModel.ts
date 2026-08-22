export interface CmsFeature {
  id: string;
  label: string;
  description: string;
  href?: string;
}

interface HomeViewModel {
  features: CmsFeature[];
}

const features: CmsFeature[] = [
  {
    id: 'inventory',
    label: 'Inventaris Barang',
    description: 'Kelola data dan stok peralatan studio.',
    href: '/inventory',
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

export const useHomeViewModel = (): HomeViewModel => ({
  features,
});
