import { DATE_FORMATS } from '@admiin-com/ds-common';
import { fireEvent, screen } from '@testing-library/react';
import { render } from '../../helpers/render';
import DueDateSelector from './DueDateSelector';
import { DateTime } from 'luxon';
import { describe, it, expect, vi } from 'vitest';

describe.skip('DueDateSelector', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DueDateSelector />);
    expect(baseElement).toBeTruthy();
  });

  it('should display the correct date when a predefined date is selected', () => {
    const today = DateTime.now();
    const sevenDaysFromNow = today
      .plus({ days: 7 })
      .toFormat(DATE_FORMATS.BACKEND_DATE);
    render(<DueDateSelector value={sevenDaysFromNow} />);
    expect(
      screen.getByText(today.plus({ days: 7 }).toFormat('d MMM yyyy'))
    ).toBeTruthy();
  });

  it('should call onChange with the correct value when a predefined date is selected', () => {
    const onChangeMock = vi.fn();
    render(<DueDateSelector onChange={onChangeMock} />);
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: '2024-09-03' },
    });
    expect(onChangeMock).toHaveBeenCalledWith('2024-09-03');
  });

  it('should open the date picker when "custom" is selected', () => {
    render(<DueDateSelector />);
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'custom' },
    });
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('should call onChange with the correct value when a custom date is selected', () => {
    const onChangeMock = vi.fn();
    render(<DueDateSelector onChange={onChangeMock} />);
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'custom' },
    });
    fireEvent.click(screen.getByText('OK')); // Assuming the date picker has an "OK" button
    expect(onChangeMock).toHaveBeenCalledWith(expect.any(String));
  });
});
