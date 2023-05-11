import Image from 'next/image';

import customImageLoader from 'utils/image-loader';

interface Props {
  image: string;
  image2: string;
  text1: string;
  text2: string;
}

const ImageCard: React.FC<Props> = ({ image, text1, text2 }) => {
  return (
    <div className="relative max-w-sm transition-all duration-300 bg-white rounded-lg shadow-lg hover:-translate-y-2">
      <div className="relative w-full h-72">
        <Image
          loader={customImageLoader}
          className="rounded-t-lg"
          src={image}
          alt={image}
          layout="fill"
        />
      </div>
      <div className="p-6">
        <div className="text-sm font-medium uppercase font-custom2 text-inputGray">
          {text1}
        </div>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-custom1 text-primary">{text2}</div>
          <Image
            loader={customImageLoader}
            className="rounded-full"
            height={32}
            width={32}
            alt={text1}
            src={image}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
