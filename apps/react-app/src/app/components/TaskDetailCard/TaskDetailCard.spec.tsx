import { cleanup } from '@testing-library/react';
import { render } from '../../helpers/render';
import { TaskDetailCard } from './TaskDetailCard';
import * as useTaskToNameModule from '../../hooks/useTaskToName/useTaskToName';

describe('TaskDetailCard', () => {
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
    const { baseElement } = render(<TaskDetailCard task={null} />);
    expect(baseElement).toBeTruthy();
  });
});
