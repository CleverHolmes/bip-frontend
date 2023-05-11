import React from 'react';
import { useTranslation } from 'next-i18next';

import Card from 'components/new/Card';
import Link from 'components/new/Link';

type CardProperties = {
  title: string;
  onEdit: () => void;
  bodyItems: { title: string; value: string; key: number }[];
};

const PanelReviewCard: React.FC<CardProperties> = ({
  title,
  onEdit,
  bodyItems,
}) => {
  const { t } = useTranslation();

  return (
    <Card isFull>
      <div className="flex flex-row justify-between items-center">
        <h3 className="font-bold text-lg mb-16 font-headings">{title}</h3>
        <Link onClick={onEdit} size="sm">
          {t('edit')}
        </Link>
      </div>
      <ul className="!pt-0">
        {bodyItems.map((item) => (
          <li key={item.key} className="font-bodyText">
            <span className="inline block font-bold text-center text-grayN300">
              {item.title}:
            </span>
            &nbsp;
            <span className="inline text-grayN100">{item.value}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default PanelReviewCard;
