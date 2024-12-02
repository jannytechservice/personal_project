import { waitFor } from '@admiin-com/ds-web-testing-utils';
import ServiceCreateModal from '.';
import { render } from '../../helpers/render';

describe('ServiceCreateModal', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(
      <ServiceCreateModal open={false} onClose={vi.fn()} />
    );
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
