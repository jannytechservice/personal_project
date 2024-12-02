import { gql, useQuery } from '@apollo/client';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useMemo } from 'react';
import {
  CSGetSub as GET_SUB,
  OnboardingStatus,
  Service,
} from '@admiin-com/ds-graphql';
import { getUser as GET_USER } from '@admiin-com/ds-graphql';
import { getOnboardingPath } from '../../helpers/onboarding';
import { useMediaQuery, useTheme } from '@mui/material';

import MainLayout, {
  MainLayoutGridType,
} from '../../components/MainLayout/MainLayout';
import { useServiceSelection } from './useServiceSelection';
import ToolbarLayout from '../../components/ToolbarLayout/ToolbarLayout';
import { useTranslation } from 'react-i18next';
import { WBTextField, WBToolbar } from '@admiin-com/ds-web';
import { useServices } from './useServices';
import { useDebounce } from '@admiin-com/ds-hooks';
import { ServicesList } from '../../components/ServicesList';
import ServiceDetail from '../ServiceDetail';
import CreateServiceModal from '../ServiceCreateModal';

const PageContext = React.createContext<any>(null);

const Services = () => {
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

  const {
    selected,
    detailView,
    setSelected,
    loading: loadingItem,
  } = useServiceSelection();

  const handleSelection = (item: Service | null) => {
    setSelected(item);
  };

  let gridType = 'All';
  if (detailView && isDownLg) gridType = 'Right';
  else if (isDownLg && !detailView) gridType = 'Left';

  const handleBackToLeft = () => {
    setSelected(null);
  };

  const { t } = useTranslation();
  const [createModalOpen, setCreateModalOpen] = React.useState<boolean>(false);

  const handleCreateNew = () => {
    setCreateModalOpen(true);
  };

  const [searchName, setSearchName] = React.useState<string>('');

  const debouncedSearchName = useDebounce(searchName.toLocaleLowerCase(), 100);

  const { services, handleLoadMore, hasNextPage, loading } = useServices({
    searchName: debouncedSearchName,
  });

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(event.target.value);
  };

  return (
    <PageContext.Provider
      value={{
        selected,
        loading: loadingItem,
        handleSelection,
      }}
    >
      <MainLayout
        onBackToLeft={handleBackToLeft}
        background="linear-gradient(to bottom, rgba(140, 81, 255, 0.7) 0%, transparent 25%)"
        gridType={gridType as MainLayoutGridType}
        toolbarComponent={
          <>
            <ToolbarLayout
              title={t('servicesTitle', { ns: 'services' })}
              onAddClick={(e) => handleCreateNew()}
            >
              <WBToolbar sx={{ mt: 4.5 }}>
                <WBTextField
                  variant="outlined"
                  leftIcon={'Search'}
                  placeholder="Search"
                  value={searchName}
                  onChange={onSearch}
                  InputProps={{
                    sx: {
                      ...theme.typography.body2,
                      fontWeight: 'bold',
                      color: theme.palette.common.white,
                    },
                  }}
                  fullWidth
                />
              </WBToolbar>
            </ToolbarLayout>

            <ServicesList
              loading={loading}
              selected={selected}
              handleLoadMore={handleLoadMore}
              items={services}
              query={debouncedSearchName}
              setSelected={handleSelection}
              onAddClick={() => handleCreateNew()}
              hasNextPage={hasNextPage}
            />
            <CreateServiceModal
              open={createModalOpen}
              onClose={() => setCreateModalOpen(false)}
            />
          </>
        }
      >
        {selected ? <ServiceDetail /> : null}
      </MainLayout>
    </PageContext.Provider>
  );
};

export const usePageContext = () => {
  const context = React.useContext(PageContext);

  return context || { selected: null };
};

export default Services;
