import { render, cleanup } from '@testing-library/react';

import { TaskList } from './TaskList';
import * as useTaskBoxContextModule from '../../pages/TaskBox/TaskBox';
describe('TaskList', () => {
  beforeEach(() => {
    // Mock the useOnboardingProcess hook with all necessary properties

    vi.spyOn(useTaskBoxContextModule, 'useTaskBoxContext').mockImplementation(
      () => ({
        selectedTasks: [],
        multiSelect: vi.fn(),
        setMultiShow: vi.fn(),
        selectedTask: null,
        setSelectedTask: vi.fn(),
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('should render successfully', () => {
    const { baseElement } = render(<TaskList />);
    expect(baseElement).toBeTruthy();
  });
});
