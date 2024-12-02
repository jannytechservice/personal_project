import { EnumEntityType } from 'dependency-layer/frankieone/frankieone.types';

export const FrankieOneEntityTypeMap = {
  COMPANY: EnumEntityType.ORGANISATION,
  TRUST: EnumEntityType.TRUST,
  NOT_FOR_PROFIT: EnumEntityType.ORGANISATION,
  SELF_MANAGED_SUPER_FUND: EnumEntityType.TRUST,
  BPAY: EnumEntityType.ORGANISATION, //TODO: COULD BE VARIOUS?
};
