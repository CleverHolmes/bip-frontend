import React from 'react';
import Image from 'next/image';

type BannerProperties = {
  backgroundUrl: string;
};

export const HeroImage: React.FC<BannerProperties> = ({ backgroundUrl }) => {
  return (
    <div className="overflow-hidden rounded-2xl w-full max-h-[15rem] flex items-center">
      <img
        src={backgroundUrl}
        className="object-center object-cover w-full h-full"
      />
    </div>
  );
};
