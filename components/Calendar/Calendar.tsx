import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  IconButton,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { useMemo, memo } from 'react';
import MonthPicker from './MonthPicker';
import { palette } from './calendar-theme';
import {
  buildMonthDays,
  type CalendarEvent,
  isSameDay,
  toDateKey,
  WEEKDAYS,
} from './calendar-types';
import { useThemeStore } from '../../src/app/Menus/store/useThemeStore';

interface CalendarProps {
  events: CalendarEvent[];
  viewDate: Date;
  selectedDay: Date;
  onViewDateChange: (date: Date) => void;
  onSelectDay: (day: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onTodayClick?: () => void;
}

function Calendar({
  events,
  viewDate,
  selectedDay,
  onViewDateChange,
  onSelectDay,
  onEventClick,
  onTodayClick,
}: CalendarProps) {
  const mode = useThemeStore((state) => state.mode);
  const today = new Date();
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthLabel = new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric',
  }).format(viewDate);

  const eventsByDate = useMemo(() => {
    const byDate: Record<string, CalendarEvent[]> = {};
    events.forEach((event) => {
      if (!event.dateKey) return;
      byDate[event.dateKey] = byDate[event.dateKey] ?? [];
      byDate[event.dateKey].push(event);
    });
    Object.values(byDate).forEach((list) =>
      list.sort((a, b) => a.start.localeCompare(b.start))
    );
    return byDate;
  }, [events]);

  const monthDays = buildMonthDays(year, month);

  const moveMonth = (offset: number): void =>
    onViewDateChange(
      new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1)
    );

  return (
    <Box
      flex="1"
      minW={0}
      w="full"
      borderRadius="2xl"
      bg={mode === 'dark' ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.92)'}
      borderWidth="1px"
      borderColor={
        mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.10)'
      }
      boxShadow={
        mode === 'dark'
          ? 'inset 0 1px 0 rgba(255,255,255,0.06)'
          : '0 8px 30px rgba(15,23,42,0.08)'
      }
      overflow="hidden"
    >
      <Flex
        align="center"
        justify="space-between"
        gap={3}
        px={{ base: 3, md: 4 }}
        py={3}
        borderBottomWidth="1px"
        borderBottomColor={
          mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.10)'
        }
      >
        <MonthPicker
          value={viewDate}
          onSelect={onViewDateChange}
          monthLabel={monthLabel}
        />
        <Flex align="center" gap={1}>
          <Button
            variant="ghost"
            color={mode === 'dark' ? 'whiteAlpha.600' : 'gray.600'}
            _hover={{
              bg: mode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.100',
              color: mode === 'dark' ? 'white' : 'gray.900',
            }}
            size="sm"
            fontWeight="medium"
            onClick={onTodayClick}
            mr={1}
          >
            Hari Ini
          </Button>
          <IconButton
            aria-label="Bulan sebelumnya"
            variant="solid"
            color={mode === 'dark' ? 'white' : 'gray.700'}
            bg={mode === 'dark' ? 'rgba(255,255,255,0.14)' : 'blackAlpha.100'}
            _hover={{
              bg: mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'blackAlpha.200',
            }}
            size="sm"
            borderRadius="full"
            icon={<ChevronLeftIcon />}
            onClick={() => moveMonth(-1)}
          />
          <IconButton
            aria-label="Bulan berikutnya"
            variant="solid"
            color={mode === 'dark' ? 'white' : 'gray.700'}
            bg={mode === 'dark' ? 'rgba(255,255,255,0.14)' : 'blackAlpha.100'}
            _hover={{
              bg: mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'blackAlpha.200',
            }}
            size="sm"
            borderRadius="full"
            icon={<ChevronRightIcon />}
            onClick={() => moveMonth(1)}
          />
        </Flex>
      </Flex>

      <Box px={2} pt={2.5} display="grid" gridTemplateColumns="repeat(7, 1fr)">
        {WEEKDAYS.map((weekday) => (
          <Text
            key={weekday}
            color={mode === 'dark' ? 'whiteAlpha.500' : 'gray.500'}
            fontSize="xs"
            fontWeight="bold"
            letterSpacing="widest"
            textTransform="uppercase"
            textAlign="center"
            py={1.5}
            px={1}
          >
            {weekday[0]}
          </Text>
        ))}
      </Box>

      <Box
        p={2}
        display="grid"
        gridTemplateColumns="repeat(7, 1fr)"
        gap={1}
        bg={mode === 'dark' ? 'rgba(0,0,0,0.20)' : 'transparent'}
      >
        {monthDays.map((day) => {
          const dayKey = toDateKey(day);
          const inViewMonth = day.getMonth() === month;
          const isToday = isSameDay(day, today);
          const isSelected = isSameDay(day, selectedDay);
          const dayEvents = eventsByDate[dayKey] ?? [];
          return (
            <Box
              key={dayKey}
              minH={{ base: '72px', md: '104px' }}
              minW={0}
              p={2}
              borderRadius="lg"
              onClick={() => onSelectDay(day)}
              cursor="pointer"
              bg={
                isSelected
                  ? mode === 'dark'
                    ? 'rgba(59,130,246,0.14)'
                    : 'rgba(59,130,246,0.12)'
                  : isToday
                    ? mode === 'dark'
                      ? 'rgba(255,255,255,0.10)'
                      : 'blackAlpha.50'
                    : mode === 'dark'
                      ? 'whiteAlpha.100'
                      : 'blackAlpha.50'
              }
              borderWidth="1px"
              borderColor={
                isSelected
                  ? 'rgba(59,130,246,0.55)'
                  : isToday
                    ? mode === 'dark'
                      ? 'rgba(255,255,255,0.16)'
                      : 'rgba(15,23,42,0.16)'
                    : mode === 'dark'
                      ? 'rgba(255,255,255,0.04)'
                      : 'rgba(15,23,42,0.05)'
              }
              boxShadow="none"
              _hover={{
                bg:
                  mode === 'dark'
                    ? 'rgba(255,255,255,0.16)'
                    : 'rgba(15,23,42,0.08)',
                borderColor:
                  mode === 'dark'
                    ? 'rgba(255,255,255,0.16)'
                    : 'rgba(15,23,42,0.16)',
              }}
            >
              <Flex align="center" justify="space-between" mb={2}>
                <Flex
                  w={6}
                  h={6}
                  align="center"
                  justify="center"
                  borderRadius="full"
                  bg={isToday ? 'blue.600' : 'transparent'}
                  color={
                    isToday
                      ? 'white'
                      : inViewMonth
                        ? mode === 'dark'
                          ? 'whiteAlpha.800'
                          : 'gray.800'
                        : mode === 'dark'
                          ? 'whiteAlpha.300'
                          : 'gray.400'
                  }
                  fontSize="xs"
                  fontWeight={isToday ? 'bold' : 'medium'}
                >
                  {day.getDate()}
                </Flex>
                {dayEvents.length > 0 && (
                  <Flex
                    w={5}
                    h={5}
                    align="center"
                    justify="center"
                    borderRadius="full"
                    bg={
                      mode === 'dark'
                        ? 'rgba(255,255,255,0.08)'
                        : 'rgba(15,23,42,0.06)'
                    }
                    color={mode === 'dark' ? 'whiteAlpha.600' : 'gray.600'}
                    fontSize="10px"
                    fontWeight="bold"
                  >
                    {dayEvents.length}
                  </Flex>
                )}
              </Flex>
              <Stack spacing={1}>
                {dayEvents.slice(0, 2).map((event) => {
                  const style = palette[event.color];
                  return (
                    <Tooltip
                      key={event.id}
                      label={`${event.title} · ${event.start}–${event.end}`}
                      placement="top"
                      hasArrow
                      motionProps={{ transition: { duration: 0 } }}
                    >
                      <Button
                        w="full"
                        h="auto"
                        p={0}
                        bg="transparent"
                        _hover={{
                          bg:
                            mode === 'dark'
                              ? 'rgba(255,255,255,0.05)'
                              : 'rgba(15,23,42,0.04)',
                        }}
                        onClick={(eventClick) => {
                          eventClick.stopPropagation();
                          onEventClick?.(event);
                        }}
                      >
                        <Flex
                          w="full"
                          align="center"
                          gap={1.5}
                          px={1.5}
                          py={1}
                          borderRadius="lg"
                          bg={style.chipBg}
                          borderWidth="1px"
                          borderColor={style.chipBorder}
                        >
                          <Box
                            flex="1"
                            minW={0}
                            overflow="hidden"
                            textAlign="left"
                          >
                            <Text
                              color={style.text}
                              fontSize="xs"
                              fontWeight="semibold"
                              lineHeight="tight"
                              noOfLines={1}
                            >
                              {event.title}
                            </Text>
                            <Text
                              color={style.text}
                              opacity={0.7}
                              fontSize="10px"
                              noOfLines={1}
                            >
                              {event.start}–{event.end}
                            </Text>
                          </Box>
                        </Flex>
                      </Button>
                    </Tooltip>
                  );
                })}
                {dayEvents.length > 2 && (
                  <Button
                    size="xs"
                    variant="ghost"
                    color={mode === 'dark' ? 'whiteAlpha.500' : 'gray.500'}
                    h="auto"
                    borderRadius="full"
                    _hover={{
                      bg: mode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.100',
                      color: mode === 'dark' ? 'white' : 'gray.800',
                    }}
                    onClick={(eventClick) => {
                      eventClick.stopPropagation();
                      onSelectDay(day);
                    }}
                  >
                    +{dayEvents.length - 3} lainnya
                  </Button>
                )}
              </Stack>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default memo(Calendar);
