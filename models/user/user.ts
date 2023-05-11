import { CategoriesItem } from 'models/item/item';

// @typescript-eslint/no-shadow
export enum AccountFlags {
  AUTHORIZED_USER = 'authorized_user',
  CUSTOMER_SERVICE = 'customer_service',
  TOUR_COMPLETED = 'tour_completed',
  FORCE_PASSWORD_CHANGE = 'force_password_change',
  TERMS_NOT_ACCEPTED = 'terms_not_accepted',
  DEAL_MAKING_PERMITTED = 'deal_making_permitted',
  DUE_DILIGENCE_QUESTIONNAIRE_SUBMITTED = 'due_diligence_questionnaire_submitted',
  FORCE_PLAN_SELECTION = 'force_plan_selection',
  DEAL_MAKING_PERMITTED_BY_VERIFIED_USERS_ONLY = 'deal_making_permitted_by_verified_users_only',
}

export enum UserRoles {
  LICENSEE = 'licensee',
  LICENSOR = 'licensor',
  AGENCY = 'agency',
}

export enum Plans {
  SELF_SERVICE = 'self_service',
  FULL_SERVICE = 'full_service',
}

export type NewUser = {
  email: string;
  password: string;
  stayLoggedIn: boolean;
};

export type UserByUuidResponse = {
  uuid: string;
  name_first: string;
  name_last: string;
  about: string;
  company_name: string;
  company_logo: {
    uri: string;
  };
  publicly_visible: string[];
  payment_reminder_days_ahead: number[];
  brands_represented: string[];
  roles: string[];
  territories: string[];
  categories: CategoriesItem[];
  current_licenses: string[];
  categories_licensee: string[];
  categories_licensee_core: CategoriesItem[];
  top_5_customers: string[];
  annual_wholesale_volume: number[];
  active_licensees: number[];
  distribution_channels: string[];
  business_years: number;
  account_flags: Array<AccountFlags>;
  plan?: Plans;
  verified_user?: boolean;
};

export type UserPostRequest = {
  user_uuid?: string;
  email?: string;
  password?: string;
  about?: string;
  name_first?: string;
  name_last?: string;
  payment_reminder_days_ahead?: number[];
  brands_represented?: string[];
  company_name?: string;
  business_years?: number;
  roles?: UserRoles[];
  publicly_visible?: string[];

  territories?: string[];
  distribution_channels?: string[];
  categories?: CategoriesItem[];
  current_licenses?: string[];
  categories_licensee?: CategoriesItem[];
  categories_licensee_core?: CategoriesItem[];
  top_5_customers?: string[];
  annual_wholesale_volume?: (number | undefined)[];
  active_licensees?: (number | undefined)[];
  plan?: Plans;
};

export type UserResponse = {
  uuid: string;
  email: string;
  name_first: string;
  name_last: string;
  about: string;
  brands_represented: string[];
  company_name: string;
  business_years: number;
  roles: string[];
  publicly_visible: string[];
  territories: string[];
  distribution_channels: string[];
  categories: CategoriesItem[];
  current_licenses: string[];
  categories_licensee: CategoriesItem[];
  categories_licensee_core: CategoriesItem[];
  top_5_customers: string[];
  annual_wholesale_volume: number[];
  payment_reminder_days_ahead: number[];
  active_licensees: number[];
  company_logo: {
    uri: string;
  };
  account_flags: Array<AccountFlags>;
  plan?: Plans;
  verified_user?: boolean;
};

export type UserRequest = {
  user_uuid: string;
};

export type CreateUuidResponse = {
  uuid: string;
};

export type UserPostResponse = {
  message: string;
  email: string;
  token: string;
};

export type UserByUuidRequest = {
  uuid: string;
};

export type UserPatchResponse = {
  message: string;
};

export type UserPropertyRequest = {
  user_uuid: string;
  filename_original: string;
  fileBase64String: string;
};

export type UserPropertyResponse = {
  uri: string;
  created_at: string;
};

export type SetAccountFlagRequest = {
  user_uuid: string;
  account_flag: string;
};

export type SetAccountFlagResponse = {
  account_flags: string[];
};

export type PatchUserPlanRequest = {
  userUuid: string;
  plan?: Plans;
};

export type PatchUserPlanResponse = {
  userUuid: string;
  plan?: Plans;
};
