import { useCallback, useEffect, useMemo, useState } from 'react';
import { alpha } from '@mui/material/styles';
import {
  Backdrop,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import SensorsIcon from '@mui/icons-material/Sensors';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ScienceIcon from '@mui/icons-material/Science';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TimelineIcon from '@mui/icons-material/Timeline';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CloseIcon from '@mui/icons-material/Close';
import { formatDistanceToNow } from 'date-fns';
import { Navigate } from 'react-router-dom';
import {
  createWearableSession,
  fetchWearableFeatures,
  flushWearableSession,
  sendWearableFeaturesToRisk,
  streamWearableSamples,
  type WearableFeatureWindow,
  type WearableSampleWindowPayload,
  type WearableSample,
} from '@/api/wearables';
import { useAuth } from '@/hooks/useAuth';
import { features as wearableFlags, isWearableIntegrationActive } from '@/config/features';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { ConnectionVisualizer } from './components/ConnectionVisualizer';

type Status = 'idle' | 'scanning' | 'connecting' | 'handshake' | 'streaming' | 'error';
type SessionStatus = 'stable' | 'watch' | 'alert';
type ToastState = { open: boolean; severity: 'success' | 'info' | 'warning' | 'error'; message: string };

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_DEVICES = [
  { id: 'KneeStrap-001', rssi: -58 },
  { id: 'KneeStrap-014', rssi: -64 },
  { id: 'AnkleBand-007', rssi: -70 },
];

const now = Date.now();
const MOCK_SESSION_HISTORY: Array<{
  id: string;
  ts: number;
  dev: string;
  notes: string;
  status: SessionStatus;
}> = [
  { id: '#1241', ts: now - 1000 * 60 * 42, dev: 'KneeStrap-001', notes: 'Reactive drop jumps • clean signals', status: 'stable' },
  { id: '#1238', ts: now - 1000 * 60 * 210, dev: 'KneeStrap-014', notes: 'Tempo COD set • rising valgus', status: 'watch' },
  { id: '#1229', ts: now - 1000 * 60 * 530, dev: 'AnkleBand-007', notes: 'Asymmetry screen • coach review', status: 'alert' },
];

const SESSION_STATUS_META: Record<SessionStatus, { label: string; color: 'success' | 'warning' | 'error' }> = {
  stable: { label: 'Stable', color: 'success' },
  watch: { label: 'Watch', color: 'warning' },
  alert: { label: 'Review', color: 'error' },
};

const StatusPill = ({ status }: { status: Status }) => {
  const map: Record<Status, { color: 'default' | 'primary' | 'success' | 'warning' | 'error'; label: string }> = {
    idle: { color: 'default', label: 'Idle' },
    scanning: { color: 'primary', label: 'Scanning' },
    connecting: { color: 'primary', label: 'Connecting' },
    handshake: { color: 'primary', label: 'Handshake' },
    streaming: { color: 'success', label: 'Live' },
    error: { color: 'error', label: 'Error' },
  };
  const meta = map[status];
  return <Chip size='small' color={meta.color} variant='outlined' label={meta.label} />;
};

const StreamingIndicator = ({ active }: { active: boolean }) => (
  <Chip
    icon={<FiberManualRecordIcon sx={{ fontSize: 14, mr: -0.5 }} />}
    size='small'
    label={active ? 'Live stream' : 'Link idle'}
    color={active ? 'error' : 'default'}
    variant={active ? 'filled' : 'outlined'}
    sx={{
      bgcolor: (theme) => (active ? alpha(theme.palette.error.main, 0.12) : 'transparent'),
      color: (theme) => (active ? theme.palette.error.light : theme.palette.text.secondary),
      '& .MuiChip-icon': {
        color: (theme) => (active ? theme.palette.error.light : theme.palette.text.secondary),
      },
    }}
  />
);

const BatteryBar = ({ value }: { value: number }) => {
  const pct = Math.max(0, Math.min(100, value));
  const color = pct > 55 ? 'success' : pct > 25 ? 'warning' : 'error';
  return (
    <Box sx={{ minWidth: 130 }}>
      <Tooltip title={`${pct}%`} placement='top'>
        <LinearProgress variant='determinate' value={pct} color={color} sx={{ height: 8, borderRadius: 1 }} />
      </Tooltip>
    </Box>
  );
};

const StrengthBars = ({ value }: { value: number }) => {
  const thresholds = [-85, -75, -67, -60];
  return (
    <Stack direction='row' alignItems='flex-end' spacing={0.5} sx={{ height: 18 }}>
      {thresholds.map((t, idx) => (
        <Box
          key={t}
          sx={{
            width: 6,
            height: 6 + idx * 4,
            borderRadius: 0.5,
            bgcolor: value >= t ? 'info.main' : 'divider',
            transition: 'background-color 0.2s ease',
          }}
        />
      ))}
    </Stack>
  );
};

const Kpi = ({ label, value, hint }: { label: string; value: string; hint?: string }) => (
  <Card variant='outlined' sx={{ height: '100%' }}>
    <CardContent sx={{ p: 2 }}>
      <Typography variant='caption' color='text.secondary' sx={{ textTransform: 'uppercase', letterSpacing: 0.6 }}>
        {label}
      </Typography>
      <Typography variant='h6' sx={{ mt: 0.5 }}>
        {value}
      </Typography>
      {hint && (
        <Typography variant='caption' color='text.secondary'>
          {hint}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const Sparkline = ({
  points,
  min,
  max,
  label,
  unit,
  height = 64,
}: {
  points: number[];
  min: number;
  max: number;
  label: string;
  unit?: string;
  height?: number;
}) => {
  const safePoints = points.length ? points : [min];
  const h = height;
  const w = 280;
  const safeMin = Math.min(min, ...safePoints);
  const safeMax = Math.max(max, ...safePoints);
  const range = Math.max(1e-6, safeMax - safeMin);
  const last = safePoints[safePoints.length - 1];

  const poly = safePoints
    .map((value, index) => {
      const x = (index / Math.max(1, safePoints.length - 1)) * w;
      const y = h - ((value - safeMin) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const path = safePoints
    .map((value, index) => {
      const x = (index / Math.max(1, safePoints.length - 1)) * w;
      const y = h - ((value - safeMin) / range) * h;
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <Card variant='outlined'>
      <CardContent sx={{ p: 2 }}>
        <Stack direction='row' alignItems='center' justifyContent='space-between'>
          <Typography variant='caption' color='text.secondary' sx={{ textTransform: 'uppercase', letterSpacing: 0.6 }}>
            {label}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {last?.toFixed?.(1)}
            {unit}
          </Typography>
        </Stack>
        <Box component='svg' viewBox={`0 0 ${w} ${h}`} sx={{ mt: 1, width: '100%' }} preserveAspectRatio='none'>
          <rect x={0} y={0} width={w} height={h} fill='#0b1020' />
          <polyline
            points={poly}
            fill='none'
            stroke='#60a5fa'
            strokeWidth={2}
            strokeLinejoin='round'
            strokeLinecap='round'
          />
          <path d={`${path} L ${w},${h} L 0,${h} Z`} fill='rgba(96,165,250,0.18)' />
        </Box>
      </CardContent>
    </Card>
  );
};

const HeroStat = ({ label, value, detail }: { label: string; value: string; detail?: string }) => (
  <Box
    sx={(theme) => ({
      px: 2,
      py: 1.5,
      borderRadius: 2.5,
      minWidth: 160,
      border: `1px solid ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.35 : 0.2)}`,
      backgroundColor: alpha(
        theme.palette.mode === 'dark' ? theme.palette.background.paper : '#ffffff',
        theme.palette.mode === 'dark' ? 0.45 : 0.9,
      ),
      backdropFilter: 'blur(12px)',
    })}
  >
    <Typography variant='caption' color='text.secondary'>
      {label}
    </Typography>
    <Typography variant='h6' sx={{ mt: 0.2 }}>
      {value}
    </Typography>
    {detail && (
      <Typography variant='caption' color='text.secondary'>
        {detail}
      </Typography>
    )}
  </Box>
);

const normaliseFeatureWindows = (
  incoming: WearableFeatureWindow[] | undefined,
  existingCount: number,
): WearableFeatureWindow[] => {
  if (!incoming || !incoming.length) return [];
  return incoming.map((feature, index) => ({
    ...feature,
    id: feature.id ?? `${feature.windowTs}-${existingCount + index}`,
  }));
};

const SAMPLE_RATE_HZ = 128;
const SAMPLES_PER_WINDOW = 160;
const SAMPLE_INTERVAL_MS = Math.round(1000 / SAMPLE_RATE_HZ);
const WINDOW_DURATION_MS = SAMPLES_PER_WINDOW * SAMPLE_INTERVAL_MS;

const createMockSampleWindow = ({
  windowIndex,
  startTs,
  drillType,
  side,
}: {
  windowIndex: number;
  startTs: number;
  drillType: 'drop_jump' | 'planned_cut';
  side: 'left' | 'right';
}): WearableSampleWindowPayload => {
  const windowStart = startTs + windowIndex * (WINDOW_DURATION_MS + 360);
  const fatigueFactor = 1 + windowIndex * 0.05;
  const landingMagnitude = drillType === 'drop_jump' ? 28 : 22;
  const samples: WearableSample[] = Array.from({ length: SAMPLES_PER_WINDOW }, (_, idx) => {
    const ts = windowStart + idx * SAMPLE_INTERVAL_MS;
    const phase = idx / SAMPLES_PER_WINDOW;
    const landingPulse = Math.exp(-((phase - 0.18) ** 2) / 0.0026) * landingMagnitude * fatigueFactor;
    const swayAmplitude = drillType === 'planned_cut' ? 4.8 : 3.5;
    const sway = Math.sin(phase * Math.PI * 4) * swayAmplitude * fatigueFactor;
    const stabilityEnvelope = Math.exp(-phase * 4) * 6 * fatigueFactor;
    const rotational = Math.sin(phase * Math.PI * 6) * 140 * fatigueFactor;

    return {
      ts,
      ax: Number((landingPulse + stabilityEnvelope + (Math.random() - 0.5) * 0.8).toFixed(3)),
      ay: Number((((side === 'left' ? -1 : 1) * sway) + (Math.random() - 0.5) * 0.6).toFixed(3)),
      az: Number((9.81 + Math.cos(phase * Math.PI * 2) * 4 + (Math.random() - 0.5) * 0.4).toFixed(3)),
      gx: Number((rotational * 0.35 + (Math.random() - 0.5) * 4).toFixed(3)),
      gy: Number((Math.cos(phase * Math.PI * 3) * 160 + (Math.random() - 0.5) * 6).toFixed(3)),
      gz: Number((Math.abs(Math.sin(phase * Math.PI * 4.2)) * 150 + (Math.random() - 0.5) * 5).toFixed(3)),
      side,
    };
  });

  return {
    windowTs: new Date(windowStart + WINDOW_DURATION_MS / 2).toISOString(),
    side,
    samples,
  };
};

const buildMockWindows = (count: number, drillType: 'drop_jump' | 'planned_cut') => {
  const startTs = Date.now();
  return Array.from({ length: count }, (_, index) =>
    createMockSampleWindow({
      windowIndex: index,
      startTs,
      drillType,
      side: index % 2 === 0 ? 'left' : 'right',
    }),
  );
};

export const WearablePage = () => {
  const { user } = useAuth();
  const defaultAthleteId = useMemo(() => user?.athleteId ?? 'athlete-sim', [user?.athleteId]);

  const [status, setStatus] = useState<Status>('idle');
  const [battery, setBattery] = useState(87);
  const [rssi, setRssi] = useState(-58);
  const [packets, setPackets] = useState(0);
  const [athleteId, setAthleteId] = useState(defaultAthleteId);
  const [drillType, setDrillType] = useState<'drop_jump' | 'planned_cut'>('drop_jump');
  const [selectedDevice, setSelectedDevice] = useState<string>(MOCK_DEVICES[0]?.id ?? '');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [features, setFeatures] = useState<WearableFeatureWindow[]>([]);
  const [impactSeries, setImpactSeries] = useState<number[]>(() => Array.from({ length: 24 }, () => 1.4 + Math.random() * 0.6));
  const [asiSeries, setAsiSeries] = useState<number[]>(() => Array.from({ length: 24 }, () => 3 + Math.random() * 4));
  const [signalSeries, setSignalSeries] = useState<number[]>(() => Array.from({ length: 24 }, () => -62 + Math.random() * 6));
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [streaming, setStreaming] = useState(false);

  const canConnect = useMemo(() => status === 'idle' || status === 'error', [status]);
  const canDisconnect = useMemo(() => status === 'streaming' || status === 'handshake' || status === 'connecting', [status]);
  const lastWindowTs = features.length ? features[features.length - 1].windowTs : null;

  const closeToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    if (status !== 'streaming') return;
    const timer = setInterval(() => {
      setPackets((prev) => prev + Math.floor(48 + Math.random() * 24));
      setBattery((prev) => Math.max(0, prev - (Math.random() < 0.05 ? 1 : 0)));
      setRssi(-62 + Math.floor(Math.sin(Date.now() / 900) * 6));
      setSignalSeries((series) => [...series, -62 + Math.sin(Date.now() / 900) * 6 + (Math.random() - 0.5) * 2].slice(-120));
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (!features.length) return;
    setImpactSeries((series) =>
      [...series, ...features.slice(-8).map((f) => (f.contactMs ?? 0) / 120)].slice(-120),
    );
    setAsiSeries((series) =>
      [...series, ...features.slice(-8).map((f) => Math.max(0, f.asymmetryPct ?? 0))].slice(-120),
    );
  }, [features]);

  const liveMetrics = useMemo(() => {
    if (!features.length) return null;
    const recent = features.slice(-10);
    const average = (values: (number | undefined)[]) => {
      const valid = values.filter((value): value is number => typeof value === 'number');
      if (!valid.length) return undefined;
      return valid.reduce((acc, curr) => acc + curr, 0) / valid.length;
    };
    return {
      contactMs: average(recent.map((item) => item.contactMs)),
      stabilityMs: average(recent.map((item) => item.stabilityMs)),
      asymmetryPct: average(recent.map((item) => item.asymmetryPct)),
      confidence: average(recent.map((item) => item.confidence0to1)),
      maxValgus: recent
        .map((item) => item.valgusIdx0to3)
        .filter((value): value is number => typeof value === 'number')
        .reduce((acc, curr) => Math.max(acc, curr), 0),
    };
  }, [features]);

  const streamingIntensity = useMemo(() => {
    if (status !== 'streaming') return 0;
    if (liveMetrics?.confidence) {
      return Math.min(1, Math.max(0.12, liveMetrics.confidence));
    }
    return 0.25;
  }, [liveMetrics, status]);

  const connectionBackdropOpen = status === 'scanning' || status === 'connecting' || status === 'handshake';

  useEffect(() => {
    if (!sessionId || status !== 'streaming') return;
    let cancelled = false;
    const poll = async () => {
      try {
        const response = await fetchWearableFeatures(sessionId);
        if (!cancelled) {
          setFeatures(normaliseFeatureWindows(response.features, 0));
        }
      } catch {
        // ignore background polling failures
      }
    };
    void poll();
    const interval = window.setInterval(() => {
      void poll();
    }, 9000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [sessionId, status]);

  const requireSession = useCallback(() => {
    if (!sessionId) {
      throw new Error('Start a wearable session first.');
    }
    return sessionId;
  }, [sessionId]);

  const handleConnect = useCallback(async () => {
    if (!selectedDevice) {
      setToast({ open: true, severity: 'warning', message: 'Select a device before connecting.' });
      return;
    }
    try {
      setError(null);
      setStatus('scanning');
      await wait(900);
      setStatus('connecting');
      await wait(1100);
      setStatus('handshake');
      await wait(800);

      setLoading(true);
      const response = await createWearableSession({
        athleteId,
        drillType,
        deviceIds: [selectedDevice],
        surface: 'turf',
        tempF: 78,
        humidityPct: 58,
      });

      setSessionId(response.sessionId);
      setFeatures([]);
      setPackets(0);
      setBattery(87);
      setRssi(-58);
      setStatus('streaming');
      setToast({ open: true, severity: 'success', message: 'Wearable connected and session started.' });
    } catch (err) {
      setStatus('error');
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [athleteId, drillType, selectedDevice]);

  const handleDisconnect = useCallback(async () => {
    setStatus('idle');
    setSessionId(null);
    setFeatures([]);
    setPackets(0);
    setStreaming(false);
    setToast({ open: true, severity: 'info', message: 'Wearable disconnected.' });
  }, []);

  const handleStreamMock = useCallback(
    async (windows = 6) => {
      try {
        const activeSession = requireSession();
        setStreaming(true);
        const payload: WearableSampleWindowPayload[] = buildMockWindows(windows, drillType);
        const response = await streamWearableSamples(activeSession, payload);
        setPackets((prev) => prev + windows * SAMPLES_PER_WINDOW);
        setFeatures((prev) => [...prev, ...normaliseFeatureWindows(response.features, prev.length)]);
        setToast({ open: true, severity: 'info', message: `Mock windows streamed (${windows}).` });
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setStreaming(false);
      }
    },
    [drillType, requireSession],
  );

  const handleFlush = useCallback(async () => {
    try {
      setLoading(true);
      const activeSession = requireSession();
      await flushWearableSession(activeSession);
      const response = await fetchWearableFeatures(activeSession);
      setFeatures(normaliseFeatureWindows(response.features, 0));
      setToast({ open: true, severity: 'success', message: 'Session flushed & features refreshed.' });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [requireSession]);

  const handleSendToRisk = useCallback(async () => {
    try {
      if (!features.length) {
        throw new Error('No wearable features available yet.');
      }
      await sendWearableFeaturesToRisk(
        athleteId,
        features.map((feature) => ({
          contactMs: feature.contactMs,
          stabilityMs: feature.stabilityMs,
          valgusIdx0to3: feature.valgusIdx0to3,
          asymmetryPct: feature.asymmetryPct,
          confidence0to1: feature.confidence0to1,
        })),
      );
      setToast({ open: true, severity: 'success', message: 'Wearable features pushed to risk engine.' });
    } catch (err) {
      setError((err as Error).message);
    }
  }, [athleteId, features]);

  const sessionPreview = sessionId ? `${sessionId.slice(0, 8)}…` : 'Not started';
  const lastWindowRelative = lastWindowTs ? formatDistanceToNow(new Date(lastWindowTs), { addSuffix: true }) : 'Awaiting data';
  const telemetryCallouts = [
    { label: 'Confidence', value: liveMetrics?.confidence ? `${(liveMetrics.confidence * 100).toFixed(0)} %` : '--' },
    { label: 'Contact', value: liveMetrics?.contactMs ? `${liveMetrics.contactMs.toFixed(0)} ms` : '--' },
    { label: 'Stability', value: liveMetrics?.stabilityMs ? `${liveMetrics.stabilityMs.toFixed(0)} ms` : '--' },
    { label: 'Valgus', value: liveMetrics?.maxValgus !== undefined ? `${liveMetrics.maxValgus}/3` : '--' },
  ];
  if (!isWearableIntegrationActive) {
    return <Navigate to='/' replace />;
  }

  return (
    <>
      <Box
        sx={(theme) => ({
          minHeight: '100vh',
          py: { xs: 3, md: 5 },
          backgroundImage:
            theme.palette.mode === 'dark'
              ? 'radial-gradient(circle at 20% 20%, rgba(99,245,197,0.12) 0%, transparent 50%), radial-gradient(circle at 85% 0%, rgba(53,99,255,0.18) 0%, transparent 45%)'
              : 'radial-gradient(circle at 28% 18%, rgba(53,99,255,0.12) 0%, transparent 45%), radial-gradient(circle at 80% 0%, rgba(32,201,151,0.14) 0%, transparent 40%)',
        })}
      >
        <Box sx={{ maxWidth: 1320, mx: 'auto', px: { xs: 2, md: 3 }, pb: 6 }}>
          <Paper
            variant='outlined'
            sx={(theme) => ({
              position: 'relative',
              overflow: 'hidden',
              mb: 3,
              p: { xs: 3, md: 4 },
              bgcolor: 'transparent',
              backgroundImage:
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(18,28,64,0.95) 0%, rgba(11,18,42,0.98) 45%, rgba(19,66,112,0.9) 100%)'
                  : 'linear-gradient(135deg, rgba(232,239,255,0.95) 0%, rgba(218,233,255,0.9) 45%, rgba(226,247,241,0.9) 100%)',
            })}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                background:
                  'radial-gradient(circle at 20% 20%, rgba(99,245,197,0.2) 0%, transparent 38%), radial-gradient(circle at 80% 0%, rgba(53,99,255,0.25) 0%, transparent 40%)',
              }}
            />
            <Grid container spacing={3} alignItems='center'>
              <Grid item xs={12} md={6}>
                <Stack spacing={1.5} sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography variant='overline' color='text.secondary'>
                    Movement Coach · Wearables
                  </Typography>
                  <Typography variant='h4' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SensorsIcon color='primary' /> Command center (mock)
                  </Typography>
                  <Typography variant='body1' color='text.secondary' sx={{ maxWidth: 500 }}>
                    Connect to the mocked IMU stack, watch live feature extraction, and push clean windows into the risk engine.
                    Everything here is gated behind the {wearableFlags.wearablesMode?.toUpperCase() ?? 'OFF'} flag so it is ready for
                    real BLE later.
                  </Typography>
                  <Stack direction='row' spacing={1} flexWrap='wrap' alignItems='center'>
                    <StatusPill status={status} />
                    <Chip
                      size='small'
                      variant='outlined'
                      label={`Mode · ${(wearableFlags.wearablesMode ?? 'off').toUpperCase()}`}
                    />
                    <StreamingIndicator active={status === 'streaming'} />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }} flexWrap='wrap'>
                    {canConnect && (
                      <Button
                        variant='contained'
                        color='primary'
                        onClick={handleConnect}
                        disabled={!selectedDevice || loading}
                        sx={{ minWidth: 140 }}
                      >
                        Connect
                      </Button>
                    )}
                    {canDisconnect && (
                      <Button variant='outlined' color='inherit' onClick={handleDisconnect} sx={{ minWidth: 140 }}>
                        Disconnect
                      </Button>
                    )}
                    <Chip size='small' variant='outlined' label={sessionId ? `Session ${sessionPreview}` : 'No active session'} />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <HeroStat label='Active session' value={sessionPreview} detail={`Athlete ${athleteId}`} />
                    <HeroStat label='Last window' value={lastWindowRelative} detail={`Confidence ${telemetryCallouts[0].value}`} />
                    <HeroStat label='Feature windows' value={`${features.length}`} detail={`${packets.toLocaleString()} packets`} />
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ position: 'relative' }}>
                  <ConnectionVisualizer status={status} streamingIntensity={streamingIntensity} />
                  <Paper
                    sx={(theme) => ({
                      position: 'absolute',
                      bottom: 16,
                      right: 16,
                      px: 2,
                      py: 1.5,
                      minWidth: 240,
                      backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.85 : 0.9),
                      boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
                    })}
                  >
                    <Typography variant='caption' color='text.secondary'>
                      Link health
                    </Typography>
                    <Stack direction='row' spacing={2} alignItems='center' justifyContent='space-between' sx={{ mt: 0.5 }}>
                      <Stack direction='row' spacing={1.2} alignItems='center'>
                        <Typography variant='body2' color='text.secondary'>
                          Signal
                        </Typography>
                        <StrengthBars value={rssi} />
                        <Typography variant='caption' color='text.secondary'>
                          {rssi} dBm
                        </Typography>
                      </Stack>
                      <Stack direction='row' spacing={1.2} alignItems='center'>
                        <Typography variant='body2' color='text.secondary'>
                          Battery
                        </Typography>
                        <BatteryBar value={battery} />
                      </Stack>
                    </Stack>
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Card variant='outlined'>
                {(status === 'connecting' || status === 'handshake' || status === 'scanning') && <LinearProgress />}
                <CardContent>
                  <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent='space-between' spacing={1}>
                    <Box>
                      <Typography variant='subtitle2'>Connection & telemetry</Typography>
                      <Typography variant='body2' color='text.secondary'>
                        Charts update from the server-side feature extractor while streaming is active.
                      </Typography>
                    </Box>
                    <StreamingIndicator active={status === 'streaming'} />
                  </Stack>

                  <Stack
                    direction={{ xs: 'column', lg: 'row' }}
                    spacing={2}
                    alignItems={{ lg: 'center' }}
                    justifyContent={{ lg: 'space-between' }}
                    sx={{ mt: 1.5 }}
                  >
                    <FormControl size='small' sx={{ minWidth: 220 }} disabled={!canConnect}>
                      <InputLabel id='device-label'>Device</InputLabel>
                      <Select
                        labelId='device-label'
                        label='Device'
                        value={selectedDevice}
                        onChange={(event) => setSelectedDevice(String(event.target.value))}
                      >
                        {MOCK_DEVICES.map((deviceOption) => (
                          <MenuItem key={deviceOption.id} value={deviceOption.id}>
                            {deviceOption.id} ({deviceOption.rssi} dBm)
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Stack direction='row' spacing={4} alignItems='center'>
                      <Stack direction='row' spacing={1.5} alignItems='center'>
                        <Typography variant='body2' color='text.secondary'>
                          Signal
                        </Typography>
                        <StrengthBars value={rssi} />
                        <Typography variant='caption' color='text.secondary'>
                          {rssi} dBm
                        </Typography>
                      </Stack>
                      <Stack direction='row' spacing={1.5} alignItems='center'>
                        <Typography variant='body2' color='text.secondary'>
                          Battery
                        </Typography>
                        <BatteryBar value={battery} />
                        <Typography variant='caption' color='text.secondary'>
                          {battery}%
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>

                  <Grid container spacing={1.5} sx={{ mt: 1.5 }}>
                    <Grid item xs={6} md={3}>
                      <Kpi label='Packets' value={packets.toLocaleString()} hint='BLE frames processed' />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Kpi label='Latency' value={`${(20 + Math.random() * 10).toFixed(0)} ms`} hint='Est. BLE latency' />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Kpi
                        label='Stride ASI'
                        value={
                          liveMetrics?.asymmetryPct !== undefined ? `${liveMetrics.asymmetryPct.toFixed(1)} %` : '--'
                        }
                        hint='Median asymmetry'
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Kpi
                        label='Impact'
                        value={liveMetrics?.contactMs !== undefined ? `${(liveMetrics.contactMs / 100).toFixed(2)} g` : '--'}
                        hint='Contact intensity est.'
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={1.5} sx={{ mt: 1.5 }}>
                    <Grid item xs={12} md={4}>
                      <Sparkline points={impactSeries} min={0.5} max={3.5} label='Impact (g)' unit='g' />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Sparkline points={asiSeries} min={0} max={12} label='Stride ASI (%)' unit='%' />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Sparkline points={signalSeries} min={-80} max={-50} label='Signal (dBm)' />
                    </Grid>
                  </Grid>

                  <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mt: 1.5 }}>
                    Tip: click <strong>Stream sample windows</strong> to generate deterministic IMU windows. The backend normalises
                    them, extracts features, and writes to Prisma before returning live telemetry.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card variant='outlined' sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant='subtitle2'>Session actions</Typography>
                  <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
                    Configure the mocked session context, then stream data or forward the latest windows to the risk engine.
                  </Typography>
                  <Stack spacing={1.4} sx={{ mt: 1.5 }}>
                    <TextField
                      label='Athlete ID'
                      value={athleteId}
                      onChange={(event) => setAthleteId(event.target.value)}
                      size='small'
                      fullWidth
                    />
                    <TextField
                      select
                      label='Drill type'
                      value={drillType}
                      onChange={(event) => setDrillType(event.target.value as 'drop_jump' | 'planned_cut')}
                      size='small'
                      fullWidth
                    >
                      <MenuItem value='drop_jump'>Drop jump</MenuItem>
                      <MenuItem value='planned_cut'>Planned cut</MenuItem>
                    </TextField>
                    <Typography variant='caption' color='text.secondary'>
                      Session ID: {sessionId ?? '–'}
                    </Typography>
                  </Stack>
                </CardContent>
                <CardActions sx={{ px: 3, pb: 3, gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    variant='contained'
                    startIcon={<PlayArrowIcon />}
                    onClick={() => handleStreamMock(8)}
                    disabled={status !== 'streaming' || streaming || !sessionId}
                  >
                    {streaming ? 'Streaming…' : 'Stream sample windows'}
                  </Button>
                  <Button variant='outlined' startIcon={<ScienceIcon />} onClick={handleFlush} disabled={!sessionId || loading}>
                    Flush
                  </Button>
                  <Tooltip title='Send most recent wearable features into the blended risk score'>
                    <span>
                      <Button
                        variant='outlined'
                        startIcon={<CheckCircleIcon />}
                        color='secondary'
                        onClick={handleSendToRisk}
                        disabled={!features.length}
                      >
                        Send to risk
                      </Button>
                    </span>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={7}>
              <Card variant='outlined'>
                <CardContent>
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent='space-between' spacing={1}>
                    <Box>
                      <Typography variant='subtitle2'>Live windows</Typography>
                      <Typography variant='body2' color='text.secondary'>
                        Latest feature windows produced by the mock extractor & stored via Prisma.
                      </Typography>
                    </Box>
                    <Stack direction='row' spacing={1} alignItems='center'>
                      <StreamingIndicator active={status === 'streaming'} />
                      <Chip size='small' variant='outlined' label={sessionId ? `Session ${sessionPreview}` : 'No session'} />
                    </Stack>
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 1.5 }} flexWrap='wrap'>
                    {telemetryCallouts.map((callout) => (
                      <Box
                        key={callout.label}
                        sx={(theme) => ({
                          px: 1.5,
                          py: 1,
                          borderRadius: 2,
                          border: `1px solid ${alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.25 : 0.18)}`,
                          minWidth: 120,
                        })}
                      >
                        <Typography variant='caption' color='text.secondary'>
                          {callout.label}
                        </Typography>
                        <Typography variant='subtitle2'>{callout.value}</Typography>
                      </Box>
                    ))}
                  </Stack>
                  <Divider sx={{ my: 1.75 }} />
                  <Stack spacing={1.2}>
                    {features.length === 0 ? (
                      <Typography variant='body2' color='text.secondary'>
                        No wearable windows computed yet. Stream mock data to populate the timeline.
                      </Typography>
                    ) : (
                      features
                        .slice(-8)
                        .reverse()
                        .map((feature) => {
                          const relative = formatDistanceToNow(new Date(feature.windowTs), { addSuffix: true });
                          return (
                            <Paper
                              key={feature.id}
                              variant='outlined'
                              sx={{
                                borderRadius: 3,
                                px: 2,
                                py: 1.5,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 0.75,
                              }}
                            >
                              <Stack direction='row' alignItems='center' spacing={1}>
                                <TimelineIcon fontSize='small' color='primary' />
                                <Typography variant='subtitle2'>
                                  {new Date(feature.windowTs).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                  })}
                                </Typography>
                                <Chip size='small' variant='outlined' label={relative} />
                                <Chip size='small' label={`Confidence ${(feature.confidence0to1 ?? 0).toFixed(2)}`} />
                              </Stack>
                              <LinearProgress
                                variant='determinate'
                                value={(feature.confidence0to1 ?? 0) * 100}
                                sx={{ height: 6, borderRadius: 999 }}
                              />
                              <Stack direction='row' spacing={1} flexWrap='wrap'>
                                {typeof feature.contactMs === 'number' && <Chip size='small' label={`Contact ${feature.contactMs} ms`} />}
                                {typeof feature.stabilityMs === 'number' && (
                                  <Chip size='small' label={`Stability ${feature.stabilityMs} ms`} />
                                )}
                                {typeof feature.valgusIdx0to3 === 'number' && (
                                  <Chip size='small' label={`Valgus idx ${feature.valgusIdx0to3}/3`} />
                                )}
                                {typeof feature.asymmetryPct === 'number' && (
                                  <Chip size='small' label={`Asym ${feature.asymmetryPct.toFixed(1)} %`} />
                                )}
                              </Stack>
                            </Paper>
                          );
                        })
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card variant='outlined' sx={{ height: '100%' }}>
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='subtitle2'>Recent sessions</Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Mocked history across different devices to test roster tiles & status chips.
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Stack divider={<Divider flexItem />} spacing={1.2} sx={{ flexGrow: 1 }}>
                    {MOCK_SESSION_HISTORY.map((row) => (
                      <Stack
                        key={row.id}
                        direction={{ xs: 'column', sm: 'row' }}
                        alignItems={{ sm: 'center' }}
                        justifyContent='space-between'
                        spacing={1}
                      >
                        <Box>
                          <Typography variant='body2' fontWeight={600}>
                            Session {row.id}
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            {formatDistanceToNow(row.ts, { addSuffix: true })} • {row.dev}
                          </Typography>
                        </Box>
                        <Stack direction='row' spacing={1} alignItems='center'>
                          <Chip
                            size='small'
                            color={SESSION_STATUS_META[row.status].color}
                            label={SESSION_STATUS_META[row.status].label}
                          />
                          <Typography variant='body2' color='text.secondary'>
                            {row.notes}
                          </Typography>
                        </Stack>
                      </Stack>
                    ))}
                  </Stack>
                  <Button variant='text' size='small' sx={{ mt: 1 }}>
                    Review archive
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Backdrop
        sx={(theme) => ({
          color: '#fff',
          zIndex: theme.zIndex.modal + 1,
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(4,7,20,0.78)',
          p: 2,
        })}
        open={connectionBackdropOpen}
      >
        <Paper
          sx={(theme) => ({
            width: 'min(720px, 90vw)',
            p: { xs: 2.5, md: 3.5 },
            borderRadius: 4,
            backgroundImage:
              theme.palette.mode === 'dark'
                ? 'radial-gradient(circle at 15% 20%, rgba(53,99,255,0.35) 0%, transparent 55%), linear-gradient(160deg, rgba(12,15,32,0.95) 0%, rgba(7,9,22,0.93) 100%)'
                : 'radial-gradient(circle at 15% 20%, rgba(53,99,255,0.15) 0%, transparent 55%), linear-gradient(160deg, rgba(255,255,255,0.96) 0%, rgba(233,240,255,0.95) 100%)',
          })}
        >
          <Stack spacing={2.5}>
            <Stack spacing={0.5}>
              <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 2 }}>
                {status === 'scanning' ? 'Scanning nearby devices' : status === 'connecting' ? 'Connecting' : 'Handshake in progress'}
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                Position wearable on the distal thigh and keep athlete still
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We’re establishing a BLE link and validating signal quality. This mock diagram shows the exact placement we expect for drop
                jump sessions—adhesive pad above patella, tethered reference below. Hold steady until the badge says “Live”.
              </Typography>
            </Stack>
            <Box sx={{ borderRadius: 3, overflow: 'hidden', border: (theme) => `1px solid ${theme.palette.divider}`, bgcolor: 'background.default' }}>
              <ConnectionVisualizer status={status} streamingIntensity={Math.max(streamingIntensity, 0.2)} />
            </Box>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.2} justifyContent="space-between" alignItems={{ md: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Tip: keep the wearable within 2m of the capture tablet for a reliable handshake.
              </Typography>
              <Button variant="outlined" color="inherit" onClick={handleDisconnect} size="small">
                Cancel connection
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Backdrop>

      <ErrorAlert message={error} />

      <Snackbar
        open={toast?.open ?? false}
        autoHideDuration={3200}
        onClose={closeToast}
        message={toast?.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        action={
          <Button color='inherit' size='small' onClick={closeToast} startIcon={<CloseIcon fontSize='small' />}>
            Close
          </Button>
        }
      />
    </>
  );
};
