import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Heading,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  SimpleGrid,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MONTH_NAMES } from './calendar-types';
import { useThemeStore } from '../../src/app/Menus/store/useThemeStore';

interface MonthPickerProps {
  value: Date;
  onSelect: (date: Date) => void;
  monthLabel: string;
}

export default function MonthPicker({
  value,
  onSelect,
  monthLabel,
}: MonthPickerProps) {
  const popover = useDisclosure();
  const mode = useThemeStore((state) => state.mode);
  const [pickerYear, setPickerYear] = useState(value.getFullYear());

  useEffect(() => {
    setPickerYear(value.getFullYear());
  }, [value]);

  return (
    <Popover
      placement="bottom-start"
      isOpen={popover.isOpen}
      onOpen={popover.onOpen}
      onClose={popover.onClose}
      isLazy
    >
      <PopoverTrigger>
        <Button
          variant="ghost"
          h="auto"
          px={4}
          py={2.5}
          borderRadius="full"
          bg={
            mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.05)'
          }
          borderWidth="1px"
          borderColor={
            mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)'
          }
          color={mode === 'dark' ? 'white' : 'gray.800'}
          boxShadow="inset 0 1px 0 rgba(255,255,255,0.06)"
          _hover={{
            bg:
              mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.09)',
            borderColor:
              mode === 'dark' ? 'rgba(255,255,255,0.22)' : 'rgba(15,23,42,0.2)',
          }}
          _active={{
            bg:
              mode === 'dark'
                ? 'rgba(255,255,255,0.14)'
                : 'rgba(15,23,42,0.12)',
          }}
          rightIcon={
            <ChevronDownIcon
              boxSize={4}
              color={mode === 'dark' ? 'whiteAlpha.400' : 'gray.500'}
            />
          }
        >
          <Heading
            size="sm"
            color={mode === 'dark' ? 'white' : 'gray.800'}
            letterSpacing="tight"
          >
            {monthLabel}
          </Heading>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        w="296px"
        bg={mode === 'dark' ? 'rgba(10,12,18,0.96)' : 'rgba(255,255,255,0.98)'}
        color={mode === 'dark' ? 'white' : 'gray.800'}
        borderWidth="1px"
        borderColor={
          mode === 'dark' ? 'rgba(255,255,255,0.14)' : 'rgba(15,23,42,0.12)'
        }
        borderRadius="2xl"
        boxShadow="0 24px 80px rgba(0,0,0,.6)"
        backdropFilter="blur(20px)"
      >
        <PopoverBody p={4}>
          <Flex
            align="center"
            justify="space-between"
            pb={3}
            mb={3}
            borderBottomWidth="1px"
            borderBottomColor={
              mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.1)'
            }
          >
            <IconButton
              aria-label="Tahun sebelumnya"
              variant="ghost"
              color={mode === 'dark' ? 'whiteAlpha.600' : 'gray.600'}
              _hover={{
                bg: mode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.100',
                color: mode === 'dark' ? 'white' : 'gray.900',
              }}
              size="sm"
              borderRadius="full"
              icon={<ChevronLeftIcon />}
              onClick={() => setPickerYear((current) => current - 1)}
            />
            <Text fontWeight="bold" fontSize="sm" letterSpacing="wide">
              {pickerYear}
            </Text>
            <IconButton
              aria-label="Tahun berikutnya"
              variant="ghost"
              color={mode === 'dark' ? 'whiteAlpha.600' : 'gray.600'}
              _hover={{
                bg: mode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.100',
                color: mode === 'dark' ? 'white' : 'gray.900',
              }}
              size="sm"
              borderRadius="full"
              icon={<ChevronRightIcon />}
              onClick={() => setPickerYear((current) => current + 1)}
            />
          </Flex>
          <SimpleGrid columns={3} spacing={2}>
            {MONTH_NAMES.map((monthName, index) => {
              const active =
                index === value.getMonth() &&
                pickerYear === value.getFullYear();
              return (
                <Button
                  key={monthName}
                  size="sm"
                  py={2.5}
                  px={2}
                  borderRadius="xl"
                  bg={
                    active
                      ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                      : 'transparent'
                  }
                  color={
                    active
                      ? 'white'
                      : mode === 'dark'
                        ? 'whiteAlpha.700'
                        : 'gray.600'
                  }
                  fontWeight={active ? 'bold' : 'medium'}
                  boxShadow={
                    active ? '0 4px 18px rgba(59,130,246,0.45)' : 'none'
                  }
                  _hover={
                    active
                      ? undefined
                      : {
                          bg:
                            mode === 'dark'
                              ? 'rgba(255,255,255,0.08)'
                              : 'rgba(15,23,42,0.07)',
                          color: mode === 'dark' ? 'white' : 'gray.900',
                          transform: 'translateY(-1px)',
                        }
                  }
                  _active={{ transform: 'translateY(0)' }}
                  onClick={() => {
                    onSelect(new Date(pickerYear, index, 1));
                    popover.onClose();
                  }}
                >
                  {monthName}
                </Button>
              );
            })}
          </SimpleGrid>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
