import { MessageResponse } from 'models/messages/message';
import { StoreState } from 'modules/Store';
import { AccountFlags, NewUser } from 'models/user/user';
import chat from './chat';

const actions = (set: any, initialState: StoreState) => ({
  ...initialState,
  ...chat(set, initialState),
  addAccountFlag: (accountFlag: AccountFlags) =>
    set((state: StoreState) => {
      if (state.uuid_operating_user) {
        return {
          ...state,
          account_flags_operating_user: [
            ...state.account_flags_operating_user,
            accountFlag,
          ],
        };
      }

      return {
        ...state,
        account_flags: [...state.account_flags, accountFlag],
      };
    }, true),
  addNotifications: (notifications: MessageResponse[]) =>
    set(
      (state: StoreState) => ({
        ...state,
        notifications: [...state.notifications, ...notifications],
      }),
      true
    ),
  updateNotificationStatus: (uuid: string, read: boolean = true) =>
    set((state: StoreState) => {
      const newNotifications = [...state.notifications];
      const newNotification = newNotifications.find(
        (notification) => notification.uuid === uuid
      );

      if (newNotification) {
        newNotification.messageStatus.read = read;
      }

      return {
        ...state,
        notifications: newNotifications,
      };
    }, true),
  updateDueDiligenceModalOpen: (open: boolean) =>
    set(
      (state: StoreState) => ({
        ...state,
        isDueDiligenceModalOpen: open,
      }),
      true
    ),
  updateDueDiligenceCongratsModalOpen: (open: boolean) =>
    set(
      (state: StoreState) => ({
        ...state,
        isDueDiligenceCongratsModalOpen: open,
      }),
      true
    ),
  updatePlansModalOpen: (open: boolean) =>
    set(
      (state: StoreState) => ({
        ...state,
        isPlansModalOpen: open,
      }),
      true
    ),
  updateNewUser: (newUser?: NewUser) =>
    set(
      (state: StoreState) => ({
        ...state,
        newUser,
      }),
      true
    ),
  reset: () => {
    set(initialState);
  },
});

export default actions;
