import { render } from '../../helpers/render';
import PdfThumbnail from './PdfThumbnail';

describe('PdfThumbnail', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PdfThumbnail task={null} />);
    expect(baseElement).toBeTruthy();
  });
});
