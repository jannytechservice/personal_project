import { render } from '@testing-library/react';

import EntityTaskbox from './EntityTaskbox';

describe('EntityTaskbox', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EntityTaskbox />);
    expect(baseElement).toBeTruthy();
  });
});
