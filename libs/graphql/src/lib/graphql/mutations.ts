/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createAdmin = /* GraphQL */ `
  mutation CreateAdmin($input: CreateAdminInput) {
    createAdmin(input: $input) {
      firstName
      lastName
      email
      phone
      role
      hasAccessed
      createdBy
      createdAt
      updatedAt
      id
      owner
    }
  }
`;
export const updateAdmin = /* GraphQL */ `
  mutation UpdateAdmin(
    $input: UpdateAdminInput!
    $condition: ModelAdminConditionInput
  ) {
    updateAdmin(input: $input, condition: $condition) {
      firstName
      lastName
      email
      phone
      role
      hasAccessed
      createdBy
      createdAt
      updatedAt
      id
      owner
    }
  }
`;
export const deleteAdmin = /* GraphQL */ `
  mutation DeleteAdmin($input: DeleteAdminInput) {
    deleteAdmin(input: $input) {
      firstName
      lastName
      email
      phone
      role
      hasAccessed
      createdBy
      createdAt
      updatedAt
      id
      owner
    }
  }
`;
export const updateBeneficialOwner = /* GraphQL */ `
  mutation UpdateBeneficialOwner($input: UpdateBeneficialOwnerInput) {
    updateBeneficialOwner(input: $input) {
      id
      firstName
      lastName
      name
      providerEntityId
      verificationStatus
      verificationAttempt
      createdBy
      createdAt
      updatedAt
    }
  }
`;
export const createClient = /* GraphQL */ `
  mutation CreateClient($input: CreateClientInput) {
    createClient(input: $input) {
      id
      entityId
      userId
      invitedEmail
      referredBy
      invitedEntityId
      firmEntityId
      firstName
      lastName
      role
      paymentsEnabled
      entitySearchName
      entity {
        id
        type
        taxNumber
        companyNumber
        billerCode
        name
        legalName
        searchName
        address {
          addressId
          placeId
          contactName
          contactNumber
          addressFull
          address1
          address2
          unitNumber
          streetNumber
          streetName
          streetType
          city
          country
          countryCode
          state
          stateCode
          postalCode
        }
        logo {
          alt
          identityId
          key
          level
          type
        }
        entityBeneficialOwners {
          items {
            entityId
            beneficialOwnerId
            beneficialOwner {
              id
              firstName
              lastName
              name
              providerEntityId
              verificationStatus
              verificationAttempt
              createdBy
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
            owner
          }
          nextToken
        }
        entityUsers {
          items {
            id
            entityId
            userId
            invitedEmail
            referredBy
            invitedEntityId
            firmEntityId
            firstName
            lastName
            role
            paymentsEnabled
            entitySearchName
            entity {
              id
              type
              taxNumber
              companyNumber
              billerCode
              name
              legalName
              searchName
              address {
                addressId
                placeId
                contactName
                contactNumber
                addressFull
                address1
                address2
                unitNumber
                streetNumber
                streetName
                streetType
                city
                country
                countryCode
                state
                stateCode
                postalCode
              }
              logo {
                alt
                identityId
                key
                level
                type
              }
              entityBeneficialOwners {
                items {
                  entityId
                  beneficialOwnerId
                  createdAt
                  updatedAt
                  owner
                }
                nextToken
              }
              entityUsers {
                items {
                  id
                  entityId
                  userId
                  invitedEmail
                  referredBy
                  invitedEntityId
                  firmEntityId
                  firstName
                  lastName
                  role
                  paymentsEnabled
                  entitySearchName
                  searchName
                  createdBy
                  createdAt
                  updatedAt
                  status
                }
                nextToken
              }
              gstRegistered
              providerEntityId
              providerCompanyId
              providerBillUserCompanyId
              providerBankAccountId
              providerDigitalWalletId
              providerBpayCrn
              contact {
                firstName
                lastName
                email
                phone
                role
              }
              paymentMethods {
                items {
                  id
                  paymentMethodType
                  type
                  fullName
                  number
                  expMonth
                  expYear
                  accountName
                  bankName
                  accountNumber
                  routingNumber
                  holderType
                  accountType
                  status
                  accountDirection
                  expiresAt
                  createdAt
                  updatedAt
                }
                nextToken
              }
              paymentMethodId
              paymentUserId
              disbursementMethodId
              receivingAccounts {
                items {
                  id
                  paymentMethodType
                  type
                  fullName
                  number
                  expMonth
                  expYear
                  accountName
                  bankName
                  accountNumber
                  routingNumber
                  holderType
                  accountType
                  status
                  accountDirection
                  expiresAt
                  createdAt
                  updatedAt
                }
                nextToken
              }
              ubosCreated
              numUbosCreated
              subCategory
              clientsStatus
              ocrEmail
              verificationStatus
              createdAt
              updatedAt
              owner
              referredBy
              xeroContactSyncStatus
              xeroLastContactSyncAt
              xeroInvoiceSyncStatus
              xeroLastInvoiceSyncAt
              xeroTenantId
            }
            searchName
            createdBy
            createdAt
            updatedAt
            status
          }
          nextToken
        }
        gstRegistered
        providerEntityId
        providerCompanyId
        providerBillUserCompanyId
        providerBankAccountId
        providerDigitalWalletId
        providerBpayCrn
        contact {
          firstName
          lastName
          email
          phone
          role
        }
        paymentMethods {
          items {
            id
            paymentMethodType
            type
            fullName
            number
            expMonth
            expYear
            accountName
            bankName
            accountNumber
            routingNumber
            holderType
            accountType
            status
            accountDirection
            expiresAt
            createdAt
            updatedAt
          }
          nextToken
        }
        paymentMethodId
        paymentUserId
        disbursementMethodId
        receivingAccounts {
          items {
            id
            paymentMethodType
            type
            fullName
            number
            expMonth
            expYear
            accountName
            bankName
            accountNumber
            routingNumber
            holderType
            accountType
            status
            accountDirection
            expiresAt
            createdAt
            updatedAt
          }
          nextToken
        }
        ubosCreated
        numUbosCreated
        subCategory
        clientsStatus
        ocrEmail
        verificationStatus
        createdAt
        updatedAt
        owner
        referredBy
        xeroContactSyncStatus
        xeroLastContactSyncAt
        xeroInvoiceSyncStatus
        xeroLastInvoiceSyncAt
        xeroTenantId
      }
      searchName
      createdBy
      createdAt
      updatedAt
      status
    }
  }
`;
export const createContact = /* GraphQL */ `
  mutation CreateContact($input: CreateContactInput!) {
    createContact(input: $input) {
      id
      entityId
      xeroTenantId
      entityType
      firstName
      lastName
      email
      mobile
      phone
      taxNumber
      companyNumber
      name
      legalName
      companyName
      searchName
      status
      createdAt
      updatedAt
      contactType
      bank {
        id
        accountName
        bankName
        accountNumber
        routingNumber
        holderType
        accountType
        country
      }
      bpay {
        billerCode
        referenceNumber
      }
      bulkUploadFileKey
      owner
    }
  }
`;
export const createContactBulkUpload = /* GraphQL */ `
  mutation CreateContactBulkUpload($input: CreateContactBulkImportInput!) {
    createContactBulkUpload(input: $input)
  }
`;
export const updateContact = /* GraphQL */ `
  mutation UpdateContact($input: UpdateContactInput!) {
    updateContact(input: $input) {
      id
      entityId
      xeroTenantId
      entityType
      firstName
      lastName
      email
      mobile
      phone
      taxNumber
      companyNumber
      name
      legalName
      companyName
      searchName
      status
      createdAt
      updatedAt
      contactType
      bank {
        id
        accountName
        bankName
        accountNumber
        routingNumber
        holderType
        accountType
        country
      }
      bpay {
        billerCode
        referenceNumber
      }
      bulkUploadFileKey
      owner
    }
  }
`;
export const createConversation = /* GraphQL */ `
  mutation CreateConversation(
    $input: CreateConversationInput!
    $condition: ModelConversationConditionInput
  ) {
    createConversation(input: $input, condition: $condition) {
      title
      image {
        alt
        identityId
        key
        level
        type
      }
      country
      messages {
        items {
          conversationId
          text
          attachments {
            identityId
            key
            level
            type
          }
          users
          receiver
          sender
          createdBy
          readBy
          createdAt
          updatedAt
          id
          conversationMessagesId
        }
        nextToken
      }
      userConversations {
        items {
          conversationId
          conversation {
            title
            image {
              alt
              identityId
              key
              level
              type
            }
            country
            messages {
              items {
                conversationId
                text
                attachments {
                  identityId
                  key
                  level
                  type
                }
                users
                receiver
                sender
                createdBy
                readBy
                createdAt
                updatedAt
                id
                conversationMessagesId
              }
              nextToken
            }
            userConversations {
              items {
                conversationId
                conversation {
                  title
                  country
                  users
                  readBy
                  createdBy
                  createdAt
                  updatedAt
                  id
                }
                userId
                user {
                  id
                  identityId
                  referralCode
                  referredBy
                  email
                  about
                  firstName
                  firmId
                  lastName
                  phone
                  blocked
                  blockedBy
                  country
                  interests
                  locale
                  onboardingStatus
                  onboardingEntity
                  selectedSignatureKey
                  userType
                  rating
                  reportReasons
                  paymentUserId
                  providerWalletId
                  providerNppCrn
                  ipAddress
                  createdAt
                  updatedAt
                  owner
                  loyaltyStatus
                  nextLoyaltyStatus
                  nextLoyaltyStatusPoint
                  statusPoint
                  pointsTotal
                  pointsBalance
                  invitedTo
                }
                users
                createdAt
                updatedAt
                id
                conversationUserConversationsId
              }
              nextToken
            }
            users
            readBy
            createdBy
            createdAt
            updatedAt
            id
          }
          userId
          user {
            id
            identityId
            referralCode
            referredBy
            email
            about
            firstName
            firmId
            lastName
            phone
            blocked
            blockedBy
            country
            profileImg {
              alt
              identityId
              key
              level
              type
            }
            interests
            locale
            onboardingStatus
            onboardingEntity
            selectedSignatureKey
            signatures {
              items {
                id
                userId
                key
                createdAt
                updatedAt
              }
              nextToken
            }
            userType
            rating
            reportReasons
            notificationPreferences {
              email
              push
              sms
            }
            paymentUserId
            providerWalletId
            providerNppCrn
            ipAddress
            createdAt
            updatedAt
            owner
            loyaltyStatus
            nextLoyaltyStatus
            nextLoyaltyStatusPoint
            statusPoint
            pointsTotal
            pointsBalance
            invitedTo
          }
          users
          createdAt
          updatedAt
          id
          conversationUserConversationsId
        }
        nextToken
      }
      users
      readBy
      createdBy
      createdAt
      updatedAt
      id
    }
  }
`;
export const updateConversation = /* GraphQL */ `
  mutation UpdateConversation(
    $input: UpdateConversationInput!
    $condition: ModelConversationConditionInput
  ) {
    updateConversation(input: $input, condition: $condition) {
      title
      image {
        alt
        identityId
        key
        level
        type
      }
      country
      messages {
        items {
          conversationId
          text
          attachments {
            identityId
            key
            level
            type
          }
          users
          receiver
          sender
          createdBy
          readBy
          createdAt
          updatedAt
          id
          conversationMessagesId
        }
        nextToken
      }
      userConversations {
        items {
          conversationId
          conversation {
            title
            image {
              alt
              identityId
              key
              level
              type
            }
            country
            messages {
              items {
                conversationId
                text
                attachments {
                  identityId
                  key
                  level
                  type
                }
                users
                receiver
                sender
                createdBy
                readBy
                createdAt
                updatedAt
                id
                conversationMessagesId
              }
              nextToken
            }
            userConversations {
              items {
                conversationId
                conversation {
                  title
                  country
                  users
                  readBy
                  createdBy
                  createdAt
                  updatedAt
                  id
                }
                userId
                user {
                  id
                  identityId
                  referralCode
                  referredBy
                  email
                  about
                  firstName
                  firmId
                  lastName
                  phone
                  blocked
                  blockedBy
                  country
                  interests
                  locale
                  onboardingStatus
                  onboardingEntity
                  selectedSignatureKey
                  userType
                  rating
                  reportReasons
                  paymentUserId
                  providerWalletId
                  providerNppCrn
                  ipAddress
                  createdAt
                  updatedAt
                  owner
                  loyaltyStatus
                  nextLoyaltyStatus
                  nextLoyaltyStatusPoint
                  statusPoint
                  pointsTotal
                  pointsBalance
                  invitedTo
                }
                users
                createdAt
                updatedAt
                id
                conversationUserConversationsId
              }
              nextToken
            }
            users
            readBy
            createdBy
            createdAt
            updatedAt
            id
          }
          userId
          user {
            id
            identityId
            referralCode
            referredBy
            email
            about
            firstName
            firmId
            lastName
            phone
            blocked
            blockedBy
            country
            profileImg {
              alt
              identityId
              key
              level
              type
            }
            interests
            locale
            onboardingStatus
            onboardingEntity
            selectedSignatureKey
            signatures {
              items {
                id
                userId
                key
                createdAt
                updatedAt
              }
              nextToken
            }
            userType
            rating
            reportReasons
            notificationPreferences {
              email
              push
              sms
            }
            paymentUserId
            providerWalletId
            providerNppCrn
            ipAddress
            createdAt
            updatedAt
            owner
            loyaltyStatus
            nextLoyaltyStatus
            nextLoyaltyStatusPoint
            statusPoint
            pointsTotal
            pointsBalance
            invitedTo
          }
          users
          createdAt
          updatedAt
          id
          conversationUserConversationsId
        }
        nextToken
      }
      users
      readBy
      createdBy
      createdAt
      updatedAt
      id
    }
  }
`;
export const deleteConversation = /* GraphQL */ `
  mutation DeleteConversation(
    $input: DeleteConversationInput!
    $condition: ModelConversationConditionInput
  ) {
    deleteConversation(input: $input, condition: $condition) {
      title
      image {
        alt
        identityId
        key
        level
        type
      }
      country
      messages {
        items {
          conversationId
          text
          attachments {
            identityId
            key
            level
            type
          }
          users
          receiver
          sender
          createdBy
          readBy
          createdAt
          updatedAt
          id
          conversationMessagesId
        }
        nextToken
      }
      userConversations {
        items {
          conversationId
          conversation {
            title
            image {
              alt
              identityId
              key
              level
              type
            }
            country
            messages {
              items {
                conversationId
                text
                attachments {
                  identityId
                  key
                  level
                  type
                }
                users
                receiver
                sender
                createdBy
                readBy
                createdAt
                updatedAt
                id
                conversationMessagesId
              }
              nextToken
            }
            userConversations {
              items {
                conversationId
                conversation {
                  title
                  country
                  users
                  readBy
                  createdBy
                  createdAt
                  updatedAt
                  id
                }
                userId
                user {
                  id
                  identityId
                  referralCode
                  referredBy
                  email
                  about
                  firstName
                  firmId
                  lastName
                  phone
                  blocked
                  blockedBy
                  country
                  interests
                  locale
                  onboardingStatus
                  onboardingEntity
                  selectedSignatureKey
                  userType
                  rating
                  reportReasons
                  paymentUserId
                  providerWalletId
                  providerNppCrn
                  ipAddress
                  createdAt
                  updatedAt
                  owner
                  loyaltyStatus
                  nextLoyaltyStatus
                  nextLoyaltyStatusPoint
                  statusPoint
                  pointsTotal
                  pointsBalance
                  invitedTo
                }
                users
                createdAt
                updatedAt
                id
                conversationUserConversationsId
              }
              nextToken
            }
            users
            readBy
            createdBy
            createdAt
            updatedAt
            id
          }
          userId
          user {
            id
            identityId
            referralCode
            referredBy
            email
            about
            firstName
            firmId
            lastName
            phone
            blocked
            blockedBy
            country
            profileImg {
              alt
              identityId
              key
              level
              type
            }
            interests
            locale
            onboardingStatus
            onboardingEntity
            selectedSignatureKey
            signatures {
              items {
                id
                userId
                key
                createdAt
                updatedAt
              }
              nextToken
            }
            userType
            rating
            reportReasons
            notificationPreferences {
              email
              push
              sms
            }
            paymentUserId
            providerWalletId
            providerNppCrn
            ipAddress
            createdAt
            updatedAt
            owner
            loyaltyStatus
            nextLoyaltyStatus
            nextLoyaltyStatusPoint
            statusPoint
            pointsTotal
            pointsBalance
            invitedTo
          }
          users
          createdAt
          updatedAt
          id
          conversationUserConversationsId
        }
        nextToken
      }
      users
      readBy
      createdBy
      createdAt
      updatedAt
      id
    }
  }
`;
export const createDocumentAnalysis = /* GraphQL */ `
  mutation CreateDocumentAnalysis($input: CreateDocumentAnalysisInput) {
    createDocumentAnalysis(input: $input) {
      id
      entityId
      fileKey
      status
      expenseStatus
      queryStatus
      matchedContactId
      matchedContact {
        id
        entityId
        xeroTenantId
        entityType
        firstName
        lastName
        email
        mobile
        phone
        taxNumber
        companyNumber
        name
        legalName
        companyName
        searchName
        status
        createdAt
        updatedAt
        contactType
        bank {
          id
          accountName
          bankName
          accountNumber
          routingNumber
          holderType
          accountType
          country
        }
        bpay {
          billerCode
          referenceNumber
        }
        bulkUploadFileKey
        owner
      }
      matchedEntityId
      matchedEntity {
        id
        type
        taxNumber
        companyNumber
        billerCode
        name
        legalName
        searchName
        address {
          addressId
          placeId
          contactName
          contactNumber
          addressFull
          address1
          address2
          unitNumber
          streetNumber
          streetName
          streetType
          city
          country
          countryCode
          state
          stateCode
          postalCode
        }
        logo {
          alt
          identityId
          key
          level
          type
        }
        entityBeneficialOwners {
          items {
            entityId
            beneficialOwnerId
            beneficialOwner {
              id
              firstName
              lastName
              name
              providerEntityId
              verificationStatus
              verificationAttempt
              createdBy
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
            owner
          }
          nextToken
        }
        entityUsers {
          items {
            id
            entityId
            userId
            invitedEmail
            referredBy
            invitedEntityId
            firmEntityId
            firstName
            lastName
            role
            paymentsEnabled
            entitySearchName
            entity {
              id
              type
              taxNumber
              companyNumber
              billerCode
              name
              legalName
              searchName
              address {
                addressId
                placeId
                contactName
                contactNumber
                addressFull
                address1
                address2
                unitNumber
                streetNumber
                streetName
                streetType
                city
                country
                countryCode
                state
                stateCode
                postalCode
              }
              logo {
                alt
                identityId
                key
                level
                type
              }
              entityBeneficialOwners {
                items {
                  entityId
                  beneficialOwnerId
                  createdAt
                  updatedAt
                  owner
                }
                nextToken
              }
              entityUsers {
                items {
                  id
                  entityId
                  userId
                  invitedEmail
                  referredBy
                  invitedEntityId
                  firmEntityId
                  firstName
                  lastName
                  role
                  paymentsEnabled
                  entitySearchName
                  searchName
                  createdBy
                  createdAt
                  updatedAt
                  status
                }
                nextToken
              }
              gstRegistered
              providerEntityId
              providerCompanyId
              providerBillUserCompanyId
              providerBankAccountId
              providerDigitalWalletId
              providerBpayCrn
              contact {
                firstName
                lastName
                email
                phone
                role
              }
              paymentMethods {
                items {
                  id
                  paymentMethodType
                  type
                  fullName
                  number
                  expMonth
                  expYear
                  accountName
                  bankName
                  accountNumber
                  routingNumber
                  holderType
                  accountType
                  status
                  accountDirection
                  expiresAt
                  createdAt
                  updatedAt
                }
                nextToken
              }
              paymentMethodId
              paymentUserId
              disbursementMethodId
              receivingAccounts {
                items {
                  id
                  paymentMethodType
                  type
                  fullName
                  number
                  expMonth
                  expYear
                  accountName
                  bankName
                  accountNumber
                  routingNumber
                  holderType
                  accountType
                  status
                  accountDirection
                  expiresAt
                  createdAt
                  updatedAt
                }
                nextToken
              }
              ubosCreated
              numUbosCreated
              subCategory
              clientsStatus
              ocrEmail
              verificationStatus
              createdAt
              updatedAt
              owner
              referredBy
              xeroContactSyncStatus
              xeroLastContactSyncAt
              xeroInvoiceSyncStatus
              xeroLastInvoiceSyncAt
              xeroTenantId
            }
            searchName
            createdBy
            createdAt
            updatedAt
            status
          }
          nextToken
        }
        gstRegistered
        providerEntityId
        providerCompanyId
        providerBillUserCompanyId
        providerBankAccountId
        providerDigitalWalletId
        providerBpayCrn
        contact {
          firstName
          lastName
          email
          phone
          role
        }
        paymentMethods {
          items {
            id
            paymentMethodType
            type
            fullName
            number
            expMonth
            expYear
            accountName
            bankName
            accountNumber
            routingNumber
            holderType
            accountType
            status
            accountDirection
            expiresAt
            createdAt
            updatedAt
          }
          nextToken
        }
        paymentMethodId
        paymentUserId
        disbursementMethodId
        receivingAccounts {
          items {
            id
            paymentMethodType
            type
            fullName
            number
            expMonth
            expYear
            accountName
            bankName
            accountNumber
            routingNumber
            holderType
            accountType
            status
            accountDirection
            expiresAt
            createdAt
            updatedAt
          }
          nextToken
        }
        ubosCreated
        numUbosCreated
        subCategory
        clientsStatus
        ocrEmail
        verificationStatus
        createdAt
        updatedAt
        owner
        referredBy
        xeroContactSyncStatus
        xeroLastContactSyncAt
        xeroInvoiceSyncStatus
        xeroLastInvoiceSyncAt
        xeroTenantId
      }
      newContact {
        firstName
        lastName
        email
        phone
        companyName
        taxNumber
      }
      task {
        reference
        dueAt
        gstInclusive
        notes
        amount
        gstAmount
        lineItems {
          description
          quantity
          unitPrice
          price
          productCode
        }
        numberOfPayments
        paymentFrequency
        shippingAmount
      }
      bpay {
        billerCode
        referenceNumber
      }
      bank {
        accountNumber
        routingNumber
      }
      source
      createdBy
      createdAt
      updatedAt
    }
  }
`;
export const updateDocumentAnalysis = /* GraphQL */ `
  mutation UpdateDocumentAnalysis($input: UpdateDocumentAnalysisInput) {
    updateDocumentAnalysis(input: $input) {
      id
      entityId
      fileKey
      status
      expenseStatus
      queryStatus
      matchedContactId
      matchedContact {
        id
        entityId
        xeroTenantId
        entityType
        firstName
        lastName
        email
        mobile
        phone
        taxNumber
        companyNumber
        name
        legalName
        companyName
        searchName
        status
        createdAt
        updatedAt
        contactType
        bank {
          id
          accountName
          bankName
          accountNumber
          routingNumber
          holderType
          accountType
          country
        }
        bpay {
          billerCode
          referenceNumber
        }
        bulkUploadFileKey
        owner
      }
      matchedEntityId
      matchedEntity {
        id
        type
        taxNumber
        companyNumber
        billerCode
        name
        legalName
        searchName
        address {
          addressId
          placeId
          contactName
          contactNumber
          addressFull
          address1
          address2
          unitNumber
          streetNumber
          streetName
          streetType
          city
          country
          countryCode
          state
          stateCode
          postalCode
        }
        logo {
          alt
          identityId
          key
          level
          type
        }
        entityBeneficialOwners {
          items {
            entityId
            beneficialOwnerId
            beneficialOwner {
              id
              firstName
              lastName
              name
              providerEntityId
              verificationStatus
              verificationAttempt
              createdBy
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
            owner
          }
          nextToken
        }
        entityUsers {
          items {
            id
            entityId
            userId
            invitedEmail
            referredBy
            invitedEntityId
            firmEntityId
            firstName
            lastName
            role
            paymentsEnabled
            entitySearchName
            entity {
              id
              type
              taxNumber
              companyNumber
              billerCode
              name
              legalName
              searchName
              address {
                addressId
                placeId
                contactName
                contactNumber
                addressFull
                address1
                address2
                unitNumber
                streetNumber
                streetName
                streetType
                city
                country
                countryCode
                state
                stateCode
                postalCode
              }
              logo {
                alt
                identityId
                key
                level
                type
              }
              entityBeneficialOwners {
                items {
                  entityId
                  beneficialOwnerId
                  createdAt
                  updatedAt
                  owner
                }
                nextToken
              }
              entityUsers {
                items {
                  id
                  entityId
                  userId
                  invitedEmail
                  referredBy
                  invitedEntityId
                  firmEntityId
                  firstName
                  lastName
                  role
                  paymentsEnabled
                  entitySearchName
                  searchName
                  createdBy
                  createdAt
                  updatedAt
                  status
                }
                nextToken
              }
              gstRegistered
              providerEntityId
              providerCompanyId
              providerBillUserCompanyId
              providerBankAccountId
              providerDigitalWalletId
              providerBpayCrn
              contact {
                firstName
                lastName
                email
                phone
                role
              }
              paymentMethods {
                items {
                  id
                  paymentMethodType
                  type
                  fullName
                  number
                  expMonth
                  expYear
                  accountName
                  bankName
                  accountNumber
                  routingNumber
                  holderType
                  accountType
                  status
                  accountDirection
                  expiresAt
                  createdAt
                  updatedAt
                }
                nextToken
              }
              paymentMethodId
              paymentUserId
              disbursementMethodId
              receivingAccounts {
                items {
                  id
                  paymentMethodType
                  type
                  fullName
                  number
                  expMonth
                  expYear
                  accountName
                  bankName
                  accountNumber
                  routingNumber
                  holderType
                  accountType
                  status
                  accountDirection
                  expiresAt
                  createdAt
                  updatedAt
                }
                nextToken
              }
              ubosCreated
              numUbosCreated
              subCategory
              clientsStatus
              ocrEmail
              verificationStatus
              createdAt
              updatedAt
              owner
              referredBy
              xeroContactSyncStatus
              xeroLastContactSyncAt
              xeroInvoiceSyncStatus
              xeroLastInvoiceSyncAt
              xeroTenantId
            }
            searchName
            createdBy
            createdAt
            updatedAt
            status
          }
          nextToken
        }
        gstRegistered
        providerEntityId
        providerCompanyId
        providerBillUserCompanyId
        providerBankAccountId
        providerDigitalWalletId
        providerBpayCrn
        contact {
          firstName
          lastName
          email
          phone
          role
        }
        paymentMethods {
          items {
            id
            paymentMethodType
            type
            fullName
            number
            expMonth
            expYear
            accountName
            bankName
            accountNumber
            routingNumber
            holderType
            accountType
            status
            accountDirection
            expiresAt
            createdAt
            updatedAt
          }
          nextToken
        }
        paymentMethodId
        paymentUserId
        disbursementMethodId
        receivingAccounts {
          items {
            id
            paymentMethodType
            type
            fullName
            number
            expMonth
            expYear
            accountName
            bankName
            accountNumber
            routingNumber
            holderType
            accountType
            status
            accountDirection
            expiresAt
            createdAt
            updatedAt
          }
          nextToken
        }
        ubosCreated
        numUbosCreated
        subCategory
        clientsStatus
        ocrEmail
        verificationStatus
        createdAt
        updatedAt
        owner
        referredBy
        xeroContactSyncStatus
        xeroLastContactSyncAt
        xeroInvoiceSyncStatus
        xeroLastInvoiceSyncAt
        xeroTenantId
      }
      newContact {
        firstName
        lastName
        email
        phone
        companyName
        taxNumber
      }
      task {
        reference
        dueAt
        gstInclusive
        notes
        amount
        gstAmount
        lineItems {
          description
          quantity
          unitPrice
          price
          productCode
        }
        numberOfPayments
        paymentFrequency
        shippingAmount
      }
      bpay {
        billerCode
        referenceNumber
      }
      bank {
        accountNumber
        routingNumber
      }
      source
      createdBy
      createdAt
      updatedAt
    }
  }
`;
export const createEntity = /* GraphQL */ `
  mutation CreateEntity($input: CreateEntityInput!) {
    createEntity(input: $input) {
      id
      type
      taxNumber
      companyNumber
      billerCode
      name
      legalName
      searchName
      address {
        addressId
        placeId
        contactName
        contactNumber
        addressFull
        address1
        address2
        unitNumber
        streetNumber
        streetName
        streetType
        city
        country
        countryCode
        state
        stateCode
        postalCode
      }
      logo {
        alt
        identityId
        key
        level
        type
      }
      entityBeneficialOwners {
        items {
          entityId
          beneficialOwnerId
          beneficialOwner {
            id
            firstName
            lastName
            name
            providerEntityId
            verificationStatus
            verificationAttempt
            createdBy
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      entityUsers {
        items {
          id
          entityId
          userId
          invitedEmail
          referredBy
          invitedEntityId
          firmEntityId
          firstName
          lastName
          role
          paymentsEnabled
          entitySearchName
          entity {
            id
            type
            taxNumber
            companyNumber
            billerCode
            name
            legalName
            searchName
            address {
              addressId
              placeId
              contactName
              contactNumber
              addressFull
              address1
              address2
              unitNumber
              streetNumber
              streetName
              streetType
              city
              country
              countryCode
              state
              stateCode
              postalCode
            }
            logo {
              alt
              identityId
              key
              level
              type
            }
            entityBeneficialOwners {
              items {
                entityId
                beneficialOwnerId
                beneficialOwner {
                  id
                  firstName
                  lastName
                  name
                  providerEntityId
                  verificationStatus
                  verificationAttempt
                  createdBy
                  createdAt
                  updatedAt
                }
                createdAt
                updatedAt
                owner
              }
              nextToken
            }
            entityUsers {
              items {
                id
                entityId
                userId
                invitedEmail
                referredBy
                invitedEntityId
                firmEntityId
                firstName
                lastName
                role
                paymentsEnabled
                entitySearchName
                entity {
                  id
                  type
                  taxNumber
                  companyNumber
                  billerCode
                  name
                  legalName
                  searchName
                  gstRegistered
                  providerEntityId
                  providerCompanyId
                  providerBillUserCompanyId
                  providerBankAccountId
                  providerDigitalWalletId
                  providerBpayCrn
                  paymentMethodId
                  paymentUserId
                  disbursementMethodId
                  ubosCreated
                  numUbosCreated
                  subCategory
                  clientsStatus
                  ocrEmail
                  verificationStatus
                  createdAt
                  updatedAt
                  owner
                  referredBy
                  xeroContactSyncStatus
                  xeroLastContactSyncAt
                  xeroInvoiceSyncStatus
                  xeroLastInvoiceSyncAt
                  xeroTenantId
                }
                searchName
                createdBy
                createdAt
                updatedAt
                status
              }
              nextToken
            }
            gstRegistered
            providerEntityId
            providerCompanyId
            providerBillUserCompanyId
            providerBankAccountId
            providerDigitalWalletId
            providerBpayCrn
            contact {
              firstName
              lastName
              email
              phone
              role
            }
            paymentMethods {
              items {
                id
                paymentMethodType
                type
                fullName
                number
                expMonth
                expYear
                accountName
                bankName
                accountNumber
                routingNumber
                holderType
                accountType
                status
                accountDirection
                expiresAt
                createdAt
                updatedAt
              }
              nextToken
            }
            paymentMethodId
            paymentUserId
            disbursementMethodId
            receivingAccounts {
              items {
                id
                paymentMethodType
                type
                fullName
                number
                expMonth
                expYear
                accountName
                bankName
                accountNumber
                routingNumber
                holderType
                accountType
                status
                accountDirection
                expiresAt
                createdAt
                updatedAt
              }
              nextToken
            }
            ubosCreated
            numUbosCreated
            subCategory
            clientsStatus
            ocrEmail
            verificationStatus
            createdAt
            updatedAt
            owner
            referredBy
            xeroContactSyncStatus
            xeroLastContactSyncAt
            xeroInvoiceSyncStatus
            xeroLastInvoiceSyncAt
            xeroTenantId
          }
          searchName
          createdBy
          createdAt
          updatedAt
          status
        }
        nextToken
      }
      gstRegistered
      providerEntityId
      providerCompanyId
      providerBillUserCompanyId
      providerBankAccountId
      providerDigitalWalletId
      providerBpayCrn
      contact {
        firstName
        lastName
        email
        phone
        role
      }
      paymentMethods {
        items {
          id
          paymentMethodType
          type
          fullName
          number
          expMonth
          expYear
          accountName
          bankName
          accountNumber
          routingNumber
          holderType
          accountType
          status
          accountDirection
          expiresAt
          createdAt
          updatedAt
        }
        nextToken
      }
      paymentMethodId
      paymentUserId
      disbursementMethodId
      receivingAccounts {
        items {
          id
          paymentMethodType
          type
          fullName
          number
          expMonth
          expYear
          accountName
          bankName
          accountNumber
          routingNumber
          holderType
          accountType
          status
          accountDirection
          expiresAt
          createdAt
          updatedAt
        }
        nextToken
      }
      ubosCreated
      numUbosCreated
      subCategory
      clientsStatus
      ocrEmail
      verificationStatus
      createdAt
      updatedAt
      owner
      referredBy
      xeroContactSyncStatus
      xeroLastContactSyncAt
      xeroInvoiceSyncStatus
      xeroLastInvoiceSyncAt
      xeroTenantId
    }
  }
`;
export const updateEntity = /* GraphQL */ `
  mutation UpdateEntity($input: UpdateEntityInput!) {
    updateEntity(input: $input) {
      id
      type
      taxNumber
      companyNumber
      billerCode
      name
      legalName
      searchName
      address {
        addressId
        placeId
        contactName
        contactNumber
        addressFull
        address1
        address2
        unitNumber
        streetNumber
        streetName
        streetType
        city
        country
        countryCode
        state
        stateCode
        postalCode
      }
      logo {
        alt
        identityId
        key
        level
        type
      }
      entityBeneficialOwners {
        items {
          entityId
          beneficialOwnerId
          beneficialOwner {
            id
            firstName
            lastName
            name
            providerEntityId
            verificationStatus
            verificationAttempt
            createdBy
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      entityUsers {
        items {
          id
          entityId
          userId
          invitedEmail
          referredBy
          invitedEntityId
          firmEntityId
          firstName
          lastName
          role
          paymentsEnabled
          entitySearchName
          entity {
            id
            type
            taxNumber
            companyNumber
            billerCode
            name
            legalName
            searchName
            address {
              addressId
              placeId
              contactName
              contactNumber
              addressFull
              address1
              address2
              unitNumber
              streetNumber
              streetName
              streetType
              city
              country
              countryCode
              state
              stateCode
              postalCode
            }
            logo {
              alt
              identityId
              key
              level
              type
            }
            entityBeneficialOwners {
              items {
                entityId
                beneficialOwnerId
                beneficialOwner {
                  id
                  firstName
                  lastName
                  name
                  providerEntityId
                  verificationStatus
                  verificationAttempt
                  createdBy
                  createdAt
                  updatedAt
                }
                createdAt
                updatedAt
                owner
              }
              nextToken
            }
            entityUsers {
              items {
                id
                entityId
                userId
                invitedEmail
                referredBy
                invitedEntityId
                firmEntityId
                firstName
                lastName
                role
                paymentsEnabled
                entitySearchName
                entity {
                  id
                  type
                  taxNumber
                  companyNumber
                  billerCode
                  name
                  legalName
                  searchName
                  gstRegistered
                  providerEntityId
                  providerCompanyId
                  providerBillUserCompanyId
                  providerBankAccountId
                  providerDigitalWalletId
                  providerBpayCrn
                  paymentMethodId
                  paymentUserId
                  disbursementMethodId
                  ubosCreated
                  numUbosCreated
                  subCategory
                  clientsStatus
                  ocrEmail
                  verificationStatus
                  createdAt
                  updatedAt
                  owner
                  referredBy
                  xeroContactSyncStatus
                  xeroLastContactSyncAt
                  xeroInvoiceSyncStatus
                  xeroLastInvoiceSyncAt
                  xeroTenantId
                }
                searchName
                createdBy
                createdAt
                updatedAt
                status
              }
              nextToken
            }
            gstRegistered
            providerEntityId
            providerCompanyId
            providerBillUserCompanyId
            providerBankAccountId
            providerDigitalWalletId
            providerBpayCrn
            contact {
              firstName
              lastName
              email
              phone
              role
            }
            paymentMethods {
              items {
                id
                paymentMethodType
                type
                fullName
                number
                expMonth
                expYear
                accountName
                bankName
                accountNumber
                routingNumber
                holderType
                accountType
                status
                accountDirection
                expiresAt
                createdAt
                updatedAt
              }
              nextToken
            }
            paymentMethodId
            paymentUserId
            disbursementMethodId
            receivingAccounts {
              items {
                id
                paymentMethodType
                type
                fullName
                number
                expMonth
                expYear
                accountName
                bankName
                accountNumber
                routingNumber
                holderType
                accountType
                status
                accountDirection
                expiresAt
                createdAt
                updatedAt
              }
              nextToken
            }
            ubosCreated
            numUbosCreated
            subCategory
            clientsStatus
            ocrEmail
            verificationStatus
            createdAt
            updatedAt
            owner
            referredBy
            xeroContactSyncStatus
            xeroLastContactSyncAt
            xeroInvoiceSyncStatus
            xeroLastInvoiceSyncAt
            xeroTenantId
          }
          searchName
          createdBy
          createdAt
          updatedAt
          status
        }
        nextToken
      }
      gstRegistered
      providerEntityId
      providerCompanyId
      providerBillUserCompanyId
      providerBankAccountId
      providerDigitalWalletId
      providerBpayCrn
      contact {
        firstName
        lastName
        email
        phone
        role
      }
      paymentMethods {
        items {
          id
          paymentMethodType
          type
          fullName
          number
          expMonth
          expYear
          accountName
          bankName
          accountNumber
          routingNumber
          holderType
          accountType
          status
          accountDirection
          expiresAt
          createdAt
          updatedAt
        }
        nextToken
      }
      paymentMethodId
      paymentUserId
      disbursementMethodId
      receivingAccounts {
        items {
          id
          paymentMethodType
          type
          fullName
          number
          expMonth
          expYear
          accountName
          bankName
          accountNumber
          routingNumber
          holderType
          accountType
          status
          accountDirection
          expiresAt
          createdAt
          updatedAt
        }
        nextToken
      }
      ubosCreated
      numUbosCreated
      subCategory
      clientsStatus
      ocrEmail
      verificationStatus
      createdAt
      updatedAt
      owner
      referredBy
      xeroContactSyncStatus
      xeroLastContactSyncAt
      xeroInvoiceSyncStatus
      xeroLastInvoiceSyncAt
      xeroTenantId
    }
  }
`;
export const regenerateEntityOcrEmail = /* GraphQL */ `
  mutation RegenerateEntityOcrEmail($input: RegenerateEntityOcrEmailInput!) {
    regenerateEntityOcrEmail(input: $input) {
      id
      type
      taxNumber
      companyNumber
      billerCode
      name
      legalName
      searchName
      address {
        addressId
        placeId
        contactName
        contactNumber
        addressFull
        address1
        address2
        unitNumber
        streetNumber
        streetName
        streetType
        city
        country
        countryCode
        state
        stateCode
        postalCode
      }
      logo {
        alt
        identityId
        key
        level
        type
      }
      entityBeneficialOwners {
        items {
          entityId
          beneficialOwnerId
          beneficialOwner {
            id
            firstName
            lastName
            name
            providerEntityId
            verificationStatus
            verificationAttempt
            createdBy
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      entityUsers {
        items {
          id
          entityId
          userId
          invitedEmail
          referredBy
          invitedEntityId
          firmEntityId
          firstName
          lastName
          role
          paymentsEnabled
          entitySearchName
          entity {
            id
            type
            taxNumber
            companyNumber
            billerCode
            name
            legalName
            searchName
            address {
              addressId
              placeId
              contactName
              contactNumber
              addressFull
              address1
              address2
              unitNumber
              streetNumber
              streetName
              streetType
              city
              country
              countryCode
              state
              stateCode
              postalCode
            }
            logo {
              alt
              identityId
              key
              level
              type
            }
            entityBeneficialOwners {
              items {
                entityId
                beneficialOwnerId
                beneficialOwner {
                  id
                  firstName
                  lastName
                  name
                  providerEntityId
                  verificationStatus
                  verificationAttempt
                  createdBy
                  createdAt
                  updatedAt
                }
                createdAt
                updatedAt
                owner
              }
              nextToken
            }
            entityUsers {
              items {
                id
                entityId
                userId
                invitedEmail
                referredBy
                invitedEntityId
                firmEntityId
                firstName
                lastName
                role
                paymentsEnabled
                entitySearchName
                entity {
                  id
                  type
                  taxNumber
                  companyNumber
                  billerCode
                  name
                  legalName
                  searchName
                  gstRegistered
                  providerEntityId
                  providerCompanyId
                  providerBillUserCompanyId
                  providerBankAccountId
                  providerDigitalWalletId
                  providerBpayCrn
                  paymentMethodId
                  paymentUserId
                  disbursementMethodId
                  ubosCreated
                  numUbosCreated
                  subCategory
                  clientsStatus
                  ocrEmail
                  verificationStatus
                  createdAt
                  updatedAt
                  owner
                  referredBy
                  xeroContactSyncStatus
                  xeroLastContactSyncAt
                  xeroInvoiceSyncStatus
                  xeroLastInvoiceSyncAt
                  xeroTenantId
                }
                searchName
                createdBy
                createdAt
                updatedAt
                status
              }
              nextToken
            }
            gstRegistered
            providerEntityId
            providerCompanyId
            providerBillUserCompanyId
            providerBankAccountId
            providerDigitalWalletId
            providerBpayCrn
            contact {
              firstName
              lastName
              email
              phone
              role
            }
            paymentMethods {
              items {
                id
                paymentMethodType
                type
                fullName
                number
                expMonth
                expYear
                accountName
                bankName
                accountNumber
                routingNumber
                holderType
                accountType
                status
                accountDirection
                expiresAt
                createdAt
                updatedAt
              }
              nextToken
            }
            paymentMethodId
            paymentUserId
            disbursementMethodId
            receivingAccounts {
              items {
                id
                paymentMethodType
                type
                fullName
                number
                expMonth
                expYear
                accountName
                bankName
                accountNumber
                routingNumber
                holderType
                accountType
                status
                accountDirection
                expiresAt
                createdAt
                updatedAt
              }
              nextToken
            }
            ubosCreated
            numUbosCreated
            subCategory
            clientsStatus
            ocrEmail
            verificationStatus
            createdAt
            updatedAt
            owner
            referredBy
            xeroContactSyncStatus
            xeroLastContactSyncAt
            xeroInvoiceSyncStatus
            xeroLastInvoiceSyncAt
            xeroTenantId
          }
          searchName
          createdBy
          createdAt
          updatedAt
          status
        }
        nextToken
      }
      gstRegistered
      providerEntityId
      providerCompanyId
      providerBillUserCompanyId
      providerBankAccountId
      providerDigitalWalletId
      providerBpayCrn
      contact {
        firstName
        lastName
        email
        phone
        role
      }
      paymentMethods {
        items {
          id
          paymentMethodType
          type
          fullName
          number
          expMonth
          expYear
          accountName
          bankName
          accountNumber
          routingNumber
          holderType
          accountType
          status
          accountDirection
          expiresAt
          createdAt
          updatedAt
        }
        nextToken
      }
      paymentMethodId
      paymentUserId
      disbursementMethodId
      receivingAccounts {
        items {
          id
          paymentMethodType
          type
          fullName
          number
          expMonth
          expYear
          accountName
          bankName
          accountNumber
          routingNumber
          holderType
          accountType
          status
          accountDirection
          expiresAt
          createdAt
          updatedAt
        }
        nextToken
      }
      ubosCreated
      numUbosCreated
      subCategory
      clientsStatus
      ocrEmail
      verificationStatus
      createdAt
      updatedAt
      owner
      referredBy
      xeroContactSyncStatus
      xeroLastContactSyncAt
      xeroInvoiceSyncStatus
      xeroLastInvoiceSyncAt
      xeroTenantId
    }
  }
`;
export const deleteEntity = /* GraphQL */ `
  mutation DeleteEntity(
    $input: DeleteEntityInput!
    $condition: ModelEntityConditionInput
  ) {
    deleteEntity(input: $input, condition: $condition) {
      id
      type
      taxNumber
      companyNumber
      billerCode
      name
      legalName
      searchName
      address {
        addressId
        placeId
        contactName
        contactNumber
        addressFull
        address1
        address2
        unitNumber
        streetNumber
        streetName
        streetType
        city
        country
        countryCode
        state
        stateCode
        postalCode
      }
      logo {
        alt
        identityId
        key
        level
        type
      }
      entityBeneficialOwners {
        items {
          entityId
          beneficialOwnerId
          beneficialOwner {
            id
            firstName
            lastName
            name
            providerEntityId
            verificationStatus
            verificationAttempt
            createdBy
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      entityUsers {
        items {
          id
          entityId
          userId
          invitedEmail
          referredBy
          invitedEntityId
          firmEntityId
          firstName
          lastName
          role
          paymentsEnabled
          entitySearchName
          entity {
            id
            type
            taxNumber
            companyNumber
            billerCode
            name
            legalName
            searchName
            address {
              addressId
              placeId
              contactName
              contactNumber
              addressFull
              address1
              address2
              unitNumber
              streetNumber
              streetName
              streetType
              city
              country
              countryCode
              state
              stateCode
              postalCode
            }
            logo {
              alt
              identityId
              key
              level
              type
            }
            entityBeneficialOwners {
              items {
                entityId
                beneficialOwnerId
                beneficialOwner {
                  id
                  firstName
                  lastName
                  name
                  providerEntityId
                  verificationStatus
                  verificationAttempt
                  createdBy
                  createdAt
                  updatedAt
                }
                createdAt
                updatedAt
                owner
              }
              nextToken
            }
            entityUsers {
              items {
                id
                entityId
                userId
                invitedEmail
                referredBy
                invitedEntityId
                firmEntityId
                firstName
                lastName
                role
                paymentsEnabled
                entitySearchName
                entity {
                  id
                  type
                  taxNumber
                  companyNumber
                  billerCode
                  name
                  legalName
                  searchName
                  gstRegistered
                  providerEntityId
                  providerCompanyId
                  providerBillUserCompanyId
                  providerBankAccountId
                  providerDigitalWalletId
                  providerBpayCrn
                  paymentMethodId
                  paymentUserId
                  disbursementMethodId
                  ubosCreated
                  numUbosCreated
                  subCategory
                  clientsStatus
                  ocrEmail
                  verificationStatus
                  createdAt
                  updatedAt
                  owner
                  referredBy
                  xeroContactSyncStatus
                  xeroLastContactSyncAt
                  xeroInvoiceSyncStatus
                  xeroLastInvoiceSyncAt
                  xeroTenantId
                }
                searchName
                createdBy
                createdAt
                updatedAt
                status
              }
              nextToken
            }
            gstRegistered
            providerEntityId
            providerCompanyId
            providerBillUserCompanyId
            providerBankAccountId
            providerDigitalWalletId
            providerBpayCrn
            contact {
              firstName
              lastName
              email
              phone
              role
            }
            paymentMethods {
              items {
                id
                paymentMethodType
                type
                fullName
                number
                expMonth
                expYear
                accountName
                bankName
                accountNumber
                routingNumber
                holderType
                accountType
                status
                accountDirection
                expiresAt
                createdAt
                updatedAt
              }
              nextToken
            }
            paymentMethodId
            paymentUserId
            disbursementMethodId
            receivingAccounts {
              items {
                id
                paymentMethodType
                type
                fullName
                number
                expMonth
                expYear
                accountName
                bankName
                accountNumber
                routingNumber
                holderType
                accountType
                status
                accountDirection
                expiresAt
                createdAt
                updatedAt
              }
              nextToken
            }
            ubosCreated
            numUbosCreated
            subCategory
            clientsStatus
            ocrEmail
            verificationStatus
            createdAt
            updatedAt
            owner
            referredBy
            xeroContactSyncStatus
            xeroLastContactSyncAt
            xeroInvoiceSyncStatus
            xeroLastInvoiceSyncAt
            xeroTenantId
          }
          searchName
          createdBy
          createdAt
          updatedAt
          status
        }
        nextToken
      }
      gstRegistered
      providerEntityId
      providerCompanyId
      providerBillUserCompanyId
      providerBankAccountId
      providerDigitalWalletId
      providerBpayCrn
      contact {
        firstName
        lastName
        email
        phone
        role
      }
      paymentMethods {
        items {
          id
          paymentMethodType
          type
          fullName
          number
          expMonth
          expYear
          accountName
          bankName
          accountNumber
          routingNumber
          holderType
          accountType
          status
          accountDirection
          expiresAt
          createdAt
          updatedAt
        }
        nextToken
      }
      paymentMethodId
      paymentUserId
      disbursementMethodId
      receivingAccounts {
        items {
          id
          paymentMethodType
          type
          fullName
          number
          expMonth
          expYear
          accountName
          bankName
          accountNumber
          routingNumber
          holderType
          accountType
          status
          accountDirection
          expiresAt
          createdAt
          updatedAt
        }
        nextToken
      }
      ubosCreated
      numUbosCreated
      subCategory
      clientsStatus
      ocrEmail
      verificationStatus
      createdAt
      updatedAt
      owner
      referredBy
      xeroContactSyncStatus
      xeroLastContactSyncAt
      xeroInvoiceSyncStatus
      xeroLastInvoiceSyncAt
      xeroTenantId
    }
  }
`;
export const createEntityUser = /* GraphQL */ `
  mutation CreateEntityUser($input: CreateEntityUserInput!) {
    createEntityUser(input: $input) {
      id
      entityId
      userId
      invitedEmail
      referredBy
      invitedEntityId
      firmEntityId
      firstName
      lastName
      role
      paymentsEnabled
      entitySearchName
      entity {
        id
        type
        taxNumber
        companyNumber
        billerCode
        name
        legalName
        searchName
        address {
          addressId
          placeId
          contactName
          contactNumber
          addressFull
          address1
          address2
          unitNumber
          streetNumber
          streetName
          streetType
          city
          country
          countryCode
          state
          stateCode
          postalCode
        }
        logo {
          alt
          identityId
          key
          level
          type
        }
        entityBeneficialOwners {
          items {
            entityId
            beneficialOwnerId
            beneficialOwner {
              id
              firstName
              lastName
              name
              providerEntityId
              verificationStatus
              verificationAttempt
              createdBy
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
            owner
          }
          nextToken
        }
        entityUsers {
          items {
            id
            entityId
            userId
            invitedEmail
            referredBy
            invitedEntityId
            firmEntityId
            firstName
            lastName
            role
            paymentsEnabled
            entitySearchName
            entity {
              id
              type
              taxNumber
              companyNumber
              billerCode
              name
              legalName
              searchName
              address {
                addressId
                placeId
                contactName
                contactNumber
                addressFull
                address1
                address2
                unitNumber
                streetNumber
                streetName
                streetType
                city
                country
                countryCode
                state
                stateCode
                postalCode
              }
              logo {
                alt
                identityId
                key
                level
                type
              }
              entityBeneficialOwners {
                items {
                  entityId
                  beneficialOwnerId
                  createdAt
                  updatedAt
                  owner
                }
                nextToken
              }
              entityUsers {
                items {
                  id
                  entityId
                  userId
                  invitedEmail
                  referredBy
                  invitedEntityId
                  firmEntityId
                  firstName
                  lastName
                  role
                  paymentsEnabled
                  entitySearchName
                  searchName
                  createdBy
                  createdAt
                  updatedAt
                  status
                }
                nextToken
              }
              gstRegistered
              providerEntityId
              providerCompanyId
              providerBillUserCompanyId
              providerBankAccountId
              providerDigitalWalletId
              providerBpayCrn
              contact {
                firstName
                lastName
                email
                phone
                role
              }
              paymentMethods {
                items {
                  id
                  paymentMethodType
                  type
                  fullName
                  number
                  expMonth
                  expYear
                  accountName
                  bankName
                  accountNumber
                  routingNumber
                  holderType
                  accountType
                  status
                  accountDirection
                  expiresAt
                  createdAt
                  updatedAt
                }
                nextToken
              }
              paymentMethodId
              paymentUserId
              disbursementMethodId
              receivingAccounts {
                items {
                  id
                  paymentMethodType
                  type
                  fullName
                  number
                  expMonth
                  expYear
                  accountName
                  bankName
                  accountNumber
                  routingNumber
                  holderType
                  accountType
                  status
                  accountDirection
                  expiresAt
                  createdAt
                  updatedAt
                }
                nextToken
              }
              ubosCreated
              numUbosCreated
              subCategory
              clientsStatus
              ocrEmail
              verificationStatus
              createdAt
              updatedAt
              owner
              referredBy
              xeroContactSyncStatus
              xeroLastContactSyncAt
              xeroInvoiceSyncStatus
              xeroLastInvoiceSyncAt
              xeroTenantId
            }
            searchName
            createdBy
            createdAt
            updatedAt
            status
          }
          nextToken
        }
        gstRegistered
        providerEntityId
        providerCompanyId
        providerBillUserCompanyId
        providerBankAccountId
        providerDigitalWalletId
        providerBpayCrn
        contact {
          firstName
          lastName
          email
          phone
          role
        }
        paymentMethods {
          items {
            id
            paymentMethodType
            type
            fullName
            number
            expMonth
            expYear
            accountName
            bankName
            accountNumber
            routingNumber
            holderType
            accountType
            status
            accountDirection
            expiresAt
            createdAt
            updatedAt
          }
          nextToken
        }
        paymentMethodId
        paymentUserId
        disbursementMethodId
        receivingAccounts {
          items {
            id
            paymentMethodType
            type
            fullName
            number
            expMonth
            expYear
            accountName
            bankName
            accountNumber
            routingNumber
            holderType
            accountType
            status
            accountDirection
            expiresAt
            createdAt
            updatedAt
          }
          nextToken
        }
        ubosCreated
        numUbosCreated
        subCategory
        clientsStatus
        ocrEmail
        verificationStatus
        createdAt
        updatedAt
        owner
        referredBy
        xeroContactSyncStatus
        xeroLastContactSyncAt
        xeroInvoiceSyncStatus
        xeroLastInvoiceSyncAt
        xeroTenantId
      }
      searchName
      createdBy
      createdAt
      updatedAt
      status
    }
  }
`;
export const updateEntityUser = /* GraphQL */ `
  mutation UpdateEntityUser($input: UpdateEntityUserInput!) {
    updateEntityUser(input: $input) {
      id
      entityId
      userId
      invitedEmail
      referredBy
      invitedEntityId
      firmEntityId
      firstName
      lastName
      role
      paymentsEnabled
      entitySearchName
      entity {
        id
        type
        taxNumber
        companyNumber
        billerCode
        name
        legalName
        searchName
        address {
          addressId
          placeId
          contactName
          contactNumber
          addressFull
          address1
          address2
          unitNumber
          streetNumber
          streetName
          streetType
          city
          country
          countryCode
          state
          stateCode
          postalCode
        }
        logo {
          alt
          identityId
          key
          level
          type
        }
        entityBeneficialOwners {
          items {
            entityId
            beneficialOwnerId
            beneficialOwner {
              id
              firstName
              lastName
              name
              providerEntityId
              verificationStatus
              verificationAttempt
              createdBy
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
            owner
          }
          nextToken
        }
        entityUsers {
          items {
            id
            entityId
            userId
            invitedEmail
            referredBy
            invitedEntityId
            firmEntityId
            firstName
            lastName
            role
            paymentsEnabled
            entitySearchName
            entity {
              id
              type
              taxNumber
              companyNumber
              billerCode
              name
              legalName
              searchName
              address {
                addressId
                placeId
                contactName
                contactNumber
                addressFull
                address1
                address2
                unitNumber
                streetNumber
                streetName
                streetType
                city
                country
                countryCode
                state
                stateCode
                postalCode
              }
              logo {
                alt
                identityId
                key
                level
                type
              }
              entityBeneficialOwners {
                items {
                  entityId
                  beneficialOwnerId
                  createdAt
                  updatedAt
                  owner
                }
                nextToken
              }
              entityUsers {
                items {
                  id
                  entityId
                  userId
                  invitedEmail
                  referredBy
                  invitedEntityId
                  firmEntityId
                  firstName
                  lastName
                  role
                  paymentsEnabled
                  entitySearchName
                  searchName
                  createdBy
                  createdAt
                  updatedAt
                  status
                }
                nextToken
              }
              gstRegistered
              providerEntityId
              providerCompanyId
              providerBillUserCompanyId
              providerBankAccountId
              providerDigitalWalletId
              providerBpayCrn
              contact {
                firstName
                lastName
                email
                phone
                role
              }
              paymentMethods {
                items {
                  id
                  paymentMethodType
                  type
                  fullName
                  number
                  expMonth
                  expYear
                  accountName
                  bankName
                  accountNumber
                  routingNumber
                  holderType
                  accountType
                  status
                  accountDirection
                  expiresAt
                  createdAt
                  updatedAt
                }
                nextToken
              }
              paymentMethodId
              paymentUserId
              disbursementMethodId
              receivingAccounts {
                items {
                  id
                  paymentMethodType
                  type
                  fullName
                  number
                  expMonth
                  expYear
                  accountName
                  bankName
                  accountNumber
                  routingNumber
                  holderType
                  accountType
                  status
                  accountDirection
                  expiresAt
                  createdAt
                  updatedAt
                }
                nextToken
              }
              ubosCreated
              numUbosCreated
              subCategory
              clientsStatus
              ocrEmail
              verificationStatus
              createdAt
              updatedAt
              owner
              referredBy
              xeroContactSyncStatus
              xeroLastContactSyncAt
              xeroInvoiceSyncStatus
              xeroLastInvoiceSyncAt
              xeroTenantId
            }
            searchName
            createdBy
            createdAt
            updatedAt
            status
          }
          nextToken
        }
        gstRegistered
        providerEntityId
        providerCompanyId
        providerBillUserCompanyId
        providerBankAccountId
        providerDigitalWalletId
        providerBpayCrn
        contact {
          firstName
          lastName
          email
          phone
          role
        }
        paymentMethods {
          items {
            id
            paymentMethodType
            type
            fullName
            number
            expMonth
            expYear
            accountName
            bankName
            accountNumber
            routingNumber
            holderType
            accountType
            status
            accountDirection
            expiresAt
            createdAt
            updatedAt
          }
          nextToken
        }
        paymentMethodId
        paymentUserId
        disbursementMethodId
        receivingAccounts {
          items {
            id
            paymentMethodType
            type
            fullName
            number
            expMonth
            expYear
            accountName
            bankName
            accountNumber
            routingNumber
            holderType
            accountType
            status
            accountDirection
            expiresAt
            createdAt
            updatedAt
          }
          nextToken
        }
        ubosCreated
        numUbosCreated
        subCategory
        clientsStatus
        ocrEmail
        verificationStatus
        createdAt
        updatedAt
        owner
        referredBy
        xeroContactSyncStatus
        xeroLastContactSyncAt
        xeroInvoiceSyncStatus
        xeroLastInvoiceSyncAt
        xeroTenantId
      }
      searchName
      createdBy
      createdAt
      updatedAt
      status
    }
  }
`;
export const acceptDenyEntityUserStatus = /* GraphQL */ `
  mutation AcceptDenyEntityUserStatus(
    $input: AcceptDenyEntityUserStatusInput!
  ) {
    acceptDenyEntityUserStatus(input: $input) {
      id
      entityId
      userId
      invitedEmail
      referredBy
      invitedEntityId
      firmEntityId
      firstName
      lastName
      role
      paymentsEnabled
      entitySearchName
      entity {
        id
        type
        taxNumber
        companyNumber
        billerCode
        name
        legalName
        searchName
        address {
          addressId
          placeId
          contactName
          contactNumber
          addressFull
          address1
          address2
          unitNumber
          streetNumber
          streetName
          streetType
          city
          country
          countryCode
          state
          stateCode
          postalCode
        }
        logo {
          alt
          identityId
          key
          level
          type
        }
        entityBeneficialOwners {
          items {
            entityId
            beneficialOwnerId
            beneficialOwner {
              id
              firstName
              lastName
              name
              providerEntityId
              verificationStatus
              verificationAttempt
              createdBy
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
            owner
          }
          nextToken
        }
        entityUsers {
          items {
            id
            entityId
            userId
            invitedEmail
            referredBy
            invitedEntityId
            firmEntityId
            firstName
            lastName
            role
            paymentsEnabled
            entitySearchName
            entity {
              id
              type
              taxNumber
              companyNumber
              billerCode
              name
              legalName
              searchName
              address {
                addressId
                placeId
                contactName
                contactNumber
                addressFull
                address1
                address2
                unitNumber
                streetNumber
                streetName
                streetType
                city
                country
                countryCode
                state
                stateCode
                postalCode
              }
              logo {
                alt
                identityId
                key
                level
                type
              }
              entityBeneficialOwners {
                items {
                  entityId
                  beneficialOwnerId
                  createdAt
                  updatedAt
                  owner
                }
                nextToken
              }
              entityUsers {
                items {
                  id
                  entityId
                  userId
                  invitedEmail
                  referredBy
                  invitedEntityId
                  firmEntityId
                  firstName
                  lastName
                  role
                  paymentsEnabled
                  entitySearchName
                  searchName
                  createdBy
                  createdAt
                  updatedAt
                  status
                }
                nextToken
              }
              gstRegistered
              providerEntityId
              providerCompanyId
              providerBillUserCompanyId
              providerBankAccountId
              providerDigitalWalletId
              providerBpayCrn
              contact {
                firstName
                lastName
                email
                phone
                role
              }
              paymentMethods {
                items {
                  id
                  paymentMethodType
                  type
                  fullName
                  number
                  expMonth
                  expYear
                  accountName
                  bankName
                  accountNumber
                  routingNumber
                  holderType
                  accountType
                  status
                  accountDirection
                  expiresAt
                  createdAt
                  updatedAt
                }
                nextToken
              }
              paymentMethodId
              paymentUserId
              disbursementMethodId
              receivingAccounts {
                items {
                  id
                  paymentMethodType
                  type
                  fullName
                  number
                  expMonth
                  expYear
                  accountName
                  bankName
                  accountNumber
                  routingNumber
                  holderType
                  accountType
                  status
                  accountDirection
                  expiresAt
                  createdAt
                  updatedAt
                }
                nextToken
              }
              ubosCreated
              numUbosCreated
              subCategory
              clientsStatus
              ocrEmail
              verificationStatus
              createdAt
              updatedAt
              owner
              referredBy
              xeroContactSyncStatus
              xeroLastContactSyncAt
              xeroInvoiceSyncStatus
              xeroLastInvoiceSyncAt
              xeroTenantId
            }
            searchName
            createdBy
            createdAt
            updatedAt
            status
          }
          nextToken
        }
        gstRegistered
        providerEntityId
        providerCompanyId
        providerBillUserCompanyId
        providerBankAccountId
        providerDigitalWalletId
        providerBpayCrn
        contact {
          firstName
          lastName
          email
          phone
          role
        }
        paymentMethods {
          items {
            id
            paymentMethodType
            type
            fullName
            number
            expMonth
            expYear
            accountName
            bankName
            accountNumber
            routingNumber
            holderType
            accountType
            status
            accountDirection
            expiresAt
            createdAt
            updatedAt
          }
          nextToken
        }
        paymentMethodId
        paymentUserId
        disbursementMethodId
        receivingAccounts {
          items {
            id
            paymentMethodType
            type
            fullName
            number
            expMonth
            expYear
            accountName
            bankName
            accountNumber
            routingNumber
            holderType
            accountType
            status
            accountDirection
            expiresAt
            createdAt
            updatedAt
          }
          nextToken
        }
        ubosCreated
        numUbosCreated
        subCategory
        clientsStatus
        ocrEmail
        verificationStatus
        createdAt
        updatedAt
        owner
        referredBy
        xeroContactSyncStatus
        xeroLastContactSyncAt
        xeroInvoiceSyncStatus
        xeroLastInvoiceSyncAt
        xeroTenantId
      }
      searchName
      createdBy
      createdAt
      updatedAt
      status
    }
  }
`;
export const sendReferralInvitationEmail = /* GraphQL */ `
  mutation SendReferralInvitationEmail(
    $input: sendReferralInvitationEmailInput!
  ) {
    sendReferralInvitationEmail(input: $input)
  }
`;
export const deleteEntityUser = /* GraphQL */ `
  mutation DeleteEntityUser($input: DeleteEntityUserInput) {
    deleteEntityUser(input: $input) {
      id
      entityId
      userId
      invitedEmail
      referredBy
      invitedEntityId
      firmEntityId
      firstName
      lastName
      role
      paymentsEnabled
      entitySearchName
      entity {
        id
        type
        taxNumber
        companyNumber
        billerCode
        name
        legalName
        searchName
        address {
          addressId
          placeId
          contactName
          contactNumber
          addressFull
          address1
          address2
          unitNumber
          streetNumber
          streetName
          streetType
          city
          country
          countryCode
          state
          stateCode
          postalCode
        }
        logo {
          alt
          identityId
          key
          level
          type
        }
        entityBeneficialOwners {
          items {
            entityId
            beneficialOwnerId
            beneficialOwner {
              id
              firstName
              lastName
              name
              providerEntityId
              verificationStatus
              verificationAttempt
              createdBy
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
            owner
          }
          nextToken
        }
        entityUsers {
          items {
            id
            entityId
            userId
            invitedEmail
            referredBy
            invitedEntityId
            firmEntityId
            firstName
            lastName
            role
            paymentsEnabled
            entitySearchName
            entity {
              id
              type
              taxNumber
              companyNumber
              billerCode
              name
              legalName
              searchName
              address {
                addressId
                placeId
                contactName
                contactNumber
                addressFull
                address1
                address2
                unitNumber
                streetNumber
                streetName
                streetType
                city
                country
                countryCode
                state
                stateCode
                postalCode
              }
              logo {
                alt
                identityId
                key
                level
                type
              }
              entityBeneficialOwners {
                items {
                  entityId
                  beneficialOwnerId
                  createdAt
                  updatedAt
                  owner
                }
                nextToken
              }
              entityUsers {
                items {
                  id
                  entityId
                  userId
                  invitedEmail
                  referredBy
                  invitedEntityId
                  firmEntityId
                  firstName
                  lastName
                  role
                  paymentsEnabled
                  entitySearchName
                  searchName
                  createdBy
                  createdAt
                  updatedAt
                  status
                }
                nextToken
              }
              gstRegistered
              providerEntityId
              providerCompanyId
              providerBillUserCompanyId
              providerBankAccountId
              providerDigitalWalletId
              providerBpayCrn
              contact {
                firstName
                lastName
                email
                phone
                role
              }
              paymentMethods {
                items {
                  id
                  paymentMethodType
                  type
                  fullName
                  number
                  expMonth
                  expYear
                  accountName
                  bankName
                  accountNumber
                  routingNumber
                  holderType
                  accountType
                  status
                  accountDirection
                  expiresAt
                  createdAt
                  updatedAt
                }
                nextToken
              }
              paymentMethodId
              paymentUserId
              disbursementMethodId
              receivingAccounts {
                items {
                  id
                  paymentMethodType
                  type
                  fullName
                  number
                  expMonth
                  expYear
                  accountName
                  bankName
                  accountNumber
                  routingNumber
                  holderType
                  accountType
                  status
                  accountDirection
                  expiresAt
                  createdAt
                  updatedAt
                }
                nextToken
              }
              ubosCreated
              numUbosCreated
              subCategory
              clientsStatus
              ocrEmail
              verificationStatus
              createdAt
              updatedAt
              owner
              referredBy
              xeroContactSyncStatus
              xeroLastContactSyncAt
              xeroInvoiceSyncStatus
              xeroLastInvoiceSyncAt
              xeroTenantId
            }
            searchName
            createdBy
            createdAt
            updatedAt
            status
          }
          nextToken
        }
        gstRegistered
        providerEntityId
        providerCompanyId
        providerBillUserCompanyId
        providerBankAccountId
        providerDigitalWalletId
        providerBpayCrn
        contact {
          firstName
          lastName
          email
          phone
          role
        }
        paymentMethods {
          items {
            id
            paymentMethodType
            type
            fullName
            number
            expMonth
            expYear
            accountName
            bankName
            accountNumber
            routingNumber
            holderType
            accountType
            status
            accountDirection
            expiresAt
            createdAt
            updatedAt
          }
          nextToken
        }
        paymentMethodId
        paymentUserId
        disbursementMethodId
        receivingAccounts {
          items {
            id
            paymentMethodType
            type
            fullName
            number
            expMonth
            expYear
            accountName
            bankName
            accountNumber
            routingNumber
            holderType
            accountType
            status
            accountDirection
            expiresAt
            createdAt
            updatedAt
          }
          nextToken
        }
        ubosCreated
        numUbosCreated
        subCategory
        clientsStatus
        ocrEmail
        verificationStatus
        createdAt
        updatedAt
        owner
        referredBy
        xeroContactSyncStatus
        xeroLastContactSyncAt
        xeroInvoiceSyncStatus
        xeroLastInvoiceSyncAt
        xeroTenantId
      }
      searchName
      createdBy
      createdAt
      updatedAt
      status
    }
  }
`;
export const createVerificationToken = /* GraphQL */ `
  mutation CreateVerificationToken($input: CreateVerificationTokenInput) {
    createVerificationToken(input: $input) {
      token
    }
  }
`;
export const lookupEntityOwnership = /* GraphQL */ `
  mutation LookupEntityOwnership($input: LookupEntityOwnershipInput) {
    lookupEntityOwnership(input: $input) {
      async
    }
  }
`;
export const createService = /* GraphQL */ `
  mutation CreateService($input: CreateServiceInput!) {
    createService(input: $input) {
      id
      entityId
      title
      description
      amount
      feeType
      taxType
      searchName
      status
      createdAt
      updatedAt
    }
  }
`;
export const updateService = /* GraphQL */ `
  mutation UpdateService($input: UpdateServiceInput!) {
    updateService(input: $input) {
      id
      entityId
      title
      description
      amount
      feeType
      taxType
      searchName
      status
      createdAt
      updatedAt
    }
  }
`;
export const createTemplate = /* GraphQL */ `
  mutation CreateTemplate($input: CreateTemplateInput!) {
    createTemplate(input: $input) {
      id
      entityId
      title
      templateServices {
        items {
          templateId
          serviceId
          service {
            id
            entityId
            title
            description
            amount
            feeType
            taxType
            searchName
            status
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
        nextToken
      }
      components {
        type
        data
      }
      searchName
      status
      createdAt
      updatedAt
    }
  }
`;
export const updateTemplate = /* GraphQL */ `
  mutation UpdateTemplate($input: UpdateTemplateInput!) {
    updateTemplate(input: $input) {
      id
      entityId
      title
      templateServices {
        items {
          templateId
          serviceId
          service {
            id
            entityId
            title
            description
            amount
            feeType
            taxType
            searchName
            status
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
        nextToken
      }
      components {
        type
        data
      }
      searchName
      status
      createdAt
      updatedAt
    }
  }
`;
export const createTemplateService = /* GraphQL */ `
  mutation CreateTemplateService($input: CreateTemplateServiceInput!) {
    createTemplateService(input: $input) {
      templateId
      serviceId
      service {
        id
        entityId
        title
        description
        amount
        feeType
        taxType
        searchName
        status
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteTemplateService = /* GraphQL */ `
  mutation DeleteTemplateService($input: DeleteTemplateServiceInput!) {
    deleteTemplateService(input: $input) {
      templateId
      serviceId
      service {
        id
        entityId
        title
        description
        amount
        feeType
        taxType
        searchName
        status
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const createMessage = /* GraphQL */ `
  mutation CreateMessage(
    $input: CreateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    createMessage(input: $input, condition: $condition) {
      conversationId
      text
      attachments {
        identityId
        key
        level
        type
      }
      users
      receiver
      sender
      createdBy
      readBy
      createdAt
      updatedAt
      id
      conversationMessagesId
    }
  }
`;
export const updateMessage = /* GraphQL */ `
  mutation UpdateMessage(
    $input: UpdateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    updateMessage(input: $input, condition: $condition) {
      conversationId
      text
      attachments {
        identityId
        key
        level
        type
      }
      users
      receiver
      sender
      createdBy
      readBy
      createdAt
      updatedAt
      id
      conversationMessagesId
    }
  }
`;
export const createNotification = /* GraphQL */ `
  mutation CreateNotification($input: CreateNotificationInput) {
    createNotification(input: $input) {
      id
      title
      message
      status
      createdAt
      updatedAt
      type
      owner
    }
  }
`;
export const updateNotification = /* GraphQL */ `
  mutation UpdateNotification($input: UpdateNotificationInput) {
    updateNotification(input: $input) {
      id
      title
      message
      status
      createdAt
      updatedAt
      type
      owner
    }
  }
`;
export const createOption = /* GraphQL */ `
  mutation CreateOption(
    $input: CreateOptionInput!
    $condition: ModelOptionConditionInput
  ) {
    createOption(input: $input, condition: $condition) {
      name
      label
      value
      group
      createdAt
      updatedAt
      id
    }
  }
`;
export const updateOption = /* GraphQL */ `
  mutation UpdateOption(
    $input: UpdateOptionInput!
    $condition: ModelOptionConditionInput
  ) {
    updateOption(input: $input, condition: $condition) {
      name
      label
      value
      group
      createdAt
      updatedAt
      id
    }
  }
`;
export const deleteOption = /* GraphQL */ `
  mutation DeleteOption(
    $input: DeleteOptionInput!
    $condition: ModelOptionConditionInput
  ) {
    deleteOption(input: $input, condition: $condition) {
      name
      label
      value
      group
      createdAt
      updatedAt
      id
    }
  }
`;
export const confirmPayments = /* GraphQL */ `
  mutation ConfirmPayments($input: ConfirmPaymentInput) {
    confirmPayments(input: $input) {
      id
      taskId
      entityId
      payInPaymentId
      providerTransactionId
      paymentProvider
      disbursementId
      fromId
      fromType
      toId
      toType
      buyerId
      sellerId
      entityIdTo
      amount
      netAmount
      payerFees
      totalAmount
      gstAmount
      installment
      installments
      feeAmount
      paymentType
      taxAmount
      currency
      feeIds
      ipAddress
      status
      payerUserStatus
      declinedReason
      scheduledAt
      paidAt
      declinedAt
      createdAt
      receivedAt
      paidOutAt
      updatedAt
      voidedAt
      owner
    }
  }
`;
export const createPayment = /* GraphQL */ `
  mutation CreatePayment($input: CreatePaymentInput) {
    createPayment(input: $input) {
      id
      taskId
      entityId
      payInPaymentId
      providerTransactionId
      paymentProvider
      disbursementId
      fromId
      fromType
      toId
      toType
      buyerId
      sellerId
      entityIdTo
      amount
      netAmount
      payerFees
      totalAmount
      gstAmount
      installment
      installments
      feeAmount
      paymentType
      taxAmount
      currency
      feeIds
      ipAddress
      status
      payerUserStatus
      declinedReason
      scheduledAt
      paidAt
      declinedAt
      createdAt
      receivedAt
      paidOutAt
      updatedAt
      voidedAt
      owner
    }
  }
`;
export const createPaymentPayId = /* GraphQL */ `
  mutation CreatePaymentPayId($input: CreatePaymentPayIdInput) {
    createPaymentPayId(input: $input) {
      id
      entityId
      amount
      paymentType
      status
      taskPayments {
        id
        paymentType
        installments
        scheduledAt
      }
      scheduledAt
      createdBy
      paymentUserId
      receivedAt
      paidOutAt
      createdAt
      updatedAt
    }
  }
`;
export const cancelPaymentPayId = /* GraphQL */ `
  mutation CancelPaymentPayId($input: CancelPaymentPayIdInput) {
    cancelPaymentPayId(input: $input) {
      id
      taskId
      entityId
      payInPaymentId
      providerTransactionId
      paymentProvider
      disbursementId
      fromId
      fromType
      toId
      toType
      buyerId
      sellerId
      entityIdTo
      amount
      netAmount
      payerFees
      totalAmount
      gstAmount
      installment
      installments
      feeAmount
      paymentType
      taxAmount
      currency
      feeIds
      ipAddress
      status
      payerUserStatus
      declinedReason
      scheduledAt
      paidAt
      declinedAt
      createdAt
      receivedAt
      paidOutAt
      updatedAt
      voidedAt
      owner
    }
  }
`;
export const retryPayment = /* GraphQL */ `
  mutation RetryPayment($input: RetryPaymentInput) {
    retryPayment(input: $input) {
      id
      taskId
      entityId
      payInPaymentId
      providerTransactionId
      paymentProvider
      disbursementId
      fromId
      fromType
      toId
      toType
      buyerId
      sellerId
      entityIdTo
      amount
      netAmount
      payerFees
      totalAmount
      gstAmount
      installment
      installments
      feeAmount
      paymentType
      taxAmount
      currency
      feeIds
      ipAddress
      status
      payerUserStatus
      declinedReason
      scheduledAt
      paidAt
      declinedAt
      createdAt
      receivedAt
      paidOutAt
      updatedAt
      voidedAt
      owner
    }
  }
`;
export const createTaskPayment = /* GraphQL */ `
  mutation CreateTaskPayment($input: CreateTaskPaymentInput) {
    createTaskPayment(input: $input) {
      id
      taskId
      entityId
      payInPaymentId
      providerTransactionId
      paymentProvider
      disbursementId
      fromId
      fromType
      toId
      toType
      buyerId
      sellerId
      entityIdTo
      amount
      netAmount
      payerFees
      totalAmount
      gstAmount
      installment
      installments
      feeAmount
      paymentType
      taxAmount
      currency
      feeIds
      ipAddress
      status
      payerUserStatus
      declinedReason
      scheduledAt
      paidAt
      declinedAt
      createdAt
      receivedAt
      paidOutAt
      updatedAt
      voidedAt
      owner
    }
  }
`;
export const createPaymentGuest = /* GraphQL */ `
  mutation CreatePaymentGuest($input: CreatePaymentGuestInput) {
    createPaymentGuest(input: $input) {
      id
      entityId
      taskId
      amount
      installment
      installments
      feeAmount
      paymentType
      taxAmount
      currency
      feeId
      status
      payerUserStatus
      scheduledAt
      paidAt
      createdAt
      updatedAt
      owner
    }
  }
`;
export const createPaymentScheduledGuest = /* GraphQL */ `
  mutation CreatePaymentScheduledGuest(
    $input: CreatePaymentScheduledGuestInput
  ) {
    createPaymentScheduledGuest(input: $input) {
      id
      entityId
      taskId
      amount
      installment
      installments
      feeAmount
      paymentType
      taxAmount
      currency
      feeId
      status
      payerUserStatus
      scheduledAt
      paidAt
      createdAt
      updatedAt
      owner
    }
  }
`;
export const createPaymentMethod = /* GraphQL */ `
  mutation CreatePaymentMethod($input: CreatePaymentMethodInput) {
    createPaymentMethod(input: $input) {
      id
      paymentMethodType
      type
      fullName
      number
      expMonth
      expYear
      accountName
      bankName
      accountNumber
      routingNumber
      holderType
      accountType
      status
      accountDirection
      expiresAt
      createdAt
      updatedAt
    }
  }
`;
export const updatePaymentMethod = /* GraphQL */ `
  mutation UpdatePaymentMethod($input: UpdatePaymentMethodInput) {
    updatePaymentMethod(input: $input) {
      id
      paymentMethodType
      type
      fullName
      number
      expMonth
      expYear
      accountName
      bankName
      accountNumber
      routingNumber
      holderType
      accountType
      status
      accountDirection
      expiresAt
      createdAt
      updatedAt
    }
  }
`;
export const createPushNotification = /* GraphQL */ `
  mutation CreatePushNotification($input: CreatePushNotificationInput) {
    createPushNotification(input: $input)
  }
`;
export const updateRating = /* GraphQL */ `
  mutation UpdateRating($input: UpdateRatingInput) {
    updateRating(input: $input) {
      id
      ratingBy
      owner
      name
      rating
      comment
      status
      createdAt
      updatedAt
    }
  }
`;
export const createSignature = /* GraphQL */ `
  mutation CreateSignature($input: CreateSignatureInput) {
    createSignature(input: $input) {
      id
      userId
      key
      createdAt
      updatedAt
    }
  }
`;
export const deleteSignature = /* GraphQL */ `
  mutation DeleteSignature($input: DeleteSignatureInput) {
    deleteSignature(input: $input) {
      id
      userId
      key
      createdAt
      updatedAt
    }
  }
`;
export const createTask = /* GraphQL */ `
  mutation CreateTask($input: CreateTaskInput) {
    createTask(input: $input) {
      entityId
      taskNumber
      invoiceStatus
      agreementUuid
      id
      activity {
        items {
          id
          compositeId
          userId
          entityId
          type
          message
          metadata {
            name
          }
          createdAt
          updatedAt
        }
        nextToken
      }
      amount
      annotations
      entityIdFrom
      fromId
      fromType
      toId
      toType
      entityIdTo
      contactIdFrom
      contactIdTo
      contactId
      fromSearchStatus
      toSearchStatus
      entityByIdContactId
      searchName
      status
      signatureStatus
      paymentStatus
      type
      category
      documents {
        identityId
        key
        level
        type
      }
      numberOfPayments
      paymentFrequency
      paymentTypes
      reference
      bpayReferenceNumber
      settlementStatus
      signers {
        id
        entityId
        userId
        invitedEmail
        referredBy
        invitedEntityId
        firmEntityId
        firstName
        lastName
        role
        paymentsEnabled
        entitySearchName
        entity {
          id
          type
          taxNumber
          companyNumber
          billerCode
          name
          legalName
          searchName
          address {
            addressId
            placeId
            contactName
            contactNumber
            addressFull
            address1
            address2
            unitNumber
            streetNumber
            streetName
            streetType
            city
            country
            countryCode
            state
            stateCode
            postalCode
          }
          logo {
            alt
            identityId
            key
            level
            type
          }
          entityBeneficialOwners {
            items {
              entityId
              beneficialOwnerId
              beneficialOwner {
                id
                firstName
                lastName
                name
                providerEntityId
                verificationStatus
                verificationAttempt
                createdBy
                createdAt
                updatedAt
              }
              createdAt
              updatedAt
              owner
            }
            nextToken
          }
          entityUsers {
            items {
              id
              entityId
              userId
              invitedEmail
              referredBy
              invitedEntityId
              firmEntityId
              firstName
              lastName
              role
              paymentsEnabled
              entitySearchName
              entity {
                id
                type
                taxNumber
                companyNumber
                billerCode
                name
                legalName
                searchName
                address {
                  addressId
                  placeId
                  contactName
                  contactNumber
                  addressFull
                  address1
                  address2
                  unitNumber
                  streetNumber
                  streetName
                  streetType
                  city
                  country
                  countryCode
                  state
                  stateCode
                  postalCode
                }
                logo {
                  alt
                  identityId
                  key
                  level
                  type
                }
                entityBeneficialOwners {
                  nextToken
                }
                entityUsers {
                  nextToken
                }
                gstRegistered
                providerEntityId
                providerCompanyId
                providerBillUserCompanyId
                providerBankAccountId
                providerDigitalWalletId
                providerBpayCrn
                contact {
                  firstName
                  lastName
                  email
                  phone
                  role
                }
                paymentMethods {
                  nextToken
                }
                paymentMethodId
                paymentUserId
                disbursementMethodId
                receivingAccounts {
                  nextToken
                }
                ubosCreated
                numUbosCreated
                subCategory
                clientsStatus
                ocrEmail
                verificationStatus
                createdAt
                updatedAt
                owner
                referredBy
                xeroContactSyncStatus
                xeroLastContactSyncAt
                xeroInvoiceSyncStatus
                xeroLastInvoiceSyncAt
                xeroTenantId
              }
              searchName
              createdBy
              createdAt
              updatedAt
              status
            }
            nextToken
          }
          gstRegistered
          providerEntityId
          providerCompanyId
          providerBillUserCompanyId
          providerBankAccountId
          providerDigitalWalletId
          providerBpayCrn
          contact {
            firstName
            lastName
            email
            phone
            role
          }
          paymentMethods {
            items {
              id
              paymentMethodType
              type
              fullName
              number
              expMonth
              expYear
              accountName
              bankName
              accountNumber
              routingNumber
              holderType
              accountType
              status
              accountDirection
              expiresAt
              createdAt
              updatedAt
            }
            nextToken
          }
          paymentMethodId
          paymentUserId
          disbursementMethodId
          receivingAccounts {
            items {
              id
              paymentMethodType
              type
              fullName
              number
              expMonth
              expYear
              accountName
              bankName
              accountNumber
              routingNumber
              holderType
              accountType
              status
              accountDirection
              expiresAt
              createdAt
              updatedAt
            }
            nextToken
          }
          ubosCreated
          numUbosCreated
          subCategory
          clientsStatus
          ocrEmail
          verificationStatus
          createdAt
          updatedAt
          owner
          referredBy
          xeroContactSyncStatus
          xeroLastContactSyncAt
          xeroInvoiceSyncStatus
          xeroLastInvoiceSyncAt
          xeroTenantId
        }
        searchName
        createdBy
        createdAt
        updatedAt
        status
      }
      otherRecipients {
        email
        sendOnCompletion
      }
      payments {
        items {
          id
          taskId
          entityId
          payInPaymentId
          providerTransactionId
          paymentProvider
          disbursementId
          fromId
          fromType
          toId
          toType
          buyerId
          sellerId
          entityIdTo
          amount
          netAmount
          payerFees
          totalAmount
          gstAmount
          installment
          installments
          feeAmount
          paymentType
          taxAmount
          currency
          feeIds
          ipAddress
          status
          payerUserStatus
          declinedReason
          scheduledAt
          paidAt
          declinedAt
          createdAt
          receivedAt
          paidOutAt
          updatedAt
          voidedAt
          owner
        }
        nextToken
      }
      createdBy
      entityIdBy
      dueAt
      notes
      direction
      readBy
      gstInclusive
      paymentAt
      lodgementAt
      createdAt
      updatedAt
      viewedAt
      readAt
      paidAt
      completedAt
      owner
      lineItems {
        description
        quantity
        unitAmount
        taxType
        lineAmount
      }
      xeroTenantId
    }
  }
`;
export const updateTask = /* GraphQL */ `
  mutation UpdateTask($input: UpdateTaskInput) {
    updateTask(input: $input) {
      entityId
      taskNumber
      invoiceStatus
      agreementUuid
      id
      activity {
        items {
          id
          compositeId
          userId
          entityId
          type
          message
          metadata {
            name
          }
          createdAt
          updatedAt
        }
        nextToken
      }
      amount
      annotations
      entityIdFrom
      fromId
      fromType
      toId
      toType
      entityIdTo
      contactIdFrom
      contactIdTo
      contactId
      fromSearchStatus
      toSearchStatus
      entityByIdContactId
      searchName
      status
      signatureStatus
      paymentStatus
      type
      category
      documents {
        identityId
        key
        level
        type
      }
      numberOfPayments
      paymentFrequency
      paymentTypes
      reference
      bpayReferenceNumber
      settlementStatus
      signers {
        id
        entityId
        userId
        invitedEmail
        referredBy
        invitedEntityId
        firmEntityId
        firstName
        lastName
        role
        paymentsEnabled
        entitySearchName
        entity {
          id
          type
          taxNumber
          companyNumber
          billerCode
          name
          legalName
          searchName
          address {
            addressId
            placeId
            contactName
            contactNumber
            addressFull
            address1
            address2
            unitNumber
            streetNumber
            streetName
            streetType
            city
            country
            countryCode
            state
            stateCode
            postalCode
          }
          logo {
            alt
            identityId
            key
            level
            type
          }
          entityBeneficialOwners {
            items {
              entityId
              beneficialOwnerId
              beneficialOwner {
                id
                firstName
                lastName
                name
                providerEntityId
                verificationStatus
                verificationAttempt
                createdBy
                createdAt
                updatedAt
              }
              createdAt
              updatedAt
              owner
            }
            nextToken
          }
          entityUsers {
            items {
              id
              entityId
              userId
              invitedEmail
              referredBy
              invitedEntityId
              firmEntityId
              firstName
              lastName
              role
              paymentsEnabled
              entitySearchName
              entity {
                id
                type
                taxNumber
                companyNumber
                billerCode
                name
                legalName
                searchName
                address {
                  addressId
                  placeId
                  contactName
                  contactNumber
                  addressFull
                  address1
                  address2
                  unitNumber
                  streetNumber
                  streetName
                  streetType
                  city
                  country
                  countryCode
                  state
                  stateCode
                  postalCode
                }
                logo {
                  alt
                  identityId
                  key
                  level
                  type
                }
                entityBeneficialOwners {
                  nextToken
                }
                entityUsers {
                  nextToken
                }
                gstRegistered
                providerEntityId
                providerCompanyId
                providerBillUserCompanyId
                providerBankAccountId
                providerDigitalWalletId
                providerBpayCrn
                contact {
                  firstName
                  lastName
                  email
                  phone
                  role
                }
                paymentMethods {
                  nextToken
                }
                paymentMethodId
                paymentUserId
                disbursementMethodId
                receivingAccounts {
                  nextToken
                }
                ubosCreated
                numUbosCreated
                subCategory
                clientsStatus
                ocrEmail
                verificationStatus
                createdAt
                updatedAt
                owner
                referredBy
                xeroContactSyncStatus
                xeroLastContactSyncAt
                xeroInvoiceSyncStatus
                xeroLastInvoiceSyncAt
                xeroTenantId
              }
              searchName
              createdBy
              createdAt
              updatedAt
              status
            }
            nextToken
          }
          gstRegistered
          providerEntityId
          providerCompanyId
          providerBillUserCompanyId
          providerBankAccountId
          providerDigitalWalletId
          providerBpayCrn
          contact {
            firstName
            lastName
            email
            phone
            role
          }
          paymentMethods {
            items {
              id
              paymentMethodType
              type
              fullName
              number
              expMonth
              expYear
              accountName
              bankName
              accountNumber
              routingNumber
              holderType
              accountType
              status
              accountDirection
              expiresAt
              createdAt
              updatedAt
            }
            nextToken
          }
          paymentMethodId
          paymentUserId
          disbursementMethodId
          receivingAccounts {
            items {
              id
              paymentMethodType
              type
              fullName
              number
              expMonth
              expYear
              accountName
              bankName
              accountNumber
              routingNumber
              holderType
              accountType
              status
              accountDirection
              expiresAt
              createdAt
              updatedAt
            }
            nextToken
          }
          ubosCreated
          numUbosCreated
          subCategory
          clientsStatus
          ocrEmail
          verificationStatus
          createdAt
          updatedAt
          owner
          referredBy
          xeroContactSyncStatus
          xeroLastContactSyncAt
          xeroInvoiceSyncStatus
          xeroLastInvoiceSyncAt
          xeroTenantId
        }
        searchName
        createdBy
        createdAt
        updatedAt
        status
      }
      otherRecipients {
        email
        sendOnCompletion
      }
      payments {
        items {
          id
          taskId
          entityId
          payInPaymentId
          providerTransactionId
          paymentProvider
          disbursementId
          fromId
          fromType
          toId
          toType
          buyerId
          sellerId
          entityIdTo
          amount
          netAmount
          payerFees
          totalAmount
          gstAmount
          installment
          installments
          feeAmount
          paymentType
          taxAmount
          currency
          feeIds
          ipAddress
          status
          payerUserStatus
          declinedReason
          scheduledAt
          paidAt
          declinedAt
          createdAt
          receivedAt
          paidOutAt
          updatedAt
          voidedAt
          owner
        }
        nextToken
      }
      createdBy
      entityIdBy
      dueAt
      notes
      direction
      readBy
      gstInclusive
      paymentAt
      lodgementAt
      createdAt
      updatedAt
      viewedAt
      readAt
      paidAt
      completedAt
      owner
      lineItems {
        description
        quantity
        unitAmount
        taxType
        lineAmount
      }
      xeroTenantId
    }
  }
`;
export const updateTaskGuest = /* GraphQL */ `
  mutation UpdateTaskGuest($input: UpdateTaskGuestInput) {
    updateTaskGuest(input: $input) {
      id
      entityId
      amount
      annotations
      fromId
      fromEntity {
        id
        name
        createdAt
        updatedAt
      }
      from {
        id
        name
        createdAt
        updatedAt
      }
      fromContact {
        id
        firstName
        lastName
        name
        createdAt
        updatedAt
      }
      fromType
      toEntity {
        id
        name
        createdAt
        updatedAt
      }
      toContact {
        id
        firstName
        lastName
        name
        createdAt
        updatedAt
      }
      toId
      to {
        id
        name
        createdAt
        updatedAt
      }
      toType
      status
      signatureStatus
      paymentStatus
      settlementStatus
      type
      category
      documents {
        identityId
        key
        level
        type
      }
      numberOfPayments
      paymentFrequency
      paymentTypes
      reference
      bpayReferenceNumber
      createdBy
      gstInclusive
      entityIdBy
      dueAt
      notes
      direction
      paymentAt
      lodgementAt
      readAt
      paidAt
      completedAt
      owner
      createdAt
      updatedAt
    }
  }
`;
export const updateTaskPublic = /* GraphQL */ `
  mutation UpdateTaskPublic($input: UpdateTaskPublicInput) {
    updateTaskPublic(input: $input) {
      id
      entityId
      amount
      annotations
      fromId
      fromEntity {
        id
        name
        createdAt
        updatedAt
      }
      from {
        id
        name
        createdAt
        updatedAt
      }
      fromContact {
        id
        firstName
        lastName
        name
        createdAt
        updatedAt
      }
      fromType
      toEntity {
        id
        name
        createdAt
        updatedAt
      }
      toContact {
        id
        firstName
        lastName
        name
        createdAt
        updatedAt
      }
      toId
      to {
        id
        name
        createdAt
        updatedAt
      }
      toType
      status
      signatureStatus
      paymentStatus
      settlementStatus
      type
      category
      documents {
        identityId
        key
        level
        type
      }
      numberOfPayments
      paymentFrequency
      paymentTypes
      reference
      bpayReferenceNumber
      createdBy
      gstInclusive
      entityIdBy
      dueAt
      notes
      direction
      paymentAt
      lodgementAt
      readAt
      paidAt
      completedAt
      owner
      createdAt
      updatedAt
    }
  }
`;
export const createTaskDocumentUrl = /* GraphQL */ `
  mutation CreateTaskDocumentUrl($input: CreateTaskDocumentUrlInput) {
    createTaskDocumentUrl(input: $input) {
      url
      expiresAt
    }
  }
`;
export const createTaskDocumentUrlGuest = /* GraphQL */ `
  mutation CreateTaskDocumentUrlGuest($input: CreateTaskDocumentUrlInput) {
    createTaskDocumentUrlGuest(input: $input) {
      url
      expiresAt
    }
  }
`;
export const createTranslation = /* GraphQL */ `
  mutation CreateTranslation($input: CreateTranslationInput) {
    createTranslation(input: $input) {
      language
      namespace
      data
    }
  }
`;
export const updateTranslation = /* GraphQL */ `
  mutation UpdateTranslation($input: UpdateTranslationInput) {
    updateTranslation(input: $input) {
      language
      namespace
      data
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser($input: UpdateUserInput) {
    updateUser(input: $input) {
      id
      identityId
      referralCode
      referredBy
      email
      about
      firstName
      firmId
      lastName
      phone
      blocked
      blockedBy
      country
      profileImg {
        alt
        identityId
        key
        level
        type
      }
      interests
      locale
      onboardingStatus
      onboardingEntity
      selectedSignatureKey
      signatures {
        items {
          id
          userId
          key
          createdAt
          updatedAt
        }
        nextToken
      }
      userType
      rating
      reportReasons
      notificationPreferences {
        email
        push
        sms
      }
      paymentUserId
      providerWalletId
      providerNppCrn
      ipAddress
      createdAt
      updatedAt
      owner
      loyaltyStatus
      nextLoyaltyStatus
      nextLoyaltyStatusPoint
      statusPoint
      pointsTotal
      pointsBalance
      invitedTo
    }
  }
`;
export const blockUser = /* GraphQL */ `
  mutation BlockUser($input: BlockUserInput) {
    blockUser(input: $input) {
      id
      identityId
      referralCode
      referredBy
      email
      about
      firstName
      firmId
      lastName
      phone
      blocked
      blockedBy
      country
      profileImg {
        alt
        identityId
        key
        level
        type
      }
      interests
      locale
      onboardingStatus
      onboardingEntity
      selectedSignatureKey
      signatures {
        items {
          id
          userId
          key
          createdAt
          updatedAt
        }
        nextToken
      }
      userType
      rating
      reportReasons
      notificationPreferences {
        email
        push
        sms
      }
      paymentUserId
      providerWalletId
      providerNppCrn
      ipAddress
      createdAt
      updatedAt
      owner
      loyaltyStatus
      nextLoyaltyStatus
      nextLoyaltyStatusPoint
      statusPoint
      pointsTotal
      pointsBalance
      invitedTo
    }
  }
`;
export const deleteAccount = /* GraphQL */ `
  mutation DeleteAccount {
    deleteAccount {
      id
      identityId
      referralCode
      referredBy
      email
      about
      firstName
      firmId
      lastName
      phone
      blocked
      blockedBy
      country
      profileImg {
        alt
        identityId
        key
        level
        type
      }
      interests
      locale
      onboardingStatus
      onboardingEntity
      selectedSignatureKey
      signatures {
        items {
          id
          userId
          key
          createdAt
          updatedAt
        }
        nextToken
      }
      userType
      rating
      reportReasons
      notificationPreferences {
        email
        push
        sms
      }
      paymentUserId
      providerWalletId
      providerNppCrn
      ipAddress
      createdAt
      updatedAt
      owner
      loyaltyStatus
      nextLoyaltyStatus
      nextLoyaltyStatusPoint
      statusPoint
      pointsTotal
      pointsBalance
      invitedTo
    }
  }
`;
export const createUserConversation = /* GraphQL */ `
  mutation CreateUserConversation(
    $input: CreateUserConversationInput!
    $condition: ModelUserConversationConditionInput
  ) {
    createUserConversation(input: $input, condition: $condition) {
      conversationId
      conversation {
        title
        image {
          alt
          identityId
          key
          level
          type
        }
        country
        messages {
          items {
            conversationId
            text
            attachments {
              identityId
              key
              level
              type
            }
            users
            receiver
            sender
            createdBy
            readBy
            createdAt
            updatedAt
            id
            conversationMessagesId
          }
          nextToken
        }
        userConversations {
          items {
            conversationId
            conversation {
              title
              image {
                alt
                identityId
                key
                level
                type
              }
              country
              messages {
                items {
                  conversationId
                  text
                  users
                  receiver
                  sender
                  createdBy
                  readBy
                  createdAt
                  updatedAt
                  id
                  conversationMessagesId
                }
                nextToken
              }
              userConversations {
                items {
                  conversationId
                  userId
                  users
                  createdAt
                  updatedAt
                  id
                  conversationUserConversationsId
                }
                nextToken
              }
              users
              readBy
              createdBy
              createdAt
              updatedAt
              id
            }
            userId
            user {
              id
              identityId
              referralCode
              referredBy
              email
              about
              firstName
              firmId
              lastName
              phone
              blocked
              blockedBy
              country
              profileImg {
                alt
                identityId
                key
                level
                type
              }
              interests
              locale
              onboardingStatus
              onboardingEntity
              selectedSignatureKey
              signatures {
                items {
                  id
                  userId
                  key
                  createdAt
                  updatedAt
                }
                nextToken
              }
              userType
              rating
              reportReasons
              notificationPreferences {
                email
                push
                sms
              }
              paymentUserId
              providerWalletId
              providerNppCrn
              ipAddress
              createdAt
              updatedAt
              owner
              loyaltyStatus
              nextLoyaltyStatus
              nextLoyaltyStatusPoint
              statusPoint
              pointsTotal
              pointsBalance
              invitedTo
            }
            users
            createdAt
            updatedAt
            id
            conversationUserConversationsId
          }
          nextToken
        }
        users
        readBy
        createdBy
        createdAt
        updatedAt
        id
      }
      userId
      user {
        id
        identityId
        referralCode
        referredBy
        email
        about
        firstName
        firmId
        lastName
        phone
        blocked
        blockedBy
        country
        profileImg {
          alt
          identityId
          key
          level
          type
        }
        interests
        locale
        onboardingStatus
        onboardingEntity
        selectedSignatureKey
        signatures {
          items {
            id
            userId
            key
            createdAt
            updatedAt
          }
          nextToken
        }
        userType
        rating
        reportReasons
        notificationPreferences {
          email
          push
          sms
        }
        paymentUserId
        providerWalletId
        providerNppCrn
        ipAddress
        createdAt
        updatedAt
        owner
        loyaltyStatus
        nextLoyaltyStatus
        nextLoyaltyStatusPoint
        statusPoint
        pointsTotal
        pointsBalance
        invitedTo
      }
      users
      createdAt
      updatedAt
      id
      conversationUserConversationsId
    }
  }
`;
export const updateUserConversation = /* GraphQL */ `
  mutation UpdateUserConversation(
    $input: UpdateUserConversationInput!
    $condition: ModelUserConversationConditionInput
  ) {
    updateUserConversation(input: $input, condition: $condition) {
      conversationId
      conversation {
        title
        image {
          alt
          identityId
          key
          level
          type
        }
        country
        messages {
          items {
            conversationId
            text
            attachments {
              identityId
              key
              level
              type
            }
            users
            receiver
            sender
            createdBy
            readBy
            createdAt
            updatedAt
            id
            conversationMessagesId
          }
          nextToken
        }
        userConversations {
          items {
            conversationId
            conversation {
              title
              image {
                alt
                identityId
                key
                level
                type
              }
              country
              messages {
                items {
                  conversationId
                  text
                  users
                  receiver
                  sender
                  createdBy
                  readBy
                  createdAt
                  updatedAt
                  id
                  conversationMessagesId
                }
                nextToken
              }
              userConversations {
                items {
                  conversationId
                  userId
                  users
                  createdAt
                  updatedAt
                  id
                  conversationUserConversationsId
                }
                nextToken
              }
              users
              readBy
              createdBy
              createdAt
              updatedAt
              id
            }
            userId
            user {
              id
              identityId
              referralCode
              referredBy
              email
              about
              firstName
              firmId
              lastName
              phone
              blocked
              blockedBy
              country
              profileImg {
                alt
                identityId
                key
                level
                type
              }
              interests
              locale
              onboardingStatus
              onboardingEntity
              selectedSignatureKey
              signatures {
                items {
                  id
                  userId
                  key
                  createdAt
                  updatedAt
                }
                nextToken
              }
              userType
              rating
              reportReasons
              notificationPreferences {
                email
                push
                sms
              }
              paymentUserId
              providerWalletId
              providerNppCrn
              ipAddress
              createdAt
              updatedAt
              owner
              loyaltyStatus
              nextLoyaltyStatus
              nextLoyaltyStatusPoint
              statusPoint
              pointsTotal
              pointsBalance
              invitedTo
            }
            users
            createdAt
            updatedAt
            id
            conversationUserConversationsId
          }
          nextToken
        }
        users
        readBy
        createdBy
        createdAt
        updatedAt
        id
      }
      userId
      user {
        id
        identityId
        referralCode
        referredBy
        email
        about
        firstName
        firmId
        lastName
        phone
        blocked
        blockedBy
        country
        profileImg {
          alt
          identityId
          key
          level
          type
        }
        interests
        locale
        onboardingStatus
        onboardingEntity
        selectedSignatureKey
        signatures {
          items {
            id
            userId
            key
            createdAt
            updatedAt
          }
          nextToken
        }
        userType
        rating
        reportReasons
        notificationPreferences {
          email
          push
          sms
        }
        paymentUserId
        providerWalletId
        providerNppCrn
        ipAddress
        createdAt
        updatedAt
        owner
        loyaltyStatus
        nextLoyaltyStatus
        nextLoyaltyStatusPoint
        statusPoint
        pointsTotal
        pointsBalance
        invitedTo
      }
      users
      createdAt
      updatedAt
      id
      conversationUserConversationsId
    }
  }
`;
export const deleteUserConversation = /* GraphQL */ `
  mutation DeleteUserConversation(
    $input: DeleteUserConversationInput!
    $condition: ModelUserConversationConditionInput
  ) {
    deleteUserConversation(input: $input, condition: $condition) {
      conversationId
      conversation {
        title
        image {
          alt
          identityId
          key
          level
          type
        }
        country
        messages {
          items {
            conversationId
            text
            attachments {
              identityId
              key
              level
              type
            }
            users
            receiver
            sender
            createdBy
            readBy
            createdAt
            updatedAt
            id
            conversationMessagesId
          }
          nextToken
        }
        userConversations {
          items {
            conversationId
            conversation {
              title
              image {
                alt
                identityId
                key
                level
                type
              }
              country
              messages {
                items {
                  conversationId
                  text
                  users
                  receiver
                  sender
                  createdBy
                  readBy
                  createdAt
                  updatedAt
                  id
                  conversationMessagesId
                }
                nextToken
              }
              userConversations {
                items {
                  conversationId
                  userId
                  users
                  createdAt
                  updatedAt
                  id
                  conversationUserConversationsId
                }
                nextToken
              }
              users
              readBy
              createdBy
              createdAt
              updatedAt
              id
            }
            userId
            user {
              id
              identityId
              referralCode
              referredBy
              email
              about
              firstName
              firmId
              lastName
              phone
              blocked
              blockedBy
              country
              profileImg {
                alt
                identityId
                key
                level
                type
              }
              interests
              locale
              onboardingStatus
              onboardingEntity
              selectedSignatureKey
              signatures {
                items {
                  id
                  userId
                  key
                  createdAt
                  updatedAt
                }
                nextToken
              }
              userType
              rating
              reportReasons
              notificationPreferences {
                email
                push
                sms
              }
              paymentUserId
              providerWalletId
              providerNppCrn
              ipAddress
              createdAt
              updatedAt
              owner
              loyaltyStatus
              nextLoyaltyStatus
              nextLoyaltyStatusPoint
              statusPoint
              pointsTotal
              pointsBalance
              invitedTo
            }
            users
            createdAt
            updatedAt
            id
            conversationUserConversationsId
          }
          nextToken
        }
        users
        readBy
        createdBy
        createdAt
        updatedAt
        id
      }
      userId
      user {
        id
        identityId
        referralCode
        referredBy
        email
        about
        firstName
        firmId
        lastName
        phone
        blocked
        blockedBy
        country
        profileImg {
          alt
          identityId
          key
          level
          type
        }
        interests
        locale
        onboardingStatus
        onboardingEntity
        selectedSignatureKey
        signatures {
          items {
            id
            userId
            key
            createdAt
            updatedAt
          }
          nextToken
        }
        userType
        rating
        reportReasons
        notificationPreferences {
          email
          push
          sms
        }
        paymentUserId
        providerWalletId
        providerNppCrn
        ipAddress
        createdAt
        updatedAt
        owner
        loyaltyStatus
        nextLoyaltyStatus
        nextLoyaltyStatusPoint
        statusPoint
        pointsTotal
        pointsBalance
        invitedTo
      }
      users
      createdAt
      updatedAt
      id
      conversationUserConversationsId
    }
  }
`;
export const publishUserMessage = /* GraphQL */ `
  mutation PublishUserMessage($userId: ID!) {
    publishUserMessage(userId: $userId) {
      conversationId
      text
      attachments {
        identityId
        key
        level
        type
      }
      users
      receiver
      sender
      createdBy
      readBy
      createdAt
      updatedAt
      id
      conversationMessagesId
    }
  }
`;
export const xeroCreateConsentUrl = /* GraphQL */ `
  mutation XeroCreateConsentUrl($input: XeroCreateConsentUrlInput) {
    xeroCreateConsentUrl(input: $input)
  }
`;
export const xeroCreateContactSync = /* GraphQL */ `
  mutation XeroCreateContactSync($input: XeroCreateContactSyncInput) {
    xeroCreateContactSync(input: $input)
  }
`;
export const xeroCreateInvoiceSync = /* GraphQL */ `
  mutation XeroCreateInvoiceSync($input: XeroCreateInvoiceSyncInput) {
    xeroCreateInvoiceSync(input: $input)
  }
`;
export const xeroCreateTenantsConnect = /* GraphQL */ `
  mutation XeroCreateTenantsConnect($input: xeroCreateTenantsConnectInput) {
    xeroCreateTenantsConnect(input: $input)
  }
`;
export const xeroGetProfile = /* GraphQL */ `
  mutation XeroGetProfile($input: XeroGetProfileInput) {
    xeroGetProfile(input: $input)
  }
`;
export const xeroDisconnect = /* GraphQL */ `
  mutation XeroDisconnect($input: XeroDisconnectInput) {
    xeroDisconnect(input: $input)
  }
`;
export const getUpdatePayToAgreement = /* GraphQL */ `
  mutation GetUpdatePayToAgreement($input: GetUpdatePayToAgreementInput!) {
    getUpdatePayToAgreement(input: $input) {
      id
      agreementUuid
      status
      statusDescription
      statusReasonCode
      statusReasonDescription
      entityId
      fromId
      from {
        id
        type
        taxNumber
        companyNumber
        billerCode
        name
        legalName
        searchName
        address {
          addressId
          placeId
          contactName
          contactNumber
          addressFull
          address1
          address2
          unitNumber
          streetNumber
          streetName
          streetType
          city
          country
          countryCode
          state
          stateCode
          postalCode
        }
        logo {
          alt
          identityId
          key
          level
          type
        }
        entityBeneficialOwners {
          items {
            entityId
            beneficialOwnerId
            beneficialOwner {
              id
              firstName
              lastName
              name
              providerEntityId
              verificationStatus
              verificationAttempt
              createdBy
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
            owner
          }
          nextToken
        }
        entityUsers {
          items {
            id
            entityId
            userId
            invitedEmail
            referredBy
            invitedEntityId
            firmEntityId
            firstName
            lastName
            role
            paymentsEnabled
            entitySearchName
            entity {
              id
              type
              taxNumber
              companyNumber
              billerCode
              name
              legalName
              searchName
              address {
                addressId
                placeId
                contactName
                contactNumber
                addressFull
                address1
                address2
                unitNumber
                streetNumber
                streetName
                streetType
                city
                country
                countryCode
                state
                stateCode
                postalCode
              }
              logo {
                alt
                identityId
                key
                level
                type
              }
              entityBeneficialOwners {
                items {
                  entityId
                  beneficialOwnerId
                  createdAt
                  updatedAt
                  owner
                }
                nextToken
              }
              entityUsers {
                items {
                  id
                  entityId
                  userId
                  invitedEmail
                  referredBy
                  invitedEntityId
                  firmEntityId
                  firstName
                  lastName
                  role
                  paymentsEnabled
                  entitySearchName
                  searchName
                  createdBy
                  createdAt
                  updatedAt
                  status
                }
                nextToken
              }
              gstRegistered
              providerEntityId
              providerCompanyId
              providerBillUserCompanyId
              providerBankAccountId
              providerDigitalWalletId
              providerBpayCrn
              contact {
                firstName
                lastName
                email
                phone
                role
              }
              paymentMethods {
                items {
                  id
                  paymentMethodType
                  type
                  fullName
                  number
                  expMonth
                  expYear
                  accountName
                  bankName
                  accountNumber
                  routingNumber
                  holderType
                  accountType
                  status
                  accountDirection
                  expiresAt
                  createdAt
                  updatedAt
                }
                nextToken
              }
              paymentMethodId
              paymentUserId
              disbursementMethodId
              receivingAccounts {
                items {
                  id
                  paymentMethodType
                  type
                  fullName
                  number
                  expMonth
                  expYear
                  accountName
                  bankName
                  accountNumber
                  routingNumber
                  holderType
                  accountType
                  status
                  accountDirection
                  expiresAt
                  createdAt
                  updatedAt
                }
                nextToken
              }
              ubosCreated
              numUbosCreated
              subCategory
              clientsStatus
              ocrEmail
              verificationStatus
              createdAt
              updatedAt
              owner
              referredBy
              xeroContactSyncStatus
              xeroLastContactSyncAt
              xeroInvoiceSyncStatus
              xeroLastInvoiceSyncAt
              xeroTenantId
            }
            searchName
            createdBy
            createdAt
            updatedAt
            status
          }
          nextToken
        }
        gstRegistered
        providerEntityId
        providerCompanyId
        providerBillUserCompanyId
        providerBankAccountId
        providerDigitalWalletId
        providerBpayCrn
        contact {
          firstName
          lastName
          email
          phone
          role
        }
        paymentMethods {
          items {
            id
            paymentMethodType
            type
            fullName
            number
            expMonth
            expYear
            accountName
            bankName
            accountNumber
            routingNumber
            holderType
            accountType
            status
            accountDirection
            expiresAt
            createdAt
            updatedAt
          }
          nextToken
        }
        paymentMethodId
        paymentUserId
        disbursementMethodId
        receivingAccounts {
          items {
            id
            paymentMethodType
            type
            fullName
            number
            expMonth
            expYear
            accountName
            bankName
            accountNumber
            routingNumber
            holderType
            accountType
            status
            accountDirection
            expiresAt
            createdAt
            updatedAt
          }
          nextToken
        }
        ubosCreated
        numUbosCreated
        subCategory
        clientsStatus
        ocrEmail
        verificationStatus
        createdAt
        updatedAt
        owner
        referredBy
        xeroContactSyncStatus
        xeroLastContactSyncAt
        xeroInvoiceSyncStatus
        xeroLastInvoiceSyncAt
        xeroTenantId
      }
      paymentFrequency
      amount
      createdAt
      updatedAt
    }
  }
`;
export const createPaymentMethodToken = /* GraphQL */ `
  mutation CreatePaymentMethodToken($input: CreatePaymentMethodTokenInput) {
    createPaymentMethodToken(input: $input) {
      token
      userId
    }
  }
`;
export const createPayToAgreement = /* GraphQL */ `
  mutation CreatePayToAgreement($input: CreatePayToAgreementInput) {
    createPayToAgreement(input: $input) {
      id
      agreementUuid
      status
      statusDescription
      statusReasonCode
      statusReasonDescription
      entityId
      fromId
      from {
        id
        type
        taxNumber
        companyNumber
        billerCode
        name
        legalName
        searchName
        address {
          addressId
          placeId
          contactName
          contactNumber
          addressFull
          address1
          address2
          unitNumber
          streetNumber
          streetName
          streetType
          city
          country
          countryCode
          state
          stateCode
          postalCode
        }
        logo {
          alt
          identityId
          key
          level
          type
        }
        entityBeneficialOwners {
          items {
            entityId
            beneficialOwnerId
            beneficialOwner {
              id
              firstName
              lastName
              name
              providerEntityId
              verificationStatus
              verificationAttempt
              createdBy
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
            owner
          }
          nextToken
        }
        entityUsers {
          items {
            id
            entityId
            userId
            invitedEmail
            referredBy
            invitedEntityId
            firmEntityId
            firstName
            lastName
            role
            paymentsEnabled
            entitySearchName
            entity {
              id
              type
              taxNumber
              companyNumber
              billerCode
              name
              legalName
              searchName
              address {
                addressId
                placeId
                contactName
                contactNumber
                addressFull
                address1
                address2
                unitNumber
                streetNumber
                streetName
                streetType
                city
                country
                countryCode
                state
                stateCode
                postalCode
              }
              logo {
                alt
                identityId
                key
                level
                type
              }
              entityBeneficialOwners {
                items {
                  entityId
                  beneficialOwnerId
                  createdAt
                  updatedAt
                  owner
                }
                nextToken
              }
              entityUsers {
                items {
                  id
                  entityId
                  userId
                  invitedEmail
                  referredBy
                  invitedEntityId
                  firmEntityId
                  firstName
                  lastName
                  role
                  paymentsEnabled
                  entitySearchName
                  searchName
                  createdBy
                  createdAt
                  updatedAt
                  status
                }
                nextToken
              }
              gstRegistered
              providerEntityId
              providerCompanyId
              providerBillUserCompanyId
              providerBankAccountId
              providerDigitalWalletId
              providerBpayCrn
              contact {
                firstName
                lastName
                email
                phone
                role
              }
              paymentMethods {
                items {
                  id
                  paymentMethodType
                  type
                  fullName
                  number
                  expMonth
                  expYear
                  accountName
                  bankName
                  accountNumber
                  routingNumber
                  holderType
                  accountType
                  status
                  accountDirection
                  expiresAt
                  createdAt
                  updatedAt
                }
                nextToken
              }
              paymentMethodId
              paymentUserId
              disbursementMethodId
              receivingAccounts {
                items {
                  id
                  paymentMethodType
                  type
                  fullName
                  number
                  expMonth
                  expYear
                  accountName
                  bankName
                  accountNumber
                  routingNumber
                  holderType
                  accountType
                  status
                  accountDirection
                  expiresAt
                  createdAt
                  updatedAt
                }
                nextToken
              }
              ubosCreated
              numUbosCreated
              subCategory
              clientsStatus
              ocrEmail
              verificationStatus
              createdAt
              updatedAt
              owner
              referredBy
              xeroContactSyncStatus
              xeroLastContactSyncAt
              xeroInvoiceSyncStatus
              xeroLastInvoiceSyncAt
              xeroTenantId
            }
            searchName
            createdBy
            createdAt
            updatedAt
            status
          }
          nextToken
        }
        gstRegistered
        providerEntityId
        providerCompanyId
        providerBillUserCompanyId
        providerBankAccountId
        providerDigitalWalletId
        providerBpayCrn
        contact {
          firstName
          lastName
          email
          phone
          role
        }
        paymentMethods {
          items {
            id
            paymentMethodType
            type
            fullName
            number
            expMonth
            expYear
            accountName
            bankName
            accountNumber
            routingNumber
            holderType
            accountType
            status
            accountDirection
            expiresAt
            createdAt
            updatedAt
          }
          nextToken
        }
        paymentMethodId
        paymentUserId
        disbursementMethodId
        receivingAccounts {
          items {
            id
            paymentMethodType
            type
            fullName
            number
            expMonth
            expYear
            accountName
            bankName
            accountNumber
            routingNumber
            holderType
            accountType
            status
            accountDirection
            expiresAt
            createdAt
            updatedAt
          }
          nextToken
        }
        ubosCreated
        numUbosCreated
        subCategory
        clientsStatus
        ocrEmail
        verificationStatus
        createdAt
        updatedAt
        owner
        referredBy
        xeroContactSyncStatus
        xeroLastContactSyncAt
        xeroInvoiceSyncStatus
        xeroLastInvoiceSyncAt
        xeroTenantId
      }
      paymentFrequency
      amount
      createdAt
      updatedAt
    }
  }
`;
export const validatePayToAgreement = /* GraphQL */ `
  mutation ValidatePayToAgreement($input: ValidatePayToAgreementInput) {
    validatePayToAgreement(input: $input) {
      id
      agreementUuid
      status
      statusDescription
      statusReasonCode
      statusReasonDescription
      entityId
      fromId
      from {
        id
        type
        taxNumber
        companyNumber
        billerCode
        name
        legalName
        searchName
        address {
          addressId
          placeId
          contactName
          contactNumber
          addressFull
          address1
          address2
          unitNumber
          streetNumber
          streetName
          streetType
          city
          country
          countryCode
          state
          stateCode
          postalCode
        }
        logo {
          alt
          identityId
          key
          level
          type
        }
        entityBeneficialOwners {
          items {
            entityId
            beneficialOwnerId
            beneficialOwner {
              id
              firstName
              lastName
              name
              providerEntityId
              verificationStatus
              verificationAttempt
              createdBy
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
            owner
          }
          nextToken
        }
        entityUsers {
          items {
            id
            entityId
            userId
            invitedEmail
            referredBy
            invitedEntityId
            firmEntityId
            firstName
            lastName
            role
            paymentsEnabled
            entitySearchName
            entity {
              id
              type
              taxNumber
              companyNumber
              billerCode
              name
              legalName
              searchName
              address {
                addressId
                placeId
                contactName
                contactNumber
                addressFull
                address1
                address2
                unitNumber
                streetNumber
                streetName
                streetType
                city
                country
                countryCode
                state
                stateCode
                postalCode
              }
              logo {
                alt
                identityId
                key
                level
                type
              }
              entityBeneficialOwners {
                items {
                  entityId
                  beneficialOwnerId
                  createdAt
                  updatedAt
                  owner
                }
                nextToken
              }
              entityUsers {
                items {
                  id
                  entityId
                  userId
                  invitedEmail
                  referredBy
                  invitedEntityId
                  firmEntityId
                  firstName
                  lastName
                  role
                  paymentsEnabled
                  entitySearchName
                  searchName
                  createdBy
                  createdAt
                  updatedAt
                  status
                }
                nextToken
              }
              gstRegistered
              providerEntityId
              providerCompanyId
              providerBillUserCompanyId
              providerBankAccountId
              providerDigitalWalletId
              providerBpayCrn
              contact {
                firstName
                lastName
                email
                phone
                role
              }
              paymentMethods {
                items {
                  id
                  paymentMethodType
                  type
                  fullName
                  number
                  expMonth
                  expYear
                  accountName
                  bankName
                  accountNumber
                  routingNumber
                  holderType
                  accountType
                  status
                  accountDirection
                  expiresAt
                  createdAt
                  updatedAt
                }
                nextToken
              }
              paymentMethodId
              paymentUserId
              disbursementMethodId
              receivingAccounts {
                items {
                  id
                  paymentMethodType
                  type
                  fullName
                  number
                  expMonth
                  expYear
                  accountName
                  bankName
                  accountNumber
                  routingNumber
                  holderType
                  accountType
                  status
                  accountDirection
                  expiresAt
                  createdAt
                  updatedAt
                }
                nextToken
              }
              ubosCreated
              numUbosCreated
              subCategory
              clientsStatus
              ocrEmail
              verificationStatus
              createdAt
              updatedAt
              owner
              referredBy
              xeroContactSyncStatus
              xeroLastContactSyncAt
              xeroInvoiceSyncStatus
              xeroLastInvoiceSyncAt
              xeroTenantId
            }
            searchName
            createdBy
            createdAt
            updatedAt
            status
          }
          nextToken
        }
        gstRegistered
        providerEntityId
        providerCompanyId
        providerBillUserCompanyId
        providerBankAccountId
        providerDigitalWalletId
        providerBpayCrn
        contact {
          firstName
          lastName
          email
          phone
          role
        }
        paymentMethods {
          items {
            id
            paymentMethodType
            type
            fullName
            number
            expMonth
            expYear
            accountName
            bankName
            accountNumber
            routingNumber
            holderType
            accountType
            status
            accountDirection
            expiresAt
            createdAt
            updatedAt
          }
          nextToken
        }
        paymentMethodId
        paymentUserId
        disbursementMethodId
        receivingAccounts {
          items {
            id
            paymentMethodType
            type
            fullName
            number
            expMonth
            expYear
            accountName
            bankName
            accountNumber
            routingNumber
            holderType
            accountType
            status
            accountDirection
            expiresAt
            createdAt
            updatedAt
          }
          nextToken
        }
        ubosCreated
        numUbosCreated
        subCategory
        clientsStatus
        ocrEmail
        verificationStatus
        createdAt
        updatedAt
        owner
        referredBy
        xeroContactSyncStatus
        xeroLastContactSyncAt
        xeroInvoiceSyncStatus
        xeroLastInvoiceSyncAt
        xeroTenantId
      }
      paymentFrequency
      amount
      createdAt
      updatedAt
    }
  }
`;
