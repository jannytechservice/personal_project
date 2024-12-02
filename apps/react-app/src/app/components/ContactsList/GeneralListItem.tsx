import { WBS3Avatar } from '@admiin-com/ds-amplify-web';
import {
  WBListItem,
  WBListItemAvatar,
  WBListItemText,
} from '@admiin-com/ds-web';
import { ListItemButton, Skeleton } from '@mui/material';
import React from 'react';

interface GeneralListItemProps {
  primaryText: string;
  selected?: boolean;
  secondaryText: string;
  loading: boolean;
  onClick?: () => void;
}

export const GeneralListItem = React.forwardRef<
  HTMLDivElement,
  GeneralListItemProps
>(({ primaryText, secondaryText, loading, selected = false, onClick }, ref) => {
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
      onClick={() => !loading && onClick && onClick()}
    >
      <WBListItem disablePadding>
        <WBListItemAvatar>
          {!loading ? (
            <WBS3Avatar
              sx={{
                borderRadius: '3px',
              }}
              companyName={primaryText}
              fontSize="h6.fontSize"
            />
          ) : (
            <Skeleton width={40} height={40} />
          )}
        </WBListItemAvatar>

        {!loading ? (
          <WBListItemText
            primary={primaryText}
            secondary={secondaryText}
            primaryTypographyProps={{ fontWeight: 'bold' }}
            secondaryTypographyProps={{ color: 'text.primary' }}
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
