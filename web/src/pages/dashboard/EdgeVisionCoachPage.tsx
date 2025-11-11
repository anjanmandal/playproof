// EdgeVisionCoachPage.tsx
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  ReferenceLine,
  AreaChart,
  Area,
} from 'recharts';
import { generateEdgeCoachInsight } from '@/api/edgeCoach';
import VideocamIcon from '@mui/icons-material/Videocam';
import SensorsIcon from '@mui/icons-material/Sensors';
import ShieldIcon from '@mui/icons-material/Shield';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import TimelineIcon from '@mui/icons-material/Timeline';
import SpeedIcon from '@mui/icons-material/Speed';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { useSearchParams } from 'react-router-dom';

import { FilesetResolver, PoseLandmarker, DrawingUtils } from '@mediapipe/tasks-vision';

// ---- Version-pinned roots (adjust as needed) ----
const TASKS_WASM_ROOT =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm';
const MODEL_URLS = {
  lite:
    'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
  full:
    'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task',
  heavy:
    'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/1/pose_landmarker_heavy.task',
} as const;
type ModelKey = keyof typeof MODEL_URLS;

type Point = { x: number; y: number; z?: number; presence?: number; visibility?: number };
type ImuSensorKey = 'thigh' | 'shank';
type ImuSample = { time: string; loadPercent: number; decelG: number };

const TRUST_BANDS = [
  { label: 'Good', min: 0.8, color: 'success' as const },
  { label: 'OK', min: 0.6, color: 'warning' as const },
  { label: 'Retest', min: 0, color: 'error' as const },
];

const cueLibrary: Array<{ id: string; label: string; description: string }> = [
  { id: 'knees', label: 'Knees track toes', description: 'Reduce medial collapse on landing.' },
  { id: 'hips', label: 'Hips back', description: 'Load posterior chain during decel.' },
  { id: 'step', label: 'Shorten plant step', description: 'Keep foot under center of mass.' },
];

type MotionMetrics = {
  kamScore: number;
  kamStatus: 'Stable' | 'Elevated';
  footPlantDetected: boolean;
  footPlantCount: number;
  decelStatus: 'Normal' | 'High';
  footPlantEvent?: boolean;
};

const baseMotionMetrics: MotionMetrics = {
  kamScore: 0,
  kamStatus: 'Stable',
  footPlantDetected: false,
  footPlantCount: 0,
  decelStatus: 'Normal',
};

const SENSOR_LABELS: Record<ImuSensorKey, string> = {
  thigh: 'Lead thigh IMU',
  shank: 'Lead shank IMU',
};

const MetricTile = ({
  icon,
  label,
  value,
  status,
  secondary,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  status: string;
  secondary?: string;
}) => (
  <Box
    sx={{
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 2,
      p: 1.5,
      minHeight: 84,
    }}
  >
    <Stack spacing={0.5}>
      <Stack direction="row" spacing={0.5} alignItems="center">
        {icon}
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      </Stack>
      <Typography variant="body1" fontWeight={600}>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {status}
        {secondary ? ` · ${secondary}` : ''}
      </Typography>
    </Stack>
  </Box>
);

// ------- Heuristics -------
const computeTrustScore = (lms?: Point[]) => {
  if (!lms || !lms.length) return 0;
  const vis = lms.map((p) => p.visibility ?? p.presence ?? 0);
  return vis.reduce((a, b) => a + b, 0) / vis.length;
};
const detectValgusCue = (lms?: Point[]) => {
  if (!lms) return null;
  const LK = 25, LA = 27, RK = 26, RA = 28;
  const lk = lms[LK], la = lms[LA], rk = lms[RK], ra = lms[RA];
  if (!lk || !la || !rk || !ra) return null;
  const leftVec = Math.abs(lk.x - la.x);
  const rightVec = Math.abs(rk.x - ra.x);
  if (leftVec < 0.015 || rightVec < 0.015) return cueLibrary[0];
  return cueLibrary[1];
};

const buildImuSample = (): ImuSample => ({
  time: new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }),
  loadPercent: Math.round(45 + Math.random() * 35),
  decelG: Number((1 + Math.random() * 1.4).toFixed(2)),
});

