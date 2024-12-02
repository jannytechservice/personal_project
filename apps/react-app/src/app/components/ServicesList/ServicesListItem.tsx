import { numberWithCommasDecimals } from '@admiin-com/ds-common';
import { Service } from '@admiin-com/ds-graphql';
import { WBListItem, WBListItemText } from '@admiin-com/ds-web';
import { ListItemButton, Skeleton } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ServiceListItemProps {
  item?: Service | null;
  selected?: boolean;
  onClick?: (item: Service) => void;
}

export const ServicesListItem = React.forwardRef<
  HTMLDivElement,
  ServiceListItemProps
>(({ item, selected = false, onClick }, ref) => {
  const { t } = useTranslation();

  const name = item?.description ?? '';
  return (
    <ListItemButton
      ref={ref}
      sx={{
        '&:hover': {
          bgcolor: `rgba(0,0,0,0.1)`,
        },
        bgcolor: selected ? `rgba(0,0,0,0.1)` : 'transparent',
        px: 5,
      }}
      onClick={() => item && onClick && onClick(item)}
    >
      <WBListItem disablePadding>
        {item ? (
          <WBListItemText
            primary={name}
            secondary={`$${numberWithCommasDecimals(
              item?.amount / 100 ?? 0
            )} | ${t(item?.feeType, { ns: 'services' })} | ${t(item?.taxType, {
              ns: 'services',
            })}`}
            primaryTypographyProps={{ fontWeight: 'bold' }}
          />
        ) : (
          <WBListItemText>
            <Skeleton width={100} />
          </WBListItemText>
        )}
      </WBListItem>
    </ListItemButton>
  );
});
