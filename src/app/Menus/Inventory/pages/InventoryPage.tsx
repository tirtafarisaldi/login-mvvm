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
  Select,
  SimpleGrid,
  Spinner,
  Stack,
  Table,
  Tbody,
  Text,
  Textarea,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useState, type FormEvent } from 'react';
import { useAuth } from 'service/auth';
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
const statusColor = {
  Tersedia: 'green',
  Dipinjam: 'orange',
  'Perlu Perawatan': 'red',
} as const;
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
              size={{ base: 'xl', md: '2xl' }}
              color="white"
              letterSpacing="tight"
            >
              Daftar Peralatan
            </Heading>
            <Text color="whiteAlpha.700" mt={2} fontSize="sm">
              Kelola aset Laboratorium Studio Pertunjukan dalam satu ruang
              kerja.
            </Text>
          </Box>
          {isAdmin && (
            <Button
              color="white"
              bg="rgba(37, 99, 235, 0.25)"
              borderWidth="1px"
              borderColor="rgba(59, 130, 246, 0.5)"
              backdropFilter="blur(12px)"
              fontSize="sm"
              borderRadius="full"
              w={{ base: 'full', md: 'auto' }}
              _hover={{
                bg: 'rgba(37, 99, 235, 0.45)',
                borderColor: 'rgba(59, 130, 246, 0.75)',
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
              }}
              _active={{ bg: 'rgba(37, 99, 235, 0.6)' }}
              leftIcon={<AddIcon />}
              onClick={openCreate}
            >
              Tambah Barang
            </Button>
          )}
        </Flex>
        {error && (
          <Text color="orange.200" mb={4}>
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
            <Box
              display={{ base: 'none', md: 'block' }}
              overflowX="auto"
              borderRadius="2xl"
              bg="rgba(0,0,0,0.55)"
              borderWidth="1px"
              borderColor="rgba(255,255,255,0.08)"
              backdropFilter="blur(8px)"
            >
              <Table variant="simple" minW="920px">
                <Thead bg="whiteAlpha.100">
                  <Tr>
                    <Th color="whiteAlpha.500">ID</Th>
                    <Th color="whiteAlpha.500">Nama Barang</Th>
                    <Th color="whiteAlpha.500">Kategori</Th>
                    <Th color="whiteAlpha.500">Stok</Th>
                    <Th color="whiteAlpha.500">Lokasi</Th>
                    <Th color="whiteAlpha.500">Status</Th>
                    <Th color="whiteAlpha.500">Gambar</Th>
                    <Th color="whiteAlpha.500" textAlign="right">
                      Aksi
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {inventories.map((item) => (
                    <Tr key={item.id} _hover={{ bg: 'whiteAlpha.100' }}>
                      <Td
                        color="whiteAlpha.400"
                        fontSize="sm"
                        fontWeight="semibold"
                      >
                        {item.id}
                      </Td>
                      <Td color="white" fontWeight="semibold">
                        {item.name}
                      </Td>
                      <Td>
                        <Badge bg="whiteAlpha.200" color="white">
                          {item.category}
                        </Badge>
                      </Td>
                      <Td color="whiteAlpha.800">{item.stock} unit</Td>
                      <Td color="whiteAlpha.800">{item.location}</Td>
                      <Td>
                        <Badge
                          colorScheme={statusColor[item.status]}
                          borderRadius="full"
                          px={3}
                          py={1}
                        >
                          {item.status}
                        </Badge>
                      </Td>
                      <Td>
                        <Button
                          variant="link"
                          color="blue.200"
                          size="sm"
                          onClick={() => openImage(item)}
                          isDisabled={!item.image}
                        >
                          Lihat Gambar
                        </Button>
                      </Td>
                      <Td>
                        <Flex justify="flex-end" gap={1}>
                          <Button
                            aria-label="Ubah inventaris"
                            variant="ghost"
                            color="white"
                            _hover={{ bg: 'whiteAlpha.200' }}
                            size="sm"
                            onClick={() => openEdit(item)}
                          >
                            <EditIcon />
                          </Button>
                          <Button
                            aria-label="Hapus inventaris"
                            variant="ghost"
                            color="red.200"
                            _hover={{ bg: 'red.500' }}
                            size="sm"
                            isLoading={isDeleting}
                            onClick={() => remove(item)}
                          >
                            <DeleteIcon />
                          </Button>
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>

            <Stack spacing={3} display={{ base: 'flex', md: 'none' }}>
              {inventories.map((item) => (
                <Box
                  key={item.id}
                  borderRadius="2xl"
                  bg="rgba(0,0,0,0.55)"
                  borderWidth="1px"
                  borderColor="rgba(255,255,255,0.09)"
                  p={4}
                >
                  <Flex align="start" justify="space-between" gap={3}>
                    <Box minW={0}>
                      <Text color="white" fontWeight="semibold" noOfLines={1}>
                        {item.name}
                      </Text>
                      <Text color="whiteAlpha.500" fontSize="xs" mt={0.5}>
                        ID {item.id} · {item.category}
                      </Text>
                    </Box>
                    <Badge
                      colorScheme={statusColor[item.status]}
                      borderRadius="full"
                      px={3}
                      py={1}
                      flexShrink={0}
                    >
                      {item.status}
                    </Badge>
                  </Flex>
                  <Flex
                    mt={3}
                    gap={4}
                    fontSize="xs"
                    color="whiteAlpha.700"
                    wrap="wrap"
                  >
                    <Text>
                      Stok:{' '}
                      <Text as="span" color="white">
                        {item.stock} unit
                      </Text>
                    </Text>
                    <Text>
                      Lokasi:{' '}
                      <Text as="span" color="white">
                        {item.location}
                      </Text>
                    </Text>
                  </Flex>
                  <Flex mt={3} align="center" gap={2}>
                    <Button
                      variant="link"
                      color="blue.200"
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
                      color="white"
                      _hover={{ bg: 'whiteAlpha.200' }}
                      size="sm"
                      onClick={() => openEdit(item)}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      aria-label="Hapus inventaris"
                      variant="ghost"
                      color="red.200"
                      _hover={{ bg: 'red.500' }}
                      size="sm"
                      isLoading={isDeleting}
                      onClick={() => remove(item)}
                    >
                      <DeleteIcon />
                    </Button>
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
            bg="rgba(8,10,14,0.85)"
            backdropFilter="blur(20px)"
            color="white"
            borderWidth="1px"
            borderColor="rgba(255,255,255,0.14)"
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
                    bg="whiteAlpha.100"
                    borderColor="whiteAlpha.300"
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
                    bg="whiteAlpha.100"
                    borderColor="whiteAlpha.300"
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
                  <Input
                    size="sm"
                    type="number"
                    min={0}
                    value={form.stock === 0 ? '' : form.stock}
                    bg="whiteAlpha.100"
                    borderColor="whiteAlpha.300"
                    borderRadius="xl"
                    onChange={(event) =>
                      updateForm({
                        stock:
                          event.target.value === ''
                            ? 0
                            : Number(event.target.value),
                      })
                    }
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize="xs" letterSpacing="wide">
                    Lokasi
                  </FormLabel>
                  <Select
                    size="sm"
                    placeholder="Pilih lokasi"
                    value={form.location}
                    bg="whiteAlpha.100"
                    borderColor="whiteAlpha.300"
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
                    bg="whiteAlpha.100"
                    borderColor="whiteAlpha.300"
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
                    bg="whiteAlpha.100"
                    borderColor="whiteAlpha.300"
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
                  bg="whiteAlpha.100"
                  borderColor="whiteAlpha.300"
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
                color="whiteAlpha.700"
                borderWidth="1px"
                borderColor="rgba(255,255,255,0.1)"
                borderRadius="full"
                _hover={{ bg: 'rgba(255,255,255,0.08)', color: 'white' }}
                onClick={formModal.onClose}
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
            bg="rgba(8,10,14,0.85)"
            backdropFilter="blur(16px)"
            color="white"
            overflow="hidden"
            borderWidth="1px"
            borderColor="rgba(255,255,255,0.14)"
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
