import {
  AddIcon,
  AttachmentIcon,
  CloseIcon,
  DeleteIcon,
} from '@chakra-ui/icons';
import {
  Box,
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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Stack,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { toDateKey } from 'components/Calendar';
import DatePickerField from '../../../../../components/Pickers/DatePickerField';
import TimePickerField from '../../../../../components/Pickers/TimePickerField';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from 'service/auth';
import { useThemeStore } from '../../store/useThemeStore';
import { useThemeColors } from '../../store/themeColors';
import { useGetInventoriesViewModel } from '../../Inventory/viewModels/getInventoriesViewModel';
import type {
  BookingItemInput,
  BookingRepeat,
  BookingType,
} from '../../../../domain/models/BookingModel';

export interface BookingFormValues {
  borrower: string;
  type: BookingType;
  letter_file: string;
  letterFile?: File | null;
  title: string;
  items: BookingItemInput[];
  date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  repeat: BookingRepeat;
  repeat_end: string;
  note: string;
}

interface BookingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  onSubmit: (values: BookingFormValues) => void | Promise<void>;
  isAdmin: boolean;
}

export const TYPE_LABELS: Record<BookingType, string> = {
  equipment: 'Peralatan',
  room: 'Ruangan',
};

export const STATUS_LABELS: Record<string, string> = {
  process: 'Process',
  approved: 'Approved',
  rejected: 'Rejected',
  completed: 'Completed',
};

export const REPEAT_LABELS: Array<{ value: BookingRepeat; label: string }> = [
  { value: 'none', label: 'Tidak berulang' },
  { value: 'daily', label: 'Setiap hari' },
  { value: 'weekly', label: 'Setiap minggu' },
  { value: 'monthly', label: 'Setiap bulan' },
];

const emptyValues = (): BookingFormValues => ({
  borrower: '',
  type: 'equipment',
  letter_file: '',
  letterFile: null,
  title: '',
  items: [],
  date: toDateKey(new Date()),
  end_date: toDateKey(new Date()),
  start_time: '08:00',
  end_time: '10:00',
  repeat: 'none',
  repeat_end: '',
  note: '',
});

