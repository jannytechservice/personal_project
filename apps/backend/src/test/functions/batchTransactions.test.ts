import {
  FromToType,
  PaymentProvider,
  PaymentStatus,
  PaymentType,
} from 'dependency-layer/API';
import {
  CreateZaiAuthTokenResponse,
  getCustomDescriptor,
} from 'dependency-layer/zai';
import { it, describe, expect, vi } from 'vitest';
import { getCreatePayoutDetails } from '../../functions/zaiWebhookHandler/batchTransactions';

const mockZaiAuthToken: CreateZaiAuthTokenResponse = {
  access_token: 'mockAccessToken',
  expires_in: 0,
  token_type: '',
  token_expires_at: 0,
};

vi.mock('dependency-layer/entity', () => ({
  sendEmailEntityUsers: vi.fn(),
}));

//const mockZaiBatchTransactionsWebhookEvent = {
//  batch_transactions: {
//    reference_id: null,
//    created_at: "2024-07-26T06:37:21.699Z",
//    updated_at: "2024-07-30T07:00:43.047Z",
//    description: "Credit of $20.00 to Item by Debit of $20.00 from Wallet Account",
//    id: "e42399aa-108d-4563-b017-a41b66fa00e7",
//    account_type: "item",
//    type: "payment_funding",
//    type_method: "credit_card",
//    batch_id: null,
//    cuscal_payment_transaction_id: null,
//    reference: "ASM*AUSTRALIAN TA",
//    clearing_system_transaction_id: null,
//    deposit_reference: null,
//    state: "successful",
//    status: 12000,
//    user_id: "6d8496f6-2512-4c05-ac35-f81374a9248d",
//    account_id: "f0ce112a-a14c-457b-b2d8-0239bd6f2207",
//    from_user_name: "Bradley Sewitz",
//    from_user_id: "d6af52075038ac91c1f25323f0c18bcc",
//    amount: 2000,
//    currency: "AUD",
//    debit_credit: "credit",
//    related: {
//      account_to: {
//        id: "663e3c20-2d2e-013d-77e5-0a58a9feac0e",
//        account_type: "wallet_account",
//        user_id: "6d8496f6-2512-4c05-ac35-f81374a9248d_BILLPAY"
//      }
//    },
//    links: {
//      self: "/batch_transactions/e42399aa-108d-4563-b017-a41b66fa00e7",
//      users: "/batch_transactions/e42399aa-108d-4563-b017-a41b66fa00e7/users",
//      fees: "/batch_transactions/e42399aa-108d-4563-b017-a41b66fa00e7/fees",
//      wallet_accounts: "/batch_transactions/e42399aa-108d-4563-b017-a41b66fa00e7/wallet_accounts",
//      card_accounts: "/batch_transactions/e42399aa-108d-4563-b017-a41b66fa00e7/card_accounts",
//      paypal_accounts: "/batch_transactions/e42399aa-108d-4563-b017-a41b66fa00e7/paypal_accounts",
//      bank_accounts: "/batch_transactions/e42399aa-108d-4563-b017-a41b66fa00e7/bank_accounts",
//      bpay_accounts: "/batch_transactions/e42399aa-108d-4563-b017-a41b66fa00e7/bpay_accounts",
//      items: "/batch_transactions/e42399aa-108d-4563-b017-a41b66fa00e7/items"
//    }
//  }
//};

