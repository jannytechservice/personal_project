export const getXeroEnv = (url: string) => {
  const consentUrl = new URL(url);
  if (consentUrl.hostname.includes('localhost')) return 'LOCAL';
  else if (consentUrl.hostname.includes('app-dev')) return 'DEV';
  return undefined;
};
