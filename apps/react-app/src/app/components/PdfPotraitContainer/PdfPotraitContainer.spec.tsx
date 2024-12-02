import { render } from '@testing-library/react';

import PdfPotraitContainer from './PdfPotraitContainer';

describe('PdfPotraitContainer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <PdfPotraitContainer children={undefined} />
    );
    expect(baseElement).toBeTruthy();
  });
});
