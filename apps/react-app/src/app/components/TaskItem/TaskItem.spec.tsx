import { render, cleanup } from '@testing-library/react';

import { TaskItem } from './TaskItem';
import * as useTaskToNameModule from '../../hooks/useTaskToName/useTaskToName';

describe('TaskItem', () => {
  beforeEach(() => {
    vi.spyOn(useTaskToNameModule, 'useTaskToContactName').mockImplementation(
      () => ({
        contactLoading: false,
        contactName: null,
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });
  it('should render successfully', () => {
    const { baseElement } = render(<TaskItem value={null} />);
    expect(baseElement).toBeTruthy();
  });
});
