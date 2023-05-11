import { ContractStatusEnum } from '../deals/deals';

export type AgreeContractRequest = {
  userUuid: string;
  dealUuid: string;
  signerName: string;
  signerEmail: string;
};

export type AgreeContractResponse = {
  dealUuid: string;
  contractStatus: ContractStatusEnum;
};
