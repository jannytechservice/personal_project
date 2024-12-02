import { DateTime } from 'luxon';

export const DATE_FORMATS = {
  BACKEND_DATE: 'yyyy-MM-dd',
  USER_DATE: 'dd/MM/yyyy',
  FRONT_DATE: 'LLL dd, yyyy',
  DUE_DATE: 'd MMM yyyy', // Add custom date format
};

export const isFutureDate = (date: string) => {
  return (
    DateTime.fromFormat(date, 'yyyy-MM-dd')
      .setZone('Australia/Sydney')
      .startOf('day') >
    DateTime.now().setZone('Australia/Sydney').startOf('day')
  );
};

export const isPastDate = (date: string) => {
  return (
    DateTime.fromFormat(date, 'yyyy-MM-dd')
      .setZone('Australia/Sydney')
      .startOf('day') <
    DateTime.now().setZone('Australia/Sydney').startOf('day')
  );
};

export const isTodayDate = (date: string) => {
  return (
    DateTime.fromFormat(date, 'yyyy-MM-dd')
      .setZone('Australia/Sydney')
      .startOf('day') ===
    DateTime.now().setZone('Australia/Sydney').startOf('day')
  );
};
export const isUpdatedDateNewerThanExisting = (
  updatedAt: string,
  lastUpdatedAt?: string | null
) => {
  if (!lastUpdatedAt) {
    return true;
  }

  const d1 = DateTime.fromISO(updatedAt);
  const d2 = DateTime.fromISO(lastUpdatedAt);

  if (d1 < d2) {
    console.log('updatedAt is older');
  } else if (d1 === d2) {
    console.log('updatedAt is equal');
  } else {
    console.log('updatedAt is newer');
  }
  return d1 > d2;
};

export const userDateFromBackendDate = (backendDate: string) => {
  return DateTime.fromFormat(backendDate, DATE_FORMATS.BACKEND_DATE).toFormat(
    DATE_FORMATS.USER_DATE
  );
};
