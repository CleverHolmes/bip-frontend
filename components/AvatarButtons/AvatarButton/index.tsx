import Image from 'next/image';

import useStore from 'modules/Store';
import customImageLoader from '../../../utils/image-loader';

const AvatarButton = () => {
  const nameFirst = useStore((state) => state.name_first);
  const nameLast = useStore((state) => state.name_last);
  const companyLogo = useStore((state) => state.company_logo);

  return (
    <div className="relative flex items-center justify-center w-12 h-12 uppercase border-2 cursor-pointer rounded-xl max-h-12 max-w-12 border-backgroundInput bg-backgroundInput hover:opacity-80 hover:border-button hover:bg-button">
      {!!companyLogo.uri ? (
        <Image
          loader={customImageLoader}
          src={companyLogo.uri}
          alt="ProfileImage"
          layout="fill"
          width={48}
          objectFit={'contain'}
          className="mx-auto rounded-xl"
        />
      ) : nameFirst || nameLast ? (
        `${nameFirst ? nameFirst.charAt(0) : ' '}${
          nameLast ? nameLast.charAt(0) : ' '
        }` // name_first and name_last may be null if a user was created but this information not populated yet.
      ) : (
        ''
      )}
    </div>
  );
};

export default AvatarButton;
