// import Image from 'next/image';
import { NextRouter, useRouter } from 'next/router';

import SmartCropImage from 'components/SmartCropImage';
// import customImageLoader from 'utils/image-loader';

interface Props {
  src: string;
  className: string;
  onClick?: () => void;
  user?: string;
  size?: 'large' | 'small';
}

const AvatarButtonChat: React.FC<Props> = ({
  src,
  className,
  onClick,
  user,
  size,
}) => {
  const router: NextRouter = useRouter();
  const avatarSizeClass =
    size === 'large'
      ? 'w-[68px] h-[68px] max-h-[68px] max-w-[68px]'
      : size === 'small'
      ? 'w-8 h-8 max-h-8 max-w-8'
      : 'w-12 h-12 max-h-12 max-w-12';
  const avatarSize = size === 'large' ? 68 : size === 'small' ? 32 : 48;

  if (!src) return null;
  return (
    <div
      className={
        'relative flex items-center justify-center cursor-pointer border-4 border-white bg-white rounded-xl shadow-lg ' +
        avatarSizeClass
      }
      onClick={() =>
        onClick ? onClick : user ? router.push(`/company/${user}`) : null
      }
    >
      <div
        className={
          avatarSize === 68
            ? 'w-[68px] h-[68px]'
            : avatarSize === 48
            ? 'w-[48px] h-[48px]'
            : 'w-[32px] h-[32px]'
        }
      >
        <SmartCropImage
          image={src}
          params={{ width: 200, height: 200, minScale: 1 }}
          alt="ProfileImage"
          radius={12}
        />
        {/* <Image
          loader={customImageLoader}
          src={src}
          alt="ProfileImage"
          layout="fill"
          width={avatarSize}
          objectFit={'contain'}
          className={'mx-auto rounded-full bg-white ' + className}
        /> */}
      </div>
    </div>
  );
};

export default AvatarButtonChat;
