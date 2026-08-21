import { Page } from 'api-response';
import { Dispatch, ReactNode, SetStateAction } from 'react';
import { Pagination } from 'src/domain/vo/Pagination';

export interface GeneralTableProps {
  id?: string;
  data: any;
  loading: boolean;
  columns: any;
  page?: Pagination | null;
  pageName?: string;
  pageDataName?: string;
  pageEvent?: (page: number) => void;
  customSkeleton?: ReactNode;
  rowOnClickUrl?: string;
  rowOnClickDynamicRoute?: string;
  skeletonTotalRow?: number;
  rowHeight?: number;
  emptyMessage?: string;
  emptyMessageFilter?: string;
  emptyMessageDescription?: string;
  emptyMessageDescriptionFilter?: string;
  isFilter?: boolean;
  wrapper?: ReactNode;
  coloredRow?: {
    color: string;
    field: string;
    value: any;
  };
  isBordered?: boolean;
  totals?: any;
  setOrder?: Dispatch<
    SetStateAction<{
      by: string;
      type: string;
    }>
  >;
}
