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
          bg="whiteAlpha.100"
          borderColor="whiteAlpha.300"
          color={value ? 'white' : 'whiteAlpha.500'}
          fontSize="sm"
          fontWeight="medium"
          _hover={{ bg: 'whiteAlpha.200', borderColor: 'whiteAlpha.400' }}
          leftIcon={<TimeIcon color="blue.300" boxSize={4} />}
        >
          {value || 'Pilih jam'}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        w="256px"
        bg="rgba(10,12,18,0.95)"
        color="white"
        borderWidth="1px"
        borderColor="rgba(255,255,255,0.14)"
        borderRadius="2xl"
        boxShadow="0 24px 80px rgba(0,0,0,.6)"
        backdropFilter="blur(20px)"
      >
        <PopoverBody p={3}>
          <Text
            color="whiteAlpha.500"
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
                color={pickedHour === hour ? 'white' : 'whiteAlpha.700'}
                _hover={
                  pickedHour === hour
                    ? undefined
                    : { bg: 'whiteAlpha.100', color: 'white' }
                }
                onClick={() => pickHour(pickedHour)}
              >
                {pad(pickedHour)}
              </Button>
            ))}
          </Box>

          <Text
            color="whiteAlpha.500"
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
                color={pickedMinute === minute ? 'white' : 'whiteAlpha.700'}
                _hover={
                  pickedMinute === minute
                    ? undefined
                    : { bg: 'whiteAlpha.100', color: 'white' }
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