export default function BookingFormModal({
  isOpen,
  onClose,
  loading,
  onSubmit,
  isAdmin,
}: BookingFormModalProps) {
  const toast = useToast();
  const themeMode = useThemeStore((state) => state.mode);
  const theme = useThemeColors();
  const { user } = useAuth();
  const inputBg = themeMode === 'dark' ? 'whiteAlpha.100' : 'white';
  const inputBorder = themeMode === 'dark' ? 'whiteAlpha.300' : 'gray.300';
  const [values, setValues] = useState<BookingFormValues>(() => ({
    ...emptyValues(),
    borrower: user?.name ?? '',
  }));

  const { inventories: equipmentList, loading: equipmentLoading } =
    useGetInventoriesViewModel({ page: 1, limit: 100 });

  const availableEquipment = useMemo(
    () => equipmentList.filter((item) => item.status === 'Tersedia'),
    [equipmentList]
  );

  useEffect(() => {
    if (isOpen) setValues({ ...emptyValues(), borrower: user?.name ?? '' });
  }, [isOpen, user]);

  const update = (patch: Partial<BookingFormValues>): void =>
    setValues((current) => ({ ...current, ...patch }));

  const changeType = (type: BookingType): void => {
    setValues((current) => ({
      ...current,
      type,
      items: type === 'room' ? [] : current.items,
    }));
  };

  const changeRepeat = (repeat: BookingRepeat): void => {
    setValues((current) => {
      const next = { ...current, repeat };
      if (repeat === 'none') next.repeat_end = '';
      else if (!next.repeat_end) {
        const [year, month] = current.date.split('-').map(Number);
        if (year && month) {
          next.repeat_end = toDateKey(new Date(year, month, 0));
        }
      }
      return next;
    });
  };

  const occurrences = useMemo(() => {
    if (values.repeat === 'none' || !values.date) return 1;
    const start = new Date(`${values.date}T00:00:00`);
    const end = values.repeat_end
      ? new Date(`${values.repeat_end}T00:00:00`)
      : start;
    if (start > end) return 1;
    let count = 0;
    const cursor = new Date(start);
    let guard = 0;
    while (cursor <= end && guard < 500) {
      count += 1;
      if (values.repeat === 'daily') {
        cursor.setDate(cursor.getDate() + 1);
      } else if (values.repeat === 'weekly') {
        cursor.setDate(cursor.getDate() + 7);
      } else if (values.repeat === 'monthly') {
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
    return count;
  }, [values.repeat, values.date, values.repeat_end]);

  const handleFile = useCallback(
    (file: File | undefined): void => {
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) {
        toast({
          status: 'warning',
          title: 'File terlalu besar',
          description: 'Ukuran surat maksimal 2 MB.',
          position: 'top',
        });
        return;
      }
      update({ letter_file: file.name, letterFile: file });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const submit = (): void => {
    if (!values.borrower.trim() || !values.date) {
      toast({
        status: 'warning',
        title: 'Form belum lengkap',
        description: 'Lengkapi nama peminjam dan tanggal booking.',
        position: 'top',
      });
      return;
    }
    if (values.type === 'equipment' && values.items.length === 0) {
      toast({
        status: 'warning',
        title: 'Pilih peralatan',
        description: 'Pilih minimal satu peralatan yang akan dipinjam.',
        position: 'top',
      });
      return;
    }
    if (values.type === 'equipment' && !values.end_date) {
      toast({
        status: 'warning',
        title: 'Tanggal selesai belum diisi',
        description: 'Lengkapi tanggal selesai booking peralatan.',
        position: 'top',
      });
      return;
    }
    if (values.type === 'room' && (!values.start_time || !values.end_time)) {
      toast({
        status: 'warning',
        title: 'Waktu belum lengkap',
        description: 'Isi waktu mulai dan selesai booking ruangan.',
        position: 'top',
      });
      return;
    }
    if (
      values.type === 'room' &&
      values.repeat !== 'none' &&
      !values.repeat_end
    ) {
      toast({
        status: 'warning',
        title: 'Tanggal berakhir pengulangan belum diisi',
        description: 'Lengkapi tanggal sampai booking berulang.',
        position: 'top',
      });
      return;
    }
    void onSubmit(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" motionPreset="none">
      <ModalOverlay backdropFilter="blur(8px)" bg="blackAlpha.700" />
      <ModalContent
        as="form"
        noValidate
        onSubmit={(event: React.FormEvent) => {
          event.preventDefault();
          submit();
        }}
        bg={
          themeMode === 'dark' ? 'rgba(8,10,14,0.85)' : 'rgba(255,255,255,0.97)'
        }
        backdropFilter="blur(16px)"
        color={theme.textPrimary}
        borderWidth="1px"
        borderColor={theme.panelBorder}
        boxShadow="0 24px 80px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,0.08)"
      >
        <ModalHeader fontSize="lg">
          {isAdmin ? 'Tambah Peminjaman' : 'Ajukan Peminjaman'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel fontSize="xs" letterSpacing="wide">
                Nama Peminjam
              </FormLabel>
              <Input
                size="sm"
                value={isAdmin ? 'Admin' : values.borrower}
                bg={inputBg}
                borderColor={inputBorder}
                borderRadius="xl"
                isReadOnly
                cursor="default"
                placeholder="Nama peminjam"
                isDisabled={isAdmin}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="xs" letterSpacing="wide">
                Jenis
              </FormLabel>
              <Select
                size="sm"
                value={values.type}
                bg={inputBg}
                borderColor={inputBorder}
                borderRadius="xl"
                onChange={(event) =>
                  changeType(event.target.value as BookingType)
                }
              >
                <option value="equipment" style={{ color: '#111827' }}>
                  Peralatan
                </option>
                <option value="room" style={{ color: '#111827' }}>
                  Ruangan
                </option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="xs" letterSpacing="wide">
                Judul Peminjaman
              </FormLabel>
              <Textarea
                size="sm"
                value={values.title}
                bg={inputBg}
                borderColor={inputBorder}
                borderRadius="xl"
                onChange={(event) => update({ title: event.target.value })}
                placeholder="Contoh: Pentas seni akhir tahun…"
                rows={2}
              />
            </FormControl>

            {values.type === 'equipment' && (
              <EquipmentSelect
                availableEquipment={availableEquipment}
                loading={equipmentLoading}
                selectedItems={values.items}
                onChange={(items) => update({ items })}
                inputBg={inputBg}
                inputBorder={inputBorder}
              />
            )}

            {values.type === 'equipment' ? (
              <Flex gap={3} direction={{ base: 'column', sm: 'row' }}>
                <FormControl isRequired>
                  <FormLabel fontSize="xs" letterSpacing="wide">
                    Tanggal Peminjaman
                  </FormLabel>
                  <DatePickerField
                    value={values.date}
                    onChange={(date) => update({ date })}
                    min={toDateKey(new Date())}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize="xs" letterSpacing="wide">
                    Tanggal Selesai
                  </FormLabel>
                  <DatePickerField
                    value={values.end_date}
                    onChange={(end_date) => update({ end_date })}
                    min={values.date || toDateKey(new Date())}
                  />
                </FormControl>
              </Flex>
            ) : (
              <>
                <FormControl isRequired>
                  <FormLabel fontSize="xs" letterSpacing="wide">
                    Tanggal Peminjaman
                  </FormLabel>
                  <DatePickerField
                    value={values.date}
                    onChange={(date) => update({ date })}
                    min={toDateKey(new Date())}
                  />
                </FormControl>

                <Flex gap={3} direction={{ base: 'column', sm: 'row' }}>
                  <FormControl isRequired>
                    <FormLabel fontSize="xs" letterSpacing="wide">
                      Waktu Mulai
                    </FormLabel>
                    <TimePickerField
                      value={values.start_time}
                      onChange={(start_time) => update({ start_time })}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontSize="xs" letterSpacing="wide">
                      Waktu Selesai
                    </FormLabel>
                    <TimePickerField
                      value={values.end_time}
                      onChange={(end_time) => update({ end_time })}
                    />
                  </FormControl>
                </Flex>

                <FormControl>
                  <FormLabel fontSize="xs" letterSpacing="wide">
                    Pengulangan
                  </FormLabel>
                  <Select
                    size="sm"
                    value={values.repeat}
                    bg={inputBg}
                    borderColor={inputBorder}
                    borderRadius="xl"
                    onChange={(event) =>
                      changeRepeat(event.target.value as BookingRepeat)
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

                {values.repeat !== 'none' && (
                  <FormControl isRequired>
                    <FormLabel fontSize="xs" letterSpacing="wide">
                      Berulang sampai
                    </FormLabel>
                    <DatePickerField
                      value={values.repeat_end}
                      onChange={(repeat_end) => update({ repeat_end })}
                      min={values.date || undefined}
                    />
                    {occurrences > 1 && (
                      <Text color="blue.300" fontSize="xs" mt={1}>
                        Akan dibuat {occurrences} pertemuan berulang.
                      </Text>
                    )}
                  </FormControl>
                )}
              </>
            )}

            <FormControl>
              <FormLabel fontSize="xs" letterSpacing="wide">
                Surat Booking
              </FormLabel>
              <FileDropzone
                fileName={values.letter_file}
                onFile={handleFile}
                onClear={() => update({ letter_file: '', letterFile: null })}
                inputBg={inputBg}
                inputBorder={inputBorder}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="xs" letterSpacing="wide">
                Keterangan
              </FormLabel>
              <Textarea
                size="sm"
                value={values.note}
                bg={inputBg}
                borderColor={inputBorder}
                borderRadius="xl"
                onChange={(event) => update({ note: event.target.value })}
                placeholder="Catatan booking…"
              />
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            mr={3}
            variant="ghost"
            color={theme.textSecondary}
            borderWidth="1px"
            borderColor={theme.panelBorder}
            borderRadius="full"
            _hover={{
              bg: themeMode === 'dark' ? 'whiteAlpha.200' : 'blackAlpha.100',
              color: theme.textPrimary,
            }}
            onClick={onClose}
          >
            Batal
          </Button>
          <Button
            type="submit"
            color="white"
            bg={themeMode === 'dark' ? 'rgba(37, 99, 235, 0.25)' : 'blue.600'}
            borderWidth="1px"
            borderColor={
              themeMode === 'dark' ? 'rgba(59, 130, 246, 0.5)' : 'blue.600'
            }
            backdropFilter="blur(12px)"
            fontSize="sm"
            borderRadius="full"
            leftIcon={<AttachmentIcon />}
            _hover={{
              bg: themeMode === 'dark' ? 'rgba(37, 99, 235, 0.45)' : 'blue.700',
              borderColor:
                themeMode === 'dark' ? 'rgba(59, 130, 246, 0.75)' : 'blue.700',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
            }}
            _active={{ bg: 'rgba(37, 99, 235, 0.6)' }}
            isLoading={loading}
          >
            {isAdmin ? 'Tambah Peminjaman' : 'Ajukan Peminjaman'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

/* ── Equipment multi-select with search ─────────────────────── */

interface InventoryOption {
  id: string;
  name: string;
  stock: number;
}

interface EquipmentSelectProps {
  availableEquipment: InventoryOption[];
  loading: boolean;
  selectedItems: BookingItemInput[];
  onChange: (items: BookingItemInput[]) => void;
  inputBg: string;
  inputBorder: string;
}

function EquipmentSelect({
  availableEquipment,
  loading,
  selectedItems,
  onChange,
  inputBg,
  inputBorder,
}: EquipmentSelectProps) {
  const themeMode = useThemeStore((state) => state.mode);
  const theme = useThemeColors();
  const toast = useToast();
  const [selectedId, setSelectedId] = useState('');
  const [qty, setQty] = useState('1');
  const qtyNum = Number(qty) || 0;

  const addedIds = useMemo(
    () => new Set(selectedItems.map((it) => it.inventory_id)),
    [selectedItems]
  );

  const options = availableEquipment.filter((it) => !addedIds.has(it.id));
  const selectedStock =
    availableEquipment.find((e) => e.id === selectedId)?.stock ?? 1;

  const addItem = () => {
    if (!selectedId) {
      toast({
        status: 'warning',
        title: 'Pilih peralatan',
        description: 'Pilih peralatan yang akan dipinjam.',
        position: 'top',
      });
      return;
    }
    if (!Number.isInteger(qtyNum) || qtyNum < 1) {
      toast({
        status: 'warning',
        title: 'Jumlah tidak valid',
        description: 'Jumlah minimal 1.',
        position: 'top',
      });
      return;
    }
    const safeQty = Math.min(qtyNum, selectedStock);
    onChange([
      ...selectedItems,
      { inventory_id: selectedId, quantity: safeQty },
    ]);
    setSelectedId('');
    setQty('1');
  };

  const removeItem = (id: string) =>
    onChange(selectedItems.filter((it) => it.inventory_id !== id));

  const changeListQty = (id: string, value: number) =>
    onChange(
      selectedItems.map((it) =>
        it.inventory_id === id ? { ...it, quantity: value } : it
      )
    );

  return (
    <FormControl>
      <Flex gap={3} direction={{ base: 'column', sm: 'row' }} align="flex-end">
        <FormControl isRequired>
          <FormLabel fontSize="xs">Peralatan</FormLabel>
          <Select
            size="sm"
            value={selectedId}
            bg={inputBg}
            borderColor={inputBorder}
            borderRadius="xl"
            isDisabled={loading}
            placeholder={loading ? 'Memuat…' : 'Pilih peralatan'}
            onChange={(e) => {
              setSelectedId(e.target.value);
              setQty('1');
            }}
          >
            {options.map((item) => (
              <option
                key={item.id}
                value={item.id}
                style={{ color: '#111827' }}
              >
                {item.name} (stok: {item.stock})
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl w={{ base: 'full', sm: '120px' }} isRequired>
          <FormLabel fontSize="xs">Jumlah</FormLabel>
          <NumberInput
            size="sm"
            value={qty}
            clampValueOnBlur={false}
            onChange={setQty}
            bg={inputBg}
            borderColor={inputBorder}
            borderRadius="xl"
            focusBorderColor="blue.400"
          >
            <NumberInputField
              bg={inputBg}
              borderRadius="xl"
              _hover={{ borderColor: 'blue.300' }}
            />
            <NumberInputStepper>
              <NumberIncrementStepper
                _active={{ bg: 'blue.100' }}
                bg={themeMode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.50'}
              />
              <NumberDecrementStepper
                _active={{ bg: 'blue.100' }}
                bg={themeMode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.50'}
              />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <Button
          size="sm"
          px={4}
          color="white"
          bg={themeMode === 'dark' ? 'rgba(37, 99, 235, 0.35)' : 'blue.600'}
          borderWidth="1px"
          borderColor={
            themeMode === 'dark' ? 'rgba(96, 165, 250, 0.6)' : 'blue.600'
          }
          backdropFilter="blur(8px)"
          borderRadius="full"
          boxShadow={
            themeMode === 'dark'
              ? '0 0 12px rgba(59, 130, 246, 0.25)'
              : '0 2px 8px rgba(37, 99, 235, 0.35)'
          }
          fontWeight="semibold"
          leftIcon={<AddIcon boxSize={3} />}
          isDisabled={!selectedId || loading}
          _hover={{
            bg: themeMode === 'dark' ? 'rgba(59, 130, 246, 0.6)' : 'blue.700',
            borderColor:
              themeMode === 'dark' ? 'rgba(147, 197, 253, 0.8)' : 'blue.700',
            boxShadow:
              themeMode === 'dark'
                ? '0 0 18px rgba(59, 130, 246, 0.4)'
                : '0 4px 14px rgba(37, 99, 235, 0.45)',
          }}
          _active={{
            bg: themeMode === 'dark' ? 'rgba(37, 99, 235, 0.5)' : 'blue.800',
          }}
          _disabled={{
            opacity: 0.4,
            cursor: 'not-allowed',
            boxShadow: 'none',
          }}
          onClick={addItem}
        >
          Add
        </Button>
      </Flex>

      {selectedItems.length > 0 && (
        <Stack spacing={1} mt={3}>
          <Flex
            justify="space-between"
            px={1}
            fontSize="10px"
            color={theme.textMuted}
            letterSpacing="wide"
          >
            <Text>Peralatan dipilih</Text>
            <Text>Jumlah</Text>
          </Flex>
          <Box maxH="170px" overflowY="auto">
            <Stack spacing={1}>
              {selectedItems.map((sel) => {
                const eq = availableEquipment.find(
                  (e) => e.id === sel.inventory_id
                );
                return (
                  <Flex
                    key={sel.inventory_id}
                    align="center"
                    gap={2}
                    px={2}
                    py={1}
                    bg={
                      themeMode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.50'
                    }
                    borderRadius="xl"
                  >
                    <Text
                      fontSize="xs"
                      fontWeight="medium"
                      flex={1}
                      noOfLines={1}
                    >
                      {eq?.name ?? sel.inventory_id}
                    </Text>
                    <NumberInput
                      size="xs"
                      w="64px"
                      value={sel.quantity}
                      min={1}
                      max={eq?.stock ?? 1}
                      clampValueOnBlur={false}
                      onChange={(_, num) => {
                        if (Number.isInteger(num))
                          changeListQty(sel.inventory_id, num);
                      }}
                      bg={inputBg}
                      borderColor={inputBorder}
                      borderRadius="xl"
                      focusBorderColor="blue.400"
                    >
                      <NumberInputField
                        bg={inputBg}
                        borderRadius="xl"
                        _hover={{ borderColor: 'blue.300' }}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper
                          _active={{ bg: 'blue.100' }}
                          bg={
                            themeMode === 'dark'
                              ? 'whiteAlpha.100'
                              : 'blackAlpha.50'
                          }
                        />
                        <NumberDecrementStepper
                          _active={{ bg: 'blue.100' }}
                          bg={
                            themeMode === 'dark'
                              ? 'whiteAlpha.100'
                              : 'blackAlpha.50'
                          }
                        />
                      </NumberInputStepper>
                    </NumberInput>
                    <Button
                      size="xs"
                      variant="ghost"
                      color={themeMode === 'dark' ? 'red.200' : 'red.500'}
                      aria-label="Hapus peralatan"
                      _hover={{
                        bg:
                          themeMode === 'dark'
                            ? 'rgba(239,68,68,0.2)'
                            : 'red.50',
                        color: themeMode === 'dark' ? 'red.300' : 'red.600',
                      }}
                      onClick={() => removeItem(sel.inventory_id)}
                    >
                      <DeleteIcon />
                    </Button>
                  </Flex>
                );
              })}
            </Stack>
          </Box>
        </Stack>
      )}
    </FormControl>
  );
}
/* ── Modern drag-drop file upload ──────────────────────────── */

interface FileDropzoneProps {
  fileName: string;
  onFile: (file: File) => void;
  onClear: () => void;
  inputBg: string;
  inputBorder: string;
}

function FileDropzone({
  fileName,
  onFile,
  onClear,
  inputBg,
  inputBorder,
}: FileDropzoneProps) {
  const themeMode = useThemeStore((state) => state.mode);
  const theme = useThemeColors();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) onFile(file);
    },
    [onFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragging(false), []);

  if (fileName) {
    return (
      <Flex
        align="center"
        gap={3}
        p={3}
        bg={themeMode === 'dark' ? 'rgba(59,130,246,0.08)' : 'blue.50'}
        borderWidth="1px"
        borderColor={themeMode === 'dark' ? 'rgba(59,130,246,0.3)' : 'blue.200'}
        borderRadius="xl"
      >
        <AttachmentIcon color="blue.400" boxSize={4} />
        <Text fontSize="sm" flex={1} noOfLines={1} color={theme.textPrimary}>
          {fileName}
        </Text>
        <Button
          size="xs"
          variant="ghost"
          color={themeMode === 'dark' ? 'red.200' : 'red.500'}
          _hover={{ bg: 'rgba(239,68,68,0.12)' }}
          borderRadius="full"
          onClick={onClear}
          leftIcon={<CloseIcon boxSize={2.5} />}
        >
          Hapus
        </Button>
      </Flex>
    );
  }

  return (
    <Box
      borderWidth="2px"
      borderStyle="dashed"
      borderColor={dragging ? 'blue.400' : inputBorder}
      bg={
        dragging
          ? themeMode === 'dark'
            ? 'rgba(59,130,246,0.08)'
            : 'blue.50'
          : inputBg
      }
      borderRadius="xl"
      p={6}
      textAlign="center"
      cursor="pointer"
      transition="all 0.15s"
      _hover={{
        borderColor: 'blue.400',
        bg: themeMode === 'dark' ? 'rgba(59,130,246,0.06)' : 'blue.50',
      }}
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = '';
        }}
      />
      <AttachmentIcon
        boxSize={5}
        color={dragging ? 'blue.400' : theme.textMuted}
        mb={2}
      />
      <Text fontSize="sm" fontWeight="medium" color={theme.textPrimary}>
        Klik atau seret file ke sini
      </Text>
      <Text fontSize="xs" color={theme.textMuted} mt={1}>
        PDF (maks. 2 MB)
      </Text>
    </Box>
  );
}
