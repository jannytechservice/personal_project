/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const abrLookup = /* GraphQL */ `
  query AbrLookup($abn: String) {
    abrLookup(abn: $abn) {
      abn
      abnStatus
      abnStatusEffectiveFrom
      acn
      addressDate
      addressPostcode
      addressState
      businessName
      entityName
      entityTypeCode
      entityTypeName
      gst
      message
      type
    }
  }
`;
export const abrLookupByName = /* GraphQL */ `
  query AbrLookupByName($name: String) {
    abrLookupByName(name: $name) {
      items {
        abn
        abnStatus
        isCurrent
        name
        nameType
        postcode
        state
      }
    }
  }
`;
export const getAdmin = /* GraphQL */ `
  query GetAdmin($id: ID!) {
    getAdmin(id: $id) {
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
export const listAdmins = /* GraphQL */ `
  query ListAdmins(
    $filter: ModelAdminFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAdmins(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const autocompleteResultsByType = /* GraphQL */ `
  query AutocompleteResultsByType(
    $type: AutocompleteType!
    $searchName: String!
    $sortDirection: ModelSortDirection
    $filter: ModelEntityFilterInput
    $limit: Int
    $nextToken: String
  ) {
    autocompleteResultsByType(
      type: $type
      searchName: $searchName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        value
        label
        info
        type
        searchName
        metadata {
          subCategory
          payoutMethod
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getAutoComplete = /* GraphQL */ `
  query GetAutoComplete($id: ID!) {
    getAutoComplete(id: $id) {
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
      contact {
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
  }
`;
export const getContact = /* GraphQL */ `
  query GetContact($id: ID!) {
    getContact(id: $id) {
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
export const contactsByEntity = /* GraphQL */ `
  query ContactsByEntity(
    $entityId: ID!
    $searchName: String
    $sortDirection: ModelSortDirection
    $from: Int
  ) {
    contactsByEntity(
      entityId: $entityId
      searchName: $searchName
      sortDirection: $sortDirection
      from: $from
    ) {
      items {
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
      total
    }
  }
`;
export const getConversation = /* GraphQL */ `
  query GetConversation($id: ID!) {
    getConversation(id: $id) {
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
export const listConversations = /* GraphQL */ `
  query ListConversations(
    $filter: ModelConversationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listConversations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getDocumentAnalysis = /* GraphQL */ `
  query GetDocumentAnalysis($id: ID!) {
    getDocumentAnalysis(id: $id) {
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
export const documentAnalysisByEntityStatus = /* GraphQL */ `
  query DocumentAnalysisByEntityStatus(
    $entityId: ID!
    $status: DocumentAnalysisStatus
  ) {
    documentAnalysisByEntityStatus(entityId: $entityId, status: $status) {
      items {
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
      nextToken
    }
  }
`;
export const getEntity = /* GraphQL */ `
  query GetEntity($id: ID!) {
    getEntity(id: $id) {
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
export const entityUsersByUser = /* GraphQL */ `
  query EntityUsersByUser(
    $sortDirection: ModelSortDirection
    $filter: ModelEntityUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    entityUsersByUser(
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
      nextToken
    }
  }
`;
export const entityUsersByEntityId = /* GraphQL */ `
  query EntityUsersByEntityId(
    $entityId: ID
    $sortDirection: ModelSortDirection
    $filter: ModelEntityUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    entityUsersByEntityId(
      entityId: $entityId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
      nextToken
    }
  }
`;
export const getBusinessLookup = /* GraphQL */ `
  query GetBusinessLookup($query: String) {
    getBusinessLookup(query: $query) {
      name
      legalNames
      businessNames
      mainNames
      tradingNames
      score
      state
      postalCode
      type
      abn
      acn
      isActive
    }
  }
`;
export const getMessage = /* GraphQL */ `
  query GetMessage($id: ID!) {
    getMessage(id: $id) {
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
export const listMessages = /* GraphQL */ `
  query ListMessages(
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
  }
`;
export const messagesByConversation = /* GraphQL */ `
  query MessagesByConversation(
    $conversationId: ID!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    messagesByConversation(
      conversationId: $conversationId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
  }
`;
export const notificationsByUser = /* GraphQL */ `
  query NotificationsByUser(
    $sortDirection: ModelSortDirection
    $filter: ModelNotificationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    notificationsByUser(
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        title
        message
        status
        createdAt
        updatedAt
        type
        owner
      }
      nextToken
    }
  }
`;
export const getOption = /* GraphQL */ `
  query GetOption($id: ID!) {
    getOption(id: $id) {
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
export const listOptions = /* GraphQL */ `
  query ListOptions(
    $filter: ModelOptionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOptions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        name
        label
        value
        group
        createdAt
        updatedAt
        id
      }
      nextToken
    }
  }
`;
export const optionsByName = /* GraphQL */ `
  query OptionsByName(
    $name: String!
    $label: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelOptionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    optionsByName(
      name: $name
      label: $label
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        name
        label
        value
        group
        createdAt
        updatedAt
        id
      }
      nextToken
    }
  }
`;
export const optionsByGroup = /* GraphQL */ `
  query OptionsByGroup(
    $group: String!
    $label: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelOptionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    optionsByGroup(
      group: $group
      label: $label
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        name
        label
        value
        group
        createdAt
        updatedAt
        id
      }
      nextToken
    }
  }
`;
export const getPaymentGuest = /* GraphQL */ `
  query GetPaymentGuest($id: ID!) {
    getPaymentGuest(id: $id) {
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
export const listRatingsByUser = /* GraphQL */ `
  query ListRatingsByUser(
    $userId: String!
    $sortDirection: ModelSortDirection
    $filter: ModelTransactionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRatingsByUser(
      userId: $userId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getService = /* GraphQL */ `
  query GetService($id: ID!) {
    getService(id: $id) {
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
export const servicesByEntity = /* GraphQL */ `
  query ServicesByEntity(
    $entityId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelServiceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    servicesByEntity(
      entityId: $entityId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getTask = /* GraphQL */ `
  query GetTask($id: ID!, $entityId: ID!) {
    getTask(id: $id, entityId: $entityId) {
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
export const getTaskGuest = /* GraphQL */ `
  query GetTaskGuest($id: ID, $entityId: ID) {
    getTaskGuest(id: $id, entityId: $entityId) {
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
export const getTaskPublic = /* GraphQL */ `
  query GetTaskPublic($token: ID!) {
    getTaskPublic(token: $token) {
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
export const tasksByEntityFrom = /* GraphQL */ `
  query TasksByEntityFrom(
    $entityId: ID!
    $status: TaskSearchStatus!
    $sortDirection: ModelSortDirection
    $filter: ModelTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    tasksByEntityFrom(
      entityId: $entityId
      status: $status
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const tasksByEntityTo = /* GraphQL */ `
  query TasksByEntityTo(
    $entityId: ID!
    $status: TaskSearchStatus!
    $sortDirection: ModelSortDirection
    $filter: ModelTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    tasksByEntityTo(
      entityId: $entityId
      status: $status
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const tasksByEntityByIdContactId = /* GraphQL */ `
  query TasksByEntityByIdContactId(
    $entityIdBy: ID!
    $contactId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    tasksByEntityByIdContactId(
      entityIdBy: $entityIdBy
      contactId: $contactId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const tasksByEntityBy = /* GraphQL */ `
  query TasksByEntityBy(
    $entityIdBy: ID!
    $status: TaskSearchStatus!
    $sortDirection: ModelSortDirection
    $filter: ModelTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    tasksByEntityBy(
      entityIdBy: $entityIdBy
      status: $status
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getTaskNumber = /* GraphQL */ `
  query GetTaskNumber($entityId: ID!) {
    getTaskNumber(entityId: $entityId) {
      id
      invoice
      quote
    }
  }
`;
export const searchTasks = /* GraphQL */ `
  query SearchTasks(
    $searchName: String!
    $sortDirection: ModelSortDirection
    $filter: ModelTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    searchTasks(
      searchName: $searchName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getTransaction = /* GraphQL */ `
  query GetTransaction($id: ID!) {
    getTransaction(id: $id) {
      id
      amount
      currency
      description
      status
      type
      typeMethod
      buyerId
      taskId
      entityId
      referredBy
      createdAt
      updatedAt
    }
  }
`;
export const listTransactions = /* GraphQL */ `
  query ListTransactions(
    $filter: ModelTransactionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTransactions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        amount
        currency
        description
        status
        type
        typeMethod
        buyerId
        taskId
        entityId
        referredBy
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const transactionsByUserIdAndCreatedAt = /* GraphQL */ `
  query TransactionsByUserIdAndCreatedAt(
    $userId: String!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTransactionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    transactionsByUserIdAndCreatedAt(
      userId: $userId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        amount
        currency
        description
        status
        type
        typeMethod
        buyerId
        taskId
        entityId
        referredBy
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const transactionsByPurchaseTokenAndCreatedAt = /* GraphQL */ `
  query TransactionsByPurchaseTokenAndCreatedAt(
    $purchaseToken: String!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTransactionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    transactionsByPurchaseTokenAndCreatedAt(
      purchaseToken: $purchaseToken
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        amount
        currency
        description
        status
        type
        typeMethod
        buyerId
        taskId
        entityId
        referredBy
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getTemplate = /* GraphQL */ `
  query GetTemplate($id: ID!) {
    getTemplate(id: $id) {
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
export const templatesByEntity = /* GraphQL */ `
  query TemplatesByEntity(
    $entityId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    templatesByEntity(
      entityId: $entityId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getTranslation = /* GraphQL */ `
  query GetTranslation($language: String, $namespace: String) {
    getTranslation(language: $language, namespace: $namespace) {
      language
      namespace
      data
    }
  }
`;
export const listTranslations = /* GraphQL */ `
  query ListTranslations {
    listTranslations {
      language
      items {
        language
        namespace
        data
      }
    }
  }
`;
export const getUserConversation = /* GraphQL */ `
  query GetUserConversation($id: ID!) {
    getUserConversation(id: $id) {
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
export const listUserConversations = /* GraphQL */ `
  query ListUserConversations(
    $filter: ModelUserConversationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserConversations(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
                image {
                  alt
                  identityId
                  key
                  level
                  type
                }
                country
                messages {
                  nextToken
                }
                userConversations {
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
      nextToken
    }
  }
`;
export const userConversationsByConversationIdAndCreatedAt = /* GraphQL */ `
  query UserConversationsByConversationIdAndCreatedAt(
    $conversationId: ID!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelUserConversationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    userConversationsByConversationIdAndCreatedAt(
      conversationId: $conversationId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
                image {
                  alt
                  identityId
                  key
                  level
                  type
                }
                country
                messages {
                  nextToken
                }
                userConversations {
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
      nextToken
    }
  }
`;
export const userConversationsByUserId = /* GraphQL */ `
  query UserConversationsByUserId(
    $userId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelUserConversationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    userConversationsByUserId(
      userId: $userId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
                image {
                  alt
                  identityId
                  key
                  level
                  type
                }
                country
                messages {
                  nextToken
                }
                userConversations {
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
      nextToken
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $id: ID
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUsers(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getActivitiesByUser = /* GraphQL */ `
  query GetActivitiesByUser(
    $id: ID!
    $filter: ModelActivityFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    getActivitiesByUser(
      id: $id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
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
  }
`;
export const getReferralsByUser = /* GraphQL */ `
  query GetReferralsByUser(
    $id: ID!
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    getReferralsByUser(
      id: $id
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        userId
        referredId
        firstName
        lastName
        taskPaidCount
        referredByCode
        referredCompleted
        referredSignedStatus
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const xeroListContacts = /* GraphQL */ `
  query XeroListContacts($page: Int) {
    xeroListContacts(page: $page) {
      contactID
      contactNumber
      accountNumber
      contactStatus
      name
      firstName
      lastName
      emailAddress
      bankAccountDetails
      companyNumber
      taxNumber
      accountsReceivableTaxType
      accountsPayableTaxType
      addresses {
        addressType
        addressLine1
        addressLine2
        addressLine3
        addressLine4
        city
        region
        postalCode
        country
        attentionTo
      }
      phones {
        phoneType
        phoneNumber
        phoneAreaCode
        phoneCountryCode
      }
      isSupplier
      isCustomer
      defaultCurrency
      updatedDateUTC
      contactPersons {
        firstName
        lastName
        emailAddress
        includeInEmails
      }
      xeroNetworkKey
      mergedToContactID
      salesDefaultAccountCode
      purchasesDefaultAccountCode
      salesTrackingCategories
      purchasesTrackingCategories
      salesDefaultLineAmountType
      purchasesDefaultLineAmountType
      trackingCategoryName
      trackingCategoryOption
      paymentTerms
      website
      brandingTheme
      batchPayments
      discount
      validationErrors
      hasValidationErrors
      hasAttachments
      balances {
        accountsReceivable
        accountsPayable
      }
      statusAttributeString
    }
  }
`;
export const xeroListTransactions = /* GraphQL */ `
  query XeroListTransactions($statuses: [XeroInvoiceStatus], $page: Int) {
    xeroListTransactions(statuses: $statuses, page: $page) {
      invoiceID
      type
      status
      lineAmountTypes
      currencyCode
      date
      dueDate
      lineItems {
        lineItemID
        description
        quantity
        unitAmount
        itemCode
        accountCode
        accountID
        taxType
        taxAmount
        lineAmount
        taxNumber
        discountRate
        discountAmount
        repeatingInvoiceID
      }
      subTotal
      totalTax
      total
      invoiceNumber
      reference
      hasAttachments
      updatedDateUTC
      currencyRate
      remainingCredit
      amountDue
      amountPaid
      fullyPaidOnDate
      amountCredited
      brandingThemeID
      hasErrors
      contact {
        contactID
        contactNumber
        accountNumber
        contactStatus
        name
        firstName
        lastName
        emailAddress
        bankAccountDetails
        companyNumber
        taxNumber
        accountsReceivableTaxType
        accountsPayableTaxType
        addresses {
          addressType
          addressLine1
          addressLine2
          addressLine3
          addressLine4
          city
          region
          postalCode
          country
          attentionTo
        }
        phones {
          phoneType
          phoneNumber
          phoneAreaCode
          phoneCountryCode
        }
        isSupplier
        isCustomer
        defaultCurrency
        updatedDateUTC
        contactPersons {
          firstName
          lastName
          emailAddress
          includeInEmails
        }
        xeroNetworkKey
        mergedToContactID
        salesDefaultAccountCode
        purchasesDefaultAccountCode
        salesTrackingCategories
        purchasesTrackingCategories
        salesDefaultLineAmountType
        purchasesDefaultLineAmountType
        trackingCategoryName
        trackingCategoryOption
        paymentTerms
        website
        brandingTheme
        batchPayments
        discount
        validationErrors
        hasValidationErrors
        hasAttachments
        balances {
          accountsReceivable
          accountsPayable
        }
        statusAttributeString
      }
    }
  }
`;
export const xeroGetConnectionStatus = /* GraphQL */ `
  query XeroGetConnectionStatus {
    xeroGetConnectionStatus {
      isConnected
    }
  }
`;
export const xeroGetSyncedTenants = /* GraphQL */ `
  query XeroGetSyncedTenants {
    xeroGetSyncedTenants {
      id
      authEventId
      tenantId
      tenantType
      tenantName
      createdDateUtc
      updatedDateUtc
    }
  }
`;
export const xeroGetAccounts = /* GraphQL */ `
  query XeroGetAccounts($input: XeroGetAccountsInput) {
    xeroGetAccounts(input: $input) {
      code
      name
      accountID
      type
      bankAccountNumber
      status
      description
      bankAccountType
      currencyCode
      taxType
      enablePaymentsToAccount
      showInExpenseClaims
      _class
      systemAccount
      reportingCode
      reportingCodeName
      hasAttachments
      updatedDateUTC
      addToWatchlist
    }
  }
`;
export const getPayToFailedPayment = /* GraphQL */ `
  query GetPayToFailedPayment($instructionId: String!) {
    getPayToFailedPayment(instructionId: $instructionId) {
      id
      agreementUuid
      errorMessage
    }
  }
`;
export const getEntityPayId = /* GraphQL */ `
  query GetEntityPayId($entityId: ID!, $billPayments: [BillsPaymentInput]) {
    getEntityPayId(entityId: $entityId, billPayments: $billPayments) {
      transferAmount
      payId
      payIdReference
      currency
    }
  }
`;
