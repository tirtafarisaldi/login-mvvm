import { TimeIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useThemeStore } from '../../src/app/Menus/store/useThemeStore';

const HOURS = Array.from({ length: 24 }, (_, index) => index);
const MINUTES = [0, 15, 30, 45];

const pad = (number: number): string => String(number).padStart(2, '0');

interface TimePickerFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TimePickerField({
  value,
  onChange,
}: TimePickerFieldProps) {
  const disclosure = useDisclosure();
  const mode = useThemeStore((state) => state.mode);
  const [hour, minute] = (value || '08:00').split(':').map(Number);

  const pickHour = (pickedHour: number): void =>
    onChange(`${pad(pickedHour)}:${pad(minute)}`);
  const pickMinute = (pickedMinute: number): void =>
    onChange(`${pad(hour)}:${pad(pickedMinute)}`);

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
            <TimeIcon
              color={mode === 'dark' ? 'blue.300' : 'blue.600'}
              boxSize={4}
            />
          }
        >
          {value || 'Pilih jam'}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        w="256px"
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
          <Text
            color={mode === 'dark' ? 'whiteAlpha.500' : 'gray.500'}
            fontSize="xs"
            fontWeight="bold"
            letterSpacing="wide"
            textTransform="uppercase"
            mb={2}
          >
            Jam
          </Text>
          <Box display="grid" gridTemplateColumns="repeat(6, 1fr)" gap={1}>
            {HOURS.map((pickedHour) => (
              <Button
                key={pickedHour}
                size="xs"
                h={7}
                px={0}
                borderRadius="md"
                bg={pickedHour === hour ? 'blue.600' : 'transparent'}
                color={
                  pickedHour === hour
                    ? 'white'
                    : mode === 'dark'
                      ? 'whiteAlpha.700'
                      : 'gray.600'
                }
                _hover={
                  pickedHour === hour
                    ? undefined
                    : {
                        bg:
                          mode === 'dark'
                            ? 'whiteAlpha.100'
                            : 'rgba(15,23,42,0.06)',
                        color: mode === 'dark' ? 'white' : 'gray.900',
                      }
                }
                onClick={() => pickHour(pickedHour)}
              >
                {pad(pickedHour)}
              </Button>
            ))}
          </Box>

          <Text
            color={mode === 'dark' ? 'whiteAlpha.500' : 'gray.500'}
            fontSize="xs"
            fontWeight="bold"
            letterSpacing="wide"
            textTransform="uppercase"
            mt={3}
            mb={2}
          >
            Menit
          </Text>
          <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={1}>
            {MINUTES.map((pickedMinute) => (
              <Button
                key={pickedMinute}
                size="xs"
                h={7}
                borderRadius="md"
                bg={pickedMinute === minute ? 'blue.600' : 'transparent'}
                color={
                  pickedMinute === minute
                    ? 'white'
                    : mode === 'dark'
                      ? 'whiteAlpha.700'
                      : 'gray.600'
                }
                _hover={
                  pickedMinute === minute
                    ? undefined
                    : {
                        bg:
                          mode === 'dark'
                            ? 'whiteAlpha.100'
                            : 'rgba(15,23,42,0.06)',
                        color: mode === 'dark' ? 'white' : 'gray.900',
                      }
                }
                onClick={() => pickMinute(pickedMinute)}
              >
                {pad(pickedMinute)}
              </Button>
            ))}
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
