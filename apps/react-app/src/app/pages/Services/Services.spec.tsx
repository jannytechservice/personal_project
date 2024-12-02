import { waitFor } from '@admiin-com/ds-web-testing-utils';
import Services from '.';
import { render } from '../../helpers/render';
// import { SidebarContainer } from '../../components/SidebarContainer/SidebarContainer';

describe('Services', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(
      // <SidebarContainer>
      <Services />
      // </SidebarContainer>
    );
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
