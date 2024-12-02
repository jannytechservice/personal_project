import { render } from '@testing-library/react';
import { EntityCardList } from './EntityCardList';
import { TotalAmountContext } from '../EntityList';
describe('EntityCardList', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(
      <EntityCardList loading={false} entities={[]} />
    );
    expect(baseElement).toBeTruthy();
  });
});
