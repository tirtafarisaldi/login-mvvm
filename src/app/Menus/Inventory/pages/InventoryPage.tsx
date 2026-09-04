import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
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
  SimpleGrid,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useState, type FormEvent } from 'react';
import { useAuth } from 'service/auth';
import DataTable, {
  type Column,
} from '../../../../../components/DataTable/DataTable';
import FilterBar, {
  type FilterField,
} from '../../../../../components/DataTable/FilterBar';
import DataTablePagination from '../../../../../components/DataTable/Pagination';
import { useCreateInventoryViewModel } from '../viewModels/createInventoryViewModel';
import { useDeleteInventoryViewModel } from '../viewModels/deleteInventoryViewModel';
import { useGetInventoriesViewModel } from '../viewModels/getInventoriesViewModel';
import { useGetInventoryByIdViewModel } from '../viewModels/getInventoryByIdViewModel';
import { useUpdateInventoryViewModel } from '../viewModels/updateInventoryViewModel';
import type {
  InventoryInput,
  InventoryFilters,
  InventoryModel,
  InventoryStatus,
} from '../../../../domain/models/InventoryModel';
import { useThemeStore } from '../../store/useThemeStore';
import { useThemeColors } from '../../store/themeColors';
import { shortId } from 'utility/string';

const categories = ['Kamera', 'Audio', 'Pencahayaan', 'Aksesori', 'Properti'];
const locations = [
  'Lemari Kamera',
  'Ruang Audio',
  'Gudang Peralatan',
  'Ruang Studio',
];
const filterFields: FilterField[] = [
  { key: 'name', label: 'Cari nama barang' },
  { key: 'category', label: 'Semua kategori', options: categories },
  { key: 'location', label: 'Semua lokasi', options: locations },
  {
    key: 'status',
    label: 'Semua status',
    options: ['Tersedia', 'Dipinjam', 'Perlu Perawatan'],
  },
];
const initialFilters: InventoryFilters = { page: 1, limit: 10 };
const emptyInventory: InventoryInput = {
  name: '',
  category: '',
  stock: 0,
  location: '',
  status: 'Tersedia',
  information: '',
  image: '',
};
const STATUS_BADGE: Record<
  InventoryStatus,
  { light: string; dark: string; text: string }
> = {
  Tersedia: {
    light: '#bbf7d0',
    dark: 'rgba(34,197,94,0.16)',
    text: 'green',
  },
  Dipinjam: {
    light: '#fed7aa',
    dark: 'rgba(249,115,22,0.16)',
    text: 'orange',
  },
  'Perlu Perawatan': {
    light: '#fecaca',
    dark: 'rgba(239,68,68,0.16)',
    text: 'red',
  },
};

const statusTextColor = (
  status: InventoryStatus,
  mode: 'dark' | 'light'
): string => {
  const t = STATUS_BADGE[status].text;
  return mode === 'dark' ? `${t}.200` : `${t}.900`;
};

const badgeBg = (status: InventoryStatus, mode: 'dark' | 'light'): string =>
  mode === 'dark' ? STATUS_BADGE[status].dark : STATUS_BADGE[status].light;

const badgeBorder = (
  status: InventoryStatus,
  mode: 'dark' | 'light'
): string => {
  const t = STATUS_BADGE[status].text;
  return mode === 'dark' ? `${t}.400` : `${t}.600`;
};

const CATEGORY_BADGE: Record<
  string,
  { light: string; dark: string; text: string }
