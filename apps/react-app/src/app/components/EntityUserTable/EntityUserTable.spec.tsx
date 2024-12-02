import { render } from '../../helpers/render';
import EntityUserTable from './EntityUserTable';

describe('EntityUserTable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <EntityUserTable users={[]} loading={false} />
    );
    expect(baseElement).toBeTruthy();
  });
});
