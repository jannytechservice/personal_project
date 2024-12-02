import parsePhoneNumberFromString from 'libphonenumber-js';
import { matchIsValidTel } from 'mui-tel-input';
import React from 'react';
import { isValidABN, REGEX } from '@admiin-com/ds-common';
import { CSVMapFormData } from './CsvMapFields';

import Papa from 'papaparse';
export type FailedRowDetail = {
  no: number;
  value: string;
  message: string;
  type: 'warning' | 'error';
};
interface useValidateContactDataProps {
  file?: File;
  fields: {
    firstName?: string;
    lastName?: string;
    companyName?: string;
    email?: string;
    mobile?: string;
    phone?: string;
    taxNumber?: string;
    companyNumber?: string;
    billerCode?: string;
    referenceNumber?: string;
    accountName?: string;
    accountNumber?: string;
    routingNumber?: string;
  };
}

export function useCsvContactValidation({
  file,
  fields,
}: useValidateContactDataProps) {
  const [successedRow, setSuccessedRow] = React.useState<number>(0);
  const [failedRowDetails, setFailedRowDetail] = React.useState<
    Array<FailedRowDetail>
  >([]);
  const [failedCount, setFailedCount] = React.useState<number>(0);
  const [warningCount, setWarningCount] = React.useState<number>(0);

  const [fieldNames, setFieldNames] = React.useState<string[]>([]);

  const validateContactData = ({
    firstName,
    lastName,
    mobile,
    taxNumber,
    email,
    companyName,
  }: CSVMapFormData) => {
    const errors: Array<any> = [];
    const warnings: Array<any> = [];
    //if (
    //  (companyName === '' || taxNumber === '') &&
    //  lastName === '' &&
    //  firstName === ''
    //) {
    //  errors.push({
    //    field: 'companyName',
    //    message: 'Company name and tax number is required',
    //  });
    //}

    if (taxNumber !== '' && !isValidABN(taxNumber)) {
      errors.push({
        field: 'taxNumber',
        message: 'Invalid ABN',
        type: 'error',
      });
    }
    if (companyName === '' && lastName === '' && firstName !== '') {
      errors.push({
        field: 'lastName',
        message: 'LastName name is required',
        type: 'error',
      });
    }
    if (companyName === '' && lastName !== '' && firstName === '') {
      errors.push({
        field: 'firstName',
        message: 'FirstName name is required',
        type: 'error',
      });
    }
    if (email === '') {
      errors.push({
        field: 'email',
        message: 'Email is missing',
        type: 'error',
      });
    } else if (!REGEX.EMAIL.test(email)) {
      errors.push({
        field: 'email',
        message: 'Invalid email format',
        type: 'error',
      });
    }

    if (mobile !== '') {
      if (!mobile || !parsePhoneNumberFromString(mobile, 'AU')) {
        console.log(
          'parsePhoneNumberFromString:',
          parsePhoneNumberFromString(mobile, 'AU')
        );
        errors.push({
          field: 'mobile',
          message: 'Invalid mobile number',
          type: 'warning',
        });
      }
    }
    return { errors, warnings };
  };

  //
  React.useEffect(() => {
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const records = result.data;
          if (records.length > 0) {
            let succeedRecordCount = 0;
            let failedRecordCount = 0;
            let warningRecordCount = 0;
            const errorsReport: Array<FailedRowDetail> = [];
            records.forEach((record: any, index) => {
              const firstName =
                fields.firstName && fields.firstName !== 'Ignore column'
                  ? record?.[fields.firstName]
                  : '';
              const lastName =
                fields.lastName && fields.lastName !== 'Ignore column'
                  ? record?.[fields.lastName]
                  : '';
              const mobile =
                fields.mobile && fields.mobile !== 'Ignore column'
                  ? record?.[fields.mobile]
                  : '';
              const phone =
                fields.phone && fields.phone !== 'Ignore column'
                  ? record?.[fields.phone]
                  : '';
              const email =
                fields.email && fields.email !== 'Ignore column'
                  ? record?.[fields.email]
                  : '';
              const companyName =
                fields.companyName && fields.companyName !== 'Ignore column'
                  ? record?.[fields.companyName]
                  : '';
              const taxNumber =
                fields.taxNumber && fields.taxNumber !== 'Ignore column'
                  ? record?.[fields.taxNumber]
                  : '';
              const companyNumber =
                fields.companyNumber && fields.companyNumber !== 'Ignore column'
                  ? record?.[fields.companyNumber]
                  : '';
              const accountName =
                fields.accountName && fields.accountName !== 'Ignore column'
                  ? record?.[fields.accountName]
                  : '';
              const accountNumber =
                fields.accountNumber && fields.accountNumber !== 'Ignore column'
                  ? record?.[fields.accountNumber]
                  : '';
              const billerCode =
                fields.billerCode && fields.billerCode !== 'Ignore column'
                  ? record?.[fields.billerCode]
                  : '';
              const referenceNumber =
                fields.referenceNumber &&
                fields.referenceNumber !== 'Ignore column'
                  ? record?.[fields.referenceNumber]
                  : '';
              const routingNumber =
                fields.routingNumber && fields.routingNumber !== 'Ignore column'
                  ? record?.[fields.routingNumber]
                  : '';
              const { errors } = validateContactData({
                firstName,
                lastName,
                mobile,
                phone,
                email,
                taxNumber,
                companyNumber,
                companyName,
                accountName,
                accountNumber,
                billerCode,
                referenceNumber,
                routingNumber,
              });
              if (errors.length > 0) {
                let hasError = false;
                for (const error of errors) {
                  const field = fields[error.field as keyof CSVMapFormData];
                  errorsReport.push({
                    no: index,
                    value: field ? record?.[field] : '',
                    message: error.message,
                    type: error.type,
                  });

                  if (error.type === 'error') {
                    hasError = true;
                  }
                }
                hasError ? failedRecordCount++ : warningRecordCount++;
              } else {
                succeedRecordCount++;
              }
            });
            setSuccessedRow(succeedRecordCount);
            setFailedCount(failedRecordCount);
            setWarningCount(warningRecordCount);
            setFailedRowDetail(errorsReport);
          }
        },
      });
    }
  }, [file, fields]);

  //
  React.useEffect(() => {
    if (file) {
      Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: (result: any) => {
          const records = result.data;
          if (records.length > 0) {
            const fieldNames: string[] = records[0];
            setFieldNames(fieldNames);
          }
        },
      });
    }
  }, [file]);

  return {
    successedRow,
    failedRowDetails,
    failedCount,
    warningCount,
    fieldNames,
  };
}
