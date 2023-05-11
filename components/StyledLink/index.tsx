import Link from 'next/link';
import { NextRouter, useRouter } from 'next/router';

type Props = {
  linkTitle: string;
  link: string;
  notifications?: number;
  id?: string;
};

const StyledLink: React.FC<Props> = ({
  linkTitle,
  link,
  notifications,
  id,
}) => {
  const router: NextRouter = useRouter();
  const currentRoute = router.pathname;
  // active vs inactive style
  const routeStyle =
    currentRoute === link
      ? 'bg-card text-button py-2 px-1 xl:px-2 2xl:px-2.5 relative'
      : 'text-inputGray hover:text-button px-1 2xl:px-2.5 relative';
  const notificationsStyle =
    currentRoute === link ? 'top-1 -right-3 ' : '-top-1 -right-3';
  return (
    <Link href={link}>
      <div
        className={routeStyle + ' mx-2 font-custom2 text-lg cursor-pointer'}
        id={id}
      >
        {linkTitle}
        {!!notifications && notifications > 0 && (
          <div
            className={
              notificationsStyle +
              ' absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white border-2 border-white rounded-full bg-redButton font-custom1'
            }
          >
            {notifications}
          </div>
        )}
      </div>
    </Link>
  );
};

export default StyledLink;
