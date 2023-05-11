import { ContractTabData } from 'models/contract/saveContractTabData';

type itemType = 'Licensable Property' | 'Licensable Patent' | 'Patent Rights';
export type dealType = 'Licensing' | 'Collaboration';

export enum StatusEnum {
  DRAFT = 'Draft',
  PROPOSED = 'Proposed',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
}

export enum ContractStatusEnum {
  NOT_UPLOADED = 'not_uploaded',
  UPLOADED = 'uploaded',
  AGREED_PARTY = 'agreed_party',
  AGREED_COUNTERPARTY = 'agreed_counterparty',
  AGREED_BOTH_PARTIES = 'agreed_both_parties',
  SIGNATURE_TABS_PLACED = 'signature_tabs_placed',
  SENT_TO_DOCUSIGN = 'sent_to_docusign',
}

export type CustomType = {
  fieldName: string;
  fieldValue: string;
};

export interface User {
  uuid: string;
  company_logo: { uri: string };
  company_name: string;
  verified_user: boolean;
}

interface Item {
  wordmark_verified: boolean;
  uuid: string;
  user_uuid: string;
  name: string;
  name_slug: string;
  description: string;
  item_type: itemType;
  permitted_deal_types: dealType;
  images: string[];
  image_logo: string;
  image_banner: string;
  territories: string[];
  distribution_channels: string[];
  categories: string[];
  offer_deadline: string;
  royalty_percent: number;
  non_negotiable_terms: string[];
  minimum_guarantee_percent: number;
  minimum_guarantee_amount: number;
}

export type DealResponse = {
  uuid: string;
  revision: number;
  contract_tab_data: ContractTabData[] | string;
  contract_status: ContractStatusEnum;
  status: StatusEnum;
  user_uuid: string;
  counterparty_user_uuid: string;
  message_conversation_uuid: string;
  current_user_uuid: string;
  is_draft: boolean;
  deal_type: dealType;
  deal_name: string;
  description: string;
  property: string;
  exclusive: string;
  categories: string;
  territories: string;
  term: string;
  distribution_channels: string;
  date_of_distribution: string;
  licensor_marketing_commitment: string;
  royalty_rate: string;
  guaranteed_minimum_royalty_payments: string;
  advance_payments: string;
  payment_and_reporting: string;
  sample_requirements: string;
  sell_off_period: string;
  additional_provisions: string;
  custom_fields: CustomType[];
  created_at: string;
  contract_user_signer_name: string;
  contract_counterparty_signer_name: string;
  user: User;
  counterparty: User;
  item: Item;
  collaboration_item: Item;
};

export type DraftRequest = {
  user_uuid: string;
  counterparty_user_uuid: string;
  item_uuid: string;
  deal_type: dealType;
  description?: string;
  property?: string;
  exclusive?: string;
  categories?: string;
  territories?: string;
  term?: string;
  distribution_channels?: string;
  date_of_distribution?: string;
  licensor_marketing_commitment?: string;
  royalty_rate?: string;
  guaranteed_minimum_royalty_payments?: string;
  advance_payments?: string;
  collaboration_item_uuid?: string;
  payment_and_reporting?: string;
  sample_requirements?: string;
  sell_off_period?: string;
  additional_provisions?: string;
  custom_fields?: CustomType[];
};

export type DealsRequest = {
  user_uuid: string;
  uuid: string;
};

export type DealsRequestAttachments = {
  user_uuid: string;
  deal_uuid: string;
};

export type DealRevisionResponse = {
  uuid: string;
  revision: number;
  user_uuid: string;
  counterparty_user_uuid: string;
  current_user_uuid: string;
  status: StatusEnum;
};

export type DraftProposalSentResponse = {
  uuid: string;
  revision: number;
  current_user_uuid: string;
  status: StatusEnum;
};

export type DealAttachmentsResponse = {
  uri: string;
  user_uuid: string;
  filename_original: string;
};

export type DraftResponse = {
  uuid: string;
  revision: number;
};

export type AcceptedResponse = {
  uuid: string;
  user_uuid: string;
  counterparty_user_uuid: string;
  accepted_at: string;
};

export type RejectedResponse = {
  uuid: string;
  user_uuid: string;
  counterparty_user_uuid: string;
  rejected_at: string;
};

export type CreateDraftRequest = {
  item_uuid: string;
  counterparty_user_uuid: string;
  user_uuid: string;
  deal_type: 'Collaboration' | 'Licensing';
};

export type UploadFileAttachmentBase64Request = {
  user_uuid: string;
  filename_original: string;
  deal_uuid: string;
  fileContentsBase64String: string;
};

export type UploadFileAttachmentBase64Response = {
  uri: string;
  created_at: string;
};

export type DeleteDraftRequest = {
  data: {
    user_uuid: string;
    deal_uuids: string[];
  };
};

export type DeleteDraftResponse = {
  deal_uuids: string[];
};
