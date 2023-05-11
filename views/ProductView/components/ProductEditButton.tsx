import React from 'react';

interface Props {
  onClick?: () => void;
  background?: boolean;
}

const ProductEditButton: React.FC<Props> = ({ onClick, background }) => {
  return (
    <div
      onClick={onClick}
      className={`z-40 flex items-center justify-center w-8 h-8 cursor-pointer md:w-12 md:h-12 hover:scale-110 px-2 ${
        background ? 'bg-white rounded-lg shadow-lg' : ''
      }`}
    >
      <svg
        width="17"
        height="20"
        viewBox="0 0 17 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.14307 18.5714H15.7145M11.4288 1.42859L14.8574 4.85716L5.42878 14.2857H2.00021V10.8572L11.4288 1.42859Z"
          stroke="#4AA7CA"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default ProductEditButton;
