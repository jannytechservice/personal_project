import { AbrLookUpByNameItem } from 'dependency-layer/abr.types';
import axios from 'axios';

export const abrCodeToEntityTypeMap: { [key: string]: string } = {
  ADF: 'SELF_MANAGED_SUPER_FUND',
  ARF: 'SELF_MANAGED_SUPER_FUND',
  CCB: 'COMPANY',
  CCC: 'NOT_FOR_PROFIT',
  CCN: 'NOT_FOR_PROFIT',
  CCO: 'NOT_FOR_PROFIT',
  CCP: 'COMPANY',
  CCR: 'COMPANY',
  CCS: 'TRUST',
  CCT: 'COMPANY',
  CCU: 'TRUST',
  CGA: 'NOT_FOR_PROFIT',
  CGC: 'COMPANY',
  CGE: 'NOT_FOR_PROFIT',
  CGS: 'SELF_MANAGED_SUPER_FUND',
  CGT: 'TRUST',
  CMT: 'TRUST',
  COP: 'NOT_FOR_PROFIT',
  CSA: 'SELF_MANAGED_SUPER_FUND',
  CSP: 'SELF_MANAGED_SUPER_FUND',
  CSS: 'SELF_MANAGED_SUPER_FUND',
  CTC: 'TRUST',
  CTD: 'TRUST',
  CTF: 'TRUST',
  CTH: 'TRUST',
  CTI: 'TRUST',
  CTL: 'TRUST',
  CTQ: 'TRUST',
  CTT: 'TRUST',
  CTU: 'TRUST',
  CUT: 'TRUST',
  DIP: 'NOT_FOR_PROFIT',
  DIT: 'TRUST',
  DST: 'TRUST',
  DTT: 'TRUST',
  FHS: 'TRUST',
  FUT: 'TRUST',
  FXT: 'TRUST',
  HYT: 'TRUST',
  LCB: 'COMPANY',
  LCC: 'NOT_FOR_PROFIT',
  LCN: 'NOT_FOR_PROFIT',
  LCO: 'NOT_FOR_PROFIT',
  LCP: 'COMPANY',
  LCR: 'COMPANY',
  LCS: 'TRUST',
  LCT: 'COMPANY',
  LCU: 'TRUST',
  LGA: 'NOT_FOR_PROFIT',
  LGC: 'COMPANY',
  LGE: 'NOT_FOR_PROFIT',
  LGT: 'TRUST',
  LSA: 'SELF_MANAGED_SUPER_FUND',
  LSP: 'SELF_MANAGED_SUPER_FUND',
  LSS: 'SELF_MANAGED_SUPER_FUND',
  LTC: 'TRUST',
  LTD: 'TRUST',
  LTF: 'TRUST',
  LTH: 'TRUST',
  LTI: 'TRUST',
  LTL: 'TRUST',
  LTQ: 'TRUST',
  LTT: 'TRUST',
  LTU: 'TRUST',
  NPF: 'SELF_MANAGED_SUPER_FUND',
  NRF: 'SELF_MANAGED_SUPER_FUND',
  OIE: 'NOT_FOR_PROFIT',
  PDF: 'COMPANY',
  POF: 'SELF_MANAGED_SUPER_FUND',
  PQT: 'TRUST',
  PRV: 'COMPANY',
  PST: 'SELF_MANAGED_SUPER_FUND',
  PTT: 'COMPANY',
  PUB: 'COMPANY',
  PUT: 'TRUST',
  SAF: 'SELF_MANAGED_SUPER_FUND',
  SCB: 'COMPANY',
  SCC: 'NOT_FOR_PROFIT',
  SCN: 'NOT_FOR_PROFIT',
  SCO: 'NOT_FOR_PROFIT',
  SCP: 'COMPANY',
  SCR: 'COMPANY',
  SCS: 'TRUST',
  SCT: 'COMPANY',
  SCU: 'TRUST',
  SGA: 'NOT_FOR_PROFIT',
  SGC: 'COMPANY',
  SGE: 'NOT_FOR_PROFIT',
  SGT: 'TRUST',
  SMF: 'SELF_MANAGED_SUPER_FUND',
  SSA: 'SELF_MANAGED_SUPER_FUND',
  SSP: 'SELF_MANAGED_SUPER_FUND',
  SSS: 'SELF_MANAGED_SUPER_FUND',
  STC: 'TRUST',
  STD: 'TRUST',
  STF: 'TRUST',
  STH: 'TRUST',
  STI: 'TRUST',
  STL: 'TRUST',
  STQ: 'TRUST',
  STR: 'TRUST',
  STT: 'TRUST',
  STU: 'TRUST',
  SUP: 'SELF_MANAGED_SUPER_FUND',
  TCB: 'COMPANY',
  TCC: 'NOT_FOR_PROFIT',
  TCN: 'NOT_FOR_PROFIT',
  TCO: 'NOT_FOR_PROFIT',
  TCP: 'COMPANY',
  TCR: 'COMPANY',
  TCS: 'TRUST',
  TCT: 'COMPANY',
  TCU: 'TRUST',
  TGA: 'NOT_FOR_PROFIT',
  TGE: 'NOT_FOR_PROFIT',
  TGT: 'TRUST',
  TRT: 'TRUST',
  TSA: 'SELF_MANAGED_SUPER_FUND',
  TSP: 'SELF_MANAGED_SUPER_FUND',
  TSS: 'SELF_MANAGED_SUPER_FUND',
  TTC: 'TRUST',
  TTD: 'TRUST',
  TTF: 'TRUST',
  TTH: 'TRUST',
  TTI: 'TRUST',
  TTL: 'TRUST',
  TTQ: 'TRUST',
  TTT: 'TRUST',
  TTU: 'TRUST',
  UIE: 'NOT_FOR_PROFIT',
};

