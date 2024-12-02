import React from 'react';

import { ClientFiles } from './ClientFiles';
import { render } from '../../helpers/render';

describe('ClientFiles', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ClientFiles
        tasks={[]}
        filesType={'Outstanding'}
        setFilesType={function (type: 'Outstanding' | 'Complete'): void {
          throw new Error('Function not implemented.');
        }}
        client={undefined}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
