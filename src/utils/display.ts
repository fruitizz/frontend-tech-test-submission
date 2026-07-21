export const hasDisplayValue = (
  value: string | undefined | null,
): value is string => typeof value === 'string' && value.trim().length > 0;