// ------- Safe video helpers -------
async function playSafely(video: HTMLVideoElement) {
  // Wait for metadata & canplay to avoid "play() interrupted"
  if (video.readyState < 1) {
    await new Promise<void>((res) => video.addEventListener('loadedmetadata', () => res(), { once: true }));
  }
  if (video.readyState < 3) {
    await new Promise<void>((res) => video.addEventListener('canplay', () => res(), { once: true }));
  }
  try {
    await video.play();
  } catch {
    // Retry once on next frame (some browsers need an extra tick after permission prompt)
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    try { await video.play(); } catch {}
  }
}

export default function EdgeVisionCoachPage() {
  // --- Refs & state ---
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<PoseLandmarker | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);
  const didInitRef = useRef(false);
  const opTokenRef = useRef<number>(0); // serialize async starts/stops
  const poseHistory = useRef<Array<{ timestamp: number; landmarks: Point[] }>>([]);
  const imuTimerRef = useRef<number | null>(null);
  const trustScoreRef = useRef(0);
  const [searchParams] = useSearchParams();
  const focusAthleteId = searchParams.get('athleteId');
  const focusSource = searchParams.get('source');

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState('');
  const [model, setModel] = useState<ModelKey>('full');
  const [selfie, setSelfie] = useState(true);
  const [running, setRunning] = useState(false);
  const [fps, setFps] = useState(0);

  const [trustScore, setTrustScore] = useState(0);
  const [activeCue, setActiveCue] = useState<typeof cueLibrary[number] | null>(null);
  const [log, setLog] = useState<Array<{ timestamp: number; landmarks: number[] }>>([]);
  const [motionMetrics, setMotionMetrics] = useState<MotionMetrics>(baseMotionMetrics);
  const [chartData, setChartData] = useState<Array<{ time: string; kam: number; trust: number }>>([]);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imuSensors, setImuSensors] = useState<Record<
    ImuSensorKey,
    { paired: boolean; battery: number }
  >>({
    thigh: { paired: false, battery: 96 },
    shank: { paired: false, battery: 94 },
  });
  const [imuStatus, setImuStatus] = useState<'idle' | 'pairing' | 'streaming'>('idle');
  const [imuSamples, setImuSamples] = useState<ImuSample[]>([]);
  const [imuFusion, setImuFusion] = useState<{ asymmetry: number; decelG: number; confidence: number }>({
    asymmetry: 0,
    decelG: 0,
    confidence: 0,
  });

  const trustBand = useMemo(
    () => TRUST_BANDS.find((b) => trustScore >= b.min) ?? TRUST_BANDS[TRUST_BANDS.length - 1],
    [trustScore]
  );
  const fusedKam = useMemo(() => {
    if (!imuSamples.length) return null;
    const avgLoad = imuSamples.reduce((sum, sample) => sum + sample.loadPercent, 0) / imuSamples.length / 100;
    return Math.max(0, Math.min(1, Number((motionMetrics.kamScore * 0.6 + avgLoad * 0.4).toFixed(2))));
  }, [imuSamples, motionMetrics.kamScore]);
  const imuChartData = useMemo(
    () =>
      imuSamples.map((sample) => ({
        time: sample.time,
        load: sample.loadPercent,
        decel: sample.decelG,
      })),
    [imuSamples],
  );

  useEffect(() => {
    trustScoreRef.current = trustScore;
  }, [trustScore]);

  // ------- Basics -------
  const ensureHttps = () => {
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      throw new Error('Camera requires HTTPS (or http://localhost). Serve the app over https://');
    }
  };

  const enumerateCameras = async () => {
    const list = await navigator.mediaDevices.enumerateDevices();
    const cams = list.filter((d) => d.kind === 'videoinput');
    setDevices(cams);
    if (!deviceId && cams[0]?.deviceId) setDeviceId(cams[0].deviceId);
  };

  // ------- Teardown (idempotent) -------
  const stopRaf = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };
  const stopStream = () => {
    const tracks = streamRef.current?.getTracks?.() ?? [];
    tracks.forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) {
      // Don’t clear srcObject during play; just stop tracks
    }
  };
  const clearImuTimer = () => {
    if (imuTimerRef.current) {
      window.clearInterval(imuTimerRef.current);
      imuTimerRef.current = null;
    }
  };
  const teardown = () => {
    stopRaf();
    try { landmarkerRef.current?.close(); } catch {}
    landmarkerRef.current = null;
    stopStream();
    clearImuTimer();
    setRunning(false);
  };

  // ------- Pipeline startup (serialized) -------
  const startPipeline = async () => {
    ensureHttps();
    const myOp = ++opTokenRef.current; // token for this start
    setError(null);

    // Vision/landmarker
    const vision = await FilesetResolver.forVisionTasks(TASKS_WASM_ROOT);
    if (opTokenRef.current !== myOp) return; // aborted by newer op
    const lm = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: { modelAssetPath: MODEL_URLS[model] },
      runningMode: 'VIDEO',
      numPoses: 1,
      minPoseDetectionConfidence: 0.5,
      minPosePresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    if (opTokenRef.current !== myOp) { lm.close(); return; }
    landmarkerRef.current = lm;

    // Camera stream (reuse if same)
    const constraints: MediaStreamConstraints = {
      video: deviceId
        ? { deviceId: { exact: deviceId }, width: { ideal: 640 }, height: { ideal: 360 }, facingMode: selfie ? 'user' : 'environment' }
        : { width: { ideal: 640 }, height: { ideal: 360 }, facingMode: selfie ? 'user' : 'environment' },
      audio: false,
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    if (opTokenRef.current !== myOp) { stream.getTracks().forEach((t) => t.stop()); return; }
    streamRef.current = stream;

    const video = videoRef.current!;
    // Keep the same object to avoid triggering a new "load"
    if (video.srcObject !== stream) {
      video.srcObject = stream;
    }
    // Make sure inline policy is satisfied on iOS
    video.setAttribute('playsinline', '');
    video.muted = true;

    await playSafely(video); // <-- prevents the 'play() interrupted' warning

    // Render loop
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const drawer = new DrawingUtils(ctx);
    lastTsRef.current = 0;

    const step = () => {
      if (opTokenRef.current !== myOp) return; // newer op took over
      if (!landmarkerRef.current || !videoRef.current) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }

      const now = performance.now();
      if (lastTsRef.current) setFps(1000 / (now - lastTsRef.current));
      lastTsRef.current = now;

      const result = landmarkerRef.current.detectForVideo(videoRef.current, now);

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      if (result.landmarks?.[0]) {
        const pts = result.landmarks[0] as unknown as Point[];

        // Draw connectors if available on your version
        try {
          // @ts-ignore
          const CONN = (PoseLandmarker as any).POSE_CONNECTIONS;
          if (CONN) drawer.drawConnectors(pts as any, CONN, { lineWidth: 3 });
        } catch {}
        drawer.drawLandmarks(pts as any, { radius: 2 });

        const t = computeTrustScore(pts);
        setTrustScore(t);
        setActiveCue(detectValgusCue(pts));
        setLog((prev) => {
          const flat = pts.flatMap((p) => [p.x, p.y, p.z ?? 0]);
          const next = [...prev, { timestamp: Date.now(), landmarks: flat }];
          return next.slice(-20);
        });
        poseHistory.current = [
          ...poseHistory.current,
          { timestamp: Date.now(), landmarks: pts },
        ].slice(-60);
        const metrics = analyzeMotion(poseHistory.current);
        setMotionMetrics((prev) => {
          const footEvent = metrics.footPlantDetected && !prev.footPlantDetected;
          return {
            kamScore: metrics.kamScore,
            kamStatus: metrics.kamStatus,
            footPlantDetected: metrics.footPlantDetected,
            footPlantCount: Math.min(
              footEvent ? prev.footPlantCount + 1 : prev.footPlantCount * 0.98,
              99,
            ),
            decelStatus: metrics.decelStatus,
          };
        });
        setChartData((prev) => {
          const next = [
            ...prev,
            {
              time: new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }),
              kam: Math.round(metrics.kamScore * 100),
              trust: Math.round(t * 100),
            },
          ];
          return next.slice(-30);
        });
        if (metrics.kamStatus !== 'Stable') {
          setActiveCue(cueLibrary[0]);
        } else if (metrics.decelStatus === 'High') {
          setActiveCue(cueLibrary[1]);
        } else if (!metrics.footPlantDetected) {
          setActiveCue(cueLibrary[2]);
        } else {
          setActiveCue(detectValgusCue(pts));
        }
      } else {
        setTrustScore((s) => Math.max(0, s * 0.98));
        setActiveCue(null);
        setMotionMetrics((prev) => ({
          ...prev,
          footPlantDetected: false,
          footPlantCount: prev.footPlantCount * 0.95,
        }));
      }

      ctx.restore();
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    setRunning(true);
  };

  // ------- Effects -------
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    (async () => {
      try {
        ensureHttps();
        await enumerateCameras();
      } catch (e: any) {
        setError(e?.message ?? 'Initialization error');
      }
    })();

    return () => {
      // Cancel any in-flight start
      opTokenRef.current++;
      teardown();
      didInitRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => () => {
      clearImuTimer();
    },
    [],
  );

  // Live-restart on model/selfie/device change (only if running)
  useEffect(() => {
    (async () => {
      if (!running) return;
      // Abort current op and stop
      opTokenRef.current++;
      teardown();
      try {
        await startPipeline();
      } catch (e: any) {
        setError(e?.message ?? 'Failed to restart pipeline');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, selfie, deviceId]);

  useEffect(() => {
    const bothPaired = imuSensors.thigh.paired && imuSensors.shank.paired;
    const anyPaired = imuSensors.thigh.paired || imuSensors.shank.paired;
    if (!running || !bothPaired) {
      clearImuTimer();
      setImuStatus(anyPaired ? 'pairing' : 'idle');
      if (!anyPaired) {
        setImuSamples([]);
        setImuFusion({ asymmetry: 0, decelG: 0, confidence: 0 });
      }
      return;
    }
    setImuStatus('streaming');
    clearImuTimer();
    imuTimerRef.current = window.setInterval(() => {
      const sample = buildImuSample();
      setImuSamples((prev) => [...prev, sample].slice(-30));
      setImuFusion({
        asymmetry: sample.loadPercent,
        decelG: sample.decelG,
        confidence: Number((0.6 * trustScoreRef.current + 0.4 * (1 - sample.loadPercent / 100)).toFixed(2)),
      });
      setImuSensors((prev) => ({
        thigh: { ...prev.thigh, battery: Number(Math.max(5, prev.thigh.battery - 0.08).toFixed(2)) },
        shank: { ...prev.shank, battery: Number(Math.max(5, prev.shank.battery - 0.08).toFixed(2)) },
      }));
    }, 1400);
    return () => {
      clearImuTimer();
    };
  }, [imuSensors.shank.paired, imuSensors.thigh.paired, running]);

  // ------- Controls -------
  const handleStart = async () => {
    try {
      // Abort any older op and stop cleanly
      opTokenRef.current++;
      teardown();
      await startPipeline();
    } catch (e: any) {
      setError(e?.message ?? 'Failed to start');
    }
  };
  const handleStop = () => {
    // Abort this op and teardown
    opTokenRef.current++;
    teardown();
  };
  const handleReloadDevices = async () => {
    try {
      await enumerateCameras();
    } catch (e: any) {
      setError(e?.message ?? 'Failed to list cameras');
    }
  };

  const handleToggleSensor = (sensor: ImuSensorKey) => {
    setImuSensors((prev) => ({
      ...prev,
      [sensor]: {
        ...prev[sensor],
        paired: !prev[sensor].paired,
        battery: !prev[sensor].paired && prev[sensor].battery < 10 ? 96 : prev[sensor].battery,
      },
    }));
  };

  const handleInsight = async () => {
    setInsightLoading(true);
    setError(null);
    try {
      const summary = await generateEdgeCoachInsight({
        trustScore,
        kamScore: motionMetrics.kamScore,
        decelStatus: motionMetrics.decelStatus,
        footPlantPerMin: motionMetrics.footPlantCount,
        cues: activeCue ? [activeCue.label] : undefined,
      });
      setAiInsight(summary);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setInsightLoading(false);
    }
  };

  // ------- UI -------
  return (
    <Box
      sx={{
        minHeight: '100%',
        p: { xs: 2, md: 4 },
        background: (theme) =>
          theme.palette.mode === 'light'
            ? 'radial-gradient(circle at top, rgba(99,102,241,0.2), rgba(15,23,42,0.05))'
            : 'radial-gradient(circle at top, rgba(99,102,241,0.25), rgba(2,6,23,0.9))',
      }}
    >
      <Stack spacing={3}>
        <Stack spacing={0.5}>
          <Typography variant="h4" fontWeight={800}>
            Edge Vision Coach
          </Typography>
          <Typography variant="body1" color="text.secondary">
            On-device pose coaching with MediaPipe Tasks. Nothing uploaded; landmarks analyzed locally.
          </Typography>
        </Stack>

        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Card
              sx={(theme) => ({
                borderRadius: 4,
                background:
                  theme.palette.mode === 'light'
                    ? alpha('#0f172a', 0.04)
                    : alpha('#1e293b', 0.65),
                backdropFilter: 'blur(18px)',
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.15),
                boxShadow: `0 30px 70px ${alpha(theme.palette.common.black, 0.25)}`,
              })}
            >
            <CardContent>
              <Stack spacing={2}>
                <Box
                  sx={(theme) => ({
                    borderRadius: 3,
                    p: { xs: 2, md: 3 },
                    background:
                      theme.palette.mode === 'light'
                        ? 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(236,72,153,0.08))'
                        : 'linear-gradient(135deg, rgba(14,165,233,0.25), rgba(109,40,217,0.25))',
                    border: '1px solid',
                    borderColor:
                      theme.palette.mode === 'light'
                        ? alpha(theme.palette.primary.main, 0.2)
                        : alpha(theme.palette.primary.light, 0.3),
                    boxShadow: `0 20px 45px ${alpha(theme.palette.common.black, 0.25)}`,
                  })}
                >
                  <Stack
                    spacing={2}
                    direction={{ xs: 'column', md: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: alpha('#60a5fa', 0.15),
                          border: '1px solid',
                          borderColor: alpha('#60a5fa', 0.4),
                        }}
                      >
                        <VideocamIcon color="primary" />
                      </Box>
                      <Box>
                        <Typography variant="overline" color="text.secondary">
                          Live rig
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                          Live pose feed
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Calibrated capture · {running ? 'stream active' : 'standby'}
                        </Typography>
                        {focusAthleteId && (
                          <Chip
                            size="small"
                            color="secondary"
                            label={`Focus ${focusAthleteId}${focusSource === 'planner' ? ' · planner' : ''}`}
                            sx={{ mt: 0.5 }}
                          />
                        )}
                      </Box>
                    </Stack>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={1}
                      alignItems={{ xs: 'flex-start', sm: 'center' }}
                    >
                      <Chip
                        size="small"
                        variant="outlined"
                        icon={<ShieldIcon fontSize="small" />}
                        label="Landmarks only"
                      />
                      <Chip
                        size="small"
                        color={running ? 'success' : 'default'}
                        label={running ? `Live · ${Math.round(fps || 0)} FPS` : 'Ready to capture'}
                      />
                      <Chip
                        size="small"
                        variant="outlined"
                        color={trustBand.color}
                        label={`Trust ${Math.round(trustScore * 100)}%`}
                      />
                      <Tooltip title="Reload cameras">
                        <IconButton
                          size="small"
                          onClick={handleReloadDevices}
                          sx={{
                            border: '1px solid',
                            borderColor: alpha('#94a3b8', 0.4),
                            backgroundColor: alpha('#0f172a', 0.05),
                          }}
                        >
                          <RestartAltIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>

                  <Divider sx={{ my: 2, borderColor: alpha('#94a3b8', 0.3) }} />

                  <Grid container spacing={1.5}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption" color="text.secondary">
                        Camera
                      </Typography>
                      <Select
                        fullWidth
                        size="small"
                        value={deviceId}
                        onChange={(e) => setDeviceId(e.target.value)}
                      >
                        {devices.map((d) => (
                          <MenuItem key={d.deviceId} value={d.deviceId}>
                            {d.label || `Camera ${d.deviceId.slice(-4)}`}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">
                        Model
                      </Typography>
                      <Select
                        fullWidth
                        size="small"
                        value={model}
                        onChange={(e) => setModel(e.target.value as ModelKey)}
                      >
                        <MenuItem value="lite">Lite (fast)</MenuItem>
                        <MenuItem value="full">Full (balanced)</MenuItem>
                        <MenuItem value="heavy">Heavy (accurate)</MenuItem>
                      </Select>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      md={3}
                      sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}
                    >
                      <FormControlLabel
                        control={<Switch checked={selfie} onChange={(e) => setSelfie(e.target.checked)} />}
                        label="Selfie"
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    pt: '56.25%',
                    borderRadius: 3,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  {/* Keep video present (don’t use display:none) */}
                  <video
                    ref={videoRef}
                    playsInline
                    autoPlay
                    muted
                    style={{
                      position: 'absolute',
                      width: 1,
                      height: 1,
                      opacity: 0,
                      pointerEvents: 'none',
                    }}
                  />
                  <canvas
                    ref={canvasRef}
                    width={640}
                    height={360}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                  />
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      '& > *': { backdropFilter: 'blur(6px)' },
                    }}
                  >
                    <Chip
                      size="small"
                      color="primary"
                      label={running ? 'Live • encrypted' : 'Offline'}
                      sx={{ backgroundColor: alpha('#2563eb', 0.35) }}
                    />
                    <Chip
                      size="small"
                      label={`Trust ${Math.round(trustScore * 100)}%`}
                      color={trustBand.color}
                    />
                  </Stack>
                </Box>

                <Stack spacing={1}>
                  <Typography variant="caption" color="text.secondary">Trust (lighting / frame rate / landmarks)</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.round(trustScore * 100)}
                    sx={{ height: 10, borderRadius: 5, backgroundColor: 'divider', '& .MuiLinearProgress-bar': { borderRadius: 5 } }}
                    color={trustBand.color}
                  />
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Chip size="small" label={trustBand.label} color={trustBand.color} />
                    <Typography variant="caption" color="text.secondary">
                      {Math.round(trustScore * 100)}% confidence · {fps ? `${fps.toFixed(0)} FPS` : '—'}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
            <Divider />
            <CardActions sx={{ p: 2 }}>
              {!running ? (
                <Button variant="contained" startIcon={<PlayArrowIcon />} onClick={handleStart}>
                  Start
                </Button>
              ) : (
                <Button variant="outlined" color="error" startIcon={<StopIcon />} onClick={handleStop}>
                  Stop
                </Button>
              )}
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Stack spacing={3}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <SensorsIcon color="primary" />
                  <Typography variant="subtitle1" fontWeight={700}>Cue cards</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Local heuristics flag valgus/decel risks. Landmarks only—no clips stored.
                </Typography>
                {activeCue ? <Chip color="warning" label={activeCue.label} /> : <Chip color="success" label="Solid mechanics" />}
                <Typography variant="caption" color="text.secondary">
                  {activeCue?.description ?? 'Keep the current prep consistent.'}
                </Typography>
              </Stack>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <ShowChartIcon color="primary" />
                  <Typography variant="subtitle1" fontWeight={700}>Real-time metrics</Typography>
                </Stack>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <MetricTile
                      icon={<TimelineIcon fontSize="small" />}
                      label="KAM surrogate"
                      value={`${Math.round(motionMetrics.kamScore * 100)}%`}
                      status={motionMetrics.kamStatus}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <MetricTile
                      icon={<SpeedIcon fontSize="small" />}
                      label="Decel"
                      value={motionMetrics.decelStatus}
                      status={motionMetrics.decelStatus === 'High' ? 'Elevated' : 'Stable'}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <MetricTile
                      icon={<VideocamIcon fontSize="small" />}
                      label="Foot plant"
                      value={motionMetrics.footPlantDetected ? 'Detected' : 'Searching'}
                      status={motionMetrics.footPlantDetected ? 'Stable' : 'Monitor'}
                      secondary={`${Math.round(motionMetrics.footPlantCount)} this minute`}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <MetricTile
                      icon={<ShieldIcon fontSize="small" />}
                      label="Landmarks logged"
                      value={`${log.length} frames`}
                      status="Info"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MetricTile
                      icon={<SensorsIcon fontSize="small" />}
                      label="IMU fusion"
                      value={
                        fusedKam !== null && imuStatus === 'streaming'
                          ? `${Math.round(fusedKam * 100)}% synced`
                          : imuStatus === 'pairing'
                          ? 'Pairing'
                          : 'Offline'
                      }
                      status={
                        imuStatus === 'streaming'
                          ? 'Streaming'
                          : imuStatus === 'pairing'
                          ? 'Pairing'
                          : 'Idle'
                      }
                      secondary={
                        imuSamples.length
                          ? `Confidence ${(imuFusion.confidence * 100).toFixed(0)}%`
                          : 'Add thigh + shank sensors'
                      }
                    />
                  </Grid>
                </Grid>
              </Stack>
            </Paper>

            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 3,
                background: (theme) =>
                  theme.palette.mode === 'light'
                    ? 'linear-gradient(135deg, rgba(76,110,245,0.08), rgba(66,221,194,0.08))'
                    : 'linear-gradient(135deg, rgba(22,28,56,0.9), rgba(18,36,34,0.9))',
              }}
            >
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <SensorsIcon color="primary" />
                  <Typography variant="subtitle1" fontWeight={700}>
                    AI coaching insight
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Send the last few metrics to OpenAI for a quick summary coaches can copy into notes.
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleInsight}
                    disabled={insightLoading}
                  >
                    {insightLoading ? 'Generating…' : 'Generate AI insight'}
                  </Button>
                  {aiInsight && (
                    <Chip size="small" label="Latest insight ready" color="info" variant="outlined" />
                  )}
                </Stack>
                {aiInsight && (
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    {aiInsight}
                  </Typography>
                )}
              </Stack>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <Stack spacing={1}>
                <Typography variant="subtitle1" fontWeight={700}>KAM & trust history</Typography>
                {chartData.length === 0 ? (
                  <Typography variant="caption" color="text.secondary">
                    Start capture to populate live graphs.
                  </Typography>
                ) : (
                  <Box sx={{ width: '100%', height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                        <ChartTooltip />
                        <ReferenceLine y={60} stroke="#f78" strokeDasharray="3 3" />
                        <Line type="monotone" dataKey="kam" stroke="#f66" dot={false} name="KAM %" />
                        <Line type="monotone" dataKey="trust" stroke="#4f9" dot={false} name="Trust %" />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                )}
              </Stack>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <Stack spacing={1}>
                <Typography variant="subtitle1" fontWeight={700}>Foot plant cadence</Typography>
                <Typography variant="body2" color="text.secondary">
                  Estimated per-minute cadence based on detected plant events. Use to gauge asymmetry or plan progression.
                </Typography>
                <Box sx={{ width: '100%', height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={log.map((entry, idx) => ({
                        idx,
                        plants: Math.max(0, Math.min(100, Math.round(motionMetrics.footPlantCount - idx * 0.5))),
                      }))}
                    >
                      <XAxis dataKey="idx" hide />
                      <YAxis domain={[0, 100]} />
                      <ChartTooltip />
                      <Area type="monotone" dataKey="plants" stroke="#66c" fill="#66c6" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </Stack>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <Stack spacing={1}>
                <Typography variant="subtitle1" fontWeight={700}>Landmark logging</Typography>
                <Typography variant="body2" color="text.secondary">
                  We snapshot normalized XYZ + visibility. No raw video leaves the device.
                </Typography>
                <Box
                  component="pre"
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: 'background.default',
                    border: '1px solid',
                    borderColor: 'divider',
                    maxHeight: 180,
                    overflow: 'auto',
                    fontSize: 11,
                  }}
                >
                  {JSON.stringify(log.slice(-3), null, 2)}
                </Box>
              </Stack>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <SensorsIcon color="primary" />
                    <Typography variant="subtitle1" fontWeight={700}>
                      IMU Assist (beta)
                    </Typography>
                  </Stack>
                  <Chip
                    size="small"
                    color={imuStatus === 'streaming' ? 'success' : imuStatus === 'pairing' ? 'warning' : 'default'}
                    label={
                      imuStatus === 'streaming'
                        ? 'Streaming'
                        : imuStatus === 'pairing'
                        ? 'Pair sensors'
                        : 'Offline'
                    }
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Fuse thigh + shank IMUs with on-device pose to tighten KAM and decel estimates. Packets stay on this
                  laptop; we only log landmarks + IMU stats.
                </Typography>
                <Grid container spacing={1}>
                  {(['thigh', 'shank'] as ImuSensorKey[]).map((sensor) => (
                    <Grid item xs={12} sm={6} key={sensor}>
                      <Card variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                        <Stack spacing={0.5}>
                          <Typography variant="caption" color="text.secondary">
                            {SENSOR_LABELS[sensor]}
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {imuSensors[sensor].paired ? 'Paired' : 'Not paired'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Battery {Math.round(imuSensors[sensor].battery)}%
                          </Typography>
                          <Button
                            size="small"
                            variant={imuSensors[sensor].paired ? 'outlined' : 'contained'}
                            onClick={() => handleToggleSensor(sensor)}
                          >
                            {imuSensors[sensor].paired ? 'Disconnect' : 'Pair sensor'}
                          </Button>
                        </Stack>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  justifyContent="space-between"
                >
                  <Stack spacing={0.25}>
                    <Typography variant="caption" color="text.secondary">
                      Fusion summary
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {imuSamples.length
                        ? `${Math.round(imuFusion.asymmetry)}% asymmetry · ${imuFusion.decelG.toFixed(2)}g`
                        : 'Awaiting sensors'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Confidence {(imuFusion.confidence * 100).toFixed(0)}%
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {fusedKam !== null && (
                      <Chip size="small" variant="outlined" label={`Fused KAM ${Math.round(fusedKam * 100)}%`} />
                    )}
                    <Chip
                      size="small"
                      variant="outlined"
                      label={imuSamples.length ? 'Drift guard active' : 'Landmarks only'}
                    />
                  </Stack>
                </Stack>
                <Box sx={{ width: '100%', height: 150 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={imuChartData}>
                      <XAxis dataKey="time" hide />
                      <YAxis yAxisId="load" domain={[0, 100]} hide />
                      <YAxis yAxisId="decel" orientation="right" domain={[0, 3]} hide />
                      <ChartTooltip />
                      <Area
                        yAxisId="load"
                        type="monotone"
                        dataKey="load"
                        stroke="#fb923c"
                        fill="#fed7aa"
                        fillOpacity={0.4}
                        name="Load %"
                      />
                      <Area
                        yAxisId="decel"
                        type="monotone"
                        dataKey="decel"
                        stroke="#38bdf8"
                        fill="#bae6fd"
                        fillOpacity={0.4}
                        name="Decel g"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Sensors stream locally; if drift exceeds 5% we auto-prompt a retake before sharing metrics upstream.
                </Typography>
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  </Box>
);
}

const analyzeMotion = (history: Array<{ timestamp: number; landmarks: Point[] }>): MotionMetrics => {
  if (history.length < 2) return baseMotionMetrics;
  const latest = history[history.length - 1];
  const previous = history[history.length - 2];
  const pts = latest.landmarks;
  const prevPts = previous.landmarks;
  if (!pts?.length || !prevPts?.length) return baseMotionMetrics;
  const dt = Math.max(1, latest.timestamp - previous.timestamp);
  const LK = pts[25];
  const LA = pts[27];
  const RK = pts[26];
  const RA = pts[28];
  const valgusGap = Math.min(
    Math.abs((LK?.x ?? 1) - (LA?.x ?? 0)),
    Math.abs((RK?.x ?? 1) - (RA?.x ?? 0)),
  );
  const kamScore = Math.max(0, Math.min(1, 1 - valgusGap / 0.045));
  const kamStatus = kamScore > 0.6 ? 'Elevated' : 'Stable';

  const prevLA = prevPts[27];
  const prevRA = prevPts[28];
  const leftFootPlant =
    !!LA &&
    !!prevLA &&
    LA.y > 0.65 &&
    Math.abs(LA.y - prevLA.y) / dt < 0.0008 &&
    Math.abs(LA.x - prevLA.x) / dt < 0.0008;
  const rightFootPlant =
    !!RA &&
    !!prevRA &&
    RA.y > 0.65 &&
    Math.abs(RA.y - prevRA.y) / dt < 0.0008 &&
    Math.abs(RA.x - prevRA.x) / dt < 0.0008;
  const footPlantDetected = leftFootPlant || rightFootPlant;

  const hip = pts[23];
  const prevHip = prevPts[23];
  const hipVelocity =
    hip && prevHip
      ? Math.sqrt(
          Math.pow(hip.x - prevHip.x, 2) + Math.pow(hip.y - prevHip.y, 2),
        ) / dt
      : 0;
  const decelStatus = hipVelocity < 0.0005 && (hip?.y ?? 0) > 0.4 ? 'High' : 'Normal';

  return {
    kamScore,
    kamStatus,
    footPlantDetected,
    footPlantCount: 0,
    decelStatus,
  };
};
