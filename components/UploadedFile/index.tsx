import { useTranslation } from 'next-i18next';
import Image from 'next/image';

import Icon from 'components/Icon';
import customImageLoader from 'utils/image-loader';

interface PropsUploadFile {
  image: string;
  download?: string;
  title?: string;
  uri?: string;
  deleteFile?: (uri: string) => void;
  deleteCapable: boolean;
}

const UploadedFile: React.FC<PropsUploadFile> = ({
  image,
  download,
  title,
  uri,
  deleteFile,
  deleteCapable,
}) => {
  const { t } = useTranslation();

  return (
    <div className="relative flex flex-col justify-center max-w-sm mb-6 mr-6 bg-white rounded-lg shadow-lg w-28 md:min-w-28 md:w-36 md:min-w-36">
      <div className="absolute z-20 flex items-center justify-center w-12 h-12 bg-white rounded-lg shadow-lg right-4 top-4 hover:bg-button">
        <div className="relative inline-block w-full h-full group">
          <Icon
            name="ThreeDots"
            className="h-full mx-auto my-auto cursor-pointer fill-primary hover:fill-white"
            viewBox="0 0 20 4"
            size="18"
          />
          <div className="absolute z-20 hidden text-base rounded-lg shadow-lg top-10 -right-4 sm:left-4 sm:right-auto w-30 font-custom1 text-primary group-hover:block group-hover:bg-white">
            <a
              className="flex w-full px-8 py-3 rounded-b-lg cursor-pointer hover:bg-backgroundInput"
              href={`${download ? download : image}?download=1`}
            >
              Download
            </a>
            {deleteFile && deleteCapable && (
              <div
                className="flex w-full px-8 py-3 rounded-b-lg cursor-pointer hover:bg-backgroundInput"
                onClick={() => uri && deleteFile(uri)}
              >
                Delete
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="relative w-12 h-12 mx-auto mb-5 md:w-20 md:h-20 mt-14">
        <Image
          loader={customImageLoader}
          src={image}
          alt={image}
          layout="fill"
          width={80}
          objectFit={'contain'}
          className="mx-auto shadow-lg bg-none"
        />
      </div>
      <div className="mx-4 my-5 text-xs font-semibold break-all font-custom2 text-primary">
        {title}
      </div>
    </div>
  );
};

export default UploadedFile;
