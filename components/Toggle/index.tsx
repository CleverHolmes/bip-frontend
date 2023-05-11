import { useTranslation } from 'next-i18next';

type ToggleProps = {
  label: string;
  onChange: (name: string, checked: boolean) => void;
  toggleValue: string;
  toggleID: string;
  checked: boolean;
};

const Toggle = ({
  label,
  onChange,
  toggleValue,
  toggleID,
  checked,
}: ToggleProps) => {
  const { t } = useTranslation();
  return (
    <label className="inline-flex items-center mr-5 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          value={toggleValue}
          id={toggleID}
          className="cursor-pointer sr-only peer"
          onChange={() => onChange(toggleID, !checked)}
          checked={checked}
        />
        <div className="w-14 h-7 bg-inputGray rounded-full dark:peer-focus:ring-button dark:bg-gray-700 peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-button"></div>
      </div>
      <span className="ml-3 text-lg sm:text-xl lg:text-2xl font-custom2">
        {label}
      </span>
    </label>
  );
};

export default Toggle;
