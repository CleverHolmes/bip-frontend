import NextImage from 'next/image';

import styles from './Image.module.css';
import customImageLoader from 'utils/image-loader';

interface ImageProps {
  width?: number | string;
  maxWidth?: number | string;
  src: string;
  alt: string;
  layout: 'fixed' | 'fill' | 'intrinsic' | 'responsive' | undefined;
  className?: string;
  classNameImage?: string;
}

type Width = {
  width?: number | string;
  maxWidth?: number | string;
};

const Image: React.FC<ImageProps> = ({
  width,
  maxWidth,
  src,
  alt,
  layout,
  className,
  classNameImage,
}) => {
  // let widths = {};
  const widths: Width = {};
  if (width) {
    widths.width = width;
  } else {
    widths.width = '100%';
  }
  if (maxWidth) {
    widths.maxWidth = maxWidth;
  } else {
    widths.maxWidth = '100%';
  }

  const classNameImageProps = classNameImage ? classNameImage : '';

  return (
    <span className={`${styles.imageContainer} ${className}`} style={widths}>
      <NextImage
        loader={customImageLoader}
        src={src}
        className={styles.image + classNameImageProps}
        alt={alt}
        layout={layout}
      />
    </span>
  );
};

export default Image;
