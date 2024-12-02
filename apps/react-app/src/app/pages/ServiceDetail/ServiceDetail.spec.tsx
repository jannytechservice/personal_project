import { render } from '../../helpers/render';
import ServiceDetail from './ServiceDetail';

describe('ServiceDetail', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ServiceDetail />);
    expect(baseElement).toBeTruthy();
  });
});
