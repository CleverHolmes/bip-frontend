import { useEffect, useState } from 'react';

import Icon, { IconNames } from 'components/Icon';

type Props = {
  file: File;
  uncheckCallback: () => void;
};

type ContentProps = {
  file: File;
};

const ImageCardContents: React.FC<ContentProps> = ({ file }) => {
  const [imgSrc, setImgSrc] = useState<string>('');

  useEffect(() => {
    const filereader = new FileReader();
    filereader.readAsDataURL(file);
    filereader.onload = function (evt) {
      const base64 = evt?.target?.result;
      if (base64) {
        setImgSrc(base64?.toString());
      }
    };
  });

  return (
    <>
      <img
        alt=""
        style={{ width: 'auto', height: '90%', objectFit: 'cover', zIndex: 0 }}
        src={imgSrc}
      />
    </>
  );
};

const FileCardContents: React.FC<ContentProps> = ({ file }) => {
  const [cardText, setCardText] = useState<string>(file.name);
  const [iconName, viewBox]: [IconNames, string] =
    file.type === 'application/pdf'
      ? ['Pdf', '0 0 600 600']
      : ['File', '0 0 128 128'];

  useEffect(() => {
    if (cardText.length > 20) {
      setCardText(
        cardText.substring(0, 10) +
          '...' +
          cardText.substring(cardText.length - 5, cardText.length)
      );
    }
  }, [file]);
  return (
    <>
      <div
        className="flex flex-row items-center h-full max-w-xs p-2 border min-w-xs rounded-xl"
        style={{ width: '120px' }}
      >
        <Icon
          name={iconName}
          viewBox={viewBox}
          size="40"
          className="shrink-0 grow-0"
        />
        <span
          className="max-h-full py-2 overflow-hidden text-xs"
          style={{ wordBreak: 'break-all' }}
        >
          {cardText}
        </span>
      </div>
    </>
  );
};

const FileCard: React.FC<Props> = ({ file, uncheckCallback }) => {
  return (
    <article className="relative flex flex-row items-center h-full max-w-xs min-h-full p-2 overflow-hidden min-w-xs shrink-0">
      {file.type.startsWith('image/') ? (
        <ImageCardContents file={file} />
      ) : (
        <FileCardContents file={file} />
      )}
      <Icon
        name="UncheckWhiteBackground"
        viewBox="0 0 24 24"
        size="24"
        className="absolute z-10 bg-white rounded-full cursor-pointer top-2 right-2 drop-shadow-lg"
        onClick={uncheckCallback}
      />
    </article>
  );
};

export default FileCard;
