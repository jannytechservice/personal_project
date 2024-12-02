import { WBFlex, WBToolbar } from '@admiin-com/ds-web';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ToolbarLayout from '../../components/ToolbarLayout/ToolbarLayout';

export function TemplatesToolbar() {
  const { t } = useTranslation();
  return (
    <ToolbarLayout
      title={t('templates', { ns: 'common' })}
      onAddClick={undefined}
    >
      <WBToolbar sx={{ mt: 4.5 }}></WBToolbar>
      <WBFlex></WBFlex>
    </ToolbarLayout>
  );
}
