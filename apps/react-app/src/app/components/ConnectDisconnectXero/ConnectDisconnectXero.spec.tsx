import { render } from '../../helpers/render';

import { ConnectDisconnectXero } from '.';

describe('ConnectDisconnectXero', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ConnectDisconnectXero />);
    expect(baseElement).toBeTruthy();
  });
});
