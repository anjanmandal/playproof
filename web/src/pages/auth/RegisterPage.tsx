import { FormEvent, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import type { Role } from '@/types';

const ROLES: Array<{ value: Role; label: string }> = [
  { value: 'ATHLETE', label: 'Athlete' },
  { value: 'COACH', label: 'Coach' },
  { value: 'AT_PT', label: 'Athletic Trainer / PT' },
  { value: 'PARENT', label: 'Parent / Guardian' },
  { value: 'ADMIN', label: 'Administrator' },
];

export const RegisterPage = () => {
  const { register, status, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('COACH');
  const [athleteId, setAthleteId] = useState('');
  const [athleteDisplayName, setAthleteDisplayName] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);
    try {
      await register({
        email,
        password,
        role,
        athleteId: athleteId.trim() || undefined,
        athleteDisplayName: athleteDisplayName.trim() || undefined,
      });
      navigate('/');
    } catch (err) {
      setLocalError((err as Error).message);
    }
  };

  const requiresAthleteLink = role === 'ATHLETE' || role === 'PARENT';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) => theme.palette.grey[100],
        p: 3,
      }}
    >
      <Card sx={{ maxWidth: 520, width: '100%' }}>
        <CardContent>
          <Stack spacing={3} component="form" onSubmit={handleSubmit}>
            <Box>
              <Typography variant="h5" fontWeight={600}>
                Create your account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get access to risk insights, rehab checkpoints, and instant coaching cues.
              </Typography>
            </Box>

            <ErrorAlert message={localError ?? error} />

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              fullWidth
              autoComplete="email"
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              fullWidth
              autoComplete="new-password"
            />

            <TextField
              label="Role"
              select
              fullWidth
              value={role}
              onChange={(event) => setRole(event.target.value as Role)}
            >
              {ROLES.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            {requiresAthleteLink && (
              <>
                <TextField
                  label="Athlete ID"
                  placeholder="rb-12"
                  value={athleteId}
                  onChange={(event) => setAthleteId(event.target.value)}
                  fullWidth
                  required={role === 'ATHLETE'}
                />
                <TextField
                  label="Athlete display name"
                  placeholder="RB #12"
                  value={athleteDisplayName}
                  onChange={(event) => setAthleteDisplayName(event.target.value)}
                  fullWidth
                />
              </>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Creating account…' : 'Register'}
            </Button>

          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Button component={Link} to="/login" variant="text" size="small">
              Sign in
            </Button>
          </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};
