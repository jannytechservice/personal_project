import { render } from '@testing-library/react';

import TemplateDetail from './TemplateDetail';

describe('TemplateDetail', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TemplateDetail />);
    expect(baseElement).toBeTruthy();
  });
});
