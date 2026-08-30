import {
  AddIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  InfoIcon,
  TimeIcon,
} from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { buildSampleEvents, toDateKey } from '../domain/events';
import type { CalendarEvent, EventColor } from '../domain/events';
import MenuLayout from '../../components/MenuLayout';

interface EventColorStyle {
  chipBg: string;
  chipBorder: string;
  text: string;
  dot: string;
}

const palette: Record<EventColor, EventColorStyle> = {
  blue: {
    chipBg: '#dbeafe',
    chipBorder: '#93c5fd',
    text: '#1e3a8a',
    dot: '#3b82f6',
  },
  cyan: {
    chipBg: '#cffafe',
    chipBorder: '#67e8f9',
    text: '#155e75',
    dot: '#06b6d4',
  },
  green: {
    chipBg: '#d1fae5',
    chipBorder: '#6ee7b7',
    text: '#065f46',
    dot: '#10b981',
  },
  orange: {
    chipBg: '#fef3c7',
    chipBorder: '#fcd34d',
    text: '#78350f',
    dot: '#f59e0b',
  },
  violet: {
    chipBg: '#ede9fe',
    chipBorder: '#c4b5fd',
    text: '#4c1d95',
    dot: '#8b5cf6',
  },
  rose: {
    chipBg: '#ffe4e6',
    chipBorder: '#fda4af',
    text: '#881337',
    dot: '#f43f5e',
  },
};

const WEEKDAYS = [
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
  'Minggu',
];
const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

interface MonthPickerProps {
  value: Date;
  onSelect: (date: Date) => void;
  monthLabel: string;
}

