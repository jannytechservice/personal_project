import React from 'react';
import { waitFor } from '@testing-library/react';
import { render } from '../../helpers/render';
import { ServicesList } from '.';
import { Mock, vi } from 'vitest';
import { useServices } from '../../pages/Services/useServices';
describe('ContacsList', () => {
  beforeAll(() => {
    vi.mock('../../pages/Services/useServices', () => ({
      useServices: vi.fn(),
    }));
  });
  it('should render successfully', async () => {
    (useServices as Mock).mockReturnValue({
      services: [{ id: 1, title: 'Ctontacs 1' }],
    });
    const { baseElement } = render(<ServicesList selected={null} query={''} />);
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
