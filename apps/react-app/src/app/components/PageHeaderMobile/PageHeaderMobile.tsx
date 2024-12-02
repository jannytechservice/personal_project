import { WBFlex, WBTypography } from '@admiin-com/ds-web';
import { SidebarLayout } from '../SidebarLayout/SidebarLayout';

export interface PageHeaderMobileProps {
  children: React.ReactNode;
}

export function PageHeaderMobile({ children }: PageHeaderMobileProps) {
  return (
    <>
      <WBFlex
        sx={{ flex: 1 }}
        alignItems={'center'}
        width={'100%'}
        flexDirection={'row'}
        display={{ xs: 'flex', sm: 'none' }}
        mb={2}
        justifyContent="space-between"
      >
        <WBFlex
          sx={{ flex: 1 }}
          alignItems={'center'}
          width={'100%'}
          justifyContent="space-between"
        >
          <SidebarLayout.MenuButton />
        </WBFlex>

        <WBTypography
          variant="h2"
          noWrap
          component="div"
          textAlign={'center'}
          sx={{
            flexGrow: 1,
            flex: 2,
            textAlign: 'left',
          }}
        >
          {children}
        </WBTypography>
      </WBFlex>
      <WBFlex display={{ xs: 'none', sm: 'flex' }} flexDirection={'column'}>
        {children}
      </WBFlex>
    </>
  );
}

export default PageHeaderMobile;
