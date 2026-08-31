import { Button, Flex, Input, Select } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useThemeStore } from '../../src/app/Menus/store/useThemeStore';

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
  debounceMs?: number;
}

const DEFAULT_DEBOUNCE_MS = 400;

export default function FilterBar<TFilters extends object>({
  fields,
  filters,
  onChange,
  onReset,
  debounceMs = DEFAULT_DEBOUNCE_MS,
}: FilterBarProps<TFilters>) {
  const mode = useThemeStore((state) => state.mode);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(
    () => () => {
      Object.values(timers.current).forEach((timer) => clearTimeout(timer));
    },
    []
  );

  const handleTextChange = (key: string, value: string) => {
    setDrafts((current) => ({ ...current, [key]: value }));
    if (timers.current[key]) clearTimeout(timers.current[key]);
    timers.current[key] = setTimeout(() => onChange(key, value), debounceMs);
  };

  const handleReset = () => {
    Object.values(timers.current).forEach((timer) => clearTimeout(timer));
    timers.current = {};
    setDrafts({});
    onReset();
  };

  return (
    <Flex gap={3} mb={6} wrap="wrap" align="center">
      {fields.map((field) =>
        field.options ? (
          <Select
            key={field.key}
            aria-label={field.label}
            placeholder={field.label}
            value={String(filters[field.key as keyof TFilters] ?? '')}
            onChange={(event) => onChange(field.key, event.target.value)}
            maxW={{ base: 'full', md: '180px', xl: '200px' }}
            bg={mode === 'dark' ? 'rgba(0,0,0,0.40)' : 'white'}
            borderColor={mode === 'dark' ? 'whiteAlpha.300' : 'gray.300'}
            flexShrink={0}
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
            value={
              drafts[field.key] ??
              String(filters[field.key as keyof TFilters] ?? '')
            }
            onChange={(event) =>
              handleTextChange(field.key, event.target.value)
            }
            maxW={{ base: 'full', md: '160px', xl: '220px' }}
            bg={mode === 'dark' ? 'rgba(0,0,0,0.40)' : 'white'}
            borderColor={mode === 'dark' ? 'whiteAlpha.300' : 'gray.300'}
            flexShrink={0}
          />
        )
      )}
      <Button
        variant="outline"
        colorScheme="blue"
        fontSize="sm"
        borderRadius="full"
        flexShrink={0}
        onClick={handleReset}
      >
        Reset Filter
      </Button>
    </Flex>
  );
}
