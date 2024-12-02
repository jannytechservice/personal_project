import { gql, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useMemo } from 'react';
import {
  Contact,
  CSGetSub as GET_SUB,
  OnboardingStatus,
} from '@admiin-com/ds-graphql';
import { getUser as GET_USER } from '@admiin-com/ds-graphql';
import { getOnboardingPath } from '../../helpers/onboarding';
import { useMediaQuery, useTheme } from '@mui/material';

import MainLayout, {
  MainLayoutGridType,
} from '../../components/MainLayout/MainLayout';
import ContactsToolbar from '../../components/ContactsToolbar/ContactsToolbar';
import ContactDetail from '../ContactDetail/ContactDetail';
import { useContactSelection } from '../../hooks/useContactSelection/useContactSelection';

const ContactContext = React.createContext<any>(null);

const Contacts = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDownLg = useMediaQuery(theme.breakpoints.down('lg'));
  const { data: subData } = useQuery(gql(GET_SUB));
  const { data: userData } = useQuery(gql(GET_USER), {
    variables: {
      id: subData?.sub,
    },
    skip: !subData?.sub,
  });
  const user = useMemo(() => userData?.getUser || {}, [userData]);

  useEffect(() => {
    if (user?.id && user.onboardingStatus !== OnboardingStatus.COMPLETED) {
      navigate(getOnboardingPath(user), { replace: true });
    }
  }, [user, navigate]);

  const [isCreateFormView, setCreateFormView] = React.useState<boolean>(false);

  const { selectedContact, detailView, setSelectedContact } =
    useContactSelection();

  const handleCreateForm = () => {
    setSelectedContact(null);
    setCreateFormView(true);
  };

  const handleContactSelection = (contact: Contact | null) => {
    setCreateFormView(false);
    setSelectedContact(contact);
  };

  let gridType = 'All';
  if ((isCreateFormView || detailView) && isDownLg) gridType = 'Right';
  else if (isDownLg && !isCreateFormView && !detailView) gridType = 'Left';

  const handleBackToLeft = () => {
    setSelectedContact(null);
    setCreateFormView(false);
  };

  return (
    <ContactContext.Provider
      value={{
        isCreateFormView,
        selectedContact,
        detailView,
        handleContactSelection,
      }}
    >
      <MainLayout
        onBackToLeft={handleBackToLeft}
        background="linear-gradient(to bottom, rgba(140, 81, 255, 0.7) 0%, transparent 25%)"
        gridType={gridType as MainLayoutGridType}
        toolbarComponent={
          <ContactsToolbar
            handleSelected={handleContactSelection}
            handleCreateNew={handleCreateForm}
            selectedContact={selectedContact}
          />
        }
      >
        {isCreateFormView || selectedContact ? <ContactDetail /> : null}
      </MainLayout>
    </ContactContext.Provider>
  );
};

export const useContactsContext = () => {
  const context = React.useContext(ContactContext);

  return context || { selectedContact: null };
};

export default Contacts;
