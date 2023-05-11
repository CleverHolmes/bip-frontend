import LeftArrow from './LeftArrow';
import Mail from './Mail';

export const Icons = {
  LeftArrow,
  Mail,
} as const;

export type IconNames = keyof typeof Icons;
