import { Alert } from '@mui/material';

export const ErrorAlert = ({ message }: { message?: string | null }) => {
  if (!message) return null;
  return (
    <Alert severity="error" sx={{ mb: 2 }}>
      {message}
    </Alert>
  );
};
