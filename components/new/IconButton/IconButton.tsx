import { useState } from "react";
import resolveConfig from "tailwindcss/resolveConfig";

import tailwindConfig from "tailwind.config";
import Icon from "components/new/Icon";
import { IconNames } from "components/new/Icon/icons";

const fullConfig = resolveConfig(tailwindConfig);

type IconButtonProperties = {
  size?: "sm" | "md" | "lg";
  color?: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  showIndicator?: boolean;
  iconName?: IconNames;
};

const IconButton: React.FC<IconButtonProperties> = ({
  size = "sm",
  color = fullConfig.theme.colors.grayN500,
  disabled = false,
  onClick,
  className,
  showIndicator = false,
  iconName = "Off",
}) => {
  const [iconColor, setIconColor] = useState(color);
  const commonClasses =
    "inline-flex items-center justify-center w-fit rounded-full cursor-pointer bg-white relative ";
  const smallClasses =
    " shadow-box-iconButton border-1 border-grayN50 hover:bg-blueN50 ";
  const mediumClasses = " hover:box-iconButton hover:bg-blueN50 ";
  const largeClasses = " hover:box-iconButton hover:bg-blueN50 ";
  const sizeClasses =
    size === "sm" ? smallClasses : size === "md" ? mediumClasses : largeClasses;
  const buttonSize = size === "sm" || size === "lg" ? " p-8 lg " : " p-4 ";
  // icon sizes are pretty much different as icon sizes sm for buttons should be xs and lg sm size
  const iconSize = size === "sm" ? "xs" : "md";
  const indicatorCommonClasses =
    "w-1.5 h-1.5 rounded-full absolute bg-redN300 border-1 border-white";
  const showIndicatorClass =
    size === "md" ? " top-1.5 left-20 " : " top-2.5 left-24 ";

  return (
    <button
      onClick={onClick}
      className={commonClasses + buttonSize + sizeClasses + className}
      disabled={disabled}
      onMouseEnter={() =>
        setIconColor(size !== "sm" ? fullConfig.theme.colors.blueN300 : color)
      }
      onMouseLeave={() => setIconColor(color)}
    >
      {showIndicator && size !== "sm" && (
        <span className={indicatorCommonClasses + showIndicatorClass} />
      )}
      <Icon name={iconName} color={iconColor} size={iconSize} />
    </button>
  );
};

export default IconButton;
