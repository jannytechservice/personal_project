import { render } from '@testing-library/react';

import LoadSvgIcon from './LoadSvgIcon';

describe('LoadSvgIcon', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LoadSvgIcon component={null} />);
    expect(baseElement).toBeTruthy();
  });
});
