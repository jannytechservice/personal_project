import {
  Entity,
  EntityType,
  FromToType,
  Payment,
  Task,
} from 'dependency-layer/API';
import { BEContact } from 'dependency-layer/be.types';
import { getRecord } from 'dependency-layer/dynamoDB';
import {
  getCustomDescriptor,
  validateContactFrom,
  validateContactTo,
  validateEntityFrom,
  validateEntityTo,
  validateToFromData,
} from 'dependency-layer/zai/validations';

export interface GetFromToData {
  buyerId: string;
  sellerId: string;
  isTaxBill: boolean;
  sellerPhone: string;
  customDescriptor: string;
  buyerPaymentMethodId: string;
}

// TODO: as generally a single buyer, might be able to pass the buyer instead of fetching each call. Or separate from buyer data / seller data
export const getPaymentFromToData = async (
  taskOrPayment: Task | Payment
): Promise<GetFromToData> => {
  const { TABLE_CONTACT, TABLE_ENTITY } = process.env;

  if (!TABLE_ENTITY || !TABLE_CONTACT) {
    throw new Error('TABLES_NOT_DEFINED');
  }

  const data: GetFromToData = {
    buyerId: '',
    sellerId: '',
    isTaxBill: false,
    sellerPhone: '',
    customDescriptor: '',
    buyerPaymentMethodId: '', // https://support.hellozai.com/payment-descriptors
  };

  // TO / BUYER
  // payment buyer is an entity
  let entityTo;
  if (taskOrPayment.toType === FromToType.ENTITY) {
    try {
      entityTo = await getRecord(TABLE_ENTITY ?? '', {
        id: taskOrPayment.toId,
      });
      console.log('buyerEntity: ', entityTo);
      data.buyerPaymentMethodId = entityTo.paymentMethodId;
      data.buyerId = entityTo.paymentUserId;
    } catch (err: any) {
      console.log('ERROR get entity: ', err);
      throw new Error(err.message);
    }

    validateEntityTo(entityTo);
  }

  // payment buyer is a contact
  else if (taskOrPayment.toType === FromToType.CONTACT) {
    let contactTo;
    try {
      contactTo = await getRecord(TABLE_CONTACT ?? '', {
        id: taskOrPayment.toId,
      });
      console.log('buyerContact: ', contactTo);
    } catch (err: any) {
      console.log('ERROR get contact: ', err);
      throw new Error(err.message);
    }

    validateContactTo(contactTo);

    data.buyerId = contactTo.paymentUserId;
  }

  // FROM / SELLER
  // payment seller is a contact
  if (taskOrPayment.fromType === FromToType.ENTITY) {
    let entityFrom: Entity | null = null;
    try {
      entityFrom = await getRecord(TABLE_ENTITY ?? '', {
        id: taskOrPayment.fromId,
      });
      console.log('sellerEntity: ', entityFrom);
    } catch (err: any) {
      console.log('ERROR get entity: ', err);
      throw new Error(err.message);
    }

    validateEntityFrom(entityFrom);

    if (entityFrom) {
      data.sellerPhone = entityFrom?.contact?.phone ?? '';

      if (entityFrom?.type === EntityType.BPAY) {
        data.isTaxBill = entityFrom.subCategory === 'TAX';
        data.sellerId = `${entityTo.paymentUserId}_BILLPAY`;
      }

      // normal user entity
      else {
        data.sellerId = entityFrom?.paymentUserId ?? '';
      }

      data.customDescriptor = getCustomDescriptor({
        name: entityFrom.legalName ?? '',
      });
    }
  }

  // payment seller is an entity
  else if (taskOrPayment.fromType === FromToType.CONTACT) {
    let contactFrom: BEContact | null;
    try {
      contactFrom = await getRecord(TABLE_CONTACT ?? '', {
        id: taskOrPayment.fromId,
      });
      console.log('sellerContact: ', contactFrom);
    } catch (err: any) {
      console.log('ERROR get contact: ', err);
      throw new Error(err.message);
    }

    validateContactFrom(contactFrom);

    data.sellerId = `${entityTo.paymentUserId}_BILLPAY`;
    data.sellerPhone = entityTo.contact.phone;

    data.customDescriptor = getCustomDescriptor({
      name: contactFrom?.name ?? '',
    });
  }

  validateToFromData(data);

  return data;
};
