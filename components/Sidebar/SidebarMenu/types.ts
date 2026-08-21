import type { SidebarMenuItem } from 'common-types';

export interface SidebarMenuProps {
  items: Array<SidebarMenuItem>;
  depthStep?: number;
  depth?: number;
  expanded?: boolean;
}
