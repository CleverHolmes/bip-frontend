import resolveConfig from 'tailwindcss/resolveConfig';

import tailwindConfig from 'tailwind.config';
import IconButton from 'components/new/IconButton';
import { IconNames } from 'components/new/Icon/icons';

const fullConfig = resolveConfig(tailwindConfig);

type WidgetProperties = {
  title?: string;
  subtitle?: string;
  iconName?: IconNames;
  className?: string;
};

const Widget: React.FC<WidgetProperties> = ({
  title,
  subtitle,
  iconName = 'Bars',
  className,
}) => {
  const commonClasses = 'flex flex-row h-40 ' + className;
  return (
    <div className={commonClasses}>
      <IconButton
        iconName={iconName}
        size="lg"
        color={fullConfig.theme.colors.blueN200}
        className="shadow-box-dropButton mr-8"
      />
      <div className="flex flex-col items-start">
        <p className="font-headings font-bold text-lg mb-4">{title}</p>
        <p className="font-bodyText text-xs text-grayN100">{subtitle}</p>
      </div>
    </div>
  );
};

export default Widget;
