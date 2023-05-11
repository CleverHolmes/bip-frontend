import { useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';

import Menu from 'components/new/Menu';
import Button from 'components/new/Button';
import Radio from 'components/new/Radio';
import Link from 'components/new/Link';
import IconButton from 'components/new/IconButton';
import routes from 'constants/routes';

type HeaderProperties = {
  className?: string;
};

const Header: React.FC<HeaderProperties> = ({ className = '' }) => {
  const { t } = useTranslation();
  const [openToggle, setOpenToggle] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const commonClasses =
    'flex flex-row items-center justify-between bg-white p-24 g-72 w-full shadow-box-iconButton z-50 max-h-88';

  const navigation = () => (
    <div className="flex flex-col lg:flex-row items-start lg:items-center relative">
      <Menu
        button={
          <Button
            className="mb-0"
            iconAfter={openToggle ? 'Up' : 'Down'}
            variant="secondary"
            size="lg"
            onClick={() => setOpenToggle(!openToggle)}
          >
            {t('newHeader.discover-brands')}
          </Button>
        }
        isExpanded={openToggle}
      >
        <div className="flex flex-col p-16 g-24 z-50">
          <Radio
            className="mb-16"
            name="test"
            label={t('newHeader.discover-brands')}
            selected={true}
          />
          <Radio name="test" label={t('newHeader.explore-collaborations')} />
        </div>
      </Menu>
      <nav className="w-full lg:w-fit mt-24 lg:mt-0">
        <ul className="flex flex-col lg:flex-row items-start lg:items-center w-full lg:w-fit">
          <li className="block md:hidden flex flex-row items-center lg:mx-12 mb-16 w-full lg:w-fit">
            <IconButton iconName="On" size="md" />
            <p className="font-headings text-sm font-bold tracking-wide ml-4">
              {t('newHeader.notifications')}
            </p>
          </li>
          <li className="block md:hidden flex flex-row items-center lg:mx-12 mb-16 w-full lg:w-fit">
            <IconButton iconName="User" size="md" />
            <p className="font-headings text-sm font-bold tracking-wide ml-4">
              {t('newHeader.sign-in')}
            </p>
          </li>
          <hr className="block md:hidden h-px mb-24 bg-grayN50 border-0 w-full lg:w-fit" />
          <li className="lg:mx-12 lg:ml-24 mb-24 lg:mb-0 tracking-wide w-full lg:w-fit">
            <Link variant="secondary" href={routes.dashboard} size="sm">
              {t('newHeader.dashboard')}
            </Link>
          </li>
          <li className="lg:mx-12 mb-24 lg:mb-0 tracking-wide w-full lg:w-fit">
            <Link variant="secondary" href={routes.vault} size="sm">
              {t('newHeader.vault')}
            </Link>
          </li>
          <li className="lg:mx-12 mb-24 lg:mb-0 tracking-wide w-full lg:w-fit">
            <Link variant="secondary" href={routes.dealStatus} size="sm">
              {t('newHeader.deal-status')}
            </Link>
          </li>
          <li className="lg:mx-12 tracking-wide w-full lg:w-fit">
            <Link variant="secondary" href={routes.chat} size="sm">
              {t('newHeader.chat')}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );

  return (
    <header className={commonClasses + className}>
      <div className="flex flex-row items-center">
        <Link href={routes.explore}>
          <Image src="/images/new-logo.svg" alt="" width="40" height="26" />
        </Link>
        <IconButton className="sm:ml-60 ml-24" size="md" iconName="Search" />
      </div>
      <div className="hidden lg:block">{navigation()}</div>
      <div className="flex flex-row items-center g-16">
        <Button
          className="mr-0 md:mr-16 mb-0"
          iconBefore="Plus"
          variant="primary"
          size="lg"
        >
          {t('newHeader.list')}
        </Button>
        <IconButton
          className="hidden md:flex cursor-pointer mr-16"
          size="md"
          iconName="Off"
        />
        <IconButton
          className="hidden md:flex cursor-pointer"
          size="md"
          iconName="User"
        />
        <Menu
          className="block lg:hidden"
          button={
            <IconButton
              className="ml-16 cursor-pointer"
              size="md"
              iconName="Hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
            />
          }
          isExpanded={menuOpen}
        >
          <div className="flex flex-col p-16 g-24">{navigation()}</div>
        </Menu>
      </div>
    </header>
  );
};

export default Header;