const mockTaskReceivingRecord = {
  signatureStatus: 'NOT_SIGNABLE',
  status: 'COMPLETED',
  entityByIdContactId:
    '6d8496f6-2512-4c05-ac35-f81374a9248d#393e33a2-9f23-4a78-85b2-a67dab88a34e',
  fromId: '393e33a2-9f23-4a78-85b2-a67dab88a34e',
  dueAt: '2024-08-01',
  toType: 'ENTITY',
  toSearchStatus: '6d8496f6-2512-4c05-ac35-f81374a9248d#COMPLETED',
  createdBy: 'd4e89438-f011-7002-d845-e202e9d4c201',
  reference: '551008597419850721',
  documents: [],
  fromType: 'ENTITY',
  paymentFrequency: 'ONCE',
  paymentStatus: 'PAID',
  paymentAt: '2024-08-01',
  searchName: '551008597419850721',
  id: '3191ad47-0e01-4816-9b33-b658da27fcfb',
  lodgementAt: '2024-08-01',
  paymentTypes: ['PAY_NOW', 'SCHEDULED', 'INSTALLMENTS'],
  __typename: 'Task',
  fromSearchStatus: '393e33a2-9f23-4a78-85b2-a67dab88a34e#COMPLETED',
  entityId: '6d8496f6-2512-4c05-ac35-f81374a9248d',
  createdAt: '2024-07-26T06:53:55.256Z',
  settlementStatus: 'PAYABLE',
  entityIdBy: '6d8496f6-2512-4c05-ac35-f81374a9248d',
  contactId: '393e33a2-9f23-4a78-85b2-a67dab88a34e',
  toId: '6d8496f6-2512-4c05-ac35-f81374a9248d',
  updatedAt: '2024-07-26T06:53:55.256Z',
  direction: 'RECEIVING',
  category: 'TAX',
  amount: 1000,
  type: 'PAY_ONLY',
};

const mockPaymentRecord = {
  ipAddress: '61.69.230.79',
  paymentProvider: PaymentProvider.ZAI,
  status: PaymentStatus.COMPLETED,
  installments: 1,
  fromId: '393e33a2-9f23-4a78-85b2-a67dab88a34e',
  toType: FromToType.ENTITY,
  netAmount: 2000,
  buyerId: '6d8496f6-2512-4c05-ac35-f81374a9248d',
  fromType: FromToType.ENTITY,
  sellerId: '6d8496f6-2512-4c05-ac35-f81374a9248d_BILLPAY',
  installment: 1,
  id: 'f0ce112a-a14c-457b-b2d8-0239bd6f2207',
  paymentType: PaymentType.PAY_NOW,
  payerFees: 44,
  __typename: 'Payment' as const,
  feeIds: ['ac642659-22ec-4fd6-a315-303cdcb2858e'],
  totalAmount: 2044,
  taskId: 'f0ce112a-a14c-457b-b2d8-0239bd6f2207',
  entityId: '6d8496f6-2512-4c05-ac35-f81374a9248d',
  createdAt: '2024-07-26T06:37:17.346Z',
  paidAt: '2024-07-26T06:37:23.059Z',
  scheduledAt: '2024-07-26',
  toId: '6d8496f6-2512-4c05-ac35-f81374a9248d',
  gstAmount: 0,
  updatedAt: '2024-07-26T06:37:21.814Z',
  amount: 2044,
};

const mockEntityFromRecord = {
  providerBillUserCompanyId: 'ccb8b0c0-2d1e-013d-9daa-0a58a9feac0d',
  providerCompanyId: 'cc9b79e0-2d1e-013d-5dc0-0a58a9feac0a',
  lastName: 'Australian Tax Office',
  contact: {
    firstName: 'Australian Tax Office',
    lastName: 'Australian Tax Office',
    phone: '1800815886',
    email: 'payment@ato.gov.au',
  },
  createdAt: '2024-07-26T01:46:17.951Z',
  gstRegistered: true,
  paymentUserId: '393e33a2-9f23-4a78-85b2-a67dab88a34e',
  address: {
    country: 'AUS',
    state: 'NSW',
    address1: 'Locked Bag 1936',
    postalCode: '1936',
  },
  email: 'payment@ato.gov.au',
  logo: null,
  country: 'AUS',
  name: 'Australian Tax Office (ATO)',
  firstName: 'Australian Tax Office',
  billerCode: 75556,
  subCategory: 'TAX',
  taxNumber: '51824753556',
  updatedAt: '2024-07-26T01:46:29.549Z',
  id: '393e33a2-9f23-4a78-85b2-a67dab88a34e',
  phone: '1800815886',
  legalName: 'AUSTRALIAN TAXATION OFFICE',
  type: 'BPAY',
};

