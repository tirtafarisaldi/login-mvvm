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
          minW="36px"
          borderRadius="full"
          bg={mode === 'dark' ? 'rgba(255,255,255,0.10)' : 'white'}
          color={mode === 'dark' ? 'whiteAlpha.800' : 'gray.700'}
          borderWidth="1px"
          borderColor={mode === 'dark' ? 'rgba(255,255,255,0.14)' : 'gray.300'}
          _hover={{
            bg: mode === 'dark' ? 'rgba(255,255,255,0.16)' : 'gray.100',
            color: mode === 'dark' ? 'white' : 'gray.900',
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
                color={mode === 'dark' ? 'whiteAlpha.700' : 'gray.600'}
                alignSelf="center"
              >
                …
              </Text>
            )}
            <Button
              size="sm"
              minW="36px"
              borderRadius="full"
              bg={
                page === currentPage
                  ? 'blue.600'
                  : mode === 'dark'
                    ? 'rgba(255,255,255,0.10)'
                    : 'white'
              }
              color={
                page === currentPage
                  ? 'white'
                  : mode === 'dark'
                    ? 'whiteAlpha.800'
                    : 'gray.700'
              }
              borderWidth={page === currentPage ? 0 : '1px'}
              borderColor={
                mode === 'dark' ? 'rgba(255,255,255,0.14)' : 'gray.300'
              }
              fontWeight={page === currentPage ? 'bold' : 'medium'}
              _hover={{
                bg:
                  page === currentPage
                    ? 'blue.500'
                    : mode === 'dark'
                      ? 'rgba(255,255,255,0.16)'
                      : 'gray.100',
                color:
                  page === currentPage
                    ? 'white'
                    : mode === 'dark'
                      ? 'white'
                      : 'gray.900',
              }}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          </Fragment>
        ))}
        <Button
          size="sm"
          minW="36px"
          borderRadius="full"
          bg={mode === 'dark' ? 'rgba(255,255,255,0.10)' : 'white'}
          color={mode === 'dark' ? 'whiteAlpha.800' : 'gray.700'}
          borderWidth="1px"
          borderColor={mode === 'dark' ? 'rgba(255,255,255,0.14)' : 'gray.300'}
          _hover={{
            bg: mode === 'dark' ? 'rgba(255,255,255,0.16)' : 'gray.100',
            color: mode === 'dark' ? 'white' : 'gray.900',
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
