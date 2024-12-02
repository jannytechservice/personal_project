import { LineItem } from '@admiin-com/ds-graphql';
import { FormProvider, useForm } from 'react-hook-form';
import LineItemsCreateModal from './LineItemCreateModal';
import React from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (lineItem: LineItem | any) => void;
  item: LineItem | any | null;
}

export type LineItemForm = Omit<LineItem, '__typename' | 'id'>;
export default function InvoiceLineItemsCreateModal(props: Props) {
  const methods = useForm<LineItemForm>({
    defaultValues: props.item || {},
  });

  const handleAdd = (data: LineItemForm) => {
    props.onAdd({
      ...props.item,
      ...data,
      __typename: 'LineItem',
      id: props.item?.id || '',
    });
  };

  React.useEffect(() => {
    if (props.item) {
      methods.setValue('description', {
        description: props.item.description,
      } as any);
    }
  }, [props.item]);
  return (
    <FormProvider {...methods}>
      <LineItemsCreateModal {...props} onAdd={handleAdd} id={props.item?.id} />
    </FormProvider>
  );
}
