import { render } from '@testing-library/react';

import TaskCreateModal from '.';

describe('TaskCreateModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TaskCreateModal />);
    expect(baseElement).toBeTruthy();
  });
});
