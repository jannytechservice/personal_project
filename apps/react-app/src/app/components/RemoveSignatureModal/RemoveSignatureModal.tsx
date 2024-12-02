import React, { useCallback, useMemo } from 'react';
import SimpleDrawDlg from '../SimpleDrawDlg/SimpleDrawDlg';
import { CSGetSub as GET_SUB } from '@admiin-com/ds-graphql';
import {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { WBButton } from '@admiin-com/ds-web';
import ErrorHandler from '../ErrorHandler/ErrorHandler';
import { useTranslation } from 'react-i18next';
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
  deleteSignature as DELETE_SIGNATURE,
  getUser as GET_USER,
  updateUser as UPDATE_USER,
  Signature,
} from '@admiin-com/ds-graphql';

export interface RemoveSignatureModalProps {
  open: boolean;
  handleClose: () => void;
  signature?: Signature;
}

export function RemoveSignatureModal({
  open,
  signature,
  handleClose,
}: RemoveSignatureModalProps) {
  const { t } = useTranslation();
  const { data: subData } = useQuery(gql(GET_SUB));
  const userId = subData?.sub;
  const [deleteSignature] = useMutation(gql(DELETE_SIGNATURE), {
    // refetchQueries: [{ query: gql(GET_USER), variables: { id: userId } }],
    // awaitRefetchQueries: true,
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<any>(null);
  const [updateUser, { loading: updateUserLoading }] = useMutation(
    gql(UPDATE_USER)
  );

  const [getUser] = useLazyQuery(gql(GET_USER), {
    fetchPolicy: 'cache-and-network',
  });
  // const user = useMemo(() => userData?.getUser || {}, [userData]);
  const handleRemove = useCallback(async () => {
    if (!signature) return;
    try {
      setLoading(true);
      await deleteSignature({
        variables: {
          input: {
            userId: signature.userId,
            createdAt: signature.createdAt,
          },
        },
      });
      const userData = await getUser({
        variables: {
          id: signature.userId,
        },
      });
      console.log('user', userData);
      const user = userData?.data.getUser;
      const signatures = user?.signatures?.items;
      console.log(
        signatures,
        signatures.length > 0 ? signatures[signatures.length - 1].key : null
      );

      await updateUser({
        variables: {
          input: {
            id: userId,
            selectedSignatureKey:
              signatures.length > 0 ? signatures[0].key : null,
          },
        },
      });
      handleClose();
    } catch (err) {
      setError(err);
      console.log('ERROR deleteSignature: ', err);
    } finally {
      setLoading(false);
    }
  }, [deleteSignature, handleClose, signature]);

  return (
    <SimpleDrawDlg
      open={open}
      handleClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" variant="h4">
        {t('removeSignature', { ns: 'settings' })}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t('confirmRemoveSignature', { ns: 'settings' })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <WBButton variant="outlined" onClick={handleClose}>
          {t('cancelTitle', { ns: 'common' })}
        </WBButton>
        <WBButton loading={loading} onClick={handleRemove} autoFocus>
          {t('okTitle', { ns: 'common' })}
        </WBButton>
        <ErrorHandler errorMessage={error?.message} />
      </DialogActions>
    </SimpleDrawDlg>
  );
}

export default RemoveSignatureModal;
