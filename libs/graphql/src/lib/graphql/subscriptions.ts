/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onUpdateBeneficialOwner = /* GraphQL */ `
  subscription OnUpdateBeneficialOwner(
    $beneficialOwnerId: ID!
    $entityId: ID!
  ) {
    onUpdateBeneficialOwner(
      beneficialOwnerId: $beneficialOwnerId
      entityId: $entityId
    ) {
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
export const onUpdateDocumentAnalysis = /* GraphQL */ `
  subscription OnUpdateDocumentAnalysis($entityId: ID!) {
    onUpdateDocumentAnalysis(entityId: $entityId) {
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
export const onUpdateEntity = /* GraphQL */ `
  subscription OnUpdateEntity($entityId: ID!) {
    onUpdateEntity(entityId: $entityId) {
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
export const onCreateNotification = /* GraphQL */ `
  subscription OnCreateNotification {
    onCreateNotification {
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
