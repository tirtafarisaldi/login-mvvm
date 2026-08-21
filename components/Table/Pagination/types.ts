import type { Page } from 'api-response';

export interface PaginationProps {
  page: Page;
  rowCount: number;
  event?: (page: number) => void;
  hidden: boolean | undefined;
  pageName: string;
  dataName?: string;
}
