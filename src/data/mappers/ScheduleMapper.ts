import {
  type ISchedule,
  ScheduleModel,
} from '../../domain/models/ScheduleModel';

type SchedulePayload = Record<string, unknown>;

const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : String(value ?? fallback);

const pad = (value: number): string => String(value).padStart(2, '0');

const toDateOnly = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

// Backend menyimpan date sebagai TIMESTAMP sehingga payload bisa berupa
// "2026-08-17", "2026-08-17 16:00:00", "2026-08-17T16:00:00.000Z", dst.
// Frontend selalu memakai tanggal saja (YYYY-MM-DD) untuk keperluan
// kalender. Bagian tanggal literal dipakai apa adanya agar tidak
// bergeser satu hari akibat perbedaan zona waktu.
const asDateOnly = (value: unknown, fallback = ''): string => {
  if (value === undefined || value === null) return fallback;
  const text = asString(value).trim();
  const leadingDate = text.match(/^\d{4}-\d{2}-\d{2}/);
  if (leadingDate) return leadingDate[0];

  const parsed = new Date(text);
  if (!Number.isNaN(parsed.getTime())) return toDateOnly(parsed);
  return fallback;
};

export const mapToScheduleModel = (
  payload: SchedulePayload | ISchedule
): ScheduleModel => {
  const raw = payload as SchedulePayload;
  const schedule: ISchedule = {
    id: asString(raw.id ?? raw.uuid ?? raw.schedule_id),
    title: asString(raw.title ?? raw.name ?? raw.kegiatan),
    date: asDateOnly(raw.date ?? raw.tanggal),
    start_time: asString(raw.start_time ?? raw.startTime ?? raw.mulai),
    end_time: asString(raw.end_time ?? raw.endTime ?? raw.selesai),
    location: asString(raw.location ?? raw.ruangan ?? raw.room),
    peminjam: asString(
      raw.peminjam ?? raw.borrower ?? raw.borrower_name ?? raw.organizer
    ),
    note:
      typeof raw.note === 'string' && raw.note.length > 0
        ? raw.note
        : undefined,
  };

  return new ScheduleModel(schedule);
};
