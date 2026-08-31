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
          bg="rgba(255,255,255,0.05)"
          borderWidth="1px"
          borderColor="rgba(255,255,255,0.12)"
          color="white"
          boxShadow="inset 0 1px 0 rgba(255,255,255,0.06)"
          _hover={{
            bg: 'rgba(255,255,255,0.1)',
            borderColor: 'rgba(255,255,255,0.22)',
          }}
          _active={{ bg: 'rgba(255,255,255,0.14)' }}
          rightIcon={<ChevronDownIcon boxSize={4} color="whiteAlpha.400" />}
        >
          <Heading size="sm" color="white" letterSpacing="tight">
            {monthLabel}
          </Heading>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        w="296px"
        bg="rgba(10,12,18,0.96)"
        color="white"
        borderWidth="1px"
        borderColor="rgba(255,255,255,0.14)"
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
            borderBottomColor="rgba(255,255,255,0.08)"
          >
            <IconButton
              aria-label="Tahun sebelumnya"
              variant="ghost"
              color="whiteAlpha.600"
              _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
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
              color="whiteAlpha.600"
              _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
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
                  color={active ? 'white' : 'whiteAlpha.700'}
                  fontWeight={active ? 'bold' : 'medium'}
                  boxShadow={
                    active ? '0 4px 18px rgba(59,130,246,0.45)' : 'none'
                  }
                  _hover={
                    active
                      ? undefined
                      : {
                          bg: 'rgba(255,255,255,0.08)',
                          color: 'white',
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
