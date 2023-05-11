import { useTranslation } from 'next-i18next';
import Image from 'next/image';

import Icon from 'components/Icon';
import { convertedImageLogo } from 'public/helpers/convertedImageLogo';
import customImageLoader from 'utils/image-loader';

interface PropsUploadFile {
  image: string;
  title: string;
  uri?: string;
  deleteFile?: (uri: string) => void;
  deleteCapable: boolean;
}

const UploadedFileSmaller: React.FC<PropsUploadFile> = ({
  image,
  title,
  uri,
  deleteFile,
  deleteCapable,
}) => {
  const { t } = useTranslation();

  const imageConverted = convertedImageLogo(image);

  return (
    <div className="relative flex flex-col justify-center w-24 max-w-sm mb-6 mr-6 bg-white rounded-lg shadow-lg">
      <div className="absolute z-20 flex items-center justify-center w-6 h-6 bg-white rounded-lg shadow-lg right-2 top-2 hover:bg-button">
        <div className="relative inline-block w-full h-full group">
          <Icon
            name="ThreeDots"
            className="h-full mx-auto my-auto cursor-pointer fill-primary hover:fill-white"
            viewBox="0 0 20 4"
            size="12"
          />
          <div className="absolute z-50 hidden w-40 text-base rounded-lg shadow-lg font-custom1 text-primary group-hover:block group-hover:bg-white">
            <a
              className="z-50 flex w-full px-8 py-3 rounded-b-lg cursor-pointer hover:bg-backgroundInput"
              href={`${uri ? uri : image}?download=1`}
              target="_blank"
            >
              Download
            </a>
            {deleteFile && deleteCapable && (
              <div
                className="z-50 flex w-full px-8 py-3 rounded-b-lg cursor-pointer hover:bg-backgroundInput"
                onClick={() => uri && deleteFile(uri)}
              >
                Delete
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="relative w-10 h-10 mx-auto mt-6">
        <Image
          loader={customImageLoader}
          src={imageConverted}
          alt={title}
          layout="fill"
          width={60}
          objectFit={'contain'}
          className="mx-auto shadow-lg bg-none"
        />
      </div>
      <div className="px-2 mx-auto my-4 text-[10px] text-center break-all font-custom2 text-inputGray">
        {title}
      </div>
    </div>
  );
};

export default UploadedFileSmaller;
