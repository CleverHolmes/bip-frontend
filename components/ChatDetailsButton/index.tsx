import React, { useState, FC } from 'react';

import OwnImage from 'components/Image';
import Icon from 'components/Icon';

type PropsIcon = {
  url: string;
  size: number;
};

type Props = {
  title: string;
  subTitle?: string;
  subTitle2?: string;
  extraButtonOption1?: string;
  extraButtonOption2?: string;
  icon?: PropsIcon;
  active?: boolean;
  rejected?: boolean;
  showContentButton?: boolean;
  onClick?: () => void;
  onClick2?: () => void;
  onClickJustToggle?: boolean;
  content?: React.ReactNode;
  glowColor?: string;
};

const ChatDetailsButton: FC<Props> = ({
  title,
  subTitle,
  subTitle2,
  extraButtonOption1,
  extraButtonOption2,
  icon,
  active,
  rejected,
  showContentButton,
  onClick,
  onClick2,
  onClickJustToggle,
  content,
  glowColor,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = (event: React.MouseEvent<SVGSVGElement>) => {
    event.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleClick = () => {
    if (onClick && !showContentButton) onClick();
    else if (showContentButton && !onClickJustToggle) {
      setIsOpen(!isOpen);
    }
  };

  const handleClickJustToggle = () => {
    if (showContentButton && onClickJustToggle) {
      setIsOpen(!isOpen);
    }
  };

  const handleClickOutsideToggle = () => {
    if (showContentButton && onClickJustToggle) {
      onClick && onClick();
    }
  };

  const handleClickOutsideToggle2 = () => {
    if (showContentButton && onClickJustToggle) {
      onClick2 && onClick2();
    }
  };

  return (
    <div
      className={`flex relative ${
        showContentButton ? 'flex-col' : 'flex-row min-h-[65px]'
      } ${
        !showContentButton && !icon ? 'min-h-[auto] max-h-[65px]' : ''
      } pl-1 py-3 gap-2 transition-all duration-300 cursor-pointer pr-3 my-3 shadow-lg rounded-2xl hover:bg-backgroundInput
      ${glowColor ? ` border-${glowColor} border-2` : ''} 
      `}
      onClick={handleClick}
    >
      <div className="flex flex-row items-center w-full">
        {icon && (
          <OwnImage
            src={icon.url}
            alt={title}
            width={icon.size}
            layout="fill"
            className="ml-4 mr-2 bg-none"
          />
        )}
        <div className="w-full">
          <div
            className={`${
              !icon ? 'pl-4' : ''
            } text-lg font-bold font-custom1 text-primary w-full ${
              active
                ? 'text-green'
                : rejected
                ? 'text-redButton'
                : 'text-primary'
            }`}
          >
            <div className="flex flex-row items-center justify-between w-full p-2">
              <span className="text-lg font-bold font-custom1"> {title}</span>
              <div className="flex">
                {subTitle && (
                  <span
                    className="text-sm font-medium text-blue-200"
                    onClick={handleClickOutsideToggle}
                  >
                    {subTitle}
                  </span>
                )}
                {subTitle2 && (
                  <span
                    className="ml-4 mr-2 text-sm font-medium text-red-400"
                    onClick={handleClickOutsideToggle2}
                  >
                    {subTitle2}
                  </span>
                )}
              </div>
              {!!extraButtonOption1 && (
                <div className="flex items-center justify-center w-8 h-8 mr-8 rounded-lg">
                  <div className="relative inline-block w-full h-full group">
                    <Icon
                      name="Plus"
                      className="h-full mx-auto my-auto cursor-pointer stroke-green hover:stroke-green/70"
                      viewBox="0 0 18 18"
                      size="12"
                    />
                    <div className="absolute z-20 hidden w-64 text-base rounded-lg shadow-lg -left-40 top-8 sm:right-auto font-custom1 text-primary group-hover:block group-hover:bg-white">
                      <div
                        className="flex w-full px-8 py-3 rounded-t-lg cursor-pointer hover:bg-backgroundInput"
                        onClick={handleClickOutsideToggle}
                      >
                        {extraButtonOption1}
                      </div>

                      <div
                        className="flex w-full px-8 py-3 rounded-b-lg cursor-pointer hover:bg-backgroundInput"
                        onClick={handleClickOutsideToggle2}
                      >
                        {extraButtonOption2}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {showContentButton && (
          <div
            className="absolute flex flex-row items-start justify-between p-2 right-3"
            onClick={handleClickJustToggle}
          >
            <Icon
              name={isOpen ? 'ChevronUp' : 'ChevronDown'}
              viewBox="0 0 16 16"
              size="16"
              className="flex flex-row items-center mt-2 cursor-pointer"
              onClick={handleOpen}
            />
          </div>
        )}
      </div>

      {isOpen && showContentButton && (
        <div className="flex flex-col overflow-auto">
          <div className="p-2">
            <hr
              style={{
                width: '100%',
                border: '1px solid rgba(124, 139, 158, 0.2)',
              }}
            />
          </div>
          {content}
        </div>
      )}
    </div>
  );
};

export default ChatDetailsButton;
