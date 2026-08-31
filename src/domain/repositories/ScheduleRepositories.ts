import type {
  ScheduleFilters,
  ScheduleInput,
  ScheduleModel,
} from '../models/ScheduleModel';
import type { IPaginationResponse } from '../vo/Pagination';
import type { PaginationResult } from '../vo/PaginationResult';
import type { Result } from '../vo/Result';

export interface ScheduleListResult extends IPaginationResponse {
  schedules: ScheduleModel[];
}

export interface ScheduleRepository {
  getSchedules: (filters: ScheduleFilters) => Promise<ScheduleListResult>;
  getScheduleById: (id: string) => Promise<ScheduleModel>;
  createSchedule: (input: ScheduleInput) => Promise<ScheduleModel>;
  updateSchedule: (id: string, input: ScheduleInput) => Promise<ScheduleModel>;
  deleteSchedule: (id: string) => Promise<void>;
}

export interface GetSchedulesResult {
  result: PaginationResult<ScheduleModel>;
}

export interface CreateScheduleResult {
  result: Result<ScheduleModel>;
  createSchedule: (input: ScheduleInput) => Promise<Result<ScheduleModel>>;
}

export interface UpdateScheduleResult {
  result: Result<ScheduleModel>;
  updateSchedule: (
    id: string,
    input: ScheduleInput
  ) => Promise<Result<ScheduleModel>>;
}

export interface DeleteScheduleResult {
  result: Result<boolean>;
  deleteSchedule: (id: string) => Promise<Result<boolean>>;
}

export interface GetScheduleByIdResult {
  getScheduleById: (id: string) => Promise<ScheduleModel>;
}
