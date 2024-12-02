import { WBBox, WBButton, WBFlex } from '@admiin-com/ds-web';
import React from 'react';
import { useTranslation } from 'react-i18next';
import LineItemsCreateModal from '../InvoiceLineItemsCreateModal';
import { LineItem } from '@admiin-com/ds-graphql';
import { styled } from '@mui/material';
import LineItemCard from './LineItemCard';

//TODO: remove any interface
interface Props {
  rows: LineItem[] | any[];
  setRows: (rows: LineItem[] | any[]) => void;
}

export default function LineItemsMobile(props: Props) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const handleCreateNew = () => {
    setEditItem(null);
    setModalOpen(true);
  };
  const { t } = useTranslation();
  const [editItem, setEditItem] = React.useState<LineItem | null>(null);
  return (
    <WBBox pb={2} bgcolor="background.default">
      <LineItemsList>
        {props.rows.map((row) => (
          <LineItemCard
            item={row}
            key={row.id}
            onEdit={(row) => {
              setEditItem(row);
              setModalOpen(true);
            }}
          />
        ))}
      </LineItemsList>
      <WBButton
        variant="outlined"
        type="button"
        onClick={handleCreateNew}
        sx={{ mt: 1, mr: 1 }}
        fullWidth
      >
        {t('addNewItem', { ns: 'taskbox' })}
      </WBButton>
      <LineItemsCreateModal
        open={modalOpen}
        item={editItem}
        onClose={() => setModalOpen(false)}
        key={modalOpen as any}
        onAdd={(data) => {
          console.log(data);
          if (!data.id) {
            props.setRows([
              ...props.rows,
              { ...data, id: (props.rows.length + 1).toString() },
            ]);
          } else {
            props.setRows(
              props.rows.map((row) => {
                if (row.id === data.id) {
                  return { ...data, id: data.id };
                }
                return row;
              })
            );
          }
          setModalOpen(false);
        }}
      />
    </WBBox>
  );
}
const LineItemsList = styled(WBFlex)(({ theme }) => ({
  flexDirection: 'column',
  gap: theme.spacing(1),
}));
