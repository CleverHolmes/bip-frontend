import { Cookies } from 'react-cookie';
import { v4 as uuidv4 } from 'uuid';
import snakecaseKeys from 'snakecase-keys';
import camelcaseKeys from 'camelcase-keys';
import { toast } from 'react-toastify';

import { WS_API_URL } from 'modules/config';
import { COOKIE_TOKEN } from 'hooks/useAuth';
import {
  SET_AUTHORIZATION_TOKEN,
  NEW_MESSAGE,
  UPDATE_UNREAD_COUNT,
  NEW_MESSAGE_CONVERSATION,
  PING,
  PONG,
} from './constants';
import { MessageResponse } from 'models/messages/message';
import { UpdateUnreadCountResponse } from 'models/messages/updateUnreadCount';
import useStore from 'modules/Store';
import { ConversationResponse } from 'models/messages/conversation';

export let socket: WebSocket;
export let interval: ReturnType<typeof setInterval>;

export const connectSocket = () => {
  const cookies = new Cookies();
  const tokenCookie = cookies.get(COOKIE_TOKEN);
  const tokenSession = window.sessionStorage.getItem('access_token');
  const token = tokenCookie ? tokenCookie : tokenSession;
  const reconnectIntervalDefault = 1000;
  let reconnectInterval = reconnectIntervalDefault;

  if (!socket) {
    disconnectSocket();
    console.log('Websocket connecting ...');
    socket = new WebSocket(`${WS_API_URL}`);
    console.log('Websocket created.');

    socket.addEventListener('open', () => {
      send(SET_AUTHORIZATION_TOKEN, 'POST', {
        token,
      });
    });

    socket.addEventListener('message', (event: MessageEvent) => {
      if (event.data !== 'Successfully authenticated.') {
        if (event.data === 'Unauthorized.') {
          (socket as any) = undefined;
          return;
        }

        const parsedData = JSON.parse(event.data);

        switch (parsedData._pubSubMessageClass) {
          case NEW_MESSAGE: {
            const message: MessageResponse = camelcaseKeys(parsedData.message, {
              deep: true,
            });
            if (message.messageType !== 99) {
              const activeConversation =
                useStore.getState().chat.activeConversation;
              const addMessages = useStore.getState().addMessages;

              if (activeConversation === message.messageConversationUuid) {
                addMessages(message.messageConversationUuid, [message]);
              }
            }
            if (message.messageType === 99) {
              const addNotifications = useStore.getState().addNotifications;
              addNotifications([message]);
              toast.info(message.message);
            }
            break;
          }
          case NEW_MESSAGE_CONVERSATION: {
            const data: ConversationResponse = camelcaseKeys(
              parsedData.returnValue,
              {
                deep: true,
              }
            );
            const conversations = useStore.getState().chat.conversations;
            const addParticipants = useStore.getState().addParticipants;
            const addConversations = useStore.getState().addConversations;

            addParticipants(data.participants);
            addConversations([...conversations, ...data.messageConversations]);
            break;
          }
          case UPDATE_UNREAD_COUNT: {
            const data: UpdateUnreadCountResponse = camelcaseKeys(parsedData, {
              deep: true,
            });
            const activeConversation =
              useStore.getState().chat.activeConversation;
            const updateConversationUnreadCount =
              useStore.getState().updateConversationUnreadCount;

            if (activeConversation !== data.messageConversationUuid) {
              updateConversationUnreadCount(
                data.messageConversationUuid,
                data.unreadCount
              );
            }

            break;
          }
          case PING: {
            send(PONG, 'POST', {
              message: 'PONG',
            });
            break;
          }
          default:
            return;
        }
      } else {
        reconnectInterval = reconnectIntervalDefault;
      }
    });

    socket.onclose = function (e) {
      console.log(
        `Socket is closed. Reconnect will be attempted in ${reconnectInterval} milliseconds.`,
        e.reason
      );
      (socket as any) = undefined;

      setTimeout(() => {
        connectSocket();
      }, reconnectInterval);
    };

    socket.onerror = function (err) {
      console.error(
        'Websocket encountered error: ',
        (err as any)?.message,
        'Closing socket'
      );
      socket.close();
    };
  }
};

export const send = <T>(path: string, method: 'GET' | 'POST', body?: T) => {
  if (socket) {
    socket.send(
      JSON.stringify({
        request_uuid: uuidv4(),
        base_path: `/api/v1/${path}`,
        method,
        body: body
          ? {
              ...snakecaseKeys(body, {
                deep: true,
              }),
            }
          : undefined,
      })
    );
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.close();
    clearInterval(interval);
  }
};

const websocket = {
  connectSocket,
  send,
};

export default websocket;
