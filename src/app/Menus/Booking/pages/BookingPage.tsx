import { AddIcon, DeleteIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useAuth } from 'service/auth';
import DataTable, {
  type Column,
} from '../../../../../components/DataTable/DataTable';
import FilterBar, {
  type FilterField,
} from '../../../../../components/DataTable/FilterBar';
import DataTablePagination from '../../../../../components/DataTable/Pagination';
import { useCreateBookingViewModel } from '../viewModels/createBookingViewModel';
import { useDeleteBookingViewModel } from '../viewModels/deleteBookingViewModel';
import { useGetBookingByIdViewModel } from '../viewModels/getBookingByIdViewModel';
import { useGetBookingsViewModel } from '../viewModels/getBookingsViewModel';
import { useUpdateBookingStatusViewModel } from '../viewModels/updateBookingStatusViewModel';
import { useUpdateBookingViewModel } from '../viewModels/updateBookingViewModel';
import type {
  BookingFilters,
  BookingModel,
  BookingStatus,
} from '../../../../domain/models/BookingModel';
import type { BookingPayload } from '../../../../domain/repositories/BookingRepositories';
import BookingFormModal, {
  TYPE_LABELS,
  type BookingFormValues,
} from '../components/BookingFormModal';
import BookingStatusBadge from '../components/BookingStatusBadge';
import ReviewBookingModal from '../components/ReviewBookingModal';
import { useThemeStore } from '../../store/useThemeStore';
import { useThemeColors } from '../../store/themeColors';
import { shortId } from 'utility/string';

const baseFilterFields: FilterField[] = [
  {
    key: 'title',
    label: 'Cari judul',
  },
  {
    key: 'type',
    label: 'Semua jenis',
    options: [
      { value: 'equipment', label: 'Peralatan' },
      { value: 'room', label: 'Ruangan' },
    ],
  },
  {
    key: 'status',
    label: 'Semua status',
    options: ['pending', 'reviewing', 'approved', 'rejected', 'completed'],
  },
];

const getFilterFields = (isAdmin: boolean): FilterField[] =>
  isAdmin
    ? [{ key: 'borrower', label: 'Cari nama peminjam' }, ...baseFilterFields]
    : baseFilterFields;

const initialFilters: BookingFilters = { page: 1, limit: 10 };

const toInput = (values: BookingFormValues): BookingPayload => {
  const isRoom = values.type === 'room';
  return {
    borrower: values.borrower.trim(),
    type: values.type,
    title: values.title.trim() || undefined,
    items:
      values.type === 'equipment' && values.items.length > 0
        ? values.items
        : undefined,
    date: values.date,
    end_date: values.type === 'equipment' ? values.end_date : undefined,
    start_time: isRoom ? values.start_time : undefined,
    end_time: isRoom ? values.end_time : undefined,
    repeat: isRoom ? values.repeat : undefined,
    repeat_end: isRoom && values.repeat_end ? values.repeat_end : undefined,
    note: values.note.trim() || undefined,
  };
};

