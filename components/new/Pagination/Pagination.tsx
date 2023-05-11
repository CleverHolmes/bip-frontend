import Icon from 'components/new/Icon/Icon';

const Pagination = ({
  totalPages,
  className,
  selectedPage,
  handlePageClick,
}: any) => {
  const classes = (current: number) =>
    `${current === selectedPage ? 'text-white bg-grayN500' : ''}`;

  return (
    <div className={`${className || ''} flex flex-row gap-8`}>
      <div
        className={`flex items-center justify-center rounded-full  border-[1.5px] w-24 h-24 ${
          selectedPage > 1
            ? 'cursor-pointer bg-white border-grayN50 shadow-pagination'
            : 'border-transparent'
        }  `}
      >
        {selectedPage > 1 && (
          <Icon
            size="2xs"
            name="ChevronLeft"
            viewBox="0 0 8 14"
            onClick={() => {
              const newPage = selectedPage - 1;
              if (newPage > 0) {
                handlePageClick(newPage);
              }
            }}
          />
        )}
      </div>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
        (item, index) => (
          <div
            key={index}
            onClick={() => handlePageClick(item)}
            className={`${classes(
              item
            )} cursor-pointer w-24 h-24 flex items-center justify-center rounded-full bg-grayN25 text-sm text-grayN100`}
          >
            {item}
          </div>
        )
      )}
      <div
        className={`flex items-center justify-center rounded-full  border-[1.5px]  w-24 h-24 ${
          totalPages >= selectedPage + 1
            ? 'cursor-pointer shadow-pagination bg-white border-grayN50'
            : 'border-transparent'
        }  `}
      >
        {totalPages >= selectedPage + 1 && (
          <Icon
            size="2xs"
            name="ChevronRight"
            viewBox="0 0 8 14"
            onClick={() => {
              const newPage = selectedPage + 1;
              if (totalPages >= newPage) {
                handlePageClick(newPage);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};
export default Pagination;
