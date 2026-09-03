import type { BookingInput } from '../../../domain/models/BookingModel';

export type BookingPayload = BookingInput & { letter?: File | null };

export const toBookingFormData = (input: BookingPayload): FormData => {
  const form = new FormData();
  const append = (key: string, value: unknown) => {
    if (value !== undefined && value !== null && value !== '') {
      form.append(key, String(value));
    }
  };
  append('borrower', input.borrower);
  append('type', input.type);
  if (input.items && input.items.length > 0) {
    append('items', JSON.stringify(input.items));
  }
  append('title', input.title);
  append('reason_rejected', input.reason_rejected);
  append('date', input.date);
  append('end_date', input.end_date);
  append('start_time', input.start_time);
  append('end_time', input.end_time);
  append('repeat', input.repeat);
  append('repeat_end', input.repeat_end);
  append('note', input.note);
  if (input.letter) form.append('letter', input.letter, input.letter.name);
  return form;
};

export const multipartConfig = {
  headers: { 'Content-Type': 'multipart/form-data' },
} as const;
