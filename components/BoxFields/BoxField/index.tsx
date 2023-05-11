import Icon from 'components/Icon';

interface BoxFieldProps {
  title?: string;
  description: string[] | string | number[];
  description2?: string[] | string | number[];
  onClick?: () => void;
  locked?: boolean;
  visible?: boolean;
  notVisible?: boolean;
  noEdit?: boolean;
  uppercase?: boolean;
  logout?: boolean;
}

const BoxField = ({
  title,
  description,
  onClick,
  description2,
  locked,
  visible,
  notVisible,
  noEdit,
  uppercase,
  logout,
}: BoxFieldProps) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between px-5 sm:px-10 py-3 bg-white border-b-2 border-borderColor +  ${
        logout ? ' hover:bg-button/10 rounded-lg' : ' '
      }`}
    >
      <div
        className={`flex flex-col +  ${
          noEdit && !logout ? ' cursor-auto' : ' cursor-pointer'
        }`}
      >
        <div className="flex flex-row items-center text-base font-custom1 text-inputGray">
          {title}
          {locked && (
            <Icon
              name="Lock"
              className="mt-1 ml-2 fill-button"
              viewBox="0 0 18 18"
              size="14"
            />
          )}
          {visible && (
            <Icon
              name="Eye"
              className="ml-2 fill-button"
              viewBox="0 0 24 18"
              size="18"
            />
          )}
          {notVisible && (
            <Icon
              name="EyeNo"
              className="mb-1 ml-2 fill-button"
              viewBox="0 0 24 18"
              size="18"
            />
          )}
        </div>
        <div className="mt-1 text-lg font-bold sm:text-xl font-custom1 text-button">
          {!Array.isArray(description)
            ? description
            : description.map((item: string | number, index) => {
                return (
                  <span key={item}>
                    {uppercase && typeof item === 'string'
                      ? item[0].toUpperCase() + item.substring(1)
                      : item}
                    {index + 1 <= description.length - 1 && ','}{' '}
                  </span>
                );
              })}
        </div>
        {description2 && (
          <div className="mt-1 text-lg font-bold sm:text-xl font-custom1 text-button">
            {!Array.isArray(description2)
              ? description2
              : description2.map((item: string | number, index) => {
                  return (
                    <span key={item}>
                      {item}
                      {index + 1 <= description.length - 1 && ','}{' '}
                    </span>
                  );
                })}
          </div>
        )}
      </div>
      {!noEdit && (
        <div className="cursor-pointer stroke-[#7C8B9E] hover:stroke-button pl-6 md:pl-10 lg:pl-20">
          <svg
            width="19"
            height="22"
            viewBox="0 0 19 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 21H18M13 1L17 5L6 16H2V12L13 1Z"
              strokeOpacity="0.6"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default BoxField;
