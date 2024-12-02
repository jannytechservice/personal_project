import { waitFor } from '@testing-library/react';
import { render } from '../../../helpers/render';
import { EntityTableList } from './EntityTableList';
describe('EntityTableList', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(<EntityTableList loading={false} />);
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
