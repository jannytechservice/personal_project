import { useFormContext, useWatch } from 'react-hook-form';

export const useFormValues = () => {
  const { getValues } = useFormContext();

  return {
    ...useWatch(), // subscribe to form value updates

    ...getValues(), // always merge with latest form values
  };
};
