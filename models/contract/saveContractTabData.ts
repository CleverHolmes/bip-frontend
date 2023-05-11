export enum SignTabEnum {
  COUNTERPARTY = 'counterparty',
  PARTY = 'party',
}

export type ContractTabDataItem = {
  x: number;
  y: number;
  name: SignTabEnum;
};

export type ContractTabData = ContractTabDataItem[];

export type SaveContractTabDataRequest = {
  userUuid: string;
  dealUuid: string;
  tabData: string;
};

export type SaveContractTabDataResponse = {
  dealUuid: string;
};
