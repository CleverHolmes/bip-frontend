import HeaderSplitPrimaryButton from 'components/HeaderSplitPrimaryButton';

type RadioObject = {
  name: string;
  value: string;
};

type Props = {
  radioObject: RadioObject[];
  label?: string;
  extraText?: string;
  defaultValue?: any;
  radioHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedRadio: string | undefined;
  size?: 'smaller' | 'extra-small';
};

const RadioButton: React.FC<Props> = ({
  radioObject,
  label,
  extraText,
  radioHandler,
  selectedRadio,
  size,
}) => {
  const classSize =
    size === 'smaller'
      ? 'text-xl md:text-3xl lg:text-5xl mb-12'
      : size === 'extra-small'
      ? 'text-base md:text-xl lg:text-2xl mb-8'
      : 'text-xl md:text-5xl lg:text-7xl mb-12';
  const questionSize =
    size === 'smaller' ? 'mb-16' : size === 'extra-small' ? 'mb-10' : 'mb-16';
  return (
    <div className="flex flex-col">
      <label
        className={
          questionSize +
          ' block text-lg font-bold font-custom1 md:text-xl lg:text-2xl'
        }
      >
        {!!label && <HeaderSplitPrimaryButton label={label} />}
        <span className="ml-2 text-base font-normal text-inputGray lg:text-lg">
          {extraText && `(${extraText})`}
        </span>
      </label>
      {radioObject.map(({ name, value }) => {
        const color =
          selectedRadio === value ? `text-primary` : `text-inputGray`;
        return (
          <label
            htmlFor={name}
            className={'flex items-center ' + classSize}
            key={value}
          >
            <input
              type="radio"
              name={name}
              value={value}
              id={value}
              checked={selectedRadio === value}
              onChange={radioHandler}
              className={
                'block w-8 my-auto cursor-pointer accent-button hover:bg-inputGray focus:ring focus:ring-button text-lg md:text-xl lg:text-2xl'
              }
            />
            <div className={`px-3 font-bold font-custom1 ` + color}>
              {value}
            </div>
          </label>
        );
      })}
    </div>
  );
};

export default RadioButton;
