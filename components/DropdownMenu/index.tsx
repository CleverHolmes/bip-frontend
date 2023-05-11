import React, { FC } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

import PopoverPanel from 'components/PopoverPanel';

export type DropdownItemType = {
  link: string;
  name: string;
  icon?: () => JSX.Element;
  highlight?: boolean;
  show?: boolean;
  onClick?: (item?: DropdownItemType) => void;
};

type Props = {
  panelClasses?: string;
  items: DropdownItemType[];
  noResults?: string;
  bottomText?: string;
  onClickBottom?: () => void;
  buttonElem: (open: boolean) => {};
};

const DropdownMenu: FC<Props> = ({
  panelClasses,
  items,
  noResults,
  buttonElem,
  bottomText,
  onClickBottom,
}) => {
  const { t } = useTranslation();
  const noResultsText = noResults || t('no-results');

  return (
    <PopoverPanel buttonElem={buttonElem} panelClasses={panelClasses}>
      {items
        .filter((item) => item.show ?? true)
        .map((item, index) => (
          <div
            className="relative"
            key={`${item.name}_${index}`}
            onClick={() => item.onClick && item.onClick(item)}
          >
            {item.highlight && (
              <div className="absolute w-3 h-3 border-2 border-white rounded-full bg-redButton -right-2 -top-2" />
            )}
            <Link href={item.link}>
              <a className="flex items-center text-base cursor-pointer font-custom2 p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-backgroundInput focus:outline-none focus-visible:ring focus-visible:ring-blueText focus-visible:ring-opacity-50 text-inputGray hover:text-button px-3 2xl:px-3.5">
                {item.icon && (
                  <div className="flex items-center justify-center w-10 h-10 text-white shrink-0 sm:h-12 sm:w-12">
                    <item.icon aria-hidden="true" />
                  </div>
                )}
                <div className={`${item.icon ? 'ml-4' : ''}`}>{item.name}</div>
              </a>
            </Link>
          </div>
        ))}
      {!items.length && <span className="text-inputGray">{noResultsText}</span>}
      {bottomText && (
        <div
          className="p-4 text-base rounded-lg cursor-pointer text-inputGray font-custom1 bg-backgroundInput hover:text-button"
          onClick={onClickBottom}
        >
          {bottomText}
        </div>
      )}
    </PopoverPanel>
  );
};

export default DropdownMenu;
