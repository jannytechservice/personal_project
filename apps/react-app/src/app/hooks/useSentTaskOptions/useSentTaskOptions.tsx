import { Payment, Task } from '@admiin-com/ds-graphql';
import { useClipboard } from '@admiin-com/ds-hooks';
import { useSnackbar, WBFlex } from '@admiin-com/ds-web';
import { AlertColor } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import React from 'react';
import AdmiinLogoURL from '../../../assets/icons/admiin-logo-only-icon.svg?url';
import { useTranslation } from 'react-i18next';

interface SentTaskOptionsProps {
  task: Task | null | undefined;
  payment?: Payment | null | undefined;
}

export const useSentTaskOptions = ({ task, payment }: SentTaskOptionsProps) => {
  const showSnackBar = useSnackbar();
  const [, copy] = useClipboard();
  const paymentLink = `${window.location.origin}/guest/pay-task?paymentId=${payment?.id}`;
  const taskLink = `${window.location.origin}/guest/pay-task?taskId=${task?.id}&entityId=${task?.entityId}`;
  const { t } = useTranslation();

  const handleCopyLink = async (link: string) => {
    try {
      await copy(link);
      showSnackBar({
        message: t('linkCopied', { ns: 'taskbox' }),
        severity: 'success' as AlertColor,
        horizontal: 'right',
        vertical: 'bottom',
      });
    } catch (error) {
      console.log(error);
      showSnackBar({
        message: t('errorOcurred', { ns: 'taskbox' }),
        severity: 'error' as AlertColor,
        horizontal: 'right',
        vertical: 'bottom',
      });
    }
  };

  const handleCopyTaskLink = async () => {
    handleCopyLink(taskLink);
  };

  const handleCopyPaymentLink = async () => {
    handleCopyLink(paymentLink);
  };

  const QRCodeComponent = (
    <WBFlex
      sx={{
        p: [3, 8],
        justifyContent: 'center',
        bgcolor: 'common.white',
        alignItems: 'center',
      }}
    >
      <QRCodeSVG
        value={payment ? paymentLink : taskLink}
        size={256}
        level={'M'}
        bgColor={'#ffffff'}
        fgColor={'#000000'}
        marginSize={-9}
        //@ts-ignore
        version={14}
        minVersion={6}
        imageSettings={{
          src: AdmiinLogoURL,
          x: undefined,
          y: undefined,
          height: 72,
          width: 72,
          excavate: true,
        }}
      />
    </WBFlex>
  );

  return {
    QRCodeComponent,
    handleCopyTaskLink,
    handleCopyPaymentLink,
  };
};
