import { render } from '../../helpers/render';
import PdfViewModal from './PdfViewModal';

describe('PdfViewModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <PdfViewModal
        open={false}
        onClose={function (): void {
          throw new Error('Function not implemented.');
        }}
        task={undefined}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
