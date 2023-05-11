import classnames from 'classnames';
import React, { ComponentType, createContext, useState } from 'react';
import { Tab as HeadlessTab } from '@headlessui/react';

type ExtractProps<T> = T extends ComponentType<infer P> ? P : T;
type WithChildren<T> = T & { children: React.ReactNode };

type TabProps = {
  children: React.ReactNode;
  subTitle?: string;
  subTitleClassName?: string;
  icon?: React.ReactNode;
  unreadAmount?: number;
  showUnreadAmount?: boolean;
  className?: string;
  disabled?: boolean;
  currentIndex?: number;
  totalTabs?: number;
} & ExtractProps<typeof HeadlessTab>;
type GroupProps = WithChildren<ExtractProps<typeof HeadlessTab.Group>>;
type ListProps = WithChildren<ExtractProps<typeof HeadlessTab.List>>;
type PanelsProps = WithChildren<ExtractProps<typeof HeadlessTab.Panels>>;
type PanelProps = WithChildren<ExtractProps<typeof HeadlessTab.Panel>>;

type GroupComponent = React.FC<GroupProps>;
type ListComponent = React.FC<ListProps>;
type PanelsComponent = React.FC<PanelsProps>;
type PanelComponent = React.FC<PanelProps>;
type TabComponent = React.FC<TabProps> & {
  Group: GroupComponent;
} & {
  List: ListComponent;
} & {
  Panels: PanelsComponent;
} & {
  Panel: PanelComponent;
};

const Tab: TabComponent = ({
  children,
  className,
  subTitleClassName,
  unreadAmount,
  subTitle,
  icon,
  showUnreadAmount = '',
  disabled,
  currentIndex,
  totalTabs,
}) => {
  return (
    <HeadlessTab
      disabled={disabled}
      className={({ selected }) =>
        classnames(
          className,
          'relative w-full px-3 font-semibold text-center cursor-pointer hover:text-button font-custom1 focus:outline-0 p-2 border-transparent border-b-1 border-b-grayN75',
          {
            'text-button md:border-b-blueN300 border-b-1 md:border-b-2':
              selected,
            'text-grayN100': !selected && disabled,
          }
        )
      }
    >
      <div className="relative flex justify-center items-center gap-2">
        {icon}
        {showUnreadAmount && (
          <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white border-2 border-white rounded-full max-w bg-redButton font-custom1 -top-3 -right-7">
            {unreadAmount}
          </div>
        )}
        <div className="flex flex-col">
          {children}
          {subTitle && (
            <>
              <p
                className={classnames(
                  subTitleClassName,
                  'text-xs text-left font-bold md:font-normal font-bodyText'
                )}
              >
                {subTitle}
              </p>
              <p
                className={classnames(
                  subTitleClassName,
                  'block md:hidden text-xs text-left font-normal'
                )}
              >
                {currentIndex?.toString() && totalTabs?.toString()
                  ? `${currentIndex + 1} of ${totalTabs}`
                  : ''}
              </p>
            </>
          )}
        </div>
      </div>
    </HeadlessTab>
  );
};

type TabContextProperties = {
  setSelectedIndex?: (index: number) => void;
};
export const TabContext = createContext<TabContextProperties>({
  setSelectedIndex: undefined,
});

const Group: GroupComponent = ({ children, ...props }): JSX.Element => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <HeadlessTab.Group {...props}>
      <TabContext.Provider value={{ setSelectedIndex: props.onChange }}>
        {children}
      </TabContext.Provider>
    </HeadlessTab.Group>
  );
};

const List: ListComponent = ({ children, className }): JSX.Element => (
  <HeadlessTab.List
    className={classnames(className, 'flex space-1 flex-col md:flex-row')}
  >
    {children}
  </HeadlessTab.List>
);

const Panels: ListComponent = ({ children, className }): JSX.Element => (
  <HeadlessTab.Panels className={classnames(className, 'mt-4')}>
    {children}
  </HeadlessTab.Panels>
);

const Panel: PanelComponent = ({
  children,
  className,
  unmount,
}): JSX.Element => (
  <HeadlessTab.Panel
    unmount={unmount}
    className={classnames(className, 'outline-0')}
  >
    {children}
  </HeadlessTab.Panel>
);

Tab.Group = Group;
Tab.List = List;
Tab.Panels = Panels;
Tab.Panel = Panel;

export default Tab;
