/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from '../API';
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createAdmin =
  /* GraphQL */ `mutation CreateAdmin($input: CreateAdminInput) {
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
    __typename
  }
}
` as GeneratedMutation<
    APITypes.CreateAdminMutationVariables,
    APITypes.CreateAdminMutation
  >;
export const updateAdmin = /* GraphQL */ `mutation UpdateAdmin(
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
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateAdminMutationVariables,
  APITypes.UpdateAdminMutation
>;
export const deleteAdmin =
  /* GraphQL */ `mutation DeleteAdmin($input: DeleteAdminInput) {
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
    __typename
  }
}
` as GeneratedMutation<
    APITypes.DeleteAdminMutationVariables,
    APITypes.DeleteAdminMutation
  >;
export const updateBeneficialOwner =
  /* GraphQL */ `mutation UpdateBeneficialOwner($input: UpdateBeneficialOwnerInput) {
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
    __typename
  }
}
` as GeneratedMutation<
    APITypes.UpdateBeneficialOwnerMutationVariables,
    APITypes.UpdateBeneficialOwnerMutation
  >;
export const createClient =
  /* GraphQL */ `mutation CreateClient($input: CreateClientInput) {
  createClient(input: $input) {
    id
    entityId
    userId
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
        address1
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
        __typename
      }
      logo {
        alt
        identityId
        key
        level
        type
        __typename
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
            __typename
          }
          createdAt
          updatedAt
          owner
          __typename
        }
        nextToken
        __typename
      }
      entityUsers {
        items {
          id
          entityId
          userId
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
              address1
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
              __typename
            }
            logo {
              alt
              identityId
              key
              level
              type
              __typename
            }
            entityBeneficialOwners {
              items {
                entityId
                beneficialOwnerId
                createdAt
                updatedAt
                owner
                __typename
              }
              nextToken
              __typename
            }
            entityUsers {
              items {
                id
                entityId
                userId
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
                __typename
              }
              nextToken
              __typename
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
              __typename
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
                __typename
              }
              nextToken
              __typename
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
                __typename
              }
              nextToken
              __typename
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
            __typename
          }
          searchName
          createdBy
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
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
        __typename
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
          __typename
        }
        nextToken
        __typename
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
          __typename
        }
        nextToken
        __typename
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
      __typename
    }
    searchName
    createdBy
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
    APITypes.CreateClientMutationVariables,
    APITypes.CreateClientMutation
  >;
export const createContact =
  /* GraphQL */ `mutation CreateContact($input: CreateContactInput!) {
  createContact(input: $input) {
    id
    entityId
    firstName
    lastName
    email
    phone
    taxNumber
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
      __typename
    }
    bpay {
      billerCode
      referenceNumber
      __typename
    }
    bulkUploadFileKey
    owner
    __typename
  }
}
` as GeneratedMutation<
    APITypes.CreateContactMutationVariables,
    APITypes.CreateContactMutation
  >;
export const createContactBulkUpload =
  /* GraphQL */ `mutation CreateContactBulkUpload($input: CreateContactBulkImportInput!) {
  createContactBulkUpload(input: $input)
}
` as GeneratedMutation<
    APITypes.CreateContactBulkUploadMutationVariables,
    APITypes.CreateContactBulkUploadMutation
  >;
export const updateContact =
  /* GraphQL */ `mutation UpdateContact($input: UpdateContactInput!) {
  updateContact(input: $input) {
    id
    entityId
    firstName
    lastName
    email
    phone
    taxNumber
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
      __typename
    }
    bpay {
      billerCode
      referenceNumber
      __typename
    }
    bulkUploadFileKey
    owner
    __typename
  }
}
` as GeneratedMutation<
    APITypes.UpdateContactMutationVariables,
    APITypes.UpdateContactMutation
  >;
export const createConversation = /* GraphQL */ `mutation CreateConversation(
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
      __typename
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
          __typename
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
        __typename
      }
      nextToken
      __typename
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
            __typename
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
                __typename
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
              __typename
            }
            nextToken
            __typename
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
                __typename
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
                __typename
              }
              users
              createdAt
              updatedAt
              id
              conversationUserConversationsId
              __typename
            }
            nextToken
            __typename
          }
          users
          readBy
          createdBy
          createdAt
          updatedAt
          id
          __typename
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
            __typename
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
              __typename
            }
            nextToken
            __typename
          }
          userType
          rating
          reportReasons
          notificationPreferences {
            email
            push
            sms
            __typename
          }
          paymentUserId
          providerWalletId
          providerNppCrn
          ipAddress
          createdAt
          updatedAt
          owner
          __typename
        }
        users
        createdAt
        updatedAt
        id
        conversationUserConversationsId
        __typename
      }
      nextToken
      __typename
    }
    users
    readBy
    createdBy
    createdAt
    updatedAt
    id
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateConversationMutationVariables,
  APITypes.CreateConversationMutation
>;
export const updateConversation = /* GraphQL */ `mutation UpdateConversation(
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
      __typename
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
          __typename
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
        __typename
      }
      nextToken
      __typename
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
            __typename
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
                __typename
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
              __typename
            }
            nextToken
            __typename
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
                __typename
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
                __typename
              }
              users
              createdAt
              updatedAt
              id
              conversationUserConversationsId
              __typename
            }
            nextToken
            __typename
          }
          users
          readBy
          createdBy
          createdAt
          updatedAt
          id
          __typename
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
            __typename
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
              __typename
            }
            nextToken
            __typename
          }
          userType
          rating
          reportReasons
          notificationPreferences {
            email
            push
            sms
            __typename
          }
          paymentUserId
          providerWalletId
          providerNppCrn
          ipAddress
          createdAt
          updatedAt
          owner
          __typename
        }
        users
        createdAt
        updatedAt
        id
        conversationUserConversationsId
        __typename
      }
      nextToken
      __typename
    }
    users
    readBy
    createdBy
    createdAt
    updatedAt
    id
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateConversationMutationVariables,
  APITypes.UpdateConversationMutation
