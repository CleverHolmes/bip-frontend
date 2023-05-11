import React from 'react';

import Icon from 'components/Icon';

interface Props {
  onClick?: () => void;
}

const ProductAddButton: React.FC<Props> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="z-40 flex items-center justify-center w-8 h-8 bg-white rounded-lg shadow-lg cursor-pointer md:w-12 md:h-12 hover:scale-110"
    >
      <Icon
        name="Add"
        className={`inline-block fill-button cursor-pointer`}
        viewBox="0 0 18 18"
        size="16"
        onClick={onClick}
      />
    </div>
  );
};

export default ProductAddButton;
