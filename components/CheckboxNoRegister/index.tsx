interface InputProps {
  name: string;
  label: string;
  link?: string;
  link2?: string;
  label2?: string;
  label3?: string;
  onClickText?: string;
  selections: string[];
  onChange: (str: string) => void;
  onClick?: () => void;
}

const CheckboxNoRegister: React.FC<InputProps> = ({
  name,
  label,
  onChange,
  onClick,
  onClickText,
  selections,
  link,
  link2,
  label2,
  label3,
  ...rest
}) => {
  return (
    <div className="relative flex font-bold font-custom1">
      <label
        htmlFor={name}
        className="block mr-4 text-lg md:text-xl lg:text-2xl"
      >
        <span className="text-primary">{label}</span>
        {!!onClick && (
          <span
            className="underline cursor-pointer underline-offset-8 hover:text-button"
            onClick={onClick}
          >
            {onClickText}
          </span>
        )}
        {!!link && (
          <a href={link} target="_blank" rel="noreferrer">
            <span className="underline cursor-pointer underline-offset-8 hover:text-button">
              {label2}
            </span>
          </a>
        )}
        {!!link2 && ' and '}
        {!!link2 && (
          <a href={link2} target="_blank" rel="noreferrer">
            <span className="underline cursor-pointer underline-offset-8 hover:text-button">
              {label3}
            </span>
          </a>
        )}
      </label>
      <input
        value={name}
        checked={selections.includes(name)}
        onChange={() => onChange(name)}
        type="checkbox"
        name={name}
        id={name}
        className="w-8 h-8 border cursor-pointer border-inputGray accent-button hover:bg-inputGray"
      />
    </div>
  );
};

export default CheckboxNoRegister;
