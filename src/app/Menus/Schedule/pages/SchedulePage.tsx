import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  InfoIcon,
  TimeIcon,
} from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import {
  colorFromKey,
  Calendar,
  buildSampleEvents,
  palette,
  toDateKey,
  type CalendarEvent,
} from 'components/Calendar';
import { useCallback, useMemo, useState } from 'react';
import { useAuth } from 'service/auth';
import type { ScheduleInput } from '../../../../domain/models/ScheduleModel';
import ScheduleFormModal, {
  REPEAT_LABELS,
  type CreateForm,
  type ScheduleFormSubmitPayload,
} from '../components/ScheduleFormModal';
import { useCreateScheduleViewModel } from '../viewModels/createScheduleViewModel';
import { useDeleteScheduleViewModel } from '../viewModels/deleteScheduleViewModel';
import { useGetSchedulesViewModel } from '../viewModels/getSchedulesViewModel';
import { useUpdateScheduleViewModel } from '../viewModels/updateScheduleViewModel';
import { useThemeStore } from '../../store/useThemeStore';
import { useThemeColors } from '../../store/themeColors';

const FIXED_ROOM = 'Studio Pertunjukan lt 11 Pasca';

export default function SchedulePage() {
  const toast = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const mode = useThemeStore((state) => state.mode);
  const theme = useThemeColors();
  const detailModal = useDisclosure();
  const openDetailModal = detailModal.onOpen;
  const createModal = useDisclosure();
  const editModal = useDisclosure();
  const today = new Date();
  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDay, setSelectedDay] = useState<Date>(today);
  const [detailEvent, setDetailEvent] = useState<CalendarEvent | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingLocation, setEditingLocation] = useState<string>(FIXED_ROOM);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const { schedules, error: schedulesError } = useGetSchedulesViewModel({
    month: month + 1,
    year,
    page: 1,
    limit: 100,
  });

  const { createSchedule, loading: isCreating } = useCreateScheduleViewModel({
    onSuccess: () => undefined,
    onFailure: () => undefined,
  });

  const { updateSchedule, loading: isUpdating } = useUpdateScheduleViewModel({
    onSuccess: () => {
      toast({
        status: 'success',
        title: 'Jadwal diperbarui',
        position: 'top',
      });
      editModal.onClose();
    },
    onFailure: () =>
      toast({
        status: 'error',
        title: 'Gagal memperbarui jadwal',
        description: 'Pastikan API jadwal tersedia, lalu coba lagi.',
        position: 'top',
      }),
  });

  const { deleteSchedule, loading: isDeleting } = useDeleteScheduleViewModel({
    onSuccess: () => {
      toast({
        status: 'success',
        title: 'Jadwal dihapus',
        position: 'top',
      });
      setDetailEvent(null);
      detailModal.onClose();
    },
    onFailure: () =>
      toast({
        status: 'error',
        title: 'Gagal menghapus jadwal',
        description: 'Pastikan API jadwal tersedia, lalu coba lagi.',
        position: 'top',
      }),
  });

  const eventsByDate = useMemo(() => {
    const byDate: Record<string, CalendarEvent[]> = {};
    const add = (event: CalendarEvent): void => {
      byDate[event.dateKey] = byDate[event.dateKey] ?? [];
      byDate[event.dateKey].push(event);
    };

    if (schedulesError) {
      Object.values(buildSampleEvents(year, month)).forEach((list) =>
        list.forEach(add)
      );
    } else {
      schedules.forEach((schedule, index) =>
        add({
          id: schedule.id || `schedule-${index}`,
          dateKey: schedule.date,
          title: schedule.title,
          start: schedule.start_time,
          end: schedule.end_time,
          location: schedule.location,
          organizer: schedule.peminjam,
          color: colorFromKey(schedule.title),
          ...(schedule.note ? { note: schedule.note } : {}),
        })
      );
    }

    Object.values(byDate).forEach((list) =>
      list.sort((a, b) => a.start.localeCompare(b.start))
    );
    return byDate;
  }, [schedules, schedulesError, year, month]);

  const currentEvents = useMemo(
    () => Object.values(eventsByDate).flat(),
    [eventsByDate]
  );
  const usingSampleData = Boolean(schedulesError);

  const goToToday = useCallback((): void => {
    const now = new Date();
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDay(now);
  }, []);

  const openDetail = useCallback(
    (event: CalendarEvent): void => {
      setDetailEvent(event);
      openDetailModal();
    },
    [openDetailModal]
  );

  const handleViewDateChange = useCallback(
    (date: Date): void => setViewDate(date),
    []
  );
  const handleSelectDay = useCallback((day: Date): void => {
    setSelectedDay(day);
  }, []);

  const openEdit = (): void => {
    if (!detailEvent) return;
    setEditingId(detailEvent.id);
    setEditingLocation(detailEvent.location ?? FIXED_ROOM);
    detailModal.onClose();
    editModal.onOpen();
  };

  const handleDelete = async (): Promise<void> => {
    if (!detailEvent) return;
    const confirmed = window.confirm(
      `Hapus jadwal "${detailEvent.title}" pada ${detailEvent.dateKey}?`
    );
    if (!confirmed) return;
    await deleteSchedule(detailEvent.id);
  };

  const editInitialValues: CreateForm = {
    title: detailEvent?.title ?? '',
    date: detailEvent?.dateKey ?? '',
    start: detailEvent?.start ?? '08:00',
    end: detailEvent?.end ?? '10:00',
    peminjam: detailEvent?.organizer ?? '',
    repeat: 'none',
    repeatEnd: '',
    note: detailEvent?.note ?? '',
  };

  const handleFormSubmit = async (
    payload: ScheduleFormSubmitPayload
  ): Promise<void> => {
    if (payload.kind === 'create') {
      const { dates, repeat, draft } = payload;
      let created = 0;
      let failed = 0;
      await Promise.all(
        dates.map(async (date) => {
          const input: ScheduleInput = {
            ...draft,
            date: toDateKey(date),
            location: FIXED_ROOM,
          };
          const ok = await createSchedule(input);
          if (ok) created += 1;
          else failed += 1;
        })
      );

      if (created === 0 && failed > 0) {
        toast({
          status: 'error',
          title: 'Gagal menyimpan jadwal',
          description: 'Pastikan API jadwal tersedia, lalu coba lagi.',
          position: 'top',
        });
        return;
      }

      const repeatLabel =
        REPEAT_LABELS.find((option) => option.value === repeat)?.label ??
        'Tidak berulang';
      toast({
        status: 'success',
        title: 'Jadwal ditambahkan',
        description:
          created === 1
            ? '1 jadwal ditambahkan ke kalender.'
            : `${created} jadwal (${repeatLabel.toLowerCase()}) ditambahkan ke kalender.`,
        position: 'top',
      });
      createModal.onClose();
      return;
    }

    if (payload.kind === 'edit' && editingId) {
      const input: ScheduleInput = {
        ...payload.draft,
        date: payload.date,
        location: editingLocation,
      };
      await updateSchedule(editingId, input);
    }
  };

  return (
    <Box>
      <Flex
        justify="space-between"
        align={{ base: 'start', md: 'center' }}
        gap={5}
        mb={8}
        direction={{ base: 'column', md: 'row' }}
      >
        <Box>
          <Heading
            as="h1"
            size={{ base: 'lg', md: '2xl' }}
            color={theme.textPrimary}
            letterSpacing="tight"
          >
            Jadwal Studio
          </Heading>
          <Text color={theme.textSecondary} mt={2} fontSize="sm">
            Lihat secara langsung jadwal penggunaan ruangan di Laboratorium
            Studio Pertunjukan.
          </Text>
        </Box>
        {isAdmin && (
          <Button
            color="white"
            bg={mode === 'dark' ? 'rgba(37, 99, 235, 0.25)' : 'blue.600'}
            borderWidth="1px"
            borderColor={
              mode === 'dark' ? 'rgba(59, 130, 246, 0.5)' : 'blue.600'
            }
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
            onClick={createModal.onOpen}
          >
            Tambah Jadwal
          </Button>
        )}
      </Flex>

      {usingSampleData && (
        <Text
          color={mode === 'dark' ? 'orange.200' : 'orange.700'}
          mb={6}
          fontSize="sm"
        >
          Menampilkan data contoh — jadwal belum terhubung ke API.
        </Text>
      )}

      <Calendar
        events={currentEvents}
        viewDate={viewDate}
        selectedDay={selectedDay}
        onViewDateChange={handleViewDateChange}
        onSelectDay={handleSelectDay}
        onEventClick={openDetail}
        onTodayClick={goToToday}
      />

      <Modal
        isOpen={detailModal.isOpen}
        onClose={detailModal.onClose}
        size="md"
        motionPreset="none"
      >
        <ModalOverlay bg="blackAlpha.700" />
        <ModalContent
          bg={mode === 'dark' ? 'rgba(8,10,14,0.85)' : 'rgba(255,255,255,0.97)'}
          color={theme.textPrimary}
          borderWidth="1px"
          borderColor={theme.panelBorder}
          boxShadow="0 24px 80px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,0.08)"
        >
          <ModalHeader fontSize="lg">
            {detailEvent && (
              <Flex align="center" gap={3}>
                {detailEvent && (
                  <Box
                    w={3}
                    h={3}
                    borderRadius="full"
                    bg={palette[detailEvent.color].dot}
                  />
                )}
                <Text noOfLines={2} fontSize="md">
                  {detailEvent.title}
                </Text>
              </Flex>
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {detailEvent && (
              <Stack spacing={3}>
                <Flex align="center" gap={3}>
                  <Flex
                    w={9}
                    h={9}
                    align="center"
                    justify="center"
                    borderRadius="xl"
                    bg={
                      mode === 'dark'
                        ? 'rgba(255,255,255,0.08)'
                        : 'rgba(15,23,42,0.06)'
                    }
                    color={mode === 'dark' ? 'blue.300' : 'blue.600'}
                  >
                    <TimeIcon boxSize={4} />
                  </Flex>
                  <Box>
                    <Text color={theme.textSecondary} fontSize="xs">
                      Waktu
                    </Text>
                    <Text fontSize="sm">
                      {detailEvent.start}–{detailEvent.end}
                    </Text>
                  </Box>
                </Flex>
                <Flex align="center" gap={3}>
                  <Flex
                    w={9}
                    h={9}
                    align="center"
                    justify="center"
                    borderRadius="xl"
                    bg={
                      mode === 'dark'
                        ? 'rgba(255,255,255,0.08)'
                        : 'rgba(15,23,42,0.06)'
                    }
                    color={mode === 'dark' ? 'blue.300' : 'blue.600'}
                  >
                    <InfoIcon boxSize={4} />
                  </Flex>
                  <Box>
                    <Text color={theme.textSecondary} fontSize="xs">
                      Ruangan
                    </Text>
                    <Text fontSize="sm">{detailEvent.location}</Text>
                  </Box>
                </Flex>
                <Flex align="center" gap={3}>
                  <Flex
                    w={9}
                    h={9}
                    align="center"
                    justify="center"
                    borderRadius="xl"
                    bg={
                      mode === 'dark'
                        ? 'rgba(255,255,255,0.08)'
                        : 'rgba(15,23,42,0.06)'
                    }
                    color={mode === 'dark' ? 'blue.300' : 'blue.600'}
                  >
                    <InfoIcon boxSize={4} />
                  </Flex>
                  <Box>
                    <Text color={theme.textSecondary} fontSize="xs">
                      Peminjam
                    </Text>
                    <Text fontSize="sm">{detailEvent.organizer}</Text>
                  </Box>
                </Flex>
                {detailEvent.note && (
                  <Flex align="center" gap={3}>
                    <Flex
                      w={9}
                      h={9}
                      align="center"
                      justify="center"
                      borderRadius="xl"
                      bg="rgba(255,255,255,0.08)"
                      color="blue.300"
                    >
                      <InfoIcon boxSize={4} />
                    </Flex>
                    <Box>
                      <Text color={theme.textSecondary} fontSize="xs">
                        Keterangan
                      </Text>
                      <Text fontSize="sm">{detailEvent.note}</Text>
                    </Box>
                  </Flex>
                )}
              </Stack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              color={mode === 'dark' ? 'red.300' : 'red.600'}
              fontSize="sm"
              borderWidth="1px"
              borderColor="rgba(255, 99, 132, 0.35)"
              borderRadius="full"
              isLoading={isDeleting}
              leftIcon={<DeleteIcon />}
              _hover={{
                bg: 'rgba(255, 99, 132, 0.15)',
                color: mode === 'dark' ? 'red.200' : 'red.700',
              }}
              onClick={() => {
                void handleDelete();
              }}
            >
              Hapus
            </Button>
            <Button
              variant="ghost"
              color={theme.textSecondary}
              fontSize="sm"
              borderWidth="1px"
              borderColor={theme.panelBorder}
              borderRadius="full"
              ml={3}
              leftIcon={<EditIcon />}
              _hover={{ bg: theme.hoverBg, color: theme.textPrimary }}
              onClick={openEdit}
            >
              Edit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ScheduleFormModal
        mode="create"
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        loading={isCreating}
        onSubmit={(payload) => {
          void handleFormSubmit(payload);
        }}
      />

      <ScheduleFormModal
        mode="edit"
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        loading={isUpdating}
        initialValues={editInitialValues}
        onSubmit={(payload) => {
          void handleFormSubmit(payload);
        }}
      />
    </Box>
  );
}
