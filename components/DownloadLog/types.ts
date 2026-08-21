import type { ParsedUrlQuery } from 'querystring';

export type Type = 'csv' | 'xls';

export interface DownloadLogProps {
  title?: string;
  payload: { [key: string]: string } | ParsedUrlQuery;
  requiredLabel?: string[];
  isRequiredPayloadFilled?: boolean;
  endpoint: string;
  handleValidation: () => void;
  types: Type[];
}
