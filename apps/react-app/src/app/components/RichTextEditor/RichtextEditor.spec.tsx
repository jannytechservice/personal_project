import { cleanup, render } from '@testing-library/react';

import { RichTextEditor } from './RichTextEditor';

describe('RichTextEditor', () => {
  beforeEach(() => {
    vi.mock('@lexical/utils', () => {
      return {
        mergeRegister: vi.fn(),
      };
    });
    vi.mock('@lexical/react/LexicalComposerContext', () => {
      return {
        useLexicalComposerContext: () => [
          {
            registerUpdateListener: vi.fn(),
            registerCommand: vi.fn(),
            update: vi.fn((callback) =>
              callback({ read: vi.fn((readCallback) => readCallback()) })
            ),
            getEditorState: () => ({
              read: vi.fn((readCallback) => readCallback()),
            }),
          },
        ],
      };
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });
  it('should render successfully', () => {
    const { baseElement } = render(<RichTextEditor onChange={vi.fn()} />);
    expect(baseElement).toBeTruthy();
  });
});
