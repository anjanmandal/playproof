import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Slider,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SensorsIcon from '@mui/icons-material/Sensors';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import { alpha } from '@mui/material/styles';
import { fetchHomeSessionPlan, requestWearableInsight, submitHomeSessionProof } from '@/api/homeSession';
import { ApiError } from '@/api/client';
import type {
  HomeSessionPlanBlock,
  HomeSessionPlanResponse,
  WearableInsightResponse,
} from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { uploadMedia } from '@/api/media';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';

const gradeColor: Record<'A' | 'B' | 'C', 'success' | 'warning' | 'error'> = {
  A: 'success',
  B: 'warning',
  C: 'error',
};

const teammateLadder = [
  { initials: 'LK', name: 'Lena K.', verified: 5 },
  { initials: 'SD', name: 'Sara D.', verified: 4 },
  { initials: 'ME', name: 'Maya E.', verified: 4 },
];

const wearableRoles = [
  { key: 'imu_lt', label: 'IMU – Left Thigh' },
  { key: 'imu_rs', label: 'IMU – Right Shank' },
  { key: 'gps_ch', label: 'GPS – Chest Pod' },
  { key: 'ins_pu', label: 'Smart Insole' },
] as const;

type DeviceRole = (typeof wearableRoles)[number]['key'];
type TrustGrade = 'A' | 'B' | 'C';

interface WearableDevice {
  id: string;
  role: DeviceRole;
  label: string;
  paired: boolean;
  streaming: boolean;
  firmware: string;
  battery: number;
  rssi: number;
}

interface WearableMetricPacket {
  ts: number;
  valgus: number;
  impact: number;
  decel: number;
  asymmetry: number;
  cutDensity: number;
}

const trustMeta: Record<TrustGrade, { color: 'success' | 'warning' | 'error'; tip: string }> = {
  A: { color: 'success', tip: 'High confidence: steady FPS and consistent trials.' },
  B: { color: 'warning', tip: 'Medium confidence: minor lighting or motion variance.' },
  C: { color: 'error', tip: 'Low confidence: re-test recommended (lighting/FPS/angle).' },
};

