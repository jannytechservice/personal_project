import { waitFor } from '@testing-library/react';
import { render } from '../../../helpers/render';
import { EntityTableListItem } from './EntityTableListItem';
describe('EntityTableListItem', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(<EntityTableListItem />);
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
