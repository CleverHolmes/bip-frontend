import create from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

import { MessageResponse } from 'models/messages/message';
import actions from 'actions';
import {
  ConversationItem,
  ParticipantItem,
} from 'models/messages/conversation';
import { CategoriesItem } from 'models/item/item';
import { AccountFlags, NewUser, Plans, UserRoles } from 'models/user/user';

export interface StoreState {
  email: string;
  // ALL
  name_first: string;
  // ALL
  name_last: string;
  // AGENCY
  brands_represented: string[];
  brand_categories: string[];
  account_flags: AccountFlags[];
  account_flags_operating_user: AccountFlags[];
  plan?: Plans;
  // LICENSOR && LICENSEE
  company_name: string;
  // LICENSEE
  business_years: number;
  verified_user: boolean;
  // ALL
  roles: UserRoles[];
  // ALL
  territories: string[];
  // LICENSEE
  categories_licensee:
    | [
        {
          category_name: string;
          products: [
            {
              product_name: string;
            }
          ];
        }
      ]
    | [];
  categories_licensee_core: CategoriesItem[];
  // LICENSOR
  categories: CategoriesItem[];
  // LICENSEE
  // 5 TOTAL
  current_licenses: string[];
  // LICENSEE
  // 5 TOTAL
  top_5_customers: string[];
  // LICENSEE
  // THIS CAN BE WHATEVER- MIN, MAX, STRING, ETC
  annual_wholesale_volume: string | number[];
  // LICENSOR
  // THIS CAN BE WHATEVER- MIN, MAX, STRING, ETC
  active_licensees: string | number[];
  access_token: string;

  properties: any[];
  userUUID: string;

  actingAsNewUser: boolean;

  uuid: string;
  uuid_operating_user: string;

  // Dependencies
  chatStoragePopulated: boolean;
  userPopulated: boolean;
  current_page: string;
  company: string | undefined | null;
  userCurrentType: 'licensor' | 'collaboration' | 'agency';

  company_logo: { uri: string };
  distribution_channels: string[];
  publicly_visible: string[];

  chat: {
    participants: ParticipantItem[];
    conversations: ConversationItem[];
    messages: { [key: string]: MessageResponse[] };
    activeConversation: string;
  };

  notifications: MessageResponse[];

  refreshUser: boolean;
  refreshUserAppWrapper: boolean;

  navbarSearchText: string;

  primaryUserUUID: string;
  primaryUserFirstName: string;
  primaryUserLastName: string;

  logIn: boolean;

  addAccountFlag: (accountFlag: AccountFlags) => void;
  updateDueDiligenceModalOpen: (open: boolean) => void;
  updateDueDiligenceCongratsModalOpen: (open: boolean) => void;
  updatePlansModalOpen: (open: boolean) => void;
  addConversations: (conversations: ConversationItem[]) => void;
  addParticipants: (participants: ParticipantItem[]) => void;
  addMessages: (conversationUuid: string, messages: MessageResponse[]) => void;
  updateMessageStatus: (
    conversationUuid: string,
    index: number,
    read: boolean
  ) => void;
  updateConversationUnreadCount: (uuid: string, unreadCount: number) => void;
  updateActiveConversation: (uuid: string) => void;
  resetChat: () => void;
  addNotifications: (messages: MessageResponse[]) => void;
  updateNotificationStatus: (index: string, read: boolean) => void;
  updateNewUser: (newUser?: NewUser) => void;
  reset: () => void;
  loggingOut: boolean;

  run: boolean;
  stepIndex: number;
  steps: any;
  tourActive: boolean;
  tourCompleted: boolean;
  isDueDiligenceModalOpen: boolean;
  isDueDiligenceCongratsModalOpen: boolean;
  isPlansModalOpen: boolean;
  newUser?: NewUser;
}

const initialState: StoreState = {
  email: '',
  // ALL
  name_first: '',
  // ALL
  name_last: '',
  // AGENCY
  brands_represented: [],
  brand_categories: [],
  // LICENSOR && LICENSEE
  company_name: '',
  // LICENSEE
  business_years: 0,
  verified_user: false,
  // LICENSEE && LICENSOR
  categories: [],
  categories_licensee: [],
  categories_licensee_core: [],
  // LICENSOR
  active_licensees: '',
  // LICENSEE
  current_licenses: [],
  // LICENSEE
  top_5_customers: [],
  // ANNUAL WHOLESALE VOLUME
  annual_wholesale_volume: '',
  // ALL
  roles: [],

  account_flags: [],
  account_flags_operating_user: [],
  territories: [],
  access_token: '',

  properties: [],
  userUUID: '',
  company: null,
  uuid: '',
  uuid_operating_user: '',
  chatStoragePopulated: false,
  userPopulated: false,
  current_page: '',
  userCurrentType: 'licensor',
  company_logo: { uri: '' },
  distribution_channels: [],
  publicly_visible: [],
  actingAsNewUser: false,
  refreshUser: true,
  refreshUserAppWrapper: true,
  loggingOut: false,

  chat: {
    participants: [],
    conversations: [],
    messages: {},
    activeConversation: '',
  },

  notifications: [],
  navbarSearchText: '',
  logIn: false,
  run: false,
  stepIndex: 0,
  steps: [],
  tourActive: false,
  tourCompleted: false,
  isDueDiligenceModalOpen: false,
  isDueDiligenceCongratsModalOpen: false,
  isPlansModalOpen: false,

  primaryUserUUID: '',
  primaryUserFirstName: '',
  primaryUserLastName: '',
};

// Global application state
const useStore = create<StoreState>((set) => actions(set, initialState));

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('Store', useStore);
}

export default useStore;
