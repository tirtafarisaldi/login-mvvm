import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Button, Flex, Text } from '@chakra-ui/react';
import { Fragment } from 'react';
import { useThemeStore } from '../../src/app/Menus/store/useThemeStore';

interface DataTablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export default function DataTablePagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: DataTablePaginationProps) {
  const mode = useThemeStore((state) => state.mode);
  // if (totalPages <= 1) return null;

  const pages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).filter(
    (page) =>
      page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
  );

  return (
    <Flex mt={5} align="center" justify="space-between" gap={3} wrap="wrap">
      <Text
        color={mode === 'dark' ? 'whiteAlpha.700' : 'gray.600'}
        fontSize="sm"
      >
        Total {totalItems} data
      </Text>
      <Flex gap={2}>
        <Button
          size="sm"
          minW="38px"
          h="38px"
          borderRadius="full"
          transition="all 0.2s"
          bg={mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'white'}
          color={mode === 'dark' ? 'whiteAlpha.800' : 'gray.700'}
          borderWidth="1px"
          borderColor={mode === 'dark' ? 'rgba(255,255,255,0.14)' : 'gray.300'}
          _hover={{
            transform: 'translateY(-1px)',
            bg: mode === 'dark' ? 'rgba(59,130,246,0.22)' : 'blue.50',
            color: mode === 'dark' ? 'white' : 'blue.700',
            borderColor: mode === 'dark' ? 'rgba(96,165,250,0.5)' : 'blue.400',
            boxShadow: '0 0 10px rgba(59,130,246,0.25)',
          }}
          _disabled={{
            bg: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'gray.100',
            color: mode === 'dark' ? 'whiteAlpha.300' : 'gray.400',
            borderColor:
              mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'gray.200',
            cursor: 'not-allowed',
            opacity: 1,
          }}
          onClick={() => onPageChange(currentPage - 1)}
          isDisabled={currentPage === 1}
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeftIcon boxSize={4} />
        </Button>
        {pages.map((page, index) => (
          <Fragment key={page}>
            {index > 0 && page - pages[index - 1] > 1 && (
              <Text
                key={`ellipsis-${page}`}
                color={mode === 'dark' ? 'whiteAlpha.600' : 'gray.500'}
                alignSelf="center"
                fontSize="sm"
              >
                …
              </Text>
            )}
            <Button
              size="sm"
              minW="38px"
              h="38px"
              px={2}
              borderRadius="full"
              transition="all 0.2s"
              bg={
                page === currentPage
                  ? 'linear-gradient(135deg, #60a5fa 0%, #2563eb 55%, #1d4ed8 100%)'
                  : mode === 'dark'
                    ? 'rgba(255,255,255,0.08)'
                    : 'white'
              }
              color={
                page === currentPage
                  ? 'white'
                  : mode === 'dark'
                    ? 'whiteAlpha.900'
                    : 'gray.700'
              }
              borderWidth={page === currentPage ? 0 : '1px'}
              borderColor={
                mode === 'dark' ? 'rgba(255,255,255,0.14)' : 'gray.300'
              }
              fontWeight={page === currentPage ? 'bold' : 'medium'}
              boxShadow={
                page === currentPage
                  ? mode === 'dark'
                    ? '0 0 16px rgba(59,130,246,0.5), 0 4px 12px rgba(0,0,0,0.3)'
                    : '0 4px 14px rgba(37, 99, 235, 0.35)'
                  : 'none'
              }
              _hover={{
                transform: 'translateY(-1px)',
                bg:
                  page === currentPage
                    ? 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 60%, #2563eb 100%)'
                    : mode === 'dark'
                      ? 'rgba(59,130,246,0.22)'
                      : 'blue.50',
                color:
                  page === currentPage
                    ? 'white'
                    : mode === 'dark'
                      ? 'white'
                      : 'blue.700',
                borderColor:
                  page === currentPage
                    ? 'transparent'
                    : mode === 'dark'
                      ? 'rgba(96,165,250,0.5)'
                      : 'blue.400',
                boxShadow:
                  page === currentPage
                    ? '0 0 20px rgba(59,130,246,0.6), 0 6px 16px rgba(0,0,0,0.3)'
                    : '0 0 10px rgba(59,130,246,0.25)',
              }}
              _active={{
                transform: 'translateY(0)',
                bg: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              }}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          </Fragment>
        ))}
        <Button
          size="sm"
          minW="38px"
          h="38px"
          borderRadius="full"
          transition="all 0.2s"
          bg={mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'white'}
          color={mode === 'dark' ? 'whiteAlpha.800' : 'gray.700'}
          borderWidth="1px"
          borderColor={mode === 'dark' ? 'rgba(255,255,255,0.14)' : 'gray.300'}
          _hover={{
            transform: 'translateY(-1px)',
            bg: mode === 'dark' ? 'rgba(59,130,246,0.22)' : 'blue.50',
            color: mode === 'dark' ? 'white' : 'blue.700',
            borderColor: mode === 'dark' ? 'rgba(96,165,250,0.5)' : 'blue.400',
            boxShadow: '0 0 10px rgba(59,130,246,0.25)',
          }}
          _disabled={{
            bg: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'gray.100',
            color: mode === 'dark' ? 'whiteAlpha.300' : 'gray.400',
            borderColor:
              mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'gray.200',
            cursor: 'not-allowed',
            opacity: 1,
          }}
          onClick={() => onPageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages}
          aria-label="Halaman berikutnya"
        >
          <ChevronRightIcon boxSize={4} />
        </Button>
      </Flex>
    </Flex>
  );
}
