import { render } from '@testing-library/react';

import BackModal from './BackModal';

describe('BackModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BackModal />);
    expect(baseElement).toBeTruthy();
  });
});
