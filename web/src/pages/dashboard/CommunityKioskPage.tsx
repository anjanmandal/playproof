import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReplayIcon from '@mui/icons-material/Replay';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const TRUST_STATES = [
  { label: 'Lighting', score: 85, tip: 'Move kiosk under brighter lights' },
  { label: 'Framerate', score: 78, tip: 'Close background apps; keep device charged' },
  { label: 'Angle', score: 65, tip: 'Tilt iPad down so knees stay in frame' },
];

const CAPTURE_STEPS = [
  'Place phone/iPad on stand with full body in view.',
  'Mark foot line using floor tape.',
  'Perform 3 hops per leg (single/triple/crossover).',
];

const TRIALS = [
  { leg: 'Left', trial: 1, distance: 148, status: 'ok' },
  { leg: 'Left', trial: 2, distance: 152, status: 'ok' },
  { leg: 'Left', trial: 3, distance: 90, status: 'outlier' },
  { leg: 'Right', trial: 1, distance: 160, status: 'ok' },
  { leg: 'Right', trial: 2, distance: 162, status: 'ok' },
];

const QUEUE = [
  { athlete: 'RB-12', eta: '3 min', status: 'Waiting' },
  { athlete: 'WR-08', eta: '6 min', status: 'In capture' },
  { athlete: 'DB-17', eta: '10 min', status: 'Waiting' },
];

export const CommunityKioskPage = () => {
  const [enteredCode, setEnteredCode] = useState('');
  const [captureStep, setCaptureStep] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleSubmitBundle = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      alert('Bundle submitted! (mock)');
    }, 1500);
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={700}>
        Community Tele-PT Kiosk
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Library / Rec center setup for supervised hop captures and tele-PT queueing.
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <KioskHomeCard code={enteredCode} onCodeChange={setEnteredCode} />
        </Grid>
        <Grid item xs={12} md={4}>
          <QueuePanel />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <GuidedCaptureCard
            stepIndex={captureStep}
            onStepChange={setCaptureStep}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TrustMeterCard />
        </Grid>
      </Grid>

      <ReviewSubmitCard uploading={uploading} onSubmit={handleSubmitBundle} />
    </Stack>
  );
};

const KioskHomeCard = ({ code, onCodeChange }: { code: string; onCodeChange: (value: string) => void }) => (
  <Card>
    <CardContent>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <QrCode2Icon color="primary" />
          <Typography variant="h6">Kiosk home</Typography>
        </Stack>
        <Stack spacing={1}>
          <Typography variant="subtitle2">Check-in code / QR</Typography>
          <Stack direction="row" spacing={1}>
            <TextField
              label="Enter code"
              value={code}
              onChange={(event) => onCodeChange(event.target.value)}
              placeholder="e.g., RB-12"
              fullWidth
            />
            <Button variant="outlined" startIcon={<QrCode2Icon />}>
              Scan QR
            </Button>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Need help? Staff can resend codes from the queue panel.
          </Typography>
        </Stack>
        <Divider />
        <Typography variant="subtitle2">What to expect</Typography>
        <Stack component="ul" spacing={0.5} sx={{ pl: 2, m: 0 }}>
          {['Guided hop capture (10 min)', 'Auto-measured distances + LSI preview', 'Tele-PT follow up if needed'].map((item) => (
            <Typography key={item} component="li" variant="body2">
              {item}
            </Typography>
          ))}
        </Stack>
        <Alert
          icon={<InfoOutlinedIcon fontSize="small" />}
          severity="info"
          sx={{ alignItems: 'flex-start' }}
        >
          Privacy notice: We capture motion landmarks (not raw video). Bundles sync securely to your care team.
        </Alert>
        <Button variant="contained" startIcon={<PlayArrowIcon />} disabled={!code}>
          Begin guided capture
        </Button>
      </Stack>
    </CardContent>
  </Card>
);

