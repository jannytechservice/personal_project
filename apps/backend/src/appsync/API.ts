/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateAdminInput = {
  firstName: string;
  lastName: string;
  email: string;
  role?: AdminRole | null;
};

export enum AdminRole {
  SuperAdmins = 'SuperAdmins',
  Admins = 'Admins',
}

export type Admin = {
  __typename: 'Admin';
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  role?: AdminRole | null;
  hasAccessed?: boolean | null;
  createdBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  id: string;
  owner?: string | null;
};

export type UpdateAdminInput = {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  role?: AdminRole | null;
  hasAccessed?: boolean | null;
  createdBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  id: string;
};

export type ModelAdminConditionInput = {
  firstName?: ModelStringInput | null;
  lastName?: ModelStringInput | null;
  email?: ModelStringInput | null;
  phone?: ModelStringInput | null;
  role?: ModelAdminRoleInput | null;
  hasAccessed?: ModelBooleanInput | null;
  createdBy?: ModelIDInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelAdminConditionInput | null> | null;
  or?: Array<ModelAdminConditionInput | null> | null;
  not?: ModelAdminConditionInput | null;
};

export type ModelStringInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export enum ModelAttributeTypes {
  binary = 'binary',
  binarySet = 'binarySet',
  bool = 'bool',
  list = 'list',
  map = 'map',
  number = 'number',
  numberSet = 'numberSet',
  string = 'string',
  stringSet = 'stringSet',
  _null = '_null',
}

export type ModelSizeInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
};

export type ModelAdminRoleInput = {
  eq?: AdminRole | null;
  ne?: AdminRole | null;
};

export type ModelBooleanInput = {
  ne?: boolean | null;
  eq?: boolean | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
};

export type ModelIDInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export type DeleteAdminInput = {
  id: string;
};

export type UpdateBeneficialOwnerInput = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  providerEntityId?: string | null;
  verificationStatus?: VerificationStatus | null;
  verificationAttempt?: number | null;
  updatedAt?: string | null;
  lastCheckedAt?: string | null;
};

export enum VerificationStatus {
  UNCHECKED = 'UNCHECKED',
  PASS = 'PASS',
  FAIL = 'FAIL',
  PASS_MANUAL = 'PASS_MANUAL',
  FAIL_MANUAL = 'FAIL_MANUAL',
  REFER = 'REFER',
  WAIT = 'WAIT',
  ARCHIVED = 'ARCHIVED',
  INACTIVE = 'INACTIVE',
}

export type BeneficialOwner = {
  __typename: 'BeneficialOwner';
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  providerEntityId: string;
  verificationStatus: VerificationStatus;
  verificationAttempt?: number | null;
  createdBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type CreateClientInput = {
  entityId: string;
  client: ClientInput;
  entity?: CreateEntityInput | null;
};

export type ClientInput = {
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  mobile: string;
  phone?: string | null;
};

export type CreateEntityInput = {
  type: EntityType;
  taxNumber?: string | null;
  name: string;
  firstName?: string | null;
  lastName?: string | null;
  address?: AddressInput | null;
  logo?: ImageInput | null;
  isFirm?: boolean | null;
};

export enum EntityType {
  COMPANY = 'COMPANY',
  TRUST = 'TRUST',
  NOT_FOR_PROFIT = 'NOT_FOR_PROFIT',
  SELF_MANAGED_SUPER_FUND = 'SELF_MANAGED_SUPER_FUND',
  BPAY = 'BPAY',
}

export type AddressInput = {
  addressId?: string | null;
  contactName?: string | null;
  contactNumber?: string | null;
  addressFull?: string | null;
  address1: string;
  address2?: string | null;
  country: string;
  countryCode?: string | null;
  streetNumber?: string | null;
  streetName?: string | null;
  unitNumber?: string | null;
  streetType?: string | null;
  city: string;
  state: string;
  stateCode?: string | null;
  postalCode: string;
};

export type ImageInput = {
  alt?: string | null;
  identityId?: string | null;
  key: string;
  level: S3UploadLevel;
  type?: string | null;
};

export enum S3UploadLevel {
  public = 'public',
  protected = 'protected',
  private = 'private',
}

export type EntityUser = {
  __typename: 'EntityUser';
  id: string;
  entityId: string;
  userId: string;
  invitedEmail?: string | null;
  referredBy?: string | null;
  invitedEntityId?: string | null;
  firmEntityId?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role?: EntityUserRole | null;
  paymentsEnabled?: boolean | null;
  entitySearchName?: string | null;
  entity?: Entity | null;
  searchName?: string | null;
  createdBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  status?: EntityUserStatus | null;
};

export enum EntityUserRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  ACCOUNTANT = 'ACCOUNTANT',
  CONTRIBUTOR = 'CONTRIBUTOR',
}

export type Entity = {
  __typename: 'Entity';
  id: string;
  type: EntityType;
  taxNumber?: string | null;
  companyNumber?: string | null;
  billerCode?: number | null;
  name: string;
  legalName?: string | null;
  searchName?: string | null;
  address?: Address | null;
  logo?: Image | null;
  entityBeneficialOwners?: ModelEntityBeneficialOwnerConnection | null;
  entityUsers?: ModelEntityUserConnection | null;
  gstRegistered?: boolean | null;
  providerEntityId?: string | null;
  providerCompanyId?: string | null;
  providerBillUserCompanyId?: string | null;
  providerBankAccountId?: string | null;
  providerDigitalWalletId?: string | null;
  providerBpayCrn?: string | null;
  contact?: EntityContact | null;
  paymentMethods?: ModelPaymentMethodConnection | null;
  paymentMethodId?: string | null;
  paymentUserId?: string | null;
  disbursementMethodId?: string | null;
  receivingAccounts?: ModelPaymentMethodConnection | null;
  ubosCreated?: boolean | null;
  numUbosCreated?: number | null;
  subCategory?: string | null;
  clientsStatus?: EntityClientsStatus | null;
  ocrEmail?: string | null;
  verificationStatus?: VerificationStatus | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  owner: string;
  referredBy?: string | null;
  xeroContactSyncStatus?: XeroSyncStatus | null;
  xeroLastContactSyncAt?: string | null;
  xeroInvoiceSyncStatus?: XeroSyncStatus | null;
  xeroLastInvoiceSyncAt?: string | null;
  xeroTenantId?: string | null;
};

export type Address = {
  __typename: 'Address';
  addressId?: string | null;
  placeId?: string | null;
  contactName?: string | null;
  contactNumber?: string | null;
  addressFull?: string | null;
  address1?: string | null;
  address2?: string | null;
  unitNumber?: string | null;
  streetNumber?: string | null;
  streetName?: string | null;
  streetType?: string | null;
  city: string;
  country: string;
  countryCode?: string | null;
  state: string;
  stateCode?: string | null;
  postalCode: string;
};

export type Image = {
  __typename: 'Image';
  alt?: string | null;
  identityId?: string | null;
  key: string;
  level: S3UploadLevel;
  type?: string | null;
};

export type ModelEntityBeneficialOwnerConnection = {
  __typename: 'ModelEntityBeneficialOwnerConnection';
  items?: Array<EntityBeneficialOwner | null> | null;
  nextToken?: string | null;
};

export type EntityBeneficialOwner = {
  __typename: 'EntityBeneficialOwner';
  entityId: string;
  beneficialOwnerId: string;
  beneficialOwner?: BeneficialOwner | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  owner?: string | null;
};

export type ModelEntityUserConnection = {
  __typename: 'ModelEntityUserConnection';
  items: Array<EntityUser | null>;
  nextToken?: string | null;
};

export type EntityContact = {
  __typename: 'EntityContact';
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
};

export type ModelPaymentMethodConnection = {
  __typename: 'ModelPaymentMethodConnection';
  items: Array<PaymentMethod | null>;
  nextToken?: string | null;
};

export type PaymentMethod = {
  __typename: 'PaymentMethod';
  id: string;
  paymentMethodType: PaymentMethodType;
  type?: string | null;
  fullName?: string | null;
  number?: string | null;
  expMonth?: string | null;
  expYear?: string | null;
  accountName?: string | null;
  bankName?: string | null;
  accountNumber?: string | null;
  routingNumber?: string | null;
  holderType?: BankHolderType | null;
  accountType?: BankAccountType | null;
  status?: PaymentMethodStatus | null;
  accountDirection?: AccountDirection | null;
  expiresAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export enum PaymentMethodType {
  CARD = 'CARD',
  BANK = 'BANK',
  PAYTO = 'PAYTO',
  PAYID = 'PAYID',
}

export enum BankHolderType {
  personal = 'personal',
  business = 'business',
}

export enum BankAccountType {
  savings = 'savings',
  checking = 'checking',
}

export enum PaymentMethodStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export enum AccountDirection {
  PAYMENT = 'PAYMENT',
  DISBURSEMENT = 'DISBURSEMENT',
}

export enum EntityClientsStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
  REVIEW = 'REVIEW',
  DECLINED = 'DECLINED',
}

export enum XeroSyncStatus {
  UNSYNCED = 'UNSYNCED',
  PENDING = 'PENDING',
  SYNCED = 'SYNCED',
}

export enum EntityUserStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

export type CreateContactInput = {
  entityId: string;
  firstName: string;
  lastName: string;
  companyName?: string | null;
  email: string;
  mobile?: string | null;
  phone?: string | null;
  status?: ContactStatus | null;
  taxNumber?: string | null;
  companyNumber?: string | null;
  bank?: ContactBankAccountInput | null;
  bpay?: ContactBpayInput | null;
};

export enum ContactStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export type ContactBankAccountInput = {
  accountName: string;
  bankName?: string | null;
  accountNumber: string;
  routingNumber: string;
  holderType?: BankHolderType | null;
  accountType?: BankAccountType | null;
  country?: string | null;
};

export type ContactBpayInput = {
  billerCode?: number | null;
  referenceNumber?: string | null;
};

export type Contact = {
  __typename: 'Contact';
  id: string;
  entityId: string;
  xeroTenantId?: string | null;
  entityType?: EntityType | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  mobile?: string | null;
  phone?: string | null;
  taxNumber?: string | null;
  companyNumber?: string | null;
  name?: string | null;
  legalName?: string | null;
  companyName?: string | null;
  searchName?: string | null;
  status?: ContactStatus | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  contactType?: ContactType | null;
  bank?: ContactBankAccount | null;
  bpay?: ContactBpay | null;
  bulkUploadFileKey?: string | null;
  owner?: string | null;
};

export enum ContactType {
  CLIENT = 'CLIENT',
  NORMAL = 'NORMAL',
}

export type ContactBankAccount = {
  __typename: 'ContactBankAccount';
  id?: string | null;
  accountName?: string | null;
  bankName?: string | null;
  accountNumber: string;
  routingNumber: string;
  holderType?: BankHolderType | null;
  accountType?: BankAccountType | null;
  country?: string | null;
};

export type ContactBpay = {
  __typename: 'ContactBpay';
  billerCode?: number | null;
  referenceNumber?: string | null;
};

export type CreateContactBulkImportInput = {
  entityId: string;
  fileKey: string;
  fields: ContactFieldsInput;
};

export type ContactFieldsInput = {
  firstName: string;
  lastName: string;
  companyName?: string | null;
  email: string;
  mobile?: string | null;
  phone?: string | null;
  taxNumber?: string | null;
  companyNumber?: string | null;
  billerCode?: string | null;
  referenceNumber?: string | null;
  accountName?: string | null;
  bankName?: string | null;
  accountNumber?: string | null;
  routingNumber?: string | null;
};

export type UpdateContactInput = {
  id: string;
  entityId?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  mobile?: string | null;
  phone?: string | null;
  status?: ContactStatus | null;
  bank?: ContactBankAccountInput | null;
  bpay?: ContactBpayInput | null;
};

export type CreateConversationInput = {
  title?: string | null;
  image?: ImageInput | null;
  country?: string | null;
  users?: Array<string | null> | null;
  readBy?: Array<string | null> | null;
  createdBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  id?: string | null;
};

export type ModelConversationConditionInput = {
  title?: ModelStringInput | null;
  country?: ModelStringInput | null;
  users?: ModelStringInput | null;
  readBy?: ModelStringInput | null;
  createdBy?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelConversationConditionInput | null> | null;
  or?: Array<ModelConversationConditionInput | null> | null;
  not?: ModelConversationConditionInput | null;
};

export type Conversation = {
  __typename: 'Conversation';
  title?: string | null;
  image?: Image | null;
  country?: string | null;
  messages?: ModelMessageConnection | null;
  userConversations?: ModelUserConversationConnection | null;
  users?: Array<string | null> | null;
  readBy?: Array<string | null> | null;
  createdBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  id: string;
};

export type ModelMessageConnection = {
  __typename: 'ModelMessageConnection';
  items: Array<Message | null>;
  nextToken?: string | null;
};

export type Message = {
  __typename: 'Message';
  conversationId: string;
  text?: string | null;
  attachments?: Array<S3Upload | null> | null;
  users: Array<string | null>;
  receiver: string;
  sender: string;
  createdBy: string;
  readBy?: Array<string | null> | null;
  createdAt: string;
  updatedAt?: string | null;
  id: string;
  conversationMessagesId?: string | null;
};

export type S3Upload = {
  __typename: 'S3Upload';
  identityId?: string | null;
  key: string;
  level: S3UploadLevel;
  type: S3UploadType;
};

export enum S3UploadType {
  IMAGE = 'IMAGE',
  PDF = 'PDF',
  VIDEO = 'VIDEO',
  FILE = 'FILE',
}

export type ModelUserConversationConnection = {
  __typename: 'ModelUserConversationConnection';
  items: Array<UserConversation | null>;
  nextToken?: string | null;
};

export type UserConversation = {
  __typename: 'UserConversation';
  conversationId: string;
  conversation?: Conversation | null;
  userId: string;
  user?: User | null;
  users?: Array<string | null> | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  id: string;
  conversationUserConversationsId?: string | null;
};

export type User = {
  __typename: 'User';
  id: string;
  identityId?: string | null;
  referralCode?: string | null;
  referredBy?: string | null;
  email?: string | null;
  about?: string | null;
  firstName?: string | null;
  firmId?: string | null;
  lastName?: string | null;
  phone?: string | null;
  blocked?: Array<string | null> | null;
  blockedBy?: Array<string | null> | null;
  country?: string | null;
  profileImg?: Image | null;
  interests?: Array<string | null> | null;
  locale?: string | null;
  onboardingStatus?: OnboardingStatus | null;
  onboardingEntity?: string | null;
  selectedSignatureKey?: string | null;
  signatures?: ModelSignatureConnection | null;
  userType?: UserType | null;
  rating?: number | null;
  reportReasons?: Array<string | null> | null;
  notificationPreferences?: NotificationPreferences | null;
  paymentUserId?: string | null;
  providerWalletId?: string | null;
  providerNppCrn?: string | null;
  ipAddress?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  owner?: string | null;
  loyaltyStatus?: RewardStatus | null;
  nextLoyaltyStatus?: RewardStatus | null;
  nextLoyaltyStatusPoint?: number | null;
  statusPoint?: number | null;
  pointsTotal?: number | null;
  pointsBalance?: number | null;
  invitedTo?: string | null;
};

export enum OnboardingStatus {
  PROFILE = 'PROFILE',
  BUSINESS = 'BUSINESS',
  PLANS = 'PLANS',
  COMPLETED = 'COMPLETED',
}

export type ModelSignatureConnection = {
  __typename: 'ModelSignatureConnection';
  items: Array<Signature | null>;
  nextToken?: string | null;
};

export type Signature = {
  __typename: 'Signature';
  id: string;
  userId: string;
  key: string;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export enum UserType {
  Buyers = 'Buyers',
  Sellers = 'Sellers',
}

export type NotificationPreferences = {
  __typename: 'NotificationPreferences';
  email?: boolean | null;
  push?: boolean | null;
  sms?: boolean | null;
};

export enum RewardStatus {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  DIAMOND = 'DIAMOND',
}

export type UpdateConversationInput = {
  title?: string | null;
  image?: ImageInput | null;
  country?: string | null;
  users?: Array<string | null> | null;
  readBy?: Array<string | null> | null;
  createdBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  id: string;
};

export type DeleteConversationInput = {
  id: string;
};

export type CreateDocumentAnalysisInput = {
  entityId: string;
  fileKey: string;
};

export type DocumentAnalysis = {
  __typename: 'DocumentAnalysis';
  id: string;
  entityId: string;
  fileKey: string;
  status: DocumentAnalysisStatus;
  expenseStatus?: DocumentAnalysisStatus | null;
  queryStatus?: DocumentAnalysisStatus | null;
  matchedContactId?: string | null;
  matchedContact?: Contact | null;
  matchedEntityId?: string | null;
  matchedEntity?: Entity | null;
  newContact?: DocumentAnalysisContact | null;
  task?: DocumentAnalysisTask | null;
  bpay?: ContactBpay | null;
  bank?: DocumentAnalysisBankAccount | null;
  source?: DocumentAnalysisSource | null;
  createdBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export enum DocumentAnalysisStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  SCANNED = 'SCANNED',
  ARCHIVED = 'ARCHIVED',
}

export type DocumentAnalysisContact = {
  __typename: 'DocumentAnalysisContact';
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  companyName?: string | null;
  taxNumber?: string | null;
};

export type DocumentAnalysisTask = {
  __typename: 'DocumentAnalysisTask';
  reference?: string | null;
  dueAt?: string | null;
  gstInclusive?: boolean | null;
  notes?: string | null;
  amount?: number | null;
  gstAmount?: number | null;
  lineItems?: Array<DocumentAnalysisLineItem | null> | null;
  numberOfPayments?: number | null;
  paymentFrequency?: PaymentFrequency | null;
  shippingAmount?: number | null;
};

export type DocumentAnalysisLineItem = {
  __typename: 'DocumentAnalysisLineItem';
  description?: string | null;
  quantity?: number | null;
  unitPrice?: number | null;
  price?: number | null;
  productCode?: string | null;
};

export enum PaymentFrequency {
  ONCE = 'ONCE',
  WEEKLY = 'WEEKLY',
  FORTNIGHTLY = 'FORTNIGHTLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUALLY = 'ANNUALLY',
}

export type DocumentAnalysisBankAccount = {
  __typename: 'DocumentAnalysisBankAccount';
  accountNumber?: string | null;
  routingNumber?: string | null;
};

export enum DocumentAnalysisSource {
  UPLOAD = 'UPLOAD',
  EMAIL = 'EMAIL',
}

export type UpdateDocumentAnalysisInput = {
  id: string;
  entityId?: string | null;
  jobId?: string | null;
  fileKey?: string | null;
  status?: DocumentAnalysisStatus | null;
  expenseStatus?: DocumentAnalysisStatus | null;
  queryStatus?: DocumentAnalysisStatus | null;
  matchedContactId?: string | null;
  matchedEntityId?: string | null;
  newContact?: DocumentAnalysisContactInput | null;
  task?: DocumentAnalysisTaskInput | null;
  bpay?: ContactBpayInput | null;
  bank?: DocumentAnalysisBankAccountInput | null;
  source?: DocumentAnalysisSource | null;
  createdBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type DocumentAnalysisContactInput = {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  companyName?: string | null;
  taxNumber?: string | null;
};

export type DocumentAnalysisTaskInput = {
  reference?: string | null;
  dueAt?: string | null;
  gstInclusive?: boolean | null;
  notes?: string | null;
  amount?: number | null;
  gstAmount?: number | null;
  lineItems?: Array<DocumentAnalysisLineItemInput | null> | null;
  numberOfPayments?: number | null;
  paymentFrequency?: PaymentFrequency | null;
  shippingAmount?: number | null;
};

export type DocumentAnalysisLineItemInput = {
  quantity?: number | null;
  description?: string | null;
  unitPrice?: number | null;
  price?: number | null;
  productCode?: string | null;
};

export type DocumentAnalysisBankAccountInput = {
  accountNumber?: string | null;
  routingNumber?: string | null;
};

export type UpdateEntityInput = {
  id: string;
  type?: EntityType | null;
  taxNumber?: string | null;
  name?: string | null;
  address?: AddressInput | null;
  logo?: ImageInput | null;
  paymentMethodId?: string | null;
  disbursementMethodId?: string | null;
  ubosCreated?: boolean | null;
  numUbosCreated?: number | null;
  verificationStatus?: VerificationStatus | null;
  pepCheckStatus?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  legalName?: string | null;
  contact?: EntityContactInput | null;
  gstRegistered?: boolean | null;
  role?: string | null;
  isFirm?: boolean | null;
  updatedAt?: string | null;
  xeroAccounts?: Array<XeroAccountInput | null> | null;
};

export type EntityContactInput = {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
};

export type XeroAccountInput = {
  code?: string | null;
  name?: string | null;
  accountID?: string | null;
  type?: string | null;
  bankAccountNumber?: string | null;
  status?: string | null;
  description?: string | null;
  bankAccountType?: string | null;
  currencyCode?: string | null;
  taxType?: string | null;
  enablePaymentsToAccount?: boolean | null;
  showInExpenseClaims?: boolean | null;
  _class?: string | null;
  systemAccount?: string | null;
  reportingCode?: string | null;
  reportingCodeName?: string | null;
  hasAttachments?: boolean | null;
  updatedDateUTC?: string | null;
  addToWatchlist?: boolean | null;
};

export type RegenerateEntityOcrEmailInput = {
  entityId: string;
};

export type DeleteEntityInput = {
  id: string;
};

export type ModelEntityConditionInput = {
  name?: ModelStringInput | null;
  taxNumber?: ModelStringInput | null;
  address?: ModelStringInput | null;
  type?: ModelEntityTypeInput | null;
  owner?: ModelIDInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelEntityConditionInput | null> | null;
  or?: Array<ModelEntityConditionInput | null> | null;
  not?: ModelEntityConditionInput | null;
};

export type ModelEntityTypeInput = {
  eq?: EntityType | null;
  ne?: EntityType | null;
};

export type CreateEntityUserInput = {
  entityId: string;
  userId: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  role?: CreateEntityUserRole | null;
  paymentsEnabled?: boolean | null;
};

export enum CreateEntityUserRole {
  ADMIN = 'ADMIN',
  ACCOUNTANT = 'ACCOUNTANT',
  CONTRIBUTOR = 'CONTRIBUTOR',
}

export type UpdateEntityUserInput = {
  entityId: string;
  userId: string;
  paymentsEnabled?: boolean | null;
};

export type AcceptDenyEntityUserStatusInput = {
  entityId: string;
  userId: string;
  status: EntityUserStatus;
};

export type sendReferralInvitationEmailInput = {
  email: Array<string>;
};

export type DeleteEntityUserInput = {
  entityId: string;
  userId: string;
};

export type CreateVerificationTokenInput = {
  beneficialOwnerId: string;
  entityId: string;
  preset?: VerificationTokenPreset | null;
};

export enum VerificationTokenPreset {
  SMART_UI = 'SMART_UI',
  ONE_SDK = 'ONE_SDK',
}

export type VerificationUiToken = {
  __typename: 'VerificationUiToken';
  token: string;
};

export type LookupEntityOwnershipInput = {
  entityId: string;
};

export type LookupEntityOwnershipResult = {
  __typename: 'LookupEntityOwnershipResult';
  async?: boolean | null;
};

export type CreateServiceInput = {
  entityId: string;
  title?: string | null;
  description?: string | null;
  amount: number;
  feeType: FeeType;
  taxType: TaxType;
};

export enum FeeType {
  FIXED = 'FIXED',
  HOURLY = 'HOURLY',
}

export enum TaxType {
  GST = 'GST',
  NO_GST = 'NO_GST',
  GST_FREE = 'GST_FREE',
}

export type Service = {
  __typename: 'Service';
  id: string;
  entityId: string;
  title?: string | null;
  description?: string | null;
  amount: number;
  feeType: FeeType;
  taxType: TaxType;
  searchName?: string | null;
  status: ServiceStatus;
  createdAt: string;
  updatedAt: string;
};

export enum ServiceStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export type UpdateServiceInput = {
  id: string;
  title?: string | null;
  description?: string | null;
  amount?: number | null;
  feeType?: FeeType | null;
  taxType?: TaxType | null;
  status?: ServiceStatus | null;
};

export type CreateTemplateInput = {
  entityId: string;
  title: string;
  status: TemplateStatus;
};

export enum TemplateStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export type Template = {
  __typename: 'Template';
  id: string;
  entityId: string;
  title: string;
  templateServices?: ModelTemplateServiceConnection | null;
  components?: Array<TemplateComponent | null> | null;
  searchName?: string | null;
  status: TemplateStatus;
  createdAt: string;
  updatedAt: string;
};

export type ModelTemplateServiceConnection = {
  __typename: 'ModelTemplateServiceConnection';
  items?: Array<TemplateService | null> | null;
  nextToken?: string | null;
};

export type TemplateService = {
  __typename: 'TemplateService';
  templateId: string;
  serviceId: string;
  service?: Service | null;
  createdAt: string;
  updatedAt: string;
};

export type TemplateComponent = {
  __typename: 'TemplateComponent';
  type: ComponentType;
  data?: string | null;
};

export enum ComponentType {
  LETTERHEAD = 'LETTERHEAD',
  TEXT = 'TEXT',
  SERVICES = 'SERVICES',
  BANK_DETAILS = 'BANK_DETAILS',
  SIGNATURE = 'SIGNATURE',
}

export type UpdateTemplateInput = {
  id: string;
  title?: string | null;
  status?: TemplateStatus | null;
  components?: Array<TemplateComponentInput | null> | null;
};

export type TemplateComponentInput = {
  type: ComponentType;
  data?: string | null;
};

export type CreateTemplateServiceInput = {
  templateId: string;
  serviceId: string;
};

export type DeleteTemplateServiceInput = {
  templateId: string;
  serviceId: string;
};

export type CreateMessageInput = {
  conversationId: string;
  text?: string | null;
  attachments?: Array<S3UploadInput | null> | null;
  users: Array<string | null>;
  receiver: string;
  sender: string;
  createdBy: string;
  readBy?: Array<string | null> | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  id?: string | null;
  conversationMessagesId?: string | null;
};

export type S3UploadInput = {
  identityId?: string | null;
  key: string;
  level: S3UploadLevel;
  type: S3UploadType;
  name?: string | null;
};

export type ModelMessageConditionInput = {
  conversationId?: ModelIDInput | null;
  text?: ModelStringInput | null;
  users?: ModelStringInput | null;
  receiver?: ModelIDInput | null;
  sender?: ModelIDInput | null;
  createdBy?: ModelStringInput | null;
  readBy?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelMessageConditionInput | null> | null;
  or?: Array<ModelMessageConditionInput | null> | null;
  not?: ModelMessageConditionInput | null;
  conversationMessagesId?: ModelIDInput | null;
};

export type UpdateMessageInput = {
  conversationId?: string | null;
  text?: string | null;
  attachments?: Array<S3UploadInput | null> | null;
  users?: Array<string | null> | null;
  receiver?: string | null;
  sender?: string | null;
  createdBy?: string | null;
  readBy?: Array<string | null> | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  id: string;
  conversationMessagesId?: string | null;
};

export type CreateNotificationInput = {
  title?: string | null;
  message?: string | null;
  status?: NotificationStatus | null;
  type?: string | null;
  owner: string;
};

export enum NotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
}

export type Notification = {
  __typename: 'Notification';
  id: string;
  title?: string | null;
  message?: string | null;
  status?: NotificationStatus | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  type?: string | null;
  owner: string;
};

export type UpdateNotificationInput = {
  id: string;
  status: NotificationStatus;
};

export type CreateOptionInput = {
  name?: string | null;
  label: string;
  value: string;
  group?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  id?: string | null;
};

export type ModelOptionConditionInput = {
  name?: ModelStringInput | null;
  label?: ModelStringInput | null;
  value?: ModelStringInput | null;
  group?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelOptionConditionInput | null> | null;
  or?: Array<ModelOptionConditionInput | null> | null;
  not?: ModelOptionConditionInput | null;
};

export type Option = {
  __typename: 'Option';
  name?: string | null;
  label: string;
  value: string;
  group?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  id: string;
};

export type UpdateOptionInput = {
  name?: string | null;
  label?: string | null;
  value?: string | null;
  group?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  id: string;
};

export type DeleteOptionInput = {
  id: string;
};

export type ConfirmPaymentInput = {
  payments: Array<string>;
};

export type Payment = {
  __typename: 'Payment';
  id: string;
  taskId?: string | null;
  entityId?: string | null;
  payInPaymentId?: string | null;
  providerTransactionId?: string | null;
  paymentProvider?: PaymentProvider | null;
  disbursementId?: string | null;
  fromId: string;
  fromType: FromToType;
  toId?: string | null;
  toType?: FromToType | null;
  buyerId?: string | null;
  sellerId?: string | null;
  entityIdTo?: string | null;
  amount?: number | null;
  netAmount?: number | null;
  payerFees?: number | null;
  totalAmount?: number | null;
  gstAmount?: number | null;
  installment?: number | null;
  installments?: number | null;
  feeAmount?: number | null;
  paymentType?: PaymentType | null;
  taxAmount?: number | null;
  currency?: string | null;
  feeIds?: Array<string | null> | null;
  ipAddress?: string | null;
  status: PaymentStatus;
  payerUserStatus?: PayerUserStatus | null;
  declinedReason?: string | null;
  scheduledAt?: string | null;
  paidAt?: string | null;
  declinedAt?: string | null;
  createdAt?: string | null;
  receivedAt?: string | null;
  paidOutAt?: string | null;
  updatedAt?: string | null;
  voidedAt?: string | null;
  owner?: string | null;
};

export enum PaymentProvider {
  ZAI = 'ZAI',
  APP_STORE = 'APP_STORE',
  GOOGLE_PLAY = 'GOOGLE_PLAY',
}

export enum FromToType {
  ENTITY = 'ENTITY',
  CONTACT = 'CONTACT',
}

export enum PaymentType {
  PAY_NOW = 'PAY_NOW',
  SCHEDULED = 'SCHEDULED',
  INSTALLMENTS = 'INSTALLMENTS',
}

export enum PaymentStatus {
  GUEST_SCHEDULED = 'GUEST_SCHEDULED',
  SCHEDULED = 'SCHEDULED',
  PENDING_USER_CONFIRMATION = 'PENDING_USER_CONFIRMATION',
  PENDING_PAYTO_AGREEMENT_CREATION = 'PENDING_PAYTO_AGREEMENT_CREATION',
  REJECTED_PAYTO_PAYMENT_RETRYABLE = 'REJECTED_PAYTO_PAYMENT_RETRYABLE',
  REJECTED_PAYTO_PAYMENT_NOT_RETRYABLE = 'REJECTED_PAYTO_PAYMENT_NOT_RETRYABLE',
  PENDING_PAYID_TRANSFER = 'PENDING_PAYID_TRANSFER',
  RECEIVED_PAYID_TRANSFER = 'RECEIVED_PAYID_TRANSFER',
  PENDING_PAYMENT_INITIATION = 'PENDING_PAYMENT_INITIATION',
  PAYMENT_INITIATION_REJECTED = 'PAYMENT_INITIATION_REJECTED',
  USER_CONFIRMED = 'USER_CONFIRMED',
  DECLINED = 'DECLINED',
  PENDING = 'PENDING',
  PAYMENT_REQUIRED = 'PAYMENT_REQUIRED',
  WIRE_PENDING = 'WIRE_PENDING',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAYMENT_HELD = 'PAYMENT_HELD',
  PAYMENT_AUTHORIZED = 'PAYMENT_AUTHORIZED',
  VOID_PENDING = 'VOID_PENDING',
  VOIDED = 'VOIDED',
  FRAUD_HOLD = 'FRAUD_HOLD',
  PAYMENT_DEPOSITED = 'PAYMENT_DEPOSITED',
  WORK_COMPLETED = 'WORK_COMPLETED',
  PROBLEM_FLAGGED = 'PROBLEM_FLAGGED',
  PROBLEM_RESOLVE_REQUESTED = 'PROBLEM_RESOLVE_REQUESTED',
  PROBLEM_ESCALATED = 'PROBLEM_ESCALATED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  REFUND_PENDING = 'REFUND_PENDING',
  REFUND_FLAGGED = 'REFUND_FLAGGED',
  OFF_PLATFORM_REFUNDED = 'OFF_PLATFORM_REFUNDED',
  PARTIAL_COMPLETED = 'PARTIAL_COMPLETED',
  PARTIAL_PAID = 'PARTIAL_PAID',
  OFF_PLATFORM_CHARGEDBACK = 'OFF_PLATFORM_CHARGEDBACK',
}

export enum PayerUserStatus {
  USER = 'USER',
  NON_USER = 'NON_USER',
}

export type CreatePaymentInput = {
  entityId: string;
  paymentMethodId: string;
  billPayments: Array<BillsPaymentInput>;
  idempotencyKey?: string | null;
};

export type BillsPaymentInput = {
  id: string;
  paymentType: PaymentType;
  installments: number;
  scheduledAt: string;
  paymentFrequency?: PaymentFrequency | null;
};

export type CreatePaymentPayIdInput = {
  entityId: string;
  billPayments: Array<BillsPaymentInput>;
  idempotencyKey?: string | null;
};

export type PayInPayment = {
  __typename: 'PayInPayment';
  id: string;
  entityId: string;
  amount?: number | null;
  paymentType?: PaymentType | null;
  status?: PayInPaymentStatus | null;
  taskPayments: Array<TaskPayment>;
  scheduledAt?: string | null;
  createdBy?: string | null;
  paymentUserId: string;
  receivedAt?: string | null;
  paidOutAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export enum PayInPaymentStatus {
  PENDING_PAYID_TRANSFER = 'PENDING_PAYID_TRANSFER',
  RECEIVED_PAYID_TRANSFER = 'RECEIVED_PAYID_TRANSFER',
  PAID_OUT_PAYID_TRANSFER = 'PAID_OUT_PAYID_TRANSFER',
}

export type TaskPayment = {
  __typename: 'TaskPayment';
  id: string;
  paymentType: PaymentType;
  installments: number;
  scheduledAt: string;
};

export type CancelPaymentPayIdInput = {
  entityId: string;
  payInPaymentId: string;
};

export type RetryPaymentInput = {
  id: string;
  paymentMethodId: string;
};

export type CreateTaskPaymentInput = {
  taskId: string;
  entityId: string;
  paymentMethodId: string;
};

export type CreatePaymentGuestInput = {
  entityId: string;
  taskId: string;
  paymentMethodId: string;
};

export type PaymentGuest = {
  __typename: 'PaymentGuest';
  id: string;
  entityId: string;
  taskId?: string | null;
  amount?: number | null;
  installment?: number | null;
  installments?: number | null;
  feeAmount?: number | null;
  paymentType?: PaymentType | null;
  taxAmount?: number | null;
  currency?: string | null;
  feeId?: string | null;
  status: PaymentStatus;
  payerUserStatus?: PayerUserStatus | null;
  scheduledAt?: string | null;
  paidAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  owner?: string | null;
};

export type CreatePaymentScheduledGuestInput = {
  paymentId: string;
  paymentMethodId: string;
};

export type CreatePaymentMethodInput = {
  entityId: string;
  paymentMethodId: string;
  paymentMethodType: PaymentMethodType;
  accountDirection?: AccountDirection | null;
};

export type UpdatePaymentMethodInput = {
  id: string;
  status?: PaymentMethodStatus | null;
};

export type CreatePushNotificationInput = {
  starId?: string | null;
  title?: string | null;
  message?: string | null;
};

export type UpdateRatingInput = {
  id: string;
  rating?: number | null;
  comment?: string | null;
};

export type Rating = {
  __typename: 'Rating';
  id: string;
  ratingBy?: string | null;
  owner?: string | null;
  name?: string | null;
  rating?: number | null;
  comment?: string | null;
  status?: RatingStatus | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export enum RatingStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export type CreateSignatureInput = {
  key: string;
};

export type DeleteSignatureInput = {
  userId: string;
  createdAt: string;
};

export type CreateTaskInput = {
  fromId: string;
  fromType: FromToType;
  toId?: string | null;
  toType?: FromToType | null;
  type: TaskType;
  direction: TaskDirection;
  invoiceStatus?: InvoiceStatus | null;
  documents?: Array<S3UploadInput | null> | null;
  numberOfPayments?: number | null;
  paymentFrequency?: PaymentFrequency | null;
  paymentTypes?: Array<PaymentType | null> | null;
  reference: string;
  bpayReferenceNumber?: string | null;
  amount?: number | null;
  gstAmount?: number | null;
  notes?: string | null;
  settlementStatus?: TaskSettlementStatus | null;
  signers?: Array<SignerInput | null> | null;
  otherRecipients?: Array<OtherRecipientInput | null> | null;
  annotations?: string | null;
  dueAt: string;
  paymentAt?: string | null;
  lodgementAt?: string | null;
  status?: CreateTaskStatus | null;
  gstInclusive?: boolean | null;
  lineItems?: Array<LineItemInput | null> | null;
};

export enum TaskType {
  SIGN_PAY = 'SIGN_PAY',
  SIGN_ONLY = 'SIGN_ONLY',
  PAY_ONLY = 'PAY_ONLY',
}

export enum TaskDirection {
  SENDING = 'SENDING',
  RECEIVING = 'RECEIVING',
}

export enum InvoiceStatus {
  INVOICE = 'INVOICE',
  QUOTE = 'QUOTE',
}

export enum TaskSettlementStatus {
  PAYABLE = 'PAYABLE',
  REFUNDABLE = 'REFUNDABLE',
}

export type SignerInput = {
  userId?: string | null;
  signerType?: SignerType | null;
};

export enum SignerType {
  ACCOUNTANT = 'ACCOUNTANT',
  ENTITY_USER = 'ENTITY_USER',
  CONTACT = 'CONTACT',
}

export type OtherRecipientInput = {
  email: string;
  sendOnCompletion: boolean;
};

export enum CreateTaskStatus {
  DRAFT = 'DRAFT',
}

export type LineItemInput = {
  description?: string | null;
  quantity?: number | null;
  unitAmount?: number | null;
  taxType?: string | null;
  lineAmount?: number | null;
};

export type Task = {
  __typename: 'Task';
  entityId: string;
  taskNumber?: string | null;
  invoiceStatus?: InvoiceStatus | null;
  agreementUuid?: string | null;
  id: string;
  activity?: ModelActivityConnection | null;
  amount?: number | null;
  annotations?: string | null;
  entityIdFrom?: string | null;
  fromId: string;
  fromType: FromToType;
  toId?: string | null;
  toType?: FromToType | null;
  entityIdTo?: string | null;
  contactIdFrom?: string | null;
  contactIdTo?: string | null;
  contactId?: string | null;
  fromSearchStatus?: string | null;
  toSearchStatus?: string | null;
  entityByIdContactId?: string | null;
  searchName?: string | null;
  status: TaskStatus;
  signatureStatus?: TaskSignatureStatus | null;
  paymentStatus?: TaskPaymentStatus | null;
  type: TaskType;
  category?: TaskCategory | null;
  documents?: Array<S3Upload | null> | null;
  numberOfPayments?: number | null;
  paymentFrequency?: PaymentFrequency | null;
  paymentTypes: Array<PaymentType | null>;
  reference?: string | null;
  bpayReferenceNumber?: string | null;
  settlementStatus?: TaskSettlementStatus | null;
  signers?: Array<EntityUser | null> | null;
  otherRecipients?: Array<OtherRecipient | null> | null;
  payments?: ModelPaymentConnection | null;
  createdBy: string;
  entityIdBy?: string | null;
  dueAt: string;
  notes?: string | null;
  direction?: TaskDirection | null;
  readBy?: Array<string | null> | null;
  gstInclusive?: boolean | null;
  paymentAt?: string | null;
  lodgementAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  viewedAt?: string | null;
  readAt?: string | null;
  paidAt?: string | null;
  completedAt?: string | null;
  owner?: string | null;
  lineItems?: Array<LineItem | null> | null;
  xeroTenantId?: string | null;
};

export type ModelActivityConnection = {
  __typename: 'ModelActivityConnection';
  items: Array<Activity | null>;
  nextToken?: string | null;
};

export type Activity = {
  __typename: 'Activity';
  id: string;
  compositeId: string;
  userId?: string | null;
  entityId?: string | null;
  type: ActivityType;
  message?: string | null;
  metadata?: ActivityMetadata | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export enum ActivityType {
  TASK = 'TASK',
  REWARD = 'REWARD',
}

export type ActivityMetadata = {
  __typename: 'ActivityMetadata';
  name?: string | null;
};

export enum TaskStatus {
  DRAFT = 'DRAFT',
  REVIEW = 'REVIEW',
  INCOMPLETE = 'INCOMPLETE',
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export enum TaskSignatureStatus {
  PENDING_SIGNATURE = 'PENDING_SIGNATURE',
  SIGNED = 'SIGNED',
  NOT_SIGNABLE = 'NOT_SIGNABLE',
}

export enum TaskPaymentStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PENDING_TRANSFER = 'PENDING_TRANSFER',
  PENDING_PAYTO_AGREEMENT_CREATION = 'PENDING_PAYTO_AGREEMENT_CREATION',
  PENDING_PAYID_TRANSFER = 'PENDING_PAYID_TRANSFER',
  PAYTO_AGREEMENT_DECLINED = 'PAYTO_AGREEMENT_DECLINED',
  SCHEDULED = 'SCHEDULED',
  PAYID_SCHEDULED = 'PAYID_SCHEDULED',
  PAYTO_SCHEDULED = 'PAYTO_SCHEDULED',
  PAID = 'PAID',
  DECLINED = 'DECLINED',
  NOT_PAYABLE = 'NOT_PAYABLE',
  MARKED_AS_PAID = 'MARKED_AS_PAID',
}

export enum TaskCategory {
  TAX = 'TAX',
  OTHER = 'OTHER',
}

export type OtherRecipient = {
  __typename: 'OtherRecipient';
  email: string;
  sendOnCompletion: boolean;
};

export type ModelPaymentConnection = {
  __typename: 'ModelPaymentConnection';
  items: Array<Payment | null>;
  nextToken?: string | null;
};

export type LineItem = {
  __typename: 'LineItem';
  description?: string | null;
  quantity?: number | null;
  unitAmount?: number | null;
  taxType?: string | null;
  lineAmount?: number | null;
};

export type UpdateTaskInput = {
  id: string;
  entityId: string;
  paymentStatus?: UpdateTaskPaymentStatus | null;
  status?: UpdateTaskStatus | null;
  annotations?: string | null;
  amount?: number | null;
  fromId?: string | null;
  fromType?: FromToType | null;
  toId?: string | null;
  toType?: FromToType | null;
  direction?: TaskDirection | null;
  type?: TaskType | null;
  documents?: Array<S3UploadInput | null> | null;
  paymentTypes?: Array<PaymentType | null> | null;
  paymentFrequency?: PaymentFrequency | null;
  settlementStatus?: TaskSettlementStatus | null;
  numberOfPayments?: number | null;
  reference?: string | null;
  bpayReferenceNumber?: string | null;
  gstAmount?: number | null;
  notes?: string | null;
  signers?: Array<SignerInput | null> | null;
  otherRecipients?: Array<OtherRecipientInput | null> | null;
  gstInclusive?: boolean | null;
  dueAt?: string | null;
  paymentAt?: string | null;
  lodgementAt?: string | null;
  lineItems?: Array<LineItemInput | null> | null;
};

export enum UpdateTaskPaymentStatus {
  MARKED_AS_PAID = 'MARKED_AS_PAID',
  PENDING_PAYMENT = 'PENDING_PAYMENT',
}

export enum UpdateTaskStatus {
  INCOMPLETE = 'INCOMPLETE',
  ARCHIVED = 'ARCHIVED',
}

export type UpdateTaskGuestInput = {
  id: string;
  entityId: string;
  annotations?: string | null;
  document?: S3UploadInput | null;
};

export type TaskGuest = {
  __typename: 'TaskGuest';
  id: string;
  entityId: string;
  amount?: number | null;
  annotations?: string | null;
  fromId: string;
  fromEntity?: EntityGuest | null;
  from?: EntityGuest | null;
  fromContact?: ContactGuest | null;
  fromType?: FromToType | null;
  toEntity?: EntityGuest | null;
  toContact?: ContactGuest | null;
  toId?: string | null;
  to?: EntityGuest | null;
  toType?: FromToType | null;
  status: TaskStatus;
  signatureStatus?: TaskSignatureStatus | null;
  paymentStatus?: TaskPaymentStatus | null;
  settlementStatus?: TaskSettlementStatus | null;
  type: TaskType;
  category?: TaskCategory | null;
  documents?: Array<S3Upload | null> | null;
  numberOfPayments?: number | null;
  paymentFrequency?: PaymentFrequency | null;
  paymentTypes: Array<PaymentType | null>;
  reference?: string | null;
  bpayReferenceNumber?: string | null;
  createdBy: string;
  gstInclusive?: boolean | null;
  entityIdBy?: string | null;
  dueAt: string;
  notes?: string | null;
  direction?: TaskDirection | null;
  paymentAt?: string | null;
  lodgementAt?: string | null;
  readAt?: string | null;
  paidAt?: string | null;
  completedAt?: string | null;
  owner?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type EntityGuest = {
  __typename: 'EntityGuest';
  id: string;
  name: string;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type ContactGuest = {
  __typename: 'ContactGuest';
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type UpdateTaskPublicInput = {
  token: string;
  annotations?: string | null;
  document?: S3UploadInput | null;
};

export type CreateTaskDocumentUrlInput = {
  taskId: string;
  entityId: string;
};

export type TaskDocumentUrl = {
  __typename: 'TaskDocumentUrl';
  url?: string | null;
  expiresAt?: string | null;
};

export type CreateTranslationInput = {
  language?: string | null;
  namespace?: string | null;
  name?: string | null;
  value?: string | null;
};

export type Translation = {
  __typename: 'Translation';
  language: string;
  namespace: string;
  data?: string | null;
};

export type UpdateTranslationInput = {
  language?: string | null;
  namespace?: string | null;
  data?: string | null;
};

export type UpdateUserInput = {
  id: string;
  about?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  country?: string | null;
  profileImg?: ImageInput | null;
  interests?: Array<string | null> | null;
  locale?: string | null;
  onboardingStatus?: OnboardingStatus | null;
  onboardingEntity?: string | null;
  userType?: UserType | null;
  notificationPreferences?: NotificationPreferencesInput | null;
  selectedSignatureKey?: string | null;
  email?: string | null;
  phone?: string | null;
};

export type NotificationPreferencesInput = {
  email?: boolean | null;
  push?: boolean | null;
  sms?: boolean | null;
};

export type BlockUserInput = {
  userId?: string | null;
  reason?: ReportReason | null;
};

export enum ReportReason {
  SPAM = 'SPAM',
  OFFENSIVE = 'OFFENSIVE',
}

export type CreateUserConversationInput = {
  conversationId: string;
  userId: string;
  users?: Array<string | null> | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  id?: string | null;
  conversationUserConversationsId?: string | null;
};

export type ModelUserConversationConditionInput = {
  conversationId?: ModelIDInput | null;
  userId?: ModelIDInput | null;
  users?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelUserConversationConditionInput | null> | null;
  or?: Array<ModelUserConversationConditionInput | null> | null;
  not?: ModelUserConversationConditionInput | null;
  conversationUserConversationsId?: ModelIDInput | null;
};

export type UpdateUserConversationInput = {
  conversationId?: string | null;
  userId?: string | null;
  users?: Array<string | null> | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  id: string;
  conversationUserConversationsId?: string | null;
};

export type DeleteUserConversationInput = {
  id: string;
};

export type XeroCreateConsentUrlInput = {
  xeroEnv?: XeroEnv | null;
  scopeSet: XeroScopeSet;
};

export enum XeroEnv {
  LOCAL = 'LOCAL',
}

export enum XeroScopeSet {
  PROFILE = 'PROFILE',
  ACCOUNTING = 'ACCOUNTING',
}

export type XeroCreateContactSyncInput = {
  entityId: string;
  xeroTenantId: string;
};

export type XeroCreateInvoiceSyncInput = {
  entityId: string;
  xeroTenantId: string;
};

export type xeroCreateTenantsConnectInput = {
  url: string;
  xeroEnv?: XeroEnv | null;
};

export type XeroGetProfileInput = {
  url: string;
};

export type XeroDisconnectInput = {
  entityId: string;
};

export type GetUpdatePayToAgreementInput = {
  agreementUuid: string;
};

export type PayToAgreement = {
  __typename: 'PayToAgreement';
  id: string;
  agreementUuid: string;
  status?: string | null;
  statusDescription?: string | null;
  statusReasonCode?: string | null;
  statusReasonDescription?: string | null;
  entityId: string;
  fromId: string;
  from?: Entity | null;
  paymentFrequency: PaymentFrequency;
  amount: number;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type CreatePaymentMethodTokenInput = {
  tokenType: PaymentTokenType;
  isGuest?: boolean | null;
  taskId?: string | null;
  entityId?: string | null;
};

export enum PaymentTokenType {
  card = 'card',
  bank = 'bank',
}

export type CreatePaymentMethodToken = {
  __typename: 'CreatePaymentMethodToken';
  token?: string | null;
  userId?: string | null;
};

export type CreatePayToAgreementInput = {
  agreementUuids: Array<string>;
  billPayments: Array<BillsPaymentInput>;
};

export type ValidatePayToAgreementInput = {
  accountNumber: string;
  bsb: string;
  description?: string | null;
  entityId: string;
  billPayments: Array<BillsPaymentInput>;
};

export type ABNInformation = {
  __typename: 'ABNInformation';
  abn: string;
  abnStatus: string;
  abnStatusEffectiveFrom: string;
  acn: string;
  addressDate?: string | null;
  addressPostcode?: string | null;
  addressState?: string | null;
  businessName?: Array<string | null> | null;
  entityName?: string | null;
  entityTypeCode?: string | null;
  entityTypeName?: string | null;
  gst?: string | null;
  message?: string | null;
  type?: EntityType | null;
};

export type ModelAbrNameSearchInformationConnection = {
  __typename: 'ModelAbrNameSearchInformationConnection';
  items: Array<AbrNameSearchInformation | null>;
};

export type AbrNameSearchInformation = {
  __typename: 'AbrNameSearchInformation';
  abn: string;
  abnStatus: string;
  isCurrent: boolean;
  name: string;
  nameType: string;
  postcode: string;
  state: string;
};

export type ModelAdminFilterInput = {
  firstName?: ModelStringInput | null;
  lastName?: ModelStringInput | null;
  email?: ModelStringInput | null;
  phone?: ModelStringInput | null;
  role?: ModelAdminRoleInput | null;
  hasAccessed?: ModelBooleanInput | null;
  createdBy?: ModelIDInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelAdminFilterInput | null> | null;
  or?: Array<ModelAdminFilterInput | null> | null;
  not?: ModelAdminFilterInput | null;
};

export type ModelAdminConnection = {
  __typename: 'ModelAdminConnection';
  items: Array<Admin | null>;
  nextToken?: string | null;
};

export enum AutocompleteType {
  ENTITY = 'ENTITY',
  TAX = 'TAX',
}

export enum ModelSortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type ModelEntityFilterInput = {
  name?: ModelStringInput | null;
  searchName?: ModelStringInput | null;
  taxNumber?: ModelStringInput | null;
  address?: ModelStringInput | null;
  type?: ModelEntityTypeInput | null;
  owner?: ModelIDInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelEntityFilterInput | null> | null;
  or?: Array<ModelEntityFilterInput | null> | null;
  not?: ModelEntityFilterInput | null;
};

export type ModelAutocompleteResultConnection = {
  __typename: 'ModelAutocompleteResultConnection';
  items: Array<AutocompleteResult | null>;
  nextToken?: string | null;
};

export type AutocompleteResult = {
  __typename: 'AutocompleteResult';
  id: string;
  value: string;
  label: string;
  info?: string | null;
  type: AutocompleteType;
  searchName: string;
  metadata?: AutocompleteResultMetadata | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type AutocompleteResultMetadata = {
  __typename: 'AutocompleteResultMetadata';
  subCategory?: string | null;
  payoutMethod?: PayoutMethod | null;
};

export enum PayoutMethod {
  BANK = 'BANK',
  BPAY = 'BPAY',
}

export type GetAutoCompleteResult = {
  __typename: 'GetAutoCompleteResult';
  entity?: Entity | null;
  contact?: Contact | null;
};

export type ModelContactConnection = {
  __typename: 'ModelContactConnection';
  items: Array<Contact | null>;
  total?: number | null;
};

export type ModelConversationFilterInput = {
  title?: ModelStringInput | null;
  country?: ModelStringInput | null;
  users?: ModelStringInput | null;
  readBy?: ModelStringInput | null;
  createdBy?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelConversationFilterInput | null> | null;
  or?: Array<ModelConversationFilterInput | null> | null;
  not?: ModelConversationFilterInput | null;
};

export type ModelConversationConnection = {
  __typename: 'ModelConversationConnection';
  items: Array<Conversation | null>;
  nextToken?: string | null;
};

export type ModelDocumentAnalysisConnection = {
  __typename: 'ModelDocumentAnalysisConnection';
  items: Array<DocumentAnalysis | null>;
  nextToken?: string | null;
};

export type ModelEntityUserFilterInput = {
  entityId?: ModelIDInput | null;
  entitySearchName?: ModelStringInput | null;
  searchName?: ModelStringInput | null;
  role?: EntityUserRoleFilter | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelEntityUserFilterInput | null> | null;
  or?: Array<ModelEntityUserFilterInput | null> | null;
  not?: ModelEntityUserFilterInput | null;
};

export type EntityUserRoleFilter = {
  eq?: EntityUserRole | null;
  ne?: EntityUserRole | null;
};

export type BusinessLookupResult = {
  __typename: 'BusinessLookupResult';
  name?: string | null;
  legalNames?: Array<string | null> | null;
  businessNames?: Array<string | null> | null;
  mainNames?: Array<string | null> | null;
  tradingNames?: Array<string | null> | null;
  score?: string | null;
  state?: string | null;
  postalCode?: string | null;
  type?: string | null;
  abn?: string | null;
  acn?: string | null;
  isActive?: boolean | null;
};

export type ModelMessageFilterInput = {
  conversationId?: ModelIDInput | null;
  text?: ModelStringInput | null;
  users?: ModelStringInput | null;
  receiver?: ModelIDInput | null;
  sender?: ModelIDInput | null;
  createdBy?: ModelStringInput | null;
  readBy?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelMessageFilterInput | null> | null;
  or?: Array<ModelMessageFilterInput | null> | null;
  not?: ModelMessageFilterInput | null;
  conversationMessagesId?: ModelIDInput | null;
};

export type ModelStringKeyConditionInput = {
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
};

export type ModelNotificationFilterInput = {
  status?: NotificationStatusInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  type?: ModelStringInput | null;
  and?: Array<ModelNotificationFilterInput | null> | null;
  or?: Array<ModelNotificationFilterInput | null> | null;
  not?: ModelNotificationFilterInput | null;
};

export type NotificationStatusInput = {
  eq?: NotificationStatus | null;
  ne?: NotificationStatus | null;
};

export type ModelNotificationConnection = {
  __typename: 'ModelNotificationConnection';
  items: Array<Notification | null>;
  nextToken?: string | null;
};

export type ModelOptionFilterInput = {
  name?: ModelStringInput | null;
  label?: ModelStringInput | null;
  value?: ModelStringInput | null;
  group?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelOptionFilterInput | null> | null;
  or?: Array<ModelOptionFilterInput | null> | null;
  not?: ModelOptionFilterInput | null;
};

export type ModelOptionConnection = {
  __typename: 'ModelOptionConnection';
  items: Array<Option | null>;
  nextToken?: string | null;
};

export type ModelTransactionFilterInput = {
  userId?: ModelStringInput | null;
  purchaseToken?: ModelStringInput | null;
  expiresAt?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelTransactionFilterInput | null> | null;
  or?: Array<ModelTransactionFilterInput | null> | null;
  not?: ModelTransactionFilterInput | null;
};

export type ModelRatingConnection = {
  __typename: 'ModelRatingConnection';
  items: Array<Rating | null>;
  nextToken?: string | null;
};

export type ModelServiceFilterInput = {
  status?: ModelServiceStatusInput | null;
  searchName?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelServiceFilterInput | null> | null;
  or?: Array<ModelServiceFilterInput | null> | null;
  not?: ModelServiceFilterInput | null;
};

export type ModelServiceStatusInput = {
  eq?: ServiceStatus | null;
  ne?: ServiceStatus | null;
};

export type ModelServiceConnection = {
  __typename: 'ModelServiceConnection';
  items?: Array<Service | null> | null;
  nextToken?: string | null;
};

export enum TaskSearchStatus {
  INCOMPLETE = 'INCOMPLETE',
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
  DRAFT = 'DRAFT',
}

export type ModelTaskFilterInput = {
  status?: ModelTaskStatusInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelTaskFilterInput | null> | null;
  or?: Array<ModelTaskFilterInput | null> | null;
  not?: ModelTaskFilterInput | null;
};

export type ModelTaskStatusInput = {
  eq?: TaskStatus | null;
  ne?: TaskStatus | null;
};

export type ModelTaskConnection = {
  __typename: 'ModelTaskConnection';
  items: Array<Task | null>;
  nextToken?: string | null;
};

export type TaskNumber = {
  __typename: 'TaskNumber';
  id?: string | null;
  invoice?: number | null;
  quote?: number | null;
};

export type Transaction = {
  __typename: 'Transaction';
  id: string;
  amount?: number | null;
  currency?: string | null;
  description?: string | null;
  status?: string | null;
  type?: string | null;
  typeMethod?: string | null;
  buyerId?: string | null;
  taskId?: string | null;
  entityId?: string | null;
  referredBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type ModelTransactionConnection = {
  __typename: 'ModelTransactionConnection';
  items: Array<Transaction | null>;
  nextToken?: string | null;
};

export type ModelTemplateFilterInput = {
  status?: ModelTemplateStatusInput | null;
  searchName?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelTemplateFilterInput | null> | null;
  or?: Array<ModelTemplateFilterInput | null> | null;
  not?: ModelTemplateFilterInput | null;
};

export type ModelTemplateStatusInput = {
  eq?: TemplateStatus | null;
  ne?: TemplateStatus | null;
};

export type ModelTemplateConnection = {
  __typename: 'ModelTemplateConnection';
  items?: Array<Template | null> | null;
  nextToken?: string | null;
};

export type TranslationConnection = {
  __typename: 'TranslationConnection';
  language?: string | null;
  items?: Array<Translation | null> | null;
};

export type ModelUserConversationFilterInput = {
  conversationId?: ModelIDInput | null;
  userId?: ModelIDInput | null;
  users?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelUserConversationFilterInput | null> | null;
  or?: Array<ModelUserConversationFilterInput | null> | null;
  not?: ModelUserConversationFilterInput | null;
  conversationUserConversationsId?: ModelIDInput | null;
};

export type ModelUserFilterInput = {
  id?: ModelIDInput | null;
  identityId?: ModelIDInput | null;
  email?: ModelStringInput | null;
  about?: ModelStringInput | null;
  firstName?: ModelStringInput | null;
  lastName?: ModelStringInput | null;
  phone?: ModelStringInput | null;
  blocked?: ModelStringInput | null;
  blockedBy?: ModelStringInput | null;
  country?: ModelStringInput | null;
  interests?: ModelStringInput | null;
  locale?: ModelStringInput | null;
  onboardingStatus?: ModelOnboardingStatusInput | null;
  onboardingEntity?: ModelIDInput | null;
  userType?: ModelUserTypeInput | null;
  reportReasons?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelUserFilterInput | null> | null;
  or?: Array<ModelUserFilterInput | null> | null;
  not?: ModelUserFilterInput | null;
};

export type ModelOnboardingStatusInput = {
  eq?: OnboardingStatus | null;
  ne?: OnboardingStatus | null;
};

export type ModelUserTypeInput = {
  eq?: UserType | null;
  ne?: UserType | null;
};

export type ModelUserConnection = {
  __typename: 'ModelUserConnection';
  items: Array<User | null>;
  nextToken?: string | null;
};

export type ModelActivityFilterInput = {
  userId?: ModelIDInput | null;
  entityId?: ModelIDInput | null;
  type?: ModelActivityTypeInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelActivityFilterInput | null> | null;
  or?: Array<ModelActivityFilterInput | null> | null;
  not?: ModelActivityFilterInput | null;
};

export type ModelActivityTypeInput = {
  eq?: ActivityType | null;
  ne?: ActivityType | null;
};

export type ModelReferralConnection = {
  __typename: 'ModelReferralConnection';
  items: Array<Referral | null>;
  nextToken?: string | null;
};

export type Referral = {
  __typename: 'Referral';
  id: string;
  userId: string;
  referredId: string;
  firstName?: string | null;
  lastName?: string | null;
  taskPaidCount?: number | null;
  referredByCode?: string | null;
  referredCompleted?: boolean | null;
  referredSignedStatus?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type XeroContact = {
  __typename: 'XeroContact';
  contactID: string;
  contactNumber?: string | null;
  accountNumber?: string | null;
  contactStatus?: ContactStatus | null;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  emailAddress?: string | null;
  bankAccountDetails?: string | null;
  companyNumber?: string | null;
  taxNumber?: string | null;
  accountsReceivableTaxType?: string | null;
  accountsPayableTaxType?: string | null;
  addresses?: Array<XeroAddress | null> | null;
  phones?: Array<XeroPhone | null> | null;
  isSupplier?: boolean | null;
  isCustomer?: boolean | null;
  defaultCurrency?: string | null;
  updatedDateUTC?: string | null;
  contactPersons?: Array<XeroContactPerson | null> | null;
  xeroNetworkKey?: string | null;
  mergedToContactID?: string | null;
  salesDefaultAccountCode?: string | null;
  purchasesDefaultAccountCode?: string | null;
  salesTrackingCategories?: Array<string | null> | null;
  purchasesTrackingCategories?: Array<string | null> | null;
  salesDefaultLineAmountType?: string | null;
  purchasesDefaultLineAmountType?: string | null;
  trackingCategoryName?: string | null;
  trackingCategoryOption?: string | null;
  paymentTerms?: string | null;
  website?: string | null;
  brandingTheme?: string | null;
  batchPayments?: string | null;
  discount?: number | null;
  validationErrors?: Array<string | null> | null;
  hasValidationErrors?: boolean | null;
  hasAttachments?: boolean | null;
  balances?: Balances | null;
  statusAttributeString?: string | null;
};

export type XeroAddress = {
  __typename: 'XeroAddress';
  addressType?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  addressLine3?: string | null;
  addressLine4?: string | null;
  city?: string | null;
  region?: string | null;
  postalCode?: string | null;
  country?: string | null;
  attentionTo?: string | null;
};

export type XeroPhone = {
  __typename: 'XeroPhone';
  phoneType?: string | null;
  phoneNumber?: string | null;
  phoneAreaCode?: string | null;
  phoneCountryCode?: string | null;
};

export type XeroContactPerson = {
  __typename: 'XeroContactPerson';
  firstName?: string | null;
  lastName?: string | null;
  emailAddress?: string | null;
  includeInEmails?: boolean | null;
};

export type Balances = {
  __typename: 'Balances';
  accountsReceivable?: number | null;
  accountsPayable?: number | null;
};

export enum XeroInvoiceStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  DELETED = 'DELETED',
  AUTHORISED = 'AUTHORISED',
  PAID = 'PAID',
  VOIDED = 'VOIDED',
}

export type XeroInvoice = {
  __typename: 'XeroInvoice';
  invoiceID: string;
  type?: string | null;
  status?: XeroInvoiceStatus | null;
  lineAmountTypes?: string | null;
  currencyCode?: string | null;
  date?: string | null;
  dueDate?: string | null;
  lineItems?: Array<XeroLineItem | null> | null;
  subTotal?: number | null;
  totalTax?: number | null;
  total?: number | null;
  invoiceNumber?: string | null;
  reference?: string | null;
  hasAttachments?: boolean | null;
  updatedDateUTC?: string | null;
  currencyRate?: number | null;
  remainingCredit?: number | null;
  amountDue?: number | null;
  amountPaid?: number | null;
  fullyPaidOnDate?: string | null;
  amountCredited?: number | null;
  brandingThemeID?: string | null;
  hasErrors?: boolean | null;
  contact?: XeroContact | null;
};

export type XeroLineItem = {
  __typename: 'XeroLineItem';
  lineItemID: string;
  description?: string | null;
  quantity?: number | null;
  unitAmount?: number | null;
  itemCode?: string | null;
  accountCode?: string | null;
  accountID?: string | null;
  taxType?: string | null;
  taxAmount?: number | null;
  lineAmount?: number | null;
  taxNumber?: number | null;
  discountRate?: number | null;
  discountAmount?: number | null;
  repeatingInvoiceID?: string | null;
};

export type XeroConnectionStatus = {
  __typename: 'XeroConnectionStatus';
  isConnected: boolean;
};

export type XeroTenant = {
  __typename: 'XeroTenant';
  id?: string | null;
  authEventId?: string | null;
  tenantId?: string | null;
  tenantType?: XeroTenantType | null;
  tenantName?: string | null;
  createdDateUtc?: string | null;
  updatedDateUtc?: string | null;
};

export enum XeroTenantType {
  ORGANISATION = 'ORGANISATION',
  PRACTICEMANAGER = 'PRACTICEMANAGER',
  PRACTICE = 'PRACTICE',
}

export type XeroGetAccountsInput = {
  entityId: string;
};

export type XeroAccount = {
  __typename: 'XeroAccount';
  code?: string | null;
  name?: string | null;
  accountID?: string | null;
  type?: XeroAccountType | null;
  bankAccountNumber?: string | null;
  status?: XeroAccountStatus | null;
  description?: string | null;
  bankAccountType?: XeroBankAccountType | null;
  currencyCode?: string | null;
  taxType?: string | null;
  enablePaymentsToAccount?: boolean | null;
  showInExpenseClaims?: boolean | null;
  _class?: XeroAccountClass | null;
  systemAccount?: XeroSystemAccountType | null;
  reportingCode?: string | null;
  reportingCodeName?: string | null;
  hasAttachments?: boolean | null;
  updatedDateUTC?: string | null;
  addToWatchlist?: boolean | null;
};

export enum XeroAccountType {
  BANK = 'BANK',
  CURRENT = 'CURRENT',
  CURRLIAB = 'CURRLIAB',
  DEPRECIATN = 'DEPRECIATN',
  DIRECTCOSTS = 'DIRECTCOSTS',
  EQUITY = 'EQUITY',
  EXPENSE = 'EXPENSE',
  FIXED = 'FIXED',
  INVENTORY = 'INVENTORY',
  LIABILITY = 'LIABILITY',
  NONCURRENT = 'NONCURRENT',
  OTHERINCOME = 'OTHERINCOME',
  OVERHEADS = 'OVERHEADS',
  PREPAYMENT = 'PREPAYMENT',
  REVENUE = 'REVENUE',
  SALES = 'SALES',
  TERMLIAB = 'TERMLIAB',
  PAYG = 'PAYG',
}

export enum XeroAccountStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
}

export enum XeroBankAccountType {
  BANK = 'BANK',
  CREDITCARD = 'CREDITCARD',
  PAYPAL = 'PAYPAL',
  NONE = 'NONE',
  Empty = 'Empty',
}

export enum XeroAccountClass {
  ASSET = 'ASSET',
  EQUITY = 'EQUITY',
  EXPENSE = 'EXPENSE',
  LIABILITY = 'LIABILITY',
  REVENUE = 'REVENUE',
}

export enum XeroSystemAccountType {
  DEBTORS = 'DEBTORS',
  CREDITORS = 'CREDITORS',
  BANKCURRENCYGAIN = 'BANKCURRENCYGAIN',
  GST = 'GST',
  GSTONIMPORTS = 'GSTONIMPORTS',
  HISTORICAL = 'HISTORICAL',
  REALISEDCURRENCYGAIN = 'REALISEDCURRENCYGAIN',
  RETAINEDEARNINGS = 'RETAINEDEARNINGS',
  ROUNDING = 'ROUNDING',
  TRACKINGTRANSFERS = 'TRACKINGTRANSFERS',
  UNPAIDEXPCLM = 'UNPAIDEXPCLM',
  UNREALISEDCURRENCYGAIN = 'UNREALISEDCURRENCYGAIN',
  WAGEPAYABLES = 'WAGEPAYABLES',
  CISASSETS = 'CISASSETS',
  CISASSET = 'CISASSET',
  CISLABOUR = 'CISLABOUR',
  CISLABOUREXPENSE = 'CISLABOUREXPENSE',
  CISLABOURINCOME = 'CISLABOURINCOME',
  CISLIABILITY = 'CISLIABILITY',
  CISMATERIALS = 'CISMATERIALS',
  Empty = 'Empty',
}

export type ProviderPayToFailedPayment = {
  __typename: 'ProviderPayToFailedPayment';
  id: string;
  agreementUuid: string;
  errorMessage?: string | null;
};

export type EntityPayId = {
  __typename: 'EntityPayId';
  transferAmount?: number | null;
  payId?: string | null;
  payIdReference?: string | null;
  currency?: string | null;
};

export type CreateAdminMutationVariables = {
  input?: CreateAdminInput | null;
};

export type CreateAdminMutation = {
  createAdmin?: {
    __typename: 'Admin';
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    role?: AdminRole | null;
    hasAccessed?: boolean | null;
    createdBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
    owner?: string | null;
  } | null;
};

export type UpdateAdminMutationVariables = {
  input: UpdateAdminInput;
  condition?: ModelAdminConditionInput | null;
};

export type UpdateAdminMutation = {
  updateAdmin?: {
    __typename: 'Admin';
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    role?: AdminRole | null;
    hasAccessed?: boolean | null;
    createdBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
    owner?: string | null;
  } | null;
};

export type DeleteAdminMutationVariables = {
  input?: DeleteAdminInput | null;
};

export type DeleteAdminMutation = {
  deleteAdmin?: {
    __typename: 'Admin';
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    role?: AdminRole | null;
    hasAccessed?: boolean | null;
    createdBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
    owner?: string | null;
  } | null;
};

export type UpdateBeneficialOwnerMutationVariables = {
  input?: UpdateBeneficialOwnerInput | null;
};

export type UpdateBeneficialOwnerMutation = {
  updateBeneficialOwner?: {
    __typename: 'BeneficialOwner';
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    name?: string | null;
    providerEntityId: string;
    verificationStatus: VerificationStatus;
    verificationAttempt?: number | null;
    createdBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null;
};

export type CreateClientMutationVariables = {
  input?: CreateClientInput | null;
};

export type CreateClientMutation = {
  createClient?: {
    __typename: 'EntityUser';
    id: string;
    entityId: string;
    userId: string;
    invitedEmail?: string | null;
    referredBy?: string | null;
    invitedEntityId?: string | null;
    firmEntityId?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    role?: EntityUserRole | null;
    paymentsEnabled?: boolean | null;
    entitySearchName?: string | null;
    entity?: {
      __typename: 'Entity';
      id: string;
      type: EntityType;
      taxNumber?: string | null;
      companyNumber?: string | null;
      billerCode?: number | null;
      name: string;
      legalName?: string | null;
      searchName?: string | null;
      address?: {
        __typename: 'Address';
        addressId?: string | null;
        placeId?: string | null;
        contactName?: string | null;
        contactNumber?: string | null;
        addressFull?: string | null;
        address1?: string | null;
        address2?: string | null;
        unitNumber?: string | null;
        streetNumber?: string | null;
        streetName?: string | null;
        streetType?: string | null;
        city: string;
        country: string;
        countryCode?: string | null;
        state: string;
        stateCode?: string | null;
        postalCode: string;
      } | null;
      logo?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      entityBeneficialOwners?: {
        __typename: 'ModelEntityBeneficialOwnerConnection';
        items?: Array<{
          __typename: 'EntityBeneficialOwner';
          entityId: string;
          beneficialOwnerId: string;
          beneficialOwner?: {
            __typename: 'BeneficialOwner';
            id: string;
            firstName?: string | null;
            lastName?: string | null;
            name?: string | null;
            providerEntityId: string;
            verificationStatus: VerificationStatus;
            verificationAttempt?: number | null;
            createdBy?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
          } | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          owner?: string | null;
        } | null> | null;
        nextToken?: string | null;
      } | null;
      entityUsers?: {
        __typename: 'ModelEntityUserConnection';
        items: Array<{
          __typename: 'EntityUser';
          id: string;
          entityId: string;
          userId: string;
          invitedEmail?: string | null;
          referredBy?: string | null;
          invitedEntityId?: string | null;
          firmEntityId?: string | null;
          firstName?: string | null;
          lastName?: string | null;
          role?: EntityUserRole | null;
          paymentsEnabled?: boolean | null;
          entitySearchName?: string | null;
          entity?: {
            __typename: 'Entity';
            id: string;
            type: EntityType;
            taxNumber?: string | null;
            companyNumber?: string | null;
            billerCode?: number | null;
            name: string;
            legalName?: string | null;
            searchName?: string | null;
            address?: {
              __typename: 'Address';
              addressId?: string | null;
              placeId?: string | null;
              contactName?: string | null;
              contactNumber?: string | null;
              addressFull?: string | null;
              address1?: string | null;
              address2?: string | null;
              unitNumber?: string | null;
              streetNumber?: string | null;
              streetName?: string | null;
              streetType?: string | null;
              city: string;
              country: string;
              countryCode?: string | null;
              state: string;
              stateCode?: string | null;
              postalCode: string;
            } | null;
            logo?: {
              __typename: 'Image';
              alt?: string | null;
              identityId?: string | null;
              key: string;
              level: S3UploadLevel;
              type?: string | null;
            } | null;
            entityBeneficialOwners?: {
              __typename: 'ModelEntityBeneficialOwnerConnection';
              items?: Array<{
                __typename: 'EntityBeneficialOwner';
                entityId: string;
                beneficialOwnerId: string;
                createdAt?: string | null;
                updatedAt?: string | null;
                owner?: string | null;
              } | null> | null;
              nextToken?: string | null;
            } | null;
            entityUsers?: {
              __typename: 'ModelEntityUserConnection';
              items: Array<{
                __typename: 'EntityUser';
                id: string;
                entityId: string;
                userId: string;
                invitedEmail?: string | null;
                referredBy?: string | null;
                invitedEntityId?: string | null;
                firmEntityId?: string | null;
                firstName?: string | null;
                lastName?: string | null;
                role?: EntityUserRole | null;
                paymentsEnabled?: boolean | null;
                entitySearchName?: string | null;
                searchName?: string | null;
                createdBy?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                status?: EntityUserStatus | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            gstRegistered?: boolean | null;
            providerEntityId?: string | null;
            providerCompanyId?: string | null;
            providerBillUserCompanyId?: string | null;
            providerBankAccountId?: string | null;
            providerDigitalWalletId?: string | null;
            providerBpayCrn?: string | null;
            contact?: {
              __typename: 'EntityContact';
              firstName?: string | null;
              lastName?: string | null;
              email?: string | null;
              phone?: string | null;
              role?: string | null;
            } | null;
            paymentMethods?: {
              __typename: 'ModelPaymentMethodConnection';
              items: Array<{
                __typename: 'PaymentMethod';
                id: string;
                paymentMethodType: PaymentMethodType;
                type?: string | null;
                fullName?: string | null;
                number?: string | null;
                expMonth?: string | null;
                expYear?: string | null;
                accountName?: string | null;
                bankName?: string | null;
                accountNumber?: string | null;
                routingNumber?: string | null;
                holderType?: BankHolderType | null;
                accountType?: BankAccountType | null;
                status?: PaymentMethodStatus | null;
                accountDirection?: AccountDirection | null;
                expiresAt?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            paymentMethodId?: string | null;
            paymentUserId?: string | null;
            disbursementMethodId?: string | null;
            receivingAccounts?: {
              __typename: 'ModelPaymentMethodConnection';
              items: Array<{
                __typename: 'PaymentMethod';
                id: string;
                paymentMethodType: PaymentMethodType;
                type?: string | null;
                fullName?: string | null;
                number?: string | null;
                expMonth?: string | null;
                expYear?: string | null;
                accountName?: string | null;
                bankName?: string | null;
                accountNumber?: string | null;
                routingNumber?: string | null;
                holderType?: BankHolderType | null;
                accountType?: BankAccountType | null;
                status?: PaymentMethodStatus | null;
                accountDirection?: AccountDirection | null;
                expiresAt?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            ubosCreated?: boolean | null;
            numUbosCreated?: number | null;
            subCategory?: string | null;
            clientsStatus?: EntityClientsStatus | null;
            ocrEmail?: string | null;
            verificationStatus?: VerificationStatus | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            owner: string;
            referredBy?: string | null;
            xeroContactSyncStatus?: XeroSyncStatus | null;
            xeroLastContactSyncAt?: string | null;
            xeroInvoiceSyncStatus?: XeroSyncStatus | null;
            xeroLastInvoiceSyncAt?: string | null;
            xeroTenantId?: string | null;
          } | null;
          searchName?: string | null;
          createdBy?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          status?: EntityUserStatus | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      gstRegistered?: boolean | null;
      providerEntityId?: string | null;
      providerCompanyId?: string | null;
      providerBillUserCompanyId?: string | null;
      providerBankAccountId?: string | null;
      providerDigitalWalletId?: string | null;
      providerBpayCrn?: string | null;
      contact?: {
        __typename: 'EntityContact';
        firstName?: string | null;
        lastName?: string | null;
        email?: string | null;
        phone?: string | null;
        role?: string | null;
      } | null;
      paymentMethods?: {
        __typename: 'ModelPaymentMethodConnection';
        items: Array<{
          __typename: 'PaymentMethod';
          id: string;
          paymentMethodType: PaymentMethodType;
          type?: string | null;
          fullName?: string | null;
          number?: string | null;
          expMonth?: string | null;
          expYear?: string | null;
          accountName?: string | null;
          bankName?: string | null;
          accountNumber?: string | null;
          routingNumber?: string | null;
          holderType?: BankHolderType | null;
          accountType?: BankAccountType | null;
          status?: PaymentMethodStatus | null;
          accountDirection?: AccountDirection | null;
          expiresAt?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      paymentMethodId?: string | null;
      paymentUserId?: string | null;
      disbursementMethodId?: string | null;
      receivingAccounts?: {
        __typename: 'ModelPaymentMethodConnection';
        items: Array<{
          __typename: 'PaymentMethod';
          id: string;
          paymentMethodType: PaymentMethodType;
          type?: string | null;
          fullName?: string | null;
          number?: string | null;
          expMonth?: string | null;
          expYear?: string | null;
          accountName?: string | null;
          bankName?: string | null;
          accountNumber?: string | null;
          routingNumber?: string | null;
          holderType?: BankHolderType | null;
          accountType?: BankAccountType | null;
          status?: PaymentMethodStatus | null;
          accountDirection?: AccountDirection | null;
          expiresAt?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      ubosCreated?: boolean | null;
      numUbosCreated?: number | null;
      subCategory?: string | null;
      clientsStatus?: EntityClientsStatus | null;
      ocrEmail?: string | null;
      verificationStatus?: VerificationStatus | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      owner: string;
      referredBy?: string | null;
      xeroContactSyncStatus?: XeroSyncStatus | null;
      xeroLastContactSyncAt?: string | null;
      xeroInvoiceSyncStatus?: XeroSyncStatus | null;
      xeroLastInvoiceSyncAt?: string | null;
      xeroTenantId?: string | null;
    } | null;
    searchName?: string | null;
    createdBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    status?: EntityUserStatus | null;
  } | null;
};

export type CreateContactMutationVariables = {
  input: CreateContactInput;
};

export type CreateContactMutation = {
  createContact?: {
    __typename: 'Contact';
    id: string;
    entityId: string;
    xeroTenantId?: string | null;
    entityType?: EntityType | null;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    mobile?: string | null;
    phone?: string | null;
    taxNumber?: string | null;
    companyNumber?: string | null;
    name?: string | null;
    legalName?: string | null;
    companyName?: string | null;
    searchName?: string | null;
    status?: ContactStatus | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    contactType?: ContactType | null;
    bank?: {
      __typename: 'ContactBankAccount';
      id?: string | null;
      accountName?: string | null;
      bankName?: string | null;
      accountNumber: string;
      routingNumber: string;
      holderType?: BankHolderType | null;
      accountType?: BankAccountType | null;
      country?: string | null;
    } | null;
    bpay?: {
      __typename: 'ContactBpay';
      billerCode?: number | null;
      referenceNumber?: string | null;
    } | null;
    bulkUploadFileKey?: string | null;
    owner?: string | null;
  } | null;
};

export type CreateContactBulkUploadMutationVariables = {
  input: CreateContactBulkImportInput;
};

export type CreateContactBulkUploadMutation = {
  createContactBulkUpload?: string | null;
};

export type UpdateContactMutationVariables = {
  input: UpdateContactInput;
};

export type UpdateContactMutation = {
  updateContact?: {
    __typename: 'Contact';
    id: string;
    entityId: string;
    xeroTenantId?: string | null;
    entityType?: EntityType | null;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    mobile?: string | null;
    phone?: string | null;
    taxNumber?: string | null;
    companyNumber?: string | null;
    name?: string | null;
    legalName?: string | null;
    companyName?: string | null;
    searchName?: string | null;
    status?: ContactStatus | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    contactType?: ContactType | null;
    bank?: {
      __typename: 'ContactBankAccount';
      id?: string | null;
      accountName?: string | null;
      bankName?: string | null;
      accountNumber: string;
      routingNumber: string;
      holderType?: BankHolderType | null;
      accountType?: BankAccountType | null;
      country?: string | null;
    } | null;
    bpay?: {
      __typename: 'ContactBpay';
      billerCode?: number | null;
      referenceNumber?: string | null;
    } | null;
    bulkUploadFileKey?: string | null;
    owner?: string | null;
  } | null;
};

export type CreateConversationMutationVariables = {
  input: CreateConversationInput;
  condition?: ModelConversationConditionInput | null;
};

export type CreateConversationMutation = {
  createConversation?: {
    __typename: 'Conversation';
    title?: string | null;
    image?: {
      __typename: 'Image';
      alt?: string | null;
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type?: string | null;
    } | null;
    country?: string | null;
    messages?: {
      __typename: 'ModelMessageConnection';
      items: Array<{
        __typename: 'Message';
        conversationId: string;
        text?: string | null;
        attachments?: Array<{
          __typename: 'S3Upload';
          identityId?: string | null;
          key: string;
          level: S3UploadLevel;
          type: S3UploadType;
        } | null> | null;
        users: Array<string | null>;
        receiver: string;
        sender: string;
        createdBy: string;
        readBy?: Array<string | null> | null;
        createdAt: string;
        updatedAt?: string | null;
        id: string;
        conversationMessagesId?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    userConversations?: {
      __typename: 'ModelUserConversationConnection';
      items: Array<{
        __typename: 'UserConversation';
        conversationId: string;
        conversation?: {
          __typename: 'Conversation';
          title?: string | null;
          image?: {
            __typename: 'Image';
            alt?: string | null;
            identityId?: string | null;
            key: string;
            level: S3UploadLevel;
            type?: string | null;
          } | null;
          country?: string | null;
          messages?: {
            __typename: 'ModelMessageConnection';
            items: Array<{
              __typename: 'Message';
              conversationId: string;
              text?: string | null;
              attachments?: Array<{
                __typename: 'S3Upload';
                identityId?: string | null;
                key: string;
                level: S3UploadLevel;
                type: S3UploadType;
              } | null> | null;
              users: Array<string | null>;
              receiver: string;
              sender: string;
              createdBy: string;
              readBy?: Array<string | null> | null;
              createdAt: string;
              updatedAt?: string | null;
              id: string;
              conversationMessagesId?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          userConversations?: {
            __typename: 'ModelUserConversationConnection';
            items: Array<{
              __typename: 'UserConversation';
              conversationId: string;
              conversation?: {
                __typename: 'Conversation';
                title?: string | null;
                country?: string | null;
                users?: Array<string | null> | null;
                readBy?: Array<string | null> | null;
                createdBy?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                id: string;
              } | null;
              userId: string;
              user?: {
                __typename: 'User';
                id: string;
                identityId?: string | null;
                referralCode?: string | null;
                referredBy?: string | null;
                email?: string | null;
                about?: string | null;
                firstName?: string | null;
                firmId?: string | null;
                lastName?: string | null;
                phone?: string | null;
                blocked?: Array<string | null> | null;
                blockedBy?: Array<string | null> | null;
                country?: string | null;
                interests?: Array<string | null> | null;
                locale?: string | null;
                onboardingStatus?: OnboardingStatus | null;
                onboardingEntity?: string | null;
                selectedSignatureKey?: string | null;
                userType?: UserType | null;
                rating?: number | null;
                reportReasons?: Array<string | null> | null;
                paymentUserId?: string | null;
                providerWalletId?: string | null;
                providerNppCrn?: string | null;
                ipAddress?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                owner?: string | null;
                loyaltyStatus?: RewardStatus | null;
                nextLoyaltyStatus?: RewardStatus | null;
                nextLoyaltyStatusPoint?: number | null;
                statusPoint?: number | null;
                pointsTotal?: number | null;
                pointsBalance?: number | null;
                invitedTo?: string | null;
              } | null;
              users?: Array<string | null> | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              id: string;
              conversationUserConversationsId?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          users?: Array<string | null> | null;
          readBy?: Array<string | null> | null;
          createdBy?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          id: string;
        } | null;
        userId: string;
        user?: {
          __typename: 'User';
          id: string;
          identityId?: string | null;
          referralCode?: string | null;
          referredBy?: string | null;
          email?: string | null;
          about?: string | null;
          firstName?: string | null;
          firmId?: string | null;
          lastName?: string | null;
          phone?: string | null;
          blocked?: Array<string | null> | null;
          blockedBy?: Array<string | null> | null;
          country?: string | null;
          profileImg?: {
            __typename: 'Image';
            alt?: string | null;
            identityId?: string | null;
            key: string;
            level: S3UploadLevel;
            type?: string | null;
          } | null;
          interests?: Array<string | null> | null;
          locale?: string | null;
          onboardingStatus?: OnboardingStatus | null;
          onboardingEntity?: string | null;
          selectedSignatureKey?: string | null;
          signatures?: {
            __typename: 'ModelSignatureConnection';
            items: Array<{
              __typename: 'Signature';
              id: string;
              userId: string;
              key: string;
              createdAt?: string | null;
              updatedAt?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          userType?: UserType | null;
          rating?: number | null;
          reportReasons?: Array<string | null> | null;
          notificationPreferences?: {
            __typename: 'NotificationPreferences';
            email?: boolean | null;
            push?: boolean | null;
            sms?: boolean | null;
          } | null;
          paymentUserId?: string | null;
          providerWalletId?: string | null;
          providerNppCrn?: string | null;
          ipAddress?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          owner?: string | null;
          loyaltyStatus?: RewardStatus | null;
          nextLoyaltyStatus?: RewardStatus | null;
          nextLoyaltyStatusPoint?: number | null;
          statusPoint?: number | null;
          pointsTotal?: number | null;
          pointsBalance?: number | null;
          invitedTo?: string | null;
        } | null;
        users?: Array<string | null> | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        conversationUserConversationsId?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    users?: Array<string | null> | null;
    readBy?: Array<string | null> | null;
    createdBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
  } | null;
};

export type UpdateConversationMutationVariables = {
  input: UpdateConversationInput;
  condition?: ModelConversationConditionInput | null;
};

export type UpdateConversationMutation = {
  updateConversation?: {
    __typename: 'Conversation';
    title?: string | null;
    image?: {
      __typename: 'Image';
      alt?: string | null;
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type?: string | null;
    } | null;
    country?: string | null;
    messages?: {
      __typename: 'ModelMessageConnection';
      items: Array<{
        __typename: 'Message';
        conversationId: string;
        text?: string | null;
        attachments?: Array<{
          __typename: 'S3Upload';
          identityId?: string | null;
          key: string;
          level: S3UploadLevel;
          type: S3UploadType;
        } | null> | null;
        users: Array<string | null>;
        receiver: string;
        sender: string;
        createdBy: string;
        readBy?: Array<string | null> | null;
        createdAt: string;
        updatedAt?: string | null;
        id: string;
        conversationMessagesId?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    userConversations?: {
      __typename: 'ModelUserConversationConnection';
      items: Array<{
        __typename: 'UserConversation';
        conversationId: string;
        conversation?: {
          __typename: 'Conversation';
          title?: string | null;
          image?: {
            __typename: 'Image';
            alt?: string | null;
            identityId?: string | null;
            key: string;
            level: S3UploadLevel;
            type?: string | null;
          } | null;
          country?: string | null;
          messages?: {
            __typename: 'ModelMessageConnection';
            items: Array<{
              __typename: 'Message';
              conversationId: string;
              text?: string | null;
              attachments?: Array<{
                __typename: 'S3Upload';
                identityId?: string | null;
                key: string;
                level: S3UploadLevel;
                type: S3UploadType;
              } | null> | null;
              users: Array<string | null>;
              receiver: string;
              sender: string;
              createdBy: string;
              readBy?: Array<string | null> | null;
              createdAt: string;
              updatedAt?: string | null;
              id: string;
              conversationMessagesId?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          userConversations?: {
            __typename: 'ModelUserConversationConnection';
            items: Array<{
              __typename: 'UserConversation';
              conversationId: string;
              conversation?: {
                __typename: 'Conversation';
                title?: string | null;
                country?: string | null;
                users?: Array<string | null> | null;
                readBy?: Array<string | null> | null;
                createdBy?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                id: string;
              } | null;
              userId: string;
              user?: {
                __typename: 'User';
                id: string;
                identityId?: string | null;
                referralCode?: string | null;
                referredBy?: string | null;
                email?: string | null;
                about?: string | null;
                firstName?: string | null;
                firmId?: string | null;
                lastName?: string | null;
                phone?: string | null;
                blocked?: Array<string | null> | null;
                blockedBy?: Array<string | null> | null;
                country?: string | null;
                interests?: Array<string | null> | null;
                locale?: string | null;
                onboardingStatus?: OnboardingStatus | null;
                onboardingEntity?: string | null;
                selectedSignatureKey?: string | null;
                userType?: UserType | null;
                rating?: number | null;
                reportReasons?: Array<string | null> | null;
                paymentUserId?: string | null;
                providerWalletId?: string | null;
                providerNppCrn?: string | null;
                ipAddress?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                owner?: string | null;
                loyaltyStatus?: RewardStatus | null;
                nextLoyaltyStatus?: RewardStatus | null;
                nextLoyaltyStatusPoint?: number | null;
                statusPoint?: number | null;
                pointsTotal?: number | null;
                pointsBalance?: number | null;
                invitedTo?: string | null;
              } | null;
              users?: Array<string | null> | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              id: string;
              conversationUserConversationsId?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          users?: Array<string | null> | null;
          readBy?: Array<string | null> | null;
          createdBy?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          id: string;
        } | null;
        userId: string;
        user?: {
          __typename: 'User';
          id: string;
          identityId?: string | null;
          referralCode?: string | null;
          referredBy?: string | null;
          email?: string | null;
          about?: string | null;
          firstName?: string | null;
          firmId?: string | null;
          lastName?: string | null;
          phone?: string | null;
          blocked?: Array<string | null> | null;
          blockedBy?: Array<string | null> | null;
          country?: string | null;
          profileImg?: {
            __typename: 'Image';
            alt?: string | null;
            identityId?: string | null;
            key: string;
            level: S3UploadLevel;
            type?: string | null;
          } | null;
          interests?: Array<string | null> | null;
          locale?: string | null;
          onboardingStatus?: OnboardingStatus | null;
          onboardingEntity?: string | null;
          selectedSignatureKey?: string | null;
          signatures?: {
            __typename: 'ModelSignatureConnection';
            items: Array<{
              __typename: 'Signature';
              id: string;
              userId: string;
              key: string;
              createdAt?: string | null;
              updatedAt?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          userType?: UserType | null;
          rating?: number | null;
          reportReasons?: Array<string | null> | null;
          notificationPreferences?: {
            __typename: 'NotificationPreferences';
            email?: boolean | null;
            push?: boolean | null;
            sms?: boolean | null;
          } | null;
          paymentUserId?: string | null;
          providerWalletId?: string | null;
          providerNppCrn?: string | null;
          ipAddress?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          owner?: string | null;
          loyaltyStatus?: RewardStatus | null;
          nextLoyaltyStatus?: RewardStatus | null;
          nextLoyaltyStatusPoint?: number | null;
          statusPoint?: number | null;
          pointsTotal?: number | null;
          pointsBalance?: number | null;
          invitedTo?: string | null;
        } | null;
        users?: Array<string | null> | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        conversationUserConversationsId?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    users?: Array<string | null> | null;
    readBy?: Array<string | null> | null;
    createdBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
  } | null;
};

export type DeleteConversationMutationVariables = {
  input: DeleteConversationInput;
  condition?: ModelConversationConditionInput | null;
};

export type DeleteConversationMutation = {
  deleteConversation?: {
    __typename: 'Conversation';
    title?: string | null;
    image?: {
      __typename: 'Image';
      alt?: string | null;
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type?: string | null;
    } | null;
    country?: string | null;
    messages?: {
      __typename: 'ModelMessageConnection';
      items: Array<{
        __typename: 'Message';
        conversationId: string;
        text?: string | null;
        attachments?: Array<{
          __typename: 'S3Upload';
          identityId?: string | null;
          key: string;
          level: S3UploadLevel;
          type: S3UploadType;
        } | null> | null;
        users: Array<string | null>;
        receiver: string;
        sender: string;
        createdBy: string;
        readBy?: Array<string | null> | null;
        createdAt: string;
        updatedAt?: string | null;
        id: string;
        conversationMessagesId?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    userConversations?: {
      __typename: 'ModelUserConversationConnection';
      items: Array<{
        __typename: 'UserConversation';
        conversationId: string;
        conversation?: {
          __typename: 'Conversation';
          title?: string | null;
          image?: {
            __typename: 'Image';
            alt?: string | null;
            identityId?: string | null;
            key: string;
            level: S3UploadLevel;
            type?: string | null;
          } | null;
          country?: string | null;
          messages?: {
            __typename: 'ModelMessageConnection';
            items: Array<{
              __typename: 'Message';
              conversationId: string;
              text?: string | null;
              attachments?: Array<{
                __typename: 'S3Upload';
                identityId?: string | null;
                key: string;
                level: S3UploadLevel;
                type: S3UploadType;
              } | null> | null;
              users: Array<string | null>;
              receiver: string;
              sender: string;
              createdBy: string;
              readBy?: Array<string | null> | null;
              createdAt: string;
              updatedAt?: string | null;
              id: string;
              conversationMessagesId?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          userConversations?: {
            __typename: 'ModelUserConversationConnection';
            items: Array<{
              __typename: 'UserConversation';
              conversationId: string;
              conversation?: {
                __typename: 'Conversation';
                title?: string | null;
                country?: string | null;
                users?: Array<string | null> | null;
                readBy?: Array<string | null> | null;
                createdBy?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                id: string;
              } | null;
              userId: string;
              user?: {
                __typename: 'User';
                id: string;
                identityId?: string | null;
                referralCode?: string | null;
                referredBy?: string | null;
                email?: string | null;
                about?: string | null;
                firstName?: string | null;
                firmId?: string | null;
                lastName?: string | null;
                phone?: string | null;
                blocked?: Array<string | null> | null;
                blockedBy?: Array<string | null> | null;
                country?: string | null;
                interests?: Array<string | null> | null;
                locale?: string | null;
                onboardingStatus?: OnboardingStatus | null;
                onboardingEntity?: string | null;
                selectedSignatureKey?: string | null;
                userType?: UserType | null;
                rating?: number | null;
                reportReasons?: Array<string | null> | null;
                paymentUserId?: string | null;
                providerWalletId?: string | null;
                providerNppCrn?: string | null;
                ipAddress?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                owner?: string | null;
                loyaltyStatus?: RewardStatus | null;
                nextLoyaltyStatus?: RewardStatus | null;
                nextLoyaltyStatusPoint?: number | null;
                statusPoint?: number | null;
                pointsTotal?: number | null;
                pointsBalance?: number | null;
                invitedTo?: string | null;
              } | null;
              users?: Array<string | null> | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              id: string;
              conversationUserConversationsId?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          users?: Array<string | null> | null;
          readBy?: Array<string | null> | null;
          createdBy?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          id: string;
        } | null;
        userId: string;
        user?: {
          __typename: 'User';
          id: string;
          identityId?: string | null;
          referralCode?: string | null;
          referredBy?: string | null;
          email?: string | null;
          about?: string | null;
          firstName?: string | null;
          firmId?: string | null;
          lastName?: string | null;
          phone?: string | null;
          blocked?: Array<string | null> | null;
          blockedBy?: Array<string | null> | null;
          country?: string | null;
          profileImg?: {
            __typename: 'Image';
            alt?: string | null;
            identityId?: string | null;
            key: string;
            level: S3UploadLevel;
            type?: string | null;
          } | null;
          interests?: Array<string | null> | null;
          locale?: string | null;
          onboardingStatus?: OnboardingStatus | null;
          onboardingEntity?: string | null;
          selectedSignatureKey?: string | null;
          signatures?: {
            __typename: 'ModelSignatureConnection';
            items: Array<{
              __typename: 'Signature';
              id: string;
              userId: string;
              key: string;
              createdAt?: string | null;
              updatedAt?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          userType?: UserType | null;
          rating?: number | null;
          reportReasons?: Array<string | null> | null;
          notificationPreferences?: {
            __typename: 'NotificationPreferences';
            email?: boolean | null;
            push?: boolean | null;
            sms?: boolean | null;
          } | null;
          paymentUserId?: string | null;
          providerWalletId?: string | null;
          providerNppCrn?: string | null;
          ipAddress?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          owner?: string | null;
          loyaltyStatus?: RewardStatus | null;
          nextLoyaltyStatus?: RewardStatus | null;
          nextLoyaltyStatusPoint?: number | null;
          statusPoint?: number | null;
          pointsTotal?: number | null;
          pointsBalance?: number | null;
          invitedTo?: string | null;
        } | null;
        users?: Array<string | null> | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        conversationUserConversationsId?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    users?: Array<string | null> | null;
    readBy?: Array<string | null> | null;
    createdBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
  } | null;
};

export type CreateDocumentAnalysisMutationVariables = {
  input?: CreateDocumentAnalysisInput | null;
};

export type CreateDocumentAnalysisMutation = {
  createDocumentAnalysis?: Array<{
    __typename: 'DocumentAnalysis';
    id: string;
    entityId: string;
    fileKey: string;
    status: DocumentAnalysisStatus;
    expenseStatus?: DocumentAnalysisStatus | null;
    queryStatus?: DocumentAnalysisStatus | null;
    matchedContactId?: string | null;
    matchedContact?: {
      __typename: 'Contact';
      id: string;
      entityId: string;
      xeroTenantId?: string | null;
      entityType?: EntityType | null;
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
      mobile?: string | null;
      phone?: string | null;
      taxNumber?: string | null;
      companyNumber?: string | null;
      name?: string | null;
      legalName?: string | null;
      companyName?: string | null;
      searchName?: string | null;
      status?: ContactStatus | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      contactType?: ContactType | null;
      bank?: {
        __typename: 'ContactBankAccount';
        id?: string | null;
        accountName?: string | null;
        bankName?: string | null;
        accountNumber: string;
        routingNumber: string;
        holderType?: BankHolderType | null;
        accountType?: BankAccountType | null;
        country?: string | null;
      } | null;
      bpay?: {
        __typename: 'ContactBpay';
        billerCode?: number | null;
        referenceNumber?: string | null;
      } | null;
      bulkUploadFileKey?: string | null;
      owner?: string | null;
    } | null;
    matchedEntityId?: string | null;
    matchedEntity?: {
      __typename: 'Entity';
      id: string;
      type: EntityType;
      taxNumber?: string | null;
      companyNumber?: string | null;
      billerCode?: number | null;
      name: string;
      legalName?: string | null;
      searchName?: string | null;
      address?: {
        __typename: 'Address';
        addressId?: string | null;
        placeId?: string | null;
        contactName?: string | null;
        contactNumber?: string | null;
        addressFull?: string | null;
        address1?: string | null;
        address2?: string | null;
        unitNumber?: string | null;
        streetNumber?: string | null;
        streetName?: string | null;
        streetType?: string | null;
        city: string;
        country: string;
        countryCode?: string | null;
        state: string;
        stateCode?: string | null;
        postalCode: string;
      } | null;
      logo?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      entityBeneficialOwners?: {
        __typename: 'ModelEntityBeneficialOwnerConnection';
        items?: Array<{
          __typename: 'EntityBeneficialOwner';
          entityId: string;
          beneficialOwnerId: string;
          beneficialOwner?: {
            __typename: 'BeneficialOwner';
            id: string;
            firstName?: string | null;
            lastName?: string | null;
            name?: string | null;
            providerEntityId: string;
            verificationStatus: VerificationStatus;
            verificationAttempt?: number | null;
            createdBy?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
          } | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          owner?: string | null;
        } | null> | null;
        nextToken?: string | null;
      } | null;
      entityUsers?: {
        __typename: 'ModelEntityUserConnection';
        items: Array<{
          __typename: 'EntityUser';
          id: string;
          entityId: string;
          userId: string;
          invitedEmail?: string | null;
          referredBy?: string | null;
          invitedEntityId?: string | null;
          firmEntityId?: string | null;
          firstName?: string | null;
          lastName?: string | null;
          role?: EntityUserRole | null;
          paymentsEnabled?: boolean | null;
          entitySearchName?: string | null;
          entity?: {
            __typename: 'Entity';
            id: string;
            type: EntityType;
            taxNumber?: string | null;
            companyNumber?: string | null;
            billerCode?: number | null;
            name: string;
            legalName?: string | null;
            searchName?: string | null;
            address?: {
              __typename: 'Address';
              addressId?: string | null;
              placeId?: string | null;
              contactName?: string | null;
              contactNumber?: string | null;
              addressFull?: string | null;
              address1?: string | null;
              address2?: string | null;
              unitNumber?: string | null;
              streetNumber?: string | null;
              streetName?: string | null;
              streetType?: string | null;
              city: string;
              country: string;
              countryCode?: string | null;
              state: string;
              stateCode?: string | null;
              postalCode: string;
            } | null;
            logo?: {
              __typename: 'Image';
              alt?: string | null;
              identityId?: string | null;
              key: string;
              level: S3UploadLevel;
              type?: string | null;
            } | null;
            entityBeneficialOwners?: {
              __typename: 'ModelEntityBeneficialOwnerConnection';
              items?: Array<{
                __typename: 'EntityBeneficialOwner';
                entityId: string;
                beneficialOwnerId: string;
                createdAt?: string | null;
                updatedAt?: string | null;
                owner?: string | null;
              } | null> | null;
              nextToken?: string | null;
            } | null;
            entityUsers?: {
              __typename: 'ModelEntityUserConnection';
              items: Array<{
                __typename: 'EntityUser';
                id: string;
                entityId: string;
                userId: string;
                invitedEmail?: string | null;
                referredBy?: string | null;
                invitedEntityId?: string | null;
                firmEntityId?: string | null;
                firstName?: string | null;
                lastName?: string | null;
                role?: EntityUserRole | null;
                paymentsEnabled?: boolean | null;
                entitySearchName?: string | null;
                searchName?: string | null;
                createdBy?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                status?: EntityUserStatus | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            gstRegistered?: boolean | null;
            providerEntityId?: string | null;
            providerCompanyId?: string | null;
            providerBillUserCompanyId?: string | null;
            providerBankAccountId?: string | null;
            providerDigitalWalletId?: string | null;
            providerBpayCrn?: string | null;
            contact?: {
              __typename: 'EntityContact';
              firstName?: string | null;
              lastName?: string | null;
              email?: string | null;
              phone?: string | null;
              role?: string | null;
            } | null;
            paymentMethods?: {
              __typename: 'ModelPaymentMethodConnection';
              items: Array<{
                __typename: 'PaymentMethod';
                id: string;
                paymentMethodType: PaymentMethodType;
                type?: string | null;
                fullName?: string | null;
                number?: string | null;
                expMonth?: string | null;
                expYear?: string | null;
                accountName?: string | null;
                bankName?: string | null;
                accountNumber?: string | null;
                routingNumber?: string | null;
                holderType?: BankHolderType | null;
                accountType?: BankAccountType | null;
                status?: PaymentMethodStatus | null;
                accountDirection?: AccountDirection | null;
                expiresAt?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            paymentMethodId?: string | null;
            paymentUserId?: string | null;
            disbursementMethodId?: string | null;
            receivingAccounts?: {
              __typename: 'ModelPaymentMethodConnection';
              items: Array<{
                __typename: 'PaymentMethod';
                id: string;
                paymentMethodType: PaymentMethodType;
                type?: string | null;
                fullName?: string | null;
                number?: string | null;
                expMonth?: string | null;
                expYear?: string | null;
                accountName?: string | null;
                bankName?: string | null;
                accountNumber?: string | null;
                routingNumber?: string | null;
                holderType?: BankHolderType | null;
                accountType?: BankAccountType | null;
                status?: PaymentMethodStatus | null;
                accountDirection?: AccountDirection | null;
                expiresAt?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            ubosCreated?: boolean | null;
            numUbosCreated?: number | null;
            subCategory?: string | null;
            clientsStatus?: EntityClientsStatus | null;
            ocrEmail?: string | null;
            verificationStatus?: VerificationStatus | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            owner: string;
            referredBy?: string | null;
            xeroContactSyncStatus?: XeroSyncStatus | null;
            xeroLastContactSyncAt?: string | null;
            xeroInvoiceSyncStatus?: XeroSyncStatus | null;
            xeroLastInvoiceSyncAt?: string | null;
            xeroTenantId?: string | null;
          } | null;
          searchName?: string | null;
          createdBy?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          status?: EntityUserStatus | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      gstRegistered?: boolean | null;
      providerEntityId?: string | null;
      providerCompanyId?: string | null;
      providerBillUserCompanyId?: string | null;
      providerBankAccountId?: string | null;
      providerDigitalWalletId?: string | null;
      providerBpayCrn?: string | null;
      contact?: {
        __typename: 'EntityContact';
        firstName?: string | null;
        lastName?: string | null;
        email?: string | null;
        phone?: string | null;
        role?: string | null;
      } | null;
      paymentMethods?: {
        __typename: 'ModelPaymentMethodConnection';
        items: Array<{
          __typename: 'PaymentMethod';
          id: string;
          paymentMethodType: PaymentMethodType;
          type?: string | null;
          fullName?: string | null;
          number?: string | null;
          expMonth?: string | null;
          expYear?: string | null;
          accountName?: string | null;
          bankName?: string | null;
          accountNumber?: string | null;
          routingNumber?: string | null;
          holderType?: BankHolderType | null;
          accountType?: BankAccountType | null;
          status?: PaymentMethodStatus | null;
          accountDirection?: AccountDirection | null;
          expiresAt?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      paymentMethodId?: string | null;
      paymentUserId?: string | null;
      disbursementMethodId?: string | null;
      receivingAccounts?: {
        __typename: 'ModelPaymentMethodConnection';
        items: Array<{
          __typename: 'PaymentMethod';
          id: string;
          paymentMethodType: PaymentMethodType;
          type?: string | null;
          fullName?: string | null;
          number?: string | null;
          expMonth?: string | null;
          expYear?: string | null;
          accountName?: string | null;
          bankName?: string | null;
          accountNumber?: string | null;
          routingNumber?: string | null;
          holderType?: BankHolderType | null;
          accountType?: BankAccountType | null;
          status?: PaymentMethodStatus | null;
          accountDirection?: AccountDirection | null;
          expiresAt?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      ubosCreated?: boolean | null;
      numUbosCreated?: number | null;
      subCategory?: string | null;
      clientsStatus?: EntityClientsStatus | null;
      ocrEmail?: string | null;
      verificationStatus?: VerificationStatus | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      owner: string;
      referredBy?: string | null;
      xeroContactSyncStatus?: XeroSyncStatus | null;
      xeroLastContactSyncAt?: string | null;
      xeroInvoiceSyncStatus?: XeroSyncStatus | null;
      xeroLastInvoiceSyncAt?: string | null;
      xeroTenantId?: string | null;
    } | null;
    newContact?: {
      __typename: 'DocumentAnalysisContact';
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
      phone?: string | null;
      companyName?: string | null;
      taxNumber?: string | null;
    } | null;
    task?: {
      __typename: 'DocumentAnalysisTask';
      reference?: string | null;
      dueAt?: string | null;
      gstInclusive?: boolean | null;
      notes?: string | null;
      amount?: number | null;
      gstAmount?: number | null;
      lineItems?: Array<{
        __typename: 'DocumentAnalysisLineItem';
        description?: string | null;
        quantity?: number | null;
        unitPrice?: number | null;
        price?: number | null;
        productCode?: string | null;
      } | null> | null;
      numberOfPayments?: number | null;
      paymentFrequency?: PaymentFrequency | null;
      shippingAmount?: number | null;
    } | null;
    bpay?: {
      __typename: 'ContactBpay';
      billerCode?: number | null;
      referenceNumber?: string | null;
    } | null;
    bank?: {
      __typename: 'DocumentAnalysisBankAccount';
      accountNumber?: string | null;
      routingNumber?: string | null;
    } | null;
    source?: DocumentAnalysisSource | null;
    createdBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null> | null;
};

export type UpdateDocumentAnalysisMutationVariables = {
  input?: UpdateDocumentAnalysisInput | null;
};

export type UpdateDocumentAnalysisMutation = {
  updateDocumentAnalysis?: {
    __typename: 'DocumentAnalysis';
    id: string;
    entityId: string;
    fileKey: string;
    status: DocumentAnalysisStatus;
    expenseStatus?: DocumentAnalysisStatus | null;
    queryStatus?: DocumentAnalysisStatus | null;
    matchedContactId?: string | null;
    matchedContact?: {
      __typename: 'Contact';
      id: string;
      entityId: string;
      xeroTenantId?: string | null;
      entityType?: EntityType | null;
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
      mobile?: string | null;
      phone?: string | null;
      taxNumber?: string | null;
      companyNumber?: string | null;
      name?: string | null;
      legalName?: string | null;
      companyName?: string | null;
      searchName?: string | null;
      status?: ContactStatus | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      contactType?: ContactType | null;
      bank?: {
        __typename: 'ContactBankAccount';
        id?: string | null;
        accountName?: string | null;
        bankName?: string | null;
        accountNumber: string;
        routingNumber: string;
        holderType?: BankHolderType | null;
        accountType?: BankAccountType | null;
        country?: string | null;
      } | null;
      bpay?: {
        __typename: 'ContactBpay';
        billerCode?: number | null;
        referenceNumber?: string | null;
      } | null;
      bulkUploadFileKey?: string | null;
      owner?: string | null;
    } | null;
    matchedEntityId?: string | null;
    matchedEntity?: {
      __typename: 'Entity';
      id: string;
      type: EntityType;
      taxNumber?: string | null;
      companyNumber?: string | null;
      billerCode?: number | null;
      name: string;
      legalName?: string | null;
      searchName?: string | null;
      address?: {
        __typename: 'Address';
        addressId?: string | null;
        placeId?: string | null;
        contactName?: string | null;
        contactNumber?: string | null;
        addressFull?: string | null;
        address1?: string | null;
        address2?: string | null;
        unitNumber?: string | null;
        streetNumber?: string | null;
        streetName?: string | null;
        streetType?: string | null;
        city: string;
        country: string;
        countryCode?: string | null;
        state: string;
        stateCode?: string | null;
        postalCode: string;
      } | null;
      logo?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      entityBeneficialOwners?: {
        __typename: 'ModelEntityBeneficialOwnerConnection';
        items?: Array<{
          __typename: 'EntityBeneficialOwner';
          entityId: string;
          beneficialOwnerId: string;
          beneficialOwner?: {
            __typename: 'BeneficialOwner';
            id: string;
            firstName?: string | null;
            lastName?: string | null;
            name?: string | null;
            providerEntityId: string;
            verificationStatus: VerificationStatus;
            verificationAttempt?: number | null;
            createdBy?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
          } | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          owner?: string | null;
        } | null> | null;
        nextToken?: string | null;
      } | null;
      entityUsers?: {
        __typename: 'ModelEntityUserConnection';
        items: Array<{
          __typename: 'EntityUser';
          id: string;
          entityId: string;
          userId: string;
          invitedEmail?: string | null;
          referredBy?: string | null;
          invitedEntityId?: string | null;
          firmEntityId?: string | null;
          firstName?: string | null;
          lastName?: string | null;
          role?: EntityUserRole | null;
          paymentsEnabled?: boolean | null;
          entitySearchName?: string | null;
          entity?: {
            __typename: 'Entity';
            id: string;
            type: EntityType;
            taxNumber?: string | null;
            companyNumber?: string | null;
            billerCode?: number | null;
            name: string;
            legalName?: string | null;
            searchName?: string | null;
            address?: {
              __typename: 'Address';
              addressId?: string | null;
              placeId?: string | null;
              contactName?: string | null;
              contactNumber?: string | null;
              addressFull?: string | null;
              address1?: string | null;
              address2?: string | null;
              unitNumber?: string | null;
              streetNumber?: string | null;
              streetName?: string | null;
              streetType?: string | null;
              city: string;
              country: string;
              countryCode?: string | null;
              state: string;
              stateCode?: string | null;
              postalCode: string;
            } | null;
            logo?: {
              __typename: 'Image';
              alt?: string | null;
              identityId?: string | null;
              key: string;
              level: S3UploadLevel;
              type?: string | null;
            } | null;
            entityBeneficialOwners?: {
              __typename: 'ModelEntityBeneficialOwnerConnection';
              items?: Array<{
                __typename: 'EntityBeneficialOwner';
                entityId: string;
                beneficialOwnerId: string;
                createdAt?: string | null;
                updatedAt?: string | null;
                owner?: string | null;
              } | null> | null;
              nextToken?: string | null;
            } | null;
            entityUsers?: {
              __typename: 'ModelEntityUserConnection';
              items: Array<{
                __typename: 'EntityUser';
                id: string;
                entityId: string;
                userId: string;
                invitedEmail?: string | null;
                referredBy?: string | null;
                invitedEntityId?: string | null;
                firmEntityId?: string | null;
                firstName?: string | null;
                lastName?: string | null;
                role?: EntityUserRole | null;
                paymentsEnabled?: boolean | null;
                entitySearchName?: string | null;
                searchName?: string | null;
                createdBy?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                status?: EntityUserStatus | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            gstRegistered?: boolean | null;
            providerEntityId?: string | null;
            providerCompanyId?: string | null;
            providerBillUserCompanyId?: string | null;
            providerBankAccountId?: string | null;
            providerDigitalWalletId?: string | null;
            providerBpayCrn?: string | null;
            contact?: {
              __typename: 'EntityContact';
              firstName?: string | null;
              lastName?: string | null;
              email?: string | null;
              phone?: string | null;
              role?: string | null;
            } | null;
            paymentMethods?: {
              __typename: 'ModelPaymentMethodConnection';
              items: Array<{
                __typename: 'PaymentMethod';
                id: string;
                paymentMethodType: PaymentMethodType;
                type?: string | null;
                fullName?: string | null;
                number?: string | null;
                expMonth?: string | null;
                expYear?: string | null;
                accountName?: string | null;
                bankName?: string | null;
                accountNumber?: string | null;
                routingNumber?: string | null;
                holderType?: BankHolderType | null;
                accountType?: BankAccountType | null;
                status?: PaymentMethodStatus | null;
                accountDirection?: AccountDirection | null;
                expiresAt?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            paymentMethodId?: string | null;
            paymentUserId?: string | null;
            disbursementMethodId?: string | null;
            receivingAccounts?: {
              __typename: 'ModelPaymentMethodConnection';
              items: Array<{
                __typename: 'PaymentMethod';
                id: string;
                paymentMethodType: PaymentMethodType;
                type?: string | null;
                fullName?: string | null;
                number?: string | null;
                expMonth?: string | null;
                expYear?: string | null;
                accountName?: string | null;
                bankName?: string | null;
                accountNumber?: string | null;
                routingNumber?: string | null;
                holderType?: BankHolderType | null;
                accountType?: BankAccountType | null;
                status?: PaymentMethodStatus | null;
                accountDirection?: AccountDirection | null;
                expiresAt?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            ubosCreated?: boolean | null;
            numUbosCreated?: number | null;
            subCategory?: string | null;
            clientsStatus?: EntityClientsStatus | null;
            ocrEmail?: string | null;
            verificationStatus?: VerificationStatus | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            owner: string;
            referredBy?: string | null;
            xeroContactSyncStatus?: XeroSyncStatus | null;
            xeroLastContactSyncAt?: string | null;
            xeroInvoiceSyncStatus?: XeroSyncStatus | null;
            xeroLastInvoiceSyncAt?: string | null;
            xeroTenantId?: string | null;
          } | null;
          searchName?: string | null;
          createdBy?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          status?: EntityUserStatus | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      gstRegistered?: boolean | null;
      providerEntityId?: string | null;
      providerCompanyId?: string | null;
      providerBillUserCompanyId?: string | null;
      providerBankAccountId?: string | null;
      providerDigitalWalletId?: string | null;
      providerBpayCrn?: string | null;
      contact?: {
        __typename: 'EntityContact';
        firstName?: string | null;
        lastName?: string | null;
        email?: string | null;
        phone?: string | null;
        role?: string | null;
      } | null;
      paymentMethods?: {
        __typename: 'ModelPaymentMethodConnection';
        items: Array<{
          __typename: 'PaymentMethod';
          id: string;
          paymentMethodType: PaymentMethodType;
          type?: string | null;
          fullName?: string | null;
          number?: string | null;
          expMonth?: string | null;
          expYear?: string | null;
          accountName?: string | null;
          bankName?: string | null;
          accountNumber?: string | null;
          routingNumber?: string | null;
          holderType?: BankHolderType | null;
          accountType?: BankAccountType | null;
          status?: PaymentMethodStatus | null;
          accountDirection?: AccountDirection | null;
          expiresAt?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      paymentMethodId?: string | null;
      paymentUserId?: string | null;
      disbursementMethodId?: string | null;
      receivingAccounts?: {
        __typename: 'ModelPaymentMethodConnection';
        items: Array<{
          __typename: 'PaymentMethod';
          id: string;
          paymentMethodType: PaymentMethodType;
          type?: string | null;
          fullName?: string | null;
          number?: string | null;
          expMonth?: string | null;
          expYear?: string | null;
          accountName?: string | null;
          bankName?: string | null;
          accountNumber?: string | null;
          routingNumber?: string | null;
          holderType?: BankHolderType | null;
          accountType?: BankAccountType | null;
          status?: PaymentMethodStatus | null;
          accountDirection?: AccountDirection | null;
          expiresAt?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      ubosCreated?: boolean | null;
      numUbosCreated?: number | null;
      subCategory?: string | null;
      clientsStatus?: EntityClientsStatus | null;
      ocrEmail?: string | null;
      verificationStatus?: VerificationStatus | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      owner: string;
      referredBy?: string | null;
      xeroContactSyncStatus?: XeroSyncStatus | null;
      xeroLastContactSyncAt?: string | null;
      xeroInvoiceSyncStatus?: XeroSyncStatus | null;
      xeroLastInvoiceSyncAt?: string | null;
      xeroTenantId?: string | null;
    } | null;
    newContact?: {
      __typename: 'DocumentAnalysisContact';
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
      phone?: string | null;
      companyName?: string | null;
      taxNumber?: string | null;
    } | null;
    task?: {
      __typename: 'DocumentAnalysisTask';
      reference?: string | null;
      dueAt?: string | null;
      gstInclusive?: boolean | null;
      notes?: string | null;
      amount?: number | null;
      gstAmount?: number | null;
      lineItems?: Array<{
        __typename: 'DocumentAnalysisLineItem';
        description?: string | null;
        quantity?: number | null;
        unitPrice?: number | null;
        price?: number | null;
        productCode?: string | null;
      } | null> | null;
      numberOfPayments?: number | null;
      paymentFrequency?: PaymentFrequency | null;
      shippingAmount?: number | null;
    } | null;
    bpay?: {
      __typename: 'ContactBpay';
      billerCode?: number | null;
      referenceNumber?: string | null;
    } | null;
    bank?: {
      __typename: 'DocumentAnalysisBankAccount';
      accountNumber?: string | null;
      routingNumber?: string | null;
    } | null;
    source?: DocumentAnalysisSource | null;
    createdBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null;
};

export type CreateEntityMutationVariables = {
  input: CreateEntityInput;
};

export type CreateEntityMutation = {
  createEntity?: {
    __typename: 'Entity';
    id: string;
    type: EntityType;
    taxNumber?: string | null;
    companyNumber?: string | null;
    billerCode?: number | null;
    name: string;
    legalName?: string | null;
    searchName?: string | null;
    address?: {
      __typename: 'Address';
      addressId?: string | null;
      placeId?: string | null;
      contactName?: string | null;
      contactNumber?: string | null;
      addressFull?: string | null;
      address1?: string | null;
      address2?: string | null;
      unitNumber?: string | null;
      streetNumber?: string | null;
      streetName?: string | null;
      streetType?: string | null;
      city: string;
      country: string;
      countryCode?: string | null;
      state: string;
      stateCode?: string | null;
      postalCode: string;
    } | null;
    logo?: {
      __typename: 'Image';
      alt?: string | null;
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type?: string | null;
    } | null;
    entityBeneficialOwners?: {
      __typename: 'ModelEntityBeneficialOwnerConnection';
      items?: Array<{
        __typename: 'EntityBeneficialOwner';
        entityId: string;
        beneficialOwnerId: string;
        beneficialOwner?: {
          __typename: 'BeneficialOwner';
          id: string;
          firstName?: string | null;
          lastName?: string | null;
          name?: string | null;
          providerEntityId: string;
          verificationStatus: VerificationStatus;
          verificationAttempt?: number | null;
          createdBy?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        owner?: string | null;
      } | null> | null;
      nextToken?: string | null;
    } | null;
    entityUsers?: {
      __typename: 'ModelEntityUserConnection';
      items: Array<{
        __typename: 'EntityUser';
        id: string;
        entityId: string;
        userId: string;
        invitedEmail?: string | null;
        referredBy?: string | null;
        invitedEntityId?: string | null;
        firmEntityId?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        role?: EntityUserRole | null;
        paymentsEnabled?: boolean | null;
        entitySearchName?: string | null;
        entity?: {
          __typename: 'Entity';
          id: string;
          type: EntityType;
          taxNumber?: string | null;
          companyNumber?: string | null;
          billerCode?: number | null;
          name: string;
          legalName?: string | null;
          searchName?: string | null;
          address?: {
            __typename: 'Address';
            addressId?: string | null;
            placeId?: string | null;
            contactName?: string | null;
            contactNumber?: string | null;
            addressFull?: string | null;
            address1?: string | null;
            address2?: string | null;
            unitNumber?: string | null;
            streetNumber?: string | null;
            streetName?: string | null;
            streetType?: string | null;
            city: string;
            country: string;
            countryCode?: string | null;
            state: string;
            stateCode?: string | null;
            postalCode: string;
          } | null;
          logo?: {
            __typename: 'Image';
            alt?: string | null;
            identityId?: string | null;
            key: string;
            level: S3UploadLevel;
            type?: string | null;
          } | null;
          entityBeneficialOwners?: {
            __typename: 'ModelEntityBeneficialOwnerConnection';
            items?: Array<{
              __typename: 'EntityBeneficialOwner';
              entityId: string;
              beneficialOwnerId: string;
              beneficialOwner?: {
                __typename: 'BeneficialOwner';
                id: string;
                firstName?: string | null;
                lastName?: string | null;
                name?: string | null;
                providerEntityId: string;
                verificationStatus: VerificationStatus;
                verificationAttempt?: number | null;
                createdBy?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              owner?: string | null;
            } | null> | null;
            nextToken?: string | null;
          } | null;
          entityUsers?: {
            __typename: 'ModelEntityUserConnection';
            items: Array<{
              __typename: 'EntityUser';
              id: string;
              entityId: string;
              userId: string;
              invitedEmail?: string | null;
              referredBy?: string | null;
              invitedEntityId?: string | null;
              firmEntityId?: string | null;
              firstName?: string | null;
              lastName?: string | null;
              role?: EntityUserRole | null;
              paymentsEnabled?: boolean | null;
              entitySearchName?: string | null;
              entity?: {
                __typename: 'Entity';
                id: string;
                type: EntityType;
                taxNumber?: string | null;
                companyNumber?: string | null;
                billerCode?: number | null;
                name: string;
                legalName?: string | null;
                searchName?: string | null;
                gstRegistered?: boolean | null;
                providerEntityId?: string | null;
                providerCompanyId?: string | null;
                providerBillUserCompanyId?: string | null;
                providerBankAccountId?: string | null;
                providerDigitalWalletId?: string | null;
                providerBpayCrn?: string | null;
                paymentMethodId?: string | null;
                paymentUserId?: string | null;
                disbursementMethodId?: string | null;
                ubosCreated?: boolean | null;
                numUbosCreated?: number | null;
                subCategory?: string | null;
                clientsStatus?: EntityClientsStatus | null;
                ocrEmail?: string | null;
                verificationStatus?: VerificationStatus | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                owner: string;
                referredBy?: string | null;
                xeroContactSyncStatus?: XeroSyncStatus | null;
                xeroLastContactSyncAt?: string | null;
                xeroInvoiceSyncStatus?: XeroSyncStatus | null;
                xeroLastInvoiceSyncAt?: string | null;
                xeroTenantId?: string | null;
              } | null;
              searchName?: string | null;
              createdBy?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              status?: EntityUserStatus | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          gstRegistered?: boolean | null;
          providerEntityId?: string | null;
          providerCompanyId?: string | null;
          providerBillUserCompanyId?: string | null;
          providerBankAccountId?: string | null;
          providerDigitalWalletId?: string | null;
          providerBpayCrn?: string | null;
          contact?: {
            __typename: 'EntityContact';
            firstName?: string | null;
            lastName?: string | null;
            email?: string | null;
            phone?: string | null;
            role?: string | null;
          } | null;
          paymentMethods?: {
            __typename: 'ModelPaymentMethodConnection';
            items: Array<{
              __typename: 'PaymentMethod';
              id: string;
              paymentMethodType: PaymentMethodType;
              type?: string | null;
              fullName?: string | null;
              number?: string | null;
              expMonth?: string | null;
              expYear?: string | null;
              accountName?: string | null;
              bankName?: string | null;
              accountNumber?: string | null;
              routingNumber?: string | null;
              holderType?: BankHolderType | null;
              accountType?: BankAccountType | null;
              status?: PaymentMethodStatus | null;
              accountDirection?: AccountDirection | null;
              expiresAt?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          paymentMethodId?: string | null;
          paymentUserId?: string | null;
          disbursementMethodId?: string | null;
          receivingAccounts?: {
            __typename: 'ModelPaymentMethodConnection';
            items: Array<{
              __typename: 'PaymentMethod';
              id: string;
              paymentMethodType: PaymentMethodType;
              type?: string | null;
              fullName?: string | null;
              number?: string | null;
              expMonth?: string | null;
              expYear?: string | null;
              accountName?: string | null;
              bankName?: string | null;
              accountNumber?: string | null;
              routingNumber?: string | null;
              holderType?: BankHolderType | null;
              accountType?: BankAccountType | null;
              status?: PaymentMethodStatus | null;
              accountDirection?: AccountDirection | null;
              expiresAt?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          ubosCreated?: boolean | null;
          numUbosCreated?: number | null;
          subCategory?: string | null;
          clientsStatus?: EntityClientsStatus | null;
          ocrEmail?: string | null;
          verificationStatus?: VerificationStatus | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          owner: string;
          referredBy?: string | null;
          xeroContactSyncStatus?: XeroSyncStatus | null;
          xeroLastContactSyncAt?: string | null;
          xeroInvoiceSyncStatus?: XeroSyncStatus | null;
          xeroLastInvoiceSyncAt?: string | null;
          xeroTenantId?: string | null;
        } | null;
        searchName?: string | null;
        createdBy?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        status?: EntityUserStatus | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    gstRegistered?: boolean | null;
    providerEntityId?: string | null;
    providerCompanyId?: string | null;
    providerBillUserCompanyId?: string | null;
    providerBankAccountId?: string | null;
    providerDigitalWalletId?: string | null;
    providerBpayCrn?: string | null;
    contact?: {
      __typename: 'EntityContact';
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
      phone?: string | null;
      role?: string | null;
    } | null;
    paymentMethods?: {
      __typename: 'ModelPaymentMethodConnection';
      items: Array<{
        __typename: 'PaymentMethod';
        id: string;
        paymentMethodType: PaymentMethodType;
        type?: string | null;
        fullName?: string | null;
        number?: string | null;
        expMonth?: string | null;
        expYear?: string | null;
        accountName?: string | null;
        bankName?: string | null;
        accountNumber?: string | null;
        routingNumber?: string | null;
        holderType?: BankHolderType | null;
        accountType?: BankAccountType | null;
        status?: PaymentMethodStatus | null;
        accountDirection?: AccountDirection | null;
        expiresAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    paymentMethodId?: string | null;
    paymentUserId?: string | null;
    disbursementMethodId?: string | null;
    receivingAccounts?: {
      __typename: 'ModelPaymentMethodConnection';
      items: Array<{
        __typename: 'PaymentMethod';
        id: string;
        paymentMethodType: PaymentMethodType;
        type?: string | null;
        fullName?: string | null;
        number?: string | null;
        expMonth?: string | null;
        expYear?: string | null;
        accountName?: string | null;
        bankName?: string | null;
        accountNumber?: string | null;
        routingNumber?: string | null;
        holderType?: BankHolderType | null;
        accountType?: BankAccountType | null;
        status?: PaymentMethodStatus | null;
        accountDirection?: AccountDirection | null;
        expiresAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    ubosCreated?: boolean | null;
    numUbosCreated?: number | null;
    subCategory?: string | null;
    clientsStatus?: EntityClientsStatus | null;
    ocrEmail?: string | null;
    verificationStatus?: VerificationStatus | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    owner: string;
    referredBy?: string | null;
    xeroContactSyncStatus?: XeroSyncStatus | null;
    xeroLastContactSyncAt?: string | null;
    xeroInvoiceSyncStatus?: XeroSyncStatus | null;
    xeroLastInvoiceSyncAt?: string | null;
    xeroTenantId?: string | null;
  } | null;
};

export type UpdateEntityMutationVariables = {
  input: UpdateEntityInput;
};

export type UpdateEntityMutation = {
  updateEntity?: {
    __typename: 'Entity';
    id: string;
    type: EntityType;
    taxNumber?: string | null;
    companyNumber?: string | null;
    billerCode?: number | null;
    name: string;
    legalName?: string | null;
    searchName?: string | null;
    address?: {
      __typename: 'Address';
      addressId?: string | null;
      placeId?: string | null;
      contactName?: string | null;
      contactNumber?: string | null;
      addressFull?: string | null;
      address1?: string | null;
      address2?: string | null;
      unitNumber?: string | null;
      streetNumber?: string | null;
      streetName?: string | null;
      streetType?: string | null;
      city: string;
      country: string;
      countryCode?: string | null;
      state: string;
      stateCode?: string | null;
      postalCode: string;
    } | null;
    logo?: {
      __typename: 'Image';
      alt?: string | null;
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type?: string | null;
    } | null;
    entityBeneficialOwners?: {
      __typename: 'ModelEntityBeneficialOwnerConnection';
      items?: Array<{
        __typename: 'EntityBeneficialOwner';
        entityId: string;
        beneficialOwnerId: string;
        beneficialOwner?: {
          __typename: 'BeneficialOwner';
          id: string;
          firstName?: string | null;
          lastName?: string | null;
          name?: string | null;
          providerEntityId: string;
          verificationStatus: VerificationStatus;
          verificationAttempt?: number | null;
          createdBy?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        owner?: string | null;
      } | null> | null;
      nextToken?: string | null;
    } | null;
    entityUsers?: {
      __typename: 'ModelEntityUserConnection';
      items: Array<{
        __typename: 'EntityUser';
        id: string;
        entityId: string;
        userId: string;
        invitedEmail?: string | null;
        referredBy?: string | null;
        invitedEntityId?: string | null;
        firmEntityId?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        role?: EntityUserRole | null;
        paymentsEnabled?: boolean | null;
        entitySearchName?: string | null;
        entity?: {
          __typename: 'Entity';
          id: string;
          type: EntityType;
          taxNumber?: string | null;
          companyNumber?: string | null;
          billerCode?: number | null;
          name: string;
          legalName?: string | null;
          searchName?: string | null;
          address?: {
            __typename: 'Address';
            addressId?: string | null;
            placeId?: string | null;
            contactName?: string | null;
            contactNumber?: string | null;
            addressFull?: string | null;
            address1?: string | null;
            address2?: string | null;
            unitNumber?: string | null;
            streetNumber?: string | null;
            streetName?: string | null;
            streetType?: string | null;
            city: string;
            country: string;
            countryCode?: string | null;
            state: string;
            stateCode?: string | null;
            postalCode: string;
          } | null;
          logo?: {
            __typename: 'Image';
            alt?: string | null;
            identityId?: string | null;
            key: string;
            level: S3UploadLevel;
            type?: string | null;
          } | null;
          entityBeneficialOwners?: {
            __typename: 'ModelEntityBeneficialOwnerConnection';
            items?: Array<{
              __typename: 'EntityBeneficialOwner';
              entityId: string;
              beneficialOwnerId: string;
              beneficialOwner?: {
                __typename: 'BeneficialOwner';
                id: string;
                firstName?: string | null;
                lastName?: string | null;
                name?: string | null;
                providerEntityId: string;
                verificationStatus: VerificationStatus;
                verificationAttempt?: number | null;
                createdBy?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              owner?: string | null;
            } | null> | null;
            nextToken?: string | null;
          } | null;
          entityUsers?: {
            __typename: 'ModelEntityUserConnection';
            items: Array<{
              __typename: 'EntityUser';
              id: string;
              entityId: string;
              userId: string;
              invitedEmail?: string | null;
              referredBy?: string | null;
              invitedEntityId?: string | null;
              firmEntityId?: string | null;
              firstName?: string | null;
              lastName?: string | null;
              role?: EntityUserRole | null;
              paymentsEnabled?: boolean | null;
              entitySearchName?: string | null;
              entity?: {
                __typename: 'Entity';
                id: string;
                type: EntityType;
                taxNumber?: string | null;
                companyNumber?: string | null;
                billerCode?: number | null;
                name: string;
                legalName?: string | null;
                searchName?: string | null;
                gstRegistered?: boolean | null;
                providerEntityId?: string | null;
                providerCompanyId?: string | null;
                providerBillUserCompanyId?: string | null;
                providerBankAccountId?: string | null;
                providerDigitalWalletId?: string | null;
                providerBpayCrn?: string | null;
                paymentMethodId?: string | null;
                paymentUserId?: string | null;
                disbursementMethodId?: string | null;
                ubosCreated?: boolean | null;
                numUbosCreated?: number | null;
                subCategory?: string | null;
                clientsStatus?: EntityClientsStatus | null;
                ocrEmail?: string | null;
                verificationStatus?: VerificationStatus | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                owner: string;
                referredBy?: string | null;
                xeroContactSyncStatus?: XeroSyncStatus | null;
                xeroLastContactSyncAt?: string | null;
                xeroInvoiceSyncStatus?: XeroSyncStatus | null;
                xeroLastInvoiceSyncAt?: string | null;
                xeroTenantId?: string | null;
              } | null;
              searchName?: string | null;
              createdBy?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              status?: EntityUserStatus | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          gstRegistered?: boolean | null;
          providerEntityId?: string | null;
          providerCompanyId?: string | null;
          providerBillUserCompanyId?: string | null;
          providerBankAccountId?: string | null;
          providerDigitalWalletId?: string | null;
          providerBpayCrn?: string | null;
          contact?: {
            __typename: 'EntityContact';
            firstName?: string | null;
            lastName?: string | null;
            email?: string | null;
            phone?: string | null;
            role?: string | null;
          } | null;
          paymentMethods?: {
            __typename: 'ModelPaymentMethodConnection';
            items: Array<{
              __typename: 'PaymentMethod';
              id: string;
              paymentMethodType: PaymentMethodType;
              type?: string | null;
              fullName?: string | null;
              number?: string | null;
              expMonth?: string | null;
              expYear?: string | null;
              accountName?: string | null;
              bankName?: string | null;
              accountNumber?: string | null;
              routingNumber?: string | null;
              holderType?: BankHolderType | null;
              accountType?: BankAccountType | null;
              status?: PaymentMethodStatus | null;
              accountDirection?: AccountDirection | null;
              expiresAt?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          paymentMethodId?: string | null;
          paymentUserId?: string | null;
          disbursementMethodId?: string | null;
          receivingAccounts?: {
            __typename: 'ModelPaymentMethodConnection';
            items: Array<{
              __typename: 'PaymentMethod';
              id: string;
              paymentMethodType: PaymentMethodType;
              type?: string | null;
              fullName?: string | null;
              number?: string | null;
              expMonth?: string | null;
              expYear?: string | null;
              accountName?: string | null;
              bankName?: string | null;
              accountNumber?: string | null;
              routingNumber?: string | null;
              holderType?: BankHolderType | null;
              accountType?: BankAccountType | null;
              status?: PaymentMethodStatus | null;
              accountDirection?: AccountDirection | null;
              expiresAt?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          ubosCreated?: boolean | null;
          numUbosCreated?: number | null;
          subCategory?: string | null;
          clientsStatus?: EntityClientsStatus | null;
          ocrEmail?: string | null;
          verificationStatus?: VerificationStatus | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          owner: string;
          referredBy?: string | null;
          xeroContactSyncStatus?: XeroSyncStatus | null;
          xeroLastContactSyncAt?: string | null;
          xeroInvoiceSyncStatus?: XeroSyncStatus | null;
          xeroLastInvoiceSyncAt?: string | null;
          xeroTenantId?: string | null;
        } | null;
        searchName?: string | null;
        createdBy?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        status?: EntityUserStatus | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    gstRegistered?: boolean | null;
    providerEntityId?: string | null;
    providerCompanyId?: string | null;
    providerBillUserCompanyId?: string | null;
    providerBankAccountId?: string | null;
    providerDigitalWalletId?: string | null;
    providerBpayCrn?: string | null;
    contact?: {
      __typename: 'EntityContact';
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
      phone?: string | null;
      role?: string | null;
    } | null;
    paymentMethods?: {
      __typename: 'ModelPaymentMethodConnection';
      items: Array<{
        __typename: 'PaymentMethod';
        id: string;
        paymentMethodType: PaymentMethodType;
        type?: string | null;
        fullName?: string | null;
        number?: string | null;
        expMonth?: string | null;
        expYear?: string | null;
        accountName?: string | null;
        bankName?: string | null;
        accountNumber?: string | null;
        routingNumber?: string | null;
        holderType?: BankHolderType | null;
        accountType?: BankAccountType | null;
        status?: PaymentMethodStatus | null;
        accountDirection?: AccountDirection | null;
        expiresAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    paymentMethodId?: string | null;
    paymentUserId?: string | null;
    disbursementMethodId?: string | null;
    receivingAccounts?: {
      __typename: 'ModelPaymentMethodConnection';
      items: Array<{
        __typename: 'PaymentMethod';
        id: string;
        paymentMethodType: PaymentMethodType;
        type?: string | null;
        fullName?: string | null;
        number?: string | null;
        expMonth?: string | null;
        expYear?: string | null;
        accountName?: string | null;
        bankName?: string | null;
        accountNumber?: string | null;
        routingNumber?: string | null;
        holderType?: BankHolderType | null;
        accountType?: BankAccountType | null;
        status?: PaymentMethodStatus | null;
        accountDirection?: AccountDirection | null;
        expiresAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    ubosCreated?: boolean | null;
    numUbosCreated?: number | null;
    subCategory?: string | null;
    clientsStatus?: EntityClientsStatus | null;
    ocrEmail?: string | null;
    verificationStatus?: VerificationStatus | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    owner: string;
    referredBy?: string | null;
    xeroContactSyncStatus?: XeroSyncStatus | null;
    xeroLastContactSyncAt?: string | null;
    xeroInvoiceSyncStatus?: XeroSyncStatus | null;
    xeroLastInvoiceSyncAt?: string | null;
    xeroTenantId?: string | null;
  } | null;
};

export type RegenerateEntityOcrEmailMutationVariables = {
  input: RegenerateEntityOcrEmailInput;
};

export type RegenerateEntityOcrEmailMutation = {
  regenerateEntityOcrEmail?: {
    __typename: 'Entity';
    id: string;
    type: EntityType;
    taxNumber?: string | null;
    companyNumber?: string | null;
    billerCode?: number | null;
    name: string;
    legalName?: string | null;
    searchName?: string | null;
    address?: {
      __typename: 'Address';
      addressId?: string | null;
      placeId?: string | null;
      contactName?: string | null;
      contactNumber?: string | null;
      addressFull?: string | null;
      address1?: string | null;
      address2?: string | null;
      unitNumber?: string | null;
      streetNumber?: string | null;
      streetName?: string | null;
      streetType?: string | null;
      city: string;
      country: string;
      countryCode?: string | null;
      state: string;
      stateCode?: string | null;
      postalCode: string;
    } | null;
    logo?: {
      __typename: 'Image';
      alt?: string | null;
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type?: string | null;
    } | null;
    entityBeneficialOwners?: {
      __typename: 'ModelEntityBeneficialOwnerConnection';
      items?: Array<{
        __typename: 'EntityBeneficialOwner';
        entityId: string;
        beneficialOwnerId: string;
        beneficialOwner?: {
          __typename: 'BeneficialOwner';
          id: string;
          firstName?: string | null;
          lastName?: string | null;
          name?: string | null;
          providerEntityId: string;
          verificationStatus: VerificationStatus;
          verificationAttempt?: number | null;
          createdBy?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        owner?: string | null;
      } | null> | null;
      nextToken?: string | null;
    } | null;
    entityUsers?: {
      __typename: 'ModelEntityUserConnection';
      items: Array<{
        __typename: 'EntityUser';
        id: string;
        entityId: string;
        userId: string;
        invitedEmail?: string | null;
        referredBy?: string | null;
        invitedEntityId?: string | null;
        firmEntityId?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        role?: EntityUserRole | null;
        paymentsEnabled?: boolean | null;
        entitySearchName?: string | null;
        entity?: {
          __typename: 'Entity';
          id: string;
          type: EntityType;
          taxNumber?: string | null;
          companyNumber?: string | null;
          billerCode?: number | null;
          name: string;
          legalName?: string | null;
          searchName?: string | null;
          address?: {
            __typename: 'Address';
            addressId?: string | null;
            placeId?: string | null;
            contactName?: string | null;
            contactNumber?: string | null;
            addressFull?: string | null;
            address1?: string | null;
            address2?: string | null;
            unitNumber?: string | null;
            streetNumber?: string | null;
            streetName?: string | null;
            streetType?: string | null;
            city: string;
            country: string;
            countryCode?: string | null;
            state: string;
            stateCode?: string | null;
            postalCode: string;
          } | null;
          logo?: {
            __typename: 'Image';
            alt?: string | null;
            identityId?: string | null;
            key: string;
            level: S3UploadLevel;
            type?: string | null;
          } | null;
          entityBeneficialOwners?: {
            __typename: 'ModelEntityBeneficialOwnerConnection';
            items?: Array<{
              __typename: 'EntityBeneficialOwner';
              entityId: string;
              beneficialOwnerId: string;
              beneficialOwner?: {
                __typename: 'BeneficialOwner';
                id: string;
                firstName?: string | null;
                lastName?: string | null;
                name?: string | null;
                providerEntityId: string;
                verificationStatus: VerificationStatus;
                verificationAttempt?: number | null;
                createdBy?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              owner?: string | null;
            } | null> | null;
            nextToken?: string | null;
          } | null;
          entityUsers?: {
            __typename: 'ModelEntityUserConnection';
            items: Array<{
              __typename: 'EntityUser';
              id: string;
              entityId: string;
              userId: string;
              invitedEmail?: string | null;
              referredBy?: string | null;
              invitedEntityId?: string | null;
              firmEntityId?: string | null;
              firstName?: string | null;
              lastName?: string | null;
              role?: EntityUserRole | null;
              paymentsEnabled?: boolean | null;
              entitySearchName?: string | null;
              entity?: {
                __typename: 'Entity';
                id: string;
                type: EntityType;
                taxNumber?: string | null;
                companyNumber?: string | null;
                billerCode?: number | null;
                name: string;
                legalName?: string | null;
                searchName?: string | null;
                gstRegistered?: boolean | null;
                providerEntityId?: string | null;
                providerCompanyId?: string | null;
                providerBillUserCompanyId?: string | null;
                providerBankAccountId?: string | null;
                providerDigitalWalletId?: string | null;
                providerBpayCrn?: string | null;
                paymentMethodId?: string | null;
                paymentUserId?: string | null;
                disbursementMethodId?: string | null;
                ubosCreated?: boolean | null;
                numUbosCreated?: number | null;
                subCategory?: string | null;
                clientsStatus?: EntityClientsStatus | null;
                ocrEmail?: string | null;
                verificationStatus?: VerificationStatus | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                owner: string;
                referredBy?: string | null;
                xeroContactSyncStatus?: XeroSyncStatus | null;
                xeroLastContactSyncAt?: string | null;
                xeroInvoiceSyncStatus?: XeroSyncStatus | null;
                xeroLastInvoiceSyncAt?: string | null;
                xeroTenantId?: string | null;
              } | null;
              searchName?: string | null;
              createdBy?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              status?: EntityUserStatus | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          gstRegistered?: boolean | null;
          providerEntityId?: string | null;
          providerCompanyId?: string | null;
          providerBillUserCompanyId?: string | null;
          providerBankAccountId?: string | null;
          providerDigitalWalletId?: string | null;
          providerBpayCrn?: string | null;
          contact?: {
            __typename: 'EntityContact';
            firstName?: string | null;
            lastName?: string | null;
            email?: string | null;
            phone?: string | null;
            role?: string | null;
          } | null;
          paymentMethods?: {
            __typename: 'ModelPaymentMethodConnection';
            items: Array<{
              __typename: 'PaymentMethod';
              id: string;
              paymentMethodType: PaymentMethodType;
              type?: string | null;
              fullName?: string | null;
              number?: string | null;
              expMonth?: string | null;
              expYear?: string | null;
              accountName?: string | null;
              bankName?: string | null;
              accountNumber?: string | null;
              routingNumber?: string | null;
              holderType?: BankHolderType | null;
              accountType?: BankAccountType | null;
              status?: PaymentMethodStatus | null;
              accountDirection?: AccountDirection | null;
              expiresAt?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          paymentMethodId?: string | null;
          paymentUserId?: string | null;
          disbursementMethodId?: string | null;
          receivingAccounts?: {
            __typename: 'ModelPaymentMethodConnection';
            items: Array<{
              __typename: 'PaymentMethod';
              id: string;
              paymentMethodType: PaymentMethodType;
              type?: string | null;
              fullName?: string | null;
              number?: string | null;
              expMonth?: string | null;
              expYear?: string | null;
              accountName?: string | null;
              bankName?: string | null;
              accountNumber?: string | null;
              routingNumber?: string | null;
              holderType?: BankHolderType | null;
              accountType?: BankAccountType | null;
              status?: PaymentMethodStatus | null;
              accountDirection?: AccountDirection | null;
              expiresAt?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          ubosCreated?: boolean | null;
          numUbosCreated?: number | null;
          subCategory?: string | null;
          clientsStatus?: EntityClientsStatus | null;
          ocrEmail?: string | null;
          verificationStatus?: VerificationStatus | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          owner: string;
          referredBy?: string | null;
          xeroContactSyncStatus?: XeroSyncStatus | null;
          xeroLastContactSyncAt?: string | null;
          xeroInvoiceSyncStatus?: XeroSyncStatus | null;
          xeroLastInvoiceSyncAt?: string | null;
          xeroTenantId?: string | null;
        } | null;
        searchName?: string | null;
        createdBy?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        status?: EntityUserStatus | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    gstRegistered?: boolean | null;
    providerEntityId?: string | null;
    providerCompanyId?: string | null;
    providerBillUserCompanyId?: string | null;
    providerBankAccountId?: string | null;
    providerDigitalWalletId?: string | null;
    providerBpayCrn?: string | null;
    contact?: {
      __typename: 'EntityContact';
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
      phone?: string | null;
      role?: string | null;
    } | null;
    paymentMethods?: {
      __typename: 'ModelPaymentMethodConnection';
      items: Array<{
        __typename: 'PaymentMethod';
        id: string;
        paymentMethodType: PaymentMethodType;
        type?: string | null;
        fullName?: string | null;
        number?: string | null;
        expMonth?: string | null;
        expYear?: string | null;
        accountName?: string | null;
        bankName?: string | null;
        accountNumber?: string | null;
        routingNumber?: string | null;
        holderType?: BankHolderType | null;
        accountType?: BankAccountType | null;
        status?: PaymentMethodStatus | null;
        accountDirection?: AccountDirection | null;
        expiresAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    paymentMethodId?: string | null;
    paymentUserId?: string | null;
    disbursementMethodId?: string | null;
    receivingAccounts?: {
      __typename: 'ModelPaymentMethodConnection';
      items: Array<{
        __typename: 'PaymentMethod';
        id: string;
        paymentMethodType: PaymentMethodType;
        type?: string | null;
        fullName?: string | null;
        number?: string | null;
        expMonth?: string | null;
        expYear?: string | null;
        accountName?: string | null;
        bankName?: string | null;
        accountNumber?: string | null;
        routingNumber?: string | null;
        holderType?: BankHolderType | null;
        accountType?: BankAccountType | null;
        status?: PaymentMethodStatus | null;
        accountDirection?: AccountDirection | null;
        expiresAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    ubosCreated?: boolean | null;
    numUbosCreated?: number | null;
    subCategory?: string | null;
    clientsStatus?: EntityClientsStatus | null;
    ocrEmail?: string | null;
    verificationStatus?: VerificationStatus | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    owner: string;
    referredBy?: string | null;
    xeroContactSyncStatus?: XeroSyncStatus | null;
    xeroLastContactSyncAt?: string | null;
    xeroInvoiceSyncStatus?: XeroSyncStatus | null;
    xeroLastInvoiceSyncAt?: string | null;
    xeroTenantId?: string | null;
  } | null;
};

export type DeleteEntityMutationVariables = {
  input: DeleteEntityInput;
  condition?: ModelEntityConditionInput | null;
};

export type DeleteEntityMutation = {
  deleteEntity?: {
    __typename: 'Entity';
    id: string;
    type: EntityType;
    taxNumber?: string | null;
    companyNumber?: string | null;
    billerCode?: number | null;
    name: string;
    legalName?: string | null;
    searchName?: string | null;
    address?: {
      __typename: 'Address';
      addressId?: string | null;
      placeId?: string | null;
      contactName?: string | null;
      contactNumber?: string | null;
      addressFull?: string | null;
      address1?: string | null;
      address2?: string | null;
      unitNumber?: string | null;
      streetNumber?: string | null;
      streetName?: string | null;
      streetType?: string | null;
      city: string;
      country: string;
      countryCode?: string | null;
      state: string;
      stateCode?: string | null;
      postalCode: string;
    } | null;
    logo?: {
      __typename: 'Image';
      alt?: string | null;
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type?: string | null;
    } | null;
    entityBeneficialOwners?: {
      __typename: 'ModelEntityBeneficialOwnerConnection';
      items?: Array<{
        __typename: 'EntityBeneficialOwner';
        entityId: string;
        beneficialOwnerId: string;
        beneficialOwner?: {
          __typename: 'BeneficialOwner';
          id: string;
          firstName?: string | null;
          lastName?: string | null;
          name?: string | null;
          providerEntityId: string;
          verificationStatus: VerificationStatus;
          verificationAttempt?: number | null;
          createdBy?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        owner?: string | null;
      } | null> | null;
      nextToken?: string | null;
    } | null;
    entityUsers?: {
      __typename: 'ModelEntityUserConnection';
      items: Array<{
        __typename: 'EntityUser';
        id: string;
        entityId: string;
        userId: string;
        invitedEmail?: string | null;
        referredBy?: string | null;
        invitedEntityId?: string | null;
        firmEntityId?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        role?: EntityUserRole | null;
        paymentsEnabled?: boolean | null;
        entitySearchName?: string | null;
        entity?: {
          __typename: 'Entity';
          id: string;
          type: EntityType;
          taxNumber?: string | null;
          companyNumber?: string | null;
          billerCode?: number | null;
          name: string;
          legalName?: string | null;
          searchName?: string | null;
          address?: {
            __typename: 'Address';
            addressId?: string | null;
            placeId?: string | null;
            contactName?: string | null;
            contactNumber?: string | null;
            addressFull?: string | null;
            address1?: string | null;
            address2?: string | null;
            unitNumber?: string | null;
            streetNumber?: string | null;
            streetName?: string | null;
            streetType?: string | null;
            city: string;
            country: string;
            countryCode?: string | null;
            state: string;
            stateCode?: string | null;
            postalCode: string;
          } | null;
          logo?: {
            __typename: 'Image';
            alt?: string | null;
            identityId?: string | null;
            key: string;
            level: S3UploadLevel;
            type?: string | null;
          } | null;
          entityBeneficialOwners?: {
            __typename: 'ModelEntityBeneficialOwnerConnection';
            items?: Array<{
              __typename: 'EntityBeneficialOwner';
              entityId: string;
              beneficialOwnerId: string;
              beneficialOwner?: {
                __typename: 'BeneficialOwner';
                id: string;
                firstName?: string | null;
                lastName?: string | null;
                name?: string | null;
                providerEntityId: string;
                verificationStatus: VerificationStatus;
                verificationAttempt?: number | null;
                createdBy?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              owner?: string | null;
            } | null> | null;
            nextToken?: string | null;
          } | null;
          entityUsers?: {
            __typename: 'ModelEntityUserConnection';
            items: Array<{
              __typename: 'EntityUser';
              id: string;
              entityId: string;
              userId: string;
              invitedEmail?: string | null;
              referredBy?: string | null;
              invitedEntityId?: string | null;
              firmEntityId?: string | null;
              firstName?: string | null;
              lastName?: string | null;
              role?: EntityUserRole | null;
              paymentsEnabled?: boolean | null;
              entitySearchName?: string | null;
              entity?: {
                __typename: 'Entity';
                id: string;
                type: EntityType;
                taxNumber?: string | null;
                companyNumber?: string | null;
                billerCode?: number | null;
                name: string;
                legalName?: string | null;
                searchName?: string | null;
                gstRegistered?: boolean | null;
                providerEntityId?: string | null;
                providerCompanyId?: string | null;
                providerBillUserCompanyId?: string | null;
                providerBankAccountId?: string | null;
                providerDigitalWalletId?: string | null;
                providerBpayCrn?: string | null;
                paymentMethodId?: string | null;
                paymentUserId?: string | null;
                disbursementMethodId?: string | null;
                ubosCreated?: boolean | null;
                numUbosCreated?: number | null;
                subCategory?: string | null;
                clientsStatus?: EntityClientsStatus | null;
                ocrEmail?: string | null;
                verificationStatus?: VerificationStatus | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                owner: string;
                referredBy?: string | null;
                xeroContactSyncStatus?: XeroSyncStatus | null;
                xeroLastContactSyncAt?: string | null;
                xeroInvoiceSyncStatus?: XeroSyncStatus | null;
                xeroLastInvoiceSyncAt?: string | null;
                xeroTenantId?: string | null;
              } | null;
              searchName?: string | null;
              createdBy?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              status?: EntityUserStatus | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          gstRegistered?: boolean | null;
          providerEntityId?: string | null;
          providerCompanyId?: string | null;
          providerBillUserCompanyId?: string | null;
          providerBankAccountId?: string | null;
          providerDigitalWalletId?: string | null;
          providerBpayCrn?: string | null;
          contact?: {
            __typename: 'EntityContact';
            firstName?: string | null;
            lastName?: string | null;
            email?: string | null;
            phone?: string | null;
            role?: string | null;
          } | null;
          paymentMethods?: {
            __typename: 'ModelPaymentMethodConnection';
            items: Array<{
              __typename: 'PaymentMethod';
              id: string;
              paymentMethodType: PaymentMethodType;
              type?: string | null;
              fullName?: string | null;
              number?: string | null;
              expMonth?: string | null;
              expYear?: string | null;
              accountName?: string | null;
              bankName?: string | null;
              accountNumber?: string | null;
              routingNumber?: string | null;
              holderType?: BankHolderType | null;
              accountType?: BankAccountType | null;
              status?: PaymentMethodStatus | null;
              accountDirection?: AccountDirection | null;
              expiresAt?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          paymentMethodId?: string | null;
          paymentUserId?: string | null;
          disbursementMethodId?: string | null;
          receivingAccounts?: {
            __typename: 'ModelPaymentMethodConnection';
            items: Array<{
              __typename: 'PaymentMethod';
              id: string;
              paymentMethodType: PaymentMethodType;
              type?: string | null;
              fullName?: string | null;
              number?: string | null;
              expMonth?: string | null;
              expYear?: string | null;
              accountName?: string | null;
              bankName?: string | null;
              accountNumber?: string | null;
              routingNumber?: string | null;
              holderType?: BankHolderType | null;
              accountType?: BankAccountType | null;
              status?: PaymentMethodStatus | null;
              accountDirection?: AccountDirection | null;
              expiresAt?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          ubosCreated?: boolean | null;
          numUbosCreated?: number | null;
          subCategory?: string | null;
          clientsStatus?: EntityClientsStatus | null;
          ocrEmail?: string | null;
          verificationStatus?: VerificationStatus | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          owner: string;
          referredBy?: string | null;
          xeroContactSyncStatus?: XeroSyncStatus | null;
          xeroLastContactSyncAt?: string | null;
          xeroInvoiceSyncStatus?: XeroSyncStatus | null;
          xeroLastInvoiceSyncAt?: string | null;
          xeroTenantId?: string | null;
        } | null;
        searchName?: string | null;
        createdBy?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        status?: EntityUserStatus | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    gstRegistered?: boolean | null;
    providerEntityId?: string | null;
    providerCompanyId?: string | null;
    providerBillUserCompanyId?: string | null;
    providerBankAccountId?: string | null;
    providerDigitalWalletId?: string | null;
    providerBpayCrn?: string | null;
    contact?: {
      __typename: 'EntityContact';
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
      phone?: string | null;
      role?: string | null;
    } | null;
    paymentMethods?: {
      __typename: 'ModelPaymentMethodConnection';
      items: Array<{
        __typename: 'PaymentMethod';
        id: string;
        paymentMethodType: PaymentMethodType;
        type?: string | null;
        fullName?: string | null;
        number?: string | null;
        expMonth?: string | null;
        expYear?: string | null;
        accountName?: string | null;
        bankName?: string | null;
        accountNumber?: string | null;
        routingNumber?: string | null;
        holderType?: BankHolderType | null;
        accountType?: BankAccountType | null;
        status?: PaymentMethodStatus | null;
        accountDirection?: AccountDirection | null;
        expiresAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    paymentMethodId?: string | null;
    paymentUserId?: string | null;
    disbursementMethodId?: string | null;
    receivingAccounts?: {
      __typename: 'ModelPaymentMethodConnection';
      items: Array<{
        __typename: 'PaymentMethod';
        id: string;
        paymentMethodType: PaymentMethodType;
        type?: string | null;
        fullName?: string | null;
        number?: string | null;
        expMonth?: string | null;
        expYear?: string | null;
        accountName?: string | null;
        bankName?: string | null;
        accountNumber?: string | null;
        routingNumber?: string | null;
        holderType?: BankHolderType | null;
        accountType?: BankAccountType | null;
        status?: PaymentMethodStatus | null;
        accountDirection?: AccountDirection | null;
        expiresAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    ubosCreated?: boolean | null;
    numUbosCreated?: number | null;
    subCategory?: string | null;
    clientsStatus?: EntityClientsStatus | null;
    ocrEmail?: string | null;
    verificationStatus?: VerificationStatus | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    owner: string;
    referredBy?: string | null;
    xeroContactSyncStatus?: XeroSyncStatus | null;
    xeroLastContactSyncAt?: string | null;
    xeroInvoiceSyncStatus?: XeroSyncStatus | null;
    xeroLastInvoiceSyncAt?: string | null;
    xeroTenantId?: string | null;
  } | null;
};

export type CreateEntityUserMutationVariables = {
  input: CreateEntityUserInput;
};

export type CreateEntityUserMutation = {
  createEntityUser?: {
    __typename: 'EntityUser';
    id: string;
    entityId: string;
    userId: string;
    invitedEmail?: string | null;
    referredBy?: string | null;
    invitedEntityId?: string | null;
    firmEntityId?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    role?: EntityUserRole | null;
    paymentsEnabled?: boolean | null;
    entitySearchName?: string | null;
    entity?: {
      __typename: 'Entity';
      id: string;
      type: EntityType;
      taxNumber?: string | null;
      companyNumber?: string | null;
      billerCode?: number | null;
      name: string;
      legalName?: string | null;
      searchName?: string | null;
      address?: {
        __typename: 'Address';
        addressId?: string | null;
        placeId?: string | null;
        contactName?: string | null;
        contactNumber?: string | null;
        addressFull?: string | null;
        address1?: string | null;
        address2?: string | null;
        unitNumber?: string | null;
        streetNumber?: string | null;
        streetName?: string | null;
        streetType?: string | null;
        city: string;
        country: string;
        countryCode?: string | null;
        state: string;
        stateCode?: string | null;
        postalCode: string;
      } | null;
      logo?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      entityBeneficialOwners?: {
        __typename: 'ModelEntityBeneficialOwnerConnection';
        items?: Array<{
          __typename: 'EntityBeneficialOwner';
          entityId: string;
          beneficialOwnerId: string;
          beneficialOwner?: {
            __typename: 'BeneficialOwner';
            id: string;
            firstName?: string | null;
            lastName?: string | null;
            name?: string | null;
            providerEntityId: string;
            verificationStatus: VerificationStatus;
            verificationAttempt?: number | null;
            createdBy?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
          } | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          owner?: string | null;
        } | null> | null;
        nextToken?: string | null;
      } | null;
      entityUsers?: {
        __typename: 'ModelEntityUserConnection';
        items: Array<{
          __typename: 'EntityUser';
          id: string;
          entityId: string;
          userId: string;
          invitedEmail?: string | null;
          referredBy?: string | null;
          invitedEntityId?: string | null;
          firmEntityId?: string | null;
          firstName?: string | null;
          lastName?: string | null;
          role?: EntityUserRole | null;
          paymentsEnabled?: boolean | null;
          entitySearchName?: string | null;
          entity?: {
            __typename: 'Entity';
            id: string;
            type: EntityType;
            taxNumber?: string | null;
            companyNumber?: string | null;
            billerCode?: number | null;
            name: string;
            legalName?: string | null;
            searchName?: string | null;
            address?: {
              __typename: 'Address';
              addressId?: string | null;
              placeId?: string | null;
              contactName?: string | null;
              contactNumber?: string | null;
              addressFull?: string | null;
              address1?: string | null;
              address2?: string | null;
              unitNumber?: string | null;
              streetNumber?: string | null;
              streetName?: string | null;
              streetType?: string | null;
              city: string;
              country: string;
              countryCode?: string | null;
              state: string;
              stateCode?: string | null;
              postalCode: string;
            } | null;
            logo?: {
              __typename: 'Image';
              alt?: string | null;
              identityId?: string | null;
              key: string;
              level: S3UploadLevel;
              type?: string | null;
            } | null;
            entityBeneficialOwners?: {
              __typename: 'ModelEntityBeneficialOwnerConnection';
              items?: Array<{
                __typename: 'EntityBeneficialOwner';
                entityId: string;
                beneficialOwnerId: string;
                createdAt?: string | null;
                updatedAt?: string | null;
                owner?: string | null;
              } | null> | null;
              nextToken?: string | null;
            } | null;
            entityUsers?: {
              __typename: 'ModelEntityUserConnection';
              items: Array<{
                __typename: 'EntityUser';
                id: string;
                entityId: string;
                userId: string;
                invitedEmail?: string | null;
                referredBy?: string | null;
                invitedEntityId?: string | null;
                firmEntityId?: string | null;
                firstName?: string | null;
                lastName?: string | null;
                role?: EntityUserRole | null;
                paymentsEnabled?: boolean | null;
                entitySearchName?: string | null;
                searchName?: string | null;
                createdBy?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                status?: EntityUserStatus | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            gstRegistered?: boolean | null;
            providerEntityId?: string | null;
            providerCompanyId?: string | null;
            providerBillUserCompanyId?: string | null;
            providerBankAccountId?: string | null;
            providerDigitalWalletId?: string | null;
            providerBpayCrn?: string | null;
            contact?: {
              __typename: 'EntityContact';
              firstName?: string | null;
              lastName?: string | null;
              email?: string | null;
              phone?: string | null;
              role?: string | null;
            } | null;
            paymentMethods?: {
              __typename: 'ModelPaymentMethodConnection';
              items: Array<{
                __typename: 'PaymentMethod';
                id: string;
                paymentMethodType: PaymentMethodType;
                type?: string | null;
                fullName?: string | null;
                number?: string | null;
                expMonth?: string | null;
                expYear?: string | null;
                accountName?: string | null;
                bankName?: string | null;
                accountNumber?: string | null;
                routingNumber?: string | null;
                holderType?: BankHolderType | null;
                accountType?: BankAccountType | null;
                status?: PaymentMethodStatus | null;
                accountDirection?: AccountDirection | null;
                expiresAt?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            paymentMethodId?: string | null;
            paymentUserId?: string | null;
            disbursementMethodId?: string | null;
            receivingAccounts?: {
              __typename: 'ModelPaymentMethodConnection';
              items: Array<{
                __typename: 'PaymentMethod';
                id: string;
                paymentMethodType: PaymentMethodType;
                type?: string | null;
                fullName?: string | null;
                number?: string | null;
                expMonth?: string | null;
                expYear?: string | null;
                accountName?: string | null;
                bankName?: string | null;
                accountNumber?: string | null;
                routingNumber?: string | null;
                holderType?: BankHolderType | null;
                accountType?: BankAccountType | null;
                status?: PaymentMethodStatus | null;
                accountDirection?: AccountDirection | null;
                expiresAt?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            ubosCreated?: boolean | null;
            numUbosCreated?: number | null;
            subCategory?: string | null;
            clientsStatus?: EntityClientsStatus | null;
            ocrEmail?: string | null;
            verificationStatus?: VerificationStatus | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            owner: string;
            referredBy?: string | null;
            xeroContactSyncStatus?: XeroSyncStatus | null;
            xeroLastContactSyncAt?: string | null;
            xeroInvoiceSyncStatus?: XeroSyncStatus | null;
            xeroLastInvoiceSyncAt?: string | null;
            xeroTenantId?: string | null;
          } | null;
          searchName?: string | null;
          createdBy?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          status?: EntityUserStatus | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      gstRegistered?: boolean | null;
      providerEntityId?: string | null;
      providerCompanyId?: string | null;
      providerBillUserCompanyId?: string | null;
      providerBankAccountId?: string | null;
      providerDigitalWalletId?: string | null;
      providerBpayCrn?: string | null;
      contact?: {
        __typename: 'EntityContact';
        firstName?: string | null;
        lastName?: string | null;
        email?: string | null;
        phone?: string | null;
        role?: string | null;
      } | null;
      paymentMethods?: {
        __typename: 'ModelPaymentMethodConnection';
        items: Array<{
          __typename: 'PaymentMethod';
          id: string;
          paymentMethodType: PaymentMethodType;
          type?: string | null;
          fullName?: string | null;
          number?: string | null;
          expMonth?: string | null;
          expYear?: string | null;
          accountName?: string | null;
          bankName?: string | null;
          accountNumber?: string | null;
          routingNumber?: string | null;
          holderType?: BankHolderType | null;
          accountType?: BankAccountType | null;
          status?: PaymentMethodStatus | null;
          accountDirection?: AccountDirection | null;
          expiresAt?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      paymentMethodId?: string | null;
      paymentUserId?: string | null;
      disbursementMethodId?: string | null;
      receivingAccounts?: {
        __typename: 'ModelPaymentMethodConnection';
        items: Array<{
          __typename: 'PaymentMethod';
          id: string;
          paymentMethodType: PaymentMethodType;
          type?: string | null;
          fullName?: string | null;
          number?: string | null;
          expMonth?: string | null;
          expYear?: string | null;
          accountName?: string | null;
          bankName?: string | null;
          accountNumber?: string | null;
          routingNumber?: string | null;
          holderType?: BankHolderType | null;
          accountType?: BankAccountType | null;
          status?: PaymentMethodStatus | null;
          accountDirection?: AccountDirection | null;
          expiresAt?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      ubosCreated?: boolean | null;
      numUbosCreated?: number | null;
      subCategory?: string | null;
      clientsStatus?: EntityClientsStatus | null;
      ocrEmail?: string | null;
      verificationStatus?: VerificationStatus | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      owner: string;
      referredBy?: string | null;
      xeroContactSyncStatus?: XeroSyncStatus | null;
      xeroLastContactSyncAt?: string | null;
      xeroInvoiceSyncStatus?: XeroSyncStatus | null;
      xeroLastInvoiceSyncAt?: string | null;
      xeroTenantId?: string | null;
    } | null;
    searchName?: string | null;
    createdBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    status?: EntityUserStatus | null;
  } | null;
};

export type UpdateEntityUserMutationVariables = {
  input: UpdateEntityUserInput;
};

export type UpdateEntityUserMutation = {
  updateEntityUser?: {
    __typename: 'EntityUser';
    id: string;
    entityId: string;
    userId: string;
    invitedEmail?: string | null;
    referredBy?: string | null;
    invitedEntityId?: string | null;
    firmEntityId?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    role?: EntityUserRole | null;
    paymentsEnabled?: boolean | null;
    entitySearchName?: string | null;
    entity?: {
      __typename: 'Entity';
      id: string;
      type: EntityType;
      taxNumber?: string | null;
      companyNumber?: string | null;
      billerCode?: number | null;
      name: string;
      legalName?: string | null;
      searchName?: string | null;
      address?: {
        __typename: 'Address';
        addressId?: string | null;
        placeId?: string | null;
        contactName?: string | null;
        contactNumber?: string | null;
        addressFull?: string | null;
        address1?: string | null;
        address2?: string | null;
        unitNumber?: string | null;
        streetNumber?: string | null;
        streetName?: string | null;
        streetType?: string | null;
        city: string;
        country: string;
        countryCode?: string | null;
        state: string;
        stateCode?: string | null;
        postalCode: string;
      } | null;
      logo?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      entityBeneficialOwners?: {
        __typename: 'ModelEntityBeneficialOwnerConnection';
        items?: Array<{
          __typename: 'EntityBeneficialOwner';
          entityId: string;
          beneficialOwnerId: string;
          beneficialOwner?: {
            __typename: 'BeneficialOwner';
            id: string;
            firstName?: string | null;
            lastName?: string | null;
            name?: string | null;
            providerEntityId: string;
            verificationStatus: VerificationStatus;
            verificationAttempt?: number | null;
            createdBy?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
          } | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          owner?: string | null;
        } | null> | null;
        nextToken?: string | null;
      } | null;
      entityUsers?: {
        __typename: 'ModelEntityUserConnection';
        items: Array<{
          __typename: 'EntityUser';
          id: string;
          entityId: string;
          userId: string;
          invitedEmail?: string | null;
          referredBy?: string | null;
          invitedEntityId?: string | null;
          firmEntityId?: string | null;
          firstName?: string | null;
          lastName?: string | null;
          role?: EntityUserRole | null;
          paymentsEnabled?: boolean | null;
          entitySearchName?: string | null;
          entity?: {
            __typename: 'Entity';
            id: string;
            type: EntityType;
            taxNumber?: string | null;
            companyNumber?: string | null;
            billerCode?: number | null;
            name: string;
            legalName?: string | null;
            searchName?: string | null;
            address?: {
              __typename: 'Address';
              addressId?: string | null;
              placeId?: string | null;
              contactName?: string | null;
              contactNumber?: string | null;
              addressFull?: string | null;
              address1?: string | null;
              address2?: string | null;
              unitNumber?: string | null;
              streetNumber?: string | null;
              streetName?: string | null;
              streetType?: string | null;
              city: string;
              country: string;
              countryCode?: string | null;
              state: string;
              stateCode?: string | null;
              postalCode: string;
            } | null;
            logo?: {
              __typename: 'Image';
              alt?: string | null;
              identityId?: string | null;
              key: string;
              level: S3UploadLevel;
              type?: string | null;
            } | null;
            entityBeneficialOwners?: {
              __typename: 'ModelEntityBeneficialOwnerConnection';
              items?: Array<{
                __typename: 'EntityBeneficialOwner';
                entityId: string;
                beneficialOwnerId: string;
                createdAt?: string | null;
                updatedAt?: string | null;
                owner?: string | null;
              } | null> | null;
              nextToken?: string | null;
            } | null;
            entityUsers?: {
              __typename: 'ModelEntityUserConnection';
              items: Array<{
                __typename: 'EntityUser';
                id: string;
                entityId: string;
                userId: string;
                invitedEmail?: string | null;
                referredBy?: string | null;
                invitedEntityId?: string | null;
                firmEntityId?: string | null;
                firstName?: string | null;
                lastName?: string | null;
                role?: EntityUserRole | null;
                paymentsEnabled?: boolean | null;
                entitySearchName?: string | null;
                searchName?: string | null;
                createdBy?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                status?: EntityUserStatus | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            gstRegistered?: boolean | null;
            providerEntityId?: string | null;
            providerCompanyId?: string | null;
            providerBillUserCompanyId?: string | null;
            providerBankAccountId?: string | null;
            providerDigitalWalletId?: string | null;
            providerBpayCrn?: string | null;
            contact?: {
              __typename: 'EntityContact';
              firstName?: string | null;
              lastName?: string | null;
              email?: string | null;
              phone?: string | null;
              role?: string | null;
            } | null;
            paymentMethods?: {
              __typename: 'ModelPaymentMethodConnection';
              items: Array<{
                __typename: 'PaymentMethod';
                id: string;
                paymentMethodType: PaymentMethodType;
                type?: string | null;
                fullName?: string | null;
                number?: string | null;
                expMonth?: string | null;
                expYear?: string | null;
                accountName?: string | null;
                bankName?: string | null;
                accountNumber?: string | null;
                routingNumber?: string | null;
                holderType?: BankHolderType | null;
                accountType?: BankAccountType | null;
                status?: PaymentMethodStatus | null;
                accountDirection?: AccountDirection | null;
                expiresAt?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            paymentMethodId?: string | null;
            paymentUserId?: string | null;
            disbursementMethodId?: string | null;
            receivingAccounts?: {
              __typename: 'ModelPaymentMethodConnection';
              items: Array<{
                __typename: 'PaymentMethod';
                id: string;
                paymentMethodType: PaymentMethodType;
                type?: string | null;
                fullName?: string | null;
                number?: string | null;
                expMonth?: string | null;
                expYear?: string | null;
                accountName?: string | null;
                bankName?: string | null;
                accountNumber?: string | null;
                routingNumber?: string | null;
                holderType?: BankHolderType | null;
                accountType?: BankAccountType | null;
                status?: PaymentMethodStatus | null;
                accountDirection?: AccountDirection | null;
                expiresAt?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            ubosCreated?: boolean | null;
            numUbosCreated?: number | null;
            subCategory?: string | null;
            clientsStatus?: EntityClientsStatus | null;
            ocrEmail?: string | null;
            verificationStatus?: VerificationStatus | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            owner: string;
            referredBy?: string | null;
            xeroContactSyncStatus?: XeroSyncStatus | null;
            xeroLastContactSyncAt?: string | null;
            xeroInvoiceSyncStatus?: XeroSyncStatus | null;
            xeroLastInvoiceSyncAt?: string | null;
            xeroTenantId?: string | null;
          } | null;
          searchName?: string | null;
          createdBy?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          status?: EntityUserStatus | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      gstRegistered?: boolean | null;
      providerEntityId?: string | null;
      providerCompanyId?: string | null;
      providerBillUserCompanyId?: string | null;
      providerBankAccountId?: string | null;
      providerDigitalWalletId?: string | null;
      providerBpayCrn?: string | null;
      contact?: {
        __typename: 'EntityContact';
        firstName?: string | null;
        lastName?: string | null;
        email?: string | null;
        phone?: string | null;
        role?: string | null;
      } | null;
      paymentMethods?: {
        __typename: 'ModelPaymentMethodConnection';
        items: Array<{
          __typename: 'PaymentMethod';
          id: string;
          paymentMethodType: PaymentMethodType;
          type?: string | null;
          fullName?: string | null;
          number?: string | null;
          expMonth?: string | null;
          expYear?: string | null;
          accountName?: string | null;
          bankName?: string | null;
          accountNumber?: string | null;
          routingNumber?: string | null;
          holderType?: BankHolderType | null;
          accountType?: BankAccountType | null;
          status?: PaymentMethodStatus | null;
          accountDirection?: AccountDirection | null;
          expiresAt?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      paymentMethodId?: string | null;
      paymentUserId?: string | null;
      disbursementMethodId?: string | null;
      receivingAccounts?: {
        __typename: 'ModelPaymentMethodConnection';
        items: Array<{
          __typename: 'PaymentMethod';
          id: string;
          paymentMethodType: PaymentMethodType;
          type?: string | null;
          fullName?: string | null;
          number?: string | null;
          expMonth?: string | null;
          expYear?: string | null;
          accountName?: string | null;
          bankName?: string | null;
          accountNumber?: string | null;
          routingNumber?: string | null;
          holderType?: BankHolderType | null;
          accountType?: BankAccountType | null;
          status?: PaymentMethodStatus | null;
          accountDirection?: AccountDirection | null;
          expiresAt?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      ubosCreated?: boolean | null;
      numUbosCreated?: number | null;
      subCategory?: string | null;
      clientsStatus?: EntityClientsStatus | null;
      ocrEmail?: string | null;
      verificationStatus?: VerificationStatus | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      owner: string;
      referredBy?: string | null;
      xeroContactSyncStatus?: XeroSyncStatus | null;
      xeroLastContactSyncAt?: string | null;
      xeroInvoiceSyncStatus?: XeroSyncStatus | null;
      xeroLastInvoiceSyncAt?: string | null;
      xeroTenantId?: string | null;
    } | null;
    searchName?: string | null;
    createdBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    status?: EntityUserStatus | null;
  } | null;
};

export type AcceptDenyEntityUserStatusMutationVariables = {
  input: AcceptDenyEntityUserStatusInput;
};

export type AcceptDenyEntityUserStatusMutation = {
  acceptDenyEntityUserStatus?: {
    __typename: 'EntityUser';
    id: string;
    entityId: string;
    userId: string;
    invitedEmail?: string | null;
    referredBy?: string | null;
    invitedEntityId?: string | null;
    firmEntityId?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    role?: EntityUserRole | null;
    paymentsEnabled?: boolean | null;
    entitySearchName?: string | null;
    entity?: {
      __typename: 'Entity';
      id: string;
      type: EntityType;
      taxNumber?: string | null;
      companyNumber?: string | null;
      billerCode?: number | null;
      name: string;
      legalName?: string | null;
      searchName?: string | null;
      address?: {
        __typename: 'Address';
        addressId?: string | null;
        placeId?: string | null;
        contactName?: string | null;
        contactNumber?: string | null;
        addressFull?: string | null;
        address1?: string | null;
        address2?: string | null;
        unitNumber?: string | null;
        streetNumber?: string | null;
        streetName?: string | null;
        streetType?: string | null;
        city: string;
        country: string;
        countryCode?: string | null;
        state: string;
        stateCode?: string | null;
        postalCode: string;
      } | null;
      logo?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      entityBeneficialOwners?: {
        __typename: 'ModelEntityBeneficialOwnerConnection';
        items?: Array<{
          __typename: 'EntityBeneficialOwner';
          entityId: string;
          beneficialOwnerId: string;
          beneficialOwner?: {
            __typename: 'BeneficialOwner';
            id: string;
            firstName?: string | null;
            lastName?: string | null;
            name?: string | null;
            providerEntityId: string;
            verificationStatus: VerificationStatus;
            verificationAttempt?: number | null;
            createdBy?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
          } | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          owner?: string | null;
        } | null> | null;
        nextToken?: string | null;
      } | null;
      entityUsers?: {
        __typename: 'ModelEntityUserConnection';
        items: Array<{
          __typename: 'EntityUser';
          id: string;
          entityId: string;
          userId: string;
          invitedEmail?: string | null;
          referredBy?: string | null;
          invitedEntityId?: string | null;
          firmEntityId?: string | null;
          firstName?: string | null;
          lastName?: string | null;
          role?: EntityUserRole | null;
          paymentsEnabled?: boolean | null;
          entitySearchName?: string | null;
          entity?: {
            __typename: 'Entity';
            id: string;
            type: EntityType;
            taxNumber?: string | null;
            companyNumber?: string | null;
            billerCode?: number | null;
            name: string;
            legalName?: string | null;
            searchName?: string | null;
            address?: {
              __typename: 'Address';
              addressId?: string | null;
              placeId?: string | null;
              contactName?: string | null;
              contactNumber?: string | null;
              addressFull?: string | null;
              address1?: string | null;
              address2?: string | null;
              unitNumber?: string | null;
              streetNumber?: string | null;
              streetName?: string | null;
              streetType?: string | null;
              city: string;
              country: string;
              countryCode?: string | null;
              state: string;
              stateCode?: string | null;
              postalCode: string;
            } | null;
            logo?: {
              __typename: 'Image';
              alt?: string | null;
              identityId?: string | null;
              key: string;
              level: S3UploadLevel;
              type?: string | null;
            } | null;
            entityBeneficialOwners?: {
              __typename: 'ModelEntityBeneficialOwnerConnection';
              items?: Array<{
                __typename: 'EntityBeneficialOwner';
                entityId: string;
                beneficialOwnerId: string;
                createdAt?: string | null;
                updatedAt?: string | null;
                owner?: string | null;
              } | null> | null;
              nextToken?: string | null;
            } | null;
            entityUsers?: {
              __typename: 'ModelEntityUserConnection';
              items: Array<{
                __typename: 'EntityUser';
                id: string;
                entityId: string;
                userId: string;
                invitedEmail?: string | null;
                referredBy?: string | null;
                invitedEntityId?: string | null;
                firmEntityId?: string | null;
                firstName?: string | null;
                lastName?: string | null;
                role?: EntityUserRole | null;
                paymentsEnabled?: boolean | null;
                entitySearchName?: string | null;
                searchName?: string | null;
                createdBy?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                status?: EntityUserStatus | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            gstRegistered?: boolean | null;
            providerEntityId?: string | null;
            providerCompanyId?: string | null;
            providerBillUserCompanyId?: string | null;
            providerBankAccountId?: string | null;
            providerDigitalWalletId?: string | null;
            providerBpayCrn?: string | null;
            contact?: {
              __typename: 'EntityContact';
              firstName?: string | null;
              lastName?: string | null;
              email?: string | null;
              phone?: string | null;
              role?: string | null;
            } | null;
            paymentMethods?: {
              __typename: 'ModelPaymentMethodConnection';
              items: Array<{
                __typename: 'PaymentMethod';
                id: string;
                paymentMethodType: PaymentMethodType;
                type?: string | null;
                fullName?: string | null;
                number?: string | null;
                expMonth?: string | null;
                expYear?: string | null;
                accountName?: string | null;
                bankName?: string | null;
                accountNumber?: string | null;
                routingNumber?: string | null;
                holderType?: BankHolderType | null;
                accountType?: BankAccountType | null;
                status?: PaymentMethodStatus | null;
                accountDirection?: AccountDirection | null;
                expiresAt?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            paymentMethodId?: string | null;
            paymentUserId?: string | null;
            disbursementMethodId?: string | null;
            receivingAccounts?: {
              __typename: 'ModelPaymentMethodConnection';
              items: Array<{
                __typename: 'PaymentMethod';
                id: string;
                paymentMethodType: PaymentMethodType;
                type?: string | null;
                fullName?: string | null;
                number?: string | null;
                expMonth?: string | null;
                expYear?: string | null;
                accountName?: string | null;
                bankName?: string | null;
                accountNumber?: string | null;
                routingNumber?: string | null;
                holderType?: BankHolderType | null;
                accountType?: BankAccountType | null;
                status?: PaymentMethodStatus | null;
                accountDirection?: AccountDirection | null;
                expiresAt?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            ubosCreated?: boolean | null;
            numUbosCreated?: number | null;
            subCategory?: string | null;
            clientsStatus?: EntityClientsStatus | null;
            ocrEmail?: string | null;
            verificationStatus?: VerificationStatus | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            owner: string;
            referredBy?: string | null;
            xeroContactSyncStatus?: XeroSyncStatus | null;
            xeroLastContactSyncAt?: string | null;
            xeroInvoiceSyncStatus?: XeroSyncStatus | null;
            xeroLastInvoiceSyncAt?: string | null;
            xeroTenantId?: string | null;
          } | null;
          searchName?: string | null;
          createdBy?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          status?: EntityUserStatus | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      gstRegistered?: boolean | null;
      providerEntityId?: string | null;
      providerCompanyId?: string | null;
      providerBillUserCompanyId?: string | null;
      providerBankAccountId?: string | null;
      providerDigitalWalletId?: string | null;
      providerBpayCrn?: string | null;
      contact?: {
        __typename: 'EntityContact';
        firstName?: string | null;
        lastName?: string | null;
        email?: string | null;
        phone?: string | null;
        role?: string | null;
      } | null;
      paymentMethods?: {
        __typename: 'ModelPaymentMethodConnection';
        items: Array<{
          __typename: 'PaymentMethod';
          id: string;
          paymentMethodType: PaymentMethodType;
          type?: string | null;
          fullName?: string | null;
          number?: string | null;
          expMonth?: string | null;
          expYear?: string | null;
          accountName?: string | null;
          bankName?: string | null;
          accountNumber?: string | null;
          routingNumber?: string | null;
          holderType?: BankHolderType | null;
          accountType?: BankAccountType | null;
          status?: PaymentMethodStatus | null;
          accountDirection?: AccountDirection | null;
          expiresAt?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      paymentMethodId?: string | null;
      paymentUserId?: string | null;
      disbursementMethodId?: string | null;
      receivingAccounts?: {
        __typename: 'ModelPaymentMethodConnection';
        items: Array<{
          __typename: 'PaymentMethod';
          id: string;
          paymentMethodType: PaymentMethodType;
          type?: string | null;
          fullName?: string | null;
          number?: string | null;
          expMonth?: string | null;
          expYear?: string | null;
          accountName?: string | null;
          bankName?: string | null;
          accountNumber?: string | null;
          routingNumber?: string | null;
          holderType?: BankHolderType | null;
          accountType?: BankAccountType | null;
          status?: PaymentMethodStatus | null;
          accountDirection?: AccountDirection | null;
          expiresAt?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      ubosCreated?: boolean | null;
      numUbosCreated?: number | null;
      subCategory?: string | null;
      clientsStatus?: EntityClientsStatus | null;
      ocrEmail?: string | null;
      verificationStatus?: VerificationStatus | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      owner: string;
      referredBy?: string | null;
      xeroContactSyncStatus?: XeroSyncStatus | null;
      xeroLastContactSyncAt?: string | null;
      xeroInvoiceSyncStatus?: XeroSyncStatus | null;
      xeroLastInvoiceSyncAt?: string | null;
      xeroTenantId?: string | null;
    } | null;
    searchName?: string | null;
    createdBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    status?: EntityUserStatus | null;
  } | null;
};

export type SendReferralInvitationEmailMutationVariables = {
  input: sendReferralInvitationEmailInput;
};

export type SendReferralInvitationEmailMutation = {
  sendReferralInvitationEmail?: boolean | null;
};

export type DeleteEntityUserMutationVariables = {
  input?: DeleteEntityUserInput | null;
};

export type DeleteEntityUserMutation = {
  deleteEntityUser?: {
    __typename: 'EntityUser';
    id: string;
    entityId: string;
    userId: string;
    invitedEmail?: string | null;
    referredBy?: string | null;
    invitedEntityId?: string | null;
    firmEntityId?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    role?: EntityUserRole | null;
    paymentsEnabled?: boolean | null;
    entitySearchName?: string | null;
    entity?: {
      __typename: 'Entity';
      id: string;
      type: EntityType;
      taxNumber?: string | null;
      companyNumber?: string | null;
      billerCode?: number | null;
      name: string;
      legalName?: string | null;
      searchName?: string | null;
      address?: {
        __typename: 'Address';
        addressId?: string | null;
        placeId?: string | null;
        contactName?: string | null;
        contactNumber?: string | null;
        addressFull?: string | null;
        address1?: string | null;
        address2?: string | null;
        unitNumber?: string | null;
        streetNumber?: string | null;
        streetName?: string | null;
        streetType?: string | null;
        city: string;
        country: string;
        countryCode?: string | null;
        state: string;
        stateCode?: string | null;
        postalCode: string;
      } | null;
      logo?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      entityBeneficialOwners?: {
        __typename: 'ModelEntityBeneficialOwnerConnection';
        items?: Array<{
          __typename: 'EntityBeneficialOwner';
          entityId: string;
          beneficialOwnerId: string;
          beneficialOwner?: {
            __typename: 'BeneficialOwner';
            id: string;
            firstName?: string | null;
            lastName?: string | null;
            name?: string | null;
            providerEntityId: string;
            verificationStatus: VerificationStatus;
            verificationAttempt?: number | null;
            createdBy?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
          } | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          owner?: string | null;
        } | null> | null;
        nextToken?: string | null;
      } | null;
      entityUsers?: {
        __typename: 'ModelEntityUserConnection';
        items: Array<{
          __typename: 'EntityUser';
          id: string;
          entityId: string;
          userId: string;
          invitedEmail?: string | null;
          referredBy?: string | null;
          invitedEntityId?: string | null;
          firmEntityId?: string | null;
          firstName?: string | null;
          lastName?: string | null;
          role?: EntityUserRole | null;
          paymentsEnabled?: boolean | null;
          entitySearchName?: string | null;
          entity?: {
            __typename: 'Entity';
            id: string;
            type: EntityType;
            taxNumber?: string | null;
            companyNumber?: string | null;
            billerCode?: number | null;
            name: string;
            legalName?: string | null;
            searchName?: string | null;
            address?: {
              __typename: 'Address';
              addressId?: string | null;
              placeId?: string | null;
              contactName?: string | null;
              contactNumber?: string | null;
              addressFull?: string | null;
              address1?: string | null;
              address2?: string | null;
              unitNumber?: string | null;
              streetNumber?: string | null;
              streetName?: string | null;
              streetType?: string | null;
              city: string;
              country: string;
              countryCode?: string | null;
              state: string;
              stateCode?: string | null;
              postalCode: string;
            } | null;
            logo?: {
              __typename: 'Image';
              alt?: string | null;
              identityId?: string | null;
              key: string;
              level: S3UploadLevel;
              type?: string | null;
            } | null;
            entityBeneficialOwners?: {
              __typename: 'ModelEntityBeneficialOwnerConnection';
              items?: Array<{
                __typename: 'EntityBeneficialOwner';
                entityId: string;
                beneficialOwnerId: string;
                createdAt?: string | null;
                updatedAt?: string | null;
                owner?: string | null;
              } | null> | null;
              nextToken?: string | null;
            } | null;
            entityUsers?: {
              __typename: 'ModelEntityUserConnection';
              items: Array<{
                __typename: 'EntityUser';
                id: string;
                entityId: string;
                userId: string;
                invitedEmail?: string | null;
                referredBy?: string | null;
                invitedEntityId?: string | null;
                firmEntityId?: string | null;
                firstName?: string | null;
                lastName?: string | null;
                role?: EntityUserRole | null;
                paymentsEnabled?: boolean | null;
                entitySearchName?: string | null;
                searchName?: string | null;
                createdBy?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                status?: EntityUserStatus | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            gstRegistered?: boolean | null;
            providerEntityId?: string | null;
            providerCompanyId?: string | null;
            providerBillUserCompanyId?: string | null;
            providerBankAccountId?: string | null;
            providerDigitalWalletId?: string | null;
            providerBpayCrn?: string | null;
            contact?: {
              __typename: 'EntityContact';
              firstName?: string | null;
              lastName?: string | null;
              email?: string | null;
              phone?: string | null;
              role?: string | null;
            } | null;
            paymentMethods?: {
              __typename: 'ModelPaymentMethodConnection';
              items: Array<{
                __typename: 'PaymentMethod';
                id: string;
                paymentMethodType: PaymentMethodType;
                type?: string | null;
                fullName?: string | null;
                number?: string | null;
                expMonth?: string | null;
                expYear?: string | null;
                accountName?: string | null;
                bankName?: string | null;
                accountNumber?: string | null;
                routingNumber?: string | null;
                holderType?: BankHolderType | null;
                accountType?: BankAccountType | null;
                status?: PaymentMethodStatus | null;
                accountDirection?: AccountDirection | null;
                expiresAt?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            paymentMethodId?: string | null;
            paymentUserId?: string | null;
            disbursementMethodId?: string | null;
            receivingAccounts?: {
              __typename: 'ModelPaymentMethodConnection';
              items: Array<{
                __typename: 'PaymentMethod';
                id: string;
                paymentMethodType: PaymentMethodType;
                type?: string | null;
                fullName?: string | null;
                number?: string | null;
                expMonth?: string | null;
                expYear?: string | null;
                accountName?: string | null;
                bankName?: string | null;
                accountNumber?: string | null;
                routingNumber?: string | null;
                holderType?: BankHolderType | null;
                accountType?: BankAccountType | null;
                status?: PaymentMethodStatus | null;
                accountDirection?: AccountDirection | null;
                expiresAt?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            ubosCreated?: boolean | null;
            numUbosCreated?: number | null;
            subCategory?: string | null;
            clientsStatus?: EntityClientsStatus | null;
            ocrEmail?: string | null;
            verificationStatus?: VerificationStatus | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            owner: string;
            referredBy?: string | null;
            xeroContactSyncStatus?: XeroSyncStatus | null;
            xeroLastContactSyncAt?: string | null;
            xeroInvoiceSyncStatus?: XeroSyncStatus | null;
            xeroLastInvoiceSyncAt?: string | null;
            xeroTenantId?: string | null;
          } | null;
          searchName?: string | null;
          createdBy?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          status?: EntityUserStatus | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      gstRegistered?: boolean | null;
      providerEntityId?: string | null;
      providerCompanyId?: string | null;
      providerBillUserCompanyId?: string | null;
      providerBankAccountId?: string | null;
      providerDigitalWalletId?: string | null;
      providerBpayCrn?: string | null;
      contact?: {
        __typename: 'EntityContact';
        firstName?: string | null;
        lastName?: string | null;
        email?: string | null;
        phone?: string | null;
        role?: string | null;
      } | null;
      paymentMethods?: {
        __typename: 'ModelPaymentMethodConnection';
        items: Array<{
          __typename: 'PaymentMethod';
          id: string;
          paymentMethodType: PaymentMethodType;
          type?: string | null;
          fullName?: string | null;
          number?: string | null;
          expMonth?: string | null;
          expYear?: string | null;
          accountName?: string | null;
          bankName?: string | null;
          accountNumber?: string | null;
          routingNumber?: string | null;
          holderType?: BankHolderType | null;
          accountType?: BankAccountType | null;
          status?: PaymentMethodStatus | null;
          accountDirection?: AccountDirection | null;
          expiresAt?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      paymentMethodId?: string | null;
      paymentUserId?: string | null;
      disbursementMethodId?: string | null;
      receivingAccounts?: {
        __typename: 'ModelPaymentMethodConnection';
        items: Array<{
          __typename: 'PaymentMethod';
          id: string;
          paymentMethodType: PaymentMethodType;
          type?: string | null;
          fullName?: string | null;
          number?: string | null;
          expMonth?: string | null;
          expYear?: string | null;
          accountName?: string | null;
          bankName?: string | null;
          accountNumber?: string | null;
          routingNumber?: string | null;
          holderType?: BankHolderType | null;
          accountType?: BankAccountType | null;
          status?: PaymentMethodStatus | null;
          accountDirection?: AccountDirection | null;
          expiresAt?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      ubosCreated?: boolean | null;
      numUbosCreated?: number | null;
      subCategory?: string | null;
      clientsStatus?: EntityClientsStatus | null;
      ocrEmail?: string | null;
      verificationStatus?: VerificationStatus | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      owner: string;
      referredBy?: string | null;
      xeroContactSyncStatus?: XeroSyncStatus | null;
      xeroLastContactSyncAt?: string | null;
      xeroInvoiceSyncStatus?: XeroSyncStatus | null;
      xeroLastInvoiceSyncAt?: string | null;
      xeroTenantId?: string | null;
    } | null;
    searchName?: string | null;
    createdBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    status?: EntityUserStatus | null;
  } | null;
};

export type CreateVerificationTokenMutationVariables = {
  input?: CreateVerificationTokenInput | null;
};

export type CreateVerificationTokenMutation = {
  createVerificationToken?: {
    __typename: 'VerificationUiToken';
    token: string;
  } | null;
};

export type LookupEntityOwnershipMutationVariables = {
  input?: LookupEntityOwnershipInput | null;
};

export type LookupEntityOwnershipMutation = {
  lookupEntityOwnership?: {
    __typename: 'LookupEntityOwnershipResult';
    async?: boolean | null;
  } | null;
};

export type CreateServiceMutationVariables = {
  input: CreateServiceInput;
};

export type CreateServiceMutation = {
  createService?: {
    __typename: 'Service';
    id: string;
    entityId: string;
    title?: string | null;
    description?: string | null;
    amount: number;
    feeType: FeeType;
    taxType: TaxType;
    searchName?: string | null;
    status: ServiceStatus;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type UpdateServiceMutationVariables = {
  input: UpdateServiceInput;
};

export type UpdateServiceMutation = {
  updateService?: {
    __typename: 'Service';
    id: string;
    entityId: string;
    title?: string | null;
    description?: string | null;
    amount: number;
    feeType: FeeType;
    taxType: TaxType;
    searchName?: string | null;
    status: ServiceStatus;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type CreateTemplateMutationVariables = {
  input: CreateTemplateInput;
};

export type CreateTemplateMutation = {
  createTemplate?: {
    __typename: 'Template';
    id: string;
    entityId: string;
    title: string;
    templateServices?: {
      __typename: 'ModelTemplateServiceConnection';
      items?: Array<{
        __typename: 'TemplateService';
        templateId: string;
        serviceId: string;
        service?: {
          __typename: 'Service';
          id: string;
          entityId: string;
          title?: string | null;
          description?: string | null;
          amount: number;
          feeType: FeeType;
          taxType: TaxType;
          searchName?: string | null;
          status: ServiceStatus;
          createdAt: string;
          updatedAt: string;
        } | null;
        createdAt: string;
        updatedAt: string;
      } | null> | null;
      nextToken?: string | null;
    } | null;
    components?: Array<{
      __typename: 'TemplateComponent';
      type: ComponentType;
      data?: string | null;
    } | null> | null;
    searchName?: string | null;
    status: TemplateStatus;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type UpdateTemplateMutationVariables = {
  input: UpdateTemplateInput;
};

export type UpdateTemplateMutation = {
  updateTemplate?: {
    __typename: 'Template';
    id: string;
    entityId: string;
    title: string;
    templateServices?: {
      __typename: 'ModelTemplateServiceConnection';
      items?: Array<{
        __typename: 'TemplateService';
        templateId: string;
        serviceId: string;
        service?: {
          __typename: 'Service';
          id: string;
          entityId: string;
          title?: string | null;
          description?: string | null;
          amount: number;
          feeType: FeeType;
          taxType: TaxType;
          searchName?: string | null;
          status: ServiceStatus;
          createdAt: string;
          updatedAt: string;
        } | null;
        createdAt: string;
        updatedAt: string;
      } | null> | null;
      nextToken?: string | null;
    } | null;
    components?: Array<{
      __typename: 'TemplateComponent';
      type: ComponentType;
      data?: string | null;
    } | null> | null;
    searchName?: string | null;
    status: TemplateStatus;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type CreateTemplateServiceMutationVariables = {
  input: CreateTemplateServiceInput;
};

export type CreateTemplateServiceMutation = {
  createTemplateService?: {
    __typename: 'TemplateService';
    templateId: string;
    serviceId: string;
    service?: {
      __typename: 'Service';
      id: string;
      entityId: string;
      title?: string | null;
      description?: string | null;
      amount: number;
      feeType: FeeType;
      taxType: TaxType;
      searchName?: string | null;
      status: ServiceStatus;
      createdAt: string;
      updatedAt: string;
    } | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type DeleteTemplateServiceMutationVariables = {
  input: DeleteTemplateServiceInput;
};

export type DeleteTemplateServiceMutation = {
  deleteTemplateService?: {
    __typename: 'TemplateService';
    templateId: string;
    serviceId: string;
    service?: {
      __typename: 'Service';
      id: string;
      entityId: string;
      title?: string | null;
      description?: string | null;
      amount: number;
      feeType: FeeType;
      taxType: TaxType;
      searchName?: string | null;
      status: ServiceStatus;
      createdAt: string;
      updatedAt: string;
    } | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type CreateMessageMutationVariables = {
  input: CreateMessageInput;
  condition?: ModelMessageConditionInput | null;
};

export type CreateMessageMutation = {
  createMessage?: {
    __typename: 'Message';
    conversationId: string;
    text?: string | null;
    attachments?: Array<{
      __typename: 'S3Upload';
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type: S3UploadType;
    } | null> | null;
    users: Array<string | null>;
    receiver: string;
    sender: string;
    createdBy: string;
    readBy?: Array<string | null> | null;
    createdAt: string;
    updatedAt?: string | null;
    id: string;
    conversationMessagesId?: string | null;
  } | null;
};

export type UpdateMessageMutationVariables = {
  input: UpdateMessageInput;
  condition?: ModelMessageConditionInput | null;
};

export type UpdateMessageMutation = {
  updateMessage?: {
    __typename: 'Message';
    conversationId: string;
    text?: string | null;
    attachments?: Array<{
      __typename: 'S3Upload';
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type: S3UploadType;
    } | null> | null;
    users: Array<string | null>;
    receiver: string;
    sender: string;
    createdBy: string;
    readBy?: Array<string | null> | null;
    createdAt: string;
    updatedAt?: string | null;
    id: string;
    conversationMessagesId?: string | null;
  } | null;
};

export type CreateNotificationMutationVariables = {
  input?: CreateNotificationInput | null;
};

export type CreateNotificationMutation = {
  createNotification?: {
    __typename: 'Notification';
    id: string;
    title?: string | null;
    message?: string | null;
    status?: NotificationStatus | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    type?: string | null;
    owner: string;
  } | null;
};

export type UpdateNotificationMutationVariables = {
  input?: UpdateNotificationInput | null;
};

export type UpdateNotificationMutation = {
  updateNotification?: {
    __typename: 'Notification';
    id: string;
    title?: string | null;
    message?: string | null;
    status?: NotificationStatus | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    type?: string | null;
    owner: string;
  } | null;
};

export type CreateOptionMutationVariables = {
  input: CreateOptionInput;
  condition?: ModelOptionConditionInput | null;
};

export type CreateOptionMutation = {
  createOption?: {
    __typename: 'Option';
    name?: string | null;
    label: string;
    value: string;
    group?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
  } | null;
};

export type UpdateOptionMutationVariables = {
  input: UpdateOptionInput;
  condition?: ModelOptionConditionInput | null;
};

export type UpdateOptionMutation = {
  updateOption?: {
    __typename: 'Option';
    name?: string | null;
    label: string;
    value: string;
    group?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
  } | null;
};

export type DeleteOptionMutationVariables = {
  input: DeleteOptionInput;
  condition?: ModelOptionConditionInput | null;
};

export type DeleteOptionMutation = {
  deleteOption?: {
    __typename: 'Option';
    name?: string | null;
    label: string;
    value: string;
    group?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
  } | null;
};

export type ConfirmPaymentsMutationVariables = {
  input?: ConfirmPaymentInput | null;
};

export type ConfirmPaymentsMutation = {
  confirmPayments?: Array<{
    __typename: 'Payment';
    id: string;
    taskId?: string | null;
    entityId?: string | null;
    payInPaymentId?: string | null;
    providerTransactionId?: string | null;
    paymentProvider?: PaymentProvider | null;
    disbursementId?: string | null;
    fromId: string;
    fromType: FromToType;
    toId?: string | null;
    toType?: FromToType | null;
    buyerId?: string | null;
    sellerId?: string | null;
    entityIdTo?: string | null;
    amount?: number | null;
    netAmount?: number | null;
    payerFees?: number | null;
    totalAmount?: number | null;
    gstAmount?: number | null;
    installment?: number | null;
    installments?: number | null;
    feeAmount?: number | null;
    paymentType?: PaymentType | null;
    taxAmount?: number | null;
    currency?: string | null;
    feeIds?: Array<string | null> | null;
    ipAddress?: string | null;
    status: PaymentStatus;
    payerUserStatus?: PayerUserStatus | null;
    declinedReason?: string | null;
    scheduledAt?: string | null;
    paidAt?: string | null;
    declinedAt?: string | null;
    createdAt?: string | null;
    receivedAt?: string | null;
    paidOutAt?: string | null;
    updatedAt?: string | null;
    voidedAt?: string | null;
    owner?: string | null;
  } | null> | null;
};

export type CreatePaymentMutationVariables = {
  input?: CreatePaymentInput | null;
};

export type CreatePaymentMutation = {
  createPayment?: Array<{
    __typename: 'Payment';
    id: string;
    taskId?: string | null;
    entityId?: string | null;
    payInPaymentId?: string | null;
    providerTransactionId?: string | null;
    paymentProvider?: PaymentProvider | null;
    disbursementId?: string | null;
    fromId: string;
    fromType: FromToType;
    toId?: string | null;
    toType?: FromToType | null;
    buyerId?: string | null;
    sellerId?: string | null;
    entityIdTo?: string | null;
    amount?: number | null;
    netAmount?: number | null;
    payerFees?: number | null;
    totalAmount?: number | null;
    gstAmount?: number | null;
    installment?: number | null;
    installments?: number | null;
    feeAmount?: number | null;
    paymentType?: PaymentType | null;
    taxAmount?: number | null;
    currency?: string | null;
    feeIds?: Array<string | null> | null;
    ipAddress?: string | null;
    status: PaymentStatus;
    payerUserStatus?: PayerUserStatus | null;
    declinedReason?: string | null;
    scheduledAt?: string | null;
    paidAt?: string | null;
    declinedAt?: string | null;
    createdAt?: string | null;
    receivedAt?: string | null;
    paidOutAt?: string | null;
    updatedAt?: string | null;
    voidedAt?: string | null;
    owner?: string | null;
  } | null> | null;
};

export type CreatePaymentPayIdMutationVariables = {
  input?: CreatePaymentPayIdInput | null;
};

export type CreatePaymentPayIdMutation = {
  createPaymentPayId?: {
    __typename: 'PayInPayment';
    id: string;
    entityId: string;
    amount?: number | null;
    paymentType?: PaymentType | null;
    status?: PayInPaymentStatus | null;
    taskPayments: Array<{
      __typename: 'TaskPayment';
      id: string;
      paymentType: PaymentType;
      installments: number;
      scheduledAt: string;
    }>;
    scheduledAt?: string | null;
    createdBy?: string | null;
    paymentUserId: string;
    receivedAt?: string | null;
    paidOutAt?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null;
};

export type CancelPaymentPayIdMutationVariables = {
  input?: CancelPaymentPayIdInput | null;
};

export type CancelPaymentPayIdMutation = {
  cancelPaymentPayId?: Array<{
    __typename: 'Payment';
    id: string;
    taskId?: string | null;
    entityId?: string | null;
    payInPaymentId?: string | null;
    providerTransactionId?: string | null;
    paymentProvider?: PaymentProvider | null;
    disbursementId?: string | null;
    fromId: string;
    fromType: FromToType;
    toId?: string | null;
    toType?: FromToType | null;
    buyerId?: string | null;
    sellerId?: string | null;
    entityIdTo?: string | null;
    amount?: number | null;
    netAmount?: number | null;
    payerFees?: number | null;
    totalAmount?: number | null;
    gstAmount?: number | null;
    installment?: number | null;
    installments?: number | null;
    feeAmount?: number | null;
    paymentType?: PaymentType | null;
    taxAmount?: number | null;
    currency?: string | null;
    feeIds?: Array<string | null> | null;
    ipAddress?: string | null;
    status: PaymentStatus;
    payerUserStatus?: PayerUserStatus | null;
    declinedReason?: string | null;
    scheduledAt?: string | null;
    paidAt?: string | null;
    declinedAt?: string | null;
    createdAt?: string | null;
    receivedAt?: string | null;
    paidOutAt?: string | null;
    updatedAt?: string | null;
    voidedAt?: string | null;
    owner?: string | null;
  } | null> | null;
};

export type RetryPaymentMutationVariables = {
  input?: RetryPaymentInput | null;
};

export type RetryPaymentMutation = {
  retryPayment?: Array<{
    __typename: 'Payment';
    id: string;
    taskId?: string | null;
    entityId?: string | null;
    payInPaymentId?: string | null;
    providerTransactionId?: string | null;
    paymentProvider?: PaymentProvider | null;
    disbursementId?: string | null;
    fromId: string;
    fromType: FromToType;
    toId?: string | null;
    toType?: FromToType | null;
    buyerId?: string | null;
    sellerId?: string | null;
    entityIdTo?: string | null;
    amount?: number | null;
    netAmount?: number | null;
    payerFees?: number | null;
    totalAmount?: number | null;
    gstAmount?: number | null;
    installment?: number | null;
    installments?: number | null;
    feeAmount?: number | null;
    paymentType?: PaymentType | null;
    taxAmount?: number | null;
    currency?: string | null;
    feeIds?: Array<string | null> | null;
    ipAddress?: string | null;
    status: PaymentStatus;
    payerUserStatus?: PayerUserStatus | null;
    declinedReason?: string | null;
    scheduledAt?: string | null;
    paidAt?: string | null;
    declinedAt?: string | null;
    createdAt?: string | null;
    receivedAt?: string | null;
    paidOutAt?: string | null;
    updatedAt?: string | null;
    voidedAt?: string | null;
    owner?: string | null;
  } | null> | null;
};

export type CreateTaskPaymentMutationVariables = {
  input?: CreateTaskPaymentInput | null;
};

export type CreateTaskPaymentMutation = {
  createTaskPayment?: Array<{
    __typename: 'Payment';
    id: string;
    taskId?: string | null;
    entityId?: string | null;
    payInPaymentId?: string | null;
    providerTransactionId?: string | null;
    paymentProvider?: PaymentProvider | null;
    disbursementId?: string | null;
    fromId: string;
    fromType: FromToType;
    toId?: string | null;
    toType?: FromToType | null;
    buyerId?: string | null;
    sellerId?: string | null;
    entityIdTo?: string | null;
    amount?: number | null;
    netAmount?: number | null;
    payerFees?: number | null;
    totalAmount?: number | null;
    gstAmount?: number | null;
    installment?: number | null;
    installments?: number | null;
    feeAmount?: number | null;
    paymentType?: PaymentType | null;
    taxAmount?: number | null;
    currency?: string | null;
    feeIds?: Array<string | null> | null;
    ipAddress?: string | null;
    status: PaymentStatus;
    payerUserStatus?: PayerUserStatus | null;
    declinedReason?: string | null;
    scheduledAt?: string | null;
    paidAt?: string | null;
    declinedAt?: string | null;
    createdAt?: string | null;
    receivedAt?: string | null;
    paidOutAt?: string | null;
    updatedAt?: string | null;
    voidedAt?: string | null;
    owner?: string | null;
  } | null> | null;
};

export type CreatePaymentGuestMutationVariables = {
  input?: CreatePaymentGuestInput | null;
};

export type CreatePaymentGuestMutation = {
  createPaymentGuest?: Array<{
    __typename: 'PaymentGuest';
    id: string;
    entityId: string;
    taskId?: string | null;
    amount?: number | null;
    installment?: number | null;
    installments?: number | null;
    feeAmount?: number | null;
    paymentType?: PaymentType | null;
    taxAmount?: number | null;
    currency?: string | null;
    feeId?: string | null;
    status: PaymentStatus;
    payerUserStatus?: PayerUserStatus | null;
    scheduledAt?: string | null;
    paidAt?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    owner?: string | null;
  } | null> | null;
};

export type CreatePaymentScheduledGuestMutationVariables = {
  input?: CreatePaymentScheduledGuestInput | null;
};

export type CreatePaymentScheduledGuestMutation = {
  createPaymentScheduledGuest?: Array<{
    __typename: 'PaymentGuest';
    id: string;
    entityId: string;
    taskId?: string | null;
    amount?: number | null;
    installment?: number | null;
    installments?: number | null;
    feeAmount?: number | null;
    paymentType?: PaymentType | null;
    taxAmount?: number | null;
    currency?: string | null;
    feeId?: string | null;
    status: PaymentStatus;
    payerUserStatus?: PayerUserStatus | null;
    scheduledAt?: string | null;
    paidAt?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    owner?: string | null;
  } | null> | null;
};

export type CreatePaymentMethodMutationVariables = {
  input?: CreatePaymentMethodInput | null;
};

export type CreatePaymentMethodMutation = {
  createPaymentMethod?: {
    __typename: 'PaymentMethod';
    id: string;
    paymentMethodType: PaymentMethodType;
    type?: string | null;
    fullName?: string | null;
    number?: string | null;
    expMonth?: string | null;
    expYear?: string | null;
    accountName?: string | null;
    bankName?: string | null;
    accountNumber?: string | null;
    routingNumber?: string | null;
    holderType?: BankHolderType | null;
    accountType?: BankAccountType | null;
    status?: PaymentMethodStatus | null;
    accountDirection?: AccountDirection | null;
    expiresAt?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null;
};

export type UpdatePaymentMethodMutationVariables = {
  input?: UpdatePaymentMethodInput | null;
};

export type UpdatePaymentMethodMutation = {
  updatePaymentMethod?: {
    __typename: 'PaymentMethod';
    id: string;
    paymentMethodType: PaymentMethodType;
    type?: string | null;
    fullName?: string | null;
    number?: string | null;
    expMonth?: string | null;
    expYear?: string | null;
    accountName?: string | null;
    bankName?: string | null;
    accountNumber?: string | null;
    routingNumber?: string | null;
    holderType?: BankHolderType | null;
    accountType?: BankAccountType | null;
    status?: PaymentMethodStatus | null;
    accountDirection?: AccountDirection | null;
    expiresAt?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null;
};

export type CreatePushNotificationMutationVariables = {
  input?: CreatePushNotificationInput | null;
};

export type CreatePushNotificationMutation = {
  createPushNotification?: string | null;
};

export type UpdateRatingMutationVariables = {
  input?: UpdateRatingInput | null;
};

export type UpdateRatingMutation = {
  updateRating?: {
    __typename: 'Rating';
    id: string;
    ratingBy?: string | null;
    owner?: string | null;
    name?: string | null;
    rating?: number | null;
    comment?: string | null;
    status?: RatingStatus | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null;
};

export type CreateSignatureMutationVariables = {
  input?: CreateSignatureInput | null;
};

export type CreateSignatureMutation = {
  createSignature?: {
    __typename: 'Signature';
    id: string;
    userId: string;
    key: string;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null;
};

export type DeleteSignatureMutationVariables = {
  input?: DeleteSignatureInput | null;
};

export type DeleteSignatureMutation = {
  deleteSignature?: {
    __typename: 'Signature';
    id: string;
    userId: string;
    key: string;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null;
};

export type CreateTaskMutationVariables = {
  input?: CreateTaskInput | null;
};

export type CreateTaskMutation = {
  createTask?: {
    __typename: 'Task';
    entityId: string;
    taskNumber?: string | null;
    invoiceStatus?: InvoiceStatus | null;
    agreementUuid?: string | null;
    id: string;
    activity?: {
      __typename: 'ModelActivityConnection';
      items: Array<{
        __typename: 'Activity';
        id: string;
        compositeId: string;
        userId?: string | null;
        entityId?: string | null;
        type: ActivityType;
        message?: string | null;
        metadata?: {
          __typename: 'ActivityMetadata';
          name?: string | null;
        } | null;
        createdAt?: string | null;
        updatedAt?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    amount?: number | null;
    annotations?: string | null;
    entityIdFrom?: string | null;
    fromId: string;
    fromType: FromToType;
    toId?: string | null;
    toType?: FromToType | null;
    entityIdTo?: string | null;
    contactIdFrom?: string | null;
    contactIdTo?: string | null;
    contactId?: string | null;
    fromSearchStatus?: string | null;
    toSearchStatus?: string | null;
    entityByIdContactId?: string | null;
    searchName?: string | null;
    status: TaskStatus;
    signatureStatus?: TaskSignatureStatus | null;
    paymentStatus?: TaskPaymentStatus | null;
    type: TaskType;
    category?: TaskCategory | null;
    documents?: Array<{
      __typename: 'S3Upload';
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type: S3UploadType;
    } | null> | null;
    numberOfPayments?: number | null;
    paymentFrequency?: PaymentFrequency | null;
    paymentTypes: Array<PaymentType | null>;
    reference?: string | null;
    bpayReferenceNumber?: string | null;
    settlementStatus?: TaskSettlementStatus | null;
    signers?: Array<{
      __typename: 'EntityUser';
      id: string;
      entityId: string;
      userId: string;
      invitedEmail?: string | null;
      referredBy?: string | null;
      invitedEntityId?: string | null;
      firmEntityId?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      role?: EntityUserRole | null;
      paymentsEnabled?: boolean | null;
      entitySearchName?: string | null;
      entity?: {
        __typename: 'Entity';
        id: string;
        type: EntityType;
        taxNumber?: string | null;
        companyNumber?: string | null;
        billerCode?: number | null;
        name: string;
        legalName?: string | null;
        searchName?: string | null;
        address?: {
          __typename: 'Address';
          addressId?: string | null;
          placeId?: string | null;
          contactName?: string | null;
          contactNumber?: string | null;
          addressFull?: string | null;
          address1?: string | null;
          address2?: string | null;
          unitNumber?: string | null;
          streetNumber?: string | null;
          streetName?: string | null;
          streetType?: string | null;
          city: string;
          country: string;
          countryCode?: string | null;
          state: string;
          stateCode?: string | null;
          postalCode: string;
        } | null;
        logo?: {
          __typename: 'Image';
          alt?: string | null;
          identityId?: string | null;
          key: string;
          level: S3UploadLevel;
          type?: string | null;
        } | null;
        entityBeneficialOwners?: {
          __typename: 'ModelEntityBeneficialOwnerConnection';
          items?: Array<{
            __typename: 'EntityBeneficialOwner';
            entityId: string;
            beneficialOwnerId: string;
            beneficialOwner?: {
              __typename: 'BeneficialOwner';
              id: string;
              firstName?: string | null;
              lastName?: string | null;
              name?: string | null;
              providerEntityId: string;
              verificationStatus: VerificationStatus;
              verificationAttempt?: number | null;
              createdBy?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
            } | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            owner?: string | null;
          } | null> | null;
          nextToken?: string | null;
        } | null;
        entityUsers?: {
          __typename: 'ModelEntityUserConnection';
          items: Array<{
            __typename: 'EntityUser';
            id: string;
            entityId: string;
            userId: string;
            invitedEmail?: string | null;
            referredBy?: string | null;
            invitedEntityId?: string | null;
            firmEntityId?: string | null;
            firstName?: string | null;
            lastName?: string | null;
            role?: EntityUserRole | null;
            paymentsEnabled?: boolean | null;
            entitySearchName?: string | null;
            entity?: {
              __typename: 'Entity';
              id: string;
              type: EntityType;
              taxNumber?: string | null;
              companyNumber?: string | null;
              billerCode?: number | null;
              name: string;
              legalName?: string | null;
              searchName?: string | null;
              address?: {
                __typename: 'Address';
                addressId?: string | null;
                placeId?: string | null;
                contactName?: string | null;
                contactNumber?: string | null;
                addressFull?: string | null;
                address1?: string | null;
                address2?: string | null;
                unitNumber?: string | null;
                streetNumber?: string | null;
                streetName?: string | null;
                streetType?: string | null;
                city: string;
                country: string;
                countryCode?: string | null;
                state: string;
                stateCode?: string | null;
                postalCode: string;
              } | null;
              logo?: {
                __typename: 'Image';
                alt?: string | null;
                identityId?: string | null;
                key: string;
                level: S3UploadLevel;
                type?: string | null;
              } | null;
              entityBeneficialOwners?: {
                __typename: 'ModelEntityBeneficialOwnerConnection';
                nextToken?: string | null;
              } | null;
              entityUsers?: {
                __typename: 'ModelEntityUserConnection';
                nextToken?: string | null;
              } | null;
              gstRegistered?: boolean | null;
              providerEntityId?: string | null;
              providerCompanyId?: string | null;
              providerBillUserCompanyId?: string | null;
              providerBankAccountId?: string | null;
              providerDigitalWalletId?: string | null;
              providerBpayCrn?: string | null;
              contact?: {
                __typename: 'EntityContact';
                firstName?: string | null;
                lastName?: string | null;
                email?: string | null;
                phone?: string | null;
                role?: string | null;
              } | null;
              paymentMethods?: {
                __typename: 'ModelPaymentMethodConnection';
                nextToken?: string | null;
              } | null;
              paymentMethodId?: string | null;
              paymentUserId?: string | null;
              disbursementMethodId?: string | null;
              receivingAccounts?: {
                __typename: 'ModelPaymentMethodConnection';
                nextToken?: string | null;
              } | null;
              ubosCreated?: boolean | null;
              numUbosCreated?: number | null;
              subCategory?: string | null;
              clientsStatus?: EntityClientsStatus | null;
              ocrEmail?: string | null;
              verificationStatus?: VerificationStatus | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              owner: string;
              referredBy?: string | null;
              xeroContactSyncStatus?: XeroSyncStatus | null;
              xeroLastContactSyncAt?: string | null;
              xeroInvoiceSyncStatus?: XeroSyncStatus | null;
              xeroLastInvoiceSyncAt?: string | null;
              xeroTenantId?: string | null;
            } | null;
            searchName?: string | null;
            createdBy?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            status?: EntityUserStatus | null;
          } | null>;
          nextToken?: string | null;
        } | null;
        gstRegistered?: boolean | null;
        providerEntityId?: string | null;
        providerCompanyId?: string | null;
        providerBillUserCompanyId?: string | null;
        providerBankAccountId?: string | null;
        providerDigitalWalletId?: string | null;
        providerBpayCrn?: string | null;
        contact?: {
          __typename: 'EntityContact';
          firstName?: string | null;
          lastName?: string | null;
          email?: string | null;
          phone?: string | null;
          role?: string | null;
        } | null;
        paymentMethods?: {
          __typename: 'ModelPaymentMethodConnection';
          items: Array<{
            __typename: 'PaymentMethod';
            id: string;
            paymentMethodType: PaymentMethodType;
            type?: string | null;
            fullName?: string | null;
            number?: string | null;
            expMonth?: string | null;
            expYear?: string | null;
            accountName?: string | null;
            bankName?: string | null;
            accountNumber?: string | null;
            routingNumber?: string | null;
            holderType?: BankHolderType | null;
            accountType?: BankAccountType | null;
            status?: PaymentMethodStatus | null;
            accountDirection?: AccountDirection | null;
            expiresAt?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
          } | null>;
          nextToken?: string | null;
        } | null;
        paymentMethodId?: string | null;
        paymentUserId?: string | null;
        disbursementMethodId?: string | null;
        receivingAccounts?: {
          __typename: 'ModelPaymentMethodConnection';
          items: Array<{
            __typename: 'PaymentMethod';
            id: string;
            paymentMethodType: PaymentMethodType;
            type?: string | null;
            fullName?: string | null;
            number?: string | null;
            expMonth?: string | null;
            expYear?: string | null;
            accountName?: string | null;
            bankName?: string | null;
            accountNumber?: string | null;
            routingNumber?: string | null;
            holderType?: BankHolderType | null;
            accountType?: BankAccountType | null;
            status?: PaymentMethodStatus | null;
            accountDirection?: AccountDirection | null;
            expiresAt?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
          } | null>;
          nextToken?: string | null;
        } | null;
        ubosCreated?: boolean | null;
        numUbosCreated?: number | null;
        subCategory?: string | null;
        clientsStatus?: EntityClientsStatus | null;
        ocrEmail?: string | null;
        verificationStatus?: VerificationStatus | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        owner: string;
        referredBy?: string | null;
        xeroContactSyncStatus?: XeroSyncStatus | null;
        xeroLastContactSyncAt?: string | null;
        xeroInvoiceSyncStatus?: XeroSyncStatus | null;
        xeroLastInvoiceSyncAt?: string | null;
        xeroTenantId?: string | null;
      } | null;
      searchName?: string | null;
      createdBy?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      status?: EntityUserStatus | null;
    } | null> | null;
    otherRecipients?: Array<{
      __typename: 'OtherRecipient';
      email: string;
      sendOnCompletion: boolean;
    } | null> | null;
    payments?: {
      __typename: 'ModelPaymentConnection';
      items: Array<{
        __typename: 'Payment';
        id: string;
        taskId?: string | null;
        entityId?: string | null;
        payInPaymentId?: string | null;
        providerTransactionId?: string | null;
        paymentProvider?: PaymentProvider | null;
        disbursementId?: string | null;
        fromId: string;
        fromType: FromToType;
        toId?: string | null;
        toType?: FromToType | null;
        buyerId?: string | null;
        sellerId?: string | null;
        entityIdTo?: string | null;
        amount?: number | null;
        netAmount?: number | null;
        payerFees?: number | null;
        totalAmount?: number | null;
        gstAmount?: number | null;
        installment?: number | null;
        installments?: number | null;
        feeAmount?: number | null;
        paymentType?: PaymentType | null;
        taxAmount?: number | null;
        currency?: string | null;
        feeIds?: Array<string | null> | null;
        ipAddress?: string | null;
        status: PaymentStatus;
        payerUserStatus?: PayerUserStatus | null;
        declinedReason?: string | null;
        scheduledAt?: string | null;
        paidAt?: string | null;
        declinedAt?: string | null;
        createdAt?: string | null;
        receivedAt?: string | null;
        paidOutAt?: string | null;
        updatedAt?: string | null;
        voidedAt?: string | null;
        owner?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    createdBy: string;
    entityIdBy?: string | null;
    dueAt: string;
    notes?: string | null;
    direction?: TaskDirection | null;
    readBy?: Array<string | null> | null;
    gstInclusive?: boolean | null;
    paymentAt?: string | null;
    lodgementAt?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    viewedAt?: string | null;
    readAt?: string | null;
    paidAt?: string | null;
    completedAt?: string | null;
    owner?: string | null;
    lineItems?: Array<{
      __typename: 'LineItem';
      description?: string | null;
      quantity?: number | null;
      unitAmount?: number | null;
      taxType?: string | null;
      lineAmount?: number | null;
    } | null> | null;
    xeroTenantId?: string | null;
  } | null;
};

export type UpdateTaskMutationVariables = {
  input?: UpdateTaskInput | null;
};

export type UpdateTaskMutation = {
  updateTask?: {
    __typename: 'Task';
    entityId: string;
    taskNumber?: string | null;
    invoiceStatus?: InvoiceStatus | null;
    agreementUuid?: string | null;
    id: string;
    activity?: {
      __typename: 'ModelActivityConnection';
      items: Array<{
        __typename: 'Activity';
        id: string;
        compositeId: string;
        userId?: string | null;
        entityId?: string | null;
        type: ActivityType;
        message?: string | null;
        metadata?: {
          __typename: 'ActivityMetadata';
          name?: string | null;
        } | null;
        createdAt?: string | null;
        updatedAt?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    amount?: number | null;
    annotations?: string | null;
    entityIdFrom?: string | null;
    fromId: string;
    fromType: FromToType;
    toId?: string | null;
    toType?: FromToType | null;
    entityIdTo?: string | null;
    contactIdFrom?: string | null;
    contactIdTo?: string | null;
    contactId?: string | null;
    fromSearchStatus?: string | null;
    toSearchStatus?: string | null;
    entityByIdContactId?: string | null;
    searchName?: string | null;
    status: TaskStatus;
    signatureStatus?: TaskSignatureStatus | null;
    paymentStatus?: TaskPaymentStatus | null;
    type: TaskType;
    category?: TaskCategory | null;
    documents?: Array<{
      __typename: 'S3Upload';
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type: S3UploadType;
    } | null> | null;
    numberOfPayments?: number | null;
    paymentFrequency?: PaymentFrequency | null;
    paymentTypes: Array<PaymentType | null>;
    reference?: string | null;
    bpayReferenceNumber?: string | null;
    settlementStatus?: TaskSettlementStatus | null;
    signers?: Array<{
      __typename: 'EntityUser';
      id: string;
      entityId: string;
      userId: string;
      invitedEmail?: string | null;
      referredBy?: string | null;
      invitedEntityId?: string | null;
      firmEntityId?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      role?: EntityUserRole | null;
      paymentsEnabled?: boolean | null;
      entitySearchName?: string | null;
      entity?: {
        __typename: 'Entity';
        id: string;
        type: EntityType;
        taxNumber?: string | null;
        companyNumber?: string | null;
        billerCode?: number | null;
        name: string;
        legalName?: string | null;
        searchName?: string | null;
        address?: {
          __typename: 'Address';
          addressId?: string | null;
          placeId?: string | null;
          contactName?: string | null;
          contactNumber?: string | null;
          addressFull?: string | null;
          address1?: string | null;
          address2?: string | null;
          unitNumber?: string | null;
          streetNumber?: string | null;
          streetName?: string | null;
          streetType?: string | null;
          city: string;
          country: string;
          countryCode?: string | null;
          state: string;
          stateCode?: string | null;
          postalCode: string;
        } | null;
        logo?: {
          __typename: 'Image';
          alt?: string | null;
          identityId?: string | null;
          key: string;
          level: S3UploadLevel;
          type?: string | null;
        } | null;
        entityBeneficialOwners?: {
          __typename: 'ModelEntityBeneficialOwnerConnection';
          items?: Array<{
            __typename: 'EntityBeneficialOwner';
            entityId: string;
            beneficialOwnerId: string;
            beneficialOwner?: {
              __typename: 'BeneficialOwner';
              id: string;
              firstName?: string | null;
              lastName?: string | null;
              name?: string | null;
              providerEntityId: string;
              verificationStatus: VerificationStatus;
              verificationAttempt?: number | null;
              createdBy?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
            } | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            owner?: string | null;
          } | null> | null;
          nextToken?: string | null;
        } | null;
        entityUsers?: {
          __typename: 'ModelEntityUserConnection';
          items: Array<{
            __typename: 'EntityUser';
            id: string;
            entityId: string;
            userId: string;
            invitedEmail?: string | null;
            referredBy?: string | null;
            invitedEntityId?: string | null;
            firmEntityId?: string | null;
            firstName?: string | null;
            lastName?: string | null;
            role?: EntityUserRole | null;
            paymentsEnabled?: boolean | null;
            entitySearchName?: string | null;
            entity?: {
              __typename: 'Entity';
              id: string;
              type: EntityType;
              taxNumber?: string | null;
              companyNumber?: string | null;
              billerCode?: number | null;
              name: string;
              legalName?: string | null;
              searchName?: string | null;
              address?: {
                __typename: 'Address';
                addressId?: string | null;
                placeId?: string | null;
                contactName?: string | null;
                contactNumber?: string | null;
                addressFull?: string | null;
                address1?: string | null;
                address2?: string | null;
                unitNumber?: string | null;
                streetNumber?: string | null;
                streetName?: string | null;
                streetType?: string | null;
                city: string;
                country: string;
                countryCode?: string | null;
                state: string;
                stateCode?: string | null;
                postalCode: string;
              } | null;
              logo?: {
                __typename: 'Image';
                alt?: string | null;
                identityId?: string | null;
                key: string;
                level: S3UploadLevel;
                type?: string | null;
              } | null;
              entityBeneficialOwners?: {
                __typename: 'ModelEntityBeneficialOwnerConnection';
                nextToken?: string | null;
              } | null;
              entityUsers?: {
                __typename: 'ModelEntityUserConnection';
                nextToken?: string | null;
              } | null;
              gstRegistered?: boolean | null;
              providerEntityId?: string | null;
              providerCompanyId?: string | null;
              providerBillUserCompanyId?: string | null;
              providerBankAccountId?: string | null;
              providerDigitalWalletId?: string | null;
              providerBpayCrn?: string | null;
              contact?: {
                __typename: 'EntityContact';
                firstName?: string | null;
                lastName?: string | null;
                email?: string | null;
                phone?: string | null;
                role?: string | null;
              } | null;
              paymentMethods?: {
                __typename: 'ModelPaymentMethodConnection';
                nextToken?: string | null;
              } | null;
              paymentMethodId?: string | null;
              paymentUserId?: string | null;
              disbursementMethodId?: string | null;
              receivingAccounts?: {
                __typename: 'ModelPaymentMethodConnection';
                nextToken?: string | null;
              } | null;
              ubosCreated?: boolean | null;
              numUbosCreated?: number | null;
              subCategory?: string | null;
              clientsStatus?: EntityClientsStatus | null;
              ocrEmail?: string | null;
              verificationStatus?: VerificationStatus | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              owner: string;
              referredBy?: string | null;
              xeroContactSyncStatus?: XeroSyncStatus | null;
              xeroLastContactSyncAt?: string | null;
              xeroInvoiceSyncStatus?: XeroSyncStatus | null;
              xeroLastInvoiceSyncAt?: string | null;
              xeroTenantId?: string | null;
            } | null;
            searchName?: string | null;
            createdBy?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            status?: EntityUserStatus | null;
          } | null>;
          nextToken?: string | null;
        } | null;
        gstRegistered?: boolean | null;
        providerEntityId?: string | null;
        providerCompanyId?: string | null;
        providerBillUserCompanyId?: string | null;
        providerBankAccountId?: string | null;
        providerDigitalWalletId?: string | null;
        providerBpayCrn?: string | null;
        contact?: {
          __typename: 'EntityContact';
          firstName?: string | null;
          lastName?: string | null;
          email?: string | null;
          phone?: string | null;
          role?: string | null;
        } | null;
        paymentMethods?: {
          __typename: 'ModelPaymentMethodConnection';
          items: Array<{
            __typename: 'PaymentMethod';
            id: string;
            paymentMethodType: PaymentMethodType;
            type?: string | null;
            fullName?: string | null;
            number?: string | null;
            expMonth?: string | null;
            expYear?: string | null;
            accountName?: string | null;
            bankName?: string | null;
            accountNumber?: string | null;
            routingNumber?: string | null;
            holderType?: BankHolderType | null;
            accountType?: BankAccountType | null;
            status?: PaymentMethodStatus | null;
            accountDirection?: AccountDirection | null;
            expiresAt?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
          } | null>;
          nextToken?: string | null;
        } | null;
        paymentMethodId?: string | null;
        paymentUserId?: string | null;
        disbursementMethodId?: string | null;
        receivingAccounts?: {
          __typename: 'ModelPaymentMethodConnection';
          items: Array<{
            __typename: 'PaymentMethod';
            id: string;
            paymentMethodType: PaymentMethodType;
            type?: string | null;
            fullName?: string | null;
            number?: string | null;
            expMonth?: string | null;
            expYear?: string | null;
            accountName?: string | null;
            bankName?: string | null;
            accountNumber?: string | null;
            routingNumber?: string | null;
            holderType?: BankHolderType | null;
            accountType?: BankAccountType | null;
            status?: PaymentMethodStatus | null;
            accountDirection?: AccountDirection | null;
            expiresAt?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
          } | null>;
          nextToken?: string | null;
        } | null;
        ubosCreated?: boolean | null;
        numUbosCreated?: number | null;
        subCategory?: string | null;
        clientsStatus?: EntityClientsStatus | null;
        ocrEmail?: string | null;
        verificationStatus?: VerificationStatus | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        owner: string;
        referredBy?: string | null;
        xeroContactSyncStatus?: XeroSyncStatus | null;
        xeroLastContactSyncAt?: string | null;
        xeroInvoiceSyncStatus?: XeroSyncStatus | null;
        xeroLastInvoiceSyncAt?: string | null;
        xeroTenantId?: string | null;
      } | null;
      searchName?: string | null;
      createdBy?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      status?: EntityUserStatus | null;
    } | null> | null;
    otherRecipients?: Array<{
      __typename: 'OtherRecipient';
      email: string;
      sendOnCompletion: boolean;
    } | null> | null;
    payments?: {
      __typename: 'ModelPaymentConnection';
      items: Array<{
        __typename: 'Payment';
        id: string;
        taskId?: string | null;
        entityId?: string | null;
        payInPaymentId?: string | null;
        providerTransactionId?: string | null;
        paymentProvider?: PaymentProvider | null;
        disbursementId?: string | null;
        fromId: string;
        fromType: FromToType;
        toId?: string | null;
        toType?: FromToType | null;
        buyerId?: string | null;
        sellerId?: string | null;
        entityIdTo?: string | null;
        amount?: number | null;
        netAmount?: number | null;
        payerFees?: number | null;
        totalAmount?: number | null;
        gstAmount?: number | null;
        installment?: number | null;
        installments?: number | null;
        feeAmount?: number | null;
        paymentType?: PaymentType | null;
        taxAmount?: number | null;
        currency?: string | null;
        feeIds?: Array<string | null> | null;
        ipAddress?: string | null;
        status: PaymentStatus;
        payerUserStatus?: PayerUserStatus | null;
        declinedReason?: string | null;
        scheduledAt?: string | null;
        paidAt?: string | null;
        declinedAt?: string | null;
        createdAt?: string | null;
        receivedAt?: string | null;
        paidOutAt?: string | null;
        updatedAt?: string | null;
        voidedAt?: string | null;
        owner?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    createdBy: string;
    entityIdBy?: string | null;
    dueAt: string;
    notes?: string | null;
    direction?: TaskDirection | null;
    readBy?: Array<string | null> | null;
    gstInclusive?: boolean | null;
    paymentAt?: string | null;
    lodgementAt?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    viewedAt?: string | null;
    readAt?: string | null;
    paidAt?: string | null;
    completedAt?: string | null;
    owner?: string | null;
    lineItems?: Array<{
      __typename: 'LineItem';
      description?: string | null;
      quantity?: number | null;
      unitAmount?: number | null;
      taxType?: string | null;
      lineAmount?: number | null;
    } | null> | null;
    xeroTenantId?: string | null;
  } | null;
};

export type UpdateTaskGuestMutationVariables = {
  input?: UpdateTaskGuestInput | null;
};

export type UpdateTaskGuestMutation = {
  updateTaskGuest?: {
    __typename: 'TaskGuest';
    id: string;
    entityId: string;
    amount?: number | null;
    annotations?: string | null;
    fromId: string;
    fromEntity?: {
      __typename: 'EntityGuest';
      id: string;
      name: string;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    from?: {
      __typename: 'EntityGuest';
      id: string;
      name: string;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    fromContact?: {
      __typename: 'ContactGuest';
      id: string;
      firstName?: string | null;
      lastName?: string | null;
      name?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    fromType?: FromToType | null;
    toEntity?: {
      __typename: 'EntityGuest';
      id: string;
      name: string;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    toContact?: {
      __typename: 'ContactGuest';
      id: string;
      firstName?: string | null;
      lastName?: string | null;
      name?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    toId?: string | null;
    to?: {
      __typename: 'EntityGuest';
      id: string;
      name: string;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    toType?: FromToType | null;
    status: TaskStatus;
    signatureStatus?: TaskSignatureStatus | null;
    paymentStatus?: TaskPaymentStatus | null;
    settlementStatus?: TaskSettlementStatus | null;
    type: TaskType;
    category?: TaskCategory | null;
    documents?: Array<{
      __typename: 'S3Upload';
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type: S3UploadType;
    } | null> | null;
    numberOfPayments?: number | null;
    paymentFrequency?: PaymentFrequency | null;
    paymentTypes: Array<PaymentType | null>;
    reference?: string | null;
    bpayReferenceNumber?: string | null;
    createdBy: string;
    gstInclusive?: boolean | null;
    entityIdBy?: string | null;
    dueAt: string;
    notes?: string | null;
    direction?: TaskDirection | null;
    paymentAt?: string | null;
    lodgementAt?: string | null;
    readAt?: string | null;
    paidAt?: string | null;
    completedAt?: string | null;
    owner?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null;
};

export type UpdateTaskPublicMutationVariables = {
  input?: UpdateTaskPublicInput | null;
};

export type UpdateTaskPublicMutation = {
  updateTaskPublic?: {
    __typename: 'TaskGuest';
    id: string;
    entityId: string;
    amount?: number | null;
    annotations?: string | null;
    fromId: string;
    fromEntity?: {
      __typename: 'EntityGuest';
      id: string;
      name: string;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    from?: {
      __typename: 'EntityGuest';
      id: string;
      name: string;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    fromContact?: {
      __typename: 'ContactGuest';
      id: string;
      firstName?: string | null;
      lastName?: string | null;
      name?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    fromType?: FromToType | null;
    toEntity?: {
      __typename: 'EntityGuest';
      id: string;
      name: string;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    toContact?: {
      __typename: 'ContactGuest';
      id: string;
      firstName?: string | null;
      lastName?: string | null;
      name?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    toId?: string | null;
    to?: {
      __typename: 'EntityGuest';
      id: string;
      name: string;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    toType?: FromToType | null;
    status: TaskStatus;
    signatureStatus?: TaskSignatureStatus | null;
    paymentStatus?: TaskPaymentStatus | null;
    settlementStatus?: TaskSettlementStatus | null;
    type: TaskType;
    category?: TaskCategory | null;
    documents?: Array<{
      __typename: 'S3Upload';
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type: S3UploadType;
    } | null> | null;
    numberOfPayments?: number | null;
    paymentFrequency?: PaymentFrequency | null;
    paymentTypes: Array<PaymentType | null>;
    reference?: string | null;
    bpayReferenceNumber?: string | null;
    createdBy: string;
    gstInclusive?: boolean | null;
    entityIdBy?: string | null;
    dueAt: string;
    notes?: string | null;
    direction?: TaskDirection | null;
    paymentAt?: string | null;
    lodgementAt?: string | null;
    readAt?: string | null;
    paidAt?: string | null;
    completedAt?: string | null;
    owner?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null;
};

export type CreateTaskDocumentUrlMutationVariables = {
  input?: CreateTaskDocumentUrlInput | null;
};

export type CreateTaskDocumentUrlMutation = {
  createTaskDocumentUrl?: {
    __typename: 'TaskDocumentUrl';
    url?: string | null;
    expiresAt?: string | null;
  } | null;
};

export type CreateTaskDocumentUrlGuestMutationVariables = {
  input?: CreateTaskDocumentUrlInput | null;
};

export type CreateTaskDocumentUrlGuestMutation = {
  createTaskDocumentUrlGuest?: {
    __typename: 'TaskDocumentUrl';
    url?: string | null;
    expiresAt?: string | null;
  } | null;
};

export type CreateTranslationMutationVariables = {
  input?: CreateTranslationInput | null;
};

export type CreateTranslationMutation = {
  createTranslation?: {
    __typename: 'Translation';
    language: string;
    namespace: string;
    data?: string | null;
  } | null;
};

export type UpdateTranslationMutationVariables = {
  input?: UpdateTranslationInput | null;
};

export type UpdateTranslationMutation = {
  updateTranslation?: {
    __typename: 'Translation';
    language: string;
    namespace: string;
    data?: string | null;
  } | null;
};

export type UpdateUserMutationVariables = {
  input?: UpdateUserInput | null;
};

export type UpdateUserMutation = {
  updateUser?: {
    __typename: 'User';
    id: string;
    identityId?: string | null;
    referralCode?: string | null;
    referredBy?: string | null;
    email?: string | null;
    about?: string | null;
    firstName?: string | null;
    firmId?: string | null;
    lastName?: string | null;
    phone?: string | null;
    blocked?: Array<string | null> | null;
    blockedBy?: Array<string | null> | null;
    country?: string | null;
    profileImg?: {
      __typename: 'Image';
      alt?: string | null;
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type?: string | null;
    } | null;
    interests?: Array<string | null> | null;
    locale?: string | null;
    onboardingStatus?: OnboardingStatus | null;
    onboardingEntity?: string | null;
    selectedSignatureKey?: string | null;
    signatures?: {
      __typename: 'ModelSignatureConnection';
      items: Array<{
        __typename: 'Signature';
        id: string;
        userId: string;
        key: string;
        createdAt?: string | null;
        updatedAt?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    userType?: UserType | null;
    rating?: number | null;
    reportReasons?: Array<string | null> | null;
    notificationPreferences?: {
      __typename: 'NotificationPreferences';
      email?: boolean | null;
      push?: boolean | null;
      sms?: boolean | null;
    } | null;
    paymentUserId?: string | null;
    providerWalletId?: string | null;
    providerNppCrn?: string | null;
    ipAddress?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    owner?: string | null;
    loyaltyStatus?: RewardStatus | null;
    nextLoyaltyStatus?: RewardStatus | null;
    nextLoyaltyStatusPoint?: number | null;
    statusPoint?: number | null;
    pointsTotal?: number | null;
    pointsBalance?: number | null;
    invitedTo?: string | null;
  } | null;
};

export type BlockUserMutationVariables = {
  input?: BlockUserInput | null;
};

export type BlockUserMutation = {
  blockUser?: {
    __typename: 'User';
    id: string;
    identityId?: string | null;
    referralCode?: string | null;
    referredBy?: string | null;
    email?: string | null;
    about?: string | null;
    firstName?: string | null;
    firmId?: string | null;
    lastName?: string | null;
    phone?: string | null;
    blocked?: Array<string | null> | null;
    blockedBy?: Array<string | null> | null;
    country?: string | null;
    profileImg?: {
      __typename: 'Image';
      alt?: string | null;
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type?: string | null;
    } | null;
    interests?: Array<string | null> | null;
    locale?: string | null;
    onboardingStatus?: OnboardingStatus | null;
    onboardingEntity?: string | null;
    selectedSignatureKey?: string | null;
    signatures?: {
      __typename: 'ModelSignatureConnection';
      items: Array<{
        __typename: 'Signature';
        id: string;
        userId: string;
        key: string;
        createdAt?: string | null;
        updatedAt?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    userType?: UserType | null;
    rating?: number | null;
    reportReasons?: Array<string | null> | null;
    notificationPreferences?: {
      __typename: 'NotificationPreferences';
      email?: boolean | null;
      push?: boolean | null;
      sms?: boolean | null;
    } | null;
    paymentUserId?: string | null;
    providerWalletId?: string | null;
    providerNppCrn?: string | null;
    ipAddress?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    owner?: string | null;
    loyaltyStatus?: RewardStatus | null;
    nextLoyaltyStatus?: RewardStatus | null;
    nextLoyaltyStatusPoint?: number | null;
    statusPoint?: number | null;
    pointsTotal?: number | null;
    pointsBalance?: number | null;
    invitedTo?: string | null;
  } | null;
};

export type DeleteAccountMutation = {
  deleteAccount?: {
    __typename: 'User';
    id: string;
    identityId?: string | null;
    referralCode?: string | null;
    referredBy?: string | null;
    email?: string | null;
    about?: string | null;
    firstName?: string | null;
    firmId?: string | null;
    lastName?: string | null;
    phone?: string | null;
    blocked?: Array<string | null> | null;
    blockedBy?: Array<string | null> | null;
    country?: string | null;
    profileImg?: {
      __typename: 'Image';
      alt?: string | null;
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type?: string | null;
    } | null;
    interests?: Array<string | null> | null;
    locale?: string | null;
    onboardingStatus?: OnboardingStatus | null;
    onboardingEntity?: string | null;
    selectedSignatureKey?: string | null;
    signatures?: {
      __typename: 'ModelSignatureConnection';
      items: Array<{
        __typename: 'Signature';
        id: string;
        userId: string;
        key: string;
        createdAt?: string | null;
        updatedAt?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    userType?: UserType | null;
    rating?: number | null;
    reportReasons?: Array<string | null> | null;
    notificationPreferences?: {
      __typename: 'NotificationPreferences';
      email?: boolean | null;
      push?: boolean | null;
      sms?: boolean | null;
    } | null;
    paymentUserId?: string | null;
    providerWalletId?: string | null;
    providerNppCrn?: string | null;
    ipAddress?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    owner?: string | null;
    loyaltyStatus?: RewardStatus | null;
    nextLoyaltyStatus?: RewardStatus | null;
    nextLoyaltyStatusPoint?: number | null;
    statusPoint?: number | null;
    pointsTotal?: number | null;
    pointsBalance?: number | null;
    invitedTo?: string | null;
  } | null;
};

export type CreateUserConversationMutationVariables = {
  input: CreateUserConversationInput;
  condition?: ModelUserConversationConditionInput | null;
};

export type CreateUserConversationMutation = {
  createUserConversation?: {
    __typename: 'UserConversation';
    conversationId: string;
    conversation?: {
      __typename: 'Conversation';
      title?: string | null;
      image?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      country?: string | null;
      messages?: {
        __typename: 'ModelMessageConnection';
        items: Array<{
          __typename: 'Message';
          conversationId: string;
          text?: string | null;
          attachments?: Array<{
            __typename: 'S3Upload';
            identityId?: string | null;
            key: string;
            level: S3UploadLevel;
            type: S3UploadType;
          } | null> | null;
          users: Array<string | null>;
          receiver: string;
          sender: string;
          createdBy: string;
          readBy?: Array<string | null> | null;
          createdAt: string;
          updatedAt?: string | null;
          id: string;
          conversationMessagesId?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      userConversations?: {
        __typename: 'ModelUserConversationConnection';
        items: Array<{
          __typename: 'UserConversation';
          conversationId: string;
          conversation?: {
            __typename: 'Conversation';
            title?: string | null;
            image?: {
              __typename: 'Image';
              alt?: string | null;
              identityId?: string | null;
              key: string;
              level: S3UploadLevel;
              type?: string | null;
            } | null;
            country?: string | null;
            messages?: {
              __typename: 'ModelMessageConnection';
              items: Array<{
                __typename: 'Message';
                conversationId: string;
                text?: string | null;
                users: Array<string | null>;
                receiver: string;
                sender: string;
                createdBy: string;
                readBy?: Array<string | null> | null;
                createdAt: string;
                updatedAt?: string | null;
                id: string;
                conversationMessagesId?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            userConversations?: {
              __typename: 'ModelUserConversationConnection';
              items: Array<{
                __typename: 'UserConversation';
                conversationId: string;
                userId: string;
                users?: Array<string | null> | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                id: string;
                conversationUserConversationsId?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            users?: Array<string | null> | null;
            readBy?: Array<string | null> | null;
            createdBy?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            id: string;
          } | null;
          userId: string;
          user?: {
            __typename: 'User';
            id: string;
            identityId?: string | null;
            referralCode?: string | null;
            referredBy?: string | null;
            email?: string | null;
            about?: string | null;
            firstName?: string | null;
            firmId?: string | null;
            lastName?: string | null;
            phone?: string | null;
            blocked?: Array<string | null> | null;
            blockedBy?: Array<string | null> | null;
            country?: string | null;
            profileImg?: {
              __typename: 'Image';
              alt?: string | null;
              identityId?: string | null;
              key: string;
              level: S3UploadLevel;
              type?: string | null;
            } | null;
            interests?: Array<string | null> | null;
            locale?: string | null;
            onboardingStatus?: OnboardingStatus | null;
            onboardingEntity?: string | null;
            selectedSignatureKey?: string | null;
            signatures?: {
              __typename: 'ModelSignatureConnection';
              items: Array<{
                __typename: 'Signature';
                id: string;
                userId: string;
                key: string;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            userType?: UserType | null;
            rating?: number | null;
            reportReasons?: Array<string | null> | null;
            notificationPreferences?: {
              __typename: 'NotificationPreferences';
              email?: boolean | null;
              push?: boolean | null;
              sms?: boolean | null;
            } | null;
            paymentUserId?: string | null;
            providerWalletId?: string | null;
            providerNppCrn?: string | null;
            ipAddress?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            owner?: string | null;
            loyaltyStatus?: RewardStatus | null;
            nextLoyaltyStatus?: RewardStatus | null;
            nextLoyaltyStatusPoint?: number | null;
            statusPoint?: number | null;
            pointsTotal?: number | null;
            pointsBalance?: number | null;
            invitedTo?: string | null;
          } | null;
          users?: Array<string | null> | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          id: string;
          conversationUserConversationsId?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      users?: Array<string | null> | null;
      readBy?: Array<string | null> | null;
      createdBy?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
    } | null;
    userId: string;
    user?: {
      __typename: 'User';
      id: string;
      identityId?: string | null;
      referralCode?: string | null;
      referredBy?: string | null;
      email?: string | null;
      about?: string | null;
      firstName?: string | null;
      firmId?: string | null;
      lastName?: string | null;
      phone?: string | null;
      blocked?: Array<string | null> | null;
      blockedBy?: Array<string | null> | null;
      country?: string | null;
      profileImg?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      interests?: Array<string | null> | null;
      locale?: string | null;
      onboardingStatus?: OnboardingStatus | null;
      onboardingEntity?: string | null;
      selectedSignatureKey?: string | null;
      signatures?: {
        __typename: 'ModelSignatureConnection';
        items: Array<{
          __typename: 'Signature';
          id: string;
          userId: string;
          key: string;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      userType?: UserType | null;
      rating?: number | null;
      reportReasons?: Array<string | null> | null;
      notificationPreferences?: {
        __typename: 'NotificationPreferences';
        email?: boolean | null;
        push?: boolean | null;
        sms?: boolean | null;
      } | null;
      paymentUserId?: string | null;
      providerWalletId?: string | null;
      providerNppCrn?: string | null;
      ipAddress?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      owner?: string | null;
      loyaltyStatus?: RewardStatus | null;
      nextLoyaltyStatus?: RewardStatus | null;
      nextLoyaltyStatusPoint?: number | null;
      statusPoint?: number | null;
      pointsTotal?: number | null;
      pointsBalance?: number | null;
      invitedTo?: string | null;
    } | null;
    users?: Array<string | null> | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
    conversationUserConversationsId?: string | null;
  } | null;
};

export type UpdateUserConversationMutationVariables = {
  input: UpdateUserConversationInput;
  condition?: ModelUserConversationConditionInput | null;
};

export type UpdateUserConversationMutation = {
  updateUserConversation?: {
    __typename: 'UserConversation';
    conversationId: string;
    conversation?: {
      __typename: 'Conversation';
      title?: string | null;
      image?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      country?: string | null;
      messages?: {
        __typename: 'ModelMessageConnection';
        items: Array<{
          __typename: 'Message';
          conversationId: string;
          text?: string | null;
          attachments?: Array<{
            __typename: 'S3Upload';
            identityId?: string | null;
            key: string;
            level: S3UploadLevel;
            type: S3UploadType;
          } | null> | null;
          users: Array<string | null>;
          receiver: string;
          sender: string;
          createdBy: string;
          readBy?: Array<string | null> | null;
          createdAt: string;
          updatedAt?: string | null;
          id: string;
          conversationMessagesId?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      userConversations?: {
        __typename: 'ModelUserConversationConnection';
        items: Array<{
          __typename: 'UserConversation';
          conversationId: string;
          conversation?: {
            __typename: 'Conversation';
            title?: string | null;
            image?: {
              __typename: 'Image';
              alt?: string | null;
              identityId?: string | null;
              key: string;
              level: S3UploadLevel;
              type?: string | null;
            } | null;
            country?: string | null;
            messages?: {
              __typename: 'ModelMessageConnection';
              items: Array<{
                __typename: 'Message';
                conversationId: string;
                text?: string | null;
                users: Array<string | null>;
                receiver: string;
                sender: string;
                createdBy: string;
                readBy?: Array<string | null> | null;
                createdAt: string;
                updatedAt?: string | null;
                id: string;
                conversationMessagesId?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            userConversations?: {
              __typename: 'ModelUserConversationConnection';
              items: Array<{
                __typename: 'UserConversation';
                conversationId: string;
                userId: string;
                users?: Array<string | null> | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                id: string;
                conversationUserConversationsId?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            users?: Array<string | null> | null;
            readBy?: Array<string | null> | null;
            createdBy?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            id: string;
          } | null;
          userId: string;
          user?: {
            __typename: 'User';
            id: string;
            identityId?: string | null;
            referralCode?: string | null;
            referredBy?: string | null;
            email?: string | null;
            about?: string | null;
            firstName?: string | null;
            firmId?: string | null;
            lastName?: string | null;
            phone?: string | null;
            blocked?: Array<string | null> | null;
            blockedBy?: Array<string | null> | null;
            country?: string | null;
            profileImg?: {
              __typename: 'Image';
              alt?: string | null;
              identityId?: string | null;
              key: string;
              level: S3UploadLevel;
              type?: string | null;
            } | null;
            interests?: Array<string | null> | null;
            locale?: string | null;
            onboardingStatus?: OnboardingStatus | null;
            onboardingEntity?: string | null;
            selectedSignatureKey?: string | null;
            signatures?: {
              __typename: 'ModelSignatureConnection';
              items: Array<{
                __typename: 'Signature';
                id: string;
                userId: string;
                key: string;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            userType?: UserType | null;
            rating?: number | null;
            reportReasons?: Array<string | null> | null;
            notificationPreferences?: {
              __typename: 'NotificationPreferences';
              email?: boolean | null;
              push?: boolean | null;
              sms?: boolean | null;
            } | null;
            paymentUserId?: string | null;
            providerWalletId?: string | null;
            providerNppCrn?: string | null;
            ipAddress?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            owner?: string | null;
            loyaltyStatus?: RewardStatus | null;
            nextLoyaltyStatus?: RewardStatus | null;
            nextLoyaltyStatusPoint?: number | null;
            statusPoint?: number | null;
            pointsTotal?: number | null;
            pointsBalance?: number | null;
            invitedTo?: string | null;
          } | null;
          users?: Array<string | null> | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          id: string;
          conversationUserConversationsId?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      users?: Array<string | null> | null;
      readBy?: Array<string | null> | null;
      createdBy?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
    } | null;
    userId: string;
    user?: {
      __typename: 'User';
      id: string;
      identityId?: string | null;
      referralCode?: string | null;
      referredBy?: string | null;
      email?: string | null;
      about?: string | null;
      firstName?: string | null;
      firmId?: string | null;
      lastName?: string | null;
      phone?: string | null;
      blocked?: Array<string | null> | null;
      blockedBy?: Array<string | null> | null;
      country?: string | null;
      profileImg?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      interests?: Array<string | null> | null;
      locale?: string | null;
      onboardingStatus?: OnboardingStatus | null;
      onboardingEntity?: string | null;
      selectedSignatureKey?: string | null;
      signatures?: {
        __typename: 'ModelSignatureConnection';
        items: Array<{
          __typename: 'Signature';
          id: string;
          userId: string;
          key: string;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      userType?: UserType | null;
      rating?: number | null;
      reportReasons?: Array<string | null> | null;
      notificationPreferences?: {
        __typename: 'NotificationPreferences';
        email?: boolean | null;
        push?: boolean | null;
        sms?: boolean | null;
      } | null;
      paymentUserId?: string | null;
      providerWalletId?: string | null;
      providerNppCrn?: string | null;
      ipAddress?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      owner?: string | null;
      loyaltyStatus?: RewardStatus | null;
      nextLoyaltyStatus?: RewardStatus | null;
      nextLoyaltyStatusPoint?: number | null;
      statusPoint?: number | null;
      pointsTotal?: number | null;
      pointsBalance?: number | null;
      invitedTo?: string | null;
    } | null;
    users?: Array<string | null> | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
    conversationUserConversationsId?: string | null;
  } | null;
};

export type DeleteUserConversationMutationVariables = {
  input: DeleteUserConversationInput;
  condition?: ModelUserConversationConditionInput | null;
};

export type DeleteUserConversationMutation = {
  deleteUserConversation?: {
    __typename: 'UserConversation';
    conversationId: string;
    conversation?: {
      __typename: 'Conversation';
      title?: string | null;
      image?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      country?: string | null;
      messages?: {
        __typename: 'ModelMessageConnection';
        items: Array<{
          __typename: 'Message';
          conversationId: string;
          text?: string | null;
          attachments?: Array<{
            __typename: 'S3Upload';
            identityId?: string | null;
            key: string;
            level: S3UploadLevel;
            type: S3UploadType;
          } | null> | null;
          users: Array<string | null>;
          receiver: string;
          sender: string;
          createdBy: string;
          readBy?: Array<string | null> | null;
          createdAt: string;
          updatedAt?: string | null;
          id: string;
          conversationMessagesId?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      userConversations?: {
        __typename: 'ModelUserConversationConnection';
        items: Array<{
          __typename: 'UserConversation';
          conversationId: string;
          conversation?: {
            __typename: 'Conversation';
            title?: string | null;
            image?: {
              __typename: 'Image';
              alt?: string | null;
              identityId?: string | null;
              key: string;
              level: S3UploadLevel;
              type?: string | null;
            } | null;
            country?: string | null;
            messages?: {
              __typename: 'ModelMessageConnection';
              items: Array<{
                __typename: 'Message';
                conversationId: string;
                text?: string | null;
                users: Array<string | null>;
                receiver: string;
                sender: string;
                createdBy: string;
                readBy?: Array<string | null> | null;
                createdAt: string;
                updatedAt?: string | null;
                id: string;
                conversationMessagesId?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            userConversations?: {
              __typename: 'ModelUserConversationConnection';
              items: Array<{
                __typename: 'UserConversation';
                conversationId: string;
                userId: string;
                users?: Array<string | null> | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                id: string;
                conversationUserConversationsId?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            users?: Array<string | null> | null;
            readBy?: Array<string | null> | null;
            createdBy?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            id: string;
          } | null;
          userId: string;
          user?: {
            __typename: 'User';
            id: string;
            identityId?: string | null;
            referralCode?: string | null;
            referredBy?: string | null;
            email?: string | null;
            about?: string | null;
            firstName?: string | null;
            firmId?: string | null;
            lastName?: string | null;
            phone?: string | null;
            blocked?: Array<string | null> | null;
            blockedBy?: Array<string | null> | null;
            country?: string | null;
            profileImg?: {
              __typename: 'Image';
              alt?: string | null;
              identityId?: string | null;
              key: string;
              level: S3UploadLevel;
              type?: string | null;
            } | null;
            interests?: Array<string | null> | null;
            locale?: string | null;
            onboardingStatus?: OnboardingStatus | null;
            onboardingEntity?: string | null;
            selectedSignatureKey?: string | null;
            signatures?: {
              __typename: 'ModelSignatureConnection';
              items: Array<{
                __typename: 'Signature';
                id: string;
                userId: string;
                key: string;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            userType?: UserType | null;
            rating?: number | null;
            reportReasons?: Array<string | null> | null;
            notificationPreferences?: {
              __typename: 'NotificationPreferences';
              email?: boolean | null;
              push?: boolean | null;
              sms?: boolean | null;
            } | null;
            paymentUserId?: string | null;
            providerWalletId?: string | null;
            providerNppCrn?: string | null;
            ipAddress?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            owner?: string | null;
            loyaltyStatus?: RewardStatus | null;
            nextLoyaltyStatus?: RewardStatus | null;
            nextLoyaltyStatusPoint?: number | null;
            statusPoint?: number | null;
            pointsTotal?: number | null;
            pointsBalance?: number | null;
            invitedTo?: string | null;
          } | null;
          users?: Array<string | null> | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          id: string;
          conversationUserConversationsId?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      users?: Array<string | null> | null;
      readBy?: Array<string | null> | null;
      createdBy?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
    } | null;
    userId: string;
    user?: {
      __typename: 'User';
      id: string;
      identityId?: string | null;
      referralCode?: string | null;
      referredBy?: string | null;
      email?: string | null;
      about?: string | null;
      firstName?: string | null;
      firmId?: string | null;
      lastName?: string | null;
      phone?: string | null;
      blocked?: Array<string | null> | null;
      blockedBy?: Array<string | null> | null;
      country?: string | null;
      profileImg?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      interests?: Array<string | null> | null;
      locale?: string | null;
      onboardingStatus?: OnboardingStatus | null;
      onboardingEntity?: string | null;
      selectedSignatureKey?: string | null;
      signatures?: {
        __typename: 'ModelSignatureConnection';
        items: Array<{
          __typename: 'Signature';
          id: string;
          userId: string;
          key: string;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      userType?: UserType | null;
      rating?: number | null;
      reportReasons?: Array<string | null> | null;
      notificationPreferences?: {
        __typename: 'NotificationPreferences';
        email?: boolean | null;
        push?: boolean | null;
        sms?: boolean | null;
      } | null;
      paymentUserId?: string | null;
      providerWalletId?: string | null;
      providerNppCrn?: string | null;
      ipAddress?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      owner?: string | null;
      loyaltyStatus?: RewardStatus | null;
      nextLoyaltyStatus?: RewardStatus | null;
      nextLoyaltyStatusPoint?: number | null;
      statusPoint?: number | null;
      pointsTotal?: number | null;
      pointsBalance?: number | null;
      invitedTo?: string | null;
    } | null;
    users?: Array<string | null> | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
    conversationUserConversationsId?: string | null;
  } | null;
};

export type PublishUserMessageMutationVariables = {
  userId: string;
};

export type PublishUserMessageMutation = {
  publishUserMessage?: {
    __typename: 'Message';
    conversationId: string;
    text?: string | null;
    attachments?: Array<{
      __typename: 'S3Upload';
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type: S3UploadType;
    } | null> | null;
    users: Array<string | null>;
    receiver: string;
    sender: string;
    createdBy: string;
    readBy?: Array<string | null> | null;
    createdAt: string;
    updatedAt?: string | null;
    id: string;
    conversationMessagesId?: string | null;
  } | null;
};

export type XeroCreateConsentUrlMutationVariables = {
  input?: XeroCreateConsentUrlInput | null;
};

export type XeroCreateConsentUrlMutation = {
  xeroCreateConsentUrl?: string | null;
};

export type XeroCreateContactSyncMutationVariables = {
  input?: XeroCreateContactSyncInput | null;
};

export type XeroCreateContactSyncMutation = {
  xeroCreateContactSync?: boolean | null;
};

export type XeroCreateInvoiceSyncMutationVariables = {
  input?: XeroCreateInvoiceSyncInput | null;
};

export type XeroCreateInvoiceSyncMutation = {
  xeroCreateInvoiceSync?: boolean | null;
};

export type XeroCreateTenantsConnectMutationVariables = {
  input?: xeroCreateTenantsConnectInput | null;
};

export type XeroCreateTenantsConnectMutation = {
  xeroCreateTenantsConnect?: boolean | null;
};

export type XeroGetProfileMutationVariables = {
  input?: XeroGetProfileInput | null;
};

export type XeroGetProfileMutation = {
  xeroGetProfile?: string | null;
};

export type XeroDisconnectMutationVariables = {
  input?: XeroDisconnectInput | null;
};

export type XeroDisconnectMutation = {
  xeroDisconnect?: boolean | null;
};

export type GetUpdatePayToAgreementMutationVariables = {
  input: GetUpdatePayToAgreementInput;
};

export type GetUpdatePayToAgreementMutation = {
  getUpdatePayToAgreement?: {
    __typename: 'PayToAgreement';
    id: string;
    agreementUuid: string;
    status?: string | null;
    statusDescription?: string | null;
    statusReasonCode?: string | null;
    statusReasonDescription?: string | null;
    entityId: string;
    fromId: string;
    from?: {
      __typename: 'Entity';
      id: string;
      type: EntityType;
      taxNumber?: string | null;
      companyNumber?: string | null;
      billerCode?: number | null;
      name: string;
      legalName?: string | null;
      searchName?: string | null;
      address?: {
        __typename: 'Address';
        addressId?: string | null;
        placeId?: string | null;
        contactName?: string | null;
        contactNumber?: string | null;
        addressFull?: string | null;
        address1?: string | null;
        address2?: string | null;
        unitNumber?: string | null;
        streetNumber?: string | null;
        streetName?: string | null;
        streetType?: string | null;
        city: string;
        country: string;
        countryCode?: string | null;
        state: string;
        stateCode?: string | null;
        postalCode: string;
      } | null;
      logo?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      entityBeneficialOwners?: {
        __typename: 'ModelEntityBeneficialOwnerConnection';
        items?: Array<{
          __typename: 'EntityBeneficialOwner';
          entityId: string;
          beneficialOwnerId: string;
          beneficialOwner?: {
            __typename: 'BeneficialOwner';
            id: string;
            firstName?: string | null;
            lastName?: string | null;
            name?: string | null;
            providerEntityId: string;
            verificationStatus: VerificationStatus;
            verificationAttempt?: number | null;
            createdBy?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
          } | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          owner?: string | null;
        } | null> | null;
        nextToken?: string | null;
      } | null;
      entityUsers?: {
        __typename: 'ModelEntityUserConnection';
        items: Array<{
          __typename: 'EntityUser';
          id: string;
          entityId: string;
          userId: string;
          invitedEmail?: string | null;
          referredBy?: string | null;
          invitedEntityId?: string | null;
          firmEntityId?: string | null;
          firstName?: string | null;
          lastName?: string | null;
          role?: EntityUserRole | null;
          paymentsEnabled?: boolean | null;
          entitySearchName?: string | null;
          entity?: {
            __typename: 'Entity';
            id: string;
            type: EntityType;
            taxNumber?: string | null;
            companyNumber?: string | null;
            billerCode?: number | null;
            name: string;
            legalName?: string | null;
            searchName?: string | null;
            address?: {
              __typename: 'Address';
              addressId?: string | null;
              placeId?: string | null;
              contactName?: string | null;
              contactNumber?: string | null;
              addressFull?: string | null;
              address1?: string | null;
              address2?: string | null;
              unitNumber?: string | null;
              streetNumber?: string | null;
              streetName?: string | null;
              streetType?: string | null;
              city: string;
              country: string;
              countryCode?: string | null;
              state: string;
              stateCode?: string | null;
              postalCode: string;
            } | null;
            logo?: {
              __typename: 'Image';
              alt?: string | null;
              identityId?: string | null;
              key: string;
              level: S3UploadLevel;
              type?: string | null;
            } | null;
            entityBeneficialOwners?: {
              __typename: 'ModelEntityBeneficialOwnerConnection';
              items?: Array<{
                __typename: 'EntityBeneficialOwner';
                entityId: string;
                beneficialOwnerId: string;
                createdAt?: string | null;
                updatedAt?: string | null;
                owner?: string | null;
              } | null> | null;
              nextToken?: string | null;
            } | null;
            entityUsers?: {
              __typename: 'ModelEntityUserConnection';
              items: Array<{
                __typename: 'EntityUser';
                id: string;
                entityId: string;
                userId: string;
                invitedEmail?: string | null;
                referredBy?: string | null;
                invitedEntityId?: string | null;
                firmEntityId?: string | null;
                firstName?: string | null;
                lastName?: string | null;
                role?: EntityUserRole | null;
                paymentsEnabled?: boolean | null;
                entitySearchName?: string | null;
                searchName?: string | null;
                createdBy?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                status?: EntityUserStatus | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            gstRegistered?: boolean | null;
            providerEntityId?: string | null;
            providerCompanyId?: string | null;
            providerBillUserCompanyId?: string | null;
            providerBankAccountId?: string | null;
            providerDigitalWalletId?: string | null;
            providerBpayCrn?: string | null;
            contact?: {
              __typename: 'EntityContact';
              firstName?: string | null;
              lastName?: string | null;
              email?: string | null;
              phone?: string | null;
              role?: string | null;
            } | null;
            paymentMethods?: {
              __typename: 'ModelPaymentMethodConnection';
              items: Array<{
                __typename: 'PaymentMethod';
                id: string;
                paymentMethodType: PaymentMethodType;
                type?: string | null;
                fullName?: string | null;
                number?: string | null;
                expMonth?: string | null;
                expYear?: string | null;
                accountName?: string | null;
                bankName?: string | null;
                accountNumber?: string | null;
                routingNumber?: string | null;
                holderType?: BankHolderType | null;
                accountType?: BankAccountType | null;
                status?: PaymentMethodStatus | null;
                accountDirection?: AccountDirection | null;
                expiresAt?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            paymentMethodId?: string | null;
            paymentUserId?: string | null;
            disbursementMethodId?: string | null;
            receivingAccounts?: {
              __typename: 'ModelPaymentMethodConnection';
              items: Array<{
                __typename: 'PaymentMethod';
                id: string;
                paymentMethodType: PaymentMethodType;
                type?: string | null;
                fullName?: string | null;
                number?: string | null;
                expMonth?: string | null;
                expYear?: string | null;
                accountName?: string | null;
                bankName?: string | null;
                accountNumber?: string | null;
                routingNumber?: string | null;
                holderType?: BankHolderType | null;
                accountType?: BankAccountType | null;
                status?: PaymentMethodStatus | null;
                accountDirection?: AccountDirection | null;
                expiresAt?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            ubosCreated?: boolean | null;
            numUbosCreated?: number | null;
            subCategory?: string | null;
            clientsStatus?: EntityClientsStatus | null;
            ocrEmail?: string | null;
            verificationStatus?: VerificationStatus | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            owner: string;
            referredBy?: string | null;
            xeroContactSyncStatus?: XeroSyncStatus | null;
            xeroLastContactSyncAt?: string | null;
            xeroInvoiceSyncStatus?: XeroSyncStatus | null;
            xeroLastInvoiceSyncAt?: string | null;
            xeroTenantId?: string | null;
          } | null;
          searchName?: string | null;
          createdBy?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          status?: EntityUserStatus | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      gstRegistered?: boolean | null;
      providerEntityId?: string | null;
      providerCompanyId?: string | null;
      providerBillUserCompanyId?: string | null;
      providerBankAccountId?: string | null;
      providerDigitalWalletId?: string | null;
      providerBpayCrn?: string | null;
      contact?: {
        __typename: 'EntityContact';
        firstName?: string | null;
        lastName?: string | null;
        email?: string | null;
        phone?: string | null;
        role?: string | null;
      } | null;
      paymentMethods?: {
        __typename: 'ModelPaymentMethodConnection';
        items: Array<{
          __typename: 'PaymentMethod';
          id: string;
          paymentMethodType: PaymentMethodType;
          type?: string | null;
          fullName?: string | null;
          number?: string | null;
          expMonth?: string | null;
          expYear?: string | null;
          accountName?: string | null;
          bankName?: string | null;
          accountNumber?: string | null;
          routingNumber?: string | null;
          holderType?: BankHolderType | null;
          accountType?: BankAccountType | null;
          status?: PaymentMethodStatus | null;
          accountDirection?: AccountDirection | null;
          expiresAt?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      paymentMethodId?: string | null;
      paymentUserId?: string | null;
      disbursementMethodId?: string | null;
      receivingAccounts?: {
        __typename: 'ModelPaymentMethodConnection';
        items: Array<{
          __typename: 'PaymentMethod';
          id: string;
          paymentMethodType: PaymentMethodType;
          type?: string | null;
          fullName?: string | null;
          number?: string | null;
          expMonth?: string | null;
          expYear?: string | null;
          accountName?: string | null;
          bankName?: string | null;
          accountNumber?: string | null;
          routingNumber?: string | null;
          holderType?: BankHolderType | null;
          accountType?: BankAccountType | null;
          status?: PaymentMethodStatus | null;
          accountDirection?: AccountDirection | null;
          expiresAt?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      ubosCreated?: boolean | null;
      numUbosCreated?: number | null;
      subCategory?: string | null;
      clientsStatus?: EntityClientsStatus | null;
      ocrEmail?: string | null;
      verificationStatus?: VerificationStatus | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      owner: string;
      referredBy?: string | null;
      xeroContactSyncStatus?: XeroSyncStatus | null;
      xeroLastContactSyncAt?: string | null;
      xeroInvoiceSyncStatus?: XeroSyncStatus | null;
      xeroLastInvoiceSyncAt?: string | null;
      xeroTenantId?: string | null;
    } | null;
    paymentFrequency: PaymentFrequency;
    amount: number;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null;
};

export type CreatePaymentMethodTokenMutationVariables = {
  input?: CreatePaymentMethodTokenInput | null;
};

export type CreatePaymentMethodTokenMutation = {
  createPaymentMethodToken?: {
    __typename: 'CreatePaymentMethodToken';
    token?: string | null;
    userId?: string | null;
  } | null;
};

export type CreatePayToAgreementMutationVariables = {
  input?: CreatePayToAgreementInput | null;
};

export type CreatePayToAgreementMutation = {
  createPayToAgreement?: Array<{
    __typename: 'PayToAgreement';
    id: string;
    agreementUuid: string;
    status?: string | null;
    statusDescription?: string | null;
    statusReasonCode?: string | null;
    statusReasonDescription?: string | null;
    entityId: string;
    fromId: string;
    from?: {
      __typename: 'Entity';
      id: string;
      type: EntityType;
      taxNumber?: string | null;
      companyNumber?: string | null;
      billerCode?: number | null;
      name: string;
      legalName?: string | null;
      searchName?: string | null;
      address?: {
        __typename: 'Address';
        addressId?: string | null;
        placeId?: string | null;
        contactName?: string | null;
        contactNumber?: string | null;
        addressFull?: string | null;
        address1?: string | null;
        address2?: string | null;
        unitNumber?: string | null;
        streetNumber?: string | null;
        streetName?: string | null;
        streetType?: string | null;
        city: string;
        country: string;
        countryCode?: string | null;
        state: string;
        stateCode?: string | null;
        postalCode: string;
      } | null;
      logo?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      entityBeneficialOwners?: {
        __typename: 'ModelEntityBeneficialOwnerConnection';
        items?: Array<{
          __typename: 'EntityBeneficialOwner';
          entityId: string;
          beneficialOwnerId: string;
          beneficialOwner?: {
            __typename: 'BeneficialOwner';
            id: string;
            firstName?: string | null;
            lastName?: string | null;
            name?: string | null;
            providerEntityId: string;
            verificationStatus: VerificationStatus;
            verificationAttempt?: number | null;
            createdBy?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
          } | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          owner?: string | null;
        } | null> | null;
        nextToken?: string | null;
      } | null;
      entityUsers?: {
        __typename: 'ModelEntityUserConnection';
        items: Array<{
          __typename: 'EntityUser';
          id: string;
          entityId: string;
          userId: string;
          invitedEmail?: string | null;
          referredBy?: string | null;
          invitedEntityId?: string | null;
          firmEntityId?: string | null;
          firstName?: string | null;
          lastName?: string | null;
          role?: EntityUserRole | null;
          paymentsEnabled?: boolean | null;
          entitySearchName?: string | null;
          entity?: {
            __typename: 'Entity';
            id: string;
            type: EntityType;
            taxNumber?: string | null;
            companyNumber?: string | null;
            billerCode?: number | null;
            name: string;
            legalName?: string | null;
            searchName?: string | null;
            address?: {
              __typename: 'Address';
              addressId?: string | null;
              placeId?: string | null;
              contactName?: string | null;
              contactNumber?: string | null;
              addressFull?: string | null;
              address1?: string | null;
              address2?: string | null;
              unitNumber?: string | null;
              streetNumber?: string | null;
              streetName?: string | null;
              streetType?: string | null;
              city: string;
              country: string;
              countryCode?: string | null;
              state: string;
              stateCode?: string | null;
              postalCode: string;
            } | null;
            logo?: {
              __typename: 'Image';
              alt?: string | null;
              identityId?: string | null;
              key: string;
              level: S3UploadLevel;
              type?: string | null;
            } | null;
            entityBeneficialOwners?: {
              __typename: 'ModelEntityBeneficialOwnerConnection';
              items?: Array<{
                __typename: 'EntityBeneficialOwner';
                entityId: string;
                beneficialOwnerId: string;
                createdAt?: string | null;
                updatedAt?: string | null;
                owner?: string | null;
              } | null> | null;
              nextToken?: string | null;
            } | null;
            entityUsers?: {
              __typename: 'ModelEntityUserConnection';
              items: Array<{
                __typename: 'EntityUser';
                id: string;
                entityId: string;
                userId: string;
                invitedEmail?: string | null;
                referredBy?: string | null;
                invitedEntityId?: string | null;
                firmEntityId?: string | null;
                firstName?: string | null;
                lastName?: string | null;
                role?: EntityUserRole | null;
                paymentsEnabled?: boolean | null;
                entitySearchName?: string | null;
                searchName?: string | null;
                createdBy?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                status?: EntityUserStatus | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            gstRegistered?: boolean | null;
            providerEntityId?: string | null;
            providerCompanyId?: string | null;
            providerBillUserCompanyId?: string | null;
            providerBankAccountId?: string | null;
            providerDigitalWalletId?: string | null;
            providerBpayCrn?: string | null;
            contact?: {
              __typename: 'EntityContact';
              firstName?: string | null;
              lastName?: string | null;
              email?: string | null;
              phone?: string | null;
              role?: string | null;
            } | null;
            paymentMethods?: {
              __typename: 'ModelPaymentMethodConnection';
              items: Array<{
                __typename: 'PaymentMethod';
                id: string;
                paymentMethodType: PaymentMethodType;
                type?: string | null;
                fullName?: string | null;
                number?: string | null;
                expMonth?: string | null;
                expYear?: string | null;
                accountName?: string | null;
                bankName?: string | null;
                accountNumber?: string | null;
                routingNumber?: string | null;
                holderType?: BankHolderType | null;
                accountType?: BankAccountType | null;
                status?: PaymentMethodStatus | null;
                accountDirection?: AccountDirection | null;
                expiresAt?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            paymentMethodId?: string | null;
            paymentUserId?: string | null;
            disbursementMethodId?: string | null;
            receivingAccounts?: {
              __typename: 'ModelPaymentMethodConnection';
              items: Array<{
                __typename: 'PaymentMethod';
                id: string;
                paymentMethodType: PaymentMethodType;
                type?: string | null;
                fullName?: string | null;
                number?: string | null;
                expMonth?: string | null;
                expYear?: string | null;
                accountName?: string | null;
                bankName?: string | null;
                accountNumber?: string | null;
                routingNumber?: string | null;
                holderType?: BankHolderType | null;
                accountType?: BankAccountType | null;
                status?: PaymentMethodStatus | null;
                accountDirection?: AccountDirection | null;
                expiresAt?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            ubosCreated?: boolean | null;
            numUbosCreated?: number | null;
            subCategory?: string | null;
            clientsStatus?: EntityClientsStatus | null;
            ocrEmail?: string | null;
            verificationStatus?: VerificationStatus | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            owner: string;
            referredBy?: string | null;
            xeroContactSyncStatus?: XeroSyncStatus | null;
            xeroLastContactSyncAt?: string | null;
            xeroInvoiceSyncStatus?: XeroSyncStatus | null;
            xeroLastInvoiceSyncAt?: string | null;
            xeroTenantId?: string | null;
          } | null;
          searchName?: string | null;
          createdBy?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          status?: EntityUserStatus | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      gstRegistered?: boolean | null;
      providerEntityId?: string | null;
      providerCompanyId?: string | null;
      providerBillUserCompanyId?: string | null;
      providerBankAccountId?: string | null;
      providerDigitalWalletId?: string | null;
      providerBpayCrn?: string | null;
      contact?: {
        __typename: 'EntityContact';
        firstName?: string | null;
        lastName?: string | null;
        email?: string | null;
        phone?: string | null;
        role?: string | null;
      } | null;
      paymentMethods?: {
        __typename: 'ModelPaymentMethodConnection';
        items: Array<{
          __typename: 'PaymentMethod';
          id: string;
          paymentMethodType: PaymentMethodType;
          type?: string | null;
          fullName?: string | null;
          number?: string | null;
          expMonth?: string | null;
          expYear?: string | null;
          accountName?: string | null;
          bankName?: string | null;
          accountNumber?: string | null;
          routingNumber?: string | null;
          holderType?: BankHolderType | null;
          accountType?: BankAccountType | null;
          status?: PaymentMethodStatus | null;
          accountDirection?: AccountDirection | null;
          expiresAt?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      paymentMethodId?: string | null;
      paymentUserId?: string | null;
      disbursementMethodId?: string | null;
      receivingAccounts?: {
        __typename: 'ModelPaymentMethodConnection';
        items: Array<{
          __typename: 'PaymentMethod';
          id: string;
          paymentMethodType: PaymentMethodType;
          type?: string | null;
          fullName?: string | null;
          number?: string | null;
          expMonth?: string | null;
          expYear?: string | null;
          accountName?: string | null;
          bankName?: string | null;
          accountNumber?: string | null;
          routingNumber?: string | null;
          holderType?: BankHolderType | null;
          accountType?: BankAccountType | null;
          status?: PaymentMethodStatus | null;
          accountDirection?: AccountDirection | null;
          expiresAt?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      ubosCreated?: boolean | null;
      numUbosCreated?: number | null;
      subCategory?: string | null;
      clientsStatus?: EntityClientsStatus | null;
      ocrEmail?: string | null;
      verificationStatus?: VerificationStatus | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      owner: string;
      referredBy?: string | null;
      xeroContactSyncStatus?: XeroSyncStatus | null;
      xeroLastContactSyncAt?: string | null;
      xeroInvoiceSyncStatus?: XeroSyncStatus | null;
      xeroLastInvoiceSyncAt?: string | null;
      xeroTenantId?: string | null;
    } | null;
    paymentFrequency: PaymentFrequency;
    amount: number;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null> | null;
};

export type ValidatePayToAgreementMutationVariables = {
  input?: ValidatePayToAgreementInput | null;
};

export type ValidatePayToAgreementMutation = {
  validatePayToAgreement?: Array<{
    __typename: 'PayToAgreement';
    id: string;
    agreementUuid: string;
    status?: string | null;
    statusDescription?: string | null;
    statusReasonCode?: string | null;
    statusReasonDescription?: string | null;
    entityId: string;
    fromId: string;
    from?: {
      __typename: 'Entity';
      id: string;
      type: EntityType;
      taxNumber?: string | null;
      companyNumber?: string | null;
      billerCode?: number | null;
      name: string;
      legalName?: string | null;
      searchName?: string | null;
      address?: {
        __typename: 'Address';
        addressId?: string | null;
        placeId?: string | null;
        contactName?: string | null;
        contactNumber?: string | null;
        addressFull?: string | null;
        address1?: string | null;
        address2?: string | null;
        unitNumber?: string | null;
        streetNumber?: string | null;
        streetName?: string | null;
        streetType?: string | null;
        city: string;
        country: string;
        countryCode?: string | null;
        state: string;
        stateCode?: string | null;
        postalCode: string;
      } | null;
      logo?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      entityBeneficialOwners?: {
        __typename: 'ModelEntityBeneficialOwnerConnection';
        items?: Array<{
          __typename: 'EntityBeneficialOwner';
          entityId: string;
          beneficialOwnerId: string;
          beneficialOwner?: {
            __typename: 'BeneficialOwner';
            id: string;
            firstName?: string | null;
            lastName?: string | null;
            name?: string | null;
            providerEntityId: string;
            verificationStatus: VerificationStatus;
            verificationAttempt?: number | null;
            createdBy?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
          } | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          owner?: string | null;
        } | null> | null;
        nextToken?: string | null;
      } | null;
      entityUsers?: {
        __typename: 'ModelEntityUserConnection';
        items: Array<{
          __typename: 'EntityUser';
          id: string;
          entityId: string;
          userId: string;
          invitedEmail?: string | null;
          referredBy?: string | null;
          invitedEntityId?: string | null;
          firmEntityId?: string | null;
          firstName?: string | null;
          lastName?: string | null;
          role?: EntityUserRole | null;
          paymentsEnabled?: boolean | null;
          entitySearchName?: string | null;
          entity?: {
            __typename: 'Entity';
            id: string;
            type: EntityType;
            taxNumber?: string | null;
            companyNumber?: string | null;
            billerCode?: number | null;
            name: string;
            legalName?: string | null;
            searchName?: string | null;
            address?: {
              __typename: 'Address';
              addressId?: string | null;
              placeId?: string | null;
              contactName?: string | null;
              contactNumber?: string | null;
              addressFull?: string | null;
              address1?: string | null;
              address2?: string | null;
              unitNumber?: string | null;
              streetNumber?: string | null;
              streetName?: string | null;
              streetType?: string | null;
              city: string;
              country: string;
              countryCode?: string | null;
              state: string;
              stateCode?: string | null;
              postalCode: string;
            } | null;
            logo?: {
              __typename: 'Image';
              alt?: string | null;
              identityId?: string | null;
              key: string;
              level: S3UploadLevel;
              type?: string | null;
            } | null;
            entityBeneficialOwners?: {
              __typename: 'ModelEntityBeneficialOwnerConnection';
              items?: Array<{
                __typename: 'EntityBeneficialOwner';
                entityId: string;
                beneficialOwnerId: string;
                createdAt?: string | null;
                updatedAt?: string | null;
                owner?: string | null;
              } | null> | null;
              nextToken?: string | null;
            } | null;
            entityUsers?: {
              __typename: 'ModelEntityUserConnection';
              items: Array<{
                __typename: 'EntityUser';
                id: string;
                entityId: string;
                userId: string;
                invitedEmail?: string | null;
                referredBy?: string | null;
                invitedEntityId?: string | null;
                firmEntityId?: string | null;
                firstName?: string | null;
                lastName?: string | null;
                role?: EntityUserRole | null;
                paymentsEnabled?: boolean | null;
                entitySearchName?: string | null;
                searchName?: string | null;
                createdBy?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                status?: EntityUserStatus | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            gstRegistered?: boolean | null;
            providerEntityId?: string | null;
            providerCompanyId?: string | null;
            providerBillUserCompanyId?: string | null;
            providerBankAccountId?: string | null;
            providerDigitalWalletId?: string | null;
            providerBpayCrn?: string | null;
            contact?: {
              __typename: 'EntityContact';
              firstName?: string | null;
              lastName?: string | null;
              email?: string | null;
              phone?: string | null;
              role?: string | null;
            } | null;
            paymentMethods?: {
              __typename: 'ModelPaymentMethodConnection';
              items: Array<{
                __typename: 'PaymentMethod';
                id: string;
                paymentMethodType: PaymentMethodType;
                type?: string | null;
                fullName?: string | null;
                number?: string | null;
                expMonth?: string | null;
                expYear?: string | null;
                accountName?: string | null;
                bankName?: string | null;
                accountNumber?: string | null;
                routingNumber?: string | null;
                holderType?: BankHolderType | null;
                accountType?: BankAccountType | null;
                status?: PaymentMethodStatus | null;
                accountDirection?: AccountDirection | null;
                expiresAt?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            paymentMethodId?: string | null;
            paymentUserId?: string | null;
            disbursementMethodId?: string | null;
            receivingAccounts?: {
              __typename: 'ModelPaymentMethodConnection';
              items: Array<{
                __typename: 'PaymentMethod';
                id: string;
                paymentMethodType: PaymentMethodType;
                type?: string | null;
                fullName?: string | null;
                number?: string | null;
                expMonth?: string | null;
                expYear?: string | null;
                accountName?: string | null;
                bankName?: string | null;
                accountNumber?: string | null;
                routingNumber?: string | null;
                holderType?: BankHolderType | null;
                accountType?: BankAccountType | null;
                status?: PaymentMethodStatus | null;
                accountDirection?: AccountDirection | null;
                expiresAt?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            ubosCreated?: boolean | null;
            numUbosCreated?: number | null;
            subCategory?: string | null;
            clientsStatus?: EntityClientsStatus | null;
            ocrEmail?: string | null;
            verificationStatus?: VerificationStatus | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            owner: string;
            referredBy?: string | null;
            xeroContactSyncStatus?: XeroSyncStatus | null;
            xeroLastContactSyncAt?: string | null;
            xeroInvoiceSyncStatus?: XeroSyncStatus | null;
            xeroLastInvoiceSyncAt?: string | null;
            xeroTenantId?: string | null;
          } | null;
          searchName?: string | null;
          createdBy?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          status?: EntityUserStatus | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      gstRegistered?: boolean | null;
      providerEntityId?: string | null;
      providerCompanyId?: string | null;
      providerBillUserCompanyId?: string | null;
      providerBankAccountId?: string | null;
      providerDigitalWalletId?: string | null;
      providerBpayCrn?: string | null;
      contact?: {
        __typename: 'EntityContact';
        firstName?: string | null;
        lastName?: string | null;
        email?: string | null;
        phone?: string | null;
        role?: string | null;
      } | null;
      paymentMethods?: {
        __typename: 'ModelPaymentMethodConnection';
        items: Array<{
          __typename: 'PaymentMethod';
          id: string;
          paymentMethodType: PaymentMethodType;
          type?: string | null;
          fullName?: string | null;
          number?: string | null;
          expMonth?: string | null;
          expYear?: string | null;
          accountName?: string | null;
          bankName?: string | null;
          accountNumber?: string | null;
          routingNumber?: string | null;
          holderType?: BankHolderType | null;
          accountType?: BankAccountType | null;
          status?: PaymentMethodStatus | null;
          accountDirection?: AccountDirection | null;
          expiresAt?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      paymentMethodId?: string | null;
      paymentUserId?: string | null;
      disbursementMethodId?: string | null;
      receivingAccounts?: {
        __typename: 'ModelPaymentMethodConnection';
        items: Array<{
          __typename: 'PaymentMethod';
          id: string;
          paymentMethodType: PaymentMethodType;
          type?: string | null;
          fullName?: string | null;
          number?: string | null;
          expMonth?: string | null;
          expYear?: string | null;
          accountName?: string | null;
          bankName?: string | null;
          accountNumber?: string | null;
          routingNumber?: string | null;
          holderType?: BankHolderType | null;
          accountType?: BankAccountType | null;
          status?: PaymentMethodStatus | null;
          accountDirection?: AccountDirection | null;
          expiresAt?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      ubosCreated?: boolean | null;
      numUbosCreated?: number | null;
      subCategory?: string | null;
      clientsStatus?: EntityClientsStatus | null;
      ocrEmail?: string | null;
      verificationStatus?: VerificationStatus | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      owner: string;
      referredBy?: string | null;
      xeroContactSyncStatus?: XeroSyncStatus | null;
      xeroLastContactSyncAt?: string | null;
      xeroInvoiceSyncStatus?: XeroSyncStatus | null;
      xeroLastInvoiceSyncAt?: string | null;
      xeroTenantId?: string | null;
    } | null;
    paymentFrequency: PaymentFrequency;
    amount: number;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null> | null;
};

export type AbrLookupQueryVariables = {
  abn?: string | null;
};

export type AbrLookupQuery = {
  abrLookup: {
    __typename: 'ABNInformation';
    abn: string;
    abnStatus: string;
    abnStatusEffectiveFrom: string;
    acn: string;
    addressDate?: string | null;
    addressPostcode?: string | null;
    addressState?: string | null;
    businessName?: Array<string | null> | null;
    entityName?: string | null;
    entityTypeCode?: string | null;
    entityTypeName?: string | null;
    gst?: string | null;
    message?: string | null;
    type?: EntityType | null;
  };
};

export type AbrLookupByNameQueryVariables = {
  name?: string | null;
};

export type AbrLookupByNameQuery = {
  abrLookupByName: {
    __typename: 'ModelAbrNameSearchInformationConnection';
    items: Array<{
      __typename: 'AbrNameSearchInformation';
      abn: string;
      abnStatus: string;
      isCurrent: boolean;
      name: string;
      nameType: string;
      postcode: string;
      state: string;
    } | null>;
  };
};

export type GetAdminQueryVariables = {
  id: string;
};

export type GetAdminQuery = {
  getAdmin?: {
    __typename: 'Admin';
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    role?: AdminRole | null;
    hasAccessed?: boolean | null;
    createdBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
    owner?: string | null;
  } | null;
};

export type ListAdminsQueryVariables = {
  filter?: ModelAdminFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListAdminsQuery = {
  listAdmins?: {
    __typename: 'ModelAdminConnection';
    items: Array<{
      __typename: 'Admin';
      firstName: string;
      lastName: string;
      email: string;
      phone?: string | null;
      role?: AdminRole | null;
      hasAccessed?: boolean | null;
      createdBy?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
      owner?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type AutocompleteResultsByTypeQueryVariables = {
  type: AutocompleteType;
  searchName: string;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelEntityFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type AutocompleteResultsByTypeQuery = {
  autocompleteResultsByType?: {
    __typename: 'ModelAutocompleteResultConnection';
    items: Array<{
      __typename: 'AutocompleteResult';
      id: string;
      value: string;
      label: string;
      info?: string | null;
      type: AutocompleteType;
      searchName: string;
      metadata?: {
        __typename: 'AutocompleteResultMetadata';
        subCategory?: string | null;
        payoutMethod?: PayoutMethod | null;
      } | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type GetAutoCompleteQueryVariables = {
  id: string;
};

export type GetAutoCompleteQuery = {
  getAutoComplete?: {
    __typename: 'GetAutoCompleteResult';
    entity?: {
      __typename: 'Entity';
      id: string;
      type: EntityType;
      taxNumber?: string | null;
      companyNumber?: string | null;
      billerCode?: number | null;
      name: string;
      legalName?: string | null;
      searchName?: string | null;
      address?: {
        __typename: 'Address';
        addressId?: string | null;
        placeId?: string | null;
        contactName?: string | null;
        contactNumber?: string | null;
        addressFull?: string | null;
        address1?: string | null;
        address2?: string | null;
        unitNumber?: string | null;
        streetNumber?: string | null;
        streetName?: string | null;
        streetType?: string | null;
        city: string;
        country: string;
        countryCode?: string | null;
        state: string;
        stateCode?: string | null;
        postalCode: string;
      } | null;
      logo?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      entityBeneficialOwners?: {
        __typename: 'ModelEntityBeneficialOwnerConnection';
        items?: Array<{
          __typename: 'EntityBeneficialOwner';
          entityId: string;
          beneficialOwnerId: string;
          beneficialOwner?: {
            __typename: 'BeneficialOwner';
            id: string;
            firstName?: string | null;
            lastName?: string | null;
            name?: string | null;
            providerEntityId: string;
            verificationStatus: VerificationStatus;
            verificationAttempt?: number | null;
            createdBy?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
          } | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          owner?: string | null;
        } | null> | null;
        nextToken?: string | null;
      } | null;
      entityUsers?: {
        __typename: 'ModelEntityUserConnection';
        items: Array<{
          __typename: 'EntityUser';
          id: string;
          entityId: string;
          userId: string;
          invitedEmail?: string | null;
          referredBy?: string | null;
          invitedEntityId?: string | null;
          firmEntityId?: string | null;
          firstName?: string | null;
          lastName?: string | null;
          role?: EntityUserRole | null;
          paymentsEnabled?: boolean | null;
          entitySearchName?: string | null;
          entity?: {
            __typename: 'Entity';
            id: string;
            type: EntityType;
            taxNumber?: string | null;
            companyNumber?: string | null;
            billerCode?: number | null;
            name: string;
            legalName?: string | null;
            searchName?: string | null;
            address?: {
              __typename: 'Address';
              addressId?: string | null;
              placeId?: string | null;
              contactName?: string | null;
              contactNumber?: string | null;
              addressFull?: string | null;
              address1?: string | null;
              address2?: string | null;
              unitNumber?: string | null;
              streetNumber?: string | null;
              streetName?: string | null;
              streetType?: string | null;
              city: string;
              country: string;
              countryCode?: string | null;
              state: string;
              stateCode?: string | null;
              postalCode: string;
            } | null;
            logo?: {
              __typename: 'Image';
              alt?: string | null;
              identityId?: string | null;
              key: string;
              level: S3UploadLevel;
              type?: string | null;
            } | null;
            entityBeneficialOwners?: {
              __typename: 'ModelEntityBeneficialOwnerConnection';
              items?: Array<{
                __typename: 'EntityBeneficialOwner';
                entityId: string;
                beneficialOwnerId: string;
                createdAt?: string | null;
                updatedAt?: string | null;
                owner?: string | null;
              } | null> | null;
              nextToken?: string | null;
            } | null;
            entityUsers?: {
              __typename: 'ModelEntityUserConnection';
              items: Array<{
                __typename: 'EntityUser';
                id: string;
                entityId: string;
                userId: string;
                invitedEmail?: string | null;
                referredBy?: string | null;
                invitedEntityId?: string | null;
                firmEntityId?: string | null;
                firstName?: string | null;
                lastName?: string | null;
                role?: EntityUserRole | null;
                paymentsEnabled?: boolean | null;
                entitySearchName?: string | null;
                searchName?: string | null;
                createdBy?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                status?: EntityUserStatus | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            gstRegistered?: boolean | null;
            providerEntityId?: string | null;
            providerCompanyId?: string | null;
            providerBillUserCompanyId?: string | null;
            providerBankAccountId?: string | null;
            providerDigitalWalletId?: string | null;
            providerBpayCrn?: string | null;
            contact?: {
              __typename: 'EntityContact';
              firstName?: string | null;
              lastName?: string | null;
              email?: string | null;
              phone?: string | null;
              role?: string | null;
            } | null;
            paymentMethods?: {
              __typename: 'ModelPaymentMethodConnection';
              items: Array<{
                __typename: 'PaymentMethod';
                id: string;
                paymentMethodType: PaymentMethodType;
                type?: string | null;
                fullName?: string | null;
                number?: string | null;
                expMonth?: string | null;
                expYear?: string | null;
                accountName?: string | null;
                bankName?: string | null;
                accountNumber?: string | null;
                routingNumber?: string | null;
                holderType?: BankHolderType | null;
                accountType?: BankAccountType | null;
                status?: PaymentMethodStatus | null;
                accountDirection?: AccountDirection | null;
                expiresAt?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            paymentMethodId?: string | null;
            paymentUserId?: string | null;
            disbursementMethodId?: string | null;
            receivingAccounts?: {
              __typename: 'ModelPaymentMethodConnection';
              items: Array<{
                __typename: 'PaymentMethod';
                id: string;
                paymentMethodType: PaymentMethodType;
                type?: string | null;
                fullName?: string | null;
                number?: string | null;
                expMonth?: string | null;
                expYear?: string | null;
                accountName?: string | null;
                bankName?: string | null;
                accountNumber?: string | null;
                routingNumber?: string | null;
                holderType?: BankHolderType | null;
                accountType?: BankAccountType | null;
                status?: PaymentMethodStatus | null;
                accountDirection?: AccountDirection | null;
                expiresAt?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            ubosCreated?: boolean | null;
            numUbosCreated?: number | null;
            subCategory?: string | null;
            clientsStatus?: EntityClientsStatus | null;
            ocrEmail?: string | null;
            verificationStatus?: VerificationStatus | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            owner: string;
            referredBy?: string | null;
            xeroContactSyncStatus?: XeroSyncStatus | null;
            xeroLastContactSyncAt?: string | null;
            xeroInvoiceSyncStatus?: XeroSyncStatus | null;
            xeroLastInvoiceSyncAt?: string | null;
            xeroTenantId?: string | null;
          } | null;
          searchName?: string | null;
          createdBy?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          status?: EntityUserStatus | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      gstRegistered?: boolean | null;
      providerEntityId?: string | null;
      providerCompanyId?: string | null;
      providerBillUserCompanyId?: string | null;
      providerBankAccountId?: string | null;
      providerDigitalWalletId?: string | null;
      providerBpayCrn?: string | null;
      contact?: {
        __typename: 'EntityContact';
        firstName?: string | null;
        lastName?: string | null;
        email?: string | null;
        phone?: string | null;
        role?: string | null;
      } | null;
      paymentMethods?: {
        __typename: 'ModelPaymentMethodConnection';
        items: Array<{
          __typename: 'PaymentMethod';
          id: string;
          paymentMethodType: PaymentMethodType;
          type?: string | null;
          fullName?: string | null;
          number?: string | null;
          expMonth?: string | null;
          expYear?: string | null;
          accountName?: string | null;
          bankName?: string | null;
          accountNumber?: string | null;
          routingNumber?: string | null;
          holderType?: BankHolderType | null;
          accountType?: BankAccountType | null;
          status?: PaymentMethodStatus | null;
          accountDirection?: AccountDirection | null;
          expiresAt?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      paymentMethodId?: string | null;
      paymentUserId?: string | null;
      disbursementMethodId?: string | null;
      receivingAccounts?: {
        __typename: 'ModelPaymentMethodConnection';
        items: Array<{
          __typename: 'PaymentMethod';
          id: string;
          paymentMethodType: PaymentMethodType;
          type?: string | null;
          fullName?: string | null;
          number?: string | null;
          expMonth?: string | null;
          expYear?: string | null;
          accountName?: string | null;
          bankName?: string | null;
          accountNumber?: string | null;
          routingNumber?: string | null;
          holderType?: BankHolderType | null;
          accountType?: BankAccountType | null;
          status?: PaymentMethodStatus | null;
          accountDirection?: AccountDirection | null;
          expiresAt?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      ubosCreated?: boolean | null;
      numUbosCreated?: number | null;
      subCategory?: string | null;
      clientsStatus?: EntityClientsStatus | null;
      ocrEmail?: string | null;
      verificationStatus?: VerificationStatus | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      owner: string;
      referredBy?: string | null;
      xeroContactSyncStatus?: XeroSyncStatus | null;
      xeroLastContactSyncAt?: string | null;
      xeroInvoiceSyncStatus?: XeroSyncStatus | null;
      xeroLastInvoiceSyncAt?: string | null;
      xeroTenantId?: string | null;
    } | null;
    contact?: {
      __typename: 'Contact';
      id: string;
      entityId: string;
      xeroTenantId?: string | null;
      entityType?: EntityType | null;
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
      mobile?: string | null;
      phone?: string | null;
      taxNumber?: string | null;
      companyNumber?: string | null;
      name?: string | null;
      legalName?: string | null;
      companyName?: string | null;
      searchName?: string | null;
      status?: ContactStatus | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      contactType?: ContactType | null;
      bank?: {
        __typename: 'ContactBankAccount';
        id?: string | null;
        accountName?: string | null;
        bankName?: string | null;
        accountNumber: string;
        routingNumber: string;
        holderType?: BankHolderType | null;
        accountType?: BankAccountType | null;
        country?: string | null;
      } | null;
      bpay?: {
        __typename: 'ContactBpay';
        billerCode?: number | null;
        referenceNumber?: string | null;
      } | null;
      bulkUploadFileKey?: string | null;
      owner?: string | null;
    } | null;
  } | null;
};

export type GetContactQueryVariables = {
  id: string;
};

export type GetContactQuery = {
  getContact?: {
    __typename: 'Contact';
    id: string;
    entityId: string;
    xeroTenantId?: string | null;
    entityType?: EntityType | null;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    mobile?: string | null;
    phone?: string | null;
    taxNumber?: string | null;
    companyNumber?: string | null;
    name?: string | null;
    legalName?: string | null;
    companyName?: string | null;
    searchName?: string | null;
    status?: ContactStatus | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    contactType?: ContactType | null;
    bank?: {
      __typename: 'ContactBankAccount';
      id?: string | null;
      accountName?: string | null;
      bankName?: string | null;
      accountNumber: string;
      routingNumber: string;
      holderType?: BankHolderType | null;
      accountType?: BankAccountType | null;
      country?: string | null;
    } | null;
    bpay?: {
      __typename: 'ContactBpay';
      billerCode?: number | null;
      referenceNumber?: string | null;
    } | null;
    bulkUploadFileKey?: string | null;
    owner?: string | null;
  } | null;
};

export type ContactsByEntityQueryVariables = {
  entityId: string;
  searchName?: string | null;
  sortDirection?: ModelSortDirection | null;
  from?: number | null;
};

export type ContactsByEntityQuery = {
  contactsByEntity?: {
    __typename: 'ModelContactConnection';
    items: Array<{
      __typename: 'Contact';
      id: string;
      entityId: string;
      xeroTenantId?: string | null;
      entityType?: EntityType | null;
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
      mobile?: string | null;
      phone?: string | null;
      taxNumber?: string | null;
      companyNumber?: string | null;
      name?: string | null;
      legalName?: string | null;
      companyName?: string | null;
      searchName?: string | null;
      status?: ContactStatus | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      contactType?: ContactType | null;
      bank?: {
        __typename: 'ContactBankAccount';
        id?: string | null;
        accountName?: string | null;
        bankName?: string | null;
        accountNumber: string;
        routingNumber: string;
        holderType?: BankHolderType | null;
        accountType?: BankAccountType | null;
        country?: string | null;
      } | null;
      bpay?: {
        __typename: 'ContactBpay';
        billerCode?: number | null;
        referenceNumber?: string | null;
      } | null;
      bulkUploadFileKey?: string | null;
      owner?: string | null;
    } | null>;
    total?: number | null;
  } | null;
};

export type GetConversationQueryVariables = {
  id: string;
};

export type GetConversationQuery = {
  getConversation?: {
    __typename: 'Conversation';
    title?: string | null;
    image?: {
      __typename: 'Image';
      alt?: string | null;
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type?: string | null;
    } | null;
    country?: string | null;
    messages?: {
      __typename: 'ModelMessageConnection';
      items: Array<{
        __typename: 'Message';
        conversationId: string;
        text?: string | null;
        attachments?: Array<{
          __typename: 'S3Upload';
          identityId?: string | null;
          key: string;
          level: S3UploadLevel;
          type: S3UploadType;
        } | null> | null;
        users: Array<string | null>;
        receiver: string;
        sender: string;
        createdBy: string;
        readBy?: Array<string | null> | null;
        createdAt: string;
        updatedAt?: string | null;
        id: string;
        conversationMessagesId?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    userConversations?: {
      __typename: 'ModelUserConversationConnection';
      items: Array<{
        __typename: 'UserConversation';
        conversationId: string;
        conversation?: {
          __typename: 'Conversation';
          title?: string | null;
          image?: {
            __typename: 'Image';
            alt?: string | null;
            identityId?: string | null;
            key: string;
            level: S3UploadLevel;
            type?: string | null;
          } | null;
          country?: string | null;
          messages?: {
            __typename: 'ModelMessageConnection';
            items: Array<{
              __typename: 'Message';
              conversationId: string;
              text?: string | null;
              attachments?: Array<{
                __typename: 'S3Upload';
                identityId?: string | null;
                key: string;
                level: S3UploadLevel;
                type: S3UploadType;
              } | null> | null;
              users: Array<string | null>;
              receiver: string;
              sender: string;
              createdBy: string;
              readBy?: Array<string | null> | null;
              createdAt: string;
              updatedAt?: string | null;
              id: string;
              conversationMessagesId?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          userConversations?: {
            __typename: 'ModelUserConversationConnection';
            items: Array<{
              __typename: 'UserConversation';
              conversationId: string;
              conversation?: {
                __typename: 'Conversation';
                title?: string | null;
                country?: string | null;
                users?: Array<string | null> | null;
                readBy?: Array<string | null> | null;
                createdBy?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                id: string;
              } | null;
              userId: string;
              user?: {
                __typename: 'User';
                id: string;
                identityId?: string | null;
                referralCode?: string | null;
                referredBy?: string | null;
                email?: string | null;
                about?: string | null;
                firstName?: string | null;
                firmId?: string | null;
                lastName?: string | null;
                phone?: string | null;
                blocked?: Array<string | null> | null;
                blockedBy?: Array<string | null> | null;
                country?: string | null;
                interests?: Array<string | null> | null;
                locale?: string | null;
                onboardingStatus?: OnboardingStatus | null;
                onboardingEntity?: string | null;
                selectedSignatureKey?: string | null;
                userType?: UserType | null;
                rating?: number | null;
                reportReasons?: Array<string | null> | null;
                paymentUserId?: string | null;
                providerWalletId?: string | null;
                providerNppCrn?: string | null;
                ipAddress?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                owner?: string | null;
                loyaltyStatus?: RewardStatus | null;
                nextLoyaltyStatus?: RewardStatus | null;
                nextLoyaltyStatusPoint?: number | null;
                statusPoint?: number | null;
                pointsTotal?: number | null;
                pointsBalance?: number | null;
                invitedTo?: string | null;
              } | null;
              users?: Array<string | null> | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              id: string;
              conversationUserConversationsId?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          users?: Array<string | null> | null;
          readBy?: Array<string | null> | null;
          createdBy?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          id: string;
        } | null;
        userId: string;
        user?: {
          __typename: 'User';
          id: string;
          identityId?: string | null;
          referralCode?: string | null;
          referredBy?: string | null;
          email?: string | null;
          about?: string | null;
          firstName?: string | null;
          firmId?: string | null;
          lastName?: string | null;
          phone?: string | null;
          blocked?: Array<string | null> | null;
          blockedBy?: Array<string | null> | null;
          country?: string | null;
          profileImg?: {
            __typename: 'Image';
            alt?: string | null;
            identityId?: string | null;
            key: string;
            level: S3UploadLevel;
            type?: string | null;
          } | null;
          interests?: Array<string | null> | null;
          locale?: string | null;
          onboardingStatus?: OnboardingStatus | null;
          onboardingEntity?: string | null;
          selectedSignatureKey?: string | null;
          signatures?: {
            __typename: 'ModelSignatureConnection';
            items: Array<{
              __typename: 'Signature';
              id: string;
              userId: string;
              key: string;
              createdAt?: string | null;
              updatedAt?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          userType?: UserType | null;
          rating?: number | null;
          reportReasons?: Array<string | null> | null;
          notificationPreferences?: {
            __typename: 'NotificationPreferences';
            email?: boolean | null;
            push?: boolean | null;
            sms?: boolean | null;
          } | null;
          paymentUserId?: string | null;
          providerWalletId?: string | null;
          providerNppCrn?: string | null;
          ipAddress?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          owner?: string | null;
          loyaltyStatus?: RewardStatus | null;
          nextLoyaltyStatus?: RewardStatus | null;
          nextLoyaltyStatusPoint?: number | null;
          statusPoint?: number | null;
          pointsTotal?: number | null;
          pointsBalance?: number | null;
          invitedTo?: string | null;
        } | null;
        users?: Array<string | null> | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
        conversationUserConversationsId?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    users?: Array<string | null> | null;
    readBy?: Array<string | null> | null;
    createdBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
  } | null;
};

export type ListConversationsQueryVariables = {
  filter?: ModelConversationFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListConversationsQuery = {
  listConversations?: {
    __typename: 'ModelConversationConnection';
    items: Array<{
      __typename: 'Conversation';
      title?: string | null;
      image?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      country?: string | null;
      messages?: {
        __typename: 'ModelMessageConnection';
        items: Array<{
          __typename: 'Message';
          conversationId: string;
          text?: string | null;
          attachments?: Array<{
            __typename: 'S3Upload';
            identityId?: string | null;
            key: string;
            level: S3UploadLevel;
            type: S3UploadType;
          } | null> | null;
          users: Array<string | null>;
          receiver: string;
          sender: string;
          createdBy: string;
          readBy?: Array<string | null> | null;
          createdAt: string;
          updatedAt?: string | null;
          id: string;
          conversationMessagesId?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      userConversations?: {
        __typename: 'ModelUserConversationConnection';
        items: Array<{
          __typename: 'UserConversation';
          conversationId: string;
          conversation?: {
            __typename: 'Conversation';
            title?: string | null;
            image?: {
              __typename: 'Image';
              alt?: string | null;
              identityId?: string | null;
              key: string;
              level: S3UploadLevel;
              type?: string | null;
            } | null;
            country?: string | null;
            messages?: {
              __typename: 'ModelMessageConnection';
              items: Array<{
                __typename: 'Message';
                conversationId: string;
                text?: string | null;
                users: Array<string | null>;
                receiver: string;
                sender: string;
                createdBy: string;
                readBy?: Array<string | null> | null;
                createdAt: string;
                updatedAt?: string | null;
                id: string;
                conversationMessagesId?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            userConversations?: {
              __typename: 'ModelUserConversationConnection';
              items: Array<{
                __typename: 'UserConversation';
                conversationId: string;
                userId: string;
                users?: Array<string | null> | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                id: string;
                conversationUserConversationsId?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            users?: Array<string | null> | null;
            readBy?: Array<string | null> | null;
            createdBy?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            id: string;
          } | null;
          userId: string;
          user?: {
            __typename: 'User';
            id: string;
            identityId?: string | null;
            referralCode?: string | null;
            referredBy?: string | null;
            email?: string | null;
            about?: string | null;
            firstName?: string | null;
            firmId?: string | null;
            lastName?: string | null;
            phone?: string | null;
            blocked?: Array<string | null> | null;
            blockedBy?: Array<string | null> | null;
            country?: string | null;
            profileImg?: {
              __typename: 'Image';
              alt?: string | null;
              identityId?: string | null;
              key: string;
              level: S3UploadLevel;
              type?: string | null;
            } | null;
            interests?: Array<string | null> | null;
            locale?: string | null;
            onboardingStatus?: OnboardingStatus | null;
            onboardingEntity?: string | null;
            selectedSignatureKey?: string | null;
            signatures?: {
              __typename: 'ModelSignatureConnection';
              items: Array<{
                __typename: 'Signature';
                id: string;
                userId: string;
                key: string;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            userType?: UserType | null;
            rating?: number | null;
            reportReasons?: Array<string | null> | null;
            notificationPreferences?: {
              __typename: 'NotificationPreferences';
              email?: boolean | null;
              push?: boolean | null;
              sms?: boolean | null;
            } | null;
            paymentUserId?: string | null;
            providerWalletId?: string | null;
            providerNppCrn?: string | null;
            ipAddress?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            owner?: string | null;
            loyaltyStatus?: RewardStatus | null;
            nextLoyaltyStatus?: RewardStatus | null;
            nextLoyaltyStatusPoint?: number | null;
            statusPoint?: number | null;
            pointsTotal?: number | null;
            pointsBalance?: number | null;
            invitedTo?: string | null;
          } | null;
          users?: Array<string | null> | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          id: string;
          conversationUserConversationsId?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      users?: Array<string | null> | null;
      readBy?: Array<string | null> | null;
      createdBy?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type GetDocumentAnalysisQueryVariables = {
  id: string;
};

export type GetDocumentAnalysisQuery = {
  getDocumentAnalysis?: {
    __typename: 'DocumentAnalysis';
    id: string;
    entityId: string;
    fileKey: string;
    status: DocumentAnalysisStatus;
    expenseStatus?: DocumentAnalysisStatus | null;
    queryStatus?: DocumentAnalysisStatus | null;
    matchedContactId?: string | null;
    matchedContact?: {
      __typename: 'Contact';
      id: string;
      entityId: string;
      xeroTenantId?: string | null;
      entityType?: EntityType | null;
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
      mobile?: string | null;
      phone?: string | null;
      taxNumber?: string | null;
      companyNumber?: string | null;
      name?: string | null;
      legalName?: string | null;
      companyName?: string | null;
      searchName?: string | null;
      status?: ContactStatus | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      contactType?: ContactType | null;
      bank?: {
        __typename: 'ContactBankAccount';
        id?: string | null;
        accountName?: string | null;
        bankName?: string | null;
        accountNumber: string;
        routingNumber: string;
        holderType?: BankHolderType | null;
        accountType?: BankAccountType | null;
        country?: string | null;
      } | null;
      bpay?: {
        __typename: 'ContactBpay';
        billerCode?: number | null;
        referenceNumber?: string | null;
      } | null;
      bulkUploadFileKey?: string | null;
      owner?: string | null;
    } | null;
    matchedEntityId?: string | null;
    matchedEntity?: {
      __typename: 'Entity';
      id: string;
      type: EntityType;
      taxNumber?: string | null;
      companyNumber?: string | null;
      billerCode?: number | null;
      name: string;
      legalName?: string | null;
      searchName?: string | null;
      address?: {
        __typename: 'Address';
        addressId?: string | null;
        placeId?: string | null;
        contactName?: string | null;
        contactNumber?: string | null;
        addressFull?: string | null;
        address1?: string | null;
        address2?: string | null;
        unitNumber?: string | null;
        streetNumber?: string | null;
        streetName?: string | null;
        streetType?: string | null;
        city: string;
        country: string;
        countryCode?: string | null;
        state: string;
        stateCode?: string | null;
        postalCode: string;
      } | null;
      logo?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      entityBeneficialOwners?: {
        __typename: 'ModelEntityBeneficialOwnerConnection';
        items?: Array<{
          __typename: 'EntityBeneficialOwner';
          entityId: string;
          beneficialOwnerId: string;
          beneficialOwner?: {
            __typename: 'BeneficialOwner';
            id: string;
            firstName?: string | null;
            lastName?: string | null;
            name?: string | null;
            providerEntityId: string;
            verificationStatus: VerificationStatus;
            verificationAttempt?: number | null;
            createdBy?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
          } | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          owner?: string | null;
        } | null> | null;
        nextToken?: string | null;
      } | null;
      entityUsers?: {
        __typename: 'ModelEntityUserConnection';
        items: Array<{
          __typename: 'EntityUser';
          id: string;
          entityId: string;
          userId: string;
          invitedEmail?: string | null;
          referredBy?: string | null;
          invitedEntityId?: string | null;
          firmEntityId?: string | null;
          firstName?: string | null;
          lastName?: string | null;
          role?: EntityUserRole | null;
          paymentsEnabled?: boolean | null;
          entitySearchName?: string | null;
          entity?: {
            __typename: 'Entity';
            id: string;
            type: EntityType;
            taxNumber?: string | null;
            companyNumber?: string | null;
            billerCode?: number | null;
            name: string;
            legalName?: string | null;
            searchName?: string | null;
            address?: {
              __typename: 'Address';
              addressId?: string | null;
              placeId?: string | null;
              contactName?: string | null;
              contactNumber?: string | null;
              addressFull?: string | null;
              address1?: string | null;
              address2?: string | null;
              unitNumber?: string | null;
              streetNumber?: string | null;
              streetName?: string | null;
              streetType?: string | null;
              city: string;
              country: string;
              countryCode?: string | null;
              state: string;
              stateCode?: string | null;
              postalCode: string;
            } | null;
            logo?: {
              __typename: 'Image';
              alt?: string | null;
              identityId?: string | null;
              key: string;
              level: S3UploadLevel;
              type?: string | null;
            } | null;
            entityBeneficialOwners?: {
              __typename: 'ModelEntityBeneficialOwnerConnection';
              items?: Array<{
                __typename: 'EntityBeneficialOwner';
                entityId: string;
                beneficialOwnerId: string;
                createdAt?: string | null;
                updatedAt?: string | null;
                owner?: string | null;
              } | null> | null;
              nextToken?: string | null;
            } | null;
            entityUsers?: {
              __typename: 'ModelEntityUserConnection';
              items: Array<{
                __typename: 'EntityUser';
                id: string;
                entityId: string;
                userId: string;
                invitedEmail?: string | null;
                referredBy?: string | null;
                invitedEntityId?: string | null;
                firmEntityId?: string | null;
                firstName?: string | null;
                lastName?: string | null;
                role?: EntityUserRole | null;
                paymentsEnabled?: boolean | null;
                entitySearchName?: string | null;
                searchName?: string | null;
                createdBy?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                status?: EntityUserStatus | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            gstRegistered?: boolean | null;
            providerEntityId?: string | null;
            providerCompanyId?: string | null;
            providerBillUserCompanyId?: string | null;
            providerBankAccountId?: string | null;
            providerDigitalWalletId?: string | null;
            providerBpayCrn?: string | null;
            contact?: {
              __typename: 'EntityContact';
              firstName?: string | null;
              lastName?: string | null;
              email?: string | null;
              phone?: string | null;
              role?: string | null;
            } | null;
            paymentMethods?: {
              __typename: 'ModelPaymentMethodConnection';
              items: Array<{
                __typename: 'PaymentMethod';
                id: string;
                paymentMethodType: PaymentMethodType;
                type?: string | null;
                fullName?: string | null;
                number?: string | null;
                expMonth?: string | null;
                expYear?: string | null;
                accountName?: string | null;
                bankName?: string | null;
                accountNumber?: string | null;
                routingNumber?: string | null;
                holderType?: BankHolderType | null;
                accountType?: BankAccountType | null;
                status?: PaymentMethodStatus | null;
                accountDirection?: AccountDirection | null;
                expiresAt?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            paymentMethodId?: string | null;
            paymentUserId?: string | null;
            disbursementMethodId?: string | null;
            receivingAccounts?: {
              __typename: 'ModelPaymentMethodConnection';
              items: Array<{
                __typename: 'PaymentMethod';
                id: string;
                paymentMethodType: PaymentMethodType;
                type?: string | null;
                fullName?: string | null;
                number?: string | null;
                expMonth?: string | null;
                expYear?: string | null;
                accountName?: string | null;
                bankName?: string | null;
                accountNumber?: string | null;
                routingNumber?: string | null;
                holderType?: BankHolderType | null;
                accountType?: BankAccountType | null;
                status?: PaymentMethodStatus | null;
                accountDirection?: AccountDirection | null;
                expiresAt?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            ubosCreated?: boolean | null;
            numUbosCreated?: number | null;
            subCategory?: string | null;
            clientsStatus?: EntityClientsStatus | null;
            ocrEmail?: string | null;
            verificationStatus?: VerificationStatus | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            owner: string;
            referredBy?: string | null;
            xeroContactSyncStatus?: XeroSyncStatus | null;
            xeroLastContactSyncAt?: string | null;
            xeroInvoiceSyncStatus?: XeroSyncStatus | null;
            xeroLastInvoiceSyncAt?: string | null;
            xeroTenantId?: string | null;
          } | null;
          searchName?: string | null;
          createdBy?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          status?: EntityUserStatus | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      gstRegistered?: boolean | null;
      providerEntityId?: string | null;
      providerCompanyId?: string | null;
      providerBillUserCompanyId?: string | null;
      providerBankAccountId?: string | null;
      providerDigitalWalletId?: string | null;
      providerBpayCrn?: string | null;
      contact?: {
        __typename: 'EntityContact';
        firstName?: string | null;
        lastName?: string | null;
        email?: string | null;
        phone?: string | null;
        role?: string | null;
      } | null;
      paymentMethods?: {
        __typename: 'ModelPaymentMethodConnection';
        items: Array<{
          __typename: 'PaymentMethod';
          id: string;
          paymentMethodType: PaymentMethodType;
          type?: string | null;
          fullName?: string | null;
          number?: string | null;
          expMonth?: string | null;
          expYear?: string | null;
          accountName?: string | null;
          bankName?: string | null;
          accountNumber?: string | null;
          routingNumber?: string | null;
          holderType?: BankHolderType | null;
          accountType?: BankAccountType | null;
          status?: PaymentMethodStatus | null;
          accountDirection?: AccountDirection | null;
          expiresAt?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      paymentMethodId?: string | null;
      paymentUserId?: string | null;
      disbursementMethodId?: string | null;
      receivingAccounts?: {
        __typename: 'ModelPaymentMethodConnection';
        items: Array<{
          __typename: 'PaymentMethod';
          id: string;
          paymentMethodType: PaymentMethodType;
          type?: string | null;
          fullName?: string | null;
          number?: string | null;
          expMonth?: string | null;
          expYear?: string | null;
          accountName?: string | null;
          bankName?: string | null;
          accountNumber?: string | null;
          routingNumber?: string | null;
          holderType?: BankHolderType | null;
          accountType?: BankAccountType | null;
          status?: PaymentMethodStatus | null;
          accountDirection?: AccountDirection | null;
          expiresAt?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      ubosCreated?: boolean | null;
      numUbosCreated?: number | null;
      subCategory?: string | null;
      clientsStatus?: EntityClientsStatus | null;
      ocrEmail?: string | null;
      verificationStatus?: VerificationStatus | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      owner: string;
      referredBy?: string | null;
      xeroContactSyncStatus?: XeroSyncStatus | null;
      xeroLastContactSyncAt?: string | null;
      xeroInvoiceSyncStatus?: XeroSyncStatus | null;
      xeroLastInvoiceSyncAt?: string | null;
      xeroTenantId?: string | null;
    } | null;
    newContact?: {
      __typename: 'DocumentAnalysisContact';
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
      phone?: string | null;
      companyName?: string | null;
      taxNumber?: string | null;
    } | null;
    task?: {
      __typename: 'DocumentAnalysisTask';
      reference?: string | null;
      dueAt?: string | null;
      gstInclusive?: boolean | null;
      notes?: string | null;
      amount?: number | null;
      gstAmount?: number | null;
      lineItems?: Array<{
        __typename: 'DocumentAnalysisLineItem';
        description?: string | null;
        quantity?: number | null;
        unitPrice?: number | null;
        price?: number | null;
        productCode?: string | null;
      } | null> | null;
      numberOfPayments?: number | null;
      paymentFrequency?: PaymentFrequency | null;
      shippingAmount?: number | null;
    } | null;
    bpay?: {
      __typename: 'ContactBpay';
      billerCode?: number | null;
      referenceNumber?: string | null;
    } | null;
    bank?: {
      __typename: 'DocumentAnalysisBankAccount';
      accountNumber?: string | null;
      routingNumber?: string | null;
    } | null;
    source?: DocumentAnalysisSource | null;
    createdBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null;
};

export type DocumentAnalysisByEntityStatusQueryVariables = {
  entityId: string;
  status?: DocumentAnalysisStatus | null;
};

export type DocumentAnalysisByEntityStatusQuery = {
  documentAnalysisByEntityStatus?: {
    __typename: 'ModelDocumentAnalysisConnection';
    items: Array<{
      __typename: 'DocumentAnalysis';
      id: string;
      entityId: string;
      fileKey: string;
      status: DocumentAnalysisStatus;
      expenseStatus?: DocumentAnalysisStatus | null;
      queryStatus?: DocumentAnalysisStatus | null;
      matchedContactId?: string | null;
      matchedContact?: {
        __typename: 'Contact';
        id: string;
        entityId: string;
        xeroTenantId?: string | null;
        entityType?: EntityType | null;
        firstName?: string | null;
        lastName?: string | null;
        email?: string | null;
        mobile?: string | null;
        phone?: string | null;
        taxNumber?: string | null;
        companyNumber?: string | null;
        name?: string | null;
        legalName?: string | null;
        companyName?: string | null;
        searchName?: string | null;
        status?: ContactStatus | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        contactType?: ContactType | null;
        bank?: {
          __typename: 'ContactBankAccount';
          id?: string | null;
          accountName?: string | null;
          bankName?: string | null;
          accountNumber: string;
          routingNumber: string;
          holderType?: BankHolderType | null;
          accountType?: BankAccountType | null;
          country?: string | null;
        } | null;
        bpay?: {
          __typename: 'ContactBpay';
          billerCode?: number | null;
          referenceNumber?: string | null;
        } | null;
        bulkUploadFileKey?: string | null;
        owner?: string | null;
      } | null;
      matchedEntityId?: string | null;
      matchedEntity?: {
        __typename: 'Entity';
        id: string;
        type: EntityType;
        taxNumber?: string | null;
        companyNumber?: string | null;
        billerCode?: number | null;
        name: string;
        legalName?: string | null;
        searchName?: string | null;
        address?: {
          __typename: 'Address';
          addressId?: string | null;
          placeId?: string | null;
          contactName?: string | null;
          contactNumber?: string | null;
          addressFull?: string | null;
          address1?: string | null;
          address2?: string | null;
          unitNumber?: string | null;
          streetNumber?: string | null;
          streetName?: string | null;
          streetType?: string | null;
          city: string;
          country: string;
          countryCode?: string | null;
          state: string;
          stateCode?: string | null;
          postalCode: string;
        } | null;
        logo?: {
          __typename: 'Image';
          alt?: string | null;
          identityId?: string | null;
          key: string;
          level: S3UploadLevel;
          type?: string | null;
        } | null;
        entityBeneficialOwners?: {
          __typename: 'ModelEntityBeneficialOwnerConnection';
          items?: Array<{
            __typename: 'EntityBeneficialOwner';
            entityId: string;
            beneficialOwnerId: string;
            beneficialOwner?: {
              __typename: 'BeneficialOwner';
              id: string;
              firstName?: string | null;
              lastName?: string | null;
              name?: string | null;
              providerEntityId: string;
              verificationStatus: VerificationStatus;
              verificationAttempt?: number | null;
              createdBy?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
            } | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            owner?: string | null;
          } | null> | null;
          nextToken?: string | null;
        } | null;
        entityUsers?: {
          __typename: 'ModelEntityUserConnection';
          items: Array<{
            __typename: 'EntityUser';
            id: string;
            entityId: string;
            userId: string;
            invitedEmail?: string | null;
            referredBy?: string | null;
            invitedEntityId?: string | null;
            firmEntityId?: string | null;
            firstName?: string | null;
            lastName?: string | null;
            role?: EntityUserRole | null;
            paymentsEnabled?: boolean | null;
            entitySearchName?: string | null;
            entity?: {
              __typename: 'Entity';
              id: string;
              type: EntityType;
              taxNumber?: string | null;
              companyNumber?: string | null;
              billerCode?: number | null;
              name: string;
              legalName?: string | null;
              searchName?: string | null;
              address?: {
                __typename: 'Address';
                addressId?: string | null;
                placeId?: string | null;
                contactName?: string | null;
                contactNumber?: string | null;
                addressFull?: string | null;
                address1?: string | null;
                address2?: string | null;
                unitNumber?: string | null;
                streetNumber?: string | null;
                streetName?: string | null;
                streetType?: string | null;
                city: string;
                country: string;
                countryCode?: string | null;
                state: string;
                stateCode?: string | null;
                postalCode: string;
              } | null;
              logo?: {
                __typename: 'Image';
                alt?: string | null;
                identityId?: string | null;
                key: string;
                level: S3UploadLevel;
                type?: string | null;
              } | null;
              entityBeneficialOwners?: {
                __typename: 'ModelEntityBeneficialOwnerConnection';
                nextToken?: string | null;
              } | null;
              entityUsers?: {
                __typename: 'ModelEntityUserConnection';
                nextToken?: string | null;
              } | null;
              gstRegistered?: boolean | null;
              providerEntityId?: string | null;
              providerCompanyId?: string | null;
              providerBillUserCompanyId?: string | null;
              providerBankAccountId?: string | null;
              providerDigitalWalletId?: string | null;
              providerBpayCrn?: string | null;
              contact?: {
                __typename: 'EntityContact';
                firstName?: string | null;
                lastName?: string | null;
                email?: string | null;
                phone?: string | null;
                role?: string | null;
              } | null;
              paymentMethods?: {
                __typename: 'ModelPaymentMethodConnection';
                nextToken?: string | null;
              } | null;
              paymentMethodId?: string | null;
              paymentUserId?: string | null;
              disbursementMethodId?: string | null;
              receivingAccounts?: {
                __typename: 'ModelPaymentMethodConnection';
                nextToken?: string | null;
              } | null;
              ubosCreated?: boolean | null;
              numUbosCreated?: number | null;
              subCategory?: string | null;
              clientsStatus?: EntityClientsStatus | null;
              ocrEmail?: string | null;
              verificationStatus?: VerificationStatus | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              owner: string;
              referredBy?: string | null;
              xeroContactSyncStatus?: XeroSyncStatus | null;
              xeroLastContactSyncAt?: string | null;
              xeroInvoiceSyncStatus?: XeroSyncStatus | null;
              xeroLastInvoiceSyncAt?: string | null;
              xeroTenantId?: string | null;
            } | null;
            searchName?: string | null;
            createdBy?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            status?: EntityUserStatus | null;
          } | null>;
          nextToken?: string | null;
        } | null;
        gstRegistered?: boolean | null;
        providerEntityId?: string | null;
        providerCompanyId?: string | null;
        providerBillUserCompanyId?: string | null;
        providerBankAccountId?: string | null;
        providerDigitalWalletId?: string | null;
        providerBpayCrn?: string | null;
        contact?: {
          __typename: 'EntityContact';
          firstName?: string | null;
          lastName?: string | null;
          email?: string | null;
          phone?: string | null;
          role?: string | null;
        } | null;
        paymentMethods?: {
          __typename: 'ModelPaymentMethodConnection';
          items: Array<{
            __typename: 'PaymentMethod';
            id: string;
            paymentMethodType: PaymentMethodType;
            type?: string | null;
            fullName?: string | null;
            number?: string | null;
            expMonth?: string | null;
            expYear?: string | null;
            accountName?: string | null;
            bankName?: string | null;
            accountNumber?: string | null;
            routingNumber?: string | null;
            holderType?: BankHolderType | null;
            accountType?: BankAccountType | null;
            status?: PaymentMethodStatus | null;
            accountDirection?: AccountDirection | null;
            expiresAt?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
          } | null>;
          nextToken?: string | null;
        } | null;
        paymentMethodId?: string | null;
        paymentUserId?: string | null;
        disbursementMethodId?: string | null;
        receivingAccounts?: {
          __typename: 'ModelPaymentMethodConnection';
          items: Array<{
            __typename: 'PaymentMethod';
            id: string;
            paymentMethodType: PaymentMethodType;
            type?: string | null;
            fullName?: string | null;
            number?: string | null;
            expMonth?: string | null;
            expYear?: string | null;
            accountName?: string | null;
            bankName?: string | null;
            accountNumber?: string | null;
            routingNumber?: string | null;
            holderType?: BankHolderType | null;
            accountType?: BankAccountType | null;
            status?: PaymentMethodStatus | null;
            accountDirection?: AccountDirection | null;
            expiresAt?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
          } | null>;
          nextToken?: string | null;
        } | null;
        ubosCreated?: boolean | null;
        numUbosCreated?: number | null;
        subCategory?: string | null;
        clientsStatus?: EntityClientsStatus | null;
        ocrEmail?: string | null;
        verificationStatus?: VerificationStatus | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        owner: string;
        referredBy?: string | null;
        xeroContactSyncStatus?: XeroSyncStatus | null;
        xeroLastContactSyncAt?: string | null;
        xeroInvoiceSyncStatus?: XeroSyncStatus | null;
        xeroLastInvoiceSyncAt?: string | null;
        xeroTenantId?: string | null;
      } | null;
      newContact?: {
        __typename: 'DocumentAnalysisContact';
        firstName?: string | null;
        lastName?: string | null;
        email?: string | null;
        phone?: string | null;
        companyName?: string | null;
        taxNumber?: string | null;
      } | null;
      task?: {
        __typename: 'DocumentAnalysisTask';
        reference?: string | null;
        dueAt?: string | null;
        gstInclusive?: boolean | null;
        notes?: string | null;
        amount?: number | null;
        gstAmount?: number | null;
        lineItems?: Array<{
          __typename: 'DocumentAnalysisLineItem';
          description?: string | null;
          quantity?: number | null;
          unitPrice?: number | null;
          price?: number | null;
          productCode?: string | null;
        } | null> | null;
        numberOfPayments?: number | null;
        paymentFrequency?: PaymentFrequency | null;
        shippingAmount?: number | null;
      } | null;
      bpay?: {
        __typename: 'ContactBpay';
        billerCode?: number | null;
        referenceNumber?: string | null;
      } | null;
      bank?: {
        __typename: 'DocumentAnalysisBankAccount';
        accountNumber?: string | null;
        routingNumber?: string | null;
      } | null;
      source?: DocumentAnalysisSource | null;
      createdBy?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type GetEntityQueryVariables = {
  id: string;
};

export type GetEntityQuery = {
  getEntity?: {
    __typename: 'Entity';
    id: string;
    type: EntityType;
    taxNumber?: string | null;
    companyNumber?: string | null;
    billerCode?: number | null;
    name: string;
    legalName?: string | null;
    searchName?: string | null;
    address?: {
      __typename: 'Address';
      addressId?: string | null;
      placeId?: string | null;
      contactName?: string | null;
      contactNumber?: string | null;
      addressFull?: string | null;
      address1?: string | null;
      address2?: string | null;
      unitNumber?: string | null;
      streetNumber?: string | null;
      streetName?: string | null;
      streetType?: string | null;
      city: string;
      country: string;
      countryCode?: string | null;
      state: string;
      stateCode?: string | null;
      postalCode: string;
    } | null;
    logo?: {
      __typename: 'Image';
      alt?: string | null;
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type?: string | null;
    } | null;
    entityBeneficialOwners?: {
      __typename: 'ModelEntityBeneficialOwnerConnection';
      items?: Array<{
        __typename: 'EntityBeneficialOwner';
        entityId: string;
        beneficialOwnerId: string;
        beneficialOwner?: {
          __typename: 'BeneficialOwner';
          id: string;
          firstName?: string | null;
          lastName?: string | null;
          name?: string | null;
          providerEntityId: string;
          verificationStatus: VerificationStatus;
          verificationAttempt?: number | null;
          createdBy?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        owner?: string | null;
      } | null> | null;
      nextToken?: string | null;
    } | null;
    entityUsers?: {
      __typename: 'ModelEntityUserConnection';
      items: Array<{
        __typename: 'EntityUser';
        id: string;
        entityId: string;
        userId: string;
        invitedEmail?: string | null;
        referredBy?: string | null;
        invitedEntityId?: string | null;
        firmEntityId?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        role?: EntityUserRole | null;
        paymentsEnabled?: boolean | null;
        entitySearchName?: string | null;
        entity?: {
          __typename: 'Entity';
          id: string;
          type: EntityType;
          taxNumber?: string | null;
          companyNumber?: string | null;
          billerCode?: number | null;
          name: string;
          legalName?: string | null;
          searchName?: string | null;
          address?: {
            __typename: 'Address';
            addressId?: string | null;
            placeId?: string | null;
            contactName?: string | null;
            contactNumber?: string | null;
            addressFull?: string | null;
            address1?: string | null;
            address2?: string | null;
            unitNumber?: string | null;
            streetNumber?: string | null;
            streetName?: string | null;
            streetType?: string | null;
            city: string;
            country: string;
            countryCode?: string | null;
            state: string;
            stateCode?: string | null;
            postalCode: string;
          } | null;
          logo?: {
            __typename: 'Image';
            alt?: string | null;
            identityId?: string | null;
            key: string;
            level: S3UploadLevel;
            type?: string | null;
          } | null;
          entityBeneficialOwners?: {
            __typename: 'ModelEntityBeneficialOwnerConnection';
            items?: Array<{
              __typename: 'EntityBeneficialOwner';
              entityId: string;
              beneficialOwnerId: string;
              beneficialOwner?: {
                __typename: 'BeneficialOwner';
                id: string;
                firstName?: string | null;
                lastName?: string | null;
                name?: string | null;
                providerEntityId: string;
                verificationStatus: VerificationStatus;
                verificationAttempt?: number | null;
                createdBy?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              owner?: string | null;
            } | null> | null;
            nextToken?: string | null;
          } | null;
          entityUsers?: {
            __typename: 'ModelEntityUserConnection';
            items: Array<{
              __typename: 'EntityUser';
              id: string;
              entityId: string;
              userId: string;
              invitedEmail?: string | null;
              referredBy?: string | null;
              invitedEntityId?: string | null;
              firmEntityId?: string | null;
              firstName?: string | null;
              lastName?: string | null;
              role?: EntityUserRole | null;
              paymentsEnabled?: boolean | null;
              entitySearchName?: string | null;
              entity?: {
                __typename: 'Entity';
                id: string;
                type: EntityType;
                taxNumber?: string | null;
                companyNumber?: string | null;
                billerCode?: number | null;
                name: string;
                legalName?: string | null;
                searchName?: string | null;
                gstRegistered?: boolean | null;
                providerEntityId?: string | null;
                providerCompanyId?: string | null;
                providerBillUserCompanyId?: string | null;
                providerBankAccountId?: string | null;
                providerDigitalWalletId?: string | null;
                providerBpayCrn?: string | null;
                paymentMethodId?: string | null;
                paymentUserId?: string | null;
                disbursementMethodId?: string | null;
                ubosCreated?: boolean | null;
                numUbosCreated?: number | null;
                subCategory?: string | null;
                clientsStatus?: EntityClientsStatus | null;
                ocrEmail?: string | null;
                verificationStatus?: VerificationStatus | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                owner: string;
                referredBy?: string | null;
                xeroContactSyncStatus?: XeroSyncStatus | null;
                xeroLastContactSyncAt?: string | null;
                xeroInvoiceSyncStatus?: XeroSyncStatus | null;
                xeroLastInvoiceSyncAt?: string | null;
                xeroTenantId?: string | null;
              } | null;
              searchName?: string | null;
              createdBy?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              status?: EntityUserStatus | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          gstRegistered?: boolean | null;
          providerEntityId?: string | null;
          providerCompanyId?: string | null;
          providerBillUserCompanyId?: string | null;
          providerBankAccountId?: string | null;
          providerDigitalWalletId?: string | null;
          providerBpayCrn?: string | null;
          contact?: {
            __typename: 'EntityContact';
            firstName?: string | null;
            lastName?: string | null;
            email?: string | null;
            phone?: string | null;
            role?: string | null;
          } | null;
          paymentMethods?: {
            __typename: 'ModelPaymentMethodConnection';
            items: Array<{
              __typename: 'PaymentMethod';
              id: string;
              paymentMethodType: PaymentMethodType;
              type?: string | null;
              fullName?: string | null;
              number?: string | null;
              expMonth?: string | null;
              expYear?: string | null;
              accountName?: string | null;
              bankName?: string | null;
              accountNumber?: string | null;
              routingNumber?: string | null;
              holderType?: BankHolderType | null;
              accountType?: BankAccountType | null;
              status?: PaymentMethodStatus | null;
              accountDirection?: AccountDirection | null;
              expiresAt?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          paymentMethodId?: string | null;
          paymentUserId?: string | null;
          disbursementMethodId?: string | null;
          receivingAccounts?: {
            __typename: 'ModelPaymentMethodConnection';
            items: Array<{
              __typename: 'PaymentMethod';
              id: string;
              paymentMethodType: PaymentMethodType;
              type?: string | null;
              fullName?: string | null;
              number?: string | null;
              expMonth?: string | null;
              expYear?: string | null;
              accountName?: string | null;
              bankName?: string | null;
              accountNumber?: string | null;
              routingNumber?: string | null;
              holderType?: BankHolderType | null;
              accountType?: BankAccountType | null;
              status?: PaymentMethodStatus | null;
              accountDirection?: AccountDirection | null;
              expiresAt?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          ubosCreated?: boolean | null;
          numUbosCreated?: number | null;
          subCategory?: string | null;
          clientsStatus?: EntityClientsStatus | null;
          ocrEmail?: string | null;
          verificationStatus?: VerificationStatus | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          owner: string;
          referredBy?: string | null;
          xeroContactSyncStatus?: XeroSyncStatus | null;
          xeroLastContactSyncAt?: string | null;
          xeroInvoiceSyncStatus?: XeroSyncStatus | null;
          xeroLastInvoiceSyncAt?: string | null;
          xeroTenantId?: string | null;
        } | null;
        searchName?: string | null;
        createdBy?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        status?: EntityUserStatus | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    gstRegistered?: boolean | null;
    providerEntityId?: string | null;
    providerCompanyId?: string | null;
    providerBillUserCompanyId?: string | null;
    providerBankAccountId?: string | null;
    providerDigitalWalletId?: string | null;
    providerBpayCrn?: string | null;
    contact?: {
      __typename: 'EntityContact';
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
      phone?: string | null;
      role?: string | null;
    } | null;
    paymentMethods?: {
      __typename: 'ModelPaymentMethodConnection';
      items: Array<{
        __typename: 'PaymentMethod';
        id: string;
        paymentMethodType: PaymentMethodType;
        type?: string | null;
        fullName?: string | null;
        number?: string | null;
        expMonth?: string | null;
        expYear?: string | null;
        accountName?: string | null;
        bankName?: string | null;
        accountNumber?: string | null;
        routingNumber?: string | null;
        holderType?: BankHolderType | null;
        accountType?: BankAccountType | null;
        status?: PaymentMethodStatus | null;
        accountDirection?: AccountDirection | null;
        expiresAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    paymentMethodId?: string | null;
    paymentUserId?: string | null;
    disbursementMethodId?: string | null;
    receivingAccounts?: {
      __typename: 'ModelPaymentMethodConnection';
      items: Array<{
        __typename: 'PaymentMethod';
        id: string;
        paymentMethodType: PaymentMethodType;
        type?: string | null;
        fullName?: string | null;
        number?: string | null;
        expMonth?: string | null;
        expYear?: string | null;
        accountName?: string | null;
        bankName?: string | null;
        accountNumber?: string | null;
        routingNumber?: string | null;
        holderType?: BankHolderType | null;
        accountType?: BankAccountType | null;
        status?: PaymentMethodStatus | null;
        accountDirection?: AccountDirection | null;
        expiresAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    ubosCreated?: boolean | null;
    numUbosCreated?: number | null;
    subCategory?: string | null;
    clientsStatus?: EntityClientsStatus | null;
    ocrEmail?: string | null;
    verificationStatus?: VerificationStatus | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    owner: string;
    referredBy?: string | null;
    xeroContactSyncStatus?: XeroSyncStatus | null;
    xeroLastContactSyncAt?: string | null;
    xeroInvoiceSyncStatus?: XeroSyncStatus | null;
    xeroLastInvoiceSyncAt?: string | null;
    xeroTenantId?: string | null;
  } | null;
};

export type EntityUsersByUserQueryVariables = {
  sortDirection?: ModelSortDirection | null;
  filter?: ModelEntityUserFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type EntityUsersByUserQuery = {
  entityUsersByUser?: {
    __typename: 'ModelEntityUserConnection';
    items: Array<{
      __typename: 'EntityUser';
      id: string;
      entityId: string;
      userId: string;
      invitedEmail?: string | null;
      referredBy?: string | null;
      invitedEntityId?: string | null;
      firmEntityId?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      role?: EntityUserRole | null;
      paymentsEnabled?: boolean | null;
      entitySearchName?: string | null;
      entity?: {
        __typename: 'Entity';
        id: string;
        type: EntityType;
        taxNumber?: string | null;
        companyNumber?: string | null;
        billerCode?: number | null;
        name: string;
        legalName?: string | null;
        searchName?: string | null;
        address?: {
          __typename: 'Address';
          addressId?: string | null;
          placeId?: string | null;
          contactName?: string | null;
          contactNumber?: string | null;
          addressFull?: string | null;
          address1?: string | null;
          address2?: string | null;
          unitNumber?: string | null;
          streetNumber?: string | null;
          streetName?: string | null;
          streetType?: string | null;
          city: string;
          country: string;
          countryCode?: string | null;
          state: string;
          stateCode?: string | null;
          postalCode: string;
        } | null;
        logo?: {
          __typename: 'Image';
          alt?: string | null;
          identityId?: string | null;
          key: string;
          level: S3UploadLevel;
          type?: string | null;
        } | null;
        entityBeneficialOwners?: {
          __typename: 'ModelEntityBeneficialOwnerConnection';
          items?: Array<{
            __typename: 'EntityBeneficialOwner';
            entityId: string;
            beneficialOwnerId: string;
            beneficialOwner?: {
              __typename: 'BeneficialOwner';
              id: string;
              firstName?: string | null;
              lastName?: string | null;
              name?: string | null;
              providerEntityId: string;
              verificationStatus: VerificationStatus;
              verificationAttempt?: number | null;
              createdBy?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
            } | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            owner?: string | null;
          } | null> | null;
          nextToken?: string | null;
        } | null;
        entityUsers?: {
          __typename: 'ModelEntityUserConnection';
          items: Array<{
            __typename: 'EntityUser';
            id: string;
            entityId: string;
            userId: string;
            invitedEmail?: string | null;
            referredBy?: string | null;
            invitedEntityId?: string | null;
            firmEntityId?: string | null;
            firstName?: string | null;
            lastName?: string | null;
            role?: EntityUserRole | null;
            paymentsEnabled?: boolean | null;
            entitySearchName?: string | null;
            entity?: {
              __typename: 'Entity';
              id: string;
              type: EntityType;
              taxNumber?: string | null;
              companyNumber?: string | null;
              billerCode?: number | null;
              name: string;
              legalName?: string | null;
              searchName?: string | null;
              address?: {
                __typename: 'Address';
                addressId?: string | null;
                placeId?: string | null;
                contactName?: string | null;
                contactNumber?: string | null;
                addressFull?: string | null;
                address1?: string | null;
                address2?: string | null;
                unitNumber?: string | null;
                streetNumber?: string | null;
                streetName?: string | null;
                streetType?: string | null;
                city: string;
                country: string;
                countryCode?: string | null;
                state: string;
                stateCode?: string | null;
                postalCode: string;
              } | null;
              logo?: {
                __typename: 'Image';
                alt?: string | null;
                identityId?: string | null;
                key: string;
                level: S3UploadLevel;
                type?: string | null;
              } | null;
              entityBeneficialOwners?: {
                __typename: 'ModelEntityBeneficialOwnerConnection';
                nextToken?: string | null;
              } | null;
              entityUsers?: {
                __typename: 'ModelEntityUserConnection';
                nextToken?: string | null;
              } | null;
              gstRegistered?: boolean | null;
              providerEntityId?: string | null;
              providerCompanyId?: string | null;
              providerBillUserCompanyId?: string | null;
              providerBankAccountId?: string | null;
              providerDigitalWalletId?: string | null;
              providerBpayCrn?: string | null;
              contact?: {
                __typename: 'EntityContact';
                firstName?: string | null;
                lastName?: string | null;
                email?: string | null;
                phone?: string | null;
                role?: string | null;
              } | null;
              paymentMethods?: {
                __typename: 'ModelPaymentMethodConnection';
                nextToken?: string | null;
              } | null;
              paymentMethodId?: string | null;
              paymentUserId?: string | null;
              disbursementMethodId?: string | null;
              receivingAccounts?: {
                __typename: 'ModelPaymentMethodConnection';
                nextToken?: string | null;
              } | null;
              ubosCreated?: boolean | null;
              numUbosCreated?: number | null;
              subCategory?: string | null;
              clientsStatus?: EntityClientsStatus | null;
              ocrEmail?: string | null;
              verificationStatus?: VerificationStatus | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              owner: string;
              referredBy?: string | null;
              xeroContactSyncStatus?: XeroSyncStatus | null;
              xeroLastContactSyncAt?: string | null;
              xeroInvoiceSyncStatus?: XeroSyncStatus | null;
              xeroLastInvoiceSyncAt?: string | null;
              xeroTenantId?: string | null;
            } | null;
            searchName?: string | null;
            createdBy?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            status?: EntityUserStatus | null;
          } | null>;
          nextToken?: string | null;
        } | null;
        gstRegistered?: boolean | null;
        providerEntityId?: string | null;
        providerCompanyId?: string | null;
        providerBillUserCompanyId?: string | null;
        providerBankAccountId?: string | null;
        providerDigitalWalletId?: string | null;
        providerBpayCrn?: string | null;
        contact?: {
          __typename: 'EntityContact';
          firstName?: string | null;
          lastName?: string | null;
          email?: string | null;
          phone?: string | null;
          role?: string | null;
        } | null;
        paymentMethods?: {
          __typename: 'ModelPaymentMethodConnection';
          items: Array<{
            __typename: 'PaymentMethod';
            id: string;
            paymentMethodType: PaymentMethodType;
            type?: string | null;
            fullName?: string | null;
            number?: string | null;
            expMonth?: string | null;
            expYear?: string | null;
            accountName?: string | null;
            bankName?: string | null;
            accountNumber?: string | null;
            routingNumber?: string | null;
            holderType?: BankHolderType | null;
            accountType?: BankAccountType | null;
            status?: PaymentMethodStatus | null;
            accountDirection?: AccountDirection | null;
            expiresAt?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
          } | null>;
          nextToken?: string | null;
        } | null;
        paymentMethodId?: string | null;
        paymentUserId?: string | null;
        disbursementMethodId?: string | null;
        receivingAccounts?: {
          __typename: 'ModelPaymentMethodConnection';
          items: Array<{
            __typename: 'PaymentMethod';
            id: string;
            paymentMethodType: PaymentMethodType;
            type?: string | null;
            fullName?: string | null;
            number?: string | null;
            expMonth?: string | null;
            expYear?: string | null;
            accountName?: string | null;
            bankName?: string | null;
            accountNumber?: string | null;
            routingNumber?: string | null;
            holderType?: BankHolderType | null;
            accountType?: BankAccountType | null;
            status?: PaymentMethodStatus | null;
            accountDirection?: AccountDirection | null;
            expiresAt?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
          } | null>;
          nextToken?: string | null;
        } | null;
        ubosCreated?: boolean | null;
        numUbosCreated?: number | null;
        subCategory?: string | null;
        clientsStatus?: EntityClientsStatus | null;
        ocrEmail?: string | null;
        verificationStatus?: VerificationStatus | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        owner: string;
        referredBy?: string | null;
        xeroContactSyncStatus?: XeroSyncStatus | null;
        xeroLastContactSyncAt?: string | null;
        xeroInvoiceSyncStatus?: XeroSyncStatus | null;
        xeroLastInvoiceSyncAt?: string | null;
        xeroTenantId?: string | null;
      } | null;
      searchName?: string | null;
      createdBy?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      status?: EntityUserStatus | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type EntityUsersByEntityIdQueryVariables = {
  entityId?: string | null;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelEntityUserFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type EntityUsersByEntityIdQuery = {
  entityUsersByEntityId?: {
    __typename: 'ModelEntityUserConnection';
    items: Array<{
      __typename: 'EntityUser';
      id: string;
      entityId: string;
      userId: string;
      invitedEmail?: string | null;
      referredBy?: string | null;
      invitedEntityId?: string | null;
      firmEntityId?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      role?: EntityUserRole | null;
      paymentsEnabled?: boolean | null;
      entitySearchName?: string | null;
      entity?: {
        __typename: 'Entity';
        id: string;
        type: EntityType;
        taxNumber?: string | null;
        companyNumber?: string | null;
        billerCode?: number | null;
        name: string;
        legalName?: string | null;
        searchName?: string | null;
        address?: {
          __typename: 'Address';
          addressId?: string | null;
          placeId?: string | null;
          contactName?: string | null;
          contactNumber?: string | null;
          addressFull?: string | null;
          address1?: string | null;
          address2?: string | null;
          unitNumber?: string | null;
          streetNumber?: string | null;
          streetName?: string | null;
          streetType?: string | null;
          city: string;
          country: string;
          countryCode?: string | null;
          state: string;
          stateCode?: string | null;
          postalCode: string;
        } | null;
        logo?: {
          __typename: 'Image';
          alt?: string | null;
          identityId?: string | null;
          key: string;
          level: S3UploadLevel;
          type?: string | null;
        } | null;
        entityBeneficialOwners?: {
          __typename: 'ModelEntityBeneficialOwnerConnection';
          items?: Array<{
            __typename: 'EntityBeneficialOwner';
            entityId: string;
            beneficialOwnerId: string;
            beneficialOwner?: {
              __typename: 'BeneficialOwner';
              id: string;
              firstName?: string | null;
              lastName?: string | null;
              name?: string | null;
              providerEntityId: string;
              verificationStatus: VerificationStatus;
              verificationAttempt?: number | null;
              createdBy?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
            } | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            owner?: string | null;
          } | null> | null;
          nextToken?: string | null;
        } | null;
        entityUsers?: {
          __typename: 'ModelEntityUserConnection';
          items: Array<{
            __typename: 'EntityUser';
            id: string;
            entityId: string;
            userId: string;
            invitedEmail?: string | null;
            referredBy?: string | null;
            invitedEntityId?: string | null;
            firmEntityId?: string | null;
            firstName?: string | null;
            lastName?: string | null;
            role?: EntityUserRole | null;
            paymentsEnabled?: boolean | null;
            entitySearchName?: string | null;
            entity?: {
              __typename: 'Entity';
              id: string;
              type: EntityType;
              taxNumber?: string | null;
              companyNumber?: string | null;
              billerCode?: number | null;
              name: string;
              legalName?: string | null;
              searchName?: string | null;
              address?: {
                __typename: 'Address';
                addressId?: string | null;
                placeId?: string | null;
                contactName?: string | null;
                contactNumber?: string | null;
                addressFull?: string | null;
                address1?: string | null;
                address2?: string | null;
                unitNumber?: string | null;
                streetNumber?: string | null;
                streetName?: string | null;
                streetType?: string | null;
                city: string;
                country: string;
                countryCode?: string | null;
                state: string;
                stateCode?: string | null;
                postalCode: string;
              } | null;
              logo?: {
                __typename: 'Image';
                alt?: string | null;
                identityId?: string | null;
                key: string;
                level: S3UploadLevel;
                type?: string | null;
              } | null;
              entityBeneficialOwners?: {
                __typename: 'ModelEntityBeneficialOwnerConnection';
                nextToken?: string | null;
              } | null;
              entityUsers?: {
                __typename: 'ModelEntityUserConnection';
                nextToken?: string | null;
              } | null;
              gstRegistered?: boolean | null;
              providerEntityId?: string | null;
              providerCompanyId?: string | null;
              providerBillUserCompanyId?: string | null;
              providerBankAccountId?: string | null;
              providerDigitalWalletId?: string | null;
              providerBpayCrn?: string | null;
              contact?: {
                __typename: 'EntityContact';
                firstName?: string | null;
                lastName?: string | null;
                email?: string | null;
                phone?: string | null;
                role?: string | null;
              } | null;
              paymentMethods?: {
                __typename: 'ModelPaymentMethodConnection';
                nextToken?: string | null;
              } | null;
              paymentMethodId?: string | null;
              paymentUserId?: string | null;
              disbursementMethodId?: string | null;
              receivingAccounts?: {
                __typename: 'ModelPaymentMethodConnection';
                nextToken?: string | null;
              } | null;
              ubosCreated?: boolean | null;
              numUbosCreated?: number | null;
              subCategory?: string | null;
              clientsStatus?: EntityClientsStatus | null;
              ocrEmail?: string | null;
              verificationStatus?: VerificationStatus | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              owner: string;
              referredBy?: string | null;
              xeroContactSyncStatus?: XeroSyncStatus | null;
              xeroLastContactSyncAt?: string | null;
              xeroInvoiceSyncStatus?: XeroSyncStatus | null;
              xeroLastInvoiceSyncAt?: string | null;
              xeroTenantId?: string | null;
            } | null;
            searchName?: string | null;
            createdBy?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            status?: EntityUserStatus | null;
          } | null>;
          nextToken?: string | null;
        } | null;
        gstRegistered?: boolean | null;
        providerEntityId?: string | null;
        providerCompanyId?: string | null;
        providerBillUserCompanyId?: string | null;
        providerBankAccountId?: string | null;
        providerDigitalWalletId?: string | null;
        providerBpayCrn?: string | null;
        contact?: {
          __typename: 'EntityContact';
          firstName?: string | null;
          lastName?: string | null;
          email?: string | null;
          phone?: string | null;
          role?: string | null;
        } | null;
        paymentMethods?: {
          __typename: 'ModelPaymentMethodConnection';
          items: Array<{
            __typename: 'PaymentMethod';
            id: string;
            paymentMethodType: PaymentMethodType;
            type?: string | null;
            fullName?: string | null;
            number?: string | null;
            expMonth?: string | null;
            expYear?: string | null;
            accountName?: string | null;
            bankName?: string | null;
            accountNumber?: string | null;
            routingNumber?: string | null;
            holderType?: BankHolderType | null;
            accountType?: BankAccountType | null;
            status?: PaymentMethodStatus | null;
            accountDirection?: AccountDirection | null;
            expiresAt?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
          } | null>;
          nextToken?: string | null;
        } | null;
        paymentMethodId?: string | null;
        paymentUserId?: string | null;
        disbursementMethodId?: string | null;
        receivingAccounts?: {
          __typename: 'ModelPaymentMethodConnection';
          items: Array<{
            __typename: 'PaymentMethod';
            id: string;
            paymentMethodType: PaymentMethodType;
            type?: string | null;
            fullName?: string | null;
            number?: string | null;
            expMonth?: string | null;
            expYear?: string | null;
            accountName?: string | null;
            bankName?: string | null;
            accountNumber?: string | null;
            routingNumber?: string | null;
            holderType?: BankHolderType | null;
            accountType?: BankAccountType | null;
            status?: PaymentMethodStatus | null;
            accountDirection?: AccountDirection | null;
            expiresAt?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
          } | null>;
          nextToken?: string | null;
        } | null;
        ubosCreated?: boolean | null;
        numUbosCreated?: number | null;
        subCategory?: string | null;
        clientsStatus?: EntityClientsStatus | null;
        ocrEmail?: string | null;
        verificationStatus?: VerificationStatus | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        owner: string;
        referredBy?: string | null;
        xeroContactSyncStatus?: XeroSyncStatus | null;
        xeroLastContactSyncAt?: string | null;
        xeroInvoiceSyncStatus?: XeroSyncStatus | null;
        xeroLastInvoiceSyncAt?: string | null;
        xeroTenantId?: string | null;
      } | null;
      searchName?: string | null;
      createdBy?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      status?: EntityUserStatus | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type GetBusinessLookupQueryVariables = {
  query?: string | null;
};

export type GetBusinessLookupQuery = {
  getBusinessLookup: Array<{
    __typename: 'BusinessLookupResult';
    name?: string | null;
    legalNames?: Array<string | null> | null;
    businessNames?: Array<string | null> | null;
    mainNames?: Array<string | null> | null;
    tradingNames?: Array<string | null> | null;
    score?: string | null;
    state?: string | null;
    postalCode?: string | null;
    type?: string | null;
    abn?: string | null;
    acn?: string | null;
    isActive?: boolean | null;
  } | null>;
};

export type GetMessageQueryVariables = {
  id: string;
};

export type GetMessageQuery = {
  getMessage?: {
    __typename: 'Message';
    conversationId: string;
    text?: string | null;
    attachments?: Array<{
      __typename: 'S3Upload';
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type: S3UploadType;
    } | null> | null;
    users: Array<string | null>;
    receiver: string;
    sender: string;
    createdBy: string;
    readBy?: Array<string | null> | null;
    createdAt: string;
    updatedAt?: string | null;
    id: string;
    conversationMessagesId?: string | null;
  } | null;
};

export type ListMessagesQueryVariables = {
  filter?: ModelMessageFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListMessagesQuery = {
  listMessages?: {
    __typename: 'ModelMessageConnection';
    items: Array<{
      __typename: 'Message';
      conversationId: string;
      text?: string | null;
      attachments?: Array<{
        __typename: 'S3Upload';
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type: S3UploadType;
      } | null> | null;
      users: Array<string | null>;
      receiver: string;
      sender: string;
      createdBy: string;
      readBy?: Array<string | null> | null;
      createdAt: string;
      updatedAt?: string | null;
      id: string;
      conversationMessagesId?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type MessagesByConversationQueryVariables = {
  conversationId: string;
  createdAt?: ModelStringKeyConditionInput | null;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelMessageFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type MessagesByConversationQuery = {
  messagesByConversation?: {
    __typename: 'ModelMessageConnection';
    items: Array<{
      __typename: 'Message';
      conversationId: string;
      text?: string | null;
      attachments?: Array<{
        __typename: 'S3Upload';
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type: S3UploadType;
      } | null> | null;
      users: Array<string | null>;
      receiver: string;
      sender: string;
      createdBy: string;
      readBy?: Array<string | null> | null;
      createdAt: string;
      updatedAt?: string | null;
      id: string;
      conversationMessagesId?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type NotificationsByUserQueryVariables = {
  sortDirection?: ModelSortDirection | null;
  filter?: ModelNotificationFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type NotificationsByUserQuery = {
  notificationsByUser?: {
    __typename: 'ModelNotificationConnection';
    items: Array<{
      __typename: 'Notification';
      id: string;
      title?: string | null;
      message?: string | null;
      status?: NotificationStatus | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      type?: string | null;
      owner: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type GetOptionQueryVariables = {
  id: string;
};

export type GetOptionQuery = {
  getOption?: {
    __typename: 'Option';
    name?: string | null;
    label: string;
    value: string;
    group?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
  } | null;
};

export type ListOptionsQueryVariables = {
  filter?: ModelOptionFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListOptionsQuery = {
  listOptions?: {
    __typename: 'ModelOptionConnection';
    items: Array<{
      __typename: 'Option';
      name?: string | null;
      label: string;
      value: string;
      group?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type OptionsByNameQueryVariables = {
  name: string;
  label?: ModelStringKeyConditionInput | null;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelOptionFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type OptionsByNameQuery = {
  optionsByName?: {
    __typename: 'ModelOptionConnection';
    items: Array<{
      __typename: 'Option';
      name?: string | null;
      label: string;
      value: string;
      group?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type OptionsByGroupQueryVariables = {
  group: string;
  label?: ModelStringKeyConditionInput | null;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelOptionFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type OptionsByGroupQuery = {
  optionsByGroup?: {
    __typename: 'ModelOptionConnection';
    items: Array<{
      __typename: 'Option';
      name?: string | null;
      label: string;
      value: string;
      group?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type GetPaymentGuestQueryVariables = {
  id: string;
};

export type GetPaymentGuestQuery = {
  getPaymentGuest?: {
    __typename: 'PaymentGuest';
    id: string;
    entityId: string;
    taskId?: string | null;
    amount?: number | null;
    installment?: number | null;
    installments?: number | null;
    feeAmount?: number | null;
    paymentType?: PaymentType | null;
    taxAmount?: number | null;
    currency?: string | null;
    feeId?: string | null;
    status: PaymentStatus;
    payerUserStatus?: PayerUserStatus | null;
    scheduledAt?: string | null;
    paidAt?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    owner?: string | null;
  } | null;
};

export type ListRatingsByUserQueryVariables = {
  userId: string;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelTransactionFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListRatingsByUserQuery = {
  listRatingsByUser?: {
    __typename: 'ModelRatingConnection';
    items: Array<{
      __typename: 'Rating';
      id: string;
      ratingBy?: string | null;
      owner?: string | null;
      name?: string | null;
      rating?: number | null;
      comment?: string | null;
      status?: RatingStatus | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type GetServiceQueryVariables = {
  id: string;
};

export type GetServiceQuery = {
  getService?: {
    __typename: 'Service';
    id: string;
    entityId: string;
    title?: string | null;
    description?: string | null;
    amount: number;
    feeType: FeeType;
    taxType: TaxType;
    searchName?: string | null;
    status: ServiceStatus;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type ServicesByEntityQueryVariables = {
  entityId: string;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelServiceFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ServicesByEntityQuery = {
  servicesByEntity?: {
    __typename: 'ModelServiceConnection';
    items?: Array<{
      __typename: 'Service';
      id: string;
      entityId: string;
      title?: string | null;
      description?: string | null;
      amount: number;
      feeType: FeeType;
      taxType: TaxType;
      searchName?: string | null;
      status: ServiceStatus;
      createdAt: string;
      updatedAt: string;
    } | null> | null;
    nextToken?: string | null;
  } | null;
};

export type GetTaskQueryVariables = {
  id: string;
  entityId: string;
};

export type GetTaskQuery = {
  getTask?: {
    __typename: 'Task';
    entityId: string;
    taskNumber?: string | null;
    invoiceStatus?: InvoiceStatus | null;
    agreementUuid?: string | null;
    id: string;
    activity?: {
      __typename: 'ModelActivityConnection';
      items: Array<{
        __typename: 'Activity';
        id: string;
        compositeId: string;
        userId?: string | null;
        entityId?: string | null;
        type: ActivityType;
        message?: string | null;
        metadata?: {
          __typename: 'ActivityMetadata';
          name?: string | null;
        } | null;
        createdAt?: string | null;
        updatedAt?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    amount?: number | null;
    annotations?: string | null;
    entityIdFrom?: string | null;
    fromId: string;
    fromType: FromToType;
    toId?: string | null;
    toType?: FromToType | null;
    entityIdTo?: string | null;
    contactIdFrom?: string | null;
    contactIdTo?: string | null;
    contactId?: string | null;
    fromSearchStatus?: string | null;
    toSearchStatus?: string | null;
    entityByIdContactId?: string | null;
    searchName?: string | null;
    status: TaskStatus;
    signatureStatus?: TaskSignatureStatus | null;
    paymentStatus?: TaskPaymentStatus | null;
    type: TaskType;
    category?: TaskCategory | null;
    documents?: Array<{
      __typename: 'S3Upload';
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type: S3UploadType;
    } | null> | null;
    numberOfPayments?: number | null;
    paymentFrequency?: PaymentFrequency | null;
    paymentTypes: Array<PaymentType | null>;
    reference?: string | null;
    bpayReferenceNumber?: string | null;
    settlementStatus?: TaskSettlementStatus | null;
    signers?: Array<{
      __typename: 'EntityUser';
      id: string;
      entityId: string;
      userId: string;
      invitedEmail?: string | null;
      referredBy?: string | null;
      invitedEntityId?: string | null;
      firmEntityId?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      role?: EntityUserRole | null;
      paymentsEnabled?: boolean | null;
      entitySearchName?: string | null;
      entity?: {
        __typename: 'Entity';
        id: string;
        type: EntityType;
        taxNumber?: string | null;
        companyNumber?: string | null;
        billerCode?: number | null;
        name: string;
        legalName?: string | null;
        searchName?: string | null;
        address?: {
          __typename: 'Address';
          addressId?: string | null;
          placeId?: string | null;
          contactName?: string | null;
          contactNumber?: string | null;
          addressFull?: string | null;
          address1?: string | null;
          address2?: string | null;
          unitNumber?: string | null;
          streetNumber?: string | null;
          streetName?: string | null;
          streetType?: string | null;
          city: string;
          country: string;
          countryCode?: string | null;
          state: string;
          stateCode?: string | null;
          postalCode: string;
        } | null;
        logo?: {
          __typename: 'Image';
          alt?: string | null;
          identityId?: string | null;
          key: string;
          level: S3UploadLevel;
          type?: string | null;
        } | null;
        entityBeneficialOwners?: {
          __typename: 'ModelEntityBeneficialOwnerConnection';
          items?: Array<{
            __typename: 'EntityBeneficialOwner';
            entityId: string;
            beneficialOwnerId: string;
            beneficialOwner?: {
              __typename: 'BeneficialOwner';
              id: string;
              firstName?: string | null;
              lastName?: string | null;
              name?: string | null;
              providerEntityId: string;
              verificationStatus: VerificationStatus;
              verificationAttempt?: number | null;
              createdBy?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
            } | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            owner?: string | null;
          } | null> | null;
          nextToken?: string | null;
        } | null;
        entityUsers?: {
          __typename: 'ModelEntityUserConnection';
          items: Array<{
            __typename: 'EntityUser';
            id: string;
            entityId: string;
            userId: string;
            invitedEmail?: string | null;
            referredBy?: string | null;
            invitedEntityId?: string | null;
            firmEntityId?: string | null;
            firstName?: string | null;
            lastName?: string | null;
            role?: EntityUserRole | null;
            paymentsEnabled?: boolean | null;
            entitySearchName?: string | null;
            entity?: {
              __typename: 'Entity';
              id: string;
              type: EntityType;
              taxNumber?: string | null;
              companyNumber?: string | null;
              billerCode?: number | null;
              name: string;
              legalName?: string | null;
              searchName?: string | null;
              address?: {
                __typename: 'Address';
                addressId?: string | null;
                placeId?: string | null;
                contactName?: string | null;
                contactNumber?: string | null;
                addressFull?: string | null;
                address1?: string | null;
                address2?: string | null;
                unitNumber?: string | null;
                streetNumber?: string | null;
                streetName?: string | null;
                streetType?: string | null;
                city: string;
                country: string;
                countryCode?: string | null;
                state: string;
                stateCode?: string | null;
                postalCode: string;
              } | null;
              logo?: {
                __typename: 'Image';
                alt?: string | null;
                identityId?: string | null;
                key: string;
                level: S3UploadLevel;
                type?: string | null;
              } | null;
              entityBeneficialOwners?: {
                __typename: 'ModelEntityBeneficialOwnerConnection';
                nextToken?: string | null;
              } | null;
              entityUsers?: {
                __typename: 'ModelEntityUserConnection';
                nextToken?: string | null;
              } | null;
              gstRegistered?: boolean | null;
              providerEntityId?: string | null;
              providerCompanyId?: string | null;
              providerBillUserCompanyId?: string | null;
              providerBankAccountId?: string | null;
              providerDigitalWalletId?: string | null;
              providerBpayCrn?: string | null;
              contact?: {
                __typename: 'EntityContact';
                firstName?: string | null;
                lastName?: string | null;
                email?: string | null;
                phone?: string | null;
                role?: string | null;
              } | null;
              paymentMethods?: {
                __typename: 'ModelPaymentMethodConnection';
                nextToken?: string | null;
              } | null;
              paymentMethodId?: string | null;
              paymentUserId?: string | null;
              disbursementMethodId?: string | null;
              receivingAccounts?: {
                __typename: 'ModelPaymentMethodConnection';
                nextToken?: string | null;
              } | null;
              ubosCreated?: boolean | null;
              numUbosCreated?: number | null;
              subCategory?: string | null;
              clientsStatus?: EntityClientsStatus | null;
              ocrEmail?: string | null;
              verificationStatus?: VerificationStatus | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              owner: string;
              referredBy?: string | null;
              xeroContactSyncStatus?: XeroSyncStatus | null;
              xeroLastContactSyncAt?: string | null;
              xeroInvoiceSyncStatus?: XeroSyncStatus | null;
              xeroLastInvoiceSyncAt?: string | null;
              xeroTenantId?: string | null;
            } | null;
            searchName?: string | null;
            createdBy?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            status?: EntityUserStatus | null;
          } | null>;
          nextToken?: string | null;
        } | null;
        gstRegistered?: boolean | null;
        providerEntityId?: string | null;
        providerCompanyId?: string | null;
        providerBillUserCompanyId?: string | null;
        providerBankAccountId?: string | null;
        providerDigitalWalletId?: string | null;
        providerBpayCrn?: string | null;
        contact?: {
          __typename: 'EntityContact';
          firstName?: string | null;
          lastName?: string | null;
          email?: string | null;
          phone?: string | null;
          role?: string | null;
        } | null;
        paymentMethods?: {
          __typename: 'ModelPaymentMethodConnection';
          items: Array<{
            __typename: 'PaymentMethod';
            id: string;
            paymentMethodType: PaymentMethodType;
            type?: string | null;
            fullName?: string | null;
            number?: string | null;
            expMonth?: string | null;
            expYear?: string | null;
            accountName?: string | null;
            bankName?: string | null;
            accountNumber?: string | null;
            routingNumber?: string | null;
            holderType?: BankHolderType | null;
            accountType?: BankAccountType | null;
            status?: PaymentMethodStatus | null;
            accountDirection?: AccountDirection | null;
            expiresAt?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
          } | null>;
          nextToken?: string | null;
        } | null;
        paymentMethodId?: string | null;
        paymentUserId?: string | null;
        disbursementMethodId?: string | null;
        receivingAccounts?: {
          __typename: 'ModelPaymentMethodConnection';
          items: Array<{
            __typename: 'PaymentMethod';
            id: string;
            paymentMethodType: PaymentMethodType;
            type?: string | null;
            fullName?: string | null;
            number?: string | null;
            expMonth?: string | null;
            expYear?: string | null;
            accountName?: string | null;
            bankName?: string | null;
            accountNumber?: string | null;
            routingNumber?: string | null;
            holderType?: BankHolderType | null;
            accountType?: BankAccountType | null;
            status?: PaymentMethodStatus | null;
            accountDirection?: AccountDirection | null;
            expiresAt?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
          } | null>;
          nextToken?: string | null;
        } | null;
        ubosCreated?: boolean | null;
        numUbosCreated?: number | null;
        subCategory?: string | null;
        clientsStatus?: EntityClientsStatus | null;
        ocrEmail?: string | null;
        verificationStatus?: VerificationStatus | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        owner: string;
        referredBy?: string | null;
        xeroContactSyncStatus?: XeroSyncStatus | null;
        xeroLastContactSyncAt?: string | null;
        xeroInvoiceSyncStatus?: XeroSyncStatus | null;
        xeroLastInvoiceSyncAt?: string | null;
        xeroTenantId?: string | null;
      } | null;
      searchName?: string | null;
      createdBy?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      status?: EntityUserStatus | null;
    } | null> | null;
    otherRecipients?: Array<{
      __typename: 'OtherRecipient';
      email: string;
      sendOnCompletion: boolean;
    } | null> | null;
    payments?: {
      __typename: 'ModelPaymentConnection';
      items: Array<{
        __typename: 'Payment';
        id: string;
        taskId?: string | null;
        entityId?: string | null;
        payInPaymentId?: string | null;
        providerTransactionId?: string | null;
        paymentProvider?: PaymentProvider | null;
        disbursementId?: string | null;
        fromId: string;
        fromType: FromToType;
        toId?: string | null;
        toType?: FromToType | null;
        buyerId?: string | null;
        sellerId?: string | null;
        entityIdTo?: string | null;
        amount?: number | null;
        netAmount?: number | null;
        payerFees?: number | null;
        totalAmount?: number | null;
        gstAmount?: number | null;
        installment?: number | null;
        installments?: number | null;
        feeAmount?: number | null;
        paymentType?: PaymentType | null;
        taxAmount?: number | null;
        currency?: string | null;
        feeIds?: Array<string | null> | null;
        ipAddress?: string | null;
        status: PaymentStatus;
        payerUserStatus?: PayerUserStatus | null;
        declinedReason?: string | null;
        scheduledAt?: string | null;
        paidAt?: string | null;
        declinedAt?: string | null;
        createdAt?: string | null;
        receivedAt?: string | null;
        paidOutAt?: string | null;
        updatedAt?: string | null;
        voidedAt?: string | null;
        owner?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    createdBy: string;
    entityIdBy?: string | null;
    dueAt: string;
    notes?: string | null;
    direction?: TaskDirection | null;
    readBy?: Array<string | null> | null;
    gstInclusive?: boolean | null;
    paymentAt?: string | null;
    lodgementAt?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    viewedAt?: string | null;
    readAt?: string | null;
    paidAt?: string | null;
    completedAt?: string | null;
    owner?: string | null;
    lineItems?: Array<{
      __typename: 'LineItem';
      description?: string | null;
      quantity?: number | null;
      unitAmount?: number | null;
      taxType?: string | null;
      lineAmount?: number | null;
    } | null> | null;
    xeroTenantId?: string | null;
  } | null;
};

export type GetTaskGuestQueryVariables = {
  id?: string | null;
  entityId?: string | null;
};

export type GetTaskGuestQuery = {
  getTaskGuest?: {
    __typename: 'TaskGuest';
    id: string;
    entityId: string;
    amount?: number | null;
    annotations?: string | null;
    fromId: string;
    fromEntity?: {
      __typename: 'EntityGuest';
      id: string;
      name: string;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    from?: {
      __typename: 'EntityGuest';
      id: string;
      name: string;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    fromContact?: {
      __typename: 'ContactGuest';
      id: string;
      firstName?: string | null;
      lastName?: string | null;
      name?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    fromType?: FromToType | null;
    toEntity?: {
      __typename: 'EntityGuest';
      id: string;
      name: string;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    toContact?: {
      __typename: 'ContactGuest';
      id: string;
      firstName?: string | null;
      lastName?: string | null;
      name?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    toId?: string | null;
    to?: {
      __typename: 'EntityGuest';
      id: string;
      name: string;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    toType?: FromToType | null;
    status: TaskStatus;
    signatureStatus?: TaskSignatureStatus | null;
    paymentStatus?: TaskPaymentStatus | null;
    settlementStatus?: TaskSettlementStatus | null;
    type: TaskType;
    category?: TaskCategory | null;
    documents?: Array<{
      __typename: 'S3Upload';
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type: S3UploadType;
    } | null> | null;
    numberOfPayments?: number | null;
    paymentFrequency?: PaymentFrequency | null;
    paymentTypes: Array<PaymentType | null>;
    reference?: string | null;
    bpayReferenceNumber?: string | null;
    createdBy: string;
    gstInclusive?: boolean | null;
    entityIdBy?: string | null;
    dueAt: string;
    notes?: string | null;
    direction?: TaskDirection | null;
    paymentAt?: string | null;
    lodgementAt?: string | null;
    readAt?: string | null;
    paidAt?: string | null;
    completedAt?: string | null;
    owner?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null;
};

export type GetTaskPublicQueryVariables = {
  token: string;
};

export type GetTaskPublicQuery = {
  getTaskPublic?: {
    __typename: 'TaskGuest';
    id: string;
    entityId: string;
    amount?: number | null;
    annotations?: string | null;
    fromId: string;
    fromEntity?: {
      __typename: 'EntityGuest';
      id: string;
      name: string;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    from?: {
      __typename: 'EntityGuest';
      id: string;
      name: string;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    fromContact?: {
      __typename: 'ContactGuest';
      id: string;
      firstName?: string | null;
      lastName?: string | null;
      name?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    fromType?: FromToType | null;
    toEntity?: {
      __typename: 'EntityGuest';
      id: string;
      name: string;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    toContact?: {
      __typename: 'ContactGuest';
      id: string;
      firstName?: string | null;
      lastName?: string | null;
      name?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    toId?: string | null;
    to?: {
      __typename: 'EntityGuest';
      id: string;
      name: string;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null;
    toType?: FromToType | null;
    status: TaskStatus;
    signatureStatus?: TaskSignatureStatus | null;
    paymentStatus?: TaskPaymentStatus | null;
    settlementStatus?: TaskSettlementStatus | null;
    type: TaskType;
    category?: TaskCategory | null;
    documents?: Array<{
      __typename: 'S3Upload';
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type: S3UploadType;
    } | null> | null;
    numberOfPayments?: number | null;
    paymentFrequency?: PaymentFrequency | null;
    paymentTypes: Array<PaymentType | null>;
    reference?: string | null;
    bpayReferenceNumber?: string | null;
    createdBy: string;
    gstInclusive?: boolean | null;
    entityIdBy?: string | null;
    dueAt: string;
    notes?: string | null;
    direction?: TaskDirection | null;
    paymentAt?: string | null;
    lodgementAt?: string | null;
    readAt?: string | null;
    paidAt?: string | null;
    completedAt?: string | null;
    owner?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null;
};

export type TasksByEntityFromQueryVariables = {
  entityId: string;
  status: TaskSearchStatus;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelTaskFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type TasksByEntityFromQuery = {
  tasksByEntityFrom?: {
    __typename: 'ModelTaskConnection';
    items: Array<{
      __typename: 'Task';
      entityId: string;
      taskNumber?: string | null;
      invoiceStatus?: InvoiceStatus | null;
      agreementUuid?: string | null;
      id: string;
      activity?: {
        __typename: 'ModelActivityConnection';
        items: Array<{
          __typename: 'Activity';
          id: string;
          compositeId: string;
          userId?: string | null;
          entityId?: string | null;
          type: ActivityType;
          message?: string | null;
          metadata?: {
            __typename: 'ActivityMetadata';
            name?: string | null;
          } | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      amount?: number | null;
      annotations?: string | null;
      entityIdFrom?: string | null;
      fromId: string;
      fromType: FromToType;
      toId?: string | null;
      toType?: FromToType | null;
      entityIdTo?: string | null;
      contactIdFrom?: string | null;
      contactIdTo?: string | null;
      contactId?: string | null;
      fromSearchStatus?: string | null;
      toSearchStatus?: string | null;
      entityByIdContactId?: string | null;
      searchName?: string | null;
      status: TaskStatus;
      signatureStatus?: TaskSignatureStatus | null;
      paymentStatus?: TaskPaymentStatus | null;
      type: TaskType;
      category?: TaskCategory | null;
      documents?: Array<{
        __typename: 'S3Upload';
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type: S3UploadType;
      } | null> | null;
      numberOfPayments?: number | null;
      paymentFrequency?: PaymentFrequency | null;
      paymentTypes: Array<PaymentType | null>;
      reference?: string | null;
      bpayReferenceNumber?: string | null;
      settlementStatus?: TaskSettlementStatus | null;
      signers?: Array<{
        __typename: 'EntityUser';
        id: string;
        entityId: string;
        userId: string;
        invitedEmail?: string | null;
        referredBy?: string | null;
        invitedEntityId?: string | null;
        firmEntityId?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        role?: EntityUserRole | null;
        paymentsEnabled?: boolean | null;
        entitySearchName?: string | null;
        entity?: {
          __typename: 'Entity';
          id: string;
          type: EntityType;
          taxNumber?: string | null;
          companyNumber?: string | null;
          billerCode?: number | null;
          name: string;
          legalName?: string | null;
          searchName?: string | null;
          address?: {
            __typename: 'Address';
            addressId?: string | null;
            placeId?: string | null;
            contactName?: string | null;
            contactNumber?: string | null;
            addressFull?: string | null;
            address1?: string | null;
            address2?: string | null;
            unitNumber?: string | null;
            streetNumber?: string | null;
            streetName?: string | null;
            streetType?: string | null;
            city: string;
            country: string;
            countryCode?: string | null;
            state: string;
            stateCode?: string | null;
            postalCode: string;
          } | null;
          logo?: {
            __typename: 'Image';
            alt?: string | null;
            identityId?: string | null;
            key: string;
            level: S3UploadLevel;
            type?: string | null;
          } | null;
          entityBeneficialOwners?: {
            __typename: 'ModelEntityBeneficialOwnerConnection';
            items?: Array<{
              __typename: 'EntityBeneficialOwner';
              entityId: string;
              beneficialOwnerId: string;
              beneficialOwner?: {
                __typename: 'BeneficialOwner';
                id: string;
                firstName?: string | null;
                lastName?: string | null;
                name?: string | null;
                providerEntityId: string;
                verificationStatus: VerificationStatus;
                verificationAttempt?: number | null;
                createdBy?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              owner?: string | null;
            } | null> | null;
            nextToken?: string | null;
          } | null;
          entityUsers?: {
            __typename: 'ModelEntityUserConnection';
            items: Array<{
              __typename: 'EntityUser';
              id: string;
              entityId: string;
              userId: string;
              invitedEmail?: string | null;
              referredBy?: string | null;
              invitedEntityId?: string | null;
              firmEntityId?: string | null;
              firstName?: string | null;
              lastName?: string | null;
              role?: EntityUserRole | null;
              paymentsEnabled?: boolean | null;
              entitySearchName?: string | null;
              entity?: {
                __typename: 'Entity';
                id: string;
                type: EntityType;
                taxNumber?: string | null;
                companyNumber?: string | null;
                billerCode?: number | null;
                name: string;
                legalName?: string | null;
                searchName?: string | null;
                gstRegistered?: boolean | null;
                providerEntityId?: string | null;
                providerCompanyId?: string | null;
                providerBillUserCompanyId?: string | null;
                providerBankAccountId?: string | null;
                providerDigitalWalletId?: string | null;
                providerBpayCrn?: string | null;
                paymentMethodId?: string | null;
                paymentUserId?: string | null;
                disbursementMethodId?: string | null;
                ubosCreated?: boolean | null;
                numUbosCreated?: number | null;
                subCategory?: string | null;
                clientsStatus?: EntityClientsStatus | null;
                ocrEmail?: string | null;
                verificationStatus?: VerificationStatus | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                owner: string;
                referredBy?: string | null;
                xeroContactSyncStatus?: XeroSyncStatus | null;
                xeroLastContactSyncAt?: string | null;
                xeroInvoiceSyncStatus?: XeroSyncStatus | null;
                xeroLastInvoiceSyncAt?: string | null;
                xeroTenantId?: string | null;
              } | null;
              searchName?: string | null;
              createdBy?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              status?: EntityUserStatus | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          gstRegistered?: boolean | null;
          providerEntityId?: string | null;
          providerCompanyId?: string | null;
          providerBillUserCompanyId?: string | null;
          providerBankAccountId?: string | null;
          providerDigitalWalletId?: string | null;
          providerBpayCrn?: string | null;
          contact?: {
            __typename: 'EntityContact';
            firstName?: string | null;
            lastName?: string | null;
            email?: string | null;
            phone?: string | null;
            role?: string | null;
          } | null;
          paymentMethods?: {
            __typename: 'ModelPaymentMethodConnection';
            items: Array<{
              __typename: 'PaymentMethod';
              id: string;
              paymentMethodType: PaymentMethodType;
              type?: string | null;
              fullName?: string | null;
              number?: string | null;
              expMonth?: string | null;
              expYear?: string | null;
              accountName?: string | null;
              bankName?: string | null;
              accountNumber?: string | null;
              routingNumber?: string | null;
              holderType?: BankHolderType | null;
              accountType?: BankAccountType | null;
              status?: PaymentMethodStatus | null;
              accountDirection?: AccountDirection | null;
              expiresAt?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          paymentMethodId?: string | null;
          paymentUserId?: string | null;
          disbursementMethodId?: string | null;
          receivingAccounts?: {
            __typename: 'ModelPaymentMethodConnection';
            items: Array<{
              __typename: 'PaymentMethod';
              id: string;
              paymentMethodType: PaymentMethodType;
              type?: string | null;
              fullName?: string | null;
              number?: string | null;
              expMonth?: string | null;
              expYear?: string | null;
              accountName?: string | null;
              bankName?: string | null;
              accountNumber?: string | null;
              routingNumber?: string | null;
              holderType?: BankHolderType | null;
              accountType?: BankAccountType | null;
              status?: PaymentMethodStatus | null;
              accountDirection?: AccountDirection | null;
              expiresAt?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          ubosCreated?: boolean | null;
          numUbosCreated?: number | null;
          subCategory?: string | null;
          clientsStatus?: EntityClientsStatus | null;
          ocrEmail?: string | null;
          verificationStatus?: VerificationStatus | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          owner: string;
          referredBy?: string | null;
          xeroContactSyncStatus?: XeroSyncStatus | null;
          xeroLastContactSyncAt?: string | null;
          xeroInvoiceSyncStatus?: XeroSyncStatus | null;
          xeroLastInvoiceSyncAt?: string | null;
          xeroTenantId?: string | null;
        } | null;
        searchName?: string | null;
        createdBy?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        status?: EntityUserStatus | null;
      } | null> | null;
      otherRecipients?: Array<{
        __typename: 'OtherRecipient';
        email: string;
        sendOnCompletion: boolean;
      } | null> | null;
      payments?: {
        __typename: 'ModelPaymentConnection';
        items: Array<{
          __typename: 'Payment';
          id: string;
          taskId?: string | null;
          entityId?: string | null;
          payInPaymentId?: string | null;
          providerTransactionId?: string | null;
          paymentProvider?: PaymentProvider | null;
          disbursementId?: string | null;
          fromId: string;
          fromType: FromToType;
          toId?: string | null;
          toType?: FromToType | null;
          buyerId?: string | null;
          sellerId?: string | null;
          entityIdTo?: string | null;
          amount?: number | null;
          netAmount?: number | null;
          payerFees?: number | null;
          totalAmount?: number | null;
          gstAmount?: number | null;
          installment?: number | null;
          installments?: number | null;
          feeAmount?: number | null;
          paymentType?: PaymentType | null;
          taxAmount?: number | null;
          currency?: string | null;
          feeIds?: Array<string | null> | null;
          ipAddress?: string | null;
          status: PaymentStatus;
          payerUserStatus?: PayerUserStatus | null;
          declinedReason?: string | null;
          scheduledAt?: string | null;
          paidAt?: string | null;
          declinedAt?: string | null;
          createdAt?: string | null;
          receivedAt?: string | null;
          paidOutAt?: string | null;
          updatedAt?: string | null;
          voidedAt?: string | null;
          owner?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      createdBy: string;
      entityIdBy?: string | null;
      dueAt: string;
      notes?: string | null;
      direction?: TaskDirection | null;
      readBy?: Array<string | null> | null;
      gstInclusive?: boolean | null;
      paymentAt?: string | null;
      lodgementAt?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      viewedAt?: string | null;
      readAt?: string | null;
      paidAt?: string | null;
      completedAt?: string | null;
      owner?: string | null;
      lineItems?: Array<{
        __typename: 'LineItem';
        description?: string | null;
        quantity?: number | null;
        unitAmount?: number | null;
        taxType?: string | null;
        lineAmount?: number | null;
      } | null> | null;
      xeroTenantId?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type TasksByEntityToQueryVariables = {
  entityId: string;
  status: TaskSearchStatus;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelTaskFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type TasksByEntityToQuery = {
  tasksByEntityTo?: {
    __typename: 'ModelTaskConnection';
    items: Array<{
      __typename: 'Task';
      entityId: string;
      taskNumber?: string | null;
      invoiceStatus?: InvoiceStatus | null;
      agreementUuid?: string | null;
      id: string;
      activity?: {
        __typename: 'ModelActivityConnection';
        items: Array<{
          __typename: 'Activity';
          id: string;
          compositeId: string;
          userId?: string | null;
          entityId?: string | null;
          type: ActivityType;
          message?: string | null;
          metadata?: {
            __typename: 'ActivityMetadata';
            name?: string | null;
          } | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      amount?: number | null;
      annotations?: string | null;
      entityIdFrom?: string | null;
      fromId: string;
      fromType: FromToType;
      toId?: string | null;
      toType?: FromToType | null;
      entityIdTo?: string | null;
      contactIdFrom?: string | null;
      contactIdTo?: string | null;
      contactId?: string | null;
      fromSearchStatus?: string | null;
      toSearchStatus?: string | null;
      entityByIdContactId?: string | null;
      searchName?: string | null;
      status: TaskStatus;
      signatureStatus?: TaskSignatureStatus | null;
      paymentStatus?: TaskPaymentStatus | null;
      type: TaskType;
      category?: TaskCategory | null;
      documents?: Array<{
        __typename: 'S3Upload';
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type: S3UploadType;
      } | null> | null;
      numberOfPayments?: number | null;
      paymentFrequency?: PaymentFrequency | null;
      paymentTypes: Array<PaymentType | null>;
      reference?: string | null;
      bpayReferenceNumber?: string | null;
      settlementStatus?: TaskSettlementStatus | null;
      signers?: Array<{
        __typename: 'EntityUser';
        id: string;
        entityId: string;
        userId: string;
        invitedEmail?: string | null;
        referredBy?: string | null;
        invitedEntityId?: string | null;
        firmEntityId?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        role?: EntityUserRole | null;
        paymentsEnabled?: boolean | null;
        entitySearchName?: string | null;
        entity?: {
          __typename: 'Entity';
          id: string;
          type: EntityType;
          taxNumber?: string | null;
          companyNumber?: string | null;
          billerCode?: number | null;
          name: string;
          legalName?: string | null;
          searchName?: string | null;
          address?: {
            __typename: 'Address';
            addressId?: string | null;
            placeId?: string | null;
            contactName?: string | null;
            contactNumber?: string | null;
            addressFull?: string | null;
            address1?: string | null;
            address2?: string | null;
            unitNumber?: string | null;
            streetNumber?: string | null;
            streetName?: string | null;
            streetType?: string | null;
            city: string;
            country: string;
            countryCode?: string | null;
            state: string;
            stateCode?: string | null;
            postalCode: string;
          } | null;
          logo?: {
            __typename: 'Image';
            alt?: string | null;
            identityId?: string | null;
            key: string;
            level: S3UploadLevel;
            type?: string | null;
          } | null;
          entityBeneficialOwners?: {
            __typename: 'ModelEntityBeneficialOwnerConnection';
            items?: Array<{
              __typename: 'EntityBeneficialOwner';
              entityId: string;
              beneficialOwnerId: string;
              beneficialOwner?: {
                __typename: 'BeneficialOwner';
                id: string;
                firstName?: string | null;
                lastName?: string | null;
                name?: string | null;
                providerEntityId: string;
                verificationStatus: VerificationStatus;
                verificationAttempt?: number | null;
                createdBy?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              owner?: string | null;
            } | null> | null;
            nextToken?: string | null;
          } | null;
          entityUsers?: {
            __typename: 'ModelEntityUserConnection';
            items: Array<{
              __typename: 'EntityUser';
              id: string;
              entityId: string;
              userId: string;
              invitedEmail?: string | null;
              referredBy?: string | null;
              invitedEntityId?: string | null;
              firmEntityId?: string | null;
              firstName?: string | null;
              lastName?: string | null;
              role?: EntityUserRole | null;
              paymentsEnabled?: boolean | null;
              entitySearchName?: string | null;
              entity?: {
                __typename: 'Entity';
                id: string;
                type: EntityType;
                taxNumber?: string | null;
                companyNumber?: string | null;
                billerCode?: number | null;
                name: string;
                legalName?: string | null;
                searchName?: string | null;
                gstRegistered?: boolean | null;
                providerEntityId?: string | null;
                providerCompanyId?: string | null;
                providerBillUserCompanyId?: string | null;
                providerBankAccountId?: string | null;
                providerDigitalWalletId?: string | null;
                providerBpayCrn?: string | null;
                paymentMethodId?: string | null;
                paymentUserId?: string | null;
                disbursementMethodId?: string | null;
                ubosCreated?: boolean | null;
                numUbosCreated?: number | null;
                subCategory?: string | null;
                clientsStatus?: EntityClientsStatus | null;
                ocrEmail?: string | null;
                verificationStatus?: VerificationStatus | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                owner: string;
                referredBy?: string | null;
                xeroContactSyncStatus?: XeroSyncStatus | null;
                xeroLastContactSyncAt?: string | null;
                xeroInvoiceSyncStatus?: XeroSyncStatus | null;
                xeroLastInvoiceSyncAt?: string | null;
                xeroTenantId?: string | null;
              } | null;
              searchName?: string | null;
              createdBy?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              status?: EntityUserStatus | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          gstRegistered?: boolean | null;
          providerEntityId?: string | null;
          providerCompanyId?: string | null;
          providerBillUserCompanyId?: string | null;
          providerBankAccountId?: string | null;
          providerDigitalWalletId?: string | null;
          providerBpayCrn?: string | null;
          contact?: {
            __typename: 'EntityContact';
            firstName?: string | null;
            lastName?: string | null;
            email?: string | null;
            phone?: string | null;
            role?: string | null;
          } | null;
          paymentMethods?: {
            __typename: 'ModelPaymentMethodConnection';
            items: Array<{
              __typename: 'PaymentMethod';
              id: string;
              paymentMethodType: PaymentMethodType;
              type?: string | null;
              fullName?: string | null;
              number?: string | null;
              expMonth?: string | null;
              expYear?: string | null;
              accountName?: string | null;
              bankName?: string | null;
              accountNumber?: string | null;
              routingNumber?: string | null;
              holderType?: BankHolderType | null;
              accountType?: BankAccountType | null;
              status?: PaymentMethodStatus | null;
              accountDirection?: AccountDirection | null;
              expiresAt?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          paymentMethodId?: string | null;
          paymentUserId?: string | null;
          disbursementMethodId?: string | null;
          receivingAccounts?: {
            __typename: 'ModelPaymentMethodConnection';
            items: Array<{
              __typename: 'PaymentMethod';
              id: string;
              paymentMethodType: PaymentMethodType;
              type?: string | null;
              fullName?: string | null;
              number?: string | null;
              expMonth?: string | null;
              expYear?: string | null;
              accountName?: string | null;
              bankName?: string | null;
              accountNumber?: string | null;
              routingNumber?: string | null;
              holderType?: BankHolderType | null;
              accountType?: BankAccountType | null;
              status?: PaymentMethodStatus | null;
              accountDirection?: AccountDirection | null;
              expiresAt?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          ubosCreated?: boolean | null;
          numUbosCreated?: number | null;
          subCategory?: string | null;
          clientsStatus?: EntityClientsStatus | null;
          ocrEmail?: string | null;
          verificationStatus?: VerificationStatus | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          owner: string;
          referredBy?: string | null;
          xeroContactSyncStatus?: XeroSyncStatus | null;
          xeroLastContactSyncAt?: string | null;
          xeroInvoiceSyncStatus?: XeroSyncStatus | null;
          xeroLastInvoiceSyncAt?: string | null;
          xeroTenantId?: string | null;
        } | null;
        searchName?: string | null;
        createdBy?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        status?: EntityUserStatus | null;
      } | null> | null;
      otherRecipients?: Array<{
        __typename: 'OtherRecipient';
        email: string;
        sendOnCompletion: boolean;
      } | null> | null;
      payments?: {
        __typename: 'ModelPaymentConnection';
        items: Array<{
          __typename: 'Payment';
          id: string;
          taskId?: string | null;
          entityId?: string | null;
          payInPaymentId?: string | null;
          providerTransactionId?: string | null;
          paymentProvider?: PaymentProvider | null;
          disbursementId?: string | null;
          fromId: string;
          fromType: FromToType;
          toId?: string | null;
          toType?: FromToType | null;
          buyerId?: string | null;
          sellerId?: string | null;
          entityIdTo?: string | null;
          amount?: number | null;
          netAmount?: number | null;
          payerFees?: number | null;
          totalAmount?: number | null;
          gstAmount?: number | null;
          installment?: number | null;
          installments?: number | null;
          feeAmount?: number | null;
          paymentType?: PaymentType | null;
          taxAmount?: number | null;
          currency?: string | null;
          feeIds?: Array<string | null> | null;
          ipAddress?: string | null;
          status: PaymentStatus;
          payerUserStatus?: PayerUserStatus | null;
          declinedReason?: string | null;
          scheduledAt?: string | null;
          paidAt?: string | null;
          declinedAt?: string | null;
          createdAt?: string | null;
          receivedAt?: string | null;
          paidOutAt?: string | null;
          updatedAt?: string | null;
          voidedAt?: string | null;
          owner?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      createdBy: string;
      entityIdBy?: string | null;
      dueAt: string;
      notes?: string | null;
      direction?: TaskDirection | null;
      readBy?: Array<string | null> | null;
      gstInclusive?: boolean | null;
      paymentAt?: string | null;
      lodgementAt?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      viewedAt?: string | null;
      readAt?: string | null;
      paidAt?: string | null;
      completedAt?: string | null;
      owner?: string | null;
      lineItems?: Array<{
        __typename: 'LineItem';
        description?: string | null;
        quantity?: number | null;
        unitAmount?: number | null;
        taxType?: string | null;
        lineAmount?: number | null;
      } | null> | null;
      xeroTenantId?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type TasksByEntityByIdContactIdQueryVariables = {
  entityIdBy: string;
  contactId: string;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelTaskFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type TasksByEntityByIdContactIdQuery = {
  tasksByEntityByIdContactId?: {
    __typename: 'ModelTaskConnection';
    items: Array<{
      __typename: 'Task';
      entityId: string;
      taskNumber?: string | null;
      invoiceStatus?: InvoiceStatus | null;
      agreementUuid?: string | null;
      id: string;
      activity?: {
        __typename: 'ModelActivityConnection';
        items: Array<{
          __typename: 'Activity';
          id: string;
          compositeId: string;
          userId?: string | null;
          entityId?: string | null;
          type: ActivityType;
          message?: string | null;
          metadata?: {
            __typename: 'ActivityMetadata';
            name?: string | null;
          } | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      amount?: number | null;
      annotations?: string | null;
      entityIdFrom?: string | null;
      fromId: string;
      fromType: FromToType;
      toId?: string | null;
      toType?: FromToType | null;
      entityIdTo?: string | null;
      contactIdFrom?: string | null;
      contactIdTo?: string | null;
      contactId?: string | null;
      fromSearchStatus?: string | null;
      toSearchStatus?: string | null;
      entityByIdContactId?: string | null;
      searchName?: string | null;
      status: TaskStatus;
      signatureStatus?: TaskSignatureStatus | null;
      paymentStatus?: TaskPaymentStatus | null;
      type: TaskType;
      category?: TaskCategory | null;
      documents?: Array<{
        __typename: 'S3Upload';
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type: S3UploadType;
      } | null> | null;
      numberOfPayments?: number | null;
      paymentFrequency?: PaymentFrequency | null;
      paymentTypes: Array<PaymentType | null>;
      reference?: string | null;
      bpayReferenceNumber?: string | null;
      settlementStatus?: TaskSettlementStatus | null;
      signers?: Array<{
        __typename: 'EntityUser';
        id: string;
        entityId: string;
        userId: string;
        invitedEmail?: string | null;
        referredBy?: string | null;
        invitedEntityId?: string | null;
        firmEntityId?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        role?: EntityUserRole | null;
        paymentsEnabled?: boolean | null;
        entitySearchName?: string | null;
        entity?: {
          __typename: 'Entity';
          id: string;
          type: EntityType;
          taxNumber?: string | null;
          companyNumber?: string | null;
          billerCode?: number | null;
          name: string;
          legalName?: string | null;
          searchName?: string | null;
          address?: {
            __typename: 'Address';
            addressId?: string | null;
            placeId?: string | null;
            contactName?: string | null;
            contactNumber?: string | null;
            addressFull?: string | null;
            address1?: string | null;
            address2?: string | null;
            unitNumber?: string | null;
            streetNumber?: string | null;
            streetName?: string | null;
            streetType?: string | null;
            city: string;
            country: string;
            countryCode?: string | null;
            state: string;
            stateCode?: string | null;
            postalCode: string;
          } | null;
          logo?: {
            __typename: 'Image';
            alt?: string | null;
            identityId?: string | null;
            key: string;
            level: S3UploadLevel;
            type?: string | null;
          } | null;
          entityBeneficialOwners?: {
            __typename: 'ModelEntityBeneficialOwnerConnection';
            items?: Array<{
              __typename: 'EntityBeneficialOwner';
              entityId: string;
              beneficialOwnerId: string;
              beneficialOwner?: {
                __typename: 'BeneficialOwner';
                id: string;
                firstName?: string | null;
                lastName?: string | null;
                name?: string | null;
                providerEntityId: string;
                verificationStatus: VerificationStatus;
                verificationAttempt?: number | null;
                createdBy?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              owner?: string | null;
            } | null> | null;
            nextToken?: string | null;
          } | null;
          entityUsers?: {
            __typename: 'ModelEntityUserConnection';
            items: Array<{
              __typename: 'EntityUser';
              id: string;
              entityId: string;
              userId: string;
              invitedEmail?: string | null;
              referredBy?: string | null;
              invitedEntityId?: string | null;
              firmEntityId?: string | null;
              firstName?: string | null;
              lastName?: string | null;
              role?: EntityUserRole | null;
              paymentsEnabled?: boolean | null;
              entitySearchName?: string | null;
              entity?: {
                __typename: 'Entity';
                id: string;
                type: EntityType;
                taxNumber?: string | null;
                companyNumber?: string | null;
                billerCode?: number | null;
                name: string;
                legalName?: string | null;
                searchName?: string | null;
                gstRegistered?: boolean | null;
                providerEntityId?: string | null;
                providerCompanyId?: string | null;
                providerBillUserCompanyId?: string | null;
                providerBankAccountId?: string | null;
                providerDigitalWalletId?: string | null;
                providerBpayCrn?: string | null;
                paymentMethodId?: string | null;
                paymentUserId?: string | null;
                disbursementMethodId?: string | null;
                ubosCreated?: boolean | null;
                numUbosCreated?: number | null;
                subCategory?: string | null;
                clientsStatus?: EntityClientsStatus | null;
                ocrEmail?: string | null;
                verificationStatus?: VerificationStatus | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                owner: string;
                referredBy?: string | null;
                xeroContactSyncStatus?: XeroSyncStatus | null;
                xeroLastContactSyncAt?: string | null;
                xeroInvoiceSyncStatus?: XeroSyncStatus | null;
                xeroLastInvoiceSyncAt?: string | null;
                xeroTenantId?: string | null;
              } | null;
              searchName?: string | null;
              createdBy?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              status?: EntityUserStatus | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          gstRegistered?: boolean | null;
          providerEntityId?: string | null;
          providerCompanyId?: string | null;
          providerBillUserCompanyId?: string | null;
          providerBankAccountId?: string | null;
          providerDigitalWalletId?: string | null;
          providerBpayCrn?: string | null;
          contact?: {
            __typename: 'EntityContact';
            firstName?: string | null;
            lastName?: string | null;
            email?: string | null;
            phone?: string | null;
            role?: string | null;
          } | null;
          paymentMethods?: {
            __typename: 'ModelPaymentMethodConnection';
            items: Array<{
              __typename: 'PaymentMethod';
              id: string;
              paymentMethodType: PaymentMethodType;
              type?: string | null;
              fullName?: string | null;
              number?: string | null;
              expMonth?: string | null;
              expYear?: string | null;
              accountName?: string | null;
              bankName?: string | null;
              accountNumber?: string | null;
              routingNumber?: string | null;
              holderType?: BankHolderType | null;
              accountType?: BankAccountType | null;
              status?: PaymentMethodStatus | null;
              accountDirection?: AccountDirection | null;
              expiresAt?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          paymentMethodId?: string | null;
          paymentUserId?: string | null;
          disbursementMethodId?: string | null;
          receivingAccounts?: {
            __typename: 'ModelPaymentMethodConnection';
            items: Array<{
              __typename: 'PaymentMethod';
              id: string;
              paymentMethodType: PaymentMethodType;
              type?: string | null;
              fullName?: string | null;
              number?: string | null;
              expMonth?: string | null;
              expYear?: string | null;
              accountName?: string | null;
              bankName?: string | null;
              accountNumber?: string | null;
              routingNumber?: string | null;
              holderType?: BankHolderType | null;
              accountType?: BankAccountType | null;
              status?: PaymentMethodStatus | null;
              accountDirection?: AccountDirection | null;
              expiresAt?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          ubosCreated?: boolean | null;
          numUbosCreated?: number | null;
          subCategory?: string | null;
          clientsStatus?: EntityClientsStatus | null;
          ocrEmail?: string | null;
          verificationStatus?: VerificationStatus | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          owner: string;
          referredBy?: string | null;
          xeroContactSyncStatus?: XeroSyncStatus | null;
          xeroLastContactSyncAt?: string | null;
          xeroInvoiceSyncStatus?: XeroSyncStatus | null;
          xeroLastInvoiceSyncAt?: string | null;
          xeroTenantId?: string | null;
        } | null;
        searchName?: string | null;
        createdBy?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        status?: EntityUserStatus | null;
      } | null> | null;
      otherRecipients?: Array<{
        __typename: 'OtherRecipient';
        email: string;
        sendOnCompletion: boolean;
      } | null> | null;
      payments?: {
        __typename: 'ModelPaymentConnection';
        items: Array<{
          __typename: 'Payment';
          id: string;
          taskId?: string | null;
          entityId?: string | null;
          payInPaymentId?: string | null;
          providerTransactionId?: string | null;
          paymentProvider?: PaymentProvider | null;
          disbursementId?: string | null;
          fromId: string;
          fromType: FromToType;
          toId?: string | null;
          toType?: FromToType | null;
          buyerId?: string | null;
          sellerId?: string | null;
          entityIdTo?: string | null;
          amount?: number | null;
          netAmount?: number | null;
          payerFees?: number | null;
          totalAmount?: number | null;
          gstAmount?: number | null;
          installment?: number | null;
          installments?: number | null;
          feeAmount?: number | null;
          paymentType?: PaymentType | null;
          taxAmount?: number | null;
          currency?: string | null;
          feeIds?: Array<string | null> | null;
          ipAddress?: string | null;
          status: PaymentStatus;
          payerUserStatus?: PayerUserStatus | null;
          declinedReason?: string | null;
          scheduledAt?: string | null;
          paidAt?: string | null;
          declinedAt?: string | null;
          createdAt?: string | null;
          receivedAt?: string | null;
          paidOutAt?: string | null;
          updatedAt?: string | null;
          voidedAt?: string | null;
          owner?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      createdBy: string;
      entityIdBy?: string | null;
      dueAt: string;
      notes?: string | null;
      direction?: TaskDirection | null;
      readBy?: Array<string | null> | null;
      gstInclusive?: boolean | null;
      paymentAt?: string | null;
      lodgementAt?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      viewedAt?: string | null;
      readAt?: string | null;
      paidAt?: string | null;
      completedAt?: string | null;
      owner?: string | null;
      lineItems?: Array<{
        __typename: 'LineItem';
        description?: string | null;
        quantity?: number | null;
        unitAmount?: number | null;
        taxType?: string | null;
        lineAmount?: number | null;
      } | null> | null;
      xeroTenantId?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type TasksByEntityByQueryVariables = {
  entityIdBy: string;
  status: TaskSearchStatus;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelTaskFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type TasksByEntityByQuery = {
  tasksByEntityBy?: {
    __typename: 'ModelTaskConnection';
    items: Array<{
      __typename: 'Task';
      entityId: string;
      taskNumber?: string | null;
      invoiceStatus?: InvoiceStatus | null;
      agreementUuid?: string | null;
      id: string;
      activity?: {
        __typename: 'ModelActivityConnection';
        items: Array<{
          __typename: 'Activity';
          id: string;
          compositeId: string;
          userId?: string | null;
          entityId?: string | null;
          type: ActivityType;
          message?: string | null;
          metadata?: {
            __typename: 'ActivityMetadata';
            name?: string | null;
          } | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      amount?: number | null;
      annotations?: string | null;
      entityIdFrom?: string | null;
      fromId: string;
      fromType: FromToType;
      toId?: string | null;
      toType?: FromToType | null;
      entityIdTo?: string | null;
      contactIdFrom?: string | null;
      contactIdTo?: string | null;
      contactId?: string | null;
      fromSearchStatus?: string | null;
      toSearchStatus?: string | null;
      entityByIdContactId?: string | null;
      searchName?: string | null;
      status: TaskStatus;
      signatureStatus?: TaskSignatureStatus | null;
      paymentStatus?: TaskPaymentStatus | null;
      type: TaskType;
      category?: TaskCategory | null;
      documents?: Array<{
        __typename: 'S3Upload';
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type: S3UploadType;
      } | null> | null;
      numberOfPayments?: number | null;
      paymentFrequency?: PaymentFrequency | null;
      paymentTypes: Array<PaymentType | null>;
      reference?: string | null;
      bpayReferenceNumber?: string | null;
      settlementStatus?: TaskSettlementStatus | null;
      signers?: Array<{
        __typename: 'EntityUser';
        id: string;
        entityId: string;
        userId: string;
        invitedEmail?: string | null;
        referredBy?: string | null;
        invitedEntityId?: string | null;
        firmEntityId?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        role?: EntityUserRole | null;
        paymentsEnabled?: boolean | null;
        entitySearchName?: string | null;
        entity?: {
          __typename: 'Entity';
          id: string;
          type: EntityType;
          taxNumber?: string | null;
          companyNumber?: string | null;
          billerCode?: number | null;
          name: string;
          legalName?: string | null;
          searchName?: string | null;
          address?: {
            __typename: 'Address';
            addressId?: string | null;
            placeId?: string | null;
            contactName?: string | null;
            contactNumber?: string | null;
            addressFull?: string | null;
            address1?: string | null;
            address2?: string | null;
            unitNumber?: string | null;
            streetNumber?: string | null;
            streetName?: string | null;
            streetType?: string | null;
            city: string;
            country: string;
            countryCode?: string | null;
            state: string;
            stateCode?: string | null;
            postalCode: string;
          } | null;
          logo?: {
            __typename: 'Image';
            alt?: string | null;
            identityId?: string | null;
            key: string;
            level: S3UploadLevel;
            type?: string | null;
          } | null;
          entityBeneficialOwners?: {
            __typename: 'ModelEntityBeneficialOwnerConnection';
            items?: Array<{
              __typename: 'EntityBeneficialOwner';
              entityId: string;
              beneficialOwnerId: string;
              beneficialOwner?: {
                __typename: 'BeneficialOwner';
                id: string;
                firstName?: string | null;
                lastName?: string | null;
                name?: string | null;
                providerEntityId: string;
                verificationStatus: VerificationStatus;
                verificationAttempt?: number | null;
                createdBy?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              owner?: string | null;
            } | null> | null;
            nextToken?: string | null;
          } | null;
          entityUsers?: {
            __typename: 'ModelEntityUserConnection';
            items: Array<{
              __typename: 'EntityUser';
              id: string;
              entityId: string;
              userId: string;
              invitedEmail?: string | null;
              referredBy?: string | null;
              invitedEntityId?: string | null;
              firmEntityId?: string | null;
              firstName?: string | null;
              lastName?: string | null;
              role?: EntityUserRole | null;
              paymentsEnabled?: boolean | null;
              entitySearchName?: string | null;
              entity?: {
                __typename: 'Entity';
                id: string;
                type: EntityType;
                taxNumber?: string | null;
                companyNumber?: string | null;
                billerCode?: number | null;
                name: string;
                legalName?: string | null;
                searchName?: string | null;
                gstRegistered?: boolean | null;
                providerEntityId?: string | null;
                providerCompanyId?: string | null;
                providerBillUserCompanyId?: string | null;
                providerBankAccountId?: string | null;
                providerDigitalWalletId?: string | null;
                providerBpayCrn?: string | null;
                paymentMethodId?: string | null;
                paymentUserId?: string | null;
                disbursementMethodId?: string | null;
                ubosCreated?: boolean | null;
                numUbosCreated?: number | null;
                subCategory?: string | null;
                clientsStatus?: EntityClientsStatus | null;
                ocrEmail?: string | null;
                verificationStatus?: VerificationStatus | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                owner: string;
                referredBy?: string | null;
                xeroContactSyncStatus?: XeroSyncStatus | null;
                xeroLastContactSyncAt?: string | null;
                xeroInvoiceSyncStatus?: XeroSyncStatus | null;
                xeroLastInvoiceSyncAt?: string | null;
                xeroTenantId?: string | null;
              } | null;
              searchName?: string | null;
              createdBy?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              status?: EntityUserStatus | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          gstRegistered?: boolean | null;
          providerEntityId?: string | null;
          providerCompanyId?: string | null;
          providerBillUserCompanyId?: string | null;
          providerBankAccountId?: string | null;
          providerDigitalWalletId?: string | null;
          providerBpayCrn?: string | null;
          contact?: {
            __typename: 'EntityContact';
            firstName?: string | null;
            lastName?: string | null;
            email?: string | null;
            phone?: string | null;
            role?: string | null;
          } | null;
          paymentMethods?: {
            __typename: 'ModelPaymentMethodConnection';
            items: Array<{
              __typename: 'PaymentMethod';
              id: string;
              paymentMethodType: PaymentMethodType;
              type?: string | null;
              fullName?: string | null;
              number?: string | null;
              expMonth?: string | null;
              expYear?: string | null;
              accountName?: string | null;
              bankName?: string | null;
              accountNumber?: string | null;
              routingNumber?: string | null;
              holderType?: BankHolderType | null;
              accountType?: BankAccountType | null;
              status?: PaymentMethodStatus | null;
              accountDirection?: AccountDirection | null;
              expiresAt?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          paymentMethodId?: string | null;
          paymentUserId?: string | null;
          disbursementMethodId?: string | null;
          receivingAccounts?: {
            __typename: 'ModelPaymentMethodConnection';
            items: Array<{
              __typename: 'PaymentMethod';
              id: string;
              paymentMethodType: PaymentMethodType;
              type?: string | null;
              fullName?: string | null;
              number?: string | null;
              expMonth?: string | null;
              expYear?: string | null;
              accountName?: string | null;
              bankName?: string | null;
              accountNumber?: string | null;
              routingNumber?: string | null;
              holderType?: BankHolderType | null;
              accountType?: BankAccountType | null;
              status?: PaymentMethodStatus | null;
              accountDirection?: AccountDirection | null;
              expiresAt?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          ubosCreated?: boolean | null;
          numUbosCreated?: number | null;
          subCategory?: string | null;
          clientsStatus?: EntityClientsStatus | null;
          ocrEmail?: string | null;
          verificationStatus?: VerificationStatus | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          owner: string;
          referredBy?: string | null;
          xeroContactSyncStatus?: XeroSyncStatus | null;
          xeroLastContactSyncAt?: string | null;
          xeroInvoiceSyncStatus?: XeroSyncStatus | null;
          xeroLastInvoiceSyncAt?: string | null;
          xeroTenantId?: string | null;
        } | null;
        searchName?: string | null;
        createdBy?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        status?: EntityUserStatus | null;
      } | null> | null;
      otherRecipients?: Array<{
        __typename: 'OtherRecipient';
        email: string;
        sendOnCompletion: boolean;
      } | null> | null;
      payments?: {
        __typename: 'ModelPaymentConnection';
        items: Array<{
          __typename: 'Payment';
          id: string;
          taskId?: string | null;
          entityId?: string | null;
          payInPaymentId?: string | null;
          providerTransactionId?: string | null;
          paymentProvider?: PaymentProvider | null;
          disbursementId?: string | null;
          fromId: string;
          fromType: FromToType;
          toId?: string | null;
          toType?: FromToType | null;
          buyerId?: string | null;
          sellerId?: string | null;
          entityIdTo?: string | null;
          amount?: number | null;
          netAmount?: number | null;
          payerFees?: number | null;
          totalAmount?: number | null;
          gstAmount?: number | null;
          installment?: number | null;
          installments?: number | null;
          feeAmount?: number | null;
          paymentType?: PaymentType | null;
          taxAmount?: number | null;
          currency?: string | null;
          feeIds?: Array<string | null> | null;
          ipAddress?: string | null;
          status: PaymentStatus;
          payerUserStatus?: PayerUserStatus | null;
          declinedReason?: string | null;
          scheduledAt?: string | null;
          paidAt?: string | null;
          declinedAt?: string | null;
          createdAt?: string | null;
          receivedAt?: string | null;
          paidOutAt?: string | null;
          updatedAt?: string | null;
          voidedAt?: string | null;
          owner?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      createdBy: string;
      entityIdBy?: string | null;
      dueAt: string;
      notes?: string | null;
      direction?: TaskDirection | null;
      readBy?: Array<string | null> | null;
      gstInclusive?: boolean | null;
      paymentAt?: string | null;
      lodgementAt?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      viewedAt?: string | null;
      readAt?: string | null;
      paidAt?: string | null;
      completedAt?: string | null;
      owner?: string | null;
      lineItems?: Array<{
        __typename: 'LineItem';
        description?: string | null;
        quantity?: number | null;
        unitAmount?: number | null;
        taxType?: string | null;
        lineAmount?: number | null;
      } | null> | null;
      xeroTenantId?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type GetTaskNumberQueryVariables = {
  entityId: string;
};

export type GetTaskNumberQuery = {
  getTaskNumber: {
    __typename: 'TaskNumber';
    id?: string | null;
    invoice?: number | null;
    quote?: number | null;
  };
};

export type SearchTasksQueryVariables = {
  searchName: string;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelTaskFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type SearchTasksQuery = {
  searchTasks?: {
    __typename: 'ModelTaskConnection';
    items: Array<{
      __typename: 'Task';
      entityId: string;
      taskNumber?: string | null;
      invoiceStatus?: InvoiceStatus | null;
      agreementUuid?: string | null;
      id: string;
      activity?: {
        __typename: 'ModelActivityConnection';
        items: Array<{
          __typename: 'Activity';
          id: string;
          compositeId: string;
          userId?: string | null;
          entityId?: string | null;
          type: ActivityType;
          message?: string | null;
          metadata?: {
            __typename: 'ActivityMetadata';
            name?: string | null;
          } | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      amount?: number | null;
      annotations?: string | null;
      entityIdFrom?: string | null;
      fromId: string;
      fromType: FromToType;
      toId?: string | null;
      toType?: FromToType | null;
      entityIdTo?: string | null;
      contactIdFrom?: string | null;
      contactIdTo?: string | null;
      contactId?: string | null;
      fromSearchStatus?: string | null;
      toSearchStatus?: string | null;
      entityByIdContactId?: string | null;
      searchName?: string | null;
      status: TaskStatus;
      signatureStatus?: TaskSignatureStatus | null;
      paymentStatus?: TaskPaymentStatus | null;
      type: TaskType;
      category?: TaskCategory | null;
      documents?: Array<{
        __typename: 'S3Upload';
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type: S3UploadType;
      } | null> | null;
      numberOfPayments?: number | null;
      paymentFrequency?: PaymentFrequency | null;
      paymentTypes: Array<PaymentType | null>;
      reference?: string | null;
      bpayReferenceNumber?: string | null;
      settlementStatus?: TaskSettlementStatus | null;
      signers?: Array<{
        __typename: 'EntityUser';
        id: string;
        entityId: string;
        userId: string;
        invitedEmail?: string | null;
        referredBy?: string | null;
        invitedEntityId?: string | null;
        firmEntityId?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        role?: EntityUserRole | null;
        paymentsEnabled?: boolean | null;
        entitySearchName?: string | null;
        entity?: {
          __typename: 'Entity';
          id: string;
          type: EntityType;
          taxNumber?: string | null;
          companyNumber?: string | null;
          billerCode?: number | null;
          name: string;
          legalName?: string | null;
          searchName?: string | null;
          address?: {
            __typename: 'Address';
            addressId?: string | null;
            placeId?: string | null;
            contactName?: string | null;
            contactNumber?: string | null;
            addressFull?: string | null;
            address1?: string | null;
            address2?: string | null;
            unitNumber?: string | null;
            streetNumber?: string | null;
            streetName?: string | null;
            streetType?: string | null;
            city: string;
            country: string;
            countryCode?: string | null;
            state: string;
            stateCode?: string | null;
            postalCode: string;
          } | null;
          logo?: {
            __typename: 'Image';
            alt?: string | null;
            identityId?: string | null;
            key: string;
            level: S3UploadLevel;
            type?: string | null;
          } | null;
          entityBeneficialOwners?: {
            __typename: 'ModelEntityBeneficialOwnerConnection';
            items?: Array<{
              __typename: 'EntityBeneficialOwner';
              entityId: string;
              beneficialOwnerId: string;
              beneficialOwner?: {
                __typename: 'BeneficialOwner';
                id: string;
                firstName?: string | null;
                lastName?: string | null;
                name?: string | null;
                providerEntityId: string;
                verificationStatus: VerificationStatus;
                verificationAttempt?: number | null;
                createdBy?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              owner?: string | null;
            } | null> | null;
            nextToken?: string | null;
          } | null;
          entityUsers?: {
            __typename: 'ModelEntityUserConnection';
            items: Array<{
              __typename: 'EntityUser';
              id: string;
              entityId: string;
              userId: string;
              invitedEmail?: string | null;
              referredBy?: string | null;
              invitedEntityId?: string | null;
              firmEntityId?: string | null;
              firstName?: string | null;
              lastName?: string | null;
              role?: EntityUserRole | null;
              paymentsEnabled?: boolean | null;
              entitySearchName?: string | null;
              entity?: {
                __typename: 'Entity';
                id: string;
                type: EntityType;
                taxNumber?: string | null;
                companyNumber?: string | null;
                billerCode?: number | null;
                name: string;
                legalName?: string | null;
                searchName?: string | null;
                gstRegistered?: boolean | null;
                providerEntityId?: string | null;
                providerCompanyId?: string | null;
                providerBillUserCompanyId?: string | null;
                providerBankAccountId?: string | null;
                providerDigitalWalletId?: string | null;
                providerBpayCrn?: string | null;
                paymentMethodId?: string | null;
                paymentUserId?: string | null;
                disbursementMethodId?: string | null;
                ubosCreated?: boolean | null;
                numUbosCreated?: number | null;
                subCategory?: string | null;
                clientsStatus?: EntityClientsStatus | null;
                ocrEmail?: string | null;
                verificationStatus?: VerificationStatus | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                owner: string;
                referredBy?: string | null;
                xeroContactSyncStatus?: XeroSyncStatus | null;
                xeroLastContactSyncAt?: string | null;
                xeroInvoiceSyncStatus?: XeroSyncStatus | null;
                xeroLastInvoiceSyncAt?: string | null;
                xeroTenantId?: string | null;
              } | null;
              searchName?: string | null;
              createdBy?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              status?: EntityUserStatus | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          gstRegistered?: boolean | null;
          providerEntityId?: string | null;
          providerCompanyId?: string | null;
          providerBillUserCompanyId?: string | null;
          providerBankAccountId?: string | null;
          providerDigitalWalletId?: string | null;
          providerBpayCrn?: string | null;
          contact?: {
            __typename: 'EntityContact';
            firstName?: string | null;
            lastName?: string | null;
            email?: string | null;
            phone?: string | null;
            role?: string | null;
          } | null;
          paymentMethods?: {
            __typename: 'ModelPaymentMethodConnection';
            items: Array<{
              __typename: 'PaymentMethod';
              id: string;
              paymentMethodType: PaymentMethodType;
              type?: string | null;
              fullName?: string | null;
              number?: string | null;
              expMonth?: string | null;
              expYear?: string | null;
              accountName?: string | null;
              bankName?: string | null;
              accountNumber?: string | null;
              routingNumber?: string | null;
              holderType?: BankHolderType | null;
              accountType?: BankAccountType | null;
              status?: PaymentMethodStatus | null;
              accountDirection?: AccountDirection | null;
              expiresAt?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          paymentMethodId?: string | null;
          paymentUserId?: string | null;
          disbursementMethodId?: string | null;
          receivingAccounts?: {
            __typename: 'ModelPaymentMethodConnection';
            items: Array<{
              __typename: 'PaymentMethod';
              id: string;
              paymentMethodType: PaymentMethodType;
              type?: string | null;
              fullName?: string | null;
              number?: string | null;
              expMonth?: string | null;
              expYear?: string | null;
              accountName?: string | null;
              bankName?: string | null;
              accountNumber?: string | null;
              routingNumber?: string | null;
              holderType?: BankHolderType | null;
              accountType?: BankAccountType | null;
              status?: PaymentMethodStatus | null;
              accountDirection?: AccountDirection | null;
              expiresAt?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          ubosCreated?: boolean | null;
          numUbosCreated?: number | null;
          subCategory?: string | null;
          clientsStatus?: EntityClientsStatus | null;
          ocrEmail?: string | null;
          verificationStatus?: VerificationStatus | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          owner: string;
          referredBy?: string | null;
          xeroContactSyncStatus?: XeroSyncStatus | null;
          xeroLastContactSyncAt?: string | null;
          xeroInvoiceSyncStatus?: XeroSyncStatus | null;
          xeroLastInvoiceSyncAt?: string | null;
          xeroTenantId?: string | null;
        } | null;
        searchName?: string | null;
        createdBy?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        status?: EntityUserStatus | null;
      } | null> | null;
      otherRecipients?: Array<{
        __typename: 'OtherRecipient';
        email: string;
        sendOnCompletion: boolean;
      } | null> | null;
      payments?: {
        __typename: 'ModelPaymentConnection';
        items: Array<{
          __typename: 'Payment';
          id: string;
          taskId?: string | null;
          entityId?: string | null;
          payInPaymentId?: string | null;
          providerTransactionId?: string | null;
          paymentProvider?: PaymentProvider | null;
          disbursementId?: string | null;
          fromId: string;
          fromType: FromToType;
          toId?: string | null;
          toType?: FromToType | null;
          buyerId?: string | null;
          sellerId?: string | null;
          entityIdTo?: string | null;
          amount?: number | null;
          netAmount?: number | null;
          payerFees?: number | null;
          totalAmount?: number | null;
          gstAmount?: number | null;
          installment?: number | null;
          installments?: number | null;
          feeAmount?: number | null;
          paymentType?: PaymentType | null;
          taxAmount?: number | null;
          currency?: string | null;
          feeIds?: Array<string | null> | null;
          ipAddress?: string | null;
          status: PaymentStatus;
          payerUserStatus?: PayerUserStatus | null;
          declinedReason?: string | null;
          scheduledAt?: string | null;
          paidAt?: string | null;
          declinedAt?: string | null;
          createdAt?: string | null;
          receivedAt?: string | null;
          paidOutAt?: string | null;
          updatedAt?: string | null;
          voidedAt?: string | null;
          owner?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      createdBy: string;
      entityIdBy?: string | null;
      dueAt: string;
      notes?: string | null;
      direction?: TaskDirection | null;
      readBy?: Array<string | null> | null;
      gstInclusive?: boolean | null;
      paymentAt?: string | null;
      lodgementAt?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      viewedAt?: string | null;
      readAt?: string | null;
      paidAt?: string | null;
      completedAt?: string | null;
      owner?: string | null;
      lineItems?: Array<{
        __typename: 'LineItem';
        description?: string | null;
        quantity?: number | null;
        unitAmount?: number | null;
        taxType?: string | null;
        lineAmount?: number | null;
      } | null> | null;
      xeroTenantId?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type GetTransactionQueryVariables = {
  id: string;
};

export type GetTransactionQuery = {
  getTransaction?: {
    __typename: 'Transaction';
    id: string;
    amount?: number | null;
    currency?: string | null;
    description?: string | null;
    status?: string | null;
    type?: string | null;
    typeMethod?: string | null;
    buyerId?: string | null;
    taskId?: string | null;
    entityId?: string | null;
    referredBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null;
};

export type ListTransactionsQueryVariables = {
  filter?: ModelTransactionFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListTransactionsQuery = {
  listTransactions?: {
    __typename: 'ModelTransactionConnection';
    items: Array<{
      __typename: 'Transaction';
      id: string;
      amount?: number | null;
      currency?: string | null;
      description?: string | null;
      status?: string | null;
      type?: string | null;
      typeMethod?: string | null;
      buyerId?: string | null;
      taskId?: string | null;
      entityId?: string | null;
      referredBy?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type TransactionsByUserIdAndCreatedAtQueryVariables = {
  userId: string;
  createdAt?: ModelStringKeyConditionInput | null;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelTransactionFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type TransactionsByUserIdAndCreatedAtQuery = {
  transactionsByUserIdAndCreatedAt?: {
    __typename: 'ModelTransactionConnection';
    items: Array<{
      __typename: 'Transaction';
      id: string;
      amount?: number | null;
      currency?: string | null;
      description?: string | null;
      status?: string | null;
      type?: string | null;
      typeMethod?: string | null;
      buyerId?: string | null;
      taskId?: string | null;
      entityId?: string | null;
      referredBy?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type TransactionsByPurchaseTokenAndCreatedAtQueryVariables = {
  purchaseToken: string;
  createdAt?: ModelStringKeyConditionInput | null;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelTransactionFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type TransactionsByPurchaseTokenAndCreatedAtQuery = {
  transactionsByPurchaseTokenAndCreatedAt?: {
    __typename: 'ModelTransactionConnection';
    items: Array<{
      __typename: 'Transaction';
      id: string;
      amount?: number | null;
      currency?: string | null;
      description?: string | null;
      status?: string | null;
      type?: string | null;
      typeMethod?: string | null;
      buyerId?: string | null;
      taskId?: string | null;
      entityId?: string | null;
      referredBy?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type GetTemplateQueryVariables = {
  id: string;
};

export type GetTemplateQuery = {
  getTemplate?: {
    __typename: 'Template';
    id: string;
    entityId: string;
    title: string;
    templateServices?: {
      __typename: 'ModelTemplateServiceConnection';
      items?: Array<{
        __typename: 'TemplateService';
        templateId: string;
        serviceId: string;
        service?: {
          __typename: 'Service';
          id: string;
          entityId: string;
          title?: string | null;
          description?: string | null;
          amount: number;
          feeType: FeeType;
          taxType: TaxType;
          searchName?: string | null;
          status: ServiceStatus;
          createdAt: string;
          updatedAt: string;
        } | null;
        createdAt: string;
        updatedAt: string;
      } | null> | null;
      nextToken?: string | null;
    } | null;
    components?: Array<{
      __typename: 'TemplateComponent';
      type: ComponentType;
      data?: string | null;
    } | null> | null;
    searchName?: string | null;
    status: TemplateStatus;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type TemplatesByEntityQueryVariables = {
  entityId: string;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelTemplateFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type TemplatesByEntityQuery = {
  templatesByEntity?: {
    __typename: 'ModelTemplateConnection';
    items?: Array<{
      __typename: 'Template';
      id: string;
      entityId: string;
      title: string;
      templateServices?: {
        __typename: 'ModelTemplateServiceConnection';
        items?: Array<{
          __typename: 'TemplateService';
          templateId: string;
          serviceId: string;
          service?: {
            __typename: 'Service';
            id: string;
            entityId: string;
            title?: string | null;
            description?: string | null;
            amount: number;
            feeType: FeeType;
            taxType: TaxType;
            searchName?: string | null;
            status: ServiceStatus;
            createdAt: string;
            updatedAt: string;
          } | null;
          createdAt: string;
          updatedAt: string;
        } | null> | null;
        nextToken?: string | null;
      } | null;
      components?: Array<{
        __typename: 'TemplateComponent';
        type: ComponentType;
        data?: string | null;
      } | null> | null;
      searchName?: string | null;
      status: TemplateStatus;
      createdAt: string;
      updatedAt: string;
    } | null> | null;
    nextToken?: string | null;
  } | null;
};

export type GetTranslationQueryVariables = {
  language?: string | null;
  namespace?: string | null;
};

export type GetTranslationQuery = {
  getTranslation?: {
    __typename: 'Translation';
    language: string;
    namespace: string;
    data?: string | null;
  } | null;
};

export type ListTranslationsQuery = {
  listTranslations?: Array<{
    __typename: 'TranslationConnection';
    language?: string | null;
    items?: Array<{
      __typename: 'Translation';
      language: string;
      namespace: string;
      data?: string | null;
    } | null> | null;
  } | null> | null;
};

export type GetUserConversationQueryVariables = {
  id: string;
};

export type GetUserConversationQuery = {
  getUserConversation?: {
    __typename: 'UserConversation';
    conversationId: string;
    conversation?: {
      __typename: 'Conversation';
      title?: string | null;
      image?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      country?: string | null;
      messages?: {
        __typename: 'ModelMessageConnection';
        items: Array<{
          __typename: 'Message';
          conversationId: string;
          text?: string | null;
          attachments?: Array<{
            __typename: 'S3Upload';
            identityId?: string | null;
            key: string;
            level: S3UploadLevel;
            type: S3UploadType;
          } | null> | null;
          users: Array<string | null>;
          receiver: string;
          sender: string;
          createdBy: string;
          readBy?: Array<string | null> | null;
          createdAt: string;
          updatedAt?: string | null;
          id: string;
          conversationMessagesId?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      userConversations?: {
        __typename: 'ModelUserConversationConnection';
        items: Array<{
          __typename: 'UserConversation';
          conversationId: string;
          conversation?: {
            __typename: 'Conversation';
            title?: string | null;
            image?: {
              __typename: 'Image';
              alt?: string | null;
              identityId?: string | null;
              key: string;
              level: S3UploadLevel;
              type?: string | null;
            } | null;
            country?: string | null;
            messages?: {
              __typename: 'ModelMessageConnection';
              items: Array<{
                __typename: 'Message';
                conversationId: string;
                text?: string | null;
                users: Array<string | null>;
                receiver: string;
                sender: string;
                createdBy: string;
                readBy?: Array<string | null> | null;
                createdAt: string;
                updatedAt?: string | null;
                id: string;
                conversationMessagesId?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            userConversations?: {
              __typename: 'ModelUserConversationConnection';
              items: Array<{
                __typename: 'UserConversation';
                conversationId: string;
                userId: string;
                users?: Array<string | null> | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                id: string;
                conversationUserConversationsId?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            users?: Array<string | null> | null;
            readBy?: Array<string | null> | null;
            createdBy?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            id: string;
          } | null;
          userId: string;
          user?: {
            __typename: 'User';
            id: string;
            identityId?: string | null;
            referralCode?: string | null;
            referredBy?: string | null;
            email?: string | null;
            about?: string | null;
            firstName?: string | null;
            firmId?: string | null;
            lastName?: string | null;
            phone?: string | null;
            blocked?: Array<string | null> | null;
            blockedBy?: Array<string | null> | null;
            country?: string | null;
            profileImg?: {
              __typename: 'Image';
              alt?: string | null;
              identityId?: string | null;
              key: string;
              level: S3UploadLevel;
              type?: string | null;
            } | null;
            interests?: Array<string | null> | null;
            locale?: string | null;
            onboardingStatus?: OnboardingStatus | null;
            onboardingEntity?: string | null;
            selectedSignatureKey?: string | null;
            signatures?: {
              __typename: 'ModelSignatureConnection';
              items: Array<{
                __typename: 'Signature';
                id: string;
                userId: string;
                key: string;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            userType?: UserType | null;
            rating?: number | null;
            reportReasons?: Array<string | null> | null;
            notificationPreferences?: {
              __typename: 'NotificationPreferences';
              email?: boolean | null;
              push?: boolean | null;
              sms?: boolean | null;
            } | null;
            paymentUserId?: string | null;
            providerWalletId?: string | null;
            providerNppCrn?: string | null;
            ipAddress?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            owner?: string | null;
            loyaltyStatus?: RewardStatus | null;
            nextLoyaltyStatus?: RewardStatus | null;
            nextLoyaltyStatusPoint?: number | null;
            statusPoint?: number | null;
            pointsTotal?: number | null;
            pointsBalance?: number | null;
            invitedTo?: string | null;
          } | null;
          users?: Array<string | null> | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          id: string;
          conversationUserConversationsId?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      users?: Array<string | null> | null;
      readBy?: Array<string | null> | null;
      createdBy?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
    } | null;
    userId: string;
    user?: {
      __typename: 'User';
      id: string;
      identityId?: string | null;
      referralCode?: string | null;
      referredBy?: string | null;
      email?: string | null;
      about?: string | null;
      firstName?: string | null;
      firmId?: string | null;
      lastName?: string | null;
      phone?: string | null;
      blocked?: Array<string | null> | null;
      blockedBy?: Array<string | null> | null;
      country?: string | null;
      profileImg?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      interests?: Array<string | null> | null;
      locale?: string | null;
      onboardingStatus?: OnboardingStatus | null;
      onboardingEntity?: string | null;
      selectedSignatureKey?: string | null;
      signatures?: {
        __typename: 'ModelSignatureConnection';
        items: Array<{
          __typename: 'Signature';
          id: string;
          userId: string;
          key: string;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      userType?: UserType | null;
      rating?: number | null;
      reportReasons?: Array<string | null> | null;
      notificationPreferences?: {
        __typename: 'NotificationPreferences';
        email?: boolean | null;
        push?: boolean | null;
        sms?: boolean | null;
      } | null;
      paymentUserId?: string | null;
      providerWalletId?: string | null;
      providerNppCrn?: string | null;
      ipAddress?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      owner?: string | null;
      loyaltyStatus?: RewardStatus | null;
      nextLoyaltyStatus?: RewardStatus | null;
      nextLoyaltyStatusPoint?: number | null;
      statusPoint?: number | null;
      pointsTotal?: number | null;
      pointsBalance?: number | null;
      invitedTo?: string | null;
    } | null;
    users?: Array<string | null> | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    id: string;
    conversationUserConversationsId?: string | null;
  } | null;
};

export type ListUserConversationsQueryVariables = {
  filter?: ModelUserConversationFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListUserConversationsQuery = {
  listUserConversations?: {
    __typename: 'ModelUserConversationConnection';
    items: Array<{
      __typename: 'UserConversation';
      conversationId: string;
      conversation?: {
        __typename: 'Conversation';
        title?: string | null;
        image?: {
          __typename: 'Image';
          alt?: string | null;
          identityId?: string | null;
          key: string;
          level: S3UploadLevel;
          type?: string | null;
        } | null;
        country?: string | null;
        messages?: {
          __typename: 'ModelMessageConnection';
          items: Array<{
            __typename: 'Message';
            conversationId: string;
            text?: string | null;
            attachments?: Array<{
              __typename: 'S3Upload';
              identityId?: string | null;
              key: string;
              level: S3UploadLevel;
              type: S3UploadType;
            } | null> | null;
            users: Array<string | null>;
            receiver: string;
            sender: string;
            createdBy: string;
            readBy?: Array<string | null> | null;
            createdAt: string;
            updatedAt?: string | null;
            id: string;
            conversationMessagesId?: string | null;
          } | null>;
          nextToken?: string | null;
        } | null;
        userConversations?: {
          __typename: 'ModelUserConversationConnection';
          items: Array<{
            __typename: 'UserConversation';
            conversationId: string;
            conversation?: {
              __typename: 'Conversation';
              title?: string | null;
              image?: {
                __typename: 'Image';
                alt?: string | null;
                identityId?: string | null;
                key: string;
                level: S3UploadLevel;
                type?: string | null;
              } | null;
              country?: string | null;
              messages?: {
                __typename: 'ModelMessageConnection';
                nextToken?: string | null;
              } | null;
              userConversations?: {
                __typename: 'ModelUserConversationConnection';
                nextToken?: string | null;
              } | null;
              users?: Array<string | null> | null;
              readBy?: Array<string | null> | null;
              createdBy?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              id: string;
            } | null;
            userId: string;
            user?: {
              __typename: 'User';
              id: string;
              identityId?: string | null;
              referralCode?: string | null;
              referredBy?: string | null;
              email?: string | null;
              about?: string | null;
              firstName?: string | null;
              firmId?: string | null;
              lastName?: string | null;
              phone?: string | null;
              blocked?: Array<string | null> | null;
              blockedBy?: Array<string | null> | null;
              country?: string | null;
              profileImg?: {
                __typename: 'Image';
                alt?: string | null;
                identityId?: string | null;
                key: string;
                level: S3UploadLevel;
                type?: string | null;
              } | null;
              interests?: Array<string | null> | null;
              locale?: string | null;
              onboardingStatus?: OnboardingStatus | null;
              onboardingEntity?: string | null;
              selectedSignatureKey?: string | null;
              signatures?: {
                __typename: 'ModelSignatureConnection';
                nextToken?: string | null;
              } | null;
              userType?: UserType | null;
              rating?: number | null;
              reportReasons?: Array<string | null> | null;
              notificationPreferences?: {
                __typename: 'NotificationPreferences';
                email?: boolean | null;
                push?: boolean | null;
                sms?: boolean | null;
              } | null;
              paymentUserId?: string | null;
              providerWalletId?: string | null;
              providerNppCrn?: string | null;
              ipAddress?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              owner?: string | null;
              loyaltyStatus?: RewardStatus | null;
              nextLoyaltyStatus?: RewardStatus | null;
              nextLoyaltyStatusPoint?: number | null;
              statusPoint?: number | null;
              pointsTotal?: number | null;
              pointsBalance?: number | null;
              invitedTo?: string | null;
            } | null;
            users?: Array<string | null> | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            id: string;
            conversationUserConversationsId?: string | null;
          } | null>;
          nextToken?: string | null;
        } | null;
        users?: Array<string | null> | null;
        readBy?: Array<string | null> | null;
        createdBy?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
      } | null;
      userId: string;
      user?: {
        __typename: 'User';
        id: string;
        identityId?: string | null;
        referralCode?: string | null;
        referredBy?: string | null;
        email?: string | null;
        about?: string | null;
        firstName?: string | null;
        firmId?: string | null;
        lastName?: string | null;
        phone?: string | null;
        blocked?: Array<string | null> | null;
        blockedBy?: Array<string | null> | null;
        country?: string | null;
        profileImg?: {
          __typename: 'Image';
          alt?: string | null;
          identityId?: string | null;
          key: string;
          level: S3UploadLevel;
          type?: string | null;
        } | null;
        interests?: Array<string | null> | null;
        locale?: string | null;
        onboardingStatus?: OnboardingStatus | null;
        onboardingEntity?: string | null;
        selectedSignatureKey?: string | null;
        signatures?: {
          __typename: 'ModelSignatureConnection';
          items: Array<{
            __typename: 'Signature';
            id: string;
            userId: string;
            key: string;
            createdAt?: string | null;
            updatedAt?: string | null;
          } | null>;
          nextToken?: string | null;
        } | null;
        userType?: UserType | null;
        rating?: number | null;
        reportReasons?: Array<string | null> | null;
        notificationPreferences?: {
          __typename: 'NotificationPreferences';
          email?: boolean | null;
          push?: boolean | null;
          sms?: boolean | null;
        } | null;
        paymentUserId?: string | null;
        providerWalletId?: string | null;
        providerNppCrn?: string | null;
        ipAddress?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        owner?: string | null;
        loyaltyStatus?: RewardStatus | null;
        nextLoyaltyStatus?: RewardStatus | null;
        nextLoyaltyStatusPoint?: number | null;
        statusPoint?: number | null;
        pointsTotal?: number | null;
        pointsBalance?: number | null;
        invitedTo?: string | null;
      } | null;
      users?: Array<string | null> | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
      conversationUserConversationsId?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type UserConversationsByConversationIdAndCreatedAtQueryVariables = {
  conversationId: string;
  createdAt?: ModelStringKeyConditionInput | null;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelUserConversationFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type UserConversationsByConversationIdAndCreatedAtQuery = {
  userConversationsByConversationIdAndCreatedAt?: {
    __typename: 'ModelUserConversationConnection';
    items: Array<{
      __typename: 'UserConversation';
      conversationId: string;
      conversation?: {
        __typename: 'Conversation';
        title?: string | null;
        image?: {
          __typename: 'Image';
          alt?: string | null;
          identityId?: string | null;
          key: string;
          level: S3UploadLevel;
          type?: string | null;
        } | null;
        country?: string | null;
        messages?: {
          __typename: 'ModelMessageConnection';
          items: Array<{
            __typename: 'Message';
            conversationId: string;
            text?: string | null;
            attachments?: Array<{
              __typename: 'S3Upload';
              identityId?: string | null;
              key: string;
              level: S3UploadLevel;
              type: S3UploadType;
            } | null> | null;
            users: Array<string | null>;
            receiver: string;
            sender: string;
            createdBy: string;
            readBy?: Array<string | null> | null;
            createdAt: string;
            updatedAt?: string | null;
            id: string;
            conversationMessagesId?: string | null;
          } | null>;
          nextToken?: string | null;
        } | null;
        userConversations?: {
          __typename: 'ModelUserConversationConnection';
          items: Array<{
            __typename: 'UserConversation';
            conversationId: string;
            conversation?: {
              __typename: 'Conversation';
              title?: string | null;
              image?: {
                __typename: 'Image';
                alt?: string | null;
                identityId?: string | null;
                key: string;
                level: S3UploadLevel;
                type?: string | null;
              } | null;
              country?: string | null;
              messages?: {
                __typename: 'ModelMessageConnection';
                nextToken?: string | null;
              } | null;
              userConversations?: {
                __typename: 'ModelUserConversationConnection';
                nextToken?: string | null;
              } | null;
              users?: Array<string | null> | null;
              readBy?: Array<string | null> | null;
              createdBy?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              id: string;
            } | null;
            userId: string;
            user?: {
              __typename: 'User';
              id: string;
              identityId?: string | null;
              referralCode?: string | null;
              referredBy?: string | null;
              email?: string | null;
              about?: string | null;
              firstName?: string | null;
              firmId?: string | null;
              lastName?: string | null;
              phone?: string | null;
              blocked?: Array<string | null> | null;
              blockedBy?: Array<string | null> | null;
              country?: string | null;
              profileImg?: {
                __typename: 'Image';
                alt?: string | null;
                identityId?: string | null;
                key: string;
                level: S3UploadLevel;
                type?: string | null;
              } | null;
              interests?: Array<string | null> | null;
              locale?: string | null;
              onboardingStatus?: OnboardingStatus | null;
              onboardingEntity?: string | null;
              selectedSignatureKey?: string | null;
              signatures?: {
                __typename: 'ModelSignatureConnection';
                nextToken?: string | null;
              } | null;
              userType?: UserType | null;
              rating?: number | null;
              reportReasons?: Array<string | null> | null;
              notificationPreferences?: {
                __typename: 'NotificationPreferences';
                email?: boolean | null;
                push?: boolean | null;
                sms?: boolean | null;
              } | null;
              paymentUserId?: string | null;
              providerWalletId?: string | null;
              providerNppCrn?: string | null;
              ipAddress?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              owner?: string | null;
              loyaltyStatus?: RewardStatus | null;
              nextLoyaltyStatus?: RewardStatus | null;
              nextLoyaltyStatusPoint?: number | null;
              statusPoint?: number | null;
              pointsTotal?: number | null;
              pointsBalance?: number | null;
              invitedTo?: string | null;
            } | null;
            users?: Array<string | null> | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            id: string;
            conversationUserConversationsId?: string | null;
          } | null>;
          nextToken?: string | null;
        } | null;
        users?: Array<string | null> | null;
        readBy?: Array<string | null> | null;
        createdBy?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
      } | null;
      userId: string;
      user?: {
        __typename: 'User';
        id: string;
        identityId?: string | null;
        referralCode?: string | null;
        referredBy?: string | null;
        email?: string | null;
        about?: string | null;
        firstName?: string | null;
        firmId?: string | null;
        lastName?: string | null;
        phone?: string | null;
        blocked?: Array<string | null> | null;
        blockedBy?: Array<string | null> | null;
        country?: string | null;
        profileImg?: {
          __typename: 'Image';
          alt?: string | null;
          identityId?: string | null;
          key: string;
          level: S3UploadLevel;
          type?: string | null;
        } | null;
        interests?: Array<string | null> | null;
        locale?: string | null;
        onboardingStatus?: OnboardingStatus | null;
        onboardingEntity?: string | null;
        selectedSignatureKey?: string | null;
        signatures?: {
          __typename: 'ModelSignatureConnection';
          items: Array<{
            __typename: 'Signature';
            id: string;
            userId: string;
            key: string;
            createdAt?: string | null;
            updatedAt?: string | null;
          } | null>;
          nextToken?: string | null;
        } | null;
        userType?: UserType | null;
        rating?: number | null;
        reportReasons?: Array<string | null> | null;
        notificationPreferences?: {
          __typename: 'NotificationPreferences';
          email?: boolean | null;
          push?: boolean | null;
          sms?: boolean | null;
        } | null;
        paymentUserId?: string | null;
        providerWalletId?: string | null;
        providerNppCrn?: string | null;
        ipAddress?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        owner?: string | null;
        loyaltyStatus?: RewardStatus | null;
        nextLoyaltyStatus?: RewardStatus | null;
        nextLoyaltyStatusPoint?: number | null;
        statusPoint?: number | null;
        pointsTotal?: number | null;
        pointsBalance?: number | null;
        invitedTo?: string | null;
      } | null;
      users?: Array<string | null> | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
      conversationUserConversationsId?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type UserConversationsByUserIdQueryVariables = {
  userId: string;
  sortDirection?: ModelSortDirection | null;
  filter?: ModelUserConversationFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type UserConversationsByUserIdQuery = {
  userConversationsByUserId?: {
    __typename: 'ModelUserConversationConnection';
    items: Array<{
      __typename: 'UserConversation';
      conversationId: string;
      conversation?: {
        __typename: 'Conversation';
        title?: string | null;
        image?: {
          __typename: 'Image';
          alt?: string | null;
          identityId?: string | null;
          key: string;
          level: S3UploadLevel;
          type?: string | null;
        } | null;
        country?: string | null;
        messages?: {
          __typename: 'ModelMessageConnection';
          items: Array<{
            __typename: 'Message';
            conversationId: string;
            text?: string | null;
            attachments?: Array<{
              __typename: 'S3Upload';
              identityId?: string | null;
              key: string;
              level: S3UploadLevel;
              type: S3UploadType;
            } | null> | null;
            users: Array<string | null>;
            receiver: string;
            sender: string;
            createdBy: string;
            readBy?: Array<string | null> | null;
            createdAt: string;
            updatedAt?: string | null;
            id: string;
            conversationMessagesId?: string | null;
          } | null>;
          nextToken?: string | null;
        } | null;
        userConversations?: {
          __typename: 'ModelUserConversationConnection';
          items: Array<{
            __typename: 'UserConversation';
            conversationId: string;
            conversation?: {
              __typename: 'Conversation';
              title?: string | null;
              image?: {
                __typename: 'Image';
                alt?: string | null;
                identityId?: string | null;
                key: string;
                level: S3UploadLevel;
                type?: string | null;
              } | null;
              country?: string | null;
              messages?: {
                __typename: 'ModelMessageConnection';
                nextToken?: string | null;
              } | null;
              userConversations?: {
                __typename: 'ModelUserConversationConnection';
                nextToken?: string | null;
              } | null;
              users?: Array<string | null> | null;
              readBy?: Array<string | null> | null;
              createdBy?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              id: string;
            } | null;
            userId: string;
            user?: {
              __typename: 'User';
              id: string;
              identityId?: string | null;
              referralCode?: string | null;
              referredBy?: string | null;
              email?: string | null;
              about?: string | null;
              firstName?: string | null;
              firmId?: string | null;
              lastName?: string | null;
              phone?: string | null;
              blocked?: Array<string | null> | null;
              blockedBy?: Array<string | null> | null;
              country?: string | null;
              profileImg?: {
                __typename: 'Image';
                alt?: string | null;
                identityId?: string | null;
                key: string;
                level: S3UploadLevel;
                type?: string | null;
              } | null;
              interests?: Array<string | null> | null;
              locale?: string | null;
              onboardingStatus?: OnboardingStatus | null;
              onboardingEntity?: string | null;
              selectedSignatureKey?: string | null;
              signatures?: {
                __typename: 'ModelSignatureConnection';
                nextToken?: string | null;
              } | null;
              userType?: UserType | null;
              rating?: number | null;
              reportReasons?: Array<string | null> | null;
              notificationPreferences?: {
                __typename: 'NotificationPreferences';
                email?: boolean | null;
                push?: boolean | null;
                sms?: boolean | null;
              } | null;
              paymentUserId?: string | null;
              providerWalletId?: string | null;
              providerNppCrn?: string | null;
              ipAddress?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              owner?: string | null;
              loyaltyStatus?: RewardStatus | null;
              nextLoyaltyStatus?: RewardStatus | null;
              nextLoyaltyStatusPoint?: number | null;
              statusPoint?: number | null;
              pointsTotal?: number | null;
              pointsBalance?: number | null;
              invitedTo?: string | null;
            } | null;
            users?: Array<string | null> | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            id: string;
            conversationUserConversationsId?: string | null;
          } | null>;
          nextToken?: string | null;
        } | null;
        users?: Array<string | null> | null;
        readBy?: Array<string | null> | null;
        createdBy?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        id: string;
      } | null;
      userId: string;
      user?: {
        __typename: 'User';
        id: string;
        identityId?: string | null;
        referralCode?: string | null;
        referredBy?: string | null;
        email?: string | null;
        about?: string | null;
        firstName?: string | null;
        firmId?: string | null;
        lastName?: string | null;
        phone?: string | null;
        blocked?: Array<string | null> | null;
        blockedBy?: Array<string | null> | null;
        country?: string | null;
        profileImg?: {
          __typename: 'Image';
          alt?: string | null;
          identityId?: string | null;
          key: string;
          level: S3UploadLevel;
          type?: string | null;
        } | null;
        interests?: Array<string | null> | null;
        locale?: string | null;
        onboardingStatus?: OnboardingStatus | null;
        onboardingEntity?: string | null;
        selectedSignatureKey?: string | null;
        signatures?: {
          __typename: 'ModelSignatureConnection';
          items: Array<{
            __typename: 'Signature';
            id: string;
            userId: string;
            key: string;
            createdAt?: string | null;
            updatedAt?: string | null;
          } | null>;
          nextToken?: string | null;
        } | null;
        userType?: UserType | null;
        rating?: number | null;
        reportReasons?: Array<string | null> | null;
        notificationPreferences?: {
          __typename: 'NotificationPreferences';
          email?: boolean | null;
          push?: boolean | null;
          sms?: boolean | null;
        } | null;
        paymentUserId?: string | null;
        providerWalletId?: string | null;
        providerNppCrn?: string | null;
        ipAddress?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        owner?: string | null;
        loyaltyStatus?: RewardStatus | null;
        nextLoyaltyStatus?: RewardStatus | null;
        nextLoyaltyStatusPoint?: number | null;
        statusPoint?: number | null;
        pointsTotal?: number | null;
        pointsBalance?: number | null;
        invitedTo?: string | null;
      } | null;
      users?: Array<string | null> | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      id: string;
      conversationUserConversationsId?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type GetUserQueryVariables = {
  id: string;
};

export type GetUserQuery = {
  getUser?: {
    __typename: 'User';
    id: string;
    identityId?: string | null;
    referralCode?: string | null;
    referredBy?: string | null;
    email?: string | null;
    about?: string | null;
    firstName?: string | null;
    firmId?: string | null;
    lastName?: string | null;
    phone?: string | null;
    blocked?: Array<string | null> | null;
    blockedBy?: Array<string | null> | null;
    country?: string | null;
    profileImg?: {
      __typename: 'Image';
      alt?: string | null;
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type?: string | null;
    } | null;
    interests?: Array<string | null> | null;
    locale?: string | null;
    onboardingStatus?: OnboardingStatus | null;
    onboardingEntity?: string | null;
    selectedSignatureKey?: string | null;
    signatures?: {
      __typename: 'ModelSignatureConnection';
      items: Array<{
        __typename: 'Signature';
        id: string;
        userId: string;
        key: string;
        createdAt?: string | null;
        updatedAt?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    userType?: UserType | null;
    rating?: number | null;
    reportReasons?: Array<string | null> | null;
    notificationPreferences?: {
      __typename: 'NotificationPreferences';
      email?: boolean | null;
      push?: boolean | null;
      sms?: boolean | null;
    } | null;
    paymentUserId?: string | null;
    providerWalletId?: string | null;
    providerNppCrn?: string | null;
    ipAddress?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    owner?: string | null;
    loyaltyStatus?: RewardStatus | null;
    nextLoyaltyStatus?: RewardStatus | null;
    nextLoyaltyStatusPoint?: number | null;
    statusPoint?: number | null;
    pointsTotal?: number | null;
    pointsBalance?: number | null;
    invitedTo?: string | null;
  } | null;
};

export type ListUsersQueryVariables = {
  id?: string | null;
  filter?: ModelUserFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
  sortDirection?: ModelSortDirection | null;
};

export type ListUsersQuery = {
  listUsers?: {
    __typename: 'ModelUserConnection';
    items: Array<{
      __typename: 'User';
      id: string;
      identityId?: string | null;
      referralCode?: string | null;
      referredBy?: string | null;
      email?: string | null;
      about?: string | null;
      firstName?: string | null;
      firmId?: string | null;
      lastName?: string | null;
      phone?: string | null;
      blocked?: Array<string | null> | null;
      blockedBy?: Array<string | null> | null;
      country?: string | null;
      profileImg?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      interests?: Array<string | null> | null;
      locale?: string | null;
      onboardingStatus?: OnboardingStatus | null;
      onboardingEntity?: string | null;
      selectedSignatureKey?: string | null;
      signatures?: {
        __typename: 'ModelSignatureConnection';
        items: Array<{
          __typename: 'Signature';
          id: string;
          userId: string;
          key: string;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      userType?: UserType | null;
      rating?: number | null;
      reportReasons?: Array<string | null> | null;
      notificationPreferences?: {
        __typename: 'NotificationPreferences';
        email?: boolean | null;
        push?: boolean | null;
        sms?: boolean | null;
      } | null;
      paymentUserId?: string | null;
      providerWalletId?: string | null;
      providerNppCrn?: string | null;
      ipAddress?: string | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      owner?: string | null;
      loyaltyStatus?: RewardStatus | null;
      nextLoyaltyStatus?: RewardStatus | null;
      nextLoyaltyStatusPoint?: number | null;
      statusPoint?: number | null;
      pointsTotal?: number | null;
      pointsBalance?: number | null;
      invitedTo?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type GetActivitiesByUserQueryVariables = {
  id: string;
  filter?: ModelActivityFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
  sortDirection?: ModelSortDirection | null;
};

export type GetActivitiesByUserQuery = {
  getActivitiesByUser?: {
    __typename: 'ModelActivityConnection';
    items: Array<{
      __typename: 'Activity';
      id: string;
      compositeId: string;
      userId?: string | null;
      entityId?: string | null;
      type: ActivityType;
      message?: string | null;
      metadata?: {
        __typename: 'ActivityMetadata';
        name?: string | null;
      } | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type GetReferralsByUserQueryVariables = {
  id: string;
  limit?: number | null;
  nextToken?: string | null;
  sortDirection?: ModelSortDirection | null;
};

export type GetReferralsByUserQuery = {
  getReferralsByUser?: {
    __typename: 'ModelReferralConnection';
    items: Array<{
      __typename: 'Referral';
      id: string;
      userId: string;
      referredId: string;
      firstName?: string | null;
      lastName?: string | null;
      taskPaidCount?: number | null;
      referredByCode?: string | null;
      referredCompleted?: boolean | null;
      referredSignedStatus?: boolean | null;
      createdAt?: string | null;
      updatedAt?: string | null;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type XeroListContactsQueryVariables = {
  page?: number | null;
};

export type XeroListContactsQuery = {
  xeroListContacts?: Array<{
    __typename: 'XeroContact';
    contactID: string;
    contactNumber?: string | null;
    accountNumber?: string | null;
    contactStatus?: ContactStatus | null;
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    emailAddress?: string | null;
    bankAccountDetails?: string | null;
    companyNumber?: string | null;
    taxNumber?: string | null;
    accountsReceivableTaxType?: string | null;
    accountsPayableTaxType?: string | null;
    addresses?: Array<{
      __typename: 'XeroAddress';
      addressType?: string | null;
      addressLine1?: string | null;
      addressLine2?: string | null;
      addressLine3?: string | null;
      addressLine4?: string | null;
      city?: string | null;
      region?: string | null;
      postalCode?: string | null;
      country?: string | null;
      attentionTo?: string | null;
    } | null> | null;
    phones?: Array<{
      __typename: 'XeroPhone';
      phoneType?: string | null;
      phoneNumber?: string | null;
      phoneAreaCode?: string | null;
      phoneCountryCode?: string | null;
    } | null> | null;
    isSupplier?: boolean | null;
    isCustomer?: boolean | null;
    defaultCurrency?: string | null;
    updatedDateUTC?: string | null;
    contactPersons?: Array<{
      __typename: 'XeroContactPerson';
      firstName?: string | null;
      lastName?: string | null;
      emailAddress?: string | null;
      includeInEmails?: boolean | null;
    } | null> | null;
    xeroNetworkKey?: string | null;
    mergedToContactID?: string | null;
    salesDefaultAccountCode?: string | null;
    purchasesDefaultAccountCode?: string | null;
    salesTrackingCategories?: Array<string | null> | null;
    purchasesTrackingCategories?: Array<string | null> | null;
    salesDefaultLineAmountType?: string | null;
    purchasesDefaultLineAmountType?: string | null;
    trackingCategoryName?: string | null;
    trackingCategoryOption?: string | null;
    paymentTerms?: string | null;
    website?: string | null;
    brandingTheme?: string | null;
    batchPayments?: string | null;
    discount?: number | null;
    validationErrors?: Array<string | null> | null;
    hasValidationErrors?: boolean | null;
    hasAttachments?: boolean | null;
    balances?: {
      __typename: 'Balances';
      accountsReceivable?: number | null;
      accountsPayable?: number | null;
    } | null;
    statusAttributeString?: string | null;
  } | null> | null;
};

export type XeroListTransactionsQueryVariables = {
  statuses?: Array<XeroInvoiceStatus | null> | null;
  page?: number | null;
};

export type XeroListTransactionsQuery = {
  xeroListTransactions?: Array<{
    __typename: 'XeroInvoice';
    invoiceID: string;
    type?: string | null;
    status?: XeroInvoiceStatus | null;
    lineAmountTypes?: string | null;
    currencyCode?: string | null;
    date?: string | null;
    dueDate?: string | null;
    lineItems?: Array<{
      __typename: 'XeroLineItem';
      lineItemID: string;
      description?: string | null;
      quantity?: number | null;
      unitAmount?: number | null;
      itemCode?: string | null;
      accountCode?: string | null;
      accountID?: string | null;
      taxType?: string | null;
      taxAmount?: number | null;
      lineAmount?: number | null;
      taxNumber?: number | null;
      discountRate?: number | null;
      discountAmount?: number | null;
      repeatingInvoiceID?: string | null;
    } | null> | null;
    subTotal?: number | null;
    totalTax?: number | null;
    total?: number | null;
    invoiceNumber?: string | null;
    reference?: string | null;
    hasAttachments?: boolean | null;
    updatedDateUTC?: string | null;
    currencyRate?: number | null;
    remainingCredit?: number | null;
    amountDue?: number | null;
    amountPaid?: number | null;
    fullyPaidOnDate?: string | null;
    amountCredited?: number | null;
    brandingThemeID?: string | null;
    hasErrors?: boolean | null;
    contact?: {
      __typename: 'XeroContact';
      contactID: string;
      contactNumber?: string | null;
      accountNumber?: string | null;
      contactStatus?: ContactStatus | null;
      name?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      emailAddress?: string | null;
      bankAccountDetails?: string | null;
      companyNumber?: string | null;
      taxNumber?: string | null;
      accountsReceivableTaxType?: string | null;
      accountsPayableTaxType?: string | null;
      addresses?: Array<{
        __typename: 'XeroAddress';
        addressType?: string | null;
        addressLine1?: string | null;
        addressLine2?: string | null;
        addressLine3?: string | null;
        addressLine4?: string | null;
        city?: string | null;
        region?: string | null;
        postalCode?: string | null;
        country?: string | null;
        attentionTo?: string | null;
      } | null> | null;
      phones?: Array<{
        __typename: 'XeroPhone';
        phoneType?: string | null;
        phoneNumber?: string | null;
        phoneAreaCode?: string | null;
        phoneCountryCode?: string | null;
      } | null> | null;
      isSupplier?: boolean | null;
      isCustomer?: boolean | null;
      defaultCurrency?: string | null;
      updatedDateUTC?: string | null;
      contactPersons?: Array<{
        __typename: 'XeroContactPerson';
        firstName?: string | null;
        lastName?: string | null;
        emailAddress?: string | null;
        includeInEmails?: boolean | null;
      } | null> | null;
      xeroNetworkKey?: string | null;
      mergedToContactID?: string | null;
      salesDefaultAccountCode?: string | null;
      purchasesDefaultAccountCode?: string | null;
      salesTrackingCategories?: Array<string | null> | null;
      purchasesTrackingCategories?: Array<string | null> | null;
      salesDefaultLineAmountType?: string | null;
      purchasesDefaultLineAmountType?: string | null;
      trackingCategoryName?: string | null;
      trackingCategoryOption?: string | null;
      paymentTerms?: string | null;
      website?: string | null;
      brandingTheme?: string | null;
      batchPayments?: string | null;
      discount?: number | null;
      validationErrors?: Array<string | null> | null;
      hasValidationErrors?: boolean | null;
      hasAttachments?: boolean | null;
      balances?: {
        __typename: 'Balances';
        accountsReceivable?: number | null;
        accountsPayable?: number | null;
      } | null;
      statusAttributeString?: string | null;
    } | null;
  } | null> | null;
};

export type XeroGetConnectionStatusQuery = {
  xeroGetConnectionStatus: {
    __typename: 'XeroConnectionStatus';
    isConnected: boolean;
  };
};

export type XeroGetSyncedTenantsQuery = {
  xeroGetSyncedTenants: Array<{
    __typename: 'XeroTenant';
    id?: string | null;
    authEventId?: string | null;
    tenantId?: string | null;
    tenantType?: XeroTenantType | null;
    tenantName?: string | null;
    createdDateUtc?: string | null;
    updatedDateUtc?: string | null;
  } | null>;
};

export type XeroGetAccountsQueryVariables = {
  input?: XeroGetAccountsInput | null;
};

export type XeroGetAccountsQuery = {
  xeroGetAccounts?: Array<{
    __typename: 'XeroAccount';
    code?: string | null;
    name?: string | null;
    accountID?: string | null;
    type?: XeroAccountType | null;
    bankAccountNumber?: string | null;
    status?: XeroAccountStatus | null;
    description?: string | null;
    bankAccountType?: XeroBankAccountType | null;
    currencyCode?: string | null;
    taxType?: string | null;
    enablePaymentsToAccount?: boolean | null;
    showInExpenseClaims?: boolean | null;
    _class?: XeroAccountClass | null;
    systemAccount?: XeroSystemAccountType | null;
    reportingCode?: string | null;
    reportingCodeName?: string | null;
    hasAttachments?: boolean | null;
    updatedDateUTC?: string | null;
    addToWatchlist?: boolean | null;
  } | null> | null;
};

export type GetPayToFailedPaymentQueryVariables = {
  instructionId: string;
};

export type GetPayToFailedPaymentQuery = {
  getPayToFailedPayment?: {
    __typename: 'ProviderPayToFailedPayment';
    id: string;
    agreementUuid: string;
    errorMessage?: string | null;
  } | null;
};

export type GetEntityPayIdQueryVariables = {
  entityId: string;
  billPayments?: Array<BillsPaymentInput | null> | null;
};

export type GetEntityPayIdQuery = {
  getEntityPayId?: {
    __typename: 'EntityPayId';
    transferAmount?: number | null;
    payId?: string | null;
    payIdReference?: string | null;
    currency?: string | null;
  } | null;
};

export type OnUpdateBeneficialOwnerSubscriptionVariables = {
  beneficialOwnerId: string;
  entityId: string;
};

export type OnUpdateBeneficialOwnerSubscription = {
  onUpdateBeneficialOwner?: {
    __typename: 'BeneficialOwner';
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    name?: string | null;
    providerEntityId: string;
    verificationStatus: VerificationStatus;
    verificationAttempt?: number | null;
    createdBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null;
};

export type OnUpdateDocumentAnalysisSubscriptionVariables = {
  entityId: string;
};

export type OnUpdateDocumentAnalysisSubscription = {
  onUpdateDocumentAnalysis?: {
    __typename: 'DocumentAnalysis';
    id: string;
    entityId: string;
    fileKey: string;
    status: DocumentAnalysisStatus;
    expenseStatus?: DocumentAnalysisStatus | null;
    queryStatus?: DocumentAnalysisStatus | null;
    matchedContactId?: string | null;
    matchedContact?: {
      __typename: 'Contact';
      id: string;
      entityId: string;
      xeroTenantId?: string | null;
      entityType?: EntityType | null;
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
      mobile?: string | null;
      phone?: string | null;
      taxNumber?: string | null;
      companyNumber?: string | null;
      name?: string | null;
      legalName?: string | null;
      companyName?: string | null;
      searchName?: string | null;
      status?: ContactStatus | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      contactType?: ContactType | null;
      bank?: {
        __typename: 'ContactBankAccount';
        id?: string | null;
        accountName?: string | null;
        bankName?: string | null;
        accountNumber: string;
        routingNumber: string;
        holderType?: BankHolderType | null;
        accountType?: BankAccountType | null;
        country?: string | null;
      } | null;
      bpay?: {
        __typename: 'ContactBpay';
        billerCode?: number | null;
        referenceNumber?: string | null;
      } | null;
      bulkUploadFileKey?: string | null;
      owner?: string | null;
    } | null;
    matchedEntityId?: string | null;
    matchedEntity?: {
      __typename: 'Entity';
      id: string;
      type: EntityType;
      taxNumber?: string | null;
      companyNumber?: string | null;
      billerCode?: number | null;
      name: string;
      legalName?: string | null;
      searchName?: string | null;
      address?: {
        __typename: 'Address';
        addressId?: string | null;
        placeId?: string | null;
        contactName?: string | null;
        contactNumber?: string | null;
        addressFull?: string | null;
        address1?: string | null;
        address2?: string | null;
        unitNumber?: string | null;
        streetNumber?: string | null;
        streetName?: string | null;
        streetType?: string | null;
        city: string;
        country: string;
        countryCode?: string | null;
        state: string;
        stateCode?: string | null;
        postalCode: string;
      } | null;
      logo?: {
        __typename: 'Image';
        alt?: string | null;
        identityId?: string | null;
        key: string;
        level: S3UploadLevel;
        type?: string | null;
      } | null;
      entityBeneficialOwners?: {
        __typename: 'ModelEntityBeneficialOwnerConnection';
        items?: Array<{
          __typename: 'EntityBeneficialOwner';
          entityId: string;
          beneficialOwnerId: string;
          beneficialOwner?: {
            __typename: 'BeneficialOwner';
            id: string;
            firstName?: string | null;
            lastName?: string | null;
            name?: string | null;
            providerEntityId: string;
            verificationStatus: VerificationStatus;
            verificationAttempt?: number | null;
            createdBy?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
          } | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          owner?: string | null;
        } | null> | null;
        nextToken?: string | null;
      } | null;
      entityUsers?: {
        __typename: 'ModelEntityUserConnection';
        items: Array<{
          __typename: 'EntityUser';
          id: string;
          entityId: string;
          userId: string;
          invitedEmail?: string | null;
          referredBy?: string | null;
          invitedEntityId?: string | null;
          firmEntityId?: string | null;
          firstName?: string | null;
          lastName?: string | null;
          role?: EntityUserRole | null;
          paymentsEnabled?: boolean | null;
          entitySearchName?: string | null;
          entity?: {
            __typename: 'Entity';
            id: string;
            type: EntityType;
            taxNumber?: string | null;
            companyNumber?: string | null;
            billerCode?: number | null;
            name: string;
            legalName?: string | null;
            searchName?: string | null;
            address?: {
              __typename: 'Address';
              addressId?: string | null;
              placeId?: string | null;
              contactName?: string | null;
              contactNumber?: string | null;
              addressFull?: string | null;
              address1?: string | null;
              address2?: string | null;
              unitNumber?: string | null;
              streetNumber?: string | null;
              streetName?: string | null;
              streetType?: string | null;
              city: string;
              country: string;
              countryCode?: string | null;
              state: string;
              stateCode?: string | null;
              postalCode: string;
            } | null;
            logo?: {
              __typename: 'Image';
              alt?: string | null;
              identityId?: string | null;
              key: string;
              level: S3UploadLevel;
              type?: string | null;
            } | null;
            entityBeneficialOwners?: {
              __typename: 'ModelEntityBeneficialOwnerConnection';
              items?: Array<{
                __typename: 'EntityBeneficialOwner';
                entityId: string;
                beneficialOwnerId: string;
                createdAt?: string | null;
                updatedAt?: string | null;
                owner?: string | null;
              } | null> | null;
              nextToken?: string | null;
            } | null;
            entityUsers?: {
              __typename: 'ModelEntityUserConnection';
              items: Array<{
                __typename: 'EntityUser';
                id: string;
                entityId: string;
                userId: string;
                invitedEmail?: string | null;
                referredBy?: string | null;
                invitedEntityId?: string | null;
                firmEntityId?: string | null;
                firstName?: string | null;
                lastName?: string | null;
                role?: EntityUserRole | null;
                paymentsEnabled?: boolean | null;
                entitySearchName?: string | null;
                searchName?: string | null;
                createdBy?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                status?: EntityUserStatus | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            gstRegistered?: boolean | null;
            providerEntityId?: string | null;
            providerCompanyId?: string | null;
            providerBillUserCompanyId?: string | null;
            providerBankAccountId?: string | null;
            providerDigitalWalletId?: string | null;
            providerBpayCrn?: string | null;
            contact?: {
              __typename: 'EntityContact';
              firstName?: string | null;
              lastName?: string | null;
              email?: string | null;
              phone?: string | null;
              role?: string | null;
            } | null;
            paymentMethods?: {
              __typename: 'ModelPaymentMethodConnection';
              items: Array<{
                __typename: 'PaymentMethod';
                id: string;
                paymentMethodType: PaymentMethodType;
                type?: string | null;
                fullName?: string | null;
                number?: string | null;
                expMonth?: string | null;
                expYear?: string | null;
                accountName?: string | null;
                bankName?: string | null;
                accountNumber?: string | null;
                routingNumber?: string | null;
                holderType?: BankHolderType | null;
                accountType?: BankAccountType | null;
                status?: PaymentMethodStatus | null;
                accountDirection?: AccountDirection | null;
                expiresAt?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            paymentMethodId?: string | null;
            paymentUserId?: string | null;
            disbursementMethodId?: string | null;
            receivingAccounts?: {
              __typename: 'ModelPaymentMethodConnection';
              items: Array<{
                __typename: 'PaymentMethod';
                id: string;
                paymentMethodType: PaymentMethodType;
                type?: string | null;
                fullName?: string | null;
                number?: string | null;
                expMonth?: string | null;
                expYear?: string | null;
                accountName?: string | null;
                bankName?: string | null;
                accountNumber?: string | null;
                routingNumber?: string | null;
                holderType?: BankHolderType | null;
                accountType?: BankAccountType | null;
                status?: PaymentMethodStatus | null;
                accountDirection?: AccountDirection | null;
                expiresAt?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null>;
              nextToken?: string | null;
            } | null;
            ubosCreated?: boolean | null;
            numUbosCreated?: number | null;
            subCategory?: string | null;
            clientsStatus?: EntityClientsStatus | null;
            ocrEmail?: string | null;
            verificationStatus?: VerificationStatus | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            owner: string;
            referredBy?: string | null;
            xeroContactSyncStatus?: XeroSyncStatus | null;
            xeroLastContactSyncAt?: string | null;
            xeroInvoiceSyncStatus?: XeroSyncStatus | null;
            xeroLastInvoiceSyncAt?: string | null;
            xeroTenantId?: string | null;
          } | null;
          searchName?: string | null;
          createdBy?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          status?: EntityUserStatus | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      gstRegistered?: boolean | null;
      providerEntityId?: string | null;
      providerCompanyId?: string | null;
      providerBillUserCompanyId?: string | null;
      providerBankAccountId?: string | null;
      providerDigitalWalletId?: string | null;
      providerBpayCrn?: string | null;
      contact?: {
        __typename: 'EntityContact';
        firstName?: string | null;
        lastName?: string | null;
        email?: string | null;
        phone?: string | null;
        role?: string | null;
      } | null;
      paymentMethods?: {
        __typename: 'ModelPaymentMethodConnection';
        items: Array<{
          __typename: 'PaymentMethod';
          id: string;
          paymentMethodType: PaymentMethodType;
          type?: string | null;
          fullName?: string | null;
          number?: string | null;
          expMonth?: string | null;
          expYear?: string | null;
          accountName?: string | null;
          bankName?: string | null;
          accountNumber?: string | null;
          routingNumber?: string | null;
          holderType?: BankHolderType | null;
          accountType?: BankAccountType | null;
          status?: PaymentMethodStatus | null;
          accountDirection?: AccountDirection | null;
          expiresAt?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      paymentMethodId?: string | null;
      paymentUserId?: string | null;
      disbursementMethodId?: string | null;
      receivingAccounts?: {
        __typename: 'ModelPaymentMethodConnection';
        items: Array<{
          __typename: 'PaymentMethod';
          id: string;
          paymentMethodType: PaymentMethodType;
          type?: string | null;
          fullName?: string | null;
          number?: string | null;
          expMonth?: string | null;
          expYear?: string | null;
          accountName?: string | null;
          bankName?: string | null;
          accountNumber?: string | null;
          routingNumber?: string | null;
          holderType?: BankHolderType | null;
          accountType?: BankAccountType | null;
          status?: PaymentMethodStatus | null;
          accountDirection?: AccountDirection | null;
          expiresAt?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null>;
        nextToken?: string | null;
      } | null;
      ubosCreated?: boolean | null;
      numUbosCreated?: number | null;
      subCategory?: string | null;
      clientsStatus?: EntityClientsStatus | null;
      ocrEmail?: string | null;
      verificationStatus?: VerificationStatus | null;
      createdAt?: string | null;
      updatedAt?: string | null;
      owner: string;
      referredBy?: string | null;
      xeroContactSyncStatus?: XeroSyncStatus | null;
      xeroLastContactSyncAt?: string | null;
      xeroInvoiceSyncStatus?: XeroSyncStatus | null;
      xeroLastInvoiceSyncAt?: string | null;
      xeroTenantId?: string | null;
    } | null;
    newContact?: {
      __typename: 'DocumentAnalysisContact';
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
      phone?: string | null;
      companyName?: string | null;
      taxNumber?: string | null;
    } | null;
    task?: {
      __typename: 'DocumentAnalysisTask';
      reference?: string | null;
      dueAt?: string | null;
      gstInclusive?: boolean | null;
      notes?: string | null;
      amount?: number | null;
      gstAmount?: number | null;
      lineItems?: Array<{
        __typename: 'DocumentAnalysisLineItem';
        description?: string | null;
        quantity?: number | null;
        unitPrice?: number | null;
        price?: number | null;
        productCode?: string | null;
      } | null> | null;
      numberOfPayments?: number | null;
      paymentFrequency?: PaymentFrequency | null;
      shippingAmount?: number | null;
    } | null;
    bpay?: {
      __typename: 'ContactBpay';
      billerCode?: number | null;
      referenceNumber?: string | null;
    } | null;
    bank?: {
      __typename: 'DocumentAnalysisBankAccount';
      accountNumber?: string | null;
      routingNumber?: string | null;
    } | null;
    source?: DocumentAnalysisSource | null;
    createdBy?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
  } | null;
};

export type OnUpdateEntitySubscriptionVariables = {
  entityId: string;
};

export type OnUpdateEntitySubscription = {
  onUpdateEntity?: {
    __typename: 'Entity';
    id: string;
    type: EntityType;
    taxNumber?: string | null;
    companyNumber?: string | null;
    billerCode?: number | null;
    name: string;
    legalName?: string | null;
    searchName?: string | null;
    address?: {
      __typename: 'Address';
      addressId?: string | null;
      placeId?: string | null;
      contactName?: string | null;
      contactNumber?: string | null;
      addressFull?: string | null;
      address1?: string | null;
      address2?: string | null;
      unitNumber?: string | null;
      streetNumber?: string | null;
      streetName?: string | null;
      streetType?: string | null;
      city: string;
      country: string;
      countryCode?: string | null;
      state: string;
      stateCode?: string | null;
      postalCode: string;
    } | null;
    logo?: {
      __typename: 'Image';
      alt?: string | null;
      identityId?: string | null;
      key: string;
      level: S3UploadLevel;
      type?: string | null;
    } | null;
    entityBeneficialOwners?: {
      __typename: 'ModelEntityBeneficialOwnerConnection';
      items?: Array<{
        __typename: 'EntityBeneficialOwner';
        entityId: string;
        beneficialOwnerId: string;
        beneficialOwner?: {
          __typename: 'BeneficialOwner';
          id: string;
          firstName?: string | null;
          lastName?: string | null;
          name?: string | null;
          providerEntityId: string;
          verificationStatus: VerificationStatus;
          verificationAttempt?: number | null;
          createdBy?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        } | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        owner?: string | null;
      } | null> | null;
      nextToken?: string | null;
    } | null;
    entityUsers?: {
      __typename: 'ModelEntityUserConnection';
      items: Array<{
        __typename: 'EntityUser';
        id: string;
        entityId: string;
        userId: string;
        invitedEmail?: string | null;
        referredBy?: string | null;
        invitedEntityId?: string | null;
        firmEntityId?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        role?: EntityUserRole | null;
        paymentsEnabled?: boolean | null;
        entitySearchName?: string | null;
        entity?: {
          __typename: 'Entity';
          id: string;
          type: EntityType;
          taxNumber?: string | null;
          companyNumber?: string | null;
          billerCode?: number | null;
          name: string;
          legalName?: string | null;
          searchName?: string | null;
          address?: {
            __typename: 'Address';
            addressId?: string | null;
            placeId?: string | null;
            contactName?: string | null;
            contactNumber?: string | null;
            addressFull?: string | null;
            address1?: string | null;
            address2?: string | null;
            unitNumber?: string | null;
            streetNumber?: string | null;
            streetName?: string | null;
            streetType?: string | null;
            city: string;
            country: string;
            countryCode?: string | null;
            state: string;
            stateCode?: string | null;
            postalCode: string;
          } | null;
          logo?: {
            __typename: 'Image';
            alt?: string | null;
            identityId?: string | null;
            key: string;
            level: S3UploadLevel;
            type?: string | null;
          } | null;
          entityBeneficialOwners?: {
            __typename: 'ModelEntityBeneficialOwnerConnection';
            items?: Array<{
              __typename: 'EntityBeneficialOwner';
              entityId: string;
              beneficialOwnerId: string;
              beneficialOwner?: {
                __typename: 'BeneficialOwner';
                id: string;
                firstName?: string | null;
                lastName?: string | null;
                name?: string | null;
                providerEntityId: string;
                verificationStatus: VerificationStatus;
                verificationAttempt?: number | null;
                createdBy?: string | null;
                createdAt?: string | null;
                updatedAt?: string | null;
              } | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              owner?: string | null;
            } | null> | null;
            nextToken?: string | null;
          } | null;
          entityUsers?: {
            __typename: 'ModelEntityUserConnection';
            items: Array<{
              __typename: 'EntityUser';
              id: string;
              entityId: string;
              userId: string;
              invitedEmail?: string | null;
              referredBy?: string | null;
              invitedEntityId?: string | null;
              firmEntityId?: string | null;
              firstName?: string | null;
              lastName?: string | null;
              role?: EntityUserRole | null;
              paymentsEnabled?: boolean | null;
              entitySearchName?: string | null;
              entity?: {
                __typename: 'Entity';
                id: string;
                type: EntityType;
                taxNumber?: string | null;
                companyNumber?: string | null;
                billerCode?: number | null;
                name: string;
                legalName?: string | null;
                searchName?: string | null;
                gstRegistered?: boolean | null;
                providerEntityId?: string | null;
                providerCompanyId?: string | null;
                providerBillUserCompanyId?: string | null;
                providerBankAccountId?: string | null;
                providerDigitalWalletId?: string | null;
                providerBpayCrn?: string | null;
                paymentMethodId?: string | null;
                paymentUserId?: string | null;
                disbursementMethodId?: string | null;
                ubosCreated?: boolean | null;
                numUbosCreated?: number | null;
                subCategory?: string | null;
                clientsStatus?: EntityClientsStatus | null;
                ocrEmail?: string | null;
                verificationStatus?: VerificationStatus | null;
                createdAt?: string | null;
                updatedAt?: string | null;
                owner: string;
                referredBy?: string | null;
                xeroContactSyncStatus?: XeroSyncStatus | null;
                xeroLastContactSyncAt?: string | null;
                xeroInvoiceSyncStatus?: XeroSyncStatus | null;
                xeroLastInvoiceSyncAt?: string | null;
                xeroTenantId?: string | null;
              } | null;
              searchName?: string | null;
              createdBy?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
              status?: EntityUserStatus | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          gstRegistered?: boolean | null;
          providerEntityId?: string | null;
          providerCompanyId?: string | null;
          providerBillUserCompanyId?: string | null;
          providerBankAccountId?: string | null;
          providerDigitalWalletId?: string | null;
          providerBpayCrn?: string | null;
          contact?: {
            __typename: 'EntityContact';
            firstName?: string | null;
            lastName?: string | null;
            email?: string | null;
            phone?: string | null;
            role?: string | null;
          } | null;
          paymentMethods?: {
            __typename: 'ModelPaymentMethodConnection';
            items: Array<{
              __typename: 'PaymentMethod';
              id: string;
              paymentMethodType: PaymentMethodType;
              type?: string | null;
              fullName?: string | null;
              number?: string | null;
              expMonth?: string | null;
              expYear?: string | null;
              accountName?: string | null;
              bankName?: string | null;
              accountNumber?: string | null;
              routingNumber?: string | null;
              holderType?: BankHolderType | null;
              accountType?: BankAccountType | null;
              status?: PaymentMethodStatus | null;
              accountDirection?: AccountDirection | null;
              expiresAt?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          paymentMethodId?: string | null;
          paymentUserId?: string | null;
          disbursementMethodId?: string | null;
          receivingAccounts?: {
            __typename: 'ModelPaymentMethodConnection';
            items: Array<{
              __typename: 'PaymentMethod';
              id: string;
              paymentMethodType: PaymentMethodType;
              type?: string | null;
              fullName?: string | null;
              number?: string | null;
              expMonth?: string | null;
              expYear?: string | null;
              accountName?: string | null;
              bankName?: string | null;
              accountNumber?: string | null;
              routingNumber?: string | null;
              holderType?: BankHolderType | null;
              accountType?: BankAccountType | null;
              status?: PaymentMethodStatus | null;
              accountDirection?: AccountDirection | null;
              expiresAt?: string | null;
              createdAt?: string | null;
              updatedAt?: string | null;
            } | null>;
            nextToken?: string | null;
          } | null;
          ubosCreated?: boolean | null;
          numUbosCreated?: number | null;
          subCategory?: string | null;
          clientsStatus?: EntityClientsStatus | null;
          ocrEmail?: string | null;
          verificationStatus?: VerificationStatus | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          owner: string;
          referredBy?: string | null;
          xeroContactSyncStatus?: XeroSyncStatus | null;
          xeroLastContactSyncAt?: string | null;
          xeroInvoiceSyncStatus?: XeroSyncStatus | null;
          xeroLastInvoiceSyncAt?: string | null;
          xeroTenantId?: string | null;
        } | null;
        searchName?: string | null;
        createdBy?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        status?: EntityUserStatus | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    gstRegistered?: boolean | null;
    providerEntityId?: string | null;
    providerCompanyId?: string | null;
    providerBillUserCompanyId?: string | null;
    providerBankAccountId?: string | null;
    providerDigitalWalletId?: string | null;
    providerBpayCrn?: string | null;
    contact?: {
      __typename: 'EntityContact';
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
      phone?: string | null;
      role?: string | null;
    } | null;
    paymentMethods?: {
      __typename: 'ModelPaymentMethodConnection';
      items: Array<{
        __typename: 'PaymentMethod';
        id: string;
        paymentMethodType: PaymentMethodType;
        type?: string | null;
        fullName?: string | null;
        number?: string | null;
        expMonth?: string | null;
        expYear?: string | null;
        accountName?: string | null;
        bankName?: string | null;
        accountNumber?: string | null;
        routingNumber?: string | null;
        holderType?: BankHolderType | null;
        accountType?: BankAccountType | null;
        status?: PaymentMethodStatus | null;
        accountDirection?: AccountDirection | null;
        expiresAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    paymentMethodId?: string | null;
    paymentUserId?: string | null;
    disbursementMethodId?: string | null;
    receivingAccounts?: {
      __typename: 'ModelPaymentMethodConnection';
      items: Array<{
        __typename: 'PaymentMethod';
        id: string;
        paymentMethodType: PaymentMethodType;
        type?: string | null;
        fullName?: string | null;
        number?: string | null;
        expMonth?: string | null;
        expYear?: string | null;
        accountName?: string | null;
        bankName?: string | null;
        accountNumber?: string | null;
        routingNumber?: string | null;
        holderType?: BankHolderType | null;
        accountType?: BankAccountType | null;
        status?: PaymentMethodStatus | null;
        accountDirection?: AccountDirection | null;
        expiresAt?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
      } | null>;
      nextToken?: string | null;
    } | null;
    ubosCreated?: boolean | null;
    numUbosCreated?: number | null;
    subCategory?: string | null;
    clientsStatus?: EntityClientsStatus | null;
    ocrEmail?: string | null;
    verificationStatus?: VerificationStatus | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    owner: string;
    referredBy?: string | null;
    xeroContactSyncStatus?: XeroSyncStatus | null;
    xeroLastContactSyncAt?: string | null;
    xeroInvoiceSyncStatus?: XeroSyncStatus | null;
    xeroLastInvoiceSyncAt?: string | null;
    xeroTenantId?: string | null;
  } | null;
};

export type OnCreateNotificationSubscription = {
  onCreateNotification?: {
    __typename: 'Notification';
    id: string;
    title?: string | null;
    message?: string | null;
    status?: NotificationStatus | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    type?: string | null;
    owner: string;
  } | null;
};
