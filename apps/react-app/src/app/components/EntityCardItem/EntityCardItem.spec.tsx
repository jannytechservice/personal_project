import { render } from '../../helpers/render';
import { EntityCardItem } from './EntityCardItem';

describe('EntityCardItem', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EntityCardItem />);
    expect(baseElement).toBeTruthy();
  });
});
