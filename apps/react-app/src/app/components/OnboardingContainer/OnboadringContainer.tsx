import React, { useEffect, useMemo } from 'react';

import {
  CreateEntityInput,
  User,
  selectedEntityIdInVar,
} from '@admiin-com/ds-graphql';
import { CSGetSub as GET_SUB, OnboardingStatus } from '@admiin-com/ds-graphql';
import {
  updateUser as UPDATE_USER,
  getUser as GET_USER,
  createEntity as CREATE_ENTITY,
  entityUsersByUser as ENTITY_USERS_BY_USER,
  entityUsersByUser as LIST_ENTITY_USERS,
  getEntity as GET_ENTITY,
} from '@admiin-com/ds-graphql';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { getOnboardingPath } from '../../helpers/onboarding';
import {
  getNextOnboardingStep,
  getPrevOnboardingStep,
} from '@admiin-com/ds-common';
import { PATHS } from '../../navigation/paths';
import { FormProvider, useForm } from 'react-hook-form';
import { useSnackbar } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';

export enum OnboardingBusinessStep {
  ACCOUTANT_FIRM = 'accointant-firm',
  ADD_BUSINESS = 'add-business',
  BUSINESS_ADDRESS = 'business-address',
  BUSINESS_LOGO = 'business-logo',
}
export const onBoardingBusinessSteps = Object.values(OnboardingBusinessStep);

export const OnboardingProcessContext = React.createContext<any>(null);

