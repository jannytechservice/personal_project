import { GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid';
import ServicesLookup from '.';

export type ServicesLookupEditCellProps = GridRenderEditCellParams & {
  onChange: (value: any) => void;
};
export const ServicesLookupEditCell = (props: ServicesLookupEditCellProps) => {
  const { id, field } = props;
  const apiRef = useGridApiContext();

  const onChange = (value: any) => {
    const isValid = apiRef.current.setEditCellValue({
      id,
      field,
      value: value?.description,
    });
    if (value.id) props.onChange(value);

    if (isValid) apiRef.current.stopCellEditMode({ id, field });
  };
  return <ServicesLookup value={props.value} onChange={onChange} />;
};
