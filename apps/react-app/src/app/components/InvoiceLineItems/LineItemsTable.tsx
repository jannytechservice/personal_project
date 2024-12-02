import * as React from 'react';
import {
  DataGrid,
  GridColDef,
  GridRowModesModel,
  GridSlotsComponentsProps,
  useGridApiRef,
} from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { LineItem, TaxType } from '@admiin-com/ds-graphql';
import { WBFlex, WBIconButton, WBLinkButton } from '@admiin-com/ds-web';
import { useTheme } from '@mui/material';
import { ServicesLookupEditCell } from '../ServicesLookup/ServicesLookupEditCell';
import { GridRowModel } from '@mui/x-data-grid';
import { GridRowsProp } from '@mui/x-data-grid';

interface Props {
  setRows: (rows: LineItem[]) => void;
  rows: LineItem[];
}

export default function LineItemsTable(props: Props) {
  const { t } = useTranslation();
  const apiRef = useGridApiRef();
  const columns: GridColDef<(typeof initialRows)[number]>[] = [
    {
      field: 'id',
      headerName: 'Item',
      width: 90,
      sortable: false,
    },
    {
      field: 'description',
      headerName: t('description', { ns: 'taskbox' }),
      width: 300,
      sortable: false,
      editable: true,
      renderEditCell(params) {
        return (
          <ServicesLookupEditCell
            {...params}
            onChange={(value) => {
              console.log('changed', value, params);
              apiRef.current.updateRows([
                {
                  id: params.id,
                  description: value?.name || '',
                  qty: 1,
                  price: value?.amount || 0,
                  GST: value?.taxType || '',
                },
              ]);
            }}
          />
        );
      },
    },
    {
      field: 'qty',
      headerName: t('qty', { ns: 'taskbox' }),
      type: 'number',
      sortable: false,
      width: 150,
      editable: true,
    },
    {
      field: 'price',
      headerName: t('price', { ns: 'taskbox' }),
      type: 'number',
      width: 110,
      editable: true,
      sortable: false,
    },
    {
      field: 'GST',
      headerName: t('GST', { ns: 'taskbox' }),
      sortable: false,
      type: 'singleSelect',
      editable: true,
      width: 160,
      valueOptions: Object.values(TaxType).map((value) => ({
        value,
        label: t(value, { ns: 'common' }),
      })),
    },
    {
      field: 'amount',
      headerName: t('amount', { ns: 'taskbox' }),
      sortable: false,
      editable: false,
      width: 160,
      valueGetter: (params) =>
        Math.round(
          params.row.qty *
            params.row.price *
            (params.row.GST === TaxType.GST ? 1.1 : 1)
        ),
    },
    {
      field: 'actions',
      headerName: '',
      disableColumnMenu: true,
      width: 50,
      sortable: false,
      renderCell: (params) => (
        <WBIconButton
          onClick={() => handleDelete(params.id as number)}
          icon="Trash"
          size="small"
          sx={{ display: 'none' }}
          className="delete-icon"
        ></WBIconButton>
      ),
    },
  ];
  const handleDelete = (id: number) => {
    const newRows = rows.filter((row) => row.id !== id);
    setRows(newRows);
    updatePropsRows(newRows);
  };
  const initialRows: GridRowsProp = [
    { id: 1, description: '', qty: 0, price: 0, GST: '' },
  ];
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  const [rows, setRows] = React.useState(initialRows);
  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    const newRows = rows.map((row) =>
      row.id === newRow.id ? updatedRow : row
    );
    setRows(newRows);
    updatePropsRows(newRows);

    return updatedRow;
  };

  const handleAddNew = () => {
    const newRow = {
      id: rows.length + 1,
      description: '',
      qty: 0,
      price: 0,
      GST: '',
      amount: 0,
    };
    const newRows = rows.concat(newRow);
    setRows(newRows);
    updatePropsRows(newRows);

    apiRef.current.setCellFocus(newRow.id, 'description');
  };
  console.log(rowModesModel);

  const updatePropsRows = (rows: GridRowModel[]) => {
    props.setRows(
      rows.map((row) => ({
        description: row.description,
        quantity: row.qty,
        unitAmount: row.price,
        taxType: row.GST,
        lineAmount: row.price * row.qty * (row.GST === TaxType.GST ? 1.1 : 1),
        id: row.id,
        __typename: 'LineItem',
      }))
    );
  };

  React.useEffect(() => {
    if (props.rows.length > 0)
      setRows(
        props.rows.map((row, index) => ({
          description: row.description,
          qty: row.quantity,
          price: row.unitAmount,
          GST: row.taxType,
          amount: row.lineAmount,
          id: index + 1,
        }))
      );
  }, [props.rows]);

  return (
    <DataGrid
      apiRef={apiRef}
      sx={{
        borderWidth: 0,
        '.MuiDataGrid-row:hover .delete-icon': {
          display: 'inline-flex',
        },
      }}
      rows={rows}
      // experimentalFeatures={{ : true }}
      columns={columns}
      rowModesModel={rowModesModel}
      onRowModesModelChange={handleRowModesModelChange}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 10,
          },
        },
      }}
      processRowUpdate={processRowUpdate}
      slots={{
        footer: AddNewButton,
      }}
      slotProps={{
        footer: {
          onAddNew: handleAddNew,
        },
      }}
      pageSizeOptions={[10]}
      disableRowSelectionOnClick
    />
  );
}

declare module '@mui/x-data-grid' {
  interface FooterPropsOverrides {
    onAddNew: () => void;
  }
}

function AddNewButton(props: NonNullable<GridSlotsComponentsProps['footer']>) {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <WBFlex mb={4} mt={2} ml={2}>
      <WBLinkButton
        onClick={props.onAddNew}
        color="primary.main"
        sx={{ ...theme.typography.button }}
      >
        {t('addNewItem', { ns: 'taskbox' })}
      </WBLinkButton>
    </WBFlex>
  );
}
