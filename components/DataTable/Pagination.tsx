import { Button, Flex, Text } from '@chakra-ui/react';
import { Fragment } from 'react';

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
      <Text color="whiteAlpha.700" fontSize="sm">
        Total {totalItems} data
      </Text>
      <Flex gap={2}>
        <Button
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          isDisabled={currentPage === 1}
        >
          Sebelumnya
        </Button>
        {pages.map((page, index) => (
          <Fragment key={page}>
            {index > 0 && page - pages[index - 1] > 1 && (
              <Text
                key={`ellipsis-${page}`}
                color="whiteAlpha.700"
                alignSelf="center"
              >
                …
              </Text>
            )}
            <Button
              size="sm"
              minW="36px"
              bg={page === currentPage ? 'cyan.300' : 'whiteAlpha.100'}
              color={page === currentPage ? 'gray.900' : 'white'}
              _hover={{
                bg: page === currentPage ? 'cyan.200' : 'whiteAlpha.200',
              }}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          </Fragment>
        ))}
        <Button
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages}
        >
          Berikutnya
        </Button>
      </Flex>
    </Flex>
  );
}
