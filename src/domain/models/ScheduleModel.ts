import { BaseModel } from './BaseModel';
import type { IPaginationResponse } from '../vo/Pagination';

export interface ISchedule {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  peminjam: string;
  note?: string;
}

export interface ScheduleInput {
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  peminjam: string;
  note?: string;
}

export interface ScheduleFilters {
  month: number;
  year: number;
  page: number;
  limit: number;
}

export interface ISchedulePaginationResponse extends IPaginationResponse {
  schedules: ISchedule[];
}

export class ScheduleModel extends BaseModel {
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  peminjam: string;
  note?: string;

  constructor(data: ISchedule) {
    super(data.id);
    this.title = data.title;
    this.date = data.date;
    this.start_time = data.start_time;
    this.end_time = data.end_time;
    this.location = data.location;
    this.peminjam = data.peminjam;
    this.note = data.note;
  }
}
