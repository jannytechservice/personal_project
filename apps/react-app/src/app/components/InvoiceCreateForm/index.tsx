import { InvoiceCreateForm } from './InvoiceCreateForm';
import OnboardingMessage from './OnboardingMessage';
import { useTasks } from '../../hooks/useTasks/useTasks';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTaskCreationContext } from '../../pages/TaskCreation/TaskCreation';

export const InvoiceCreateFormContainer = () => {
  const { tasks } = useTasks();
  const { t } = useTranslation();

  const { task } = useTaskCreationContext();

  const [isOnboarding, setIsOnboarding] = React.useState(false);

  React.useEffect(() => {
    if (tasks.length === 0) {
      setIsOnboarding(true);
    } else setIsOnboarding(false);
  }, [tasks]);

  React.useEffect(() => {
    if (task && task.status === 'DRAFT') setIsOnboarding(false);
  }, [task]);

  return isOnboarding ? (
    <OnboardingMessage
      onGetStarted={() => setIsOnboarding(false)}
      title={t('sendInvoiceTitle', { ns: 'taskbox' })}
      description={t('sendInvoiceMessage', { ns: 'taskbox' })}
      buttonTitle={t('getStarted', { ns: 'taskbox' })}
    />
  ) : (
    <InvoiceCreateForm />
  );
};
