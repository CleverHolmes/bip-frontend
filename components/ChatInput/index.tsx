import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  AttachmentContent,
  ChatMessage,
  MessageContent,
  MessageContentType,
  MessageDirection,
  MessageStatus,
  TextContent,
  useChat,
} from '@chatscope/use-chat';
import { useTranslation } from 'next-i18next';

import FileCard from 'components/FileCard';
import FileUploader from 'components/FileUploader';
import Icon from 'components/Icon';
import { sendMessage } from 'modules/chat/utils';
import { getCurrentUuid } from 'utils/getCurrentUuid';

type Props = {};

const ChatInput: React.FC<Props> = () => {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const { activeConversation, currentMessage, setCurrentMessage, addMessage } =
    useChat();

  const InputDivClassBase =
    'relative flex flex-row w-full pl-6 pr-2 py-4 items-center bg-backgroundInput ';
  const fileNonactiveInputDivClass = InputDivClassBase + 'rounded-full';
  const fileActiveInputDivClass = InputDivClassBase + 'rounded-full';
  const maxLength = 2000;

  const uncheckCallback = (index: number) => {
    const filesCopy = [...files];
    filesCopy.splice(index, 1);
    setFiles(filesCopy);
  };

  const handleFileUpload = (fileList: FileList) => {
    let filesArray: File[] = [];

    for (let i = 0; i < fileList.length; i++) {
      filesArray.push(fileList[i]);
    }

    setFiles(filesArray);
  };

  const displayFileCards = () => {
    return files.map((file, index) => {
      return (
        <FileCard
          key={index}
          file={file}
          uncheckCallback={() => {
            uncheckCallback(index);
          }}
        />
      );
    });
  };

  const handleInputKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  const handleChange = (event: React.BaseSyntheticEvent) => {
    setCurrentMessage(event.target.value);
  };

  const handleSend = () => {
    if (!activeConversation) {
      return;
    }

    files.map((file) => {
      let filereader = new FileReader();
      filereader.readAsDataURL(file);
      filereader.onload = function (evt) {
        let base64 = evt?.target?.result;

        if (base64) {
          const attachmentContent: AttachmentContent = {
            url: base64.toString(),
            data: base64 as ArrayBuffer,
            content: file,
          };
          const uuid = uuidv4();
          const fileMessage = new ChatMessage({
            id: uuid,
            content: attachmentContent,
            contentType: MessageContentType.Attachment,
            senderId: getCurrentUuid(),

            direction: MessageDirection.Outgoing,
            status: MessageStatus.Sent,
          });
          sendMessage({
            message: fileMessage,
            conversationId: activeConversation.id,
            uuid,
          });
          addMessage(fileMessage, activeConversation.id, false);
        }
      };
    });

    setFiles([]);

    if (currentMessage.length === 0) {
      return;
    }
    const uuid = uuidv4();
    const message = new ChatMessage({
      id: uuid,
      content: currentMessage as unknown as MessageContent<TextContent>,
      contentType: MessageContentType.TextHtml,
      senderId: getCurrentUuid(),
      direction: MessageDirection.Outgoing,
      status: MessageStatus.Sent,
    });

    if (activeConversation) {
      sendMessage({ message, conversationId: activeConversation.id, uuid });
      addMessage(message, activeConversation.id, false);
    }

    setCurrentMessage('');
  };

  return (
    <>
      <FileUploader
        className="flex items-center h-full mx-4 hover:opacity-80 fill-primary"
        uploadButton={
          <Icon
            name="Paperclip"
            viewBox="0 0 544 544"
            size="24"
            className="cursor-pointer min-w-24 min-h-24"
          />
        }
        uploadCallback={handleFileUpload}
      />
      <div
        className="relative flex flex-col py-2 mr-4 grow-0"
        style={{ width: '100%' }}
      >
        <div
          className={
            files.length === 0
              ? fileNonactiveInputDivClass
              : fileActiveInputDivClass
          }
        >
          {files.length === 0 && (
            <input
              className="w-full h-full text-base bg-transparent outline-0 font-custom1"
              value={currentMessage}
              onChange={handleChange}
              onKeyDown={handleInputKeyDown}
              placeholder="Send Message"
              maxLength={maxLength}
            />
          )}
          {files.length > 0 && (
            <div className="flex flex-col items-start justify-start w-full h-20 overflow-auto rounded-tl-xl rounded-tr-xl bg-backgroundInput">
              <div className="static top-0 flex flex-row items-center w-full h-full max-w-full">
                {displayFileCards()}
              </div>
              <hr
                style={{
                  width: '100%',
                  border: '1px solid #eaeaea',
                }}
              />
            </div>
          )}
          {files.length === 0 && (
            <div className="text-inputGray text-sm absolute right-[60px] bottom-[5px]">
              {t('chat.characters-left')}: {currentMessage.length}/{maxLength}
            </div>
          )}
          <div
            onClick={handleSend}
            className="flex items-center mr-2 rounded-full cursor-pointer hover:opacity-80 bg-button md:bg-transparent"
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="2"
                y="2"
                width="32"
                height="32"
                rx="16"
                fill="url(#paint0_linear_3747_4257)"
              />
              <path
                d="M24.1397 10.9124L11.3244 15.9682C10.7378 16.1939 10.6927 17.0065 11.2492 17.3074L14.829 19.2636C14.9494 19.3388 15.1149 19.3237 15.2352 19.2486L18.4089 17.1269C18.7249 16.9162 19.0858 17.2924 18.8752 17.5933L16.7543 20.7683C16.6791 20.8886 16.6641 21.039 16.7393 21.1745L18.6947 24.7557C18.9955 25.3125 19.8078 25.2523 20.0334 24.6805L25.0874 11.8604C25.3279 11.2586 24.7413 10.6718 24.1397 10.9124L24.1397 10.9124Z"
                fill="white"
              />
              <rect
                x="1"
                y="1"
                width="34"
                height="34"
                rx="17"
                stroke="#4AA7CA"
                strokeOpacity="0.2"
                strokeWidth="2"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_3747_4257"
                  x1="24.8975"
                  y1="-83.5652"
                  x2="-59.6121"
                  y2="-50.655"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0.157862" stopColor="#4AA7CA" />
                  <stop offset="0.832047" stopColor="#4FBAF0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatInput;
