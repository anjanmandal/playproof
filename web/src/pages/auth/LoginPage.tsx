import { FormEvent, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
  Divider,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import InsightsIcon from '@mui/icons-material/Insights';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ErrorAlert } from '@/components/common/ErrorAlert';

export const LoginPage = () => {
  const { login, status, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const navigate = useNavigate();

  const featureChips = useMemo(
    () => [
      'Edge Vision Coach',
      'Home Sessions',
      'Tele-PT Clinics',
      'Community Kiosks',
      'Case Channel',
      'Research Hub',
      'Evidence Packs',
      'AI Risk Twin',
    ],
    []
  );

  const featurePillars = useMemo(
    () => [
      {
        title: 'Edge Vision Coach',
        description:
          'MediaPipe pose + KAM surrogate scoring, live trust meter, cue cards, and GPT insights for every rep.',
      },
      {
        title: 'Adaptive Home Sessions',
        description:
          '10–20 min mobility/control/landing blocks that adjust to soreness + form IQ with 3-sec proof clips and streak nudges.',
      },
      {
        title: 'Tele-PT + Clinics',
        description:
          'Parish heat-aware tele-visits, community kiosks, prep checklists, and visit console with RTS gate updates.',
      },
      {
        title: 'Shared Case Channel',
        description:
          'Chronological timeline of risk verdicts, plan diffs, hop evidence, @mentions, and consent-aware sharing.',
      },
      {
        title: 'Research Hub & Evidence',
        description:
          'OpenAI-assisted evidence cards, research search, and one-tap PDF receipts with trust grades and audit trail.',
      },
      {
        title: 'Planner + Guardrails',
        description:
          'AI Risk Twin, Parish heat-index guardrails, cycle-aware tuning, and “record quick clip” CTAs off confidence ribbon.',
      },
    ],
    []
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setLocalError((err as Error).message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'stretch',
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        p: { xs: 3, md: 6 },
      }}
    >
      <Grid container spacing={4} alignItems="center" justifyContent="center">
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              background: 'rgba(15,23,42,0.65)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h4" fontWeight={700}>
                  PivotProof
                </Typography>
                <Typography variant="subtitle1" color="rgba(255,255,255,0.8)">
                  ACL Safety Platform
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {featureChips.map((chip) => (
                    <Chip
                      key={chip}
                      label={chip}
                      size="small"
                      sx={{
                        background: 'rgba(147,197,253,0.15)',
                        color: '#e0f2fe',
                        borderColor: 'rgba(147,197,253,0.4)',
                      }}
                      variant="outlined"
                    />
                  ))}
                </Stack>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                <Stack spacing={1.5}>
                  {featurePillars.map((pillar) => (
                    <FeatureBlurb
                      key={pillar.title}
                      icon={<InsightsIcon sx={{ color: '#93c5fd' }} />}
                      title={pillar.title}
                      description={pillar.description}
                    />
                  ))}
                </Stack>
                <Alert
                  icon={<LockIcon fontSize="small" />}
                  severity="info"
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    border: 'none',
                  }}
                >
                  HIPAA-ready: motion landmarks only, consent-aware evidence sharing.
                </Alert>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card elevation={4}>
            <CardContent>
              <Stack spacing={3} component="form" onSubmit={handleSubmit}>
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    Welcome back
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sign in to continue guarding ACL futures.
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
                  autoComplete="current-password"
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={status === 'loading'}
                  fullWidth
                >
                  {status === 'loading' ? 'Signing in…' : 'Sign in'}
                </Button>

                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Need an account?{' '}
                  <MuiLink component={Link} to="/register">
                    Register here
                  </MuiLink>
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

const FeatureBlurb = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <Stack direction="row" spacing={2} alignItems="flex-start">
    <Box>
      {icon || <AssignmentTurnedInIcon sx={{ color: '#fef3c7' }} />}
    </Box>
    <Box>
      <Typography variant="body1" fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="body2" color="rgba(255,255,255,0.8)">
        {description}
      </Typography>
    </Box>
  </Stack>
);
