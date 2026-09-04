import {
  ArrowUpIcon,
  AttachmentIcon,
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
  Spinner,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
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
  onUploadLetter?: (file: File) => Promise<void> | void;
  uploadingLetter?: boolean;
}

export default function ReviewBookingModal({
  booking,
  isOpen,
  onClose,
  onDecide,
  deciding = false,
  isAdmin,
  onUploadLetter,
  uploadingLetter = false,
}: ReviewBookingModalProps) {
  const mode = useThemeStore((state) => state.mode);
  const theme = useThemeColors();
  const toast = useToast();
  const { getBookingLetter } = useGetBookingLetterViewModel();
  const rejectDisclosure = useDisclosure();
  const letterInputRef = useRef<HTMLInputElement>(null);
  const [reason, setReason] = useState('');
  const [opening, setOpening] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  const selectFile = (file: File | undefined) => {
    if (!file || !onUploadLetter) return;
    if (file.size > 2 * 1024 * 1024) {
      toast({
        status: 'warning',
        title: 'File terlalu besar',
        description: 'Ukuran surat maksimal 2 MB.',
        position: 'top',
      });
      return;
    }
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast({
        status: 'warning',
        title: 'Format tidak didukung',
        description: 'Surat harus berformat PDF.',
        position: 'top',
      });
      return;
    }
    setSelectedFile(file);
  };

  const handleLetterFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    selectFile(file);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragging(false);
    selectFile(event.dataTransfer.files?.[0]);
  };

  const resetSelectedFile = () => setSelectedFile(null);

  const submitLetter = async () => {
    if (!selectedFile || !onUploadLetter) return;
    try {
      await onUploadLetter(selectedFile);
      toast({
        status: 'success',
        title: 'Surat berhasil diunggah',
        description: 'Peminjaman kini menunggu persetujuan admin.',
        position: 'top',
      });
      onClose();
    } catch {
      toast({
        status: 'error',
        title: 'Gagal mengunggah surat',
        position: 'top',
      });
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
  const canApprove = Boolean(isAdmin && status === 'reviewing');
  const canComplete = Boolean(isAdmin && status === 'approved');
  const canReject = Boolean(isAdmin && status === 'reviewing');
  const canUploadLetter = Boolean(
    status === 'pending' && !booking?.letter_file && onUploadLetter
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        rejectDisclosure.onClose();
        setReason('');
        setSelectedFile(null);
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

              <Flex justify="space-between" align="flex-start" gap={3}>
                <Box minW={0}>
                  <Text fontSize="xs" color={theme.textMuted}>
                    Judul
                  </Text>
                  <Text
                    fontWeight="bold"
                    fontSize="md"
                    noOfLines={2}
                  >
                    {booking.title || 'Tanpa judul'}
                  </Text>
                </Box>
                <BookingStatusBadge status={booking.status} />
              </Flex>

              <Divider borderColor={theme.panelBorder} />

              <Stack spacing={2} fontSize="sm">
                <Flex justify="space-between">
                  <Text color={theme.textMuted}>Peminjam</Text>
                  <Text fontWeight="medium">{booking.borrower}</Text>
                </Flex>
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

              {canUploadLetter && (
                <Box>
                  <input
                    ref={letterInputRef}
                    type="file"
                    accept=".pdf"
                    hidden
                    onChange={handleLetterFile}
                  />
                  {selectedFile && !uploadingLetter ? (
                    <>
                      <Flex
                        align="center"
                        gap={3}
                        p={3.5}
                        borderRadius="2xl"
                        bg={
                          mode === 'dark'
                            ? 'rgba(59,130,246,0.1)'
                            : 'blue.50'
                        }
                        borderWidth="1px"
                        borderColor={
                          mode === 'dark'
                            ? 'rgba(59,130,246,0.3)'
                            : 'blue.200'
                        }
                      >
                        <Flex
                          w={11}
                          h={11}
                          flexShrink={0}
                          borderRadius="lg"
                          alignItems="center"
                          justifyContent="center"
                          bg={
                            mode === 'dark'
                              ? 'rgba(59,130,246,0.2)'
                              : 'white'
                          }
                          color="blue.500"
                        >
                          <AttachmentIcon boxSize={5} />
                        </Flex>
                        <Box minW={0} flex={1}>
                          <Text
                            fontWeight="semibold"
                            fontSize="sm"
                            color={theme.textPrimary}
                            noOfLines={1}
                          >
                            {selectedFile.name}
                          </Text>
                          <Text
                            fontSize="xs"
                            color={theme.textMuted}
                            mt={0.5}
                          >
                            {(selectedFile.size / 1024).toFixed(1)} KB · PDF
                          </Text>
                        </Box>
                        <Button
                          size="sm"
                          variant="ghost"
                          colorScheme="blue"
                          borderRadius="full"
                          flexShrink={0}
                          onClick={resetSelectedFile}
                          leftIcon={<CloseIcon boxSize={3} />}
                        >
                          Ganti
                        </Button>
                      </Flex>
                      <Button
                        w="full"
                        mt={3}
                        color="white"
                        bg={mode === 'dark' ? 'rgba(37,99,235,0.3)' : 'blue.600'}
                        borderWidth="1px"
                        borderColor={
                          mode === 'dark'
                            ? 'rgba(59,130,246,0.5)'
                            : 'blue.600'
                        }
                        fontSize="sm"
                        borderRadius="full"
                        leftIcon={<CheckIcon />}
                        _hover={{
                          bg: mode === 'dark' ? 'rgba(37,99,235,0.5)' : 'blue.700',
                          boxShadow: '0 0 16px rgba(59,130,246,0.25)',
                        }}
                        onClick={submitLetter}
                      >
                        Submit Surat
                      </Button>
                    </>
                  ) : (
                    <Box
                      role="button"
                      tabIndex={0}
                      cursor={uploadingLetter ? 'default' : 'pointer'}
                      onClick={() => {
                        if (!uploadingLetter) letterInputRef.current?.click();
                      }}
                      onKeyDown={(event) => {
                        if (
                          !uploadingLetter &&
                          (event.key === 'Enter' || event.key === ' ')
                        ) {
                          letterInputRef.current?.click();
                        }
                      }}
                      onDrop={handleDrop}
                      onDragOver={(event) => {
                        event.preventDefault();
                        if (!uploadingLetter) setDragging(true);
                      }}
                      onDragLeave={() => setDragging(false)}
                      borderWidth="2px"
                      borderStyle="dashed"
                      borderColor={
                        uploadingLetter
                          ? theme.panelBorder
                          : dragging
                            ? 'blue.400'
                            : mode === 'dark'
                              ? 'rgba(255,255,255,0.16)'
                              : 'gray.300'
                      }
                      borderRadius="2xl"
                      p={6}
                      textAlign="center"
                      bg={
                        uploadingLetter
                          ? mode === 'dark'
                            ? 'rgba(59,130,246,0.08)'
                            : 'blue.50'
                          : dragging
                            ? mode === 'dark'
                              ? 'rgba(59,130,246,0.16)'
                              : 'blue.50'
                            : mode === 'dark'
                              ? 'rgba(255,255,255,0.03)'
                              : 'gray.50'
                      }
                      transition="all 0.18s"
                      _hover={
                        uploadingLetter
                          ? undefined
                          : {
                              borderColor: 'blue.400',
                              bg:
                                mode === 'dark'
                                  ? 'rgba(59,130,246,0.1)'
                                  : 'blue.50',
                            }
                      }
                    >
                      {uploadingLetter ? (
                        <>
                          <Flex justify="center" mb={2}>
                            <Spinner
                              thickness="3px"
                              size="md"
                              speed="0.7s"
                              color="blue.400"
                            />
                          </Flex>
                          <Text
                            fontSize="sm"
                            fontWeight="semibold"
                            color={theme.textPrimary}
                          >
                            Mengunggah surat…
                          </Text>
                          <Text fontSize="xs" color={theme.textMuted} mt={1}>
                            File sedang diproses
                          </Text>
                        </>
                      ) : (
                        <>
                          <Flex justify="center" mb={3}>
                            <Flex
                              w={12}
                              h={12}
                              borderRadius="2xl"
                              alignItems="center"
                              justifyContent="center"
                              bg={
                                mode === 'dark'
                                  ? 'rgba(59,130,246,0.16)'
                                  : 'blue.50'
                              }
                              borderWidth="1px"
                              borderColor={
                                mode === 'dark'
                                  ? 'rgba(59,130,246,0.35)'
                                  : 'blue.200'
                              }
                              color={dragging ? 'blue.400' : 'blue.500'}
                            >
                              <ArrowUpIcon boxSize={6} />
                            </Flex>
                          </Flex>
                          <Text
                            fontSize="sm"
                            fontWeight="semibold"
                            color={theme.textPrimary}
                          >
                            Klik atau seret file ke sini
                          </Text>
                          <Text fontSize="xs" color={theme.textSecondary} mt={1}>
                            <Text
                              as="span"
                              color="blue.400"
                              fontWeight="medium"
                            >
                              Pilih file
                            </Text>{' '}
                            atau letakkan surat di sini — PDF, maks. 2 MB
                          </Text>
                        </>
                      )}
                    </Box>
                  )}
                </Box>
              )}
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
