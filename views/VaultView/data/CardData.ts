import { v4 as uuid } from 'uuid'
import { ReactNode } from 'react';
export type CardTypes = {
    id: string;
    intro: string;
    icon?: ReactNode;
  };
export const data: CardTypes[] = [
    {
        id: uuid(),
        intro: 'Investment  Contract.pdf',
    },
    {
        id: uuid(),
        intro: 'Progress Report.Xls',
    },
    {
        id: uuid(),
        intro: 'Investment Numbers.Doc',
    },
]
