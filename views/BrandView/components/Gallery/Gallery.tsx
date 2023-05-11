import { useState, useCallback, useMemo } from 'react';
import Carousel, { Modal, ModalGateway } from 'react-images';
import Image from 'next/image';

import Icon from 'components/new/Icon';

type IMediaType = {
  media_uri: string;
  media_uri_type: string;
};

type GalleryProperties = {
  className?: string;
  images: string[];
  media: IMediaType[];
};

let defaultImages = [
  {
    source: '/images/Brand/Gallery1.svg',
    alt: 'Gallery 1',
  },
  {
    source: '/images/Brand/Gallery2.svg',
    alt: 'Gallery 2',
  },
  {
    source: '/images/Brand/Gallery3.svg',
    alt: 'Gallery 3',
  },
  {
    source: '/images/Brand/Gallery4.svg',
    alt: 'Gallery 4',
  },
];

const Banner: React.FC<GalleryProperties> = ({
  className,
  images,
  media = [{ media_uri: '', media_uri_type: '' }],
}) => {
  const commonClasses = 'flex flex-col w-full lg:w-[64rem] md:mx-auto mb-48 ';
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  const openLightbox = useCallback((index: number) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };

  const formatedImages = useMemo(() => {
    let resultImages: any[] = [];
    if (images.length) {
      images.map((item, index) => {
        const currentImage = { source: item, alt: 'Gallery-' + index };
        resultImages.push(currentImage);
      });
    }
    resultImages = [...resultImages, ...defaultImages];
    return resultImages;
  }, [images]);

  return (
    <div className={commonClasses + className}>
      <div className="flex flex-row justify-between items-center">
        <h2 className="font-headings font-bold text-xl text-grayN500 mb-24">
          Gallery
        </h2>
        <Icon name="Menu" size="md" />
      </div>
      <div className="flex flex-row self-start w-auto md:grid md:grid-cols-8 lg:grid-cols-10 items-center gap-16 overflow-x-scroll no-scrollbar md:overflow-x-hidden">
        {media?.[0]?.media_uri ? (
          <div className="w-[9.5rem] h-[10.0625rem] md:w-full md:h-[21.125rem] relative cursor-pointer rounded-2xl overflow-hidden md:col-span-3 lg:col-span-6">
            <iframe
              width="608"
              height="338"
              src={media[0].media_uri}
              title="Youtube Player"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="w-[9.5rem] h-[10.0625rem] md:w-full md:h-[21.125rem] relative cursor-pointer rounded-2xl overflow-hidden md:col-span-3 lg:col-span-6">
            <Image
              src="/images/Brand/Gallery.svg"
              alt="Gallery"
              layout="fill"
              objectFit="cover"
            />
          </div>
        )}
        <div className="flex flex-row md:flex-wrap gap-16 md:w-full lg:w-[25rem] w-auto col-span-full md:col-span-5 lg:col-span-4">
          {formatedImages.map((image, index) => {
            return (
              index < 4 && (
                <div
                  className="cursor-pointer rounded-2xl overflow-hidden relative w-[9.5rem] md:w-[12rem] h-[10.0625rem]"
                  key={image.alt}
                >
                  <Image
                    src={image.source}
                    alt={image.alt}
                    layout="fill"
                    objectFit="cover"
                    onClick={() => openLightbox(index)}
                  />
                </div>
              )
            );
          })}
        </div>
      </div>
      <ModalGateway>
        {viewerIsOpen ? (
          <Modal onClose={closeLightbox}>
            <Carousel currentIndex={currentImage} views={formatedImages} />
          </Modal>
        ) : (
          <></>
        )}
      </ModalGateway>
    </div>
  );
};

export default Banner;
