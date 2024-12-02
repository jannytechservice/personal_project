import { Service } from '@admiin-com/ds-graphql';
import { WBBox, WBFlex, WBTypography } from '@admiin-com/ds-web';
import { Paper, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CurrencyNumber } from '../../components/CurrencyNumber/CurrencyNumber';

interface Props {
  service: Service | null;
}
export default function ServiceCard({ service }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();
  return service ? (
    <Paper
      sx={{
        p: { xs: 2, md: 3, lg: 3, xl: 9 },
        fontWeight: 'bold',
        fontSize: 'body2.fontSize',
        bgcolor: theme.palette.background.default,
        boxShadow: '0 41px 45px -35.5px #636363',
      }}
    >
      <WBFlex
        justifyContent={'space-between'}
        flexDirection={['column', 'column', 'row']}
        alignItems={'start'}
        width={'100%'}
      >
        <WBFlex
          mt={{ xs: 1, sm: 0 }}
          mr={2}
          alignSelf={{ xs: 'start', md: 'end' }}
        >
          <WBBox>
            <WBTypography fontWeight={'inherit'} fontSize={'inherit'}>
              {t('description', { ns: 'services' })}
            </WBTypography>
            <WBTypography
              fontWeight={'inherit'}
              fontSize={'inherit'}
              bgcolor={'background.paper'}
              p={1}
              px={2}
              noWrap
              mt={2}
            >
              {service.description}
            </WBTypography>
          </WBBox>
        </WBFlex>
        <WBBox
          ml={2}
          mt={{ xs: 3, md: 0, textAlign: { xs: 'start', md: 'end' } }}
        >
          <WBTypography
            textAlign={{ xs: 'start', md: 'end' }}
            fontWeight={'inherit'}
            textTransform={'uppercase'}
          >
            {t('totalAmount', { ns: 'taskbox' })}
          </WBTypography>
          <CurrencyNumber
            sup={false}
            number={service.amount / 100}
            textAlign={{ xs: 'start', md: 'end' }}
            fontSize={{ xs: 'h2.fontSize' }}
          />
          {/*{isPaid && (*/}
          {/*  <WBFlex*/}
          {/*    justifyContent={{ xs: 'start', md: 'end' }}*/}
          {/*    width={'100%'}*/}
          {/*  >*/}
          {/*    <BreakDownContainer.Link*/}
          {/*      title={t('showBreakDown', {*/}
          {/*        ns: 'taskbox',*/}
          {/*      })}*/}
          {/*    />*/}
          {/*  </WBFlex>*/}
          {/*)}*/}
        </WBBox>
      </WBFlex>
      {/* <WBBox mt={4}>
            <WBTypography fontWeight={'inherit'} fontSize={'inherit'}>
                {t('description', { ns: 'services' })}
            </WBTypography>
            <WBTypography
                fontWeight={'inherit'}
                fontSize={'inherit'}
                bgcolor={'background.paper'}
                p={1}
                px={2}
                noWrap
                mt={2}
            >
                {(service.description)}
            </WBTypography>
        </WBBox>*/}
      <WBFlex mt={4} gap={4}>
        <WBBox>
          <WBTypography fontWeight={'inherit'} fontSize={'inherit'}>
            {t('taxType', { ns: 'services' })}
          </WBTypography>
          <WBTypography
            fontWeight={'inherit'}
            fontSize={'inherit'}
            bgcolor={'background.paper'}
            p={1}
            px={2}
            noWrap
            mt={2}
          >
            {t(service.taxType, { ns: 'services' })}
          </WBTypography>
        </WBBox>

        <WBBox>
          <WBTypography fontWeight={'inherit'} fontSize={'inherit'}>
            {t('fee', { ns: 'services' })}
          </WBTypography>
          <WBTypography
            fontWeight={'inherit'}
            fontSize={'inherit'}
            bgcolor={'background.paper'}
            p={1}
            px={2}
            noWrap
            mt={2}
          >
            {t(service.feeType, { ns: 'services' })}
          </WBTypography>
        </WBBox>
      </WBFlex>
    </Paper>
  ) : (
    false
  );
}
