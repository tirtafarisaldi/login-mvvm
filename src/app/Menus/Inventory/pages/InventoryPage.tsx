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
import FilterBar, {
  type FilterField,
} from '../../../../../components/DataTable/FilterBar';
import DataTablePagination from '../../../../../components/DataTable/Pagination';
import MenuLayout from '../../components/MenuLayout';
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
  description: '',
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
  description: inventory.description,
  category: inventory.category,
  stock: inventory.stock,
  location: inventory.location,
  status: inventory.status,
  information: inventory.information,
  image: inventory.image,
});

export default function InventoryPage() {
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
    <MenuLayout>
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
              <Text
                color="cyan.300"
                fontSize="sm"
                fontWeight="bold"
                letterSpacing="widest"
              >
                INVENTORY MANAGEMENT
              </Text>
              <Heading color="white" mt={2}>
                Koleksi Peralatan
              </Heading>
              <Text color="whiteAlpha.700" mt={2}>
                Kelola aset Laboratorium Studio Pertunjukan dalam satu ruang
                kerja.
              </Text>
            </Box>
            <Button
              color="gray.900"
              bg="cyan.300"
              _hover={{ bg: 'cyan.200' }}
              leftIcon={<AddIcon />}
              onClick={openCreate}
            >
              Tambah Barang
            </Button>
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
              <Spinner thickness="3px" color="cyan.300" />
            </Flex>
          ) : (
            <Box
              overflowX="auto"
              borderRadius="2xl"
              bg="whiteAlpha.070"
              borderWidth="1px"
              borderColor="rgba(103, 232, 249, 0.24)"
              backdropFilter="blur(18px)"
            >
              <Table variant="simple" minW="920px">
                <Thead bg="whiteAlpha.100">
                  <Tr>
                    <Th color="cyan.200">ID</Th>
                    <Th color="cyan.200">Nama Barang</Th>
                    <Th color="cyan.200">Kategori</Th>
                    <Th color="cyan.200">Stok</Th>
                    <Th color="cyan.200">Lokasi</Th>
                    <Th color="cyan.200">Status</Th>
                    <Th color="cyan.200">Gambar</Th>
                    <Th color="cyan.200" textAlign="right">
                      Aksi
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {inventories.map((item) => (
                    <Tr key={item.id} _hover={{ bg: 'whiteAlpha.100' }}>
                      <Td color="cyan.200" fontSize="sm" fontWeight="bold">
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
                          color="cyan.200"
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
          >
            <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.700" />
            <ModalContent
              as="form"
              onSubmit={submit}
              bg="gray.900"
              color="white"
              borderWidth="1px"
              borderColor="whiteAlpha.300"
              boxShadow="0 24px 80px rgba(0,0,0,.55)"
            >
              <ModalHeader>
                {selectedInventory ? 'Ubah Inventaris' : 'Tambah Inventaris'}
              </ModalHeader>
              <ModalBody>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Nama Barang</FormLabel>
                    <Input
                      value={form.name}
                      bg="whiteAlpha.100"
                      borderColor="whiteAlpha.300"
                      onChange={(event) =>
                        updateForm({ name: event.target.value })
                      }
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Kategori</FormLabel>
                    <Select
                      placeholder="Pilih kategori"
                      value={form.category}
                      bg="whiteAlpha.100"
                      borderColor="whiteAlpha.300"
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
                    <FormLabel>Stok</FormLabel>
                    <Input
                      type="number"
                      min={0}
                      value={form.stock}
                      bg="whiteAlpha.100"
                      borderColor="whiteAlpha.300"
                      onChange={(event) =>
                        updateForm({ stock: Number(event.target.value) })
                      }
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Lokasi</FormLabel>
                    <Select
                      placeholder="Pilih lokasi"
                      value={form.location}
                      bg="whiteAlpha.100"
                      borderColor="whiteAlpha.300"
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
                    <FormLabel>Status</FormLabel>
                    <Select
                      value={form.status}
                      bg="whiteAlpha.100"
                      borderColor="whiteAlpha.300"
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
                    <FormLabel>Link / Path Gambar</FormLabel>
                    <Input
                      type="url"
                      placeholder="https://... atau /img/barang.jpg"
                      value={form.image}
                      bg="whiteAlpha.100"
                      borderColor="whiteAlpha.300"
                      onChange={(event) =>
                        updateForm({ image: event.target.value })
                      }
                    />
                  </FormControl>
                </SimpleGrid>
                <FormControl mt={4}>
                  <FormLabel>Informasi</FormLabel>
                  <Textarea
                    value={form.information}
                    bg="whiteAlpha.100"
                    borderColor="whiteAlpha.300"
                    onChange={(event) =>
                      updateForm({ information: event.target.value })
                    }
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button mr={3} variant="ghost" onClick={formModal.onClose}>
                  Batal
                </Button>
                <Button
                  type="submit"
                  bg="cyan.300"
                  color="gray.900"
                  _hover={{ bg: 'cyan.200' }}
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
          >
            <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.700" />
            <ModalContent
              bg="gray.900"
              color="white"
              overflow="hidden"
              borderWidth="1px"
              borderColor="whiteAlpha.300"
            >
              <ModalHeader>{previewImage?.name}</ModalHeader>
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
    </MenuLayout>
  );
}
