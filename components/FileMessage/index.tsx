import mime from 'mime-types';
import React, { useEffect, useState } from 'react';
import { Loader } from '@chatscope/chat-ui-kit-react';
import { AttachmentContent } from '@chatscope/use-chat';

import OwnImage from 'components/Image';
import { MessageAttachment } from 'models/messages/message';
import Icon, { IconNames } from 'components/Icon';

type Props = {
  fillHeight?: boolean;
  messageAttachment: AttachmentContent;
};

const ImageCardContents: React.FC<Props> = ({ messageAttachment }) => {
  return (
    <>
      <OwnImage
        src={messageAttachment.url}
        alt={messageAttachment.url}
        width="100%"
        layout="fill"
      />
    </>
  );
};

const FileCardContents: React.FC<Props> = ({ messageAttachment }) => {
  const content: MessageAttachment & File =
    messageAttachment.content as MessageAttachment & File;

  const [cardText, setCardText] = useState<string>(
    content.filenameOriginal || content.name || ''
  );
  const [iconName, viewBox] =
    content.filenameOriginalExtension === 'application/pdf'
      ? ['Pdf', '0 0 600 600']
      : ['File', '0 0 128 128'];

  useEffect(() => {
    if (cardText.length > 40) {
      setCardText(
        cardText.substring(0, 30) +
          '...' +
          cardText.substring(cardText.length - 8, cardText.length)
      );
    }
  }, []);

  return (
    <>
      <div className="flex flex-row items-center h-full max-w-sm p-2 border min-w-sm rounded-xl">
        <Icon
          name={iconName as IconNames}
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

const FileMessage: React.FC<Props> = ({
  messageAttachment,
  fillHeight = true,
}) => {
  // const [tooltip, showTooltip] = useState(true);
  const content: MessageAttachment & File =
    messageAttachment.content as MessageAttachment & File;
  const url: string = messageAttachment.url;

  if (!url) {
    return <Loader />;
  }
  let mimeType = mime.lookup(content.filenameOriginalExtension);
  if (mimeType === false) {
    mimeType = content.filenameOriginalExtension || content.type;
  }
  content.filenameOriginalExtension = mimeType;
  const heightFillStyle = fillHeight ? 'h-full' : '';

  return (
    <div className="relative">
      {/* {tooltip && <ReactTooltip place="right" effect="solid" />} */}
      <div
        className={
          'flex flex-row items-center w-full rounded-xl p-2 overflow-hidden relative ' +
          heightFillStyle
        }
      >
        {mimeType.startsWith('image/') ? (
          <ImageCardContents messageAttachment={messageAttachment} />
        ) : (
          <FileCardContents messageAttachment={messageAttachment} />
        )}
      </div>
      <a
        className="absolute z-10 flex items-center justify-center w-8 h-8 m-auto bg-white border-2 rounded-full cursor-pointer -top-1 -left-1 border-inputGray"
        target="_blank"
        href={`${url}?download=1`}
        rel="noreferrer"
        // data-tip="Download"
        // onMouseEnter={() => showTooltip(true)}
        // onMouseLeave={() => {
        //   showTooltip(false);
        //   setTimeout(() => showTooltip(true), 50);
        // }}
      >
        <Icon
          name="Download"
          viewBox="0 0 23 17"
          size="18"
          className="m-auto stroke-primary md:stroke-transparent"
        />
      </a>
    </div>
  );
};

export default FileMessage;
