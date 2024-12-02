import { render } from '../../helpers/render';
import Rewards from './Rewards';

describe('Templates', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Rewards />);
    expect(baseElement).toBeTruthy();
  });
});
