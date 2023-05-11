import { useTranslation } from 'next-i18next';

type MenuProperties = {
  children?: React.ReactNode;
  button: React.ReactNode;
  isExpanded?: boolean;
  onClick?: () => void;
  className?: string;
};

const Menu: React.FC<MenuProperties> = ({
  children,
  button,
  isExpanded,
  onClick,
  className,
}) => {
  const { t } = useTranslation();
  const commonClasses =
    'flex flex-col lg:flex-row justify-center items-flex-start lg:items-center p-0 g-24 w-fit ';

  return (
    <div className="relative w-fit z-20">
      <div className={commonClasses + className} onClick={onClick}>
        <div className="flex flex-col justify-center items-flex-start mb-0">
          {button}
        </div>
        {isExpanded && (
          <div className="absolute flex flex-col md:flex-row gap-24 -right-4 top-48 w-max bg-white shadow-box-dropButton rounded-lg transition ease-in-out duration-500">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