>;
export const deleteConversation = /* GraphQL */ `mutation DeleteConversation(
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
      __typename
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
          __typename
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
        __typename
      }
      nextToken
      __typename
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
            __typename
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
                __typename
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
              __typename
            }
            nextToken
            __typename
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
                __typename
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
                __typename
              }
              users
              createdAt
              updatedAt
              id
              conversationUserConversationsId
              __typename
            }
            nextToken
            __typename
          }
          users
          readBy
          createdBy
          createdAt
          updatedAt
          id
          __typename
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
            __typename
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
              __typename
            }
            nextToken
            __typename
          }
          userType
          rating
          reportReasons
          notificationPreferences {
            email
            push
            sms
            __typename
          }
          paymentUserId
          providerWalletId
          providerNppCrn
          ipAddress
          createdAt
          updatedAt
          owner
          __typename
        }
        users
        createdAt
        updatedAt
        id
        conversationUserConversationsId
        __typename
      }
      nextToken
      __typename
    }
    users
    readBy
    createdBy
    createdAt
    updatedAt
    id
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteConversationMutationVariables,
  APITypes.DeleteConversationMutation
>;
export const createDocumentAnalysis =
  /* GraphQL */ `mutation CreateDocumentAnalysis($input: CreateDocumentAnalysisInput) {
  createDocumentAnalysis(input: $input) {
    id
    entityId
    jobId
    status
    type
    createdBy
    expiresAt
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
    APITypes.CreateDocumentAnalysisMutationVariables,
    APITypes.CreateDocumentAnalysisMutation
  >;
export const createEntity =
  /* GraphQL */ `mutation CreateEntity($input: CreateEntityInput!) {
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
      address1
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
      __typename
    }
    logo {
      alt
      identityId
      key
      level
      type
      __typename
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
          __typename
        }
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
    entityUsers {
      items {
        id
        entityId
        userId
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
            address1
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
            __typename
          }
          logo {
            alt
            identityId
            key
            level
            type
            __typename
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
                __typename
              }
              createdAt
              updatedAt
              owner
              __typename
            }
            nextToken
            __typename
          }
          entityUsers {
            items {
              id
              entityId
              userId
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
                __typename
              }
              searchName
              createdBy
              createdAt
              updatedAt
              __typename
            }
            nextToken
            __typename
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
            __typename
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
              __typename
            }
            nextToken
            __typename
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
              __typename
            }
            nextToken
            __typename
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
          __typename
        }
        searchName
        createdBy
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
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
      __typename
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
        __typename
      }
      nextToken
      __typename
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
        __typename
      }
      nextToken
      __typename
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
    __typename
  }
}
` as GeneratedMutation<
    APITypes.CreateEntityMutationVariables,
    APITypes.CreateEntityMutation
  >;
export const updateEntity =
  /* GraphQL */ `mutation UpdateEntity($input: UpdateEntityInput!) {
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
      address1
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
      __typename
    }
    logo {
      alt
      identityId
      key
      level
      type
      __typename
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
          __typename
        }
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
    entityUsers {
      items {
        id
        entityId
        userId
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
            address1
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
            __typename
          }
          logo {
            alt
            identityId
            key
            level
            type
            __typename
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
                __typename
              }
              createdAt
              updatedAt
              owner
              __typename
            }
            nextToken
            __typename
          }
          entityUsers {
            items {
              id
              entityId
              userId
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
                __typename
              }
              searchName
              createdBy
              createdAt
              updatedAt
              __typename
            }
            nextToken
            __typename
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
            __typename
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
              __typename
            }
            nextToken
            __typename
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
              __typename
            }
            nextToken
            __typename
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
          __typename
        }
        searchName
        createdBy
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
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
      __typename
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
        __typename
      }
      nextToken
      __typename
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
        __typename
      }
      nextToken
      __typename
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
    __typename
  }
}
` as GeneratedMutation<
    APITypes.UpdateEntityMutationVariables,
    APITypes.UpdateEntityMutation
  >;
export const deleteEntity = /* GraphQL */ `mutation DeleteEntity(
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
      address1
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
      __typename
    }
    logo {
      alt
      identityId
      key
      level
      type
      __typename
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
          __typename
        }
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
    entityUsers {
      items {
        id
        entityId
        userId
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
            address1
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
            __typename
          }
          logo {
            alt
            identityId
            key
            level
            type
            __typename
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
                __typename
              }
              createdAt
              updatedAt
              owner
              __typename
            }
            nextToken
            __typename
          }
          entityUsers {
            items {
              id
              entityId
              userId
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
                __typename
              }
              searchName
              createdBy
              createdAt
              updatedAt
              __typename
            }
            nextToken
            __typename
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
            __typename
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
              __typename
            }
            nextToken
            __typename
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
              __typename
            }
            nextToken
            __typename
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
          __typename
        }
        searchName
        createdBy
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
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
      __typename
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
        __typename
      }
      nextToken
      __typename
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
        __typename
      }
      nextToken
      __typename
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
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteEntityMutationVariables,
  APITypes.DeleteEntityMutation
>;
export const createEntityUser =
  /* GraphQL */ `mutation CreateEntityUser($input: CreateEntityUserInput!) {
  createEntityUser(input: $input) {
    id
    entityId
    userId
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
        address1
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
        __typename
      }
      logo {
        alt
        identityId
        key
        level
        type
        __typename
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
            __typename
          }
          createdAt
          updatedAt
          owner
          __typename
        }
        nextToken
        __typename
      }
      entityUsers {
        items {
          id
          entityId
          userId
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
              address1
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
              __typename
            }
            logo {
              alt
              identityId
              key
              level
              type
              __typename
            }
            entityBeneficialOwners {
              items {
                entityId
                beneficialOwnerId
                createdAt
                updatedAt
                owner
                __typename
              }
              nextToken
              __typename
            }
            entityUsers {
              items {
                id
                entityId
                userId
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
                __typename
              }
              nextToken
              __typename
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
              __typename
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
                __typename
              }
              nextToken
              __typename
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
                __typename
              }
              nextToken
              __typename
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
            __typename
          }
          searchName
          createdBy
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
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
        __typename
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
          __typename
        }
        nextToken
        __typename
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
          __typename
        }
        nextToken
        __typename
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
      __typename
    }
    searchName
    createdBy
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
    APITypes.CreateEntityUserMutationVariables,
    APITypes.CreateEntityUserMutation
  >;
