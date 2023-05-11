import Icon, { IconNames } from 'components/Icon';

interface Props {
  item: string;
  label?: string;
  checked: boolean;
  onClick?: any;
  icon?: IconNames;
  smaller?: boolean;
  extraSmall?: boolean;
  differentOnClick?: boolean;
  productCategory?: string;
  color?: string;
  showIcon?: boolean;
}

const SelectButton: React.FC<Props> = ({
  item,
  label,
  onClick,
  checked,
  smaller,
  extraSmall,
  differentOnClick,
  productCategory,
  color,
  showIcon = true,
}) => {
  const background = checked
    ? ` ${
        color === 'yellow'
          ? 'bg-yellow hover:bg-yellowButtonHover active:bg-yellowButtonHover focus:ring-yellow/50'
          : 'bg-button hover:bg-buttonHover2 active:bg-buttonHover2 focus:ring-button/50'
      } text-white  focus:outline-none focus:ring`
    : ` ${
        color === 'yellow'
          ? 'focus:ring-yellow/50 hover:bg-yellowButtonHover active:bg-yellow'
          : 'focus:ring-button/50 hover:bg-buttonHover active:bg-buttonActive'
      } bg-white text-primary focus:outline-none focus:ring`;
  const smallerClass =
    extraSmall || smaller
      ? ' text-base py-2 px-4 mr-2'
      : ' text-base py-2 px-6 mr-4 lg:text-lg py-3 px-8 mr-5';
  return (
    <button
      onClick={() =>
        differentOnClick ? onClick(productCategory, item) : onClick(item)
      }
      className={
        'drop-shadow-md font-custom2 rounded-full flex justify-center items-center' +
        background +
        smallerClass
      }
    >
      {label || item}
      {showIcon && (
        <div className={extraSmall || smaller ? 'ml-1.5' : 'ml-2.5'}>
          {checked ? (
            <Icon
              name="Uncheck"
              viewBox="0 0 18 18"
              size={extraSmall || smaller ? '12' : '18'}
              className="mt-1 cursor-pointer fill-white"
            />
          ) : (
            <Icon
              name="Plus"
              viewBox="0 0 18 18"
              size={extraSmall || smaller ? '12' : '18'}
              className="mt-1 cursor-pointer fill-button"
            />
          )}
        </div>
      )}
    </button>
  );
};

export default SelectButton;