interface BusinessProcessProviderProps {
  children: React.ReactNode;
  isDialog?: boolean;
  onFinal?: () => void;
}
export const BusinessProcessProvider = ({
  isDialog = false,
  children,
  onFinal,
}: BusinessProcessProviderProps) => {
  const isNotOnboarding = isDialog;
  const initalBusinessStep = !isNotOnboarding
    ? OnboardingBusinessStep.ACCOUTANT_FIRM
    : OnboardingBusinessStep.ADD_BUSINESS;
  const { data: subData, loading: loadingSub } = useQuery(gql(GET_SUB));
  const { data: userData, loading: loadingUser } = useQuery(gql(GET_USER), {
    variables: {
      id: subData?.sub,
    },
    skip: !subData || !subData?.sub,
  });
  const sub = subData?.sub;
  const user: User = useMemo(() => userData?.getUser || {}, [userData]);

  console.log('userData: ', user);
  console.log('user: ', user);

  const currentOnboardingStatus = user.onboardingStatus;
  const { data: entityData, loading: loadingEntity } = useQuery(
    gql(GET_ENTITY),
    {
      variables: {
        id: user.onboardingEntity,
      },
      skip:
        !user.onboardingEntity ||
        currentOnboardingStatus !== OnboardingStatus.BUSINESS,
    }
  );

  const [updateUser, { error: updateUserError, loading: updatingUser }] =
    useMutation(gql(UPDATE_USER));

  const [createEntity, { error: createEntityError }] = useMutation(
    gql(CREATE_ENTITY),
    {
      // update: (cache, { data: { createEntity } }) => {
      //   // Define the variables used in the GET_CONTACT query
      //   const variables = {
      //     filter: {
      //       owner: { eq: sub },
      //     },
      //   };
      //   // Read the current data from the cache for the GET_CONTACT query
      //   const entitiesData = cache.readQuery<{
      //     listEntities: { items: Entity[] };
      //   }>({
      //     query: gql(LIST_ENTITIES),
      //     variables: variables,
      //   });
      //   console.log(createEntity, entitiesData);
      //   const entities = entitiesData?.listEntities.items || [];
      //   // Update the cache with the new contact data
      //   cache.writeQuery({
      //     query: gql(LIST_ENTITIES),
      //     variables,
      //     data: {
      //       listEntities: {
      //         ...entitiesData?.listEntities,
      //         items: [createEntity, ...entities],
      //       },
      //     },
      //   });
      // },
      refetchQueries: [gql(ENTITY_USERS_BY_USER)],
    }
  );

  const navigate = useNavigate();

  const [currentBusinessStepIndex, setCurrentBusinessStepIndex] =
    React.useState(!isNotOnboarding ? 0 : 1);

  const methods = useForm<{ entity: CreateEntityInput }>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const { setValue, watch } = methods;

  useEffect(() => {
    if (entityData) {
      setValue('entity', entityData);
    }
  }, [entityData, setValue]);
  const currentBusinessStep = useMemo(
    () => onBoardingBusinessSteps[currentBusinessStepIndex],
    [currentBusinessStepIndex]
  );
  const getNextStep = () =>
    onBoardingBusinessSteps[currentBusinessStepIndex + 1];
  const previous = () =>
    setCurrentBusinessStepIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  const nextBusiness = () =>
    setCurrentBusinessStepIndex((prevIndex) =>
      Math.min(prevIndex + 1, onBoardingBusinessSteps.length - 1)
    );

  const createEntityFromOnboarding = async (input: any) => {
    const updatedData = await createEntity({
      variables: {
        input: {
          ...input,
        },
      },
      refetchQueries: [
        {
          query: gql(GET_USER),
          variables: {
            id: sub,
          },
        },
        {
          query: gql(LIST_ENTITY_USERS),
          variables: {
            limit: 50,
          },
        },
      ],

      awaitRefetchQueries: true,
    });
    if (!isNotOnboarding) {
      await updateUser({
        variables: {
          input: {
            onboardingEntity: updatedData?.data.createEntity.id,
            id: sub,
          },
        },
      });
    }
    console.log({ updatedData });
    selectedEntityIdInVar(updatedData?.data.createEntity?.id);
    localStorage.setItem(
      'selectedEntityId',
      updatedData?.data.createEntity?.id
    );
  };
  const showSnackbar = useSnackbar();
  const { t } = useTranslation();
  const gotoOnboarding = async (onboardingStatus: OnboardingStatus) => {
    if (isNotOnboarding) {
      if (onboardingStatus === OnboardingStatus.COMPLETED) {
        onFinal && onFinal();
        try {
          const entity = watch('entity');
          // if (entity.type === EntityType.INDIVIDUAL) {
          //   entity.name = `${entity.firstName} ${entity.lastName}`;
          // }
          await createEntityFromOnboarding(entity);
          showSnackbar({
            message: t('entityCreated', { ns: 'onboarding' }),
            severity: 'success',
            horizontal: 'right',
            vertical: 'bottom',
          });
        } catch (err: any) {
          showSnackbar({
            message: err.message,
            severity: 'error',
            vertical: 'bottom',
            horizontal: 'right',
          });
        }
      }
      return;
    }
    try {
      const updatedData = await updateUser({
        variables: {
          input: {
            onboardingStatus: onboardingStatus,
            id: subData?.sub,
          },
        },
      });

      const updatedUser = updatedData?.data?.updateUser;
      navigate(
        onboardingStatus !== OnboardingStatus.COMPLETED
          ? getOnboardingPath(updatedUser)
          : PATHS.onboardingComplete
      );
      initBusinessStep();
    } catch (error) {
      throw new Error("can't go to next onboarding step");
    }
  };

  const nextOnboarding = async () => {
    await gotoOnboarding(getNextOnboardingStep(user));
  };
  const prevOnboarding = async () => {
    await gotoOnboarding(getPrevOnboardingStep(user));
  };

  const finishOnboarding = async () => {
    await gotoOnboarding(OnboardingStatus.COMPLETED);
  };

  const initBusinessStep = () => {
    setCurrentBusinessStepIndex(0);
  };

  const gotoPrev = () => {
    if (isNotOnboarding) {
      if (currentBusinessStep === OnboardingBusinessStep.ADD_BUSINESS) {
        onFinal && onFinal();
        return;
      }
      previous();
    }
    if (
      currentOnboardingStatus !== OnboardingStatus.BUSINESS ||
      (currentOnboardingStatus === OnboardingStatus.BUSINESS &&
        currentBusinessStep === initalBusinessStep)
    ) {
      prevOnboarding();
    } else {
      previous();
    }
  };

  const loading = useMemo(
    () => loadingUser || loadingEntity || loadingSub,
    [loadingEntity, loadingSub, loadingUser]
  );

  return (
    <OnboardingProcessContext.Provider
      value={{
        isNotOnboarding: isNotOnboarding,
        currentOnboardingStatus,
        currentBusinessStep,
        getNextStep,
        initBusinessStep,
        updatingUser,
        updateUser,
        updateUserError,
        user,
        sub: subData?.sub,
        onboardingEntityId: user.onboardingEntity,
        nextBusiness,
        gotoPrev,
        onFinal,
        nextOnboarding,
        loading,
        createEntityFromOnboarding,
        finishOnboarding,
        createEntityError,
      }}
    >
      <FormProvider {...methods}>{children}</FormProvider>
    </OnboardingProcessContext.Provider>
  );
};

export const useOnboardingProcess = () => {
  const context = React.useContext(OnboardingProcessContext);
  if (!context) {
    throw new Error(
      'useBusinessProcess must be used within a BusinessProcessProvider'
    );
  }
  return context;
};