export const updateEntityUser =
  /* GraphQL */ `mutation UpdateEntityUser($input: UpdateEntityUserInput!) {
  updateEntityUser(input: $input) {
    id
    entityId
    userId
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
        address1
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
        __typename
      }
      logo {
        alt
        identityId
        key
        level
        type
        __typename
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
            __typename
          }
          createdAt
          updatedAt
          owner
          __typename
        }
        nextToken
        __typename
      }
      entityUsers {
        items {
          id
          entityId
          userId
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
              address1
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
              __typename
            }
            logo {
              alt
              identityId
              key
              level
              type
              __typename
            }
            entityBeneficialOwners {
              items {
                entityId
                beneficialOwnerId
                createdAt
                updatedAt
                owner
                __typename
              }
              nextToken
              __typename
            }
            entityUsers {
              items {
                id
                entityId
                userId
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
                __typename
              }
              nextToken
              __typename
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
              __typename
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
                __typename
              }
              nextToken
              __typename
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
                __typename
              }
              nextToken
              __typename
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
            __typename
          }
          searchName
          createdBy
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
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
        __typename
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
          __typename
        }
        nextToken
        __typename
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
          __typename
        }
        nextToken
        __typename
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
      __typename
    }
    searchName
    createdBy
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
    APITypes.UpdateEntityUserMutationVariables,
    APITypes.UpdateEntityUserMutation
  >;
export const deleteEntityUser =
  /* GraphQL */ `mutation DeleteEntityUser($input: DeleteEntityUserInput) {
  deleteEntityUser(input: $input) {
    id
    entityId
    userId
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
        address1
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
        __typename
      }
      logo {
        alt
        identityId
        key
        level
        type
        __typename
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
            __typename
          }
          createdAt
          updatedAt
          owner
          __typename
        }
        nextToken
        __typename
      }
      entityUsers {
        items {
          id
          entityId
          userId
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
              address1
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
              __typename
            }
            logo {
              alt
              identityId
              key
              level
              type
              __typename
            }
            entityBeneficialOwners {
              items {
                entityId
                beneficialOwnerId
                createdAt
                updatedAt
                owner
                __typename
              }
              nextToken
              __typename
            }
            entityUsers {
              items {
                id
                entityId
                userId
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
                __typename
              }
              nextToken
              __typename
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
              __typename
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
                __typename
              }
              nextToken
              __typename
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
                __typename
              }
              nextToken
              __typename
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
            __typename
          }
          searchName
          createdBy
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
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
        __typename
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
          __typename
        }
        nextToken
        __typename
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
          __typename
        }
        nextToken
        __typename
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
      __typename
    }
    searchName
    createdBy
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
    APITypes.DeleteEntityUserMutationVariables,
    APITypes.DeleteEntityUserMutation
  >;
