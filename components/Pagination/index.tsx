import React from 'react';

export interface Props {
  page: number;
  totalPages: number;
  handlePagination: (page: number) => void;
}

const Pagination: React.FC<Props> = ({
  page,
  totalPages,
  handlePagination,
}) => {
  return (
    <div>
      <div className="flex items-center justify-center">
        {page !== 1 && (
          <button
            onClick={() => handlePagination(page - 1)}
            className="flex items-center justify-center w-10 h-10 transition-colors duration-150 rounded-full text-button focus:shadow-outline hover:bg-button/20"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
                fillRule="evenodd"
              ></path>
            </svg>
          </button>
        )}

        <button
          onClick={() => handlePagination(1)}
          type="button"
          className={`w-10 h-10  transition-colors duration-150 rounded-full focus:shadow-outline
          ${
            page === 1
              ? 'text-white bg-button border border-r-0 border-button'
              : 'text-inputGray hover:bg-button/20'
          }`}
        >
          {1}
        </button>

        {page > 3 && <div className="mt-1">...</div>}

        {page === totalPages && totalPages > 3 && (
          <button
            onClick={() => handlePagination(page - 2)}
            type="button"
            className={`w-10 h-10  transition-colors duration-150 rounded-full focus:shadow-outline text-inputGray hover:bg-button/20`}
          >
            {page - 2}
          </button>
        )}

        {page > 2 && (
          <button
            onClick={() => handlePagination(page - 1)}
            type="button"
            className={`w-10 h-10  transition-colors duration-150 rounded-full focus:shadow-outline text-inputGray hover:bg-button/20`}
          >
            {page - 1}
          </button>
        )}

        {page !== 1 && page !== totalPages && (
          <button
            onClick={() => handlePagination(page)}
            // type="button"
            // className={[styles.pageItem, styles.active].join(' ')}
            className={`w-10 h-10  transition-colors duration-150 rounded-full focus:shadow-outline text-white bg-button border border-r-0 border-button`}
          >
            {page}
          </button>
        )}

        {page < totalPages - 1 && (
          <button
            onClick={() => handlePagination(page + 1)}
            className={`w-10 h-10  transition-colors duration-150 rounded-full focus:shadow-outline text-inputGray hover:bg-button/20`}
          >
            {page + 1}
          </button>
        )}

        {page === 1 && totalPages > 3 && (
          <button
            onClick={() => handlePagination(page + 2)}
            className={`w-10 h-10  transition-colors duration-150 rounded-full focus:shadow-outline text-inputGray hover:bg-button/20`}
          >
            {page + 2}
          </button>
        )}

        {page < totalPages - 2 && <div className="mt-1">...</div>}

        <button
          onClick={() => handlePagination(totalPages)}
          className={`w-10 h-10  transition-colors duration-150 rounded-full focus:shadow-outline
            ${
              page === totalPages
                ? 'text-white bg-button border border-r-0 border-button'
                : 'text-inputGray hover:bg-button/20'
            }`}
        >
          {totalPages}
        </button>

        {page !== totalPages && (
          <button
            className="flex items-center justify-center w-10 h-10 transition-colors duration-150 rounded-full text-button focus:shadow-outline hover:bg-button/20"
            onClick={() => handlePagination(page + 1)}
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
                fillRule="evenodd"
              ></path>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
