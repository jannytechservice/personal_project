import { Service } from '@admiin-com/ds-graphql';
import { WBBox, WBFlex, WBSkeleton, WBTypography } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import ActionDisplay from '../../components/ActionDisplay/ActionDisplay';
import ServiceCard from './ServiceCard';
import { styled } from '@mui/material';

interface Props {
  service: Service | null;
  loading: boolean;
  handleArchive: (service: Service) => void;
  onEdit: (service: Service) => void;
}
export function ServiceDetail({
  onEdit,
  loading,
  handleArchive,
  service,
}: Props) {
  const { t } = useTranslation();

  return (
    <WBFlex
      flexDirection="column"
      justifyContent={'start'}
      mt={4}
      maxWidth="100%"
    >
      <>
        <WBFlex justifyContent={'space-between'}>
          <WBFlex alignItems={'center'}>
            {!loading ? (
              service && (
                <WBTypography
                  variant="h2"
                  mb={0}
                  ml={2}
                  component="div"
                  fontSize={{ xs: 'h3.fontSize', md: 'h2.fontSize' }}
                  color="dark"
                >
                  {service.description ?? ''}
                </WBTypography>
              )
            ) : (
              <WBSkeleton
                sx={{ borderRadius: '10px', ml: 2 }}
                width={100}
                animation={'wave'}
                height={50}
              ></WBSkeleton>
            )}
          </WBFlex>
          {service && (
            <WBFlex
              alignItems={'center'}
              sx={{ rowGap: 2, mt: { xs: -18, lg: 0 }, ml: { xs: -6, lg: 0 } }}
            >
              <ButtonTypography
                mr={2}
                mb={0}
                fontWeight={'bold'}
                variant="h5"
                onClick={() => onEdit(service)}
              >
                {t('edit', { ns: 'taskbox' })}
              </ButtonTypography>
              <ActionDisplay
                items={[
                  {
                    title: t('archiveService', { ns: 'services' }),
                    action: () => handleArchive(service),
                    color: 'error.main',
                  },
                ]}
              />
            </WBFlex>
          )}
        </WBFlex>
        <WBBox mt={{ md: 7, xs: 4 }}>
          {!loading ? (
            service && <ServiceCard service={service} />
          ) : (
            <WBSkeleton variant="rectangular" width="100%" height="500px" />
          )}
        </WBBox>
      </>
    </WBFlex>
  );
}
const ButtonTypography = styled(WBTypography)`
  cursor: pointer;
`;

export default ServiceDetail;
