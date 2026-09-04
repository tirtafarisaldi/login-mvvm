import { Badge, Tooltip } from '@chakra-ui/react';
import type { BookingStatus } from '../../../../domain/models/BookingModel';
import { useThemeStore } from '../../store/useThemeStore';
import { STATUS_LABELS } from './BookingFormModal';

const STATUS_DESCRIPTIONS: Record<BookingStatus, string> = {
  pending: 'Menunggu surat izin dari peminjam',
  reviewing: 'Menunggu persetujuan admin',
  approved: 'Peminjaman disetujui',
  rejected: 'Peminjaman ditolak',
  completed: 'Peminjaman selesai',
};

const STATUS_BADGE: Record<
  BookingStatus,
  { light: string; dark: string; text: string }
> = {
  pending: {
    light: '#fde68a',
    dark: 'rgba(245,158,11,0.16)',
    text: 'yellow',
  },
  reviewing: {
    light: '#bfdbfe',
    dark: 'rgba(59,130,246,0.16)',
    text: 'blue',
  },
  approved: {
    light: '#bbf7d0',
    dark: 'rgba(34,197,94,0.16)',
    text: 'green',
  },
  rejected: {
    light: '#fecaca',
    dark: 'rgba(239,68,68,0.16)',
    text: 'red',
  },
  completed: {
    light: '#99f6e4',
    dark: 'rgba(20,184,166,0.16)',
    text: 'teal',
  },
};

const statusTextColor = (
  status: BookingStatus,
  mode: 'dark' | 'light'
): string => {
  const t = STATUS_BADGE[status].text;
  return mode === 'dark' ? `${t}.200` : `${t}.900`;
};

const badgeBg = (status: BookingStatus, mode: 'dark' | 'light'): string =>
  mode === 'dark' ? STATUS_BADGE[status].dark : STATUS_BADGE[status].light;

const badgeBorder = (status: BookingStatus, mode: 'dark' | 'light'): string => {
  const t = STATUS_BADGE[status].text;
  return mode === 'dark' ? `${t}.400` : `${t}.600`;
};

export default function BookingStatusBadge({
  status,
}: {
  status: BookingStatus;
}) {
  const mode = useThemeStore((state) => state.mode);

  return (
    <Tooltip
      label={STATUS_DESCRIPTIONS[status]}
      hasArrow
      placement="top"
      fontSize="xs"
      openDelay={200}
    >
      <Badge
        bg={badgeBg(status, mode)}
        color={statusTextColor(status, mode)}
        border="1px solid"
        borderColor={badgeBorder(status, mode)}
        borderRadius="full"
        px={3}
        py={1}
        fontSize="11px"
        fontWeight="bold"
        cursor="help"
      >
        {STATUS_LABELS[status]}
      </Badge>
    </Tooltip>
  );
}