const mockContactRecord = {
  id: '58700f32-5068-4043-b411-16aa6a7eda56',
  bank: {
    id: '41743be0-3139-013d-d38c-0a58a9feac03',
    accountName: 'Abc Furniture',
    accountNumber: '4567456777',
    accountType: 'checking',
    bankName: 'Deal',
    holderType: 'personal',
    routingNumber: '123456',
  },
  bpay: {
    billerCode: 123456,
    referenceNumber: '4567898765',
  },
  bulkUploadFileKey: '1453f3dc-af8a-4ded-a90f-58176fd2cc99.csv',
  companyName: 'Abc Furniture',
  createdAt: '2024-07-25T05:17:39.828Z',
  email: 'info@abfl.com',
  entityId: '324b8dc8-c839-4de9-b7f3-e7b1d5a3d3c9',
  firstName: 'Trish',
  lastName: 'Rawlings',
  owner: '147824c8-e0b1-709d-a5c0-ef691a7c5636',
  paymentUserId: '58700f32-5068-4043-b411-16aa6a7eda56',
  phone: '+61431896733',
  providerUserWalletId: '26e715c0-2c73-013d-8ce3-0a58a9feac05',
  searchName: 'abc furniture info@abfl.com',
  status: 'ACTIVE',
  updatedAt: '2024-07-31T07:05:50.860Z',
  zaiNppCrn: '100100549853232',
};

const mockIncrementRecord = {
  current: 999999,
};

// Create a mapping of table names to mock records
const mockRecords = {
  TABLE_CONTACT: mockContactRecord,
  TABLE_ENTITY: mockEntityFromRecord,
  TABLE_INCREMENT: mockIncrementRecord,
  TABLE_TASK: mockTaskReceivingRecord,
  TABLE_PAYMENT: mockPaymentRecord,
};

describe('getCreatePayoutDetails', () => {
  it('should return correct payout details for RECEIVING', async () => {
    vi.mock('dependency-layer/dynamoDB', () => ({
      queryRecords: vi.fn(),
      createRecord: vi.fn(),
      incrementRecord: vi.fn(() => Promise.resolve({ current: 999999 + 1 })),
      getRecord: vi.fn((tableName, query) => {
        console.log('getRecord called with:', tableName, query);
        const record = mockRecords[tableName as keyof typeof mockRecords];
        return Promise.resolve(record ?? null);
      }),
    }));

    vi.mock('dependency-layer/zai', () => ({
      createZaiBankAccount: vi.fn(),
      createBpayAccount: vi.fn(() =>
        Promise.resolve({ bpay_accounts: { id: 'mockZaiBankAccountId' } })
      ),
      getBatchTransactionItem: vi.fn(),
      getZaiUserWallet: vi.fn(),
      getZaiBankAccount: vi.fn(),
      payBpayBill: vi.fn(),
      withdrawFunds: vi.fn(),
      refundZaiItem: vi.fn(),
      getCustomDescriptor: vi.fn(({ name }) => name.substring(0, 13)),
    }));

    const result = await getCreatePayoutDetails(
      mockZaiAuthToken,
      mockPaymentRecord
    );

    console.log('resultresultresultresult: ', result);

    expect(result).toEqual({
      payoutMethod: 'BPAY',
      fromEmail: mockEntityFromRecord.contact.email,
      amount: mockPaymentRecord.netAmount,
      customDescriptor: getCustomDescriptor({
        name: mockTaskReceivingRecord.reference,
      }),
      reference: (mockIncrementRecord.current + 1).toString(),
      providerAccountId: 'mockZaiBankAccountId',
    });
  });
});
