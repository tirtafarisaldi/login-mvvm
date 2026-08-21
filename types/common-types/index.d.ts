declare module 'common-types' {
  export type Size = 'small' | 'large';

  export interface IconProps extends React.SVGProps<SVGSVGElement> {
    width?: number;
    height?: number;
    fill?: string;
    isLine?: boolean;
    active?: boolean;
  }

  export interface SelectProps {
    value: string;
    label: string;
  }

  export interface SelectBoolProps {
    value: boolean;
    label: string;
  }

  export interface SelectPropsAsArray {
    value: string[];
    label: string[];
  }

  export interface GroupSelectProps {
    label: string;
    options: SelectProps[];
  }

  export interface SidebarMenuItem {
    name: string;
    label: string;
    icon?: string;
    MenuIcon?: ComponentType<IconProps>;
    href?: string;
    childrenHrefs?: string[];
    notAllowed?: boolean;
    items?: Array<SidebarMenuItem>;
    onClick: boolean;
    isRoot?: boolean;
  }

  export interface Bank {
    name: string;
    slug: string;
    channel_type: ChannelTypeSlug;
    icon: string;
    is_active: boolean;
    is_shown: boolean;
  }

  export interface BankAccount {
    bank_account_id: string;
    account_holder_name: string;
    account_number: string;
    is_primary: boolean;
    bank: Bank;
  }

  export interface UserBankAccount {
    account_holder_name: string;
    account_number: string;
    bank: {
      name: string;
      slug: string;
      channel_type: ChannelTypeSlug;
      icon: string;
    };
    bank_account_id: string;
    is_deleted: boolean;
    is_blacklist: boolean;
    blacklist_at: number;
    reason: string;
    deletion_date: number;
    is_verified: boolean;
    verification_date: number;
    user: User;
    uuid: string;
  }
}
