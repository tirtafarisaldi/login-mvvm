import {
  CheckIcon,
  CheckCircleIcon,
  CloseIcon,
  ViewIcon,
} from '@chakra-ui/icons';
import {
  Box,
  Button,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import type {
  BookingModel,
  BookingStatus,
} from '../../../../domain/models/BookingModel';
import { TYPE_LABELS, REPEAT_LABELS } from './BookingFormModal';
import BookingStatusBadge from './BookingStatusBadge';
import { useGetBookingLetterViewModel } from '../viewModels/getBookingLetterViewModel';
import { useThemeStore } from '../../store/useThemeStore';
import { useThemeColors } from '../../store/themeColors';

interface ReviewBookingModalProps {
  booking: BookingModel | null;
  isOpen: boolean;
  onClose: () => void;
  onDecide: (status: BookingStatus, reason?: string) => Promise<void> | void;
  deciding?: boolean;
  isAdmin: boolean;
}

export default function ReviewBookingModal({
  booking,
  isOpen,
  onClose,
  onDecide,
  deciding = false,
  isAdmin,
}: ReviewBookingModalProps) {
  const mode = useThemeStore((state) => state.mode);
  const theme = useThemeColors();
  const toast = useToast();
  const { getBookingLetter } = useGetBookingLetterViewModel();
  const rejectDisclosure = useDisclosure();
  const [reason, setReason] = useState('');
  const [opening, setOpening] = useState(false);

  const openLetter = async () => {
    if (!booking) return;
    setOpening(true);
    try {
      const blob = await getBookingLetter(booking.id);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch {
      toast({
        status: 'error',
        title: 'Gagal membuka surat',
        position: 'top',
      });
    } finally {
      setOpening(false);
    }
  };

  const approve = () => void onDecide('approved');
  const complete = () => void onDecide('completed');
  const reject = () => {
    if (!reason.trim()) {
      toast({
        status: 'warning',
        title: 'Alasan wajib diisi',
        description: 'Tuliskan alasan penolakan booking.',
        position: 'top',
      });
      return;
    }
    void onDecide('rejected', reason.trim());
  };

  const status = booking?.status;
  const canApprove = Boolean(isAdmin && status === 'process');
  const canComplete = Boolean(isAdmin && status === 'approved');
  const canReject = Boolean(isAdmin && status === 'process');

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        rejectDisclosure.onClose();
        setReason('');
        onClose();
      }}
      size="md"
      motionPreset="none"
      isCentered
    >
      <ModalOverlay backdropFilter="blur(8px)" bg="blackAlpha.700" />
      <ModalContent
        bg={mode === 'dark' ? 'rgba(8,10,14,0.85)' : 'rgba(255,255,255,0.97)'}
        backdropFilter="blur(16px)"
        color={theme.textPrimary}
        borderWidth="1px"
        borderColor={theme.panelBorder}
        boxShadow="0 24px 80px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,0.08)"
        borderRadius="2xl"
        mx={4}
      >
        <ModalHeader fontSize="lg">Detail Peminjaman</ModalHeader>
        <ModalCloseButton
          color={theme.textSecondary}
          _hover={{
            color: theme.textPrimary,
            bg: mode === 'dark' ? 'whiteAlpha.200' : 'blackAlpha.100',
          }}
        />

        {booking && (
          <ModalBody>
            <Stack spacing={3}>
              {booking.reason_rejected && booking.status === 'rejected' && (
                <Box
                  p={3}
                  borderRadius="xl"
                  borderWidth="1px"
                  borderColor="rgba(239,68,68,0.5)"
                  bg={
                    mode === 'dark'
                      ? 'rgba(239,68,68,0.12)'
                      : 'rgba(239,68,68,0.06)'
                  }
                >
                  <Text fontSize="xs" fontWeight="bold" color="red.400">
                    Alasan Penolakan
                  </Text>
                  <Text fontSize="sm" mt={1} color={theme.textPrimary}>
                    {booking.reason_rejected}
                  </Text>
                </Box>
              )}

              <Flex justify="space-between" align="center">
                <Box>
                  <Text fontSize="xs" color={theme.textMuted}>
                    Peminjam
                  </Text>
                  <Text fontWeight="semibold">{booking.borrower}</Text>
                </Box>
                <BookingStatusBadge status={booking.status} />
              </Flex>

              <Divider borderColor={theme.panelBorder} />

              <Stack spacing={2} fontSize="sm">
                <Flex justify="space-between">
                  <Text color={theme.textMuted}>Jenis</Text>
                  <Text>{TYPE_LABELS[booking.type]}</Text>
                </Flex>
                {booking.type === 'equipment' ? (
                  <Box>
                    <Text color={theme.textMuted} mb={1}>
                      Peralatan
                    </Text>
                    <Stack spacing={1}>
                      {(booking.items ?? []).map((item) => (
                        <Flex
                          key={item.inventory_id}
                          justify="space-between"
                          bg={
                            mode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.50'
                          }
                          px={2}
                          py={1}
                          borderRadius="md"
                        >
                          <Text fontWeight="medium">
                            {item.inventory_name ?? item.inventory_id}
                          </Text>
                          <Text color={theme.textSecondary}>
                            {item.quantity} unit
                          </Text>
                        </Flex>
                      ))}
                    </Stack>
                  </Box>
                ) : (
                  booking.repeat &&
                  booking.repeat !== 'none' && (
                    <Flex justify="space-between">
                      <Text color={theme.textMuted}>Pengulangan</Text>
                      <Text fontWeight="medium">
                        {REPEAT_LABELS.find((r) => r.value === booking.repeat)
                          ?.label || booking.repeat}
                        {booking.repeat_end
                          ? ` · sampai ${booking.repeat_end}`
                          : ''}
                      </Text>
                    </Flex>
                  )
                )}
                <Flex justify="space-between">
                  <Text color={theme.textMuted}>Tanggal</Text>
                  <Text>
                    {booking.type === 'equipment' && booking.end_date
                      ? `${booking.date} – ${booking.end_date}`
                      : booking.date}
                  </Text>
                </Flex>
                <Flex justify="space-between">
                  <Text color={theme.textMuted}>Waktu</Text>
                  <Text>
                    {booking.type === 'room'
                      ? `${booking.start_time} – ${booking.end_time}`
                      : '—'}
                  </Text>
                </Flex>
              </Stack>

              {booking.title && (
                <Box>
                  <Text fontSize="xs" color={theme.textMuted}>
                    Judul
                  </Text>
                  <Text fontSize="sm" mt={1}>
                    {booking.title}
                  </Text>
                </Box>
              )}

              {booking.note && (
                <Box>
                  <Text fontSize="xs" color={theme.textMuted}>
                    Keterangan
                  </Text>
                  <Text fontSize="sm" mt={1}>
                    {booking.note}
                  </Text>
                </Box>
              )}

              <Flex justify="space-between" align="center" gap={3}>
                <Box minW={0}>
                  <Text fontSize="xs" color={theme.textMuted}>
                    Surat Booking
                  </Text>
                  <Text
                    fontSize="sm"
                    mt={1}
                    noOfLines={1}
                    color={theme.textSecondary}
                  >
                    {booking.letter_file ?? 'Tidak ada surat'}
                  </Text>
                </Box>
                {booking.letter_file && (
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<ViewIcon />}
                    colorScheme="blue"
                    borderRadius="full"
                    flexShrink={0}
                    onClick={openLetter}
                    isLoading={opening}
                  >
                    Buka
                  </Button>
                )}
              </Flex>
            </Stack>
          </ModalBody>
        )}

        <ModalFooter gap={3} flexDirection="column">
          {canApprove && !rejectDisclosure.isOpen && (
            <Flex gap={3} w="full">
              <Button
                flex={1}
                color="white"
                bg={mode === 'dark' ? 'rgba(34,197,94,0.25)' : 'green.600'}
                borderWidth="1px"
                borderColor={
                  mode === 'dark' ? 'rgba(74,222,128,0.5)' : 'green.600'
                }
                fontSize="sm"
                borderRadius="full"
                leftIcon={<CheckIcon />}
                isLoading={deciding}
                _hover={{
                  bg: mode === 'dark' ? 'rgba(34,197,94,0.45)' : 'green.700',
                  boxShadow:
                    mode === 'dark'
                      ? '0 0 14px rgba(34,197,94,0.35)'
                      : '0 4px 14px rgba(22,163,74,0.4)',
                }}
                onClick={approve}
              >
                Approve
              </Button>
              <Button
                flex={1}
                color={mode === 'dark' ? 'red.100' : 'red.600'}
                bg={
                  mode === 'dark'
                    ? 'rgba(239,68,68,0.25)'
                    : 'rgba(239,68,68,0.12)'
                }
                borderWidth="1px"
                borderColor="rgba(239,68,68,0.5)"
                fontSize="sm"
                borderRadius="full"
                _hover={{
                  bg: 'rgba(239,68,68,0.45)',
                  color: 'white',
                }}
                onClick={rejectDisclosure.onOpen}
              >
                Reject
              </Button>
            </Flex>
          )}

          {canReject && rejectDisclosure.isOpen && (
            <Stack spacing={3} w="full">
              <Textarea
                value={reason}
                size="sm"
                bg={mode === 'dark' ? 'whiteAlpha.100' : 'white'}
                borderColor={mode === 'dark' ? 'whiteAlpha.300' : 'gray.300'}
                borderRadius="xl"
                placeholder="Tuliskan alasan penolakan…"
                onChange={(event) => setReason(event.target.value)}
              />
              <Flex gap={3}>
                <Button
                  flex={1}
                  variant="ghost"
                  color={theme.textSecondary}
                  borderWidth="1px"
                  borderColor={theme.panelBorder}
                  borderRadius="full"
                  fontSize="sm"
                  onClick={() => {
                    setReason('');
                    rejectDisclosure.onClose();
                  }}
                >
                  Batal
                </Button>
                <Button
                  flex={1}
                  color="white"
                  bg="red.500"
                  borderWidth="1px"
                  borderColor="red.500"
                  fontSize="sm"
                  borderRadius="full"
                  leftIcon={<CloseIcon />}
                  isLoading={deciding}
                  _hover={{ bg: 'red.600' }}
                  onClick={reject}
                >
                  Tolak dengan alasan
                </Button>
              </Flex>
            </Stack>
          )}

          {canComplete && (
            <Button
              w="full"
              color="white"
              bg={mode === 'dark' ? 'rgba(20,184,166,0.25)' : 'teal.600'}
              borderWidth="1px"
              borderColor={
                mode === 'dark' ? 'rgba(45,212,191,0.5)' : 'teal.600'
              }
              fontSize="sm"
              borderRadius="full"
              leftIcon={<CheckCircleIcon />}
              isLoading={deciding}
              _hover={{
                bg: mode === 'dark' ? 'rgba(20,184,166,0.45)' : 'teal.700',
                boxShadow:
                  mode === 'dark'
                    ? '0 0 14px rgba(20,184,166,0.35)'
                    : '0 4px 14px rgba(13,148,136,0.4)',
              }}
              onClick={complete}
            >
              Selesaikan Peminjaman
            </Button>
          )}

          <Button
            w="full"
            variant="ghost"
            color={theme.textSecondary}
            borderWidth="1px"
            borderColor={theme.panelBorder}
            borderRadius="full"
            fontSize="sm"
            _hover={{
              bg: mode === 'dark' ? 'whiteAlpha.200' : 'blackAlpha.100',
              color: theme.textPrimary,
            }}
            onClick={onClose}
            isDisabled={deciding}
          >
            Tutup
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
