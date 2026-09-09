import { toDateKey } from 'components/Calendar';
import { useGetInventoriesViewModel } from '../../Menus/Inventory/viewModels/getInventoriesViewModel';
import { useGetBookingsViewModel } from '../../Menus/Booking/viewModels/getBookingsViewModel';
import { useGetSchedulesViewModel } from '../../Menus/Schedule/viewModels/getSchedulesViewModel';
import type { BookingStatus } from '../../../domain/models/BookingModel';
import { useAuth } from 'service/auth';

export interface CmsFeature {
  id: string;
  label: string;
  description: string;
  href?: string;
}

export type HomeStatId = 'equipment' | 'loans' | 'schedules' | 'requests';

export interface HomeStat {
  id: HomeStatId;
  label: string;
  value: number;
  hint: string;
}

export interface BookingStatItem {
  status: BookingStatus;
  label: string;
  count: number;
  color: string;
}

export interface DashboardNotification {
  id: string;
  title: string;
  description: string;
  meta: string;
  tone: 'info' | 'success' | 'warning' | 'danger';
}

export interface DashboardListItem {
  id: string;
  label: string;
  value: string;
  meta: string;
  tone?: 'info' | 'success' | 'warning' | 'danger';
}

export const BOOKING_STATUS_META: Record<
  BookingStatus,
  { label: string; color: string }
> = {
  pending: { label: 'Pending', color: '#f59e0b' },
  reviewing: { label: 'Reviewing', color: '#3b82f6' },
  approved: { label: 'Approved', color: '#22c55e' },
  rejected: { label: 'Rejected', color: '#ef4444' },
  completed: { label: 'Completed', color: '#14b8a6' },
};

interface HomeViewModel {
  features: CmsFeature[];
  stats: HomeStat[];
  notifications: DashboardNotification[];
  roomSchedule: DashboardListItem[];
  inventoryAlerts: DashboardListItem[];
  bookingStats: BookingStatItem[];
  totalBookings: number;
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
];

const formatDateDisplay = (dateString: string): string => {
  if (!dateString) return 'Belum ditentukan';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
  }).format(date);
};

const typeLabel = (type: string): string =>
  type === 'room' ? 'Ruangan' : 'Peralatan';

const statusTone = (status: string): DashboardNotification['tone'] => {
  if (status === 'approved') return 'success';
  if (status === 'rejected') return 'danger';
  if (status === 'pending' || status === 'reviewing') return 'warning';
  return 'info';
};

const statusText = (status: string): string => {
  const map: Record<string, string> = {
    pending: 'Menunggu persetujuan',
    reviewing: 'Sedang ditinjau',
    approved: 'Disetujui',
    rejected: 'Ditolak',
    completed: 'Selesai',
  };
  return map[status] ?? 'Update terkini';
};

const statusDescription = (status: string): string => {
  const map: Record<string, string> = {
    pending: 'Menunggu surat izin dari peminjam',
    reviewing: 'Menunggu persetujuan admin',
    approved: 'Peminjaman disetujui',
    rejected: 'Peminjaman ditolak',
    completed: 'Peminjaman selesai',
  };
  return map[status] ?? 'Perkembangan terbaru peminjaman';
};

export const useHomeViewModel = (): HomeViewModel => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
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
  const approvedBookings = bookings.filter(
    (booking) => booking.status === 'approved'
  );
  const pendingRequests = bookings.filter(
    (booking) => booking.status === 'pending' || booking.status === 'reviewing'
  );
  const myBookings = user?.name
    ? bookings.filter(
        (booking) => booking.borrower.toLowerCase() === user.name.toLowerCase()
      )
    : [];

  const upcomingSchedules = [...schedules]
    .filter((schedule) => schedule.date >= todayKey)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  const borrowedInventories = [...inventories]
    .filter((inventory) => inventory.status === 'Dipinjam')
    .slice(0, 4);
  const inventoryAlerts: DashboardListItem[] = borrowedInventories.map(
    (inventory) => ({
      id: inventory.id,
      label: inventory.name,
      value: `${inventory.stock} item`,
      meta: 'Dipinjam',
      tone: 'warning' as const,
    })
  );

  const bookingSource = isAdmin ? bookings : myBookings;
  const statusOrder: BookingStatus[] = [
    'pending',
    'reviewing',
    'approved',
    'rejected',
    'completed',
  ];
  const bookingStats: BookingStatItem[] = statusOrder
    .map((status) => ({
      status,
      label: BOOKING_STATUS_META[status].label,
      count: bookingSource.filter((booking) => booking.status === status)
        .length,
      color: BOOKING_STATUS_META[status].color,
    }))
    .filter((item) => item.count > 0);
  const totalBookings = bookingSource.length;

  const notifications: DashboardNotification[] = isAdmin
    ? pendingRequests.length > 0
      ? pendingRequests.slice(0, 3).map((booking) => ({
          id: booking.id,
          title: booking.title || `${typeLabel(booking.type)} baru`,
          description: `${booking.borrower} mengajukan ${typeLabel(booking.type).toLowerCase()} untuk diproses.`,
          meta: `${statusText(booking.status)} • ${formatDateDisplay(booking.date)}`,
          tone: statusTone(booking.status),
        }))
      : [
          {
            id: 'admin-empty',
            title: 'Semua request sudah tertangani',
            description:
              'Belum ada permintaan peminjaman yang perlu ditinjau saat ini.',
            meta: 'Status sistem normal',
            tone: 'success',
          },
        ]
    : myBookings.length > 0
      ? myBookings
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, 3)
          .map((booking) => ({
            id: booking.id,
            title: booking.title || `${typeLabel(booking.type)} saya`,
            description: `${statusDescription(booking.status)}.`,
            meta: `${statusText(booking.status)} • ${formatDateDisplay(booking.date)}`,
            tone: statusTone(booking.status),
          }))
      : [
          {
            id: 'user-empty',
            title: 'Belum ada peminjaman aktif',
            description:
              'Anda belum memiliki riwayat peminjaman yang sedang berjalan.',
            meta: 'Siap untuk mengajukan peminjaman',
            tone: 'info',
          },
        ];

  const stats: HomeStat[] = [
    {
      id: 'equipment',
      label: 'Inventaris',
      value: totalEquipment,
      hint: 'item terdaftar',
    },
    {
      id: 'loans',
      label: 'Peminjaman aktif',
      value: approvedBookings.length,
      hint: 'sedang berjalan',
    },
    {
      id: 'schedules',
      label: 'Jadwal ruangan',
      value: upcomingSchedules.length,
      hint: 'agenda berikutnya',
    },
    {
      id: 'requests',
      label: isAdmin ? 'Permintaan peminjaman' : 'Pengajuan peminjaman',
      value: isAdmin
        ? pendingRequests.length
        : myBookings.filter(
            (booking) =>
              booking.status !== 'completed' && booking.status !== 'rejected'
          ).length,
      hint: isAdmin ? 'menunggu persetujuan' : 'dalam proses',
    },
  ];

  return {
    features,
    stats,
    notifications,
    roomSchedule: upcomingSchedules.map((schedule) => ({
      id: schedule.id,
      label: schedule.title,
      value: schedule.location,
      meta: `${formatDateDisplay(schedule.date)} • ${schedule.start_time}-${schedule.end_time}`,
    })),
    inventoryAlerts,
    bookingStats,
    totalBookings,
    statsLoading: loading || bookingsLoading || schedulesLoading,
  };
};
