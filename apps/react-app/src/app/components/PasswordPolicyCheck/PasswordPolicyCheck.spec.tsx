import { render } from '@testing-library/react';

import { PasswordPolicyCheck } from './PasswordPolicyCheck';

describe('PasswordPolicyCheck', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PasswordPolicyCheck />);
    expect(baseElement).toBeTruthy();
  });
});
