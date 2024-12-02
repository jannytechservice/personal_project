import {
  WBBox,
  WBFlex,
  WBGrid,
  WBImage,
  WBLink,
  WBTooltip,
  WBTypography,
} from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import AppleIcon from '../../../assets/icons/apple.svg';
import BrandImage1 from '../../../assets/images/apple-brand1.png';
import BrandImage2 from '../../../assets/images/apple-brand2.png';
import BrandImage3 from '../../../assets/images/apple-brand3.png';

const brandImages = [BrandImage1, BrandImage2, BrandImage3];
export const NetworkPartners = () => {
  const { t } = useTranslation();
  return (
    <>
      <WBFlex>
        <WBBox
          py={0.5}
          px={2}
          mt={6}
          sx={{ borderRadius: '14px' }}
          bgcolor={'success.main'}
          alignSelf="flex-start"
        >
          <WBTypography
            fontWeight={'medium'}
            variant="body2"
            color={'common.black'}
            textAlign={'right'}
            sx={{
              textWrap: 'nowrap',
            }}
          >
            {t('earnedTaxRewards', { ns: 'rewards' })}
          </WBTypography>
        </WBBox>
      </WBFlex>
      <WBTypography variant="h3" mt={1}>
        {t('admiinNetworkPartners', { ns: 'rewards' })}
      </WBTypography>
      <WBFlex justifyContent={'space-between'} mt={2}>
        <WBTypography>
          {t('admiinNetworkParntersDescription', { ns: 'rewards' })}
        </WBTypography>
      </WBFlex>
      <WBGrid container spacing={2} mt={5}>
        {Array.from({ length: 6 }).map((_, index) => (
          <WBGrid key={index} xs={6} md={4} position={'relative'}>
            <WBImage
              src={brandImages[Math.floor(index % brandImages.length)]}
              responsive
            />
            <WBBox
              position={'absolute'}
              sx={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/*@ts-ignore*/}
              <AppleIcon width={'100%'} height={40} />
            </WBBox>
            <WBTooltip title={t('appleTooltip', { ns: 'rewards' })}>
              <WBTypography
                fontWeight={'medium'}
                variant="body2"
                fontSize="10px"
                py={[0.5, 0.5, 1]}
                px={[0.5, 0.5, 1]}
                bgcolor={'success.main'}
                color={'common.black'}
                position={'absolute'}
                sx={{ borderRadius: '14px', right: '20px', top: '20px' }}
              >
                {t('10%', { ns: 'rewards' })}
              </WBTypography>
            </WBTooltip>
          </WBGrid>
        ))}
      </WBGrid>
      <WBFlex justifyContent={'center'} mt={3}>
        <WBLink color={'text.primary'} underline="always" fontWeight={'bold'}>
          {t('seeMoreBrands', { ns: 'rewards' })}
        </WBLink>
      </WBFlex>
    </>
  );
};