export const createVerificationToken =
  /* GraphQL */ `mutation CreateVerificationToken($input: CreateVerificationTokenInput) {
  createVerificationToken(input: $input) {
    token
    __typename
  }
}
` as GeneratedMutation<
    APITypes.CreateVerificationTokenMutationVariables,
    APITypes.CreateVerificationTokenMutation
  >;
export const lookupEntityOwnership =
  /* GraphQL */ `mutation LookupEntityOwnership($input: LookupEntityOwnershipInput) {
  lookupEntityOwnership(input: $input) {
    async
    __typename
  }
}
` as GeneratedMutation<
    APITypes.LookupEntityOwnershipMutationVariables,
    APITypes.LookupEntityOwnershipMutation
  >;
export const createService =
  /* GraphQL */ `mutation CreateService($input: CreateServiceInput!) {
  createService(input: $input) {
    id
    entityId
    title
    description
    amount
    fee
    feeType
    includesGST
    searchName
    status
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
    APITypes.CreateServiceMutationVariables,
    APITypes.CreateServiceMutation
  >;
export const updateService =
  /* GraphQL */ `mutation UpdateService($input: UpdateServiceInput!) {
  updateService(input: $input) {
    id
    entityId
    title
    description
    amount
    fee
    feeType
    includesGST
    searchName
    status
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
    APITypes.UpdateServiceMutationVariables,
    APITypes.UpdateServiceMutation
  >;
export const createTemplate =
  /* GraphQL */ `mutation CreateTemplate($input: CreateTemplateInput!) {
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
          fee
          feeType
          includesGST
          searchName
          status
          createdAt
          updatedAt
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
    components {
      type
      data
      __typename
    }
    searchName
    status
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
    APITypes.CreateTemplateMutationVariables,
    APITypes.CreateTemplateMutation
  >;
export const updateTemplate =
  /* GraphQL */ `mutation UpdateTemplate($input: UpdateTemplateInput!) {
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
          fee
          feeType
          includesGST
          searchName
          status
          createdAt
          updatedAt
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
    components {
      type
      data
      __typename
    }
    searchName
    status
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
    APITypes.UpdateTemplateMutationVariables,
    APITypes.UpdateTemplateMutation
  >;
export const createTemplateService =
  /* GraphQL */ `mutation CreateTemplateService($input: CreateTemplateServiceInput!) {
  createTemplateService(input: $input) {
    templateId
    serviceId
    service {
      id
      entityId
      title
      description
      amount
      fee
      feeType
      includesGST
      searchName
      status
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
    APITypes.CreateTemplateServiceMutationVariables,
    APITypes.CreateTemplateServiceMutation
  >;
export const deleteTemplateService =
  /* GraphQL */ `mutation DeleteTemplateService($input: DeleteTemplateServiceInput!) {
  deleteTemplateService(input: $input) {
    templateId
    serviceId
    service {
      id
      entityId
      title
      description
      amount
      fee
      feeType
      includesGST
      searchName
      status
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
    APITypes.DeleteTemplateServiceMutationVariables,
    APITypes.DeleteTemplateServiceMutation
  >;
export const createMessage = /* GraphQL */ `mutation CreateMessage(
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
      __typename
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
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateMessageMutationVariables,
  APITypes.CreateMessageMutation
>;
export const updateMessage = /* GraphQL */ `mutation UpdateMessage(
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
      __typename
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
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateMessageMutationVariables,
  APITypes.UpdateMessageMutation
>;
export const createNotification =
  /* GraphQL */ `mutation CreateNotification($input: CreateNotificationInput) {
  createNotification(input: $input) {
    id
    title
    message
    status
    createdAt
    updatedAt
    type
    owner
    __typename
  }
}
` as GeneratedMutation<
    APITypes.CreateNotificationMutationVariables,
    APITypes.CreateNotificationMutation
  >;
export const updateNotification =
  /* GraphQL */ `mutation UpdateNotification($input: UpdateNotificationInput) {
  updateNotification(input: $input) {
    id
    title
    message
    status
    createdAt
    updatedAt
    type
    owner
    __typename
  }
}
` as GeneratedMutation<
    APITypes.UpdateNotificationMutationVariables,
    APITypes.UpdateNotificationMutation
  >;
export const createOption = /* GraphQL */ `mutation CreateOption(
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
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateOptionMutationVariables,
  APITypes.CreateOptionMutation
>;
export const updateOption = /* GraphQL */ `mutation UpdateOption(
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
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateOptionMutationVariables,
  APITypes.UpdateOptionMutation
>;
export const deleteOption = /* GraphQL */ `mutation DeleteOption(
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
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteOptionMutationVariables,
  APITypes.DeleteOptionMutation
>;
export const confirmPayments =
  /* GraphQL */ `mutation ConfirmPayments($input: ConfirmPaymentInput) {
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
    __typename
  }
}
` as GeneratedMutation<
    APITypes.ConfirmPaymentsMutationVariables,
    APITypes.ConfirmPaymentsMutation
  >;
export const createPayment =
  /* GraphQL */ `mutation CreatePayment($input: CreatePaymentInput) {
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
    __typename
  }
}
` as GeneratedMutation<
    APITypes.CreatePaymentMutationVariables,
    APITypes.CreatePaymentMutation
  >;
export const createPaymentPayId =
  /* GraphQL */ `mutation CreatePaymentPayId($input: CreatePaymentPayIdInput) {
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
      __typename
    }
    scheduledAt
    createdBy
    paymentUserId
    receivedAt
    paidOutAt
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
    APITypes.CreatePaymentPayIdMutationVariables,
    APITypes.CreatePaymentPayIdMutation
  >;
export const cancelPaymentPayId =
  /* GraphQL */ `mutation CancelPaymentPayId($input: CancelPaymentPayIdInput) {
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
    __typename
  }
}
` as GeneratedMutation<
    APITypes.CancelPaymentPayIdMutationVariables,
    APITypes.CancelPaymentPayIdMutation
  >;
export const retryPayment =
  /* GraphQL */ `mutation RetryPayment($input: RetryPaymentInput) {
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
    __typename
  }
}
` as GeneratedMutation<
    APITypes.RetryPaymentMutationVariables,
    APITypes.RetryPaymentMutation
  >;
export const createTaskPayment =
  /* GraphQL */ `mutation CreateTaskPayment($input: CreateTaskPaymentInput) {
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
    __typename
  }
}
` as GeneratedMutation<
    APITypes.CreateTaskPaymentMutationVariables,
    APITypes.CreateTaskPaymentMutation
  >;
export const createPaymentGuest =
  /* GraphQL */ `mutation CreatePaymentGuest($input: CreatePaymentGuestInput) {
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
    __typename
  }
}
` as GeneratedMutation<
    APITypes.CreatePaymentGuestMutationVariables,
    APITypes.CreatePaymentGuestMutation
  >;
export const createPaymentScheduledGuest =
  /* GraphQL */ `mutation CreatePaymentScheduledGuest($input: CreatePaymentScheduledGuestInput) {
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
    __typename
  }
}
` as GeneratedMutation<
    APITypes.CreatePaymentScheduledGuestMutationVariables,
    APITypes.CreatePaymentScheduledGuestMutation
  >;
export const createPaymentMethod =
  /* GraphQL */ `mutation CreatePaymentMethod($input: CreatePaymentMethodInput) {
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
    __typename
  }
}
` as GeneratedMutation<
    APITypes.CreatePaymentMethodMutationVariables,
    APITypes.CreatePaymentMethodMutation
  >;
export const updatePaymentMethod =
  /* GraphQL */ `mutation UpdatePaymentMethod($input: UpdatePaymentMethodInput) {
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
    __typename
  }
}
` as GeneratedMutation<
    APITypes.UpdatePaymentMethodMutationVariables,
    APITypes.UpdatePaymentMethodMutation
  >;
export const createPushNotification =
  /* GraphQL */ `mutation CreatePushNotification($input: CreatePushNotificationInput) {
  createPushNotification(input: $input)
}
` as GeneratedMutation<
    APITypes.CreatePushNotificationMutationVariables,
    APITypes.CreatePushNotificationMutation
  >;
export const updateRating =
  /* GraphQL */ `mutation UpdateRating($input: UpdateRatingInput) {
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
    __typename
  }
}
` as GeneratedMutation<
    APITypes.UpdateRatingMutationVariables,
    APITypes.UpdateRatingMutation
  >;
export const createSignature =
  /* GraphQL */ `mutation CreateSignature($input: CreateSignatureInput) {
  createSignature(input: $input) {
    id
    userId
    key
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
    APITypes.CreateSignatureMutationVariables,
    APITypes.CreateSignatureMutation
  >;
export const deleteSignature =
  /* GraphQL */ `mutation DeleteSignature($input: DeleteSignatureInput) {
  deleteSignature(input: $input) {
    id
    userId
    key
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
    APITypes.DeleteSignatureMutationVariables,
    APITypes.DeleteSignatureMutation
  >;
export const createTask =
  /* GraphQL */ `mutation CreateTask($input: CreateTaskInput) {
  createTask(input: $input) {
    entityId
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
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
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
      __typename
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
          address1
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
          __typename
        }
        logo {
          alt
          identityId
          key
          level
          type
          __typename
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
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        entityUsers {
          items {
            id
            entityId
            userId
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
                address1
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
                __typename
              }
              logo {
                alt
                identityId
                key
                level
                type
                __typename
              }
              entityBeneficialOwners {
                nextToken
                __typename
              }
              entityUsers {
                nextToken
                __typename
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
                __typename
              }
              paymentMethods {
                nextToken
                __typename
              }
              paymentMethodId
              paymentUserId
              disbursementMethodId
              receivingAccounts {
                nextToken
                __typename
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
              __typename
            }
            searchName
            createdBy
            createdAt
            updatedAt
            __typename
          }
          nextToken
          __typename
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
          __typename
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
            __typename
          }
          nextToken
          __typename
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
            __typename
          }
          nextToken
          __typename
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
        __typename
      }
      searchName
      createdBy
      createdAt
      updatedAt
      __typename
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
        __typename
      }
      nextToken
      __typename
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
    readAt
    paidAt
    completedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
    APITypes.CreateTaskMutationVariables,
    APITypes.CreateTaskMutation
  >;
export const updateTask =
  /* GraphQL */ `mutation UpdateTask($input: UpdateTaskInput) {
  updateTask(input: $input) {
    entityId
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
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
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
      __typename
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
          address1
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
          __typename
        }
        logo {
          alt
          identityId
          key
          level
          type
          __typename
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
              __typename
            }
            createdAt
            updatedAt
            owner
            __typename
          }
          nextToken
          __typename
        }
        entityUsers {
          items {
            id
            entityId
            userId
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
                address1
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
                __typename
              }
              logo {
                alt
                identityId
                key
                level
                type
                __typename
              }
              entityBeneficialOwners {
                nextToken
                __typename
              }
              entityUsers {
                nextToken
                __typename
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
                __typename
              }
              paymentMethods {
                nextToken
                __typename
              }
              paymentMethodId
              paymentUserId
              disbursementMethodId
              receivingAccounts {
                nextToken
                __typename
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
              __typename
            }
            searchName
            createdBy
            createdAt
            updatedAt
            __typename
          }
          nextToken
          __typename
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
          __typename
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
            __typename
          }
          nextToken
          __typename
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
            __typename
          }
          nextToken
          __typename
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
        __typename
      }
      searchName
      createdBy
      createdAt
      updatedAt
      __typename
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
        __typename
      }
      nextToken
      __typename
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
    readAt
    paidAt
    completedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
    APITypes.UpdateTaskMutationVariables,
    APITypes.UpdateTaskMutation
  >;
export const updateTaskGuest =
  /* GraphQL */ `mutation UpdateTaskGuest($input: UpdateTaskGuestInput) {
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
      __typename
    }
    from {
      id
      name
      createdAt
      updatedAt
      __typename
    }
    fromContact {
      id
      firstName
      lastName
      name
      createdAt
      updatedAt
      __typename
    }
    fromType
    toEntity {
      id
      name
      createdAt
      updatedAt
      __typename
    }
    toContact {
      id
      firstName
      lastName
      name
      createdAt
      updatedAt
      __typename
    }
    toId
    to {
      id
      name
      createdAt
      updatedAt
      __typename
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
      __typename
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
    __typename
  }
}
` as GeneratedMutation<
    APITypes.UpdateTaskGuestMutationVariables,
    APITypes.UpdateTaskGuestMutation
  >;
export const createTaskDocumentUrl =
  /* GraphQL */ `mutation CreateTaskDocumentUrl($input: CreateTaskDocumentUrlInput) {
  createTaskDocumentUrl(input: $input) {
    url
    expiresAt
    __typename
  }
}
` as GeneratedMutation<
    APITypes.CreateTaskDocumentUrlMutationVariables,
    APITypes.CreateTaskDocumentUrlMutation
  >;
export const createTaskDocumentUrlGuest =
  /* GraphQL */ `mutation CreateTaskDocumentUrlGuest($input: CreateTaskDocumentUrlInput) {
  createTaskDocumentUrlGuest(input: $input) {
    url
    expiresAt
    __typename
  }
}
` as GeneratedMutation<
    APITypes.CreateTaskDocumentUrlGuestMutationVariables,
    APITypes.CreateTaskDocumentUrlGuestMutation
  >;
export const createTranslation =
  /* GraphQL */ `mutation CreateTranslation($input: CreateTranslationInput) {
  createTranslation(input: $input) {
    language
    namespace
    data
    __typename
  }
}
` as GeneratedMutation<
    APITypes.CreateTranslationMutationVariables,
    APITypes.CreateTranslationMutation
  >;
export const updateTranslation =
  /* GraphQL */ `mutation UpdateTranslation($input: UpdateTranslationInput) {
  updateTranslation(input: $input) {
    language
    namespace
    data
    __typename
  }
}
` as GeneratedMutation<
    APITypes.UpdateTranslationMutationVariables,
    APITypes.UpdateTranslationMutation
  >;
export const updateUser =
  /* GraphQL */ `mutation UpdateUser($input: UpdateUserInput) {
  updateUser(input: $input) {
    id
    identityId
    referralCode
    referredBy
    email
    about
    firstName
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
      __typename
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
        __typename
      }
      nextToken
      __typename
    }
    userType
    rating
    reportReasons
    notificationPreferences {
      email
      push
      sms
      __typename
    }
    paymentUserId
    providerWalletId
    providerNppCrn
    ipAddress
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
    APITypes.UpdateUserMutationVariables,
    APITypes.UpdateUserMutation
  >;
export const blockUser =
  /* GraphQL */ `mutation BlockUser($input: BlockUserInput) {
  blockUser(input: $input) {
    id
    identityId
    referralCode
    referredBy
    email
    about
    firstName
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
      __typename
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
        __typename
      }
      nextToken
      __typename
    }
    userType
    rating
    reportReasons
    notificationPreferences {
      email
      push
      sms
      __typename
    }
    paymentUserId
    providerWalletId
    providerNppCrn
    ipAddress
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
    APITypes.BlockUserMutationVariables,
    APITypes.BlockUserMutation
  >;
export const deleteAccount = /* GraphQL */ `mutation DeleteAccount {
  deleteAccount {
    id
    identityId
    referralCode
    referredBy
    email
    about
    firstName
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
      __typename
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
        __typename
      }
      nextToken
      __typename
    }
    userType
    rating
    reportReasons
    notificationPreferences {
      email
      push
      sms
      __typename
    }
    paymentUserId
    providerWalletId
    providerNppCrn
    ipAddress
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteAccountMutationVariables,
  APITypes.DeleteAccountMutation
>;
export const createUserConversation =
  /* GraphQL */ `mutation CreateUserConversation(
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
        __typename
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
            __typename
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
          __typename
        }
        nextToken
        __typename
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
              __typename
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
                __typename
              }
              nextToken
              __typename
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
                __typename
              }
              nextToken
              __typename
            }
            users
            readBy
            createdBy
            createdAt
            updatedAt
            id
            __typename
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
              __typename
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
                __typename
              }
              nextToken
              __typename
            }
            userType
            rating
            reportReasons
            notificationPreferences {
              email
              push
              sms
              __typename
            }
            paymentUserId
            providerWalletId
            providerNppCrn
            ipAddress
            createdAt
            updatedAt
            owner
            __typename
          }
          users
          createdAt
          updatedAt
          id
          conversationUserConversationsId
          __typename
        }
        nextToken
        __typename
      }
      users
      readBy
      createdBy
      createdAt
      updatedAt
      id
      __typename
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
        __typename
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
          __typename
        }
        nextToken
        __typename
      }
      userType
      rating
      reportReasons
      notificationPreferences {
        email
        push
        sms
        __typename
      }
      paymentUserId
      providerWalletId
      providerNppCrn
      ipAddress
      createdAt
      updatedAt
      owner
      __typename
    }
    users
    createdAt
    updatedAt
    id
    conversationUserConversationsId
    __typename
  }
}
` as GeneratedMutation<
    APITypes.CreateUserConversationMutationVariables,
    APITypes.CreateUserConversationMutation
  >;
export const updateUserConversation =
  /* GraphQL */ `mutation UpdateUserConversation(
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
        __typename
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
            __typename
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
          __typename
        }
        nextToken
        __typename
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
              __typename
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
                __typename
              }
              nextToken
              __typename
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
                __typename
              }
              nextToken
              __typename
            }
            users
            readBy
            createdBy
            createdAt
            updatedAt
            id
            __typename
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
              __typename
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
                __typename
              }
              nextToken
              __typename
            }
            userType
            rating
            reportReasons
            notificationPreferences {
              email
              push
              sms
              __typename
            }
            paymentUserId
            providerWalletId
            providerNppCrn
            ipAddress
            createdAt
            updatedAt
            owner
            __typename
          }
          users
          createdAt
          updatedAt
          id
          conversationUserConversationsId
          __typename
        }
        nextToken
        __typename
      }
      users
      readBy
      createdBy
      createdAt
      updatedAt
      id
      __typename
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
        __typename
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
          __typename
        }
        nextToken
        __typename
      }
      userType
      rating
      reportReasons
      notificationPreferences {
        email
        push
        sms
        __typename
      }
      paymentUserId
      providerWalletId
      providerNppCrn
      ipAddress
      createdAt
      updatedAt
      owner
      __typename
    }
    users
    createdAt
    updatedAt
    id
    conversationUserConversationsId
    __typename
  }
}
` as GeneratedMutation<
    APITypes.UpdateUserConversationMutationVariables,
    APITypes.UpdateUserConversationMutation
  >;
export const deleteUserConversation =
  /* GraphQL */ `mutation DeleteUserConversation(
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
        __typename
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
            __typename
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
          __typename
        }
        nextToken
        __typename
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
              __typename
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
                __typename
              }
              nextToken
              __typename
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
                __typename
              }
              nextToken
              __typename
            }
            users
            readBy
            createdBy
            createdAt
            updatedAt
            id
            __typename
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
              __typename
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
                __typename
              }
              nextToken
              __typename
            }
            userType
            rating
            reportReasons
            notificationPreferences {
              email
              push
              sms
              __typename
            }
            paymentUserId
            providerWalletId
            providerNppCrn
            ipAddress
            createdAt
            updatedAt
            owner
            __typename
          }
          users
          createdAt
          updatedAt
          id
          conversationUserConversationsId
          __typename
        }
        nextToken
        __typename
      }
      users
      readBy
      createdBy
      createdAt
      updatedAt
      id
      __typename
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
        __typename
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
          __typename
        }
        nextToken
        __typename
      }
      userType
      rating
      reportReasons
      notificationPreferences {
        email
        push
        sms
        __typename
      }
      paymentUserId
      providerWalletId
      providerNppCrn
      ipAddress
      createdAt
      updatedAt
      owner
      __typename
    }
    users
    createdAt
    updatedAt
    id
    conversationUserConversationsId
    __typename
  }
}
` as GeneratedMutation<
    APITypes.DeleteUserConversationMutationVariables,
    APITypes.DeleteUserConversationMutation
  >;
export const publishUserMessage =
  /* GraphQL */ `mutation PublishUserMessage($userId: ID!) {
  publishUserMessage(userId: $userId) {
    conversationId
    text
    attachments {
      identityId
      key
      level
      type
      __typename
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
    __typename
  }
}
` as GeneratedMutation<
    APITypes.PublishUserMessageMutationVariables,
    APITypes.PublishUserMessageMutation
  >;
export const xeroCreateConsentUrl =
  /* GraphQL */ `mutation XeroCreateConsentUrl($input: XeroCreateConsentUrlInput) {
  xeroCreateConsentUrl(input: $input)
}
` as GeneratedMutation<
    APITypes.XeroCreateConsentUrlMutationVariables,
    APITypes.XeroCreateConsentUrlMutation
  >;
export const getUpdatePayToAgreement =
  /* GraphQL */ `mutation GetUpdatePayToAgreement($input: GetUpdatePayToAgreementInput!) {
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
        address1
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
        __typename
      }
      logo {
        alt
        identityId
        key
        level
        type
        __typename
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
            __typename
          }
          createdAt
          updatedAt
          owner
          __typename
        }
        nextToken
        __typename
      }
      entityUsers {
        items {
          id
          entityId
          userId
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
              address1
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
              __typename
            }
            logo {
              alt
              identityId
              key
              level
              type
              __typename
            }
            entityBeneficialOwners {
              items {
                entityId
                beneficialOwnerId
                createdAt
                updatedAt
                owner
                __typename
              }
              nextToken
              __typename
            }
            entityUsers {
              items {
                id
                entityId
                userId
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
                __typename
              }
              nextToken
              __typename
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
              __typename
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
                __typename
              }
              nextToken
              __typename
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
                __typename
              }
              nextToken
              __typename
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
            __typename
          }
          searchName
          createdBy
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
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
        __typename
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
          __typename
        }
        nextToken
        __typename
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
          __typename
        }
        nextToken
        __typename
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
      __typename
    }
    paymentFrequency
    amount
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
    APITypes.GetUpdatePayToAgreementMutationVariables,
    APITypes.GetUpdatePayToAgreementMutation
  >;