> = {
  Kamera: { light: '#bfdbfe', dark: 'rgba(59,130,246,0.16)', text: 'blue' },
  Audio: { light: '#e9d5ff', dark: 'rgba(168,85,247,0.16)', text: 'purple' },
  Pencahayaan: {
    light: '#fed7aa',
    dark: 'rgba(249,115,22,0.16)',
    text: 'orange',
  },
  Aksesori: { light: '#a5f3fc', dark: 'rgba(6,182,212,0.16)', text: 'cyan' },
  Properti: { light: '#fbcfe8', dark: 'rgba(236,72,153,0.16)', text: 'pink' },
};
const FALLBACK_CATEGORY: {
  light: string;
  dark: string;
  text: string;
} = { light: '#e2e8f0', dark: 'rgba(148,163,184,0.16)', text: 'gray' };
const categoryBadge = (category: string, mode: 'dark' | 'light') => {
  const tone = CATEGORY_BADGE[category] ?? FALLBACK_CATEGORY;
  return {
    bg: mode === 'dark' ? tone.dark : tone.light,
    color: mode === 'dark' ? `${tone.text}.200` : `${tone.text}.900`,
    borderColor: mode === 'dark' ? `${tone.text}.400` : `${tone.text}.600`,
  };
};
const toInput = (inventory: InventoryModel): InventoryInput => ({
  name: inventory.name,
  category: inventory.category,
  stock: inventory.stock,
  location: inventory.location,
  status: inventory.status,
  information: inventory.information,
  image: inventory.image,
});

