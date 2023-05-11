import { ChatMessage, MessageContentType } from '@chatscope/use-chat';
import { ConversationId } from '@chatscope/use-chat/dist/Types';

export interface MessageAttachment {
  filename_original: string;
  filename_original_extension: string;
  size: number;
  uri: string;
}

export type SendMessageServiceParams = {
  message: ChatMessage<MessageContentType>;
  conversationId: ConversationId;
  uuid: string;
};
