const { VITE_ENV } = import.meta.env;

export const createHostedFields = () => {
  console.log('VITE_ENV: ', VITE_ENV);
  return assembly.hostedFields({
    environment: VITE_ENV === 'prod' ? 'production' : 'pre-live',
  });
};