export default function InventoryPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const mode = useThemeStore((state) => state.mode);
  const theme = useThemeColors();
  const inputBg = mode === 'dark' ? 'whiteAlpha.100' : 'white';
  const inputBorder = mode === 'dark' ? 'whiteAlpha.300' : 'gray.300';
  const toast = useToast();
  const formModal = useDisclosure();
  const imageModal = useDisclosure();
  const [filters, setFilters] = useState<InventoryFilters>(initialFilters);
  const {
    inventories,
    pagination,
    loading: isLoading,
    error,
  } = useGetInventoriesViewModel(filters);
  const { getInventoryById } = useGetInventoryByIdViewModel();
  const { createInventory, loading: isCreating } = useCreateInventoryViewModel({
    onSuccess: () => {
      toast({
        status: 'success',
        title: 'Inventaris ditambahkan',
        position: 'top',
      });
      formModal.onClose();
    },
    onFailure: () =>
      toast({
        status: 'error',
        title: 'Gagal menyimpan inventaris',
        position: 'top',
      }),
  });
  const { updateInventory, loading: isUpdating } = useUpdateInventoryViewModel({
    onSuccess: () => {
      toast({
        status: 'success',
        title: 'Inventaris diperbarui',
        position: 'top',
      });
      formModal.onClose();
    },
    onFailure: () =>
      toast({
        status: 'error',
        title: 'Gagal menyimpan inventaris',
        position: 'top',
      }),
  });
  const { deleteInventory, loading: isDeleting } = useDeleteInventoryViewModel({
    onSuccess: () =>
      toast({
        status: 'success',
        title: 'Inventaris dihapus',
        position: 'top',
      }),
    onFailure: () =>
      toast({
        status: 'error',
        title: 'Gagal menghapus inventaris',
        position: 'top',
      }),
  });
  const [selectedInventory, setSelectedInventory] =
    useState<InventoryModel | null>(null);
  const [previewImage, setPreviewImage] = useState<InventoryModel | null>(null);
  const [form, setForm] = useState<InventoryInput>(emptyInventory);
  const updateForm = (update: Partial<InventoryInput>) =>
    setForm({ ...form, ...update });
  const openCreate = () => {
    setSelectedInventory(null);
    setForm(emptyInventory);
    formModal.onOpen();
  };
  const openEdit = async (inventory: InventoryModel) => {
    try {
      const latest = await getInventoryById(inventory.id);
      setSelectedInventory(latest);
      setForm(toInput(latest));
    } catch {
      setSelectedInventory(inventory);
      setForm(toInput(inventory));
    }
    formModal.onOpen();
  };
  const openImage = (inventory: InventoryModel) => {
    setPreviewImage(inventory);
    imageModal.onOpen();
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
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (selectedInventory) await updateInventory(selectedInventory.id, form);
    else await createInventory(form);
  };
  const remove = async (inventory: InventoryModel) => {
    if (!window.confirm(`Hapus ${inventory.name}?`)) return;
    await deleteInventory(inventory.id);
  };

  const renderStatus = (item: InventoryModel) => (
    <Badge
      bg={badgeBg(item.status, mode)}
      color={statusTextColor(item.status, mode)}
      border="1px solid"
      borderColor={badgeBorder(item.status, mode)}
      borderRadius="full"
      px={3}
      py={1}
      fontSize="11px"
      fontWeight="bold"
    >
      {item.status}
    </Badge>
  );

  const renderCategory = (category: string) => {
    const style = categoryBadge(category, mode);
    return (
      <Badge
        bg={style.bg}
        color={style.color}
        border="1px solid"
        borderColor={style.borderColor}
        borderRadius="full"
        px={2.5}
        py={1}
        fontSize="10px"
        fontWeight="bold"
        display="inline-flex"
        alignItems="center"
        gap={1.5}
      >
        <Box
          w={1.5}
          h={1.5}
          borderRadius="full"
          bg="currentColor"
          opacity={0.7}
        />
        {category}
      </Badge>
    );
  };

  const inventoryColumns: Column<InventoryModel>[] = [
    {
      header: 'ID',
      accessor: (item) => (
        <Text color={theme.textMuted} fontWeight="semibold">
          {shortId(item.id)}
        </Text>
      ),
    },
    {
      header: 'Nama Barang',
      accessor: (item) => (
        <Text color={theme.textPrimary} fontWeight="semibold">
          {item.name}
        </Text>
      ),
    },
    {
      header: 'Kategori',
      accessor: (item) => renderCategory(item.category),
    },
    {
      header: 'Stok',
      accessor: (item) => (
        <Text color={theme.textSecondary}>{item.stock} unit</Text>
      ),
    },
    {
      header: 'Lokasi',
      accessor: (item) => (
        <Text color={theme.textSecondary}>{item.location}</Text>
      ),
    },
    {
      header: 'Status',
      accessor: (item) => renderStatus(item),
    },
    {
      header: 'Gambar',
      accessor: (item) => (
        <Button
          variant="link"
          color={mode === 'dark' ? 'blue.200' : 'blue.600'}
          fontSize="xs"
          onClick={() => openImage(item)}
          isDisabled={!item.image}
        >
          Lihat Gambar
        </Button>
      ),
    },
    {
      header: 'Aksi',
      accessor: (item) => (
        <Flex justify="flex-start" gap={1}>
          <Button
            aria-label="Ubah inventaris"
            variant="ghost"
            color={theme.textPrimary}
            _hover={{ bg: theme.hoverBg }}
            fontSize="xs"
            onClick={() => openEdit(item)}
          >
            <EditIcon />
          </Button>
          <Button
            aria-label="Hapus inventaris"
            variant="ghost"
            color={mode === 'dark' ? 'red.200' : 'red.600'}
            _hover={{ bg: 'red.500' }}
            fontSize="xs"
            isLoading={isDeleting}
            onClick={() => remove(item)}
          >
            <DeleteIcon />
          </Button>
        </Flex>
      ),
    },
  ];

  return (
    <Box>
      <>
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
              Daftar Peralatan
            </Heading>
            <Text color={theme.textSecondary} mt={2} fontSize="sm">
              Kelola aset Laboratorium Studio Pertunjukan dalam satu ruang
              kerja.
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
              onClick={openCreate}
            >
              Tambah Peralatan
            </Button>
          )}
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
          data={inventories}
          columns={inventoryColumns}
          loading={isLoading}
          keyExtractor={(item) => item.id}
          renderMobileCard={(item) => (
            <>
              <Flex align="start" justify="space-between" gap={3}>
                <Box minW={0}>
                  <Text
                    color={theme.textPrimary}
                    fontWeight="semibold"
                    noOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text color={theme.textMuted} fontSize="xs" mt={0.5}>
                    ID {shortId(item.id)} · {item.category}
                  </Text>
                </Box>
                {renderStatus(item)}
              </Flex>
              <Flex
                mt={3}
                gap={4}
                fontSize="xs"
                color={theme.textSecondary}
                wrap="wrap"
              >
                <Text>
                  Stok:{' '}
                  <Text as="span" color={theme.textPrimary}>
                    {item.stock} unit
                  </Text>
                </Text>
                <Text>
                  Lokasi:{' '}
                  <Text as="span" color={theme.textPrimary}>
                    {item.location}
                  </Text>
                </Text>
              </Flex>
              <Flex mt={3} align="center" gap={2}>
                <Button
                  variant="link"
                  color={mode === 'dark' ? 'blue.200' : 'blue.600'}
                  size="sm"
                  onClick={() => openImage(item)}
                  isDisabled={!item.image}
                >
                  Lihat Gambar
                </Button>
                <Box flex="1" />
                <Button
                  aria-label="Ubah inventaris"
                  variant="ghost"
                  color={theme.textPrimary}
                  _hover={{ bg: theme.hoverBg }}
                  size="sm"
                  onClick={() => openEdit(item)}
                >
                  <EditIcon />
                </Button>
                <Button
                  aria-label="Hapus inventaris"
                  variant="ghost"
                  color={mode === 'dark' ? 'red.200' : 'red.600'}
                  _hover={{ bg: 'red.500' }}
                  size="sm"
                  isLoading={isDeleting}
                  onClick={() => remove(item)}
                >
                  <DeleteIcon />
                </Button>
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
        <Modal
          isOpen={formModal.isOpen}
          onClose={formModal.onClose}
          size="xl"
          motionPreset="none"
        >
          <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.700" />
          <ModalContent
            as="form"
            onSubmit={submit}
            bg={
              mode === 'dark' ? 'rgba(8,10,14,0.85)' : 'rgba(255,255,255,0.97)'
            }
            backdropFilter="blur(20px)"
            color={theme.textPrimary}
            borderWidth="1px"
            borderColor={theme.panelBorder}
            boxShadow="0 24px 80px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,0.08)"
          >
            <ModalHeader fontSize="lg">
              {selectedInventory ? 'Ubah Inventaris' : 'Tambah Inventaris'}
            </ModalHeader>
            <ModalBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                <FormControl isRequired>
                  <FormLabel fontSize="xs" letterSpacing="wide">
                    Nama Barang
                  </FormLabel>
                  <Input
                    size="sm"
                    value={form.name}
                    bg={inputBg}
                    borderColor={inputBorder}
                    borderRadius="xl"
                    onChange={(event) =>
                      updateForm({ name: event.target.value })
                    }
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize="xs" letterSpacing="wide">
                    Kategori
                  </FormLabel>
                  <Select
                    size="sm"
                    placeholder="Pilih kategori"
                    value={form.category}
                    bg={inputBg}
                    borderColor={inputBorder}
                    borderRadius="xl"
                    onChange={(event) =>
                      updateForm({ category: event.target.value })
                    }
                  >
                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                        style={{ color: '#111827' }}
                      >
                        {category}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize="xs" letterSpacing="wide">
                    Stok
                  </FormLabel>
                  <NumberInput
                    size="sm"
                    value={form.stock}
                    min={0}
                    clampValueOnBlur={false}
                    onChange={(_, num) => {
                      if (Number.isInteger(num)) updateForm({ stock: num });
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
                          mode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.50'
                        }
                      />
                      <NumberDecrementStepper
                        _active={{ bg: 'blue.100' }}
                        bg={
                          mode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.50'
                        }
                      />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize="xs" letterSpacing="wide">
                    Lokasi
                  </FormLabel>
                  <Select
                    size="sm"
                    placeholder="Pilih lokasi"
                    value={form.location}
                    bg={inputBg}
                    borderColor={inputBorder}
                    borderRadius="xl"
                    onChange={(event) =>
                      updateForm({ location: event.target.value })
                    }
                  >
                    {locations.map((location) => (
                      <option
                        key={location}
                        value={location}
                        style={{ color: '#111827' }}
                      >
                        {location}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize="xs" letterSpacing="wide">
                    Status
                  </FormLabel>
                  <Select
                    size="sm"
                    value={form.status}
                    bg={inputBg}
                    borderColor={inputBorder}
                    borderRadius="xl"
                    onChange={(event) =>
                      updateForm({
                        status: event.target.value as InventoryStatus,
                      })
                    }
                  >
                    <option value="Tersedia" style={{ color: '#111827' }}>
                      Tersedia
                    </option>
                    <option value="Dipinjam" style={{ color: '#111827' }}>
                      Dipinjam
                    </option>
                    <option
                      value="Perlu Perawatan"
                      style={{ color: '#111827' }}
                    >
                      Perlu Perawatan
                    </option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize="xs" letterSpacing="wide">
                    Link / Path Gambar
                  </FormLabel>
                  <Input
                    size="sm"
                    type="url"
                    placeholder="https://... atau /img/barang.jpg"
                    value={form.image}
                    bg={inputBg}
                    borderColor={inputBorder}
                    borderRadius="xl"
                    onChange={(event) =>
                      updateForm({ image: event.target.value })
                    }
                  />
                </FormControl>
              </SimpleGrid>
              <FormControl mt={3}>
                <FormLabel fontSize="xs" letterSpacing="wide">
                  Informasi
                </FormLabel>
                <Textarea
                  size="sm"
                  value={form.information}
                  bg={inputBg}
                  borderColor={inputBorder}
                  borderRadius="xl"
                  onChange={(event) =>
                    updateForm({ information: event.target.value })
                  }
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                mr={3}
                variant="ghost"
                color={theme.textSecondary}
                borderWidth="1px"
                borderColor={theme.panelBorder}
                borderRadius="full"
                _hover={{ bg: theme.hoverBg, color: theme.textPrimary }}
                onClick={formModal.onClose}
              >
                Batal
              </Button>
              <Button
                type="submit"
                color="white"
                bg={mode === 'dark' ? 'rgba(37, 99, 235, 0.25)' : 'blue.600'}
                borderWidth="1px"
                borderColor={
                  mode === 'dark' ? 'rgba(59, 130, 246, 0.5)' : 'blue.600'
                }
                backdropFilter="blur(12px)"
                fontSize="sm"
                borderRadius="full"
                _hover={{
                  bg: mode === 'dark' ? 'rgba(37, 99, 235, 0.45)' : 'blue.700',
                  borderColor:
                    mode === 'dark' ? 'rgba(59, 130, 246, 0.75)' : 'blue.700',
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
                }}
                _active={{ bg: 'rgba(37, 99, 235, 0.6)' }}
                isLoading={isCreating || isUpdating}
              >
                Simpan
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal
          isOpen={imageModal.isOpen}
          onClose={imageModal.onClose}
          size="2xl"
          motionPreset="none"
        >
          <ModalOverlay backdropFilter="blur(8px)" bg="blackAlpha.700" />
          <ModalContent
            bg={
              mode === 'dark' ? 'rgba(8,10,14,0.85)' : 'rgba(255,255,255,0.97)'
            }
            backdropFilter="blur(16px)"
            color={theme.textPrimary}
            overflow="hidden"
            borderWidth="1px"
            borderColor={theme.panelBorder}
            boxShadow="0 24px 80px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,0.08)"
          >
            <ModalHeader fontSize="lg">{previewImage?.name}</ModalHeader>
            <ModalBody pb={6}>
              {previewImage?.image && (
                <Image
                  src={previewImage.image}
                  alt={previewImage.name}
                  w="full"
                  maxH="70vh"
                  objectFit="contain"
                  borderRadius="xl"
                />
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    </Box>
  );
}
