import { PaymentAccountType } from 'dependency-layer/be.types';

export interface PayoutDetails {
  payoutMethod: PaymentAccountType;
  fromEmail?: string;
  amount: number;
  customDescriptor: string;
  reference: string;
  providerAccountId: string;
}
