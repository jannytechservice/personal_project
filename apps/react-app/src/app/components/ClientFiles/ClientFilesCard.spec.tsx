import React from 'react';

import { ClientFileCard } from './ClientFileCard';
import { render } from '../../helpers/render';

describe('ClientFileCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ClientFileCard
        clientFile={undefined}
        client={{
          __typename: 'Contact',
          id: '',
          entityId: '',
          firstName: undefined,
          lastName: undefined,
          email: undefined,
          phone: undefined,
          taxNumber: undefined,
          name: undefined,
          legalName: undefined,
          companyName: undefined,
          searchName: undefined,
          status: undefined,
          createdAt: undefined,
          updatedAt: undefined,
          contactType: undefined,
          bank: undefined,
          bpay: undefined,
          bulkUploadFileKey: undefined,
          owner: undefined,
        }}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
