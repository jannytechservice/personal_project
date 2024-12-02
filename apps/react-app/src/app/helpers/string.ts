export function truncateString(
  input: string,
  maxLength?: number | undefined
): string {
  if (!maxLength || input.length <= maxLength) {
    return input;
  }
  return input.slice(0, maxLength) + '...';
}

export function formatCurrency(value: number): string {
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
