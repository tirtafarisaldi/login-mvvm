import { Button, Flex, Input, Select } from '@chakra-ui/react';

export interface FilterField {
  key: string;
  label: string;
  options?: string[];
}

interface FilterBarProps<TFilters extends object> {
  fields: FilterField[];
  filters: TFilters;
  onChange: (key: string, value: string) => void;
  onReset: () => void;
}

export default function FilterBar<TFilters extends object>({
  fields,
  filters,
  onChange,
  onReset,
}: FilterBarProps<TFilters>) {
  return (
    <Flex gap={3} mb={6} wrap="wrap">
      {fields.map((field) =>
        field.options ? (
          <Select
            key={field.key}
            aria-label={field.label}
            placeholder={field.label}
            value={String(filters[field.key as keyof TFilters] ?? '')}
            onChange={(event) => onChange(field.key, event.target.value)}
            maxW={{ base: 'full', md: '220px' }}
            bg="whiteAlpha.100"
            borderColor="whiteAlpha.300"
          >
            {field.options.map((option) => (
              <option key={option} value={option} style={{ color: '#111827' }}>
                {option}
              </option>
            ))}
          </Select>
        ) : (
          <Input
            key={field.key}
            aria-label={field.label}
            placeholder={field.label}
            value={String(filters[field.key as keyof TFilters] ?? '')}
            onChange={(event) => onChange(field.key, event.target.value)}
            maxW={{ base: 'full', md: '260px' }}
            bg="whiteAlpha.100"
            borderColor="whiteAlpha.300"
          />
        )
      )}
      <Button
        variant="outline"
        colorScheme="blue"
        fontSize="sm"
        borderRadius="full"
        onClick={onReset}
      >
        Reset Filter
      </Button>
    </Flex>
  );
}
