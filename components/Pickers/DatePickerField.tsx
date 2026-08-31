import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import {
  MONTH_NAMES,
  buildMonthDays,
  isSameDay,
  toDateKey,
} from 'components/Calendar';
import { useEffect, useMemo, useState } from 'react';
import { useThemeStore } from '../../src/app/Menus/store/useThemeStore';

const WEEKDAY_SHORT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

const parseDate = (value: string): Date | null => {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day, 0, 0, 0, 0);
};

const formatLabel = (value: string): string => {
  const date = parseDate(value);
  if (!date) return 'Pilih tanggal';
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

interface DatePickerFieldProps {
  value: string;
  onChange: (value: string) => void;
  min?: string;
}

export default function DatePickerField({
  value,
  onChange,
  min,
}: DatePickerFieldProps) {
  const disclosure = useDisclosure();
  const mode = useThemeStore((state) => state.mode);
  const parsed = parseDate(value);
  const [viewDate, setViewDate] = useState(
    () =>
      new Date(
        (parsed ?? new Date()).getFullYear(),
        (parsed ?? new Date()).getMonth(),
        1
      )
  );
  const minDate = useMemo(() => (min ? parseDate(min) : null), [min]);

  useEffect(() => {
    if (disclosure.isOpen) {
      const date = parseDate(value) ?? new Date();
      setViewDate(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  }, [disclosure.isOpen, value]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const days = buildMonthDays(year, month);
  const monthLabel = `${MONTH_NAMES[month]} ${year}`;

  const moveMonth = (offset: number): void =>
    setViewDate(new Date(year, month + offset, 1));

  const selectDay = (day: Date): void => {
    onChange(toDateKey(day));
    disclosure.onClose();
  };

  return (
    <Popover
      placement="bottom-start"
      closeOnBlur
      isLazy
      isOpen={disclosure.isOpen}
      onOpen={disclosure.onOpen}
      onClose={disclosure.onClose}
    >
      <PopoverTrigger>
        <Button
          variant="outline"
          w="full"
          h="8"
          justifyContent="flex-start"
          textAlign="left"
          px={3}
          borderRadius="xl"
          bg={mode === 'dark' ? 'whiteAlpha.100' : 'white'}
          borderColor={mode === 'dark' ? 'whiteAlpha.300' : 'gray.300'}
          color={
            value
              ? mode === 'dark'
                ? 'white'
                : 'gray.800'
              : mode === 'dark'
                ? 'whiteAlpha.500'
                : 'gray.500'
          }
          fontSize="sm"
          fontWeight="medium"
          _hover={{
            bg: mode === 'dark' ? 'whiteAlpha.200' : 'gray.50',
            borderColor: mode === 'dark' ? 'whiteAlpha.400' : 'gray.400',
          }}
          leftIcon={
            <CalendarIcon
              color={mode === 'dark' ? 'blue.300' : 'blue.600'}
              boxSize={4}
            />
          }
        >
          {formatLabel(value)}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        w="288px"
        bg={mode === 'dark' ? 'rgba(10,12,18,0.95)' : 'rgba(255,255,255,0.98)'}
        color={mode === 'dark' ? 'white' : 'gray.800'}
        borderWidth="1px"
        borderColor={
          mode === 'dark' ? 'rgba(255,255,255,0.14)' : 'rgba(15,23,42,0.12)'
        }
        borderRadius="2xl"
        boxShadow="0 24px 80px rgba(0,0,0,.6)"
        backdropFilter="blur(20px)"
      >
        <PopoverBody p={3}>
          <Flex align="center" justify="space-between" mb={3}>
            <IconButton
              aria-label="Bulan sebelumnya"
              variant="ghost"
              color={mode === 'dark' ? 'whiteAlpha.600' : 'gray.600'}
              _hover={{
                bg: mode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.100',
                color: mode === 'dark' ? 'white' : 'gray.900',
              }}
              size="sm"
              borderRadius="full"
              icon={<ChevronLeftIcon />}
              onClick={() => moveMonth(-1)}
            />
            <Heading
              size="xs"
              color={mode === 'dark' ? 'white' : 'gray.800'}
              letterSpacing="tight"
            >
              {monthLabel}
            </Heading>
            <IconButton
              aria-label="Bulan berikutnya"
              variant="ghost"
              color={mode === 'dark' ? 'whiteAlpha.600' : 'gray.600'}
              _hover={{
                bg: mode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.100',
                color: mode === 'dark' ? 'white' : 'gray.900',
              }}
              size="sm"
              borderRadius="full"
              icon={<ChevronRightIcon />}
              onClick={() => moveMonth(1)}
            />
          </Flex>

          <Box
            display="grid"
            gridTemplateColumns="repeat(7, 1fr)"
            gap={1}
            mb={1}
          >
            {WEEKDAY_SHORT.map((weekday) => (
              <Text
                key={weekday}
                color={mode === 'dark' ? 'whiteAlpha.500' : 'gray.500'}
                fontSize="xs"
                fontWeight="bold"
                textAlign="center"
                py={1}
              >
                {weekday}
              </Text>
            ))}
          </Box>

          <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1}>
            {days.map((day) => {
              const dayKey = toDateKey(day);
              const inViewMonth = day.getMonth() === month;
              const isToday = isSameDay(day, new Date());
              const isSelected = value === dayKey;
              const disabled =
                Boolean(minDate) && day.getTime() < (minDate?.getTime() ?? 0);
              return (
                <Button
                  key={dayKey}
                  size="sm"
                  w="full"
                  h={8}
                  px={0}
                  fontSize="xs"
                  borderRadius="lg"
                  bg={
                    isSelected
                      ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                      : 'transparent'
                  }
                  color={
                    isSelected
                      ? 'white'
                      : inViewMonth
                        ? mode === 'dark'
                          ? 'whiteAlpha.800'
                          : 'gray.800'
                        : mode === 'dark'
                          ? 'whiteAlpha.300'
                          : 'gray.400'
                  }
                  boxShadow={
                    isSelected ? '0 0 12px rgba(59,130,246,0.45)' : 'none'
                  }
                  borderWidth={!isSelected && isToday ? '1px' : 0}
                  borderColor="blue.300"
                  opacity={disabled ? 0.3 : 1}
                  disabled={disabled}
                  _hover={
                    disabled || isSelected
                      ? undefined
                      : {
                          bg:
                            mode === 'dark'
                              ? 'whiteAlpha.150'
                              : 'rgba(15,23,42,0.06)',
                          color: mode === 'dark' ? 'white' : 'gray.900',
                        }
                  }
                  onClick={() => selectDay(day)}
                >
                  {day.getDate()}
                </Button>
              );
            })}
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
