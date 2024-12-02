import { render } from '../../helpers/render';
import ToolbarLayout from './ToolbarLayout';

describe('ToolbarLayout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ToolbarLayout />);
    expect(baseElement).toBeTruthy();
  });
});
