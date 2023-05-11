import { ChangeEvent } from 'react';
import resolveConfig from 'tailwindcss/resolveConfig';

import Icon from 'components/new/Icon';
import tailwindConfig from 'tailwind.config';
import { generateUniqueId } from 'utils/generateUniqueId';

const fullConfig = resolveConfig(tailwindConfig);

type CheckboxProperties = {
  checked?: boolean;
  label?: string;
  value?: string;
  name?: string;
  onChange?: (item: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  mute?: boolean;
};

const Checkbox: React.FC<CheckboxProperties> = ({
  checked = false,
  label,
  value = 'Default',
  name = 'checkbox',
  onChange,
  className,
  mute = false,
}) => {
  const commonClasses =
    "relative appearance-none w-16 h-16 rounded-full border border-grayN100 border-solid border-neutral-300  dark:border-neutral-600 z-10 ";
  const hoverClasses = mute
    ? "hover:bg-blueN50 hover:border-blueN200 cursor-pointer"
    : "";
  const selectedClasses = checked
    ? " before:pointer-events-none checked:border-blueN300 dark:checked:border-blueN300 focus:shadow-none "
    : "";
  const uuid = generateUniqueId();

  return (
    <div className={'flex flex-row items-center relative ' + className}>
      <div className="flex flex-row items-center relative">
        <input
          id={uuid}
          name={name}
          className={commonClasses + selectedClasses + hoverClasses}
          type="checkbox"
          value={value}
          onChange={onChange}
          checked={checked}
        />
        {checked && (
          <Icon
            className="absolute top-4 left-0.5 width-8 height-8 cursor-pointer"
            name="Check"
            color={fullConfig.theme.colors.blueN300}
            size="2xs"
          />
        )}
      </div>
      {label && (
        <label
          className={
            'font-bodyText ml-4 text-sm' +
            (checked ? ' text-grayN500 ' : ' text-grayN100 ')
          }
          htmlFor={uuid}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