const GuidedCaptureCard = ({
  stepIndex,
  onStepChange,
}: {
  stepIndex: number;
  onStepChange: (value: number) => void;
}) => (
  <Card>
    <CardContent>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <PlayArrowIcon color="primary" />
          <Typography variant="h6">Guided capture</Typography>
        </Stack>
        <Stack spacing={1}>
          {CAPTURE_STEPS.map((step, index) => (
            <Card
              key={step}
              variant="outlined"
              sx={{
                borderColor: index === stepIndex ? 'primary.main' : 'divider',
                opacity: index <= stepIndex ? 1 : 0.6,
              }}
            >
              <CardContent sx={{ py: 1.5 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    size="small"
                    color={index < stepIndex ? 'success' : index === stepIndex ? 'primary' : 'default'}
                    label={index < stepIndex ? 'Done' : index === stepIndex ? 'Now' : `Step ${index + 1}`}
                  />
                  <Typography variant="body2">{step}</Typography>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<ReplayIcon />} onClick={() => onStepChange(Math.max(stepIndex - 1, 0))}>
            Retake step
          </Button>
          <Button variant="contained" onClick={() => onStepChange(Math.min(stepIndex + 1, CAPTURE_STEPS.length - 1))}>
            Next step
          </Button>
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);

const TrustMeterCard = () => (
  <Card>
    <CardContent>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h6">Trust meter</Typography>
          <Chip size="small" color="primary" label="Live" />
        </Stack>
        {TRUST_STATES.map((state) => (
          <Stack key={state.label} spacing={0.5}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2">{state.label}</Typography>
              <Typography variant="body2" fontWeight={600}>
                {state.score}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={state.score}
              color={state.score >= 80 ? 'success' : state.score >= 60 ? 'warning' : 'error'}
              sx={{ height: 10, borderRadius: 6 }}
            />
            <Typography variant="caption" color="text.secondary">
              {state.tip}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </CardContent>
  </Card>
);

const ReviewSubmitCard = ({
  uploading,
  onSubmit,
}: {
  uploading: boolean;
  onSubmit: () => void;
}) => (
  <Card>
    <CardContent>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <CloudUploadIcon color="primary" />
          <Typography variant="h6">Review & submit</Typography>
        </Stack>
        <Paper variant="outlined">
          <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Leg</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Trial</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Distance (cm)</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {TRIALS.map((trial, index) => (
                  <tr key={index} style={{ backgroundColor: trial.status === 'outlier' ? 'rgba(255,0,0,0.05)' : undefined }}>
                    <td style={{ padding: '8px' }}>{trial.leg}</td>
                    <td style={{ padding: '8px' }}>{trial.trial}</td>
                    <td style={{ padding: '8px' }}>{trial.distance}</td>
                    <td style={{ padding: '8px' }}>
                      <Chip size="small" color={trial.status === 'outlier' ? 'warning' : 'success'} label={trial.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Paper>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="subtitle2">Median LSI preview</Typography>
          <Typography variant="h6">94% LSI (auto-recomputed)</Typography>
        </Stack>
        <Button variant="contained" startIcon={<CloudUploadIcon />} onClick={onSubmit} disabled={uploading}>
          {uploading ? 'Submitting…' : 'Submit bundle'}
        </Button>
        <Typography variant="caption" color="text.secondary">
          Offline? We’ll sync automatically once kiosk regains connectivity.
        </Typography>
      </Stack>
    </CardContent>
  </Card>
);

const QueuePanel = () => (
  <Card>
    <CardContent>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <PeopleAltIcon color="primary" />
          <Typography variant="h6">Queue & staff panel</Typography>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          Next 5 athletes
        </Typography>
        <Stack spacing={1}>
          {QUEUE.map((entry) => (
            <Card variant="outlined" key={entry.athlete}>
              <CardContent sx={{ py: 1.5 }}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                  <Typography variant="body2" fontWeight={600}>
                    {entry.athlete}
                  </Typography>
                  <Chip size="small" label={entry.eta} />
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  {entry.status}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Button size="small" variant="outlined">
                    Resend code
                  </Button>
                  <Button size="small" variant="text">
                    Troubleshoot
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);

export default CommunityKioskPage;