const { ABR_GUID } = process.env;
// TODO: Handle error? - e.g. api down
export const abrLookupByAbn = async (businessNumber: string): Promise<any> => {
  const request =
    businessNumber?.length === 9
      ? `AcnDetails.aspx?guid=${ABR_GUID}&acn=${businessNumber}`
      : `AbnDetails.aspx?guid=${ABR_GUID}&abn=${businessNumber}`;

  console.log('request: ', request);
  const companyDetails = await axios.get(
    `https://abr.business.gov.au/json/${request}`
  );
  let data = companyDetails.data.replace('callback(', '');
  data = data.slice(0, data.lastIndexOf(')'));
  console.log(`${businessNumber} data:`, data);
  const parsedData = JSON.parse(data);
  console.log('parsedData: ', parsedData);

  // Transform the data to match ABNInformation type
  const transformedData = {
    abn: parsedData.Abn,
    abnStatus: parsedData.AbnStatus,
    abnStatusEffectiveFrom: parsedData.AbnStatusEffectiveFrom,
    acn: parsedData.Acn,
    addressDate: parsedData.AddressDate || null,
    addressPostcode: parsedData.AddressPostcode || null,
    addressState: parsedData.AddressState || null,
    businessName: parsedData.BusinessName || null,
    entityName: parsedData.EntityName || null,
    entityTypeCode: parsedData.EntityTypeCode || null,
    entityTypeName: parsedData.EntityTypeName || null,
    gst: parsedData.Gst || null,
    message: parsedData.Message || null,
    type: abrCodeToEntityTypeMap[parsedData.EntityTypeCode] ?? null,
  };

  console.log(`${businessNumber} abr data:`, transformedData);
  return transformedData;
};

export const abrLookupByName = async (
  name: string,
  limit = 10
): Promise<any> => {
  const companyDetails = await axios.get(
    `https://abr.business.gov.au/json/MatchingNames.aspx?name=${name}&maxResults=${limit}&guid=${ABR_GUID}`
  );
  let data = companyDetails.data.replace('callback(', '');
  data = data.slice(0, data.lastIndexOf(')'));
  const parsedData = JSON.parse(data);
  console.log('parsedData: ', parsedData);

  const filteredResults = parsedData?.Names?.filter(
    (name: AbrLookUpByNameItem) => name.NameType !== 'Trading Name'
  );
  console.log('filteredResults: ', filteredResults);

  const mappedResults =
    filteredResults?.map((name: AbrLookUpByNameItem) => ({
      abn: name.Abn,
      abnStatus: name.AbnStatus,
      isCurrent: name.IsCurrent,
      name: name.Name,
      nameType: name.NameType,
      postcode: name.Postcode,
      state: name.State,
      //type: abrTypeToEntityTypeMap[name.NameType] ?? null
    })) ?? [];
  console.log('mappedResults: ', mappedResults);

  return mappedResults;
  //return mappedResult(
  //  parsedData?.Names?.map((name: abrLookUpByNameItem) => ({
  //    abn: name.Abn,
  //    abnStatus: name.AbnStatus,
  //    isCurrent: name.IsCurrent,
  //    name: name.Name,
  //    nameType: name.NameType,
  //    postcode: name.Postcode,
  //    state: name.State,
  //    type: abrTypeToEntityTypeMap[name.NameType] ?? null
  //  })) ?? []
  //);
};
