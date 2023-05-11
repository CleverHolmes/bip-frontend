import React, { useEffect, useState, useRef } from 'react';

import Dropdown, { DropdownItemType } from 'components/new/Dropdown';
import { countries } from 'constants/countries';

type Props = {
  type: string;
  keyword: string;
  id: string;
  defaultGeo: string;
};

const GoogleTrends: React.FC<Props> = ({ type, keyword, id, defaultGeo }) => {
  const [geo, setGeo] = useState(defaultGeo);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      // clear the element before rendering new content
      (ref.current as HTMLElement).innerHTML = '';
      (window as any).trends.embed.renderExploreWidgetTo(
        ref.current,
        type,
        {
          comparisonItem: [{ keyword, geo, time: 'today 12-m' }],
          category: 0,
          property: '',
        },
        {
          exploreQuery: `q=${encodeURI(keyword)}&geo=${geo}&date=today 12-m`,
          guestPath: 'https://trends.google.com:443/trends/embed/',
        }
      );
    }
  }, [keyword, geo]);

  const handleCountryChange = (item: DropdownItemType) => {
    if (document.getElementById(id)) {
      // @ts-ignore
      document.getElementById(id).innerHTML = '';
    }
    setGeo(item.value);
  };

  return (
    <div className="h-[460px]">
      <Dropdown
        items={countries}
        value={countries.find((item) => item.value === geo)}
        onChange={handleCountryChange}
      />
      <div className="mt-5" id={keyword} ref={ref} />
    </div>
  );
};

export default GoogleTrends;
