import type { ComponentType, CSSProperties } from 'react';
import { FaHandshake as FaHandshakeBase } from 'react-icons/fa';
import {
  BsCheckCircleFill as BsCheckCircleFillBase,
  BsExclamationTriangleFill as BsExclamationTriangleFillBase,
  BsInfoCircleFill as BsInfoCircleFillBase,
  BsXCircleFill as BsXCircleFillBase,
} from 'react-icons/bs';
import {
  FiArrowLeft as FiArrowLeftBase,
  FiArrowRight as FiArrowRightBase,
  FiCalendar as FiCalendarBase,
  FiCheck as FiCheckBase,
  FiCheckCircle as FiCheckCircleBase,
  FiClock as FiClockBase,
  FiEdit2 as FiEdit2Base,
  FiEye as FiEyeBase,
  FiGrid as FiGridBase,
  FiInbox as FiInboxBase,
  FiMenu as FiMenuBase,
  FiMoon as FiMoonBase,
  FiPackage as FiPackageBase,
  FiPaperclip as FiPaperclipBase,
  FiPlus as FiPlusBase,
  FiSun as FiSunBase,
  FiTrash2 as FiTrash2Base,
  FiUpload as FiUploadBase,
  FiUsers as FiUsersBase,
  FiX as FiXBase,
} from 'react-icons/fi';

export interface AppIconProps {
  size?: number | string;
  color?: string;
  className?: string;
  style?: CSSProperties;
  title?: string;
}

export type AppIcon = ComponentType<AppIconProps>;

const toAppIcon = <T>(base: T): AppIcon => base as unknown as AppIcon;

export const FaHandshake: AppIcon = toAppIcon(FaHandshakeBase);
export const FiArrowLeft: AppIcon = toAppIcon(FiArrowLeftBase);
export const FiArrowRight: AppIcon = toAppIcon(FiArrowRightBase);
export const FiCalendar: AppIcon = toAppIcon(FiCalendarBase);
export const FiCheck: AppIcon = toAppIcon(FiCheckBase);
export const FiCheckCircle: AppIcon = toAppIcon(FiCheckCircleBase);
export const FiClock: AppIcon = toAppIcon(FiClockBase);
export const FiEdit2: AppIcon = toAppIcon(FiEdit2Base);
export const FiEye: AppIcon = toAppIcon(FiEyeBase);
export const FiGrid: AppIcon = toAppIcon(FiGridBase);
export const FiInbox: AppIcon = toAppIcon(FiInboxBase);
export const FiMenu: AppIcon = toAppIcon(FiMenuBase);
export const FiMoon: AppIcon = toAppIcon(FiMoonBase);
export const FiPackage: AppIcon = toAppIcon(FiPackageBase);
export const FiPaperclip: AppIcon = toAppIcon(FiPaperclipBase);
export const FiPlus: AppIcon = toAppIcon(FiPlusBase);
export const FiSun: AppIcon = toAppIcon(FiSunBase);
export const FiTrash2: AppIcon = toAppIcon(FiTrash2Base);
export const FiUpload: AppIcon = toAppIcon(FiUploadBase);
export const FiUsers: AppIcon = toAppIcon(FiUsersBase);
export const FiX: AppIcon = toAppIcon(FiXBase);

export const BsCheckCircleFill: AppIcon = toAppIcon(BsCheckCircleFillBase);
export const BsExclamationTriangleFill: AppIcon = toAppIcon(
  BsExclamationTriangleFillBase
);
export const BsInfoCircleFill: AppIcon = toAppIcon(BsInfoCircleFillBase);
export const BsXCircleFill: AppIcon = toAppIcon(BsXCircleFillBase);
