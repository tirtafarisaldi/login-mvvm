import { buildSampleEvents, toDateKey } from 'components/Calendar';
import { useGetInventoriesViewModel } from '../../Menus/Inventory/viewModels/getInventoriesViewModel';

export interface CmsFeature {
  id: string;
  label: string;
  description: string;
  href?: string;
}

export type HomeStatId = 'equipment' | 'loans' | 'schedules';

export interface HomeStat {
  id: HomeStatId;
  label: string;
  value: number;
  hint: string;
}

interface HomeViewModel {
  features: CmsFeature[];
  stats: HomeStat[];
  statsLoading: boolean;
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
    label: 'Schedule',
    description: 'Atur agenda penggunaan ruangan studio.',
    href: '/schedule',
  },
  {
    id: 'users',
    label: 'Manajemen Pengguna',
    description: 'Kelola akses pengguna laboratorium.',
  },
];

export const useHomeViewModel = (): HomeViewModel => {
  const { inventories, loading } = useGetInventoriesViewModel({
    page: 1,
    limit: 100,
  });

  const now = new Date();
  const todayKey = toDateKey(now);
  const eventsByDate = buildSampleEvents(now.getFullYear(), now.getMonth());
  const upcomingSchedules = Object.values(eventsByDate)
    .flat()
    .filter((event) => event.dateKey >= todayKey).length;

  const totalEquipment = inventories.reduce(
    (sum, inventory) => sum + inventory.stock,
    0
  );
  const activeLoans = inventories.filter(
    (inventory) => inventory.status === 'Dipinjam'
  ).length;

  const stats: HomeStat[] = [
    {
      id: 'equipment',
      label: 'Jumlah Peralatan',
      value: totalEquipment,
      hint: 'unit peralatan terdaftar',
    },
    {
      id: 'loans',
      label: 'Peminjaman Aktif',
      value: activeLoans,
      hint: 'barang sedang dipinjam',
    },
    {
      id: 'schedules',
      label: 'Jadwal Ruangan',
      value: upcomingSchedules,
      hint: 'agenda tersisa bulan ini',
    },
  ];

  return {
    features,
    stats,
    statsLoading: loading,
  };
};
