import { ContractStatusEnum } from '../deals/deals'

export type RetrieveContractRequest = {
  userUuid: string;
  dealUuid: string;
};

export type RetrieveContractResponse = {
  dealUuid: string;
  contractStatus: ContractStatusEnum;
  filenameOriginal: string;
  uri: string;
};
