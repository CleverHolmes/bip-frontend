import { environment } from '../modules/config';

export default function customImageLoader({ src, width, quality }: any) {
  if (src.indexOf('/static/user') < 0)
    return `${src}?w=${width}&q=${quality || 100}`;
  // @ts-ignore

  if (src.indexOf('http') > -1) {
    return `${src}?w=${width}&q=${quality || 100}`;
  }

  return `${
    environment === 'development'
      ? 'https://development.bip.co'
      : 'https://bip.co'
  }${src}?w=${width}&q=${quality || 100}`;
}
