import { render } from '../../helpers/render';
import Referrals from './Referrals';

describe('Referrals', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Referrals />);
    expect(baseElement).toBeTruthy();
  });
});
