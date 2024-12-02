import {
  useSnackbar,
  WBBox,
  WBFlex,
  WBLinkButton,
  WBList,
  WBTextField,
  WBTypography,
} from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import ReferralBackImage from '../../../assets/icons/referral_back@2x.png?url';
import {
  numberToCurrency,
  REGEX,
  removeTrailingZeros,
} from '@admiin-com/ds-common';
import ReferralSentIcon from '../../../assets/icons/referral-send-invitation.svg';
import ReferralSignUpIcon from '../../../assets/icons/registration.svg';
import ReferralSendInvoiceIcon from '../../../assets/icons/referral-invoice.svg';
import DottedCurveIcon from '../../../assets/icons/dotted-curve.svg';
import DottedCurveBackIcon from '../../../assets/icons/dotted-curve-back.svg';
import ReferralSendIcon from '../../../assets/icons/referral-send.svg';
import { useClipboard } from '@admiin-com/ds-hooks';
import { AlertColor, styled, useTheme } from '@mui/material';
import GradientOuter from '../../../assets/images/referral-background.png';
import GradientOuterx2 from '../../../assets/images/referral-background@2x.png';
import GradientOuterx3 from '../../../assets/images/referral-background@3x.png';
import { useCurrentUser } from '../../hooks/useCurrentUser/useCurrentUser';
import { ReferredListItem } from './ReferredListItem';
import {
  getReferralsByUser,
  Referral,
  sendReferralInvitationEmail as SEND_REFERRAL_EMAILS,
} from '@admiin-com/ds-graphql';
import { gql, useMutation, useQuery } from '@apollo/client';
import { InputTags } from '../../components/InputTags/InputTags';
import React from 'react';
import PageHeaderMobile from '../../components/PageHeaderMobile/PageHeaderMobile';

