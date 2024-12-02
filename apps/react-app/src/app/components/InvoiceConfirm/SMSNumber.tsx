import {
  WBBox,
  WBCheckbox,
  WBFlex,
  WBLinkButton,
  WBTypography,
} from '@admiin-com/ds-web';
import { styled } from '@mui/material';
import { t } from 'i18next';
import PenIcon from '../../../assets/icons/pen-icon.svg';
import LoadSvgIcon from '../../component/LoadSvgIcon/LoadSvgIcon';
import SMSNumberModal from './SMSNumberModal';
import React from 'react';
import {
  Contact,
  updateContact as UPDATE_CONTACT,
} from '@admiin-com/ds-graphql';
import { gql, useMutation } from '@apollo/client';
import { useFormContext } from 'react-hook-form';
interface Props {
  onAdd: () => void;
  contact?: Contact;
  checked: boolean;
  onCheck: (value: boolean) => void;
}
export const SMSNumber = (props: Props) => {
  const number = props.contact?.phone;
  const hasNumber = Boolean(number) === true;
  const { setValue } = useFormContext();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onCheck(event.target.checked);
  };
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <Container>
      {hasNumber && (
        <WBCheckbox checked={props.checked} onChange={handleChange} />
      )}
      <WBBox flex={1}>
        <WBTypography fontWeight={'bold'}>
          {t('sendViaSMS', { ns: 'taskbox' })}
        </WBTypography>
        <WBTypography color={'text.secondary'}>
          {number || t('noNumber', { ns: 'taskbox' })}
        </WBTypography>
      </WBBox>
      <WBBox>
        <WBLinkButton
          color="primary.main"
          onClick={() => {
            setModalOpen(true);
          }}
        >
          {hasNumber ? (
            <LoadSvgIcon component={PenIcon} width={25} height={25} />
          ) : (
            <WBTypography color={'primary.main'}>
              {t('addNumber', { ns: 'taskbox' })}
            </WBTypography>
          )}
        </WBLinkButton>
      </WBBox>
      {modalOpen && (
        <SMSNumberModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onOK={async (number: string) => {
            setValue('to', { ...props.contact, phone: number });
          }}
          contact={props.contact}
          defaultNumber={number ?? ''}
        />
      )}
    </Container>
  );
};

const Container = styled(WBFlex)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  padding: theme.spacing(2),
}));
