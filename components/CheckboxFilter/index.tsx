interface InputProps {
  name: string;
  label: string;
  checked: boolean;
  onClick: (item: string) => void;
}

const CheckboxFilter: React.FC<InputProps> = ({
  name,
  label,
  checked,
  onClick,
  ...rest
}) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onClick(name)}
        name={name}
        id={name}
        className="!w-4 !h-4 hover:!w-4 hover:!h-4 before:!h-3 before:!w-3 border rounded cursor-pointer text-button bg-inputGray border-inputGray accent-button hover:bg-inputGray focus:ring-button"
      />
      <label
        htmlFor={name}
        className="ml-2 text-sm font-medium font-custom1 text-inputGray"
      >
        {label}
      </label>
    </div>
  );
};

export default CheckboxFilter;