export function Referrals() {
  const { t } = useTranslation('referrals');
  const [_copied, copy] = useClipboard();

  const user = useCurrentUser();
  const referralLink = `${window.location.origin}/sign-up?referralCode=${user.referralCode}`;
  const handleCopyReferralLink = () => {
    copy(referralLink);
    showSnackBar({
      message: t('linkCopied', { ns: 'referrals' }),
      severity: 'success' as AlertColor,
      horizontal: 'right',
      vertical: 'bottom',
    });
  };
  const { data: referralsData, loading } = useQuery(gql(getReferralsByUser), {
    variables: { id: user?.id },
    skip: !user?.id,
  });
  const referrals = referralsData?.getReferralsByUser?.items || [];

  const completedReferrals = referrals.filter(
    (referral: Referral) => referral?.referredCompleted
  ).length;

  const [tags, setTags] = React.useState<string[]>([]);
  const addTag = (tag: string) => {
    if (tag.match(REGEX.EMAIL)) {
      setTags((prevTags) => [...prevTags, tag]);
      return true;
    } else return false;
  };
  const removeTag = (index: number) => {
    setTags((prevTags) => prevTags.filter((_, i) => i !== index));
  };
  const [emailInputValue, setEmailInputValue] = React.useState('');
  const showSnackBar = useSnackbar();
  const [sendReferralEmails, { loading: sendReferralEmailsLoading }] =
    useMutation(gql(SEND_REFERRAL_EMAILS), {
      variables: { input: { email: tags } },
      onCompleted: () => {
        showSnackBar({
          message: t('referralEmailSent', { ns: 'referrals' }),
          severity: 'success' as AlertColor,
          horizontal: 'right',
          vertical: 'bottom',
        });
      },
      onError: (error) => {
        showSnackBar({
          message: error.message,
          severity: 'error' as AlertColor,
          horizontal: 'right',
          vertical: 'bottom',
        });
      },
    });
  const handleSendEmails = async () => {
    const emails = tags;
    if (emailInputValue.trim().match(REGEX.EMAIL)) {
      emails.push(emailInputValue.trim());
      setEmailInputValue('');
    }
    if (emails.length === 0) return;
    try {
      await sendReferralEmails({
        variables: {
          input: {
            email: emails,
          },
        },
      });
      setEmailInputValue('');
      setTags([]);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <WBBox my={[3, 7]} mx={[3, 3, 3, 10]}>
      <PageHeaderMobile>
        <WBTypography
          variant="h2"
          noWrap
          component="div"
          color="text.primary"
          sx={{ flexGrow: 1, textAlign: { xs: 'left', sm: 'left' } }}
        >
          {t('referrals', { ns: 'referrals' })}
          <WBBox
            sx={{
              display: { xs: 'none', sm: 'inline-block' },
              backgroundImage: `url(${ReferralBackImage})`,
              backgroundSize: 'contain', // Ensures the image covers the entire box
              backgroundPosition: 'center', // Centers the image within the box
              backgroundRepeat: 'no-repeat', // Prevents the image from repeating
            }}
            p={1}
            ml={2}
          >
            <WBTypography
              display={{ xs: 'none', sm: 'flex' }}
              component={'div'}
              mb={0}
              variant={'h3'}
              justifyContent={'center'}
              alignItems={'center'}
              color="white"
            >
              {removeTrailingZeros(numberToCurrency(50))}
            </WBTypography>
          </WBBox>
        </WBTypography>
      </PageHeaderMobile>

      <WBFlex flexDirection={['column', 'column', 'row']}>
        <WBBox flex={2}>
          <WBLinkButton
            color="primary.main"
            sx={{
              textDecoration: 'underline',
            }}
            onClick={() => {
              handleCopyReferralLink();
            }}
          >
            {t('inviteYourFriends', { ns: 'referrals' })}
          </WBLinkButton>{' '}
          <WBTypography component={'span'}>
            {t('referralDescription', { ns: 'referrals' })}
          </WBTypography>{' '}
          <WBTypography component={'span'} fontWeight={'bold'}>
            {'$50AUD'}
          </WBTypography>
          <WBFlex mt={8} position="relative" flexDirection={['column', 'row']}>
            <WBFlex
              flexDirection={'column'}
              alignItems={'center'}
              flex={6}
              mb={[4, 0]}
            >
              <WBFlex
                flexDirection={'column'}
                bgcolor={'primary.900'}
                width={'100px'}
                height={'100px'}
                borderRadius={'100%'}
                justifyContent={'center'}
                alignItems={'center'}
              >
                {/**@ts-ignore */}
                <ReferralSentIcon width={'30px'} height={'30px'} />
              </WBFlex>
              <WBTypography fontWeight={'bold'} mt={1} textAlign={'center'}>
                {t('sendInvitation', { ns: 'referrals' })}
              </WBTypography>
              <WBTypography mt={1} textAlign={'center'} variant="body2">
                {t('sendInvitationDescription', { ns: 'referrals' })}
              </WBTypography>
            </WBFlex>
            <WBFlex flex={4}></WBFlex>
            <WBFlex
              my={[4, 0]}
              flexDirection={'column'}
              alignItems={'center'}
              flex={6}
            >
              <WBFlex
                flexDirection={'column'}
                bgcolor={'primary.900'}
                width={'100px'}
                height={'100px'}
                borderRadius={'100%'}
                justifyContent={'center'}
                alignItems={'center'}
              >
                {/**@ts-ignore */}
                <ReferralSignUpIcon width={'30px'} height={'30px'} />
              </WBFlex>
              <WBTypography fontWeight={'bold'} mt={1} textAlign={'center'}>
                {t('registration', { ns: 'referrals' })}
              </WBTypography>
              <WBTypography mt={1} textAlign={'center'} variant="body2">
                {t('registrationDescription', { ns: 'referrals' })}
              </WBTypography>
            </WBFlex>
            <WBFlex flex={4}></WBFlex>
            <WBFlex
              my={[4, 0]}
              flexDirection={'column'}
              alignItems={'center'}
              flex={6}
            >
              <WBFlex
                flexDirection={'column'}
                bgcolor={'primary.900'}
                width={'100px'}
                height={'100px'}
                borderRadius={'100%'}
                justifyContent={'center'}
                alignItems={'center'}
              >
                {/**@ts-ignore */}
                <ReferralSendInvoiceIcon width={'30px'} height={'30px'} />
              </WBFlex>
              <WBTypography fontWeight={'bold'} mt={1} textAlign={'center'}>
                {t('send4Invoices', { ns: 'referrals' })}
              </WBTypography>
              <WBTypography mt={1} textAlign={'center'} variant="body2">
                {t('send4InvoicesDescription', { ns: 'referrals' })}
              </WBTypography>
            </WBFlex>
            <WBFlex
              left={0}
              right={0}
              position={'absolute'}
              width={'100%'}
              display={['none', 'none', 'none', 'flex']}
            >
              <WBBox flex={5}></WBBox>
              <WBFlex mt={2} flex={5} justifyContent={'center'}>
                {/**@ts-ignore */}
                <DottedCurveIcon width="150px" height="18px" />
              </WBFlex>
              <WBBox flex={5}></WBBox>
              <WBFlex mt={8} flex={5} justifyContent={'center'}>
                {/**@ts-ignore */}
                <DottedCurveBackIcon width="150px" height="18px" />
              </WBFlex>
              <WBBox flex={5}></WBBox>
            </WBFlex>
          </WBFlex>
          <WBBox mt={6}>
            <WBTypography variant="h3">
              {t('inviteYourFriends', { ns: 'referrals' })}
            </WBTypography>
            <WBTypography>
              {t('inviteYourFriendsDescription', { ns: 'referrals' })}
            </WBTypography>
            <WBBox mt={4}>
              <InputTags
                addTag={addTag}
                tags={tags}
                removeTag={removeTag}
                inputValue={emailInputValue}
                setInputValue={setEmailInputValue}
                placeholder={t('addEmail', { ns: 'referrals' })}
                rightIcon={
                  <WBFlex
                    justifyContent={'center'}
                    alignItems={'center'}
                    sx={{ cursor: 'pointer' }}
                    onClick={handleSendEmails}
                  >
                    {sendReferralEmailsLoading ? (
                      <WBTypography color={'primary.800'}>
                        {t('sending', { ns: 'common' })}
                      </WBTypography>
                    ) : (
                      <>
                        <WBTypography
                          fontWeight={'bold'}
                          color={'primary.800'}
                          mx={1}
                        >
                          {t('send', { ns: 'referrals' })}
                        </WBTypography>
                        {/**@ts-ignore */}
                        <ReferralSendIcon width="20px" height="20px" />
                      </>
                    )}
                  </WBFlex>
                }
              />
            </WBBox>
          </WBBox>
          <WBBox mt={6}>
            <WBTypography variant="h3">
              {t('shareReferralLink', { ns: 'referrals' })}
            </WBTypography>
            <WBTypography>
              {t('shareReferralLinkDescription', { ns: 'referrals' })}
            </WBTypography>
            <WBBox mt={4}>
              <WBFlex justifyContent="space-between">
                <WBTypography color="textSecondary">
                  {referralLink}
                </WBTypography>
                <WBBox>
                  <WBTypography
                    noWrap
                    fontWeight={'bold'}
                    color={'primary.800'}
                    sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => {
                      handleCopyReferralLink();
                    }}
                  >
                    {t('copyLink', { ns: 'referrals' })}
                  </WBTypography>
                </WBBox>
              </WBFlex>
              {/*<ReferralInput*/}
              {/*  value={referralLink}*/}
              {/*  multiline*/}
              {/*  disabled*/}
              {/*  sx={{ color: 'primary.800', fontSize: 'inherit' }}*/}
              {/*  rightIcon={*/}
              {/*    <WBBox>*/}
              {/*      <WBTypography*/}
              {/*        noWrap*/}
              {/*        fontWeight={'bold'}*/}
              {/*        color={'primary.800'}*/}
              {/*        sx={{ cursor: 'pointer', textDecoration: 'underline' }}*/}
              {/*        onClick={() => {*/}
              {/*          handleCopyReferralLink();*/}
              {/*        }}*/}
              {/*      >*/}
              {/*        {t('copyLink', { ns: 'referrals' })}*/}
              {/*      </WBTypography>*/}
              {/*    </WBBox>*/}
              {/*  }*/}
              {/*/>*/}
            </WBBox>
          </WBBox>
        </WBBox>
        <WBBox
          flex={1}
          ml={[0, 0, 8]}
          mt={[4, 4, 0]}
          height="auto"
          padding={5}
          sx={{
            backgroundImage: `url(${GradientOuter})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            '@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)':
              {
                backgroundImage: `url(${GradientOuterx2})`, // High resolution background
              },
            '@media (-webkit-min-device-pixel-ratio: 3), (min-resolution: 288dpi)':
              {
                backgroundImage: `url(${GradientOuterx3})`, // Super high resolution background
              },
          }}
        >
          <WBTypography variant="h3" color={'white'}>
            {t('friendsInvited', { ns: 'referrals', number: referrals.length })}
          </WBTypography>
          <WBTypography variant="h5" fontWeight={'normal'} color={'white'}>
            {t('earned', {
              ns: 'referrals',
              money: removeTrailingZeros(
                numberToCurrency(completedReferrals * 50)
              ),
            })}
          </WBTypography>
          <WBList>
            {(loading ? [null, null, null] : referrals).map(
              (referral: Referral, index: number) => (
                <ReferredListItem
                  key={referral?.userId ?? index}
                  referral={referral}
                  loading={loading}
                />
              )
            )}
          </WBList>
        </WBBox>
      </WBFlex>
    </WBBox>
  );
}

export default Referrals;
