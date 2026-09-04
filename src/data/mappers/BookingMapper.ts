import {
  type BookingStatus,
  type BookingType,
  type IBooking,
  type IBookingItem,
  BookingModel,
} from '../../domain/models/BookingModel';

type BookingPayload = Record<string, unknown>;

const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : String(value ?? fallback);

const getType = (value: unknown): BookingType =>
  value === 'room' ? 'room' : 'equipment';

const getStatus = (value: unknown): BookingStatus => {
  if (
    value === 'pending' ||
    value === 'reviewing' ||
    value === 'approved' ||
    value === 'rejected' ||
    value === 'completed'
  ) {
    return value;
  }
  // Kompatibilitas status lama ("process") dianggap "pending".
  return 'pending';
};

const asNumber = (value: unknown): number | undefined => {
  const num =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number.parseFloat(value)
        : Number.NaN;
  return Number.isFinite(num) && num > 0 ? num : undefined;
};

const parseItems = (raw: unknown): IBookingItem[] | undefined => {
  if (!Array.isArray(raw)) return undefined;
  const items: IBookingItem[] = [];
  for (const entry of raw) {
    if (typeof entry !== 'object' || entry === null) continue;
    const item = entry as Record<string, unknown>;
    const nestedInventory =
      typeof item.inventory === 'object' && item.inventory !== null
        ? (item.inventory as Record<string, unknown>)
        : undefined;
    const quantity = asNumber(item.quantity) ?? 1;
    items.push({
      id: asString(item.id ?? ''),
      inventory_id: asString(item.inventory_id ?? nestedInventory?.id ?? ''),
      quantity,
      inventory_name: nestedInventory
        ? asString(nestedInventory.name)
        : typeof item.inventory_name === 'string'
          ? item.inventory_name
          : undefined,
      inventory_category: nestedInventory
        ? asString(nestedInventory.category)
        : typeof item.inventory_category === 'string'
          ? item.inventory_category
          : undefined,
    });
  }
  return items;
};

export const mapToBookingModel = (
  payload: BookingPayload | IBooking
): BookingModel => {
  const raw = payload as BookingPayload;

  const booking: IBooking = {
    id: asString(raw.id ?? raw.uuid ?? raw.booking_id),
    borrower: asString(raw.borrower ?? raw.borrower_name ?? raw.peminjam),
    type: getType(raw.type),
    letter_file:
      typeof raw.letter_file === 'string' && raw.letter_file.length > 0
        ? raw.letter_file
        : undefined,
    title:
      typeof raw.title === 'string' && raw.title.length > 0
        ? raw.title
        : typeof raw.purpose === 'string' && raw.purpose.length > 0
          ? raw.purpose
          : undefined,
    reason_rejected:
      typeof raw.reason_rejected === 'string' && raw.reason_rejected.length > 0
        ? raw.reason_rejected
        : undefined,
    items: parseItems(raw.items),
    date: asString(raw.date),
    end_date:
      typeof raw.end_date === 'string' && raw.end_date.length > 0
        ? raw.end_date
        : undefined,
    start_time:
      typeof raw.start_time === 'string' && raw.start_time.length > 0
        ? raw.start_time
        : undefined,
    end_time:
      typeof raw.end_time === 'string' && raw.end_time.length > 0
        ? raw.end_time
        : undefined,
    repeat:
      raw.repeat === 'daily' ||
      raw.repeat === 'weekly' ||
      raw.repeat === 'monthly'
        ? raw.repeat
        : undefined,
    repeat_end:
      typeof raw.repeat_end === 'string' && raw.repeat_end.length > 0
        ? raw.repeat_end
        : undefined,
    status: getStatus(raw.status),
    note:
      typeof raw.note === 'string' && raw.note.length > 0
        ? raw.note
        : undefined,
  };

  return new BookingModel(booking);
};