export const createPaymentMethodToken =
  /* GraphQL */ `mutation CreatePaymentMethodToken($input: CreatePaymentMethodTokenInput) {
  createPaymentMethodToken(input: $input) {
    token
    userId
    __typename
  }
}
` as GeneratedMutation<
    APITypes.CreatePaymentMethodTokenMutationVariables,
    APITypes.CreatePaymentMethodTokenMutation
  >;
export const createPayToAgreement =
  /* GraphQL */ `mutation CreatePayToAgreement($input: CreatePayToAgreementInput) {
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
        address1
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
        __typename
      }
      logo {
        alt
        identityId
        key
        level
        type
        __typename
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
            __typename
          }
          createdAt
          updatedAt
          owner
          __typename
        }
        nextToken
        __typename
      }
      entityUsers {
        items {
          id
          entityId
          userId
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
              address1
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
              __typename
            }
            logo {
              alt
              identityId
              key
              level
              type
              __typename
            }
            entityBeneficialOwners {
              items {
                entityId
                beneficialOwnerId
                createdAt
                updatedAt
                owner
                __typename
              }
              nextToken
              __typename
            }
            entityUsers {
              items {
                id
                entityId
                userId
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
                __typename
              }
              nextToken
              __typename
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
              __typename
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
                __typename
              }
              nextToken
              __typename
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
                __typename
              }
              nextToken
              __typename
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
            __typename
          }
          searchName
          createdBy
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
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
        __typename
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
          __typename
        }
        nextToken
        __typename
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
          __typename
        }
        nextToken
        __typename
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
      __typename
    }
    paymentFrequency
    amount
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
    APITypes.CreatePayToAgreementMutationVariables,
    APITypes.CreatePayToAgreementMutation
  >;
export const validatePayToAgreement =
  /* GraphQL */ `mutation ValidatePayToAgreement($input: ValidatePayToAgreementInput) {
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
        address1
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
        __typename
      }
      logo {
        alt
        identityId
        key
        level
        type
        __typename
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
            __typename
          }
          createdAt
          updatedAt
          owner
          __typename
        }
        nextToken
        __typename
      }
      entityUsers {
        items {
          id
          entityId
          userId
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
              address1
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
              __typename
            }
            logo {
              alt
              identityId
              key
              level
              type
              __typename
            }
            entityBeneficialOwners {
              items {
                entityId
                beneficialOwnerId
                createdAt
                updatedAt
                owner
                __typename
              }
              nextToken
              __typename
            }
            entityUsers {
              items {
                id
                entityId
                userId
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
                __typename
              }
              nextToken
              __typename
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
              __typename
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
                __typename
              }
              nextToken
              __typename
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
                __typename
              }
              nextToken
              __typename
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
            __typename
          }
          searchName
          createdBy
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
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
        __typename
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
          __typename
        }
        nextToken
        __typename
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
          __typename
        }
        nextToken
        __typename
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
      __typename
    }
    paymentFrequency
    amount
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
    APITypes.ValidatePayToAgreementMutationVariables,
    APITypes.ValidatePayToAgreementMutation
  >;
