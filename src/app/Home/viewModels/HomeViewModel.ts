import { toDateKey } from 'components/Calendar';
import { useGetInventoriesViewModel } from '../../Menus/Inventory/viewModels/getInventoriesViewModel';
import { useGetBookingsViewModel } from '../../Menus/Booking/viewModels/getBookingsViewModel';
import { useGetSchedulesViewModel } from '../../Menus/Schedule/viewModels/getSchedulesViewModel';

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
    label: 'Inventaris Peralatan',
    description: 'Kelola data dan stok peralatan studio.',
    href: '/inventory',
  },
  {
    id: 'booking',
    label: 'Peminjaman',
    description: 'Pantau permohonan dan pengembalian barang.',
    href: '/booking',
  },
  {
    id: 'schedules',
    label: 'Jadwal Studio',
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
  const {
    inventories,
    pagination: inventoryPagination,
    loading,
  } = useGetInventoriesViewModel({
    page: 1,
    limit: 100,
  });
  const { bookings, loading: bookingsLoading } = useGetBookingsViewModel({
    page: 1,
    limit: 100,
  });
  const now = new Date();
  const todayKey = toDateKey(now);
  const { schedules, loading: schedulesLoading } = useGetSchedulesViewModel({
    page: 1,
    limit: 100,
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });

  const totalEquipment = inventoryPagination.total_data ?? inventories.length;
  const activeBookings = bookings.filter(
    (booking) => booking.status === 'approved'
  ).length;
  const monthSchedules = schedules.filter(
    (schedule) => schedule.date >= todayKey
  ).length;

  const stats: HomeStat[] = [
    {
      id: 'equipment',
      label: 'Jumlah Peralatan',
      value: totalEquipment,
      hint: 'item inventaris terdaftar',
    },
    {
      id: 'loans',
      label: 'Peminjaman',
      value: activeBookings,
      hint: 'peminjaman sedang berjalan',
    },
    {
      id: 'schedules',
      label: 'Jadwal Ruangan',
      value: monthSchedules,
      hint: 'agenda tersisa bulan ini',
    },
  ];

  return {
    features,
    stats,
    statsLoading: loading || bookingsLoading || schedulesLoading,
  };
};
