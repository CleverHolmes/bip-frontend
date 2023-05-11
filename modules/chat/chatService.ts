import {
  IChatService,
  ChatEventType,
  MessageContentType,
  ChatEventHandler,
  SendMessageServiceParams,
  SendTypingServiceParams,
  UpdateState,
  IStorage,
  ChatEvent,
  ChatMessage,
} from '@chatscope/use-chat';

declare type EventHandlers = {
  onMessage: ChatEventHandler<
    ChatEventType.Message,
    ChatEvent<ChatEventType.Message>
  >;
  onConnectionStateChanged: ChatEventHandler<
    ChatEventType.ConnectionStateChanged,
    ChatEvent<ChatEventType.ConnectionStateChanged>
  >;
  onUserConnected: ChatEventHandler<
    ChatEventType.UserConnected,
    ChatEvent<ChatEventType.UserConnected>
  >;
  onUserDisconnected: ChatEventHandler<
    ChatEventType.UserDisconnected,
    ChatEvent<ChatEventType.UserDisconnected>
  >;
  onUserPresenceChanged: ChatEventHandler<
    ChatEventType.UserPresenceChanged,
    ChatEvent<ChatEventType.UserPresenceChanged>
  >;
  onUserTyping: ChatEventHandler<
    ChatEventType.UserTyping,
    ChatEvent<ChatEventType.UserTyping>
  >;
  [key: string]: any;
};

type Cookie = {
  access_token: any;
  company_represented: string;
};

class ChatService implements IChatService {
  storage?: IStorage;
  updateState: UpdateState;
  cookies: Cookie;
  eventHandlers: EventHandlers;
  constructor(storage: IStorage, update: UpdateState, cookies: any) {
    this.eventHandlers = {
      onMessage: () => {},
      onConnectionStateChanged: () => {},
      onUserConnected: () => {},
      onUserDisconnected: () => {},
      onUserPresenceChanged: () => {},
      onUserTyping: () => {},
    };

    this.storage = storage;
    this.updateState = update;
    this.cookies = cookies;
  }

  async sendMessage({
    message,
    conversationId,
  }: SendMessageServiceParams): Promise<ChatMessage<MessageContentType>> {
    return message;
  }

  sendTyping({
    isTyping,
    content,
    conversationId,
    userId,
  }: SendTypingServiceParams): void {}
  on<T extends ChatEventType, H extends ChatEvent<T>>(
    evtType: T,
    evtHandler: ChatEventHandler<T, H>
  ): void {
    const key = `on${evtType.charAt(0).toUpperCase()}${evtType.substring(1)}`;
    if (key in this.eventHandlers) {
      this.eventHandlers[key] = evtHandler;
    }
  }
  off<T extends ChatEventType, H extends ChatEvent<T>>(
    evtType: T,
    eventHandler: ChatEventHandler<T, H>
  ): void {
    const key = `on${evtType.charAt(0).toUpperCase()}${evtType.substring(1)}`;
    if (key in this.eventHandlers) {
      this.eventHandlers[key] = () => {};
    }
  }
}

export default ChatService;
