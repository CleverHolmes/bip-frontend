import Image from 'next/image';
import React from 'react';
import { useSmartcrop } from 'use-smartcrop';

import customImageLoader from 'utils/image-loader';
import { throwError } from 'utils/error';

type Props = {
  image: string;
  radius?: number;
  alt: string;
  params: { width: number; height: number; minScale: number };
  onClick?: () => void;
};

const SmartCropImage: React.FC<Props> = ({
  image,
  params,
  onClick,
  alt,
  radius,
}) => {
  const src = customImageLoader({ src: image });
  const [cropped, error] = useSmartcrop({ src }, {
    width: params.width * 2,
    height: params.height * 2,
    minScale: params.minScale,
  });
  if (error) {
    throwError(error);
  }

  return (
    <>
      {cropped && (
        <Image
          loader={customImageLoader}
          src={cropped}
          alt={alt}
          layout={'fill'}
          objectFit={'cover'}
          onClick={onClick}
          style={{
            borderRadius: radius ? radius : 12,
          }}
        />
      )}
    </>
  );
};

export default SmartCropImage;
