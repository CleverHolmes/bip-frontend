import NextImage from 'next/image';

import styles from './ImageHeight.module.css';

interface ImageProps {
  height?: number;
  maxheight?: number;
  src: string;
  alt: string;
  layout: 'fixed' | 'fill' | 'intrinsic' | 'responsive' | undefined;
  className?: string;
}

type HeightType = {
  [key: string]: string | number;
};

const Image: React.FC<ImageProps> = ({
  height,
  maxheight,
  src,
  alt,
  layout,
  className,
}) => {
  let heights: HeightType = {};
  if (height) {
    heights.height = height;
  } else {
    heights.height = '100%';
  }
  if (maxheight) {
    heights.maxheight = maxheight;
  } else {
    heights.height = '100%';
  }

  return (
    <span className={`${styles.imageContainer} ${className}`} style={heights}>
      <NextImage src={src} className={styles.image} alt={alt} layout={layout} />
    </span>
  );
};

export default Image;
