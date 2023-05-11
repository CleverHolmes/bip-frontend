import React, { InputHTMLAttributes } from 'react';
import classnames from 'classnames';

import { generateUniqueId } from 'utils/generateUniqueId';

type RadioProperties = InputHTMLAttributes<HTMLInputElement> & {
  selected?: boolean;
  label?: string;
  showError?: boolean;
  children?: React.ReactNode;
};

const Radio: React.FC<RadioProperties> = ({
  selected = false,
  label,
  showError = false,
  children,
  onChange,
  className = '',
  name,
  ...inputProps
}) => {
  const uuid = generateUniqueId();
  const commonClasses =
    'relative appearance-none w-20 h-20 rounded-full cursor-pointer border-1 border-solid hover:bg-blueN50 ';
  const selectedClasses = selected
    ? ' before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:content-[""] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[""] checked:border-blueN300 dark:checked:border-blueN300 checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-blueN300 checked:after:bg-blueN300 dark:checked:after:border-blueN300 dark:checked:after:bg-blueN300 checked:after:content-[""] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] checked:focus:border-blueN300 dark:checked:focus:border-blueN300 checked:focus:before:scale-100 '
    : '';

  return (
    <div className={'flex flex-row items-center ' + className}>
      <input
        className={classnames(commonClasses + selectedClasses, {
          'border-grayN100 hover:border-blueN200 border-neutral-300 dark:border-neutral-600':
            !showError,
          'border-redN300': showError && !selected,
        })}
        type="radio"
        checked={selected}
        id={uuid}
        name={name}
        onChange={onChange}
        {...inputProps}
      />
      {(children || label) && (
        <label
          className={
            'font-bodyText ml-4 text-sm cursor-pointer' +
            (selected ? ' text-grayN500 ' : ' text-grayN100 ')
          }
          htmlFor={uuid}
        >
          {children || label}
        </label>
      )}
    </div>
  );
};

export default Radio;
