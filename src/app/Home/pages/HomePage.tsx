import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import {
  ArrowBackIcon,
  CalendarIcon,
  InfoIcon,
  SettingsIcon,
  ViewIcon,
} from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { useHomeViewModel } from '../viewModels/HomeViewModel';

const featureIcons = [ViewIcon, InfoIcon, CalendarIcon, SettingsIcon];
const statusColor = {
  Tersedia: 'green',
  Dipinjam: 'orange',
  'Perlu Perawatan': 'red',
} as const;

export default function HomePage() {
  const router = useRouter();
  const { features, inventoryItems, availableInventoryCount } =
    useHomeViewModel();
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    window.dispatchEvent(new Event('auth-change'));
    router.replace('/login');
  };

  return (
    <Flex minH="100vh" bg="gray.50">
      <Box
        w={{ base: '76px', md: '280px' }}
        bg="purple.900"
        color="white"
        p={{ base: 3, md: 6 }}
      >
        <Flex align="center" gap={3} mb={10}>
          <Icon as={ViewIcon} boxSize={7} color="pink.300" />
          <Box display={{ base: 'none', md: 'block' }}>
            <Text fontWeight="bold">Studio Pertunjukan</Text>
            <Text fontSize="xs" color="purple.200">
              CMS Laboratorium
            </Text>
          </Box>
        </Flex>
        <Stack spacing={2}>
          {features.map((feature, index) => (
            <Flex
              key={feature.id}
              align="center"
              gap={3}
              px={3}
              py={3}
              borderRadius="xl"
              bg={index === 0 ? 'whiteAlpha.300' : 'transparent'}
              color={index === 0 ? 'white' : 'purple.100'}
            >
              <Icon as={featureIcons[index]} boxSize={5} />
              <Text
                display={{ base: 'none', md: 'block' }}
                fontWeight={index === 0 ? 'semibold' : 'normal'}
              >
                {feature.label}
              </Text>
            </Flex>
          ))}
        </Stack>
        <Button
          mt={10}
          variant="ghost"
          colorScheme="pink"
          leftIcon={<ArrowBackIcon />}
          onClick={handleLogout}
          w="full"
          justifyContent={{ base: 'center', md: 'flex-start' }}
        >
          <Text display={{ base: 'none', md: 'block' }}>Keluar</Text>
        </Button>
      </Box>
      <Box flex="1" p={{ base: 5, md: 10 }} overflowX="auto">
        <Text color="purple.600" fontWeight="semibold" mb={2}>
          DASHBOARD
        </Text>
        <Heading size="lg" color="gray.800">
          Inventaris Barang
        </Heading>
        <Text color="gray.500" mt={2}>
          Ringkasan peralatan yang tersedia di Laboratorium Studio Pertunjukan.
        </Text>
        <Flex
          mt={8}
          mb={8}
          p={6}
          maxW="360px"
          bg="white"
          borderRadius="2xl"
          boxShadow="sm"
          align="center"
          gap={4}
        >
          <Flex
            w={12}
            h={12}
            borderRadius="xl"
            align="center"
            justify="center"
            bg="purple.100"
            color="purple.700"
          >
            <Icon as={ViewIcon} boxSize={6} />
          </Flex>
          <Box>
            <Text fontSize="2xl" fontWeight="bold">
              {availableInventoryCount}
            </Text>
            <Text fontSize="sm" color="gray.500">
              Jenis barang tersedia
            </Text>
          </Box>
        </Flex>
        <Box bg="white" borderRadius="2xl" boxShadow="sm" overflow="hidden">
          <Box px={6} py={5} borderBottomWidth="1px">
            <Heading size="md">Daftar Inventaris</Heading>
          </Box>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Kode</Th>
                <Th>Barang</Th>
                <Th>Kategori</Th>
                <Th>Stok</Th>
                <Th>Lokasi</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {inventoryItems.map((item) => (
                <Tr key={item.id}>
                  <Td>{item.id}</Td>
                  <Td fontWeight="semibold">{item.name}</Td>
                  <Td>{item.category}</Td>
                  <Td>{item.stock}</Td>
                  <Td>{item.location}</Td>
                  <Td>
                    <Badge
                      colorScheme={statusColor[item.status]}
                      borderRadius="full"
                      px={3}
                    >
                      {item.status}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Flex>
  );
}
