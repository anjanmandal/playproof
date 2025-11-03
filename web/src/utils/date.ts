import { format, parseISO } from 'date-fns';

export const formatDateTime = (value?: string | null) => {
  if (!value) return '—';
  try {
    return format(parseISO(value), 'MMM d, yyyy h:mmaaa');
  } catch {
    return value;
  }
};

export const formatDate = (value?: string | null) => {
  if (!value) return '—';
  try {
    return format(parseISO(value), 'MMM d, yyyy');
  } catch {
    return value;
  }
};