export default function BookingPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const mode = useThemeStore((state) => state.mode);
  const theme = useThemeColors();
  const filterFields = getFilterFields(isAdmin);
  const toast = useToast();
  const formModal = useDisclosure();
  const [filters, setFilters] = useState<BookingFilters>(initialFilters);
  const {
    bookings,
    pagination,
    loading: isLoading,
    error,
  } = useGetBookingsViewModel(filters);
  const { getBookingById } = useGetBookingByIdViewModel();
  const { createBooking, loading: isCreating } = useCreateBookingViewModel({
    onSuccess: () => {
      toast({
        status: 'success',
        title: 'Peminjaman diajukan',
        position: 'top',
      });
      formModal.onClose();
    },
    onFailure: () =>
      toast({
        status: 'error',
        title: 'Gagal mengajukan peminjaman',
        position: 'top',
      }),
  });
  const { updateBookingStatus, loading: isUpdatingStatus } =
    useUpdateBookingStatusViewModel({
      onSuccess: () =>
        toast({
          status: 'success',
          title: 'Status peminjaman diperbarui',
          position: 'top',
        }),
      onFailure: (message) =>
        toast({
          status: 'error',
          title: 'Gagal mengubah status',
          description: message,
          position: 'top',
        }),
    });
  const { deleteBooking, loading: isDeleting } = useDeleteBookingViewModel({
    onSuccess: () =>
      toast({
        status: 'success',
        title: 'Peminjaman dihapus',
        position: 'top',
      }),
    onFailure: () =>
      toast({
        status: 'error',
        title: 'Gagal menghapus peminjaman',
        position: 'top',
      }),
  });
  const { updateBooking, loading: isUploadingLetter } =
    useUpdateBookingViewModel({
      onSuccess: () => {},
      onFailure: () => {},
    });

  const reviewModal = useDisclosure();
  const [reviewing, setReviewing] = useState<BookingModel | null>(null);

  const openCreate = () => {
    formModal.onOpen();
  };
  const openReview = async (booking: BookingModel) => {
    try {
      const latest = await getBookingById(booking.id);
      setReviewing(latest);
    } catch {
      setReviewing(booking);
    }
    reviewModal.onOpen();
  };
  const updateFilters = (key: string, value: string) => {
    setFilters((current) => ({
      ...current,
      [key]: value || undefined,
      page: 1,
    }));
  };
  const changePage = (page: number) =>
    setFilters((current) => ({ ...current, page }));

  const submit = async (values: BookingFormValues) => {
    const input = toInput(values);
    await createBooking(input);
  };

  const decide = async (status: BookingStatus, reason?: string) => {
    if (!reviewing) return;
    await updateBookingStatus(reviewing.id, status, reason);
    reviewModal.onClose();
    setReviewing(null);
  };

  const uploadLetter = async (file: File) => {
    if (!reviewing) return;
    const input: BookingPayload = {
      borrower: reviewing.borrower,
      type: reviewing.type,
      letter: file,
      items: reviewing.items?.map((item) => ({
        inventory_id: item.inventory_id,
        quantity: item.quantity,
      })),
      date: reviewing.date,
      end_date: reviewing.end_date,
      start_time: reviewing.start_time,
      end_time: reviewing.end_time,
      repeat: reviewing.repeat,
      repeat_end: reviewing.repeat_end,
      note: reviewing.note,
    };
    const result = await updateBooking(reviewing.id, input);
    if (!result.data) {
      throw new Error('upload letter failed');
    }
    // Muat ulang data booking agar status langsung berubah menjadi "Reviewing".
    try {
      const latest = await getBookingById(reviewing.id);
      setReviewing(latest);
    } catch {
      setReviewing(result.data);
    }
  };

  const remove = async (booking: BookingModel) => {
    if (!window.confirm(`Hapus booking oleh ${booking.borrower}?`)) return;
    await deleteBooking(booking.id);
  };

  const bookingColumns: Column<BookingModel>[] = [
    {
      header: 'ID',
      accessor: (item) => (
        <Text color={theme.textSecondary} fontFamily="mono">
          {shortId(item.id)}
        </Text>
      ),
    },
    {
      header: 'Judul',
      accessor: (item) => (
        <Text color={theme.textSecondary} fontWeight="semibold">
          {item.title ?? '—'}
        </Text>
      ),
    },
    {
      header: 'Peminjam',
      accessor: (item) => (
        <Text color={theme.textPrimary}>{item.borrower}</Text>
      ),
    },
    {
      header: 'Jenis',
      accessor: (item) => (
        <Text color={theme.textSecondary}>{TYPE_LABELS[item.type]}</Text>
      ),
    },
    {
      header: 'Tanggal',
      accessor: (item) => (
        <Text color={theme.textSecondary}>
          {item.type === 'room'
            ? item.date
            : item.end_date
              ? `${item.date} – ${item.end_date}`
              : item.date}
        </Text>
      ),
    },
    {
      header: 'Waktu',
      accessor: (item) => (
        <Text color={theme.textSecondary}>
          {item.type === 'room' && item.start_time && item.end_time
            ? `${item.start_time}–${item.end_time}`
            : '—'}
        </Text>
      ),
    },
    {
      header: 'Status',
      accessor: (item) => <BookingStatusBadge status={item.status} />,
    },
    {
      header: 'Aksi',
      accessor: (item) => (
        <Flex justify="flex-start" gap={1} align="center">
          <Button
            aria-label="Detail Peminjaman"
            variant="ghost"
            colorScheme="blue"
            color={mode === 'dark' ? undefined : 'blue.800'}
            size="xs"
            leftIcon={<InfoOutlineIcon />}
            onClick={() => openReview(item)}
          >
            Detail
          </Button>
          {isAdmin && (
            <Button
              aria-label="Hapus booking"
              variant="ghost"
              color={mode === 'dark' ? 'red.200' : 'red.600'}
              _hover={{ bg: 'red.500' }}
              size="sm"
              isLoading={isDeleting}
              onClick={() => remove(item)}
            >
              <DeleteIcon />
            </Button>
          )}
        </Flex>
      ),
    },
  ];

  return (
    <Box>
      <Flex
        justify="space-between"
        align={{ base: 'start', md: 'center' }}
        gap={5}
        mb={10}
        direction={{ base: 'column', md: 'row' }}
      >
        <Box>
          <Heading
            as="h1"
            size={{ base: 'lg', md: 'xl' }}
            color={theme.textPrimary}
            letterSpacing="tight"
          >
            Peminjaman
          </Heading>
          <Text color={theme.textSecondary} mt={2} fontSize="sm">
            {isAdmin
              ? 'Kelola dan putuskan permintaan peminjaman peralatan maupun ruangan Studio Pertunjukan.'
              : 'Ajukan peminjaman peralatan maupun ruangan Studio Pertunjukan.'}
          </Text>
        </Box>

        <Button
          color="white"
          bg={mode === 'dark' ? 'rgba(37, 99, 235, 0.25)' : 'blue.600'}
          borderWidth="1px"
          borderColor={mode === 'dark' ? 'rgba(59, 130, 246, 0.5)' : 'blue.600'}
          backdropFilter="blur(12px)"
          fontSize="sm"
          borderRadius="full"
          w={{ base: 'full', md: 'auto' }}
          _hover={{
            bg: mode === 'dark' ? 'rgba(37, 99, 235, 0.45)' : 'blue.700',
            borderColor:
              mode === 'dark' ? 'rgba(59, 130, 246, 0.75)' : 'blue.700',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
          }}
          _active={{ bg: 'rgba(37, 99, 235, 0.6)' }}
          leftIcon={<AddIcon />}
          onClick={openCreate}
        >
          {isAdmin ? 'Tambah Peminjaman' : 'Ajukan Peminjaman'}
        </Button>
      </Flex>
      {error && (
        <Text color={mode === 'dark' ? 'orange.200' : 'orange.700'} mb={4}>
          API belum tersedia — menampilkan data contoh.
        </Text>
      )}
      <FilterBar
        fields={filterFields}
        filters={filters}
        onChange={updateFilters}
        onReset={() => setFilters(initialFilters)}
      />
      <DataTable
        data={bookings}
        loading={isLoading}
        minW="1040px"
        keyExtractor={(item) => item.id}
        columns={bookingColumns}
        renderMobileCard={(item) => (
          <>
            <Flex align="flex-start" justify="space-between" gap={2}>
              <Box minW={0}>
                <Text
                  color={theme.textSecondary}
                  fontSize="xs"
                  fontFamily="mono"
                >
                  {shortId(item.id)}
                </Text>
                <Text
                  color={theme.textPrimary}
                  fontWeight="semibold"
                  noOfLines={1}
                >
                  {item.borrower}
                </Text>
                <Text color={theme.textMuted} fontSize="xs" mt={0.5}>
                  {TYPE_LABELS[item.type]}
                </Text>
                <Text
                  color={theme.textMuted}
                  fontSize="xs"
                  mt={0.5}
                  noOfLines={1}
                >
                  {item.title ?? 'Tanpa judul'}
                </Text>
                <Text color={theme.textMuted} fontSize="xs" mt={0.5}>
                  {item.type === 'room'
                    ? `${item.date} · ${item.start_time ?? ''}–${item.end_time ?? ''}`
                    : item.end_date
                      ? `${item.date} – ${item.end_date}`
                      : item.date}
                </Text>
              </Box>
              <BookingStatusBadge status={item.status} />
            </Flex>
            <Flex justify="flex-end" gap={1} mt={3}>
              <Button
                variant="ghost"
                colorScheme="blue"
                color={mode === 'dark' ? undefined : 'blue.800'}
                size="xs"
                leftIcon={<InfoOutlineIcon />}
                onClick={() => openReview(item)}
              >
                Detail
              </Button>
              {isAdmin && (
                <Button
                  variant="ghost"
                  color={mode === 'dark' ? 'red.200' : 'red.600'}
                  size="xs"
                  isLoading={isDeleting}
                  onClick={() => remove(item)}
                >
                  <DeleteIcon />
                </Button>
              )}
            </Flex>
          </>
        )}
      />
      <DataTablePagination
        currentPage={pagination.current}
        totalPages={pagination.total}
        totalItems={pagination.total_data}
        onPageChange={changePage}
      />

      <BookingFormModal
        isOpen={formModal.isOpen}
        onClose={formModal.onClose}
        loading={isCreating}
        onSubmit={submit}
        isAdmin={isAdmin}
      />

      <ReviewBookingModal
        booking={reviewing}
        isOpen={reviewModal.isOpen}
        onClose={() => {
          reviewModal.onClose();
          setReviewing(null);
        }}
        onDecide={decide}
        deciding={isUpdatingStatus}
        isAdmin={isAdmin}
        onUploadLetter={uploadLetter}
        uploadingLetter={isUploadingLetter}
      />
    </Box>
  );
}