const createWearableDevice = (role: DeviceRole, seed: number): WearableDevice => {
  const descriptor = wearableRoles.find((r) => r.key === role);
  return {
    id: `${role}-${seed}`,
    role,
    label: descriptor?.label ?? role,
    paired: seed % 2 === 0,
    streaming: false,
    firmware: `0.${seed}.${(seed * 5) % 10}`,
    battery: Math.min(100, 70 + seed * 5),
    rssi: -45 - seed * 3,
  };
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const INITIAL_SANDBOX = {
  valgus: 0.35,
  impact: 6.4,
  decel: 3.1,
  asymmetry: 0.2,
  cutDensity: 16,
  playerLoad: 312,
  frameRate: 56,
  motionQuality: 0.82,
  bleStrength: -51,
} as const;

const SANDBOX_SLIDERS = [
  { key: 'valgus', label: 'Valgus baseline', min: 0.1, max: 0.9, step: 0.01, format: (value: number) => value.toFixed(2) },
  { key: 'impact', label: 'Landing impact (g)', min: 4, max: 12, step: 0.1, format: (value: number) => value.toFixed(1) },
  { key: 'decel', label: 'Decel load (g)', min: 1.5, max: 5.5, step: 0.1, format: (value: number) => value.toFixed(1) },
  { key: 'asymmetry', label: 'Asymmetry', min: 0, max: 0.5, step: 0.01, format: (value: number) => `${Math.round(value * 100)}%` },
  { key: 'cutDensity', label: 'Cutting density (/min)', min: 5, max: 35, step: 1, format: (value: number) => `${Math.round(value)}` },
  { key: 'playerLoad', label: 'PlayerLoad™', min: 140, max: 600, step: 5, format: (value: number) => `${Math.round(value)}` },
  { key: 'frameRate', label: 'Frame rate (fps)', min: 20, max: 60, step: 1, format: (value: number) => `${Math.round(value)} fps` },
  { key: 'motionQuality', label: 'Motion quality', min: 0.4, max: 1, step: 0.01, format: (value: number) => `${Math.round(value * 100)}%` },
  { key: 'bleStrength', label: 'BLE strength (dBm)', min: -80, max: -30, step: 1, format: (value: number) => `${Math.round(value)} dBm` },
] as const;

type SandboxKey = (typeof SANDBOX_SLIDERS)[number]['key'];

const buildLocalWearableInsight = (
  metrics: WearableMetricPacket | null,
  sandbox: typeof INITIAL_SANDBOX,
  trust: TrustGrade,
): WearableInsightResponse => {
  const source = metrics ?? {
    valgus: sandbox.valgus,
    impact: sandbox.impact,
    decel: sandbox.decel,
    asymmetry: sandbox.asymmetry,
    cutDensity: sandbox.cutDensity,
    ts: Date.now(),
  };
  const cues: string[] = [];
  if (source.valgus > 0.65) cues.push('Drive knees over toes; soften first contact');
  if (source.decel > 4) cues.push('Add extra decel rehearse reps');
  if (source.asymmetry > 0.3) cues.push('Mirror volume on the quieter limb');
  if (!cues.length) cues.push('Keep hips stacked and stay smooth through landings.');
  const statusChip =
    trust === 'A'
      ? 'Verified by IMU + Insole'
      : trust === 'B'
      ? 'Medium trust stream'
      : 'Low trust—recalibrate';
  const watchouts = source.impact > 10 ? ['Landing impact is spiking—swap to landing resets.'] : undefined;
  return {
    summary: `Valgus ${source.valgus.toFixed(2)}, decel ${source.decel.toFixed(1)}g, player load trending ${sandbox.playerLoad.toFixed(0)}. Cut density ${source.cutDensity.toFixed(0)}/min looks ${source.cutDensity > 22 ? 'hot' : 'controlled'}.`,
    cues,
    statusChip,
    confidence: trust === 'A' ? 0.86 : trust === 'B' ? 0.7 : 0.52,
    watchouts,
    generatedAt: new Date().toISOString(),
  };
};


export const HomeSessionPage = () => {
  const { user } = useAuth();
  const athleteIdFromProfile = user?.athleteId ?? '';
  const [athleteId, setAthleteId] = useState(athleteIdFromProfile);
  const [plan, setPlan] = useState<HomeSessionPlanResponse | null>(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [soreness, setSoreness] = useState(3);
  const [availableMinutes, setAvailableMinutes] = useState(18);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [uploadingBlock, setUploadingBlock] = useState<string | null>(null);
  const [wearableDevices, setWearableDevices] = useState<WearableDevice[]>(() =>
    wearableRoles.map((role, index) => createWearableDevice(role.key, index + 1)),
  );
  const [wearableSimulatorOn, setWearableSimulatorOn] = useState(true);
  const [wearableStreaming, setWearableStreaming] = useState(false);
  const [wearablePackets, setWearablePackets] = useState<WearableMetricPacket[]>([]);
  const [calibratingWearables, setCalibratingWearables] = useState(false);
  const [calibrationPct, setCalibrationPct] = useState(0);
  const [selectedDeviceRole, setSelectedDeviceRole] = useState<DeviceRole | null>(null);
  const [sandboxMetrics, setSandboxMetrics] = useState({ ...INITIAL_SANDBOX });
  const [wearableInsight, setWearableInsight] = useState<WearableInsightResponse | null>(null);
  const [wearableInsightLoading, setWearableInsightLoading] = useState(false);
  const [wearableInsightError, setWearableInsightError] = useState<string | null>(null);
  const [wearableAiRemoteAvailable, setWearableAiRemoteAvailable] = useState(true);

  const formGrade = plan?.context.formGrade ?? 'B';
  const formCue = plan?.context.formCue ?? 'Dial in soft landings and breathe between reps.';
  const planSoftened = plan?.context.planSoftened ?? soreness >= 6;

  const planBlocks = plan?.blocks ?? [];

  useEffect(() => {
    if (!athleteId.trim()) {
      setPlan(null);
      setPlanLoading(false);
      return;
    }
    setPlanLoading(true);
    fetchHomeSessionPlan(athleteId.trim(), {
      minutes: availableMinutes,
      soreness,
    })
      .then((response) => {
        setPlan(response);
        setError(null);
      })
      .catch((err: Error) => {
        setError(err.message);
        setPlan(null);
      })
      .finally(() => {
        setPlanLoading(false);
      });
  }, [athleteId, availableMinutes, soreness]);

  const totalMinutes = plan?.completion.targetMinutes ?? planBlocks.reduce((sum, block) => sum + block.minutes, 0);
  const proofMap = plan?.proofs ?? {};
  const completedCount = planBlocks.filter((block) => proofMap[block.key]).length;
  const completionRate =
    planBlocks.length > 0 ? Math.round((completedCount / planBlocks.length) * 100) : 0;
  const lastAssessmentLabel = plan?.context.lastAssessmentAt
    ? new Date(plan.context.lastAssessmentAt).toLocaleString()
    : 'n/a';
  const limbSymmetryScore = plan?.context.limbSymmetryScore ?? null;
  const rescueAvailable = plan?.completion.rescueAvailable ?? totalMinutes > 10;
  const streakDays = plan?.streak.days ?? 0;
  const metricsOnlyConfidence = plan?.verification.confidence ?? 0.75;
  const lsiPercent = limbSymmetryScore != null ? Math.round(limbSymmetryScore * 100) : null;
  const metricsConfidenceColor = metricsOnlyConfidence >= 0.75 ? 'success' : 'warning';
  const streamingFirmware = wearableDevices.find((device) => device.streaming)?.firmware;
  const wearableVerificationTs = wearablePackets[wearablePackets.length - 1]?.ts ?? null;
  const wearableVerificationLabel = wearableStreaming && wearableVerificationTs
    ? `Verified by IMU+Insole · ${new Date(wearableVerificationTs).toLocaleTimeString()}`
    : null;
  const pairedRoles = useMemo(
    () => new Set(wearableDevices.filter((device) => device.paired).map((device) => device.role)),
    [wearableDevices],
  );
  const streamingRoles = useMemo(
    () => new Set(wearableDevices.filter((device) => device.streaming).map((device) => device.role)),
    [wearableDevices],
  );
  const connectedDevices = wearableStreaming
    ? wearableDevices.filter((device) => device.streaming).length
    : wearableDevices.filter((device) => device.paired).length;
  const latestWearablePacket = wearablePackets[wearablePackets.length - 1] ?? null;
  const wearableTrustGrade: TrustGrade = useMemo(() => {
    if (!wearableStreaming || !latestWearablePacket) return 'B';
    const variance =
      Math.abs(latestWearablePacket.impact - 6.5) / 6 +
      Math.abs(latestWearablePacket.decel - 3) / 4;
    if (variance < 0.4) return 'A';
    if (variance < 0.7) return 'B';
    return 'C';
  }, [latestWearablePacket, wearableStreaming]);
  const playerLoadEstimate = useMemo(() =>
    clamp(sandboxMetrics.playerLoad + wearablePackets.length * 0.6, 120, 620),
  [sandboxMetrics.playerLoad, wearablePackets.length]);
  const signalIndicators = useMemo(
    () => [
      {
        label: 'BLE strength',
        value: `${Math.round(sandboxMetrics.bleStrength)} dBm`,
        percent: clamp(((sandboxMetrics.bleStrength + 90) / 60) * 100, 0, 100),
        icon: <SignalCellularAltIcon fontSize="small" />,
      },
      {
        label: 'Frame rate',
        value: `${Math.round(sandboxMetrics.frameRate)} fps`,
        percent: clamp((sandboxMetrics.frameRate / 60) * 100, 0, 100),
        icon: <VideocamIcon fontSize="small" />,
      },
      {
        label: 'Motion quality',
        value: `${Math.round(sandboxMetrics.motionQuality * 100)}%`,
        percent: clamp(sandboxMetrics.motionQuality * 100, 0, 100),
        icon: <NetworkCheckIcon fontSize="small" />,
      },
      {
        label: 'Trust',
        value: `Grade ${wearableTrustGrade}`,
        percent: wearableTrustGrade === 'A' ? 100 : wearableTrustGrade === 'B' ? 70 : 35,
        icon: <SensorsIcon fontSize="small" />,
      },
    ],
    [sandboxMetrics.bleStrength, sandboxMetrics.frameRate, sandboxMetrics.motionQuality, wearableTrustGrade],
  );

  const triggerProofUpload = (blockKey: string) => {
    setSelectedBlock(blockKey);
    fileInputRef.current?.click();
  };

  const refreshPlan = useCallback(() => {
    if (!athleteId.trim()) {
      setPlan(null);
      return;
    }
    setPlanLoading(true);
    fetchHomeSessionPlan(athleteId.trim(), {
      minutes: availableMinutes,
      soreness,
    })
      .then((response) => {
        setPlan(response);
        setError(null);
      })
      .catch((err: Error) => {
        setError(err.message);
        setPlan(null);
      })
      .finally(() => {
        setPlanLoading(false);
      });
  }, [athleteId, availableMinutes, soreness]);

  useEffect(() => {
    void refreshPlan();
  }, [refreshPlan]);

  useEffect(() => {
    const anyPaired = wearableDevices.some((device) => device.paired);
    if (!wearableSimulatorOn || !anyPaired) {
      return undefined;
    }
    const interval = window.setInterval(() => {
      setWearablePackets((prev) => {
        const last = prev[prev.length - 1];
        const jitter = wearableStreaming ? 0.05 : 0.02;
        const control = wearableStreaming ? 1 : 0.5;
        const next: WearableMetricPacket = {
          ts: Date.now(),
          valgus: clamp((last?.valgus ?? sandboxMetrics.valgus) + (Math.random() - 0.5) * jitter, 0.1, 0.9),
          impact: clamp((last?.impact ?? sandboxMetrics.impact) + (Math.random() - 0.5) * 1 * control, 3, 14),
          decel: clamp((last?.decel ?? sandboxMetrics.decel) + (Math.random() - 0.5) * 0.7 * control, 1, 6),
          asymmetry: clamp((last?.asymmetry ?? sandboxMetrics.asymmetry) + (Math.random() - 0.5) * 0.06, 0, 1),
          cutDensity: clamp((last?.cutDensity ?? sandboxMetrics.cutDensity) + (Math.random() - 0.5) * 2, 0, 40),
        };
        return [...prev.slice(-80), next];
      });
      if (wearableStreaming) {
        setWearableDevices((prev) =>
          prev.map((device) =>
            device.paired
              ? {
                  ...device,
                  battery: clamp(
                    device.battery - (Math.random() < 0.3 ? 1 : 0),
                    5,
                    100,
                  ),
                }
              : device,
          ),
        );
      }
    }, wearableStreaming ? 750 : 1300);

    return () => window.clearInterval(interval);
  }, [wearableDevices, wearableSimulatorOn, wearableStreaming, sandboxMetrics]);

  useEffect(() => {
    if (!calibratingWearables) {
      return undefined;
    }
    setCalibrationPct(0);
    const interval = window.setInterval(() => {
      setCalibrationPct((prev) => {
        if (prev >= 100) {
          window.clearInterval(interval);
          setCalibratingWearables(false);
          return 100;
        }
        return Math.min(prev + Math.floor(Math.random() * 9) + 3, 100);
      });
    }, 260);

    return () => window.clearInterval(interval);
  }, [calibratingWearables]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !selectedBlock || !athleteId) return;
    setUploadingBlock(selectedBlock);
    try {
      const upload = await uploadMedia(file, file.name);
      const blockMinutes = planBlocks.find((block) => block.key === selectedBlock)?.minutes;
      await submitHomeSessionProof(athleteId, {
        blockKey: selectedBlock,
        clipUrl: upload.url,
        minutes: blockMinutes,
      });
      await refreshPlan();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploadingBlock(null);
      setSelectedBlock(null);
    }
  };

  const toggleWearableSimulator = () => {
    setWearableSimulatorOn((prev) => {
      const next = !prev;
      if (!next) {
        setWearableStreaming(false);
        setWearableDevices((devices) => devices.map((device) => ({ ...device, streaming: false })));
      }
      return next;
    });
  };

  const toggleWearableStream = () => {
    if (!wearableDevices.some((device) => device.paired)) {
      return;
    }
    setWearableStreaming((prev) => {
      const next = !prev;
      setWearableDevices((devices) =>
        devices.map((device) => ({ ...device, streaming: next && device.paired })),
      );
      return next;
    });
  };

  const toggleDevicePairing = (role: DeviceRole) => {
    setWearableDevices((devices) =>
      devices.map((device) => {
        if (device.role !== role) return device;
        const paired = !device.paired;
        return {
          ...device,
          paired,
          streaming: paired ? wearableStreaming : false,
        };
      }),
    );
  };

  const handleLocateDevice = (role: DeviceRole) => {
    setSelectedDeviceRole((current) => (current === role ? null : role));
  };

  const handleStartCalibration = () => {
    if (!calibratingWearables) {
      setCalibratingWearables(true);
    }
  };

  const handleScanAndPair = () => {
    setWearableDevices((devices) =>
      devices.map((device) => ({ ...device, paired: true, streaming: true })),
    );
    setWearableSimulatorOn(true);
    setWearableStreaming(true);
  };

  const handleSandboxSlider = (key: SandboxKey) => (_event: Event, value: number | number[]) => {
    const nextValue = Array.isArray(value) ? value[0] : value;
    setSandboxMetrics((prev) => ({ ...prev, [key]: nextValue }));
  };

  const captureWearableInsight = useCallback(async () => {
    if (!wearableDevices.some((device) => device.paired)) {
      setWearableInsightError('Pair at least one device to fetch insights.');
      return;
    }
    const latest = latestWearablePacket ?? {
      valgus: sandboxMetrics.valgus,
      impact: sandboxMetrics.impact,
      decel: sandboxMetrics.decel,
      asymmetry: sandboxMetrics.asymmetry,
      cutDensity: sandboxMetrics.cutDensity,
      ts: Date.now(),
    };
    const localInsight = buildLocalWearableInsight(latest, sandboxMetrics, wearableTrustGrade);
    setWearableInsight(localInsight);
    if (!wearableAiRemoteAvailable) {
      setWearableInsightLoading(false);
      return;
    }
    setWearableInsightLoading(true);
    setWearableInsightError(null);
    try {
      const insight = await requestWearableInsight({
        athleteId: athleteId || undefined,
        metrics: {
          ...latest,
          playerLoad: playerLoadEstimate,
          frameRate: sandboxMetrics.frameRate,
          motionQuality: sandboxMetrics.motionQuality,
          bleStrength: sandboxMetrics.bleStrength,
          trust: wearableTrustGrade,
        },
        devices: wearableDevices.map((device) => ({
          id: device.id,
          role: device.role,
          label: device.label,
          paired: device.paired,
          streaming: device.streaming,
          battery: device.battery,
          firmware: device.firmware,
        })),
      });
      setWearableInsight(insight);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setWearableAiRemoteAvailable(false);
        setWearableInsightError('Cloud wearable coach is disabled here—using local preview only.');
      } else {
        setWearableInsightError((err as Error).message || 'Unable to reach AI wearable coach; showing local preview.');
      }
    } finally {
      setWearableInsightLoading(false);
    }
  }, [athleteId, latestWearablePacket, playerLoadEstimate, sandboxMetrics, wearableAiRemoteAvailable, wearableDevices, wearableTrustGrade]);

  useEffect(() => {
    if (
      wearableStreaming &&
      wearableAiRemoteAvailable &&
      wearablePackets.length >= 5 &&
      !wearableInsightLoading &&
      !wearableInsight
    ) {
      void captureWearableInsight();
    }
  }, [captureWearableInsight, wearableAiRemoteAvailable, wearableInsight, wearableInsightLoading, wearablePackets.length, wearableStreaming]);

  const renderPlanBlock = (block: HomeSessionPlanBlock) => {
    const proof = proofMap[block.key];
    const completed = Boolean(proof);
    return (
      <Card key={block.key} variant="outlined">
        <CardContent>
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1" fontWeight={600}>
                {block.title}
              </Typography>
              <Chip
                size="small"
                color={completed ? 'success' : 'default'}
                label={completed ? 'Verified' : `${block.minutes} min`}
              />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {block.focus}
            </Typography>
            <Typography variant="body2">
              {block.sets} sets · {block.reps} reps · {block.intensity}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Cue: {block.cues}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="contained"
                startIcon={<VideocamIcon fontSize="small" />}
                onClick={() => triggerProofUpload(block.key)}
                disabled={uploadingBlock === block.key || planLoading || !athleteId}
              >
                {uploadingBlock === block.key
                  ? 'Uploading…'
                  : proof
                  ? 'Replace clip'
                  : 'Add 3s clip'}
              </Button>
            </Stack>
            {proof && (
              <Typography variant="caption" color="text.secondary">
                Proof captured {new Date(proof.capturedAt).toLocaleTimeString()}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
    );
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={700}>
        Home Session
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Sticky 18-minute plan that adapts to yesterday’s form score and soreness. Complete blocks, drop a
        micro proof clip, and keep the streak alive.
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Stack spacing={3}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                    <Box>
                      <Typography variant="h6">Adaptive plan builder</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Auto-adjust sets based on Form IQ grade, soreness, and time available.
                      </Typography>
                    </Box>
                    {planSoftened && (
                      <Chip color="warning" variant="outlined" label="Plan softened due to context" />
                    )}
                  </Stack>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Athlete ID"
                        value={athleteId}
                        onChange={(event) => setAthleteId(event.target.value)}
                        helperText="Linked profile updates automatically."
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Minutes free"
                        type="number"
                        value={availableMinutes}
                        onChange={(event) => setAvailableMinutes(Number(event.target.value) || 10)}
                        helperText="Today’s window"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Soreness (0-10)"
                        type="number"
                        value={soreness}
                        onChange={(event) =>
                          setSoreness(Math.min(10, Math.max(0, Number(event.target.value) || 0)))
                        }
                        helperText="Morning check-in"
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                  {planLoading ? (
                    <LinearProgress />
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      Latest verified session {lastAssessmentLabel}
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>

            <Stack spacing={2}>
              {planBlocks.length === 0 && !planLoading && (
                <Typography variant="body2" color="text.secondary">
                  Enter an athlete and set available minutes to generate your plan.
                </Typography>
              )}
              {planBlocks.map((block) => renderPlanBlock(block))}
            </Stack>

            <Card variant="outlined">
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Proof of completion
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Drop a 3-second clip per block. Verified badge appears when every block has a clip.
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={completionRate}
                    sx={{ borderRadius: 1 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {completionRate}% complete · {Object.keys(proofMap).length} proof clips
                  </Typography>
                  {completionRate === 100 ? (
                    <Chip
                      icon={<CheckCircleIcon />}
                      color="success"
                      label="Verified for today"
                      sx={{ alignSelf: 'flex-start' }}
                    />
                  ) : (
                    <Chip
                      icon={<AccessTimeIcon />}
                      color="warning"
                      label="Awaiting clips"
                      sx={{ alignSelf: 'flex-start' }}
                    />
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        <Grid item xs={12} md={5}>
          <Stack spacing={3}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Form IQ & cues
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Chip
                      label={`Grade ${formGrade}`}
                      color={gradeColor[formGrade]}
                      variant="outlined"
                    />
                    {typeof lsiPercent === 'number' && <Chip label={`LSI ${lsiPercent}%`} />}
                    {planSoftened && <Chip color="warning" label="Plan softened" />}
                    {wearableVerificationLabel && (
                      <Chip
                        icon={<SensorsIcon />}
                        label={`${wearableVerificationLabel}${streamingFirmware ? ` · FW ${streamingFirmware}` : ''}`}
                        color="success"
                        variant="outlined"
                      />
                    )}
                  </Stack>
                  <Typography variant="body2">{formCue}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Cue is based on the most recent verified capture.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
            {plan?.insights && (
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TrendingUpIcon color="primary" />
                    <Typography variant="subtitle1" fontWeight={600}>
                      AI session insight
                    </Typography>
                  </Stack>
                  <Typography variant="body2">{plan.insights.summary}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Generated {new Date(plan.insights.timestamp).toLocaleString()}
                  </Typography>
                </Stack>
              </Paper>
            )}

            <Card variant="outlined">
              <CardContent>
                <Stack spacing={1.5}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Streaks & nudges
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                      {streakDays}
                    </Avatar>
                    <Typography variant="body2">
                      {streakDays}-day streak · Keep it alive with today’s session.
                    </Typography>
                  </Stack>
                  {rescueAvailable && (
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        borderColor: alpha('#f5a623', 0.4),
                        backgroundColor: alpha('#f5a623', 0.05),
                      }}
                    >
                      <Stack spacing={0.5}>
                        <Typography variant="subtitle2">
                          Only 5 minutes left? Trigger a 2-minute rescue.
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Complete one control drill + one landing stick to protect the streak.
                        </Typography>
                        <Button size="small" variant="contained" startIcon={<AccessTimeIcon />}>
                          Start 2-minute minimum
                        </Button>
                      </Stack>
                    </Paper>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    Teammate ladder (opt-in)
                  </Typography>
                  <List dense>
                    {teammateLadder.map((teammate) => (
                      <ListItem key={teammate.name}>
                        <ListItemIcon>
                          <Avatar sx={{ width: 28, height: 28 }}>{teammate.initials}</Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={teammate.name}
                          secondary={`${teammate.verified} verified sessions`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Stack>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Metrics-only verification
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Confidence ≥ 0.75 counts as verified even without storing clips. Toggle to skip clips when privacy
                    mode is on.
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip icon={<FitnessCenterIcon />} label="Metrics-only mode" variant="outlined" />
                    <Chip
                      label={`Confidence ${(metricsOnlyConfidence * 100).toFixed(0)}%`}
                      color={metricsConfidenceColor}
                      size="small"
                    />
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    Clips auto-expire after 60 days unless bookmarked by your coach.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <Card variant="outlined">
        <CardContent>
            <Stack spacing={3}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              alignItems={{ xs: 'flex-start', md: 'center' }}
              justifyContent="space-between"
              spacing={2}
            >
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Wearables Dev Mode (preview)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pair IMUs/insoles, simulate streams, and capture Trust Receipts without hardware.
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Tooltip title={trustMeta[wearableTrustGrade].tip} placement="top">
                  <Chip label={`Trust ${wearableTrustGrade}`} color={trustMeta[wearableTrustGrade].color} />
                </Tooltip>
                <Chip
                  label={wearableStreaming ? 'Streaming' : 'Idle'}
                  variant="outlined"
                  color={wearableStreaming ? 'success' : 'default'}
                />
                <Chip
                  icon={<SensorsIcon fontSize="small" />}
                  label={wearableStreaming ? `${connectedDevices} live` : `${pairedRoles.size} paired`}
                  variant="outlined"
                  color={connectedDevices > 0 ? 'success' : 'default'}
                />
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  onClick={() => void captureWearableInsight()}
                  disabled={wearableInsightLoading || !wearableDevices.some((device) => device.paired)}
                >
                  {wearableInsightLoading ? 'Generating…' : 'AI wearable insight'}
                </Button>
              </Stack>
            </Stack>

              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <SensorsIcon color="primary" />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Scan & pair IMUs
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Left thigh · Right shank · Chest pod · Smart insole
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Button size="small" variant="outlined" onClick={handleScanAndPair}>
                      Scan for devices
                    </Button>
                    <Chip size="small" label={`${pairedRoles.size}/${wearableRoles.length} paired`} />
                  </Stack>
                </Stack>
              </Paper>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                <Button variant="contained" onClick={toggleWearableSimulator} color={wearableSimulatorOn ? 'primary' : 'inherit'}>
                  {wearableSimulatorOn ? 'Simulator on' : 'Simulator off'}
                </Button>
              <Button
                variant={wearableStreaming ? 'outlined' : 'contained'}
                color={wearableStreaming ? 'error' : 'success'}
                onClick={toggleWearableStream}
                disabled={!wearableDevices.some((device) => device.paired) || !wearableSimulatorOn}
              >
                {wearableStreaming ? 'Stop stream' : 'Start stream'}
              </Button>
              <Button variant="outlined" onClick={handleStartCalibration} disabled={calibratingWearables}>
                {calibratingWearables ? 'Calibrating…' : 'Run calibration'}
              </Button>
              </Stack>

              <Grid container spacing={2}>
                {signalIndicators.map((indicator) => (
                  <Grid key={indicator.label} item xs={12} sm={6} md={3}>
                    <WearableSignalBar {...indicator} />
                  </Grid>
                ))}
              </Grid>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Calibration progress
                </Typography>
                <LinearProgress value={calibrationPct} variant="determinate" sx={{ borderRadius: 1, mt: 0.5 }} />
              </Box>

              <CalibrationSteps progress={calibrationPct} />

            <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 20 }}>
              <Grid item xs={12} sm={6} md={4}>
                <WearableMetricTile
                  label="Valgus"
                  value={latestWearablePacket ? latestWearablePacket.valgus.toFixed(2) : '—'}
                  subText="0–1 · lower is better"
                  intent={
                    latestWearablePacket
                      ? latestWearablePacket.valgus < 0.45
                        ? 'good'
                        : latestWearablePacket.valgus > 0.7
                        ? 'bad'
                        : 'warn'
                      : 'default'
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <WearableMetricTile
                  label="Impact (g)"
                  value={latestWearablePacket ? latestWearablePacket.impact.toFixed(1) : '—'}
                  subText="Landing peak"
                  intent={
                    latestWearablePacket
                      ? latestWearablePacket.impact < 8
                        ? 'good'
                        : latestWearablePacket.impact > 10
                        ? 'bad'
                        : 'warn'
                      : 'default'
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <WearableMetricTile
                  label="Decel (g)"
                  value={latestWearablePacket ? latestWearablePacket.decel.toFixed(1) : '—'}
                  subText="Braking load"
                  intent={
                    latestWearablePacket
                      ? latestWearablePacket.decel < 3.2
                        ? 'good'
                        : latestWearablePacket.decel > 4.5
                        ? 'bad'
                        : 'warn'
                      : 'default'
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <WearableMetricTile
                  label="Asymmetry"
                  value={latestWearablePacket ? `${Math.round(latestWearablePacket.asymmetry * 100)}%` : '—'}
                  subText="Lower is better"
                  intent={
                    latestWearablePacket
                      ? latestWearablePacket.asymmetry < 0.2
                        ? 'good'
                        : latestWearablePacket.asymmetry > 0.35
                        ? 'bad'
                        : 'warn'
                      : 'default'
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <WearableMetricTile
                  label="Cut density"
                  value={latestWearablePacket ? `${latestWearablePacket.cutDensity.toFixed(0)}/min` : '—'}
                  subText="Exposure"
                  intent={
                    latestWearablePacket
                      ? latestWearablePacket.cutDensity < 18
                        ? 'good'
                        : latestWearablePacket.cutDensity > 26
                        ? 'bad'
                        : 'warn'
                      : 'default'
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <WearableMetricTile
                  label="PlayerLoad™"
                  value={Math.round(playerLoadEstimate).toString()}
                  subText="Integrated workload"
                  intent={playerLoadEstimate < 300 ? 'good' : playerLoadEstimate > 480 ? 'bad' : 'warn'}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, height: '100%' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Impact & decel (last 2 min)
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {wearablePackets.length} samples
                    </Typography>
                  </Stack>
                  <Box sx={{ height: 280 }}>
                    {wearablePackets.length === 0 ? (
                      <Stack height="100%" alignItems="center" justifyContent="center" spacing={1}>
                        <Typography variant="body2" color="text.secondary">
                          Start the stream to view live metrics.
                        </Typography>
                      </Stack>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={wearablePackets.map((packet) => ({
                            time: new Date(packet.ts).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }),
                            impact: packet.impact,
                            decel: packet.decel,
                          }))}
                          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                          <YAxis domain={[0, 14]} tick={{ fontSize: 12 }} />
                          <RechartsTooltip contentStyle={{ borderRadius: 12 }} />
                          <Line type="monotone" dataKey="impact" stroke="#6366f1" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="decel" stroke="#22c55e" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={5}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, height: '100%' }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Placement preview
                  </Typography>
                  <Box sx={{ height: 260 }}>
                    <WearableVisualizer
                      pairedRoles={pairedRoles}
                      streamingRoles={streamingRoles}
                      selectedRole={selectedDeviceRole}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Pulsing nodes = streaming devices. Use “Locate” to highlight placement.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {wearableInsightError && (
              <Alert severity="warning">{wearableInsightError}</Alert>
            )}

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between" spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Typography variant="subtitle2" fontWeight={600}>
                    AI wearable insight
                  </Typography>
                  {wearableInsight?.statusChip && <Chip variant="outlined" color="success" label={wearableInsight.statusChip} />}
                  {wearableInsight && (
                    <Chip
                      size="small"
                      label={`Confidence ${(wearableInsight.confidence * 100).toFixed(0)}%`}
                      variant="outlined"
                    />
                  )}
                  {wearableInsight?.generatedAt && (
                    <Typography variant="caption" color="text.secondary">
                      {new Date(wearableInsight.generatedAt).toLocaleTimeString()}
                    </Typography>
                  )}
                  {!wearableAiRemoteAvailable && (
                    <Chip
                      size="small"
                      icon={<CloudOffIcon fontSize="small" />}
                      label="Cloud coach offline (demo mode)"
                      color="warning"
                      variant="outlined"
                    />
                  )}
                </Stack>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => void captureWearableInsight()}
                  disabled={wearableInsightLoading || !wearableDevices.some((device) => device.paired)}
                >
                  {wearableInsightLoading ? 'Refreshing…' : 'Refresh insight'}
                </Button>
              </Stack>
              {wearableInsightLoading && <LinearProgress sx={{ mt: 1.5 }} />}
              <Stack spacing={1.5} sx={{ mt: 1.5 }}>
                <Typography variant="body2" color="text.secondary">
                  {wearableInsight?.summary ?? 'Pair a device and run the insight to get AI guidance on today’s wearable stream.'}
                </Typography>
                {wearableInsight?.cues?.length ? (
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {wearableInsight.cues.map((cue) => (
                      <Chip key={cue} icon={<CheckCircleIcon fontSize="small" />} label={cue} variant="outlined" />
                    ))}
                  </Stack>
                ) : null}
                {wearableInsight?.watchouts?.length ? (
                  <Alert severity="info">{wearableInsight.watchouts.join(' ')}</Alert>
                ) : null}
              </Stack>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} justifyContent="space-between">
                <Box>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Device fleet
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {pairedRoles.size}/{wearableDevices.length} paired · batteries auto-drain in sim mode.
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button size="small" variant="outlined">
                    Export JSON
                  </Button>
                  <Button size="small" variant="outlined">
                    Generate PDF
                  </Button>
                </Stack>
              </Stack>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                {wearableDevices.map((device) => (
                  <Grid item xs={12} sm={6} lg={3} key={device.id}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                      <Stack spacing={1}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {device.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            FW {device.firmware} · Battery {device.battery}% · RSSI {device.rssi} dBm
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={1}>
                          <Chip
                            size="small"
                            label={device.streaming ? 'Streaming' : device.paired ? 'Paired' : 'Unpaired'}
                            color={device.streaming ? 'success' : device.paired ? 'info' : 'default'}
                          />
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Button size="small" variant="outlined" onClick={() => toggleDevicePairing(device.role)}>
                            {device.paired ? 'Unpair' : 'Pair'}
                          </Button>
                          <Button
                            size="small"
                            variant={selectedDeviceRole === device.role ? 'contained' : 'outlined'}
                            onClick={() => handleLocateDevice(device.role)}
                            disabled={!device.paired}
                          >
                            Locate
                          </Button>
                        </Stack>
                      </Stack>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <Stack spacing={1}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Device sandbox
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Adjust baselines when hardware is offline. Sliders drive the live tiles above.
                </Typography>
              </Stack>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {SANDBOX_SLIDERS.map((slider) => (
                  <Grid item xs={12} sm={6} lg={4} key={slider.key}>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        {slider.label}
                      </Typography>
                      <Slider
                        size="small"
                        value={sandboxMetrics[slider.key] as number}
                        step={slider.step}
                        min={slider.min}
                        max={slider.max}
                        onChange={handleSandboxSlider(slider.key)}
                      />
                      <Typography variant="caption">{slider.format(sandboxMetrics[slider.key] as number)}</Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Stack>
        </CardContent>
      </Card>

  <input
    ref={fileInputRef}
    type="file"
    accept="video/*,image/*"
    hidden
    onChange={handleFileChange}
  />
</Stack>
);
};

const WearableMetricTile = ({
  label,
  value,
  subText,
  intent = 'default',
}: {
  label: string;
  value: string;
  subText: string;
  intent?: 'default' | 'good' | 'warn' | 'bad';
}) => {
  const palette: Record<string, { bg: string; color: string }> = {
    default: { bg: 'transparent', color: 'text.primary' },
    good: { bg: 'rgba(16,185,129,0.12)', color: '#065f46' },
    warn: { bg: 'rgba(251,191,36,0.2)', color: '#92400e' },
    bad: { bg: 'rgba(248,113,113,0.2)', color: '#991b1b' },
  };
  const tones = palette[intent];
  return (
    <Paper
      variant="outlined"
      sx={{ p: 2, borderRadius: 3, height: '100%', backgroundColor: tones.bg, transition: 'background 0.2s ease' }}
    >
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h5" fontWeight={600} sx={{ color: tones.color }}>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {subText}
      </Typography>
    </Paper>
  );
};

const WearableVisualizer = ({
  pairedRoles,
  streamingRoles,
  selectedRole,
}: {
  pairedRoles: Set<DeviceRole>;
  streamingRoles: Set<DeviceRole>;
  selectedRole: DeviceRole | null;
}) => {
  const dot = (x: number, y: number, role: DeviceRole, label: string) => {
    const paired = pairedRoles.has(role);
    const streaming = streamingRoles.has(role);
    const selected = selectedRole === role;
    const fill = paired ? '#10b981' : '#94a3b8';

    return (
      <g key={role}>
        <circle cx={x} cy={y} r={streaming ? 9 : 7} fill={fill} opacity={streaming ? 0.4 : 0.25} />
        <circle
          cx={x}
          cy={y}
          r={5}
          fill={selected ? '#10b981' : '#0f172a'}
          stroke={paired ? '#10b981' : '#cbd5f5'}
          strokeWidth={selected ? 2 : 1}
        />
        <text x={x + 10} y={y + 4} fontSize={10} fill="#475569">
          {label}
        </text>
      </g>
    );
  };

  return (
    <svg viewBox="0 0 220 280" width="100%" height="100%">
      <g stroke="#94a3b8" strokeWidth={2} fill="none">
        <circle cx="110" cy="40" r="18" />
        <rect x="95" y="58" width="30" height="60" rx="10" />
        <path d="M100 118 L90 170" />
        <path d="M120 118 L130 170" />
        <path d="M90 170 L85 230" />
        <path d="M130 170 L135 230" />
        <path d="M85 230 L80 238" />
        <path d="M135 230 L140 238" />
      </g>
      {dot(110, 80, 'gps_ch', 'Chest pod')}
      {dot(95, 150, 'imu_lt', 'Left thigh')}
      {dot(125, 150, 'imu_rs', 'Right shank')}
      {dot(140, 238, 'ins_pu', 'Insole')}
    </svg>
  );
};

const WearableSignalBar = ({
  label,
  value,
  percent,
  icon,
}: {
  label: string;
  value: string;
  percent: number;
  icon: ReactNode;
}) => (
  <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 3, height: '100%' }}>
    <Stack spacing={0.5}>
      <Stack direction="row" spacing={1} alignItems="center">
        {icon}
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      </Stack>
      <Typography variant="subtitle2" fontWeight={600}>
        {value}
      </Typography>
      <LinearProgress variant="determinate" value={percent} sx={{ height: 6, borderRadius: 999, mt: 0.5 }} />
    </Stack>
  </Paper>
);

const CalibrationSteps = ({ progress }: { progress: number }) => {
  const steps = [
    { label: 'T-pose', threshold: 20 },
    { label: '3 squats', threshold: 60 },
    { label: '2 cuts', threshold: 100 },
  ];
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
      {steps.map((step) => {
        const completed = progress >= step.threshold;
        return (
          <Stack key={step.label} direction="row" spacing={1} alignItems="center">
            <CheckCircleIcon color={completed ? 'success' : 'disabled'} fontSize="small" />
            <Typography variant="caption" color={completed ? 'success.main' : 'text.secondary'}>
              {step.label}
            </Typography>
          </Stack>
        );
      })}
    </Stack>
  );
};

export default HomeSessionPage;
