import { AddIcon, DeleteIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useAuth } from 'service/auth';
import FilterBar, {
  type FilterField,
} from '../../../../../components/DataTable/FilterBar';
import DataTablePagination from '../../../../../components/DataTable/Pagination';
import { useCreateBookingViewModel } from '../viewModels/createBookingViewModel';
import { useDeleteBookingViewModel } from '../viewModels/deleteBookingViewModel';
import { useGetBookingByIdViewModel } from '../viewModels/getBookingByIdViewModel';
import { useGetBookingsViewModel } from '../viewModels/getBookingsViewModel';
import { useUpdateBookingStatusViewModel } from '../viewModels/updateBookingStatusViewModel';
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
    options: ['equipment', 'room'],
  },
  {
    key: 'status',
    label: 'Semua status',
    options: ['process', 'approved', 'rejected', 'completed'],
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
    letter: values.letterFile ?? null,
    letter_file: values.letter_file.trim() || undefined,
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
  const filterFields = getFilterFields(isAdmin);
  const mode = useThemeStore((state) => state.mode);
  const theme = useThemeColors();
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

  const remove = async (booking: BookingModel) => {
    if (!window.confirm(`Hapus booking oleh ${booking.borrower}?`)) return;
    await deleteBooking(booking.id);
  };

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
            size={{ base: 'xl', md: '2xl' }}
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
      {isLoading ? (
        <Flex minH="300px" justify="center" align="center">
          <Spinner thickness="3px" color="blue.400" />
        </Flex>
      ) : (
        <>
          <Box display={{ base: 'none', md: 'block' }}>
            <Box
              borderWidth="1px"
              borderColor={
                mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'gray.200'
              }
              borderRadius="2xl"
              overflow="hidden"
              bg={theme.cardBg}
            >
              <Box overflowX="auto">
                <Table
                  variant="simple"
                  minW="1040px"
                  sx={{
                    th: {
                      fontSize: 'xs',
                      borderColor:
                        mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'gray.200',
                    },
                    td: {
                      fontSize: 'xs',
                      borderColor:
                        mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'gray.200',
                    },
                  }}
                >
                  <Thead
                    bg={mode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.50'}
                  >
                    <Tr>
                      <Th color={theme.textMuted}>ID</Th>
                      <Th color={theme.textMuted}>Judul</Th>
                      <Th color={theme.textMuted}>Peminjam</Th>
                      <Th color={theme.textMuted}>Jenis</Th>
                      <Th color={theme.textMuted}>Tanggal</Th>
                      <Th color={theme.textMuted}>Waktu</Th>
                      <Th color={theme.textMuted}>Status</Th>
                      <Th color={theme.textMuted} textAlign="right">
                        Aksi
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {bookings.map((item) => (
                      <Tr
                        key={item.id}
                        _hover={{
                          bg:
                            mode === 'dark'
                              ? 'whiteAlpha.200'
                              : 'blackAlpha.100',
                        }}
                      >
                        <Td color={theme.textSecondary} fontFamily="mono">
                          {shortId(item.id)}
                        </Td>
                        <Td color={theme.textSecondary} fontWeight="semibold">
                          {item.title ?? '—'}
                        </Td>
                        <Td color={theme.textPrimary}>{item.borrower}</Td>
                        <Td color={theme.textSecondary}>
                          {TYPE_LABELS[item.type]}
                        </Td>
                        <Td color={theme.textSecondary}>
                          {item.type === 'room'
                            ? item.date
                            : item.end_date
                              ? `${item.date} – ${item.end_date}`
                              : item.date}
                        </Td>
                        <Td color={theme.textSecondary}>
                          {item.type === 'room' &&
                          item.start_time &&
                          item.end_time
                            ? `${item.start_time}–${item.end_time}`
                            : '—'}
                        </Td>
                        <Td>
                          <BookingStatusBadge status={item.status} />
                        </Td>
                        <Td>
                          <Flex justify="flex-end" gap={1} align="center">
                            <Button
                              aria-label="Detail booking"
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
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </Box>
          </Box>

          <Stack spacing={3} display={{ base: 'flex', md: 'none' }}>
            {bookings.map((item) => (
              <Box
                key={item.id}
                bg={theme.cardBg}
                borderWidth="1px"
                borderColor={theme.cardBorder}
                borderRadius="2xl"
                p={4}
              >
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
              </Box>
            ))}
          </Stack>
        </>
      )}
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
      />
    </Box>
  );
}
