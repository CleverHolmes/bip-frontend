import React, { FC, Fragment, ReactNode, useState } from 'react';
import { Popover, Transition } from '@headlessui/react';

type Props = {
  buttonElem: (open: boolean) => {};
  panelClasses?: string;
  children: ReactNode;
};

const PopoverPanel: FC<Props> = ({ buttonElem, panelClasses, children }) => {
  const [isShowing, setIsShowing] = useState(false);
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className="focus:outline-none"
            onMouseEnter={() => setIsShowing(true)}
            onMouseLeave={() => setIsShowing(false)}
          >
            <>{buttonElem(open)}</>
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
            show={isShowing}
            onMouseEnter={() => setIsShowing(true)}
            onMouseLeave={() => setIsShowing(false)}
          >
            <Popover.Panel
              className={`absolute z-50 max-w-sm px-4 mt-0 sm:px-0 lg:max-w-md w-max transform -translate-x-1/2 ${panelClasses}`}
            >
              <div className={`mt-3 ${panelClasses}`}>
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative grid gap-8 bg-white p-7 lg:grid-cols-1">
                    {children}
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default PopoverPanel;
