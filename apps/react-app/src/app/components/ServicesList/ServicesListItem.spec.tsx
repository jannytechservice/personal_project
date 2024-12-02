import React from 'react';
import { waitFor } from '@testing-library/react';
import { render } from '../../helpers/render';
import { ServicesListItem } from './ServicesListItem';
describe('ServicesListItem', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(<ServicesListItem onClick={vi.fn()} />);
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