function MonthPicker({ value, onSelect, monthLabel }: MonthPickerProps) {
  const popover = useDisclosure();
  const [pickerYear, setPickerYear] = useState(value.getFullYear());

  useEffect(() => {
    setPickerYear(value.getFullYear());
  }, [value]);

  return (
    <Popover
      isOpen={popover.isOpen}
      onOpen={popover.onOpen}
      onClose={popover.onClose}
      placement="bottom-start"
      isLazy
    >
      <PopoverTrigger>
        <Button
          variant="ghost"
          h="auto"
          px={3}
          py={2}
          borderRadius="full"
          bg="rgba(255,255,255,0.05)"
          borderWidth="1px"
          borderColor="rgba(255,255,255,0.12)"
          color="white"
          _hover={{ bg: 'rgba(255,255,255,0.1)' }}
        >
          <Heading size="sm" color="white" letterSpacing="tight">
            {monthLabel}
          </Heading>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        w="260px"
        bg="#131318"
        color="white"
        borderWidth="1px"
        borderColor="rgba(255,255,255,0.14)"
        boxShadow="0 24px 80px rgba(0,0,0,.55)"
        backdropFilter="blur(20px)"
      >
        <PopoverBody p={4}>
          <Flex align="center" justify="space-between" mb={3}>
            <IconButton
              aria-label="Tahun sebelumnya"
              variant="ghost"
              color="whiteAlpha.600"
              _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
              size="sm"
              icon={<ChevronLeftIcon />}
              onClick={() => setPickerYear((current) => current - 1)}
            />
            <Text fontWeight="bold" fontSize="sm">
              {pickerYear}
            </Text>
            <IconButton
              aria-label="Tahun berikutnya"
              variant="ghost"
              color="whiteAlpha.600"
              _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
              size="sm"
              icon={<ChevronRightIcon />}
              onClick={() => setPickerYear((current) => current + 1)}
            />
          </Flex>
          <SimpleGrid columns={3} spacing={1}>
            {MONTH_NAMES.map((monthName, index) => {
              const active =
                index === value.getMonth() &&
                pickerYear === value.getFullYear();
              return (
                <Button
                  key={monthName}
                  size="sm"
                  borderRadius="lg"
                  bg={active ? 'blue.600' : 'transparent'}
                  color={active ? 'white' : 'whiteAlpha.700'}
                  _hover={
                    active
                      ? undefined
                      : { bg: 'whiteAlpha.100', color: 'white' }
                  }
                  onClick={() => {
                    onSelect(new Date(pickerYear, index, 1));
                    popover.onClose();
                  }}
                >
                  {monthName}
                </Button>
              );
            })}
          </SimpleGrid>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

const isSameDay = (a: Date, b: Date): boolean => toDateKey(a) === toDateKey(b);

const startOfMondayWeek = (date: Date): Date => {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  day.setDate(day.getDate() - ((day.getDay() + 6) % 7));
  return day;
};

const buildMonthDays = (year: number, month: number): Date[] => {
  const start = startOfMondayWeek(new Date(year, month, 1));
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
};

type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly';

const REPEAT_LABELS: Array<{ value: RepeatType; label: string }> = [
  { value: 'none', label: 'Tidak berulang' },
  { value: 'daily', label: 'Setiap hari' },
  { value: 'weekly', label: 'Setiap minggu' },
  { value: 'monthly', label: 'Setiap bulan' },
];

const CUSTOM_COLORS: EventColor[] = [
  'blue',
  'cyan',
  'green',
  'orange',
  'violet',
  'rose',
];

const parseDate = (value: string): Date | null => {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day, 0, 0, 0, 0);
};

const buildRecurringDates = (form: CreateForm): Date[] => {
  const start = parseDate(form.date);
  if (!start || !form.title) return [];
  let end: Date;
  if (form.repeat === 'none') {
    end = start;
  } else {
    end = parseDate(form.repeatEnd) ?? start;
    if (end < start) end = start;
  }

  const dates: Date[] = [];
  const cursor = new Date(start);
  let guard = 0;
  while (cursor <= end && guard < 500) {
    dates.push(new Date(cursor));
    if (form.repeat === 'daily') {
      cursor.setDate(cursor.getDate() + 1);
    } else if (form.repeat === 'weekly') {
      cursor.setDate(cursor.getDate() + 7);
    } else if (form.repeat === 'monthly') {
      const lastDayOfNext = new Date(
        cursor.getFullYear(),
        cursor.getMonth() + 2,
        0
      ).getDate();
      cursor.setDate(Math.min(cursor.getDate(), lastDayOfNext));
      cursor.setMonth(cursor.getMonth() + 1);
    } else {
      break;
    }
    guard += 1;
  }
  return dates;
};

interface CreateForm {
  title: string;
  date: string;
  start: string;
  end: string;
  peminjam: string;
  repeat: RepeatType;
  repeatEnd: string;
  note: string;
}

const FIXED_ROOM = 'Studio Pertunjukan lt 11 Pasca';

const emptyForm: CreateForm = {
  title: '',
  date: '',
  start: '08:00',
  end: '10:00',
  peminjam: '',
  repeat: 'none',
  repeatEnd: '',
  note: '',
};

export default function CalendarPage() {
  const toast = useToast();
  const detailModal = useDisclosure();
  const createModal = useDisclosure();
  const today = new Date();
  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDay, setSelectedDay] = useState<Date>(today);
  const [detailEvent, setDetailEvent] = useState<CalendarEvent | null>(null);
  const [form, setForm] = useState<CreateForm>(emptyForm);
  const [customEvents, setCustomEvents] = useState<CalendarEvent[]>([]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthLabel = new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric',
  }).format(viewDate);
  const selectedDayLabel = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(selectedDay);
  const eventsByDate = useMemo(() => {
    const byDate: Record<string, CalendarEvent[]> = {};
    const index = (list: CalendarEvent[]): void => {
      list.forEach((event) => {
        byDate[event.dateKey] = byDate[event.dateKey] ?? [];
        byDate[event.dateKey].push(event);
      });
    };
    Object.values(buildSampleEvents(year, month)).forEach(index);
    index(customEvents);
    Object.values(byDate).forEach((list) =>
      list.sort((a, b) => a.start.localeCompare(b.start))
    );
    return byDate;
  }, [year, month, customEvents]);
  const monthDays = buildMonthDays(year, month);
  const selectedEvents = eventsByDate[toDateKey(selectedDay)] ?? [];

  const moveMonth = (offset: number): void =>
    setViewDate(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + offset, 1)
    );

  const goToToday = (): void => {
    const now = new Date();
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDay(now);
  };

  const openDetail = (event: CalendarEvent): void => {
    setDetailEvent(event);
    detailModal.onOpen();
  };

  const updateForm = (update: Partial<CreateForm>): void =>
    setForm({ ...form, ...update });

  const changeRepeat = (repeat: RepeatType): void => {
    setForm((current) => {
      const next = { ...current, repeat };
      if (repeat === 'none') next.repeatEnd = '';
      else if (!next.repeatEnd) {
        const start = parseDate(next.date);
        if (start)
          next.repeatEnd = toDateKey(
            new Date(start.getFullYear(), start.getMonth() + 1, 0)
          );
      }
      return next;
    });
  };

  const recurringDates = buildRecurringDates(form);
  const formOccurrences = recurringDates.length;

  const submitCreate = (): void => {
    const repeatLabel =
      REPEAT_LABELS.find((option) => option.value === form.repeat)?.label ??
      'Tidak berulang';
    if (formOccurrences === 0) {
      toast({
        status: 'warning',
        title: 'Form belum lengkap',
        description: 'Lengkapi nama kegiatan dan tanggal terlebih dahulu.',
        position: 'top',
      });
      return;
    }
    const color = CUSTOM_COLORS[customEvents.length % CUSTOM_COLORS.length];
    const added = recurringDates.map((date, index) => ({
      id: `${toDateKey(date)}-${form.title}-custom`,
      dateKey: toDateKey(date),
      title: form.title.trim(),
      start: form.start,
      end: form.end,
      location: FIXED_ROOM,
      organizer: form.peminjam.trim() || 'Saya',
      color,
      ...(index === 0 ? { note: form.note.trim() } : {}),
    }));
    setCustomEvents((current) => [...current, ...added]);
    setForm(emptyForm);
    createModal.onClose();
    toast({
      status: 'success',
      title: 'Jadwal ditambahkan',
      description:
        formOccurrences === 1
          ? '1 jadwal ditambahkan ke kalender.'
          : `${formOccurrences} jadwal (${repeatLabel.toLowerCase()}) ditambahkan ke kalender.`,
      position: 'top',
    });
  };

  return (
    <MenuLayout>
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
              size={{ base: 'xl', md: '2xl' }}
              color="white"
              letterSpacing="tight"
            >
              Jadwal Ruangan Studio
            </Heading>
            <Text color="whiteAlpha.700" mt={2} fontSize="sm">
              Lihat secara langsung jadwal penggunaan ruangan di Laboratorium
              Studio Pertunjukan.
            </Text>
          </Box>
          <Button
            color="white"
            bg="rgba(37, 99, 235, 0.25)"
            borderWidth="1px"
            borderColor="rgba(59, 130, 246, 0.5)"
            backdropFilter="blur(12px)"
            fontSize="sm"
            borderRadius="full"
            _hover={{
              bg: 'rgba(37, 99, 235, 0.45)',
              borderColor: 'rgba(59, 130, 246, 0.75)',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
            }}
            _active={{ bg: 'rgba(37, 99, 235, 0.6)' }}
            leftIcon={<AddIcon />}
            onClick={createModal.onOpen}
          >
            Tambah Jadwal
          </Button>
        </Flex>

        <Text color="orange.200" mb={6} fontSize="sm">
          Menampilkan data contoh — jadwal belum terhubung ke API.
        </Text>

        <Flex direction="column" gap={6} align="flex-start">
          <Box
            flex="1"
            minW={0}
            w="full"
            borderRadius="2xl"
            bg="rgba(255,255,255,0.03)"
            borderWidth="1px"
            borderColor="rgba(255,255,255,0.08)"
            backdropFilter="blur(8px)"
            boxShadow="inset 0 1px 0 rgba(255,255,255,0.06)"
            overflow="hidden"
          >
            <Flex
              align="center"
              justify="space-between"
              gap={3}
              px={{ base: 3, md: 5 }}
              py={3.5}
              borderBottomWidth="1px"
              borderBottomColor="rgba(255,255,255,0.08)"
            >
              <MonthPicker
                value={viewDate}
                onSelect={setViewDate}
                monthLabel={monthLabel}
              />
              <Flex align="center" gap={1}>
                <Button
                  variant="ghost"
                  color="whiteAlpha.600"
                  _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
                  size="sm"
                  fontWeight="medium"
                  onClick={goToToday}
                  mr={1}
                >
                  Hari Ini
                </Button>
                <IconButton
                  aria-label="Bulan sebelumnya"
                  variant="solid"
                  color="white"
                  bg="rgba(255,255,255,0.14)"
                  _hover={{ bg: 'rgba(255,255,255,0.12)' }}
                  size="sm"
                  borderRadius="full"
                  icon={<ChevronLeftIcon />}
                  onClick={() => moveMonth(-1)}
                />
                <IconButton
                  aria-label="Bulan berikutnya"
                  variant="solid"
                  color="white"
                  bg="rgba(255,255,255,0.14)"
                  _hover={{ bg: 'rgba(255,255,255,0.12)' }}
                  size="sm"
                  borderRadius="full"
                  icon={<ChevronRightIcon />}
                  onClick={() => moveMonth(1)}
                />
              </Flex>
            </Flex>

            <Box
              px={2.5}
              pt={2}
              display="grid"
              gridTemplateColumns="repeat(7, 1fr)"
            >
              {WEEKDAYS.map((weekday) => (
                <Text
                  key={weekday}
                  color="whiteAlpha.500"
                  fontSize="xs"
                  fontWeight="bold"
                  letterSpacing="widest"
                  textTransform="uppercase"
                  textAlign="center"
                  py={2}
                  px={1}
                >
                  {weekday[0]}
                </Text>
              ))}
            </Box>

            <Box
              p={2.5}
              display="grid"
              gridTemplateColumns="repeat(7, 1fr)"
              gap={1.5}
              bg="rgba(255,255,255,0.015)"
            >
              {monthDays.map((day) => {
                const dayKey = toDateKey(day);
                const inViewMonth = day.getMonth() === month;
                const isToday = isSameDay(day, today);
                const isSelected = isSameDay(day, selectedDay);
                const dayEvents = eventsByDate[dayKey] ?? [];
                return (
                  <Box
                    key={dayKey}
                    minH={{ base: '92px', md: '118px' }}
                    minW={0}
                    p={1.5}
                    borderRadius="2xl"
                    onClick={() => setSelectedDay(day)}
                    cursor="pointer"
                    transition="all .15s ease"
                    bg={
                      isSelected
                        ? 'rgba(59,130,246,0.14)'
                        : isToday
                          ? 'rgba(255,255,255,0.045)'
                          : 'rgba(255,255,255,0.02)'
                    }
                    borderWidth="1px"
                    borderColor={
                      isSelected
                        ? 'rgba(59,130,246,0.55)'
                        : isToday
                          ? 'rgba(255,255,255,0.16)'
                          : 'rgba(255,255,255,0.04)'
                    }
                    boxShadow="none"
                    _hover={{
                      bg: 'rgba(255,255,255,0.07)',
                      borderColor: 'rgba(255,255,255,0.16)',
                    }}
                  >
                    <Flex align="center" justify="space-between" mb={1.5}>
                      <Flex
                        w={6}
                        h={6}
                        align="center"
                        justify="center"
                        borderRadius="full"
                        bg={isToday ? 'blue.600' : 'transparent'}
                        color={
                          isToday
                            ? 'white'
                            : inViewMonth
                              ? 'whiteAlpha.800'
                              : 'whiteAlpha.300'
                        }
                        fontSize="xs"
                        fontWeight={isToday ? 'bold' : 'medium'}
                      >
                        {day.getDate()}
                      </Flex>
                      {dayEvents.length > 0 && (
                        <Flex
                          w={5}
                          h={5}
                          align="center"
                          justify="center"
                          borderRadius="full"
                          bg="rgba(255,255,255,0.08)"
                          color="whiteAlpha.600"
                          fontSize="10px"
                          fontWeight="bold"
                        >
                          {dayEvents.length}
                        </Flex>
                      )}
                    </Flex>
                    <Stack spacing={1}>
                      {dayEvents.slice(0, 3).map((event) => {
                        const style = palette[event.color];
                        return (
                          <Tooltip
                            key={event.id}
                            label={`${event.title} · ${event.start}–${event.end}`}
                            placement="top"
                            hasArrow
                          >
                            <Button
                              w="full"
                              h="auto"
                              p={0}
                              bg="transparent"
                              _hover={{ bg: 'rgba(255,255,255,0.05)' }}
                              onClick={(eventClick) => {
                                eventClick.stopPropagation();
                                openDetail(event);
                              }}
                            >
                              <Flex
                                w="full"
                                align="center"
                                gap={1.5}
                                px={1.5}
                                py={1}
                                borderRadius="lg"
                                bg={style.chipBg}
                                borderWidth="1px"
                                borderColor={style.chipBorder}
                              >
                                <Box
                                  flex="1"
                                  minW={0}
                                  overflow="hidden"
                                  textAlign="left"
                                >
                                  <Text
                                    color={style.text}
                                    fontSize="xs"
                                    fontWeight="semibold"
                                    lineHeight="tight"
                                    noOfLines={1}
                                  >
                                    {event.title}
                                  </Text>
                                  <Text
                                    color={style.text}
                                    opacity={0.7}
                                    fontSize="10px"
                                    noOfLines={1}
                                  >
                                    {event.start}–{event.end}
                                  </Text>
                                </Box>
                              </Flex>
                            </Button>
                          </Tooltip>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <Button
                          size="xs"
                          variant="ghost"
                          color="whiteAlpha.500"
                          h="auto"
                          borderRadius="full"
                          _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
                          onClick={(eventClick) => {
                            eventClick.stopPropagation();
                            setSelectedDay(day);
                          }}
                        >
                          +{dayEvents.length - 3} lainnya
                        </Button>
                      )}
                    </Stack>
                  </Box>
                );
              })}
            </Box>
          </Box>

          <Box
            w="full"
            borderRadius="2xl"
            bg="rgba(255,255,255,0.03)"
            borderWidth="1px"
            borderColor="rgba(255,255,255,0.08)"
            backdropFilter="blur(8px)"
            boxShadow="inset 0 1px 0 rgba(255,255,255,0.03)"
            p={5}
          >
            <Flex align="center" justify="space-between" mb={4}>
              <Text color="white" fontSize="sm" fontWeight="bold">
                {selectedDayLabel}
              </Text>
            </Flex>
            {selectedEvents.length === 0 ? (
              <Box
                borderWidth="1px"
                borderStyle="dashed"
                borderColor="rgba(255,255,255,0.14)"
                borderRadius="2xl"
                py={10}
                px={4}
                textAlign="center"
              >
                <InfoIcon color="whiteAlpha.400" mb={3} />
                <Text color="whiteAlpha.500" fontSize="sm">
                  Tidak ada jadwal di tanggal ini.
                </Text>
              </Box>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={3}>
                {selectedEvents.map((event) => {
                  const style = palette[event.color];
                  return (
                    <Box
                      key={event.id}
                      borderRadius="2xl"
                      bg={style.chipBg}
                      borderWidth="1px"
                      borderColor={style.chipBorder}
                      p={3}
                      cursor="pointer"
                      transition="background-color .15s ease"
                      _hover={{ bg: style.chipBorder }}
                      onClick={() => openDetail(event)}
                    >
                      <Text
                        color={style.text}
                        fontSize="sm"
                        fontWeight="bold"
                        noOfLines={1}
                        mb={1}
                      >
                        {event.title}
                      </Text>
                      <Flex
                        align="center"
                        gap={2}
                        color={style.text}
                        opacity={0.7}
                        fontSize="xs"
                      >
                        <TimeIcon />
                        <Text>
                          {event.start}–{event.end}
                        </Text>
                      </Flex>
                      <Text
                        color={style.text}
                        opacity={0.55}
                        fontSize="xs"
                        mt={1}
                      >
                        {event.location}
                      </Text>
                    </Box>
                  );
                })}
              </SimpleGrid>
            )}
          </Box>
        </Flex>

        <Modal
          isOpen={detailModal.isOpen}
          onClose={detailModal.onClose}
          size="md"
        >
          <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.700" />
          <ModalContent
            bg="rgba(255,255,255,0.14)"
            backdropFilter="blur(20px)"
            color="white"
            borderWidth="1px"
            borderColor="rgba(255,255,255,0.14)"
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
                      bg="rgba(255,255,255,0.08)"
                      color="blue.300"
                    >
                      <TimeIcon boxSize={4} />
                    </Flex>
                    <Box>
                      <Text color="whiteAlpha.700" fontSize="xs">
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
                      bg="rgba(255,255,255,0.08)"
                      color="blue.300"
                    >
                      <InfoIcon boxSize={4} />
                    </Flex>
                    <Box>
                      <Text color="whiteAlpha.700" fontSize="xs">
                        Ruangan
                      </Text>
                      <Text fontSize="sm">{FIXED_ROOM}</Text>
                    </Box>
                  </Flex>
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
                      <Text color="whiteAlpha.700" fontSize="xs">
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
                        <Text color="whiteAlpha.700" fontSize="xs">
                          Keterangan
                        </Text>
                        <Text fontSize="sm">{detailEvent.note}</Text>
                      </Box>
                    </Flex>
                  )}
                </Stack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={createModal.isOpen}
          onClose={createModal.onClose}
          size="lg"
        >
          <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.700" />
          <ModalContent
            as="form"
            onSubmit={(event: React.FormEvent) => {
              event.preventDefault();
              submitCreate();
            }}
            bg="rgba(255,255,255,0.14)"
            backdropFilter="blur(20px)"
            color="white"
            borderWidth="1px"
            borderColor="rgba(255,255,255,0.14)"
            boxShadow="0 24px 80px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,0.08)"
          >
            <ModalHeader fontSize="lg">Tambah Jadwal</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={3}>
                <FormControl isRequired>
                  <FormLabel fontSize="xs" letterSpacing="wide">
                    Nama Kegiatan
                  </FormLabel>
                  <Input
                    size="sm"
                    value={form.title}
                    bg="whiteAlpha.100"
                    borderColor="whiteAlpha.300"
                    borderRadius="xl"
                    onChange={(event) =>
                      updateForm({ title: event.target.value })
                    }
                    placeholder="Contoh: Latihan Tari"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize="xs" letterSpacing="wide">
                    Tanggal
                  </FormLabel>
                  <Input
                    size="sm"
                    type="date"
                    min={toDateKey(today)}
                    colorScheme="blue"
                    bg="whiteAlpha.100"
                    borderColor="whiteAlpha.300"
                    borderRadius="xl"
                    sx={{
                      '::-webkit-calendar-picker-indicator': {
                        filter: 'invert(0.6)',
                      },
                    }}
                    value={form.date}
                    onChange={(event) =>
                      updateForm({ date: event.target.value })
                    }
                  />
                </FormControl>
                <Flex gap={3}>
                  <FormControl isRequired>
                    <FormLabel fontSize="xs" letterSpacing="wide">
                      Mulai
                    </FormLabel>
                    <Input
                      size="sm"
                      type="time"
                      bg="whiteAlpha.100"
                      borderColor="whiteAlpha.300"
                      borderRadius="xl"
                      sx={{
                        '::-webkit-calendar-picker-indicator': {
                          filter: 'invert(0.6)',
                        },
                      }}
                      value={form.start}
                      onChange={(event) =>
                        updateForm({ start: event.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontSize="xs" letterSpacing="wide">
                      Selesai
                    </FormLabel>
                    <Input
                      size="sm"
                      type="time"
                      bg="whiteAlpha.100"
                      borderColor="whiteAlpha.300"
                      borderRadius="xl"
                      sx={{
                        '::-webkit-calendar-picker-indicator': {
                          filter: 'invert(0.6)',
                        },
                      }}
                      value={form.end}
                      onChange={(event) =>
                        updateForm({ end: event.target.value })
                      }
                    />
                  </FormControl>
                </Flex>
                <FormControl isRequired>
                  <FormLabel fontSize="xs" letterSpacing="wide">
                    Peminjam
                  </FormLabel>
                  <Input
                    size="sm"
                    value={form.peminjam}
                    bg="whiteAlpha.100"
                    borderColor="whiteAlpha.300"
                    borderRadius="xl"
                    onChange={(event) =>
                      updateForm({ peminjam: event.target.value })
                    }
                    placeholder="Nama peminjam"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="xs" letterSpacing="wide">
                    Pengulangan
                  </FormLabel>
                  <Select
                    size="sm"
                    value={form.repeat}
                    bg="whiteAlpha.100"
                    borderColor="whiteAlpha.300"
                    borderRadius="xl"
                    onChange={(event) =>
                      changeRepeat(event.target.value as RepeatType)
                    }
                  >
                    {REPEAT_LABELS.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        style={{ color: '#111827' }}
                      >
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                {form.repeat !== 'none' && (
                  <FormControl isRequired>
                    <FormLabel fontSize="xs" letterSpacing="wide">
                      Berulang sampai
                    </FormLabel>
                    <Input
                      size="sm"
                      type="date"
                      min={form.date || undefined}
                      colorScheme="blue"
                      bg="whiteAlpha.100"
                      borderColor="whiteAlpha.300"
                      borderRadius="xl"
                      sx={{
                        '::-webkit-calendar-picker-indicator': {
                          filter: 'invert(0.6)',
                        },
                      }}
                      value={form.repeatEnd}
                      onChange={(event) =>
                        updateForm({ repeatEnd: event.target.value })
                      }
                    />
                    {formOccurrences > 1 && (
                      <Text color="blue.300" fontSize="xs" mt={1}>
                        Akan dibuat {formOccurrences} pertemuan berulang.
                      </Text>
                    )}
                  </FormControl>
                )}
                <FormControl>
                  <FormLabel fontSize="xs" letterSpacing="wide">
                    Keterangan
                  </FormLabel>
                  <Textarea
                    size="sm"
                    value={form.note}
                    bg="whiteAlpha.100"
                    borderColor="whiteAlpha.300"
                    borderRadius="xl"
                    onChange={(event) =>
                      updateForm({ note: event.target.value })
                    }
                    placeholder="Catatan kegiatan…"
                  />
                </FormControl>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button
                mr={3}
                variant="ghost"
                color="whiteAlpha.700"
                borderWidth="1px"
                borderColor="rgba(255,255,255,0.1)"
                borderRadius="full"
                _hover={{ bg: 'rgba(255,255,255,0.08)', color: 'white' }}
                onClick={createModal.onClose}
              >
                Batal
              </Button>
              <Button
                type="submit"
                color="white"
                bg="rgba(37, 99, 235, 0.25)"
                borderWidth="1px"
                borderColor="rgba(59, 130, 246, 0.5)"
                backdropFilter="blur(12px)"
                fontSize="sm"
                borderRadius="full"
                _hover={{
                  bg: 'rgba(37, 99, 235, 0.45)',
                  borderColor: 'rgba(59, 130, 246, 0.75)',
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
                }}
                _active={{ bg: 'rgba(37, 99, 235, 0.6)' }}
              >
                Simpan Jadwal
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </MenuLayout>
  );
}
