import React, { FC, Fragment } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';
import { Listbox, Transition } from '@headlessui/react';

export type DropdownItemType = {
  name: string;
  value: string;
};

interface Props {
  control?: any;
  className?: string;
  name: string;
  placeholder?: string;
  disabled?: boolean;
  rules?: any;
  items: DropdownItemType[];
  value?: DropdownItemType;
  errorText?: string;
  onChange?: (item: DropdownItemType) => void;
  smaller?: boolean;
}

const Dropdown: FC<Props> = (props) => {
  const { field } = useController(props);
  const value = field.value || props.value;
  const onChange = field.onChange || props.onChange;
  const sizeClass = props.smaller ? 'text-lg' : 'text-lg md:text-2xl ';

  return (
    <div className={'min-w-[200px] ' + props.className}>
      <Listbox value={value} onChange={onChange} disabled={props.disabled}>
        <div className="relative mt-1">
          <Listbox.Button
            className={
              'w-full relative text-left font-bold border-b-4 border-borderColor ui-open:border-button font-custom1 focus:outline-none ui-disabled:opacity-50 ' +
              sizeClass
            }
          >
            {value && (
              <span className="block truncate pb-2 -mt-4">{value.name}</span>
            )}
            {!value && props.placeholder && (
              <span className="block truncate text-inputGray pb-2 -mt-4">
                {props.placeholder}
              </span>
            )}
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-md bg-white py-1 text-base sm:text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {props.items.map((item, index) => (
                <Listbox.Option
                  key={index}
                  className={({ active }) => {
                    const selected = item.value === value?.value;
                    return `relative cursor-pointer select-none py-2 pl-5 pr-4 text-base sm:text-lg ${
                      selected ? 'bg-button text-white' : ''
                    } ${active && !selected ? 'bg-buttonHover' : ''}`;
                  }}
                  value={item}
                >
                  {() => (
                    <>
                      <span className="block truncate">{item.name}</span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      <div className="h-6"></div>
      {props.errorText && (
        <div className="h-4 mb-2 ml-4 text-sm text-red-400 font-custom2">
          *{props.errorText}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
