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
      bg="rgba(0,0,0,0.55)"
      borderWidth="1px"
      borderColor="rgba(255,255,255,0.08)"
      backdropFilter="blur(8px)"
      boxShadow="inset 0 1px 0 rgba(255,255,255,0.06)"
      overflow="hidden"
    >
      <Flex
        align="center"
        justify="space-between"
        gap={3}
        px={{ base: 3, md: 4 }}
        py={3}
        borderBottomWidth="1px"
        borderBottomColor="rgba(255,255,255,0.08)"
      >
        <MonthPicker
          value={viewDate}
          onSelect={onViewDateChange}
          monthLabel={monthLabel}
        />
        <Flex align="center" gap={1}>
          <Button
            variant="ghost"
            color="whiteAlpha.600"
            _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
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
            color="white"
            bg="rgba(255,255,255,0.14)"
            _hover={{ bg: 'rgba(255,255,255,0.12)' }}
            size="sm"
            borderRadius="full"
            icon={<ChevronLeftIcon />}
            onClick={() => moveMonth(-1)}
          />
          <IconButton
            aria-label="Bulan berikutnya"
            variant="solid"
            color="white"
            bg="rgba(255,255,255,0.14)"
            _hover={{ bg: 'rgba(255,255,255,0.12)' }}
            size="sm"
            borderRadius="full"
            icon={<ChevronRightIcon />}
            onClick={() => moveMonth(1)}
          />
        </Flex>
      </Flex>

      <Box px={2} pt={1.5} display="grid" gridTemplateColumns="repeat(7, 1fr)">
        {WEEKDAYS.map((weekday) => (
          <Text
            key={weekday}
            color="whiteAlpha.500"
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
        bg="rgba(0,0,0,0.20)"
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
                  ? 'rgba(59,130,246,0.14)'
                  : isToday
                    ? 'rgba(255,255,255,0.045)'
                    : 'rgba(255,255,255,0.02)'
              }
              borderWidth="1px"
              borderColor={
                isSelected
                  ? 'rgba(59,130,246,0.55)'
                  : isToday
                    ? 'rgba(255,255,255,0.16)'
                    : 'rgba(255,255,255,0.04)'
              }
              boxShadow="none"
              _hover={{
                bg: 'rgba(255,255,255,0.07)',
                borderColor: 'rgba(255,255,255,0.16)',
              }}
            >
              <Flex align="center" justify="space-between" mb={1}>
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
                        ? 'whiteAlpha.800'
                        : 'whiteAlpha.300'
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
                    bg="rgba(255,255,255,0.08)"
                    color="whiteAlpha.600"
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
                    >
                      <Button
                        w="full"
                        h="auto"
                        p={0}
                        bg="transparent"
                        _hover={{ bg: 'rgba(255,255,255,0.05)' }}
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
                    color="whiteAlpha.500"
                    h="auto"
                    borderRadius="full"
                    _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
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
