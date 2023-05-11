import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';

import Icon from 'components/new/Icon';
import { IconNames } from 'components/new/Icon/icons';
import Card from 'components/new/Card';

type InfoBlockProperties = {
  className?: string;
  title: string;
  icon: IconNames;
  labelsTitle?: string;
  labels: string[];
};

const InfoBlock: React.FC<InfoBlockProperties> = ({
  className,
  title,
  icon,
  labelsTitle,
  labels,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewAll, setViewAll] = useState(false);
  const labelsParentRef = useRef<any>(null);
  const labelsRef = useRef<any>(null);

  const toggleIconName = isOpen ? 'Up' : 'Down';
  const { t } = useTranslation();

  const toggle = () => {
    setIsOpen((prevState) => !prevState);
  };

  const labelClassName = [
    isOpen ? 'flex-wrap' : 'flex-nowrap overflow-hidden',
  ].join('');

  useLayoutEffect(() => {
    const showViewAll = () => {
      let res = false;
      const gradientWidth = 53;
      if (labelsParentRef.current && labelsRef.current) {
        let childWidth = 0;
        labelsRef.current.childNodes.forEach((c: any) => {
          childWidth += c.offsetWidth;
        });
        res = labelsParentRef.current.offsetWidth - gradientWidth < childWidth;
      }
      setViewAll(res);
    };
    if (labelsParentRef.current && labelsRef.current) {
      window.addEventListener('resize', showViewAll);
      showViewAll();
    }
    return () => window.removeEventListener('resize', showViewAll);
  }, [labelsParentRef, labelsRef]);

  return (
    <Card className={`${className} flex flex-col`}>
      <div className="flex flex-row gap-2.5 items-center">
        <div className="flex shrink-0">
          <Icon name={icon} />
        </div>
        <div className="text-lg font-bold text-grayN500">{title}</div>
      </div>

      <div className="flex flex-col mt-20 mb-16" ref={labelsParentRef}>
        {labelsTitle && (
          <div className="text-grayN75 text-xs">{labelsTitle}</div>
        )}
        <div
          className={`flex flex-row relative gap-2 ${
            !labelsTitle ? 'mt-20' : 'mt-4'
          } ${labelClassName}`}
          ref={labelsRef}
        >
          {labels?.map((l: string, i: number) => (
            <div
              key={i}
              className="bg-grayN50 text-grayN100 text-sm px-4 h-28 rounded flex shrink-0 items-center"
            >
              {l}
            </div>
          ))}
          {viewAll && !isOpen && (
            <div className="absolute w-[53px] h-[26px] right-0 bg-gradientInfoBlck"></div>
          )}
        </div>
      </div>

      {viewAll && (
        <div className="flex justify-end text-grayN500 text-xs font-semibold items-center mb-16">
          <div onClick={toggle} className="flex items-center cursor-pointer ">
            {t(`company.view-${isOpen ? 'less' : 'all'}`)}
            <Icon name={toggleIconName} />
          </div>
        </div>
      )}
    </Card>
  );
};

export default InfoBlock;
