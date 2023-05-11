import { ContractStatusEnum } from '../deals/deals';

export type SendToDocuSignRequest = {
  userUuid: string;
  dealUuid: string;
};

export type SendToDocuSignResponse = {
  dealUuid: string;
  contractStatus: ContractStatusEnum;
};
