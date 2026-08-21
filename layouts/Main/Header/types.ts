export interface Crumb {
  label: string;
  link: string;
}

export interface HeaderProps {
  crumbs: Array<string | Crumb>;
}
