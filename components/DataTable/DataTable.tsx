import {
  Box,
  Flex,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { useThemeStore } from '../../src/app/Menus/store/useThemeStore';
import { useThemeColors } from '../../src/app/Menus/store/themeColors';

export interface Column<T> {
  header: string;
  accessor?: (item: T) => ReactNode;
  textAlign?: 'left' | 'right' | 'center';
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  renderMobileCard: (item: T) => ReactNode;
  minW?: string;
  loading?: boolean;
  keyExtractor: (item: T) => string;
}

export default function DataTable<T>({
  data,
  columns,
  renderMobileCard,
  minW = '920px',
  loading = false,
  keyExtractor,
}: DataTableProps<T>) {
  const mode = useThemeStore((s) => s.mode);
  const theme = useThemeColors();

  if (loading) {
    return (
      <Flex minH="300px" justify="center" align="center">
        <Spinner thickness="3px" color="blue.400" />
      </Flex>
    );
  }

  return (
    <>
      <Box display={{ base: 'none', md: 'block' }}>
        <Box
          borderWidth="1px"
          borderColor={theme.cardBorder}
          borderRadius="2xl"
          overflow="hidden"
          bg={theme.cardBg}
        >
          <Box overflowX="auto">
            <Table
              variant="simple"
              minW={minW}
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
              <Thead bg={mode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.50'}>
                <Tr>
                  {columns.map((col) => (
                    <Th
                      key={col.header}
                      color={theme.textMuted}
                      textAlign={col.textAlign ?? 'left'}
                    >
                      {col.header}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {data.map((item) => (
                  <Tr
                    key={keyExtractor(item)}
                    _hover={{
                      bg: mode === 'dark' ? 'whiteAlpha.200' : 'blackAlpha.100',
                    }}
                  >
                    {columns.map((col) => (
                      <Td key={col.header} textAlign={col.textAlign ?? 'left'}>
                        {col.accessor?.(item)}
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Box>

      <Stack spacing={3} display={{ base: 'flex', md: 'none' }}>
        {data.map((item) => (
          <Box
            key={keyExtractor(item)}
            bg={theme.cardBg}
            borderWidth="1px"
            borderColor={theme.cardBorder}
            borderRadius="2xl"
            p={4}
          >
            {renderMobileCard(item)}
          </Box>
        ))}
      </Stack>
    </>
  );
}
