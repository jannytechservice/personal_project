import { cleanup } from '@testing-library/react';
import { render } from '../../helpers/render';

import { TaskCard } from './TaskCard';
import * as useTaskToNameModule from '../../hooks/useTaskToName/useTaskToName';
describe('TaskCard', () => {
  beforeEach(() => {
    // Mock the useOnboardingProcess hook with all necessary properties
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
    const { baseElement } = render(<TaskCard task={null} />);
    expect(baseElement).toBeTruthy();
  });
});
