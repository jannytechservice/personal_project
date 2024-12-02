import { render } from '../../helpers/render';
import PageHeaderMobile from './PageHeaderMobile';

describe('PageHeaderMobile', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PageHeaderMobile chidren={undefined} />);
    expect(baseElement).toBeTruthy();
  });
});
