import { IconifyIconName } from "@iconify/react";

type MenuItem = 'group' | 'item' | 'collapse'

export interface ChildrenMenuItems {
  id: string,
  title: string,
  label?: string,
  type: MenuItem,
  icon?: IconifyIconName | string,
  url?: string,
  breadcrumbs?: boolean,
  children?: ChildrenMenuItems[]
}

export interface MenuItemProps {
  id: string,
  title: string,
  type: MenuItem,
  children: ChildrenMenuItems[]
}