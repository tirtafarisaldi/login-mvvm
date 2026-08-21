import type { SidebarMenuItem } from 'common-types';

export interface SidebarItemProps {
  depthStep?: number;
  depth?: number;
  expanded?: boolean;
  item: SidebarMenuItem;
}
