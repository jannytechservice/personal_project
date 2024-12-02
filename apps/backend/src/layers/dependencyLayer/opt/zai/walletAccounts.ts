import {
  GetWalletAccountNppDetailsResponse,
  PayBillResponse,
  WalletAccountsResponse,
} from 'dependency-layer/zai/walletAccounts.types';

const { ZAI_DOMAIN } = process.env;

// get wallet
export const getWallet = async (
  zaiAuthToken: string,
  walletId: string
): Promise<WalletAccountsResponse> => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Bearer ${zaiAuthToken}`,
    },
  };

  const response = await fetch(
    `${ZAI_DOMAIN}/wallet_accounts/${walletId}`,
    options
  );

  if (!response.ok) {
    console.log('ERROR getWallet: ', JSON.stringify(response));
    throw new Error(`ERROR getWallet: ${response.status}`);
  }

  return response.json();
};

// get wallet account npp details
export const getWalletAccountNppDetails = async (
  zaiAuthToken: string,
  walletAccountId: string
): Promise<GetWalletAccountNppDetailsResponse> => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Bearer ${zaiAuthToken}`,
    },
  };

  const response = await fetch(
    `${ZAI_DOMAIN}/wallet_accounts/${walletAccountId}/npp_details`,
    options
  );

  if (!response.ok) {
    console.log('ERROR getWalletAccountNppDetails: ', JSON.stringify(response));
    throw new Error(`ERROR getWalletAccountNppDetails: ${response.status}`);
  }

  return response.json();
};

// pay a bill
export const payBpayBill = async (
  zaiAuthToken: string,
  walletAccountId: string,
  bill: { amount: number; account_id: string; reference_id: string }
): Promise<PayBillResponse> => {
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Bearer ${zaiAuthToken}`,
    },
    body: JSON.stringify(bill),
  };

  const response = await fetch(
    `${ZAI_DOMAIN}/wallet_accounts/${walletAccountId}/bill_payment`,
    options
  );

  if (!response.ok) {
    const error = await response.text();
    console.log('ERROR payBill: ', JSON.stringify(error));
    throw new Error(`ERROR payBill: ${JSON.stringify(error)}`);
  }

  return response.json();
};

interface WithdrawFundsRequest {
  account_id: string; // Account to withdraw to.
  amount: number; // Amount (in cents) to withdraw.
  custom_descriptor?: string; // A descriptor specified by the customer to be passed on the withdraw call.
  reference_id?: string; // Unique reference information that can be specified for a for wallet withdrawal request.
}

interface Links {
  transactions: string;
  wallet_accounts: string;
  paypal_accounts: string;
  bank_accounts: string;
  bpay_accounts: string;
  items: string;
  users: string;
}

interface Disbursements {
  id: string;
  reference_id: string;
  amount: number;
  currency: string;
  batch_id: string;
  cuscal_payment_transaction_id: string;
  created_at: string;
  updated_at: string;
  state: string;
  to: string;
  bank_name: string;
  bank_account_name: string;
  bank_account_number: string;
  bank_routing_number: string;
  npp_payout_state: string;
  account_name: string;
  biller_name: string;
  biller_code: string;
  crn: string;
  links: Links;
}

interface WithdrawFundsResponse {
  disbursements: Disbursements;
}

// payout funds to bank account
export const withdrawFunds = async (
  zaiAuthToken: string,
  walletAccountId: string,
  withdrawParams: WithdrawFundsRequest
): //{ amount, custom_descriptor }: { amount: number, custom_descriptor?: string}
Promise<WithdrawFundsResponse> => {
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Bearer ${zaiAuthToken}`,
    },
    body: JSON.stringify(withdrawParams),
    //body: JSON.stringify({ amount, custom_descriptor }),
  };

  const response = await fetch(
    `${ZAI_DOMAIN}/wallet_accounts/${walletAccountId}/withdraw`,
    options
  );

  if (!response.ok) {
    const error = await response.text();
    console.log('ERROR withdrawFunds: ', JSON.stringify(error));
    throw new Error(`ERROR withdrawFunds: ${JSON.stringify(error)}`);
  }

  return response.json();
};
