import {
  AttachmentContent,
  ChatMessage,
  Conversation,
  ConversationRole,
  MessageContent,
  MessageContentType,
  MessageDirection,
  MessageStatus,
  Participant,
  Presence,
  TextContent,
  TypingUsersList,
  User,
  UserStatus,
} from '@chatscope/use-chat';
import { Cookies } from 'react-cookie';

import { MessageAttachment, MessageResponse } from 'models/messages/message';
import {
  ConversationItem,
  ParticipantItem,
} from 'models/messages/conversation';
import useStore from 'modules/Store';
import avatar from 'public/images/avatar.png';
import { uploadFileAttachmentBase64 } from 'api/messages/uploadFileAttachmentBase64';
import { sendMessageCall } from 'api/messages/sendMessage';
import { SendMessageServiceParams } from './types';

export const checkSenderUuid = (messageUserUuid: string) => {
  const cookies = new Cookies();
  const userUuid = useStore.getState().userUUID;

  const cookieCompanyRepresented = cookies.get('company_represented');
  const sessionCompanyRepresented = window.sessionStorage.getItem(
    'company_represented'
  );

  return cookieCompanyRepresented
    ? cookies.get('company_represented') === messageUserUuid
    : sessionCompanyRepresented
    ? sessionCompanyRepresented === messageUserUuid
    : userUuid === messageUserUuid;
};

export const createMessage = (message: MessageResponse) => {
  const isSender = checkSenderUuid(message.userUuid);
  let chatMessage: ChatMessage<MessageContentType>;

  if (message.messageType === 0) {
    chatMessage = new ChatMessage({
      id: message.uuid,
      content: message.message as unknown as MessageContent<TextContent>,
      contentType: MessageContentType.TextHtml,
      senderId: message.userUuid,
      direction: isSender
        ? MessageDirection.Outgoing
        : MessageDirection.Incoming,
      status: message.messageStatus?.read
        ? MessageStatus.Seen
        : MessageStatus.Sent,
      createdTime: new Date(message.createdAt),
    });
  } else {
    const attachmentContent: AttachmentContent = {
      url: message.messageAttachment?.uri,
      data: message.messageAttachment?.uri as unknown as ArrayBuffer,
      content: message.messageAttachment,
    };

    chatMessage = new ChatMessage({
      id: message.uuid,
      content: attachmentContent,
      contentType: MessageContentType.Attachment,
      senderId: message.userUuid,
      direction: isSender
        ? MessageDirection.Outgoing
        : MessageDirection.Incoming,
      status: message.messageStatus?.read
        ? MessageStatus.Seen
        : MessageStatus.Sent,
      createdTime: new Date(message.createdAt),
    });
  }

  return chatMessage;
};

export const createUser = (participant: ParticipantItem) => {
  return new User({
    id: participant.uuid,
    presence: new Presence({
      status: UserStatus.Available,
      description: '',
    }),
    firstName: participant.nameFirst,
    lastName: participant.nameLast,
    username: '',
    email: '',
    avatar: participant.avatar?.uri || avatar.src,
    bio: '',
    data: {
      companyLogo: participant.companyLogo.uri,
      companyName: participant.companyName,
      verifiedUser: participant.verifiedUser,
    },
  });
};

export const createConversation = (conversation: ConversationItem) => {
  return new Conversation({
    id: conversation.uuid,
    participants: conversation.participantUuids.map((id) => {
      return new Participant({
        id,
        role: new ConversationRole([]),
      });
    }),
    unreadCounter: conversation.unreadCount,
    typingUsers: new TypingUsersList({ items: [] }),
    draft: '',
    data: {
      name: conversation.conversationName,
      deal_uuid: conversation.dealUuid,
      imageLogo: conversation.item.imageLogo,
      description: conversation.item.description,
      images: conversation.item.images,
      uuid: conversation.item.uuid,
      userUuid: conversation.userUuid,
    },
  });
};

export const sendMessage = async ({
  message,
  conversationId,
  uuid,
}: SendMessageServiceParams): Promise<void> => {
  if (message.contentType !== MessageContentType.TextHtml) {
    const response = await uploadFileAttachmentBase64({
      userUuid: message.senderId,
      messageConversationUuid: conversationId,
      filenameOriginal: (message.content.content as File).name,
      fileContentsBase64String: (message.content as AttachmentContent).url,
      messageUuid: uuid,
    });

    const file: File = message.content.content as File;
    const messageAttachment: MessageAttachment = {
      filenameOriginal: file.name,
      filenameOriginalExtension: file.type,
      uri: response.uri,
      size: file.size,
    };

    const attachmentContent = {
      url: messageAttachment.uri,
      data: messageAttachment.uri as unknown as ArrayBuffer,
      content: messageAttachment,
    };
    message.content = attachmentContent;
  } else {
    await sendMessageCall({
      messageConversationUuid: conversationId,
      messageType: 0,
      message: String(message.content),
      userUuid: message.senderId,
      uuid,
    });
  }
};
