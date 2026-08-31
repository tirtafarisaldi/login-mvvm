import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { toDateKey } from 'components/Calendar';
import DatePickerField from '../../../../../components/Pickers/DatePickerField';
import TimePickerField from '../../../../../components/Pickers/TimePickerField';
import { useEffect, useState } from 'react';

export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly';

export const REPEAT_LABELS: Array<{ value: RepeatType; label: string }> = [
  { value: 'none', label: 'Tidak berulang' },
  { value: 'daily', label: 'Setiap hari' },
  { value: 'weekly', label: 'Setiap minggu' },
  { value: 'monthly', label: 'Setiap bulan' },
];

export interface CreateForm {
  title: string;
  date: string;
  start: string;
  end: string;
  peminjam: string;
  repeat: RepeatType;
  repeatEnd: string;
  note: string;
}

export interface ScheduleDraft {
  title: string;
  start_time: string;
  end_time: string;
  peminjam: string;
  note?: string;
}

export type ScheduleFormSubmitPayload =
  | { kind: 'create'; dates: Date[]; repeat: RepeatType; draft: ScheduleDraft }
  | { kind: 'edit'; date: string; draft: ScheduleDraft };

interface ScheduleFormModalProps {
  mode: 'create' | 'edit';
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  initialValues?: CreateForm;
  onSubmit: (payload: ScheduleFormSubmitPayload) => void | Promise<void>;
}

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

export default function ScheduleFormModal({
  mode,
  isOpen,
  onClose,
  loading,
  initialValues,
  onSubmit,
}: ScheduleFormModalProps) {
  const toast = useToast();
  const [form, setForm] = useState<CreateForm>(emptyForm);

  useEffect(() => {
    if (isOpen) {
      setForm(mode === 'edit' && initialValues ? initialValues : emptyForm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, mode]);

  const updateForm = (update: Partial<CreateForm>): void =>
    setForm((current) => ({ ...current, ...update }));

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

  const occurrences = buildRecurringDates(form).length;
  const today = new Date();

  const submit = (): void => {
    if (!form.title.trim() || !form.date) {
      toast({
        status: 'warning',
        title: 'Form belum lengkap',
        description: 'Lengkapi nama kegiatan dan tanggal terlebih dahulu.',
        position: 'top',
      });
      return;
    }
    const draft: ScheduleDraft = {
      title: form.title.trim(),
      start_time: form.start,
      end_time: form.end,
      peminjam: form.peminjam.trim() || 'Saya',
      ...(form.note.trim() ? { note: form.note.trim() } : {}),
    };
    if (mode === 'edit') {
      onSubmit({ kind: 'edit', date: form.date, draft });
      return;
    }
    const dates = buildRecurringDates(form);
    if (dates.length === 0) {
      toast({
        status: 'warning',
        title: 'Tidak ada jadwal yang dibuat',
        description: 'Periksa tanggal dan rentang pengulangan.',
        position: 'top',
      });
      return;
    }
    onSubmit({ kind: 'create', dates, repeat: form.repeat, draft });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" motionPreset="none">
      <ModalOverlay backdropFilter="blur(8px)" bg="blackAlpha.700" />
      <ModalContent
        as="form"
        onSubmit={(event: React.FormEvent) => {
          event.preventDefault();
          submit();
        }}
        bg="rgba(8,10,14,0.85)"
        backdropFilter="blur(16px)"
        color="white"
        borderWidth="1px"
        borderColor="rgba(255,255,255,0.2)"
        boxShadow="0 24px 80px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,0.08)"
      >
        <ModalHeader fontSize="lg">
          {mode === 'create' ? 'Tambah Jadwal' : 'Ubah Jadwal'}
        </ModalHeader>
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
                onChange={(event) => updateForm({ title: event.target.value })}
                placeholder="Contoh: Latihan Tari"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontSize="xs" letterSpacing="wide">
                Tanggal
              </FormLabel>
              <DatePickerField
                value={form.date}
                onChange={(date) => updateForm({ date })}
                min={mode === 'create' ? toDateKey(today) : undefined}
              />
            </FormControl>
            <Flex gap={3} direction={{ base: 'column', sm: 'row' }}>
              <FormControl isRequired>
                <FormLabel fontSize="xs" letterSpacing="wide">
                  Mulai
                </FormLabel>
                <TimePickerField
                  value={form.start}
                  onChange={(start) => updateForm({ start })}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="xs" letterSpacing="wide">
                  Selesai
                </FormLabel>
                <TimePickerField
                  value={form.end}
                  onChange={(end) => updateForm({ end })}
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
            {mode === 'create' && (
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
            )}
            {mode === 'create' && form.repeat !== 'none' && (
              <FormControl isRequired>
                <FormLabel fontSize="xs" letterSpacing="wide">
                  Berulang sampai
                </FormLabel>
                <DatePickerField
                  value={form.repeatEnd}
                  onChange={(repeatEnd) => updateForm({ repeatEnd })}
                  min={form.date || undefined}
                />
                {occurrences > 1 && (
                  <Text color="blue.300" fontSize="xs" mt={1}>
                    Akan dibuat {occurrences} pertemuan berulang.
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
                onChange={(event) => updateForm({ note: event.target.value })}
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
            onClick={onClose}
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
            isLoading={loading}
          >
            {mode === 'create' ? 'Simpan Jadwal' : 'Simpan Perubahan'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
