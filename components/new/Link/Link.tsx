import React from 'react';
import NextLink from 'next/link';
import classNames from 'classnames';

type LinkProps = {
  href?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
  external?: boolean;
  underlined?: boolean;
  size?: 'sm' | 'base';
  onClick?: () => void;
};

const Link: React.FC<LinkProps> = ({
  href,
  children,
  className,
  external = false,
  underlined = false,
  variant = 'primary',
  size = 'base',
  onClick,
}) => {
  const isPrimary = variant === 'primary';
  const styles = classNames(
    `border-none bg-transparent text-blueN300 p-0 font-bodyText text-${size}`,
    className,
    { underline: underlined },
    {
      'text-blueN300': isPrimary,
      'text-grayN500 hover:text-blueN300': !isPrimary,
      'font-bold': !isPrimary,
    }
  );
  if (href && !external) {
    return (
      <NextLink href={href}>
        <a className={styles} onClick={onClick}>
          {children}
        </a>
      </NextLink>
    );
  } else if (href && external) {
    return (
      <a
        rel="noreferrer"
        href={href}
        className={styles}
        target="_blank"
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={styles} onClick={onClick}>
      {children}
    </button>
  );
};

export default Link;
