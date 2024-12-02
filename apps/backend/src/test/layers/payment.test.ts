import { getTaskPaymentAmount } from '../../layers/dependencyLayer/opt/payment';
import { describe, expect, it } from 'vitest';
import { PaymentType } from '../../layers/dependencyLayer/opt/API';

describe('getTaskPaymentAmount', () => {
  it('(1) ATO plan first installment correctly', () => {
    const params = {
      amount: 10,
      paymentType: PaymentType.INSTALLMENTS,
      isTaxBill: true,
      isFirstInstallment: true,
      installments: 3,
    };
    expect(getTaskPaymentAmount(params)).toEqual(4);
  });

  it('(2) ATO plan first installment correctly', () => {
    const params = {
      amount: 10100,
      paymentType: PaymentType.INSTALLMENTS,
      isTaxBill: true,
      isFirstInstallment: true,
      installments: 3,
    };
    expect(getTaskPaymentAmount(params)).toEqual(3368);
  });

  it('(3) ATO plan first installment correctly', () => {
    const params = {
      amount: 760539,
      paymentType: PaymentType.INSTALLMENTS,
      isTaxBill: true,
      isFirstInstallment: true,
      installments: 11,
    };
    expect(getTaskPaymentAmount(params)).toEqual(69149);
  });

  it('(1) ATO plan second or more installments correctly', () => {
    const params = {
      amount: 10,
      paymentType: PaymentType.INSTALLMENTS,
      isTaxBill: true,
      isFirstInstallment: false,
      installments: 3,
    };
    expect(getTaskPaymentAmount(params)).toEqual(3);
  });

  it('(2) ATO plan second or more installments correctly', () => {
    const params = {
      amount: 10100,
      paymentType: PaymentType.INSTALLMENTS,
      isTaxBill: true,
      isFirstInstallment: false,
      installments: 3,
    };
    expect(getTaskPaymentAmount(params)).toEqual(3366);
  });

  it('(3)Another ATO plan second or more installments correctly', () => {
    const params = {
      amount: 760539,
      paymentType: PaymentType.INSTALLMENTS,
      isTaxBill: true,
      isFirstInstallment: false,
      installments: 11,
    };
    expect(getTaskPaymentAmount(params)).toEqual(69139);
  });

  it('ATO pay now correct', () => {
    const params = {
      amount: 12342,
      paymentType: PaymentType.PAY_NOW,
      isTaxBill: true,
    };
    expect(getTaskPaymentAmount(params)).toEqual(12342);
  });

  it('Pay now correct', () => {
    const params = {
      amount: 65078,
      paymentType: PaymentType.PAY_NOW,
      isTaxBill: false,
    };
    expect(getTaskPaymentAmount(params)).toEqual(65078);
  });
});
