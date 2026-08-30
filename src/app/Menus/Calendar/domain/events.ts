export type EventColor =
  'blue' | 'cyan' | 'green' | 'orange' | 'violet' | 'rose';

export interface CalendarEvent {
  id: string;
  dateKey: string;
  title: string;
  start: string;
  end: string;
  location: string;
  organizer: string;
  color: EventColor;
  note?: string;
}

export const toDateKey = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;

const enumerateWeekday = (
  year: number,
  month: number,
  weekdayIndex: number
): Date[] => {
  const lastDay = new Date(year, month + 1, 0).getDate();
  const days: Date[] = [];
  for (let date = 1; date <= lastDay; date += 1) {
    const day = new Date(year, month, date);
    if ((day.getDay() + 6) % 7 === weekdayIndex) days.push(day);
  }
  return days;
};

interface SampleEventInput {
  title: string;
  start: string;
  end: string;
  location: string;
  organizer: string;
  color: EventColor;
}

export const buildSampleEvents = (
  year: number,
  month: number
): Record<string, CalendarEvent[]> => {
  const events: CalendarEvent[] = [];
  const push = (day: Date, input: SampleEventInput): void => {
    events.push({
      id: `${toDateKey(day)}-${input.title}`,
      dateKey: toDateKey(day),
      ...input,
    });
  };

  enumerateWeekday(year, month, 0).forEach((day) =>
    push(day, {
      title: 'Latihan Teater',
      start: '16:00',
      end: '18:00',
      location: 'Hall Utama',
      organizer: 'Kelompok Teater SP',
      color: 'blue',
    })
  );
  enumerateWeekday(year, month, 2).forEach((day) =>
    push(day, {
      title: 'Kelas Akting',
      start: '13:00',
      end: '15:00',
      location: 'Ruang Latihan A',
      organizer: 'Ibu Sari',
      color: 'green',
    })
  );
  enumerateWeekday(year, month, 3).forEach((day) => {
    push(day, {
      title: 'Rehearsal Band',
      start: '18:00',
      end: '21:00',
      location: 'Studio Musik',
      organizer: 'Band Kampus',
      color: 'orange',
    });
    push(day, {
      title: 'Latihan Tari Tradisional',
      start: '15:00',
      end: '17:00',
      location: 'Hall Utama',
      organizer: 'Sanggar SP',
      color: 'rose',
    });
  });
  enumerateWeekday(year, month, 4).forEach((day) =>
    push(day, {
      title: 'Meeting Produksi',
      start: '10:00',
      end: '11:30',
      location: 'Ruang Meeting',
      organizer: 'Tim Produksi',
      color: 'violet',
    })
  );
  enumerateWeekday(year, month, 5).forEach((day) =>
    push(day, {
      title: 'Photoshoot Studio',
      start: '09:00',
      end: '12:00',
      location: 'Ruang Latihan A',
      organizer: 'Divisi Media',
      color: 'cyan',
    })
  );

  const fixedEvents: Array<{ day: number; input: SampleEventInput }> = [
    {
      day: 5,
      input: {
        title: 'Audisi Umum',
        start: '08:00',
        end: '12:00',
        location: 'Hall Utama',
        organizer: 'Panitia Auditorium',
        color: 'violet',
      },
    },
    {
      day: 12,
      input: {
        title: 'Seminar Seni & Teknologi',
        start: '09:00',
        end: '14:00',
        location: 'Auditorium',
        organizer: 'HMJ Seni',
        color: 'blue',
      },
    },
    {
      day: 20,
      input: {
        title: 'Pementasan Akhir Bulan',
        start: '19:00',
        end: '21:30',
        location: 'Hall Utama',
        organizer: 'Kemahasiswaan',
        color: 'rose',
      },
    },
    {
      day: 27,
      input: {
        title: 'Workshop Tata Cahaya',
        start: '14:00',
        end: '17:00',
        location: 'Ruang Meeting',
        organizer: 'Pak Budi',
        color: 'green',
      },
    },
  ];
  fixedEvents.forEach(({ day, input }) =>
    push(new Date(year, month, day), input)
  );

  const byDate: Record<string, CalendarEvent[]> = {};
  events.forEach((event) => {
    byDate[event.dateKey] = byDate[event.dateKey] ?? [];
    byDate[event.dateKey].push(event);
  });
  Object.values(byDate).forEach((list) =>
    list.sort((a, b) => a.start.localeCompare(b.start))
  );
  return byDate;
};
