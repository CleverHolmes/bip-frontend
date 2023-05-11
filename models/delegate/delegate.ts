import { dealType } from 'models/deals/deals';
import {UserRoles} from "models/user/user";

export type DelegateRequest = {
  params: { delegate_uuid: string };
};

export type DelegateItem = {
  uuid: string;
  permitted_deal_types: dealType[];
};

export type Delegate = {
  uuid: string;
  about: string;
  company_logo: {
    uri: string;
  };
  company_name: string;
  items: DelegateItem[];
  roles: UserRoles[];
};

export type PostDelegate = {
  delegate_uuid: string;
  user_uuid: string;
};
