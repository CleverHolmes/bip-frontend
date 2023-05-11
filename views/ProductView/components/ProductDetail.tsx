import React from 'react';

import Pils from 'components/Pils';
import Icon from 'components/Icon';

interface Props {
  iconName: string;
  text: string;
  description: string;
  locked: boolean;
  viewBox?: string;
  size?:
    | '14'
    | '12'
    | '16'
    | '18'
    | '22'
    | '24'
    | '26'
    | '32'
    | '40'
    | undefined;
}

const ProductDetail: React.FC<Props> = ({
  iconName,
  text,
  description,
  locked,
  viewBox,
  size,
}) => {
  return (
    <div className="flex items-center">
      <Pils icon={iconName} viewBox={viewBox} size={size} />
      <div className="flex flex-col">
        <div className="flex items-center justify-start text-base font-normal font-custom2 text-inputGray ">
          {description}
          {locked && (
            <Icon
              name="Lock"
              className="mt-1 ml-1 fill-button"
              viewBox="0 0 18 18"
              size="14"
            />
          )}
        </div>
        <div
          className="mt-1 text-lg font-normal font-custom2 text-primary"
          style={{ whiteSpace: 'pre-line' }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
