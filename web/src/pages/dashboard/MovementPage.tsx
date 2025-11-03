import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Avatar,
  Backdrop,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Slider,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import RefreshIcon from '@mui/icons-material/Refresh';
import VideocamIcon from '@mui/icons-material/Videocam';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CancelIcon from '@mui/icons-material/Cancel';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import ReplayIcon from '@mui/icons-material/Replay';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';

import { createMovementAssessment, fetchMovementAssessments, updateMovementProof } from '@/api/movement';
import { postRiskVideoFeatures } from '@/api/risk';
import { uploadMedia } from '@/api/media';
import type {
  DrillType,
  MovementAssessment,
  MovementAssessmentInput,
  MovementOverlayInstruction,
  MovementVerdict,
} from '@/types';
import { formatDateTime } from '@/utils/date';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { extractFramesFromVideo, speakCues } from '@/utils/media';
import { useAuth } from '@/hooks/useAuth';

/* --------------------------------------------
 * LOCAL TYPES & CONSTANTS
 * -------------------------------------------*/
interface FrameDraft {
  id: string;
  url: string;
  label?: string;
  capturedAt: string;
}

const DRILL_TYPES: DrillType[] = ['drop_jump', 'planned_cut', 'unplanned_cut'];
const KEY_FRAME_LABELS = ['Landing', 'Plant', 'Push-off'];

const createFrameDraft = (): FrameDraft => ({
  id: `frame-${typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2)}`,
  url: '',
  label: '',
  capturedAt: new Date().toISOString(),
});

const RISK_SEVERITY_COLOR_MAP: Record<'low' | 'moderate' | 'high', 'success' | 'warning' | 'error'> = {
  low: 'success',
  moderate: 'warning',
  high: 'error',
};

const BAND_STATUS_COLOR_MAP: Record<'inside' | 'outside', 'success' | 'error'> = {
  inside: 'success',
  outside: 'error',
};

const verdictColorMap: Record<MovementVerdict, 'success' | 'error' | 'warning' | 'info'> = {
  pass: 'success',
  fix: 'error',
  retake: 'warning',
  needs_review: 'info',
};

const verdictLabelMap: Record<MovementVerdict, string> = {
  pass: 'Pass • inside band',
  fix: 'Fix • cue again',
  retake: 'Retake angle',
  needs_review: 'Needs more reps',
};

const verdictAlertSeverity: Record<MovementVerdict, 'success' | 'error' | 'warning' | 'info'> = {
  pass: 'success',
  fix: 'error',
  retake: 'warning',
  needs_review: 'info',
};

const formatMetricLabel = (value: string) => value.replace(/_/g, ' ');
const formatMetricValue = (value: number | null | undefined) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '--';
  const n = Number(value);
  const abs = Math.abs(n);
  if (abs >= 100) return n.toFixed(0);
  if (abs >= 10) return n.toFixed(1);
  return n.toFixed(2);
};

/* --------------------------------------------
 * OVERLAY PREVIEW CARD
 * -------------------------------------------*/
interface OverlayPreviewCardProps {
  overlay: MovementOverlayInstruction;
  fallbackBefore?: string | null;
  fallbackAfter?: string | null;
}

const OverlayPreviewCard = ({ overlay, fallbackBefore, fallbackAfter }: OverlayPreviewCardProps) => {
  const [split, setSplit] = useState(60);

  const beforeImage = overlay.beforeImageUrl ?? fallbackBefore ?? null;
  const afterImage = overlay.afterImageUrl ?? fallbackAfter ?? beforeImage;
  const hasComparison = Boolean(beforeImage && afterImage && beforeImage !== afterImage);
  const metricsEntries = overlay.metrics ? Object.entries(overlay.metrics) : [];

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
      <Stack spacing={1.5}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
          <Stack spacing={0.5}>
            <Typography variant="subtitle2" fontWeight={600}>
              {overlay.label ?? overlay.overlayType.replace(/_/g, ' ')}
            </Typography>
            {overlay.description && (
              <Typography variant="body2" color="text.secondary">
                {overlay.description}
              </Typography>
            )}
          </Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="flex-end">
            {overlay.bandStatus && (
              <Chip
                size="small"
                color={BAND_STATUS_COLOR_MAP[overlay.bandStatus]}
                variant="outlined"
                label={overlay.bandStatus === 'inside' ? 'Inside band' : 'Outside band'}
              />
            )}
            {overlay.severity && (
              <Chip
                size="small"
                variant="outlined"
                color={RISK_SEVERITY_COLOR_MAP[overlay.severity]}
                label={`${overlay.severity} emphasis`}
              />
            )}
          </Stack>
        </Stack>

        {beforeImage ? (
          <>
            <Box
              sx={{
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                aspectRatio: '4 / 3',
                bgcolor: 'grey.100',
              }}
            >
              <Box component="img" src={beforeImage} alt="Baseline overlay frame" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              {afterImage && (
                <>
                  <Box
                    component="img"
                    src={afterImage}
                    alt="Latest overlay frame"
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      clipPath: `inset(0 ${Math.max(0, 100 - split)}% 0 0)`,
                      transition: 'clip-path 0.18s ease-out',
                      borderRight: '1px solid rgba(255,255,255,0.6)',
                    }}
                  />
                  <Box sx={{ position: 'absolute', top: 0, bottom: 0, left: `${split}%`, width: 2, bgcolor: 'common.white', opacity: 0.85, transform: 'translateX(-1px)' }} />
                </>
              )}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  p: 1.25,
                  pointerEvents: 'none',
                  background: 'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)',
                }}
              >
                <Typography variant="caption" color="common.white">
                  {overlay.comparisonLabel ?? (hasComparison ? 'Slide to compare' : 'Baseline frame')}
                </Typography>
                {hasComparison && <Typography variant="caption" color="common.white">{split.toFixed(0)}% latest</Typography>}
              </Box>
            </Box>
            {hasComparison && (
              <Slider size="small" value={split} min={0} max={100} onChange={(_, value) => setSplit(value as number)} aria-label="Overlay comparison slider" />
            )}
          </>
        ) : (
          <Paper variant="outlined" sx={{ borderRadius: 2, p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="body2" color="text.secondary">No stored frames available for this overlay yet.</Typography>
          </Paper>
        )}

        {overlay.instructions && (
          <Typography variant="body2" color="text.secondary">{overlay.instructions}</Typography>
        )}

        {metricsEntries.length > 0 && (
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {metricsEntries.map(([key, val]) => (
              <Chip key={key} size="small" variant="outlined" label={`${formatMetricLabel(key)}: ${formatMetricValue(val as number)}`} />
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};

/* --------------------------------------------
 * HELPERS
 * -------------------------------------------*/
const extractRiskVideoFeatures = (assessment: MovementAssessment) => ({
  last_video_valgus_score_0_3: assessment.metrics?.kneeValgusScore ?? null,
  trunk_lean_flag: assessment.metrics?.trunkLeanOutsideBOS ?? null,
  foot_plant_outside_com: assessment.metrics?.footPlantOutsideCOM ?? null,
  risk_rating_0_3: assessment.riskRating ?? null,
  view_confidence_0_1: assessment.viewQuality?.score0to1 ?? null,
  counterfactual_tweak: assessment.counterfactual?.tweak ?? null,
  predicted_risk_drop: assessment.counterfactual?.predictedRiskDrop ?? null,
  phase_peak_risk: assessment.peakRiskPhase ?? null,
  generated_at: assessment.createdAt ?? new Date().toISOString(),
});

const getAsymmetryColor = (value: number): 'success' | 'warning' | 'error' => {
  if (value <= 15) return 'success';
  if (value <= 30) return 'warning';
  return 'error';
};

const metricLabelOverrides: Record<string, string> = {
  valgus_angle_deg: 'Valgus angle (deg)',
  time_to_stable_ms: 'Time to stable (ms)',
  ground_contact_time_ms: 'Ground contact (ms)',
  knee_valgus_score: 'Knee valgus score',
};

const toTitleCase = (value: string) =>
  value.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim().replace(/\b\w/g, (c) => c.toUpperCase());

const formatDeltaMetric = (metricKey: string): string => {
  const normalized = metricKey?.toLowerCase();
  if (normalized && metricLabelOverrides[normalized]) return metricLabelOverrides[normalized];
  return normalized ? toTitleCase(normalized) : '';
};

/* --------------------------------------------
 * PHASE SCORE CHIPS
 * -------------------------------------------*/
const PhaseScoreChips = ({
  phaseScores,
  timeToStableMs,
  groundContactTimeMs,
  peakRiskPhase,
}: {
  phaseScores?: MovementAssessment['phaseScores'];
  timeToStableMs?: number | null;
  groundContactTimeMs?: number | null;
  peakRiskPhase?: string | null;
}) => {
  if (!phaseScores) return null;
  const phases: Array<{ key: keyof NonNullable<typeof phaseScores>; label: string }> = [
    { key: 'prep', label: 'Prep' },
    { key: 'takeoff', label: 'Takeoff' },
    { key: 'firstContact', label: 'First contact' },
    { key: 'stabilization', label: 'Stabilization' },
  ];
  return (
    <Stack spacing={0.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} flexWrap="wrap">
        {phases.map(({ key, label }) => {
          const phase = phaseScores[key];
          if (!phase) return null;
          return (
            <Chip
              key={key as string}
              label={`${label}: ${phase.quality0to3 ?? '–'}/3${phase.riskDriver ? ` (${phase.riskDriver})` : ''}`}
              variant="outlined"
              size="small"
            />
          );
        })}
      </Stack>
      {typeof groundContactTimeMs === 'number' && (
        <Typography variant="body2" color="text.secondary">
          Ground contact: {groundContactTimeMs.toFixed(0)} ms
        </Typography>
      )}
      {typeof timeToStableMs === 'number' && (
        <Typography variant="body2" color="text.secondary">
          Time to stabilize: {timeToStableMs.toFixed(0)} ms
        </Typography>
      )}
      {peakRiskPhase && (
        <Typography variant="body2" color="text.secondary">
          Peak risk phase: {peakRiskPhase.replace(/_/g, ' ')}
        </Typography>
      )}
    </Stack>
  );
};

/* --------------------------------------------
 * MAIN COMPONENT
 * -------------------------------------------*/
export const MovementPage = () => {
  const { user } = useAuth();
  const athleteIdFromProfile = user?.athleteId ?? '';

  // Form state
  const [athleteId, setAthleteId] = useState('');
  const [drillType, setDrillType] = useState<DrillType>('drop_jump');
  const [surface, setSurface] = useState('turf');
  const [environment, setEnvironment] = useState('');
  const [temperatureF, setTemperatureF] = useState('85');
  const [humidityPct, setHumidityPct] = useState('60');

  // Frames
  const [frames, setFrames] = useState<FrameDraft[]>([createFrameDraft()]);

  // Data & UI state
  const [history, setHistory] = useState<MovementAssessment[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingVideo, setProcessingVideo] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ open: boolean; msg: string; severity: 'success' | 'info' | 'warning' | 'error' } | null>(null);
  const [autoWeatherLoading, setAutoWeatherLoading] = useState(false);
  const [autoWeatherError, setAutoWeatherError] = useState<string | null>(null);
  const [autoWeatherTimestamp, setAutoWeatherTimestamp] = useState<string | null>(null);
  const [frameMode, setFrameMode] = useState<'summary' | 'edit'>('edit');

  // Proof / micro-plan actions
  const [assigningProofId, setAssigningProofId] = useState<string | null>(null);
  const [completingProofId, setCompletingProofId] = useState<string | null>(null);
  const [completionDialog, setCompletionDialog] = useState<{ open: boolean; assessment: MovementAssessment | null; rpe: string; pain: string; }>({ open: false, assessment: null, rpe: '4', pain: '0' });

  // Details dialog
  const [detailAssessmentId, setDetailAssessmentId] = useState<string | null>(null);
  const detailAssessment = useMemo(() => history.find((item) => item.id === detailAssessmentId) ?? null, [history, detailAssessmentId]);

  // Media capture refs
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const skipProcessingRef = useRef(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const cameraSupported = typeof window !== 'undefined' && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined';

  // Mobile video UX
  useEffect(() => {
    const videoEl = previewVideoRef.current;
    if (videoEl) {
      videoEl.setAttribute('playsinline', 'true');
      videoEl.muted = true;
    }
  }, []);

  // Pre-fill athlete from profile
  useEffect(() => {
    if (!athleteId && athleteIdFromProfile) setAthleteId(athleteIdFromProfile);
  }, [athleteId, athleteIdFromProfile]);

  const validFrames = useMemo(() => frames.filter((frame) => frame.url.trim()), [frames]);
  useEffect(() => {
    if (frameMode === 'summary' && validFrames.length === 0) setFrameMode('edit');
  }, [frameMode, validFrames.length]);

  /* CAMERA HELPERS */
  const stopCameraPreview = useCallback(() => {
    const stream = mediaStreamRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    mediaRecorderRef.current = null;
    const videoEl = previewVideoRef.current;
    if (videoEl) {
      videoEl.pause();
      (videoEl as any).srcObject = null;
      videoEl.removeAttribute('src');
      videoEl.load();
    }
    setCameraActive(false);
  }, []);

  const appendFrames = useCallback((newFrames: FrameDraft[]) => {
    if (!newFrames.length) return;
    setFrames((prev) => {
      const merged = [...prev, ...newFrames];
      const filled = merged.filter((f) => f.url.trim());
      const blanks = merged.filter((f) => !f.url.trim());
      const next = [...filled];
      const placeholder = blanks[0] ?? createFrameDraft();
      if (!placeholder.url.trim()) next.push(placeholder);
      else next.push(createFrameDraft());
      return next;
    });
    setFrameMode('summary');
  }, []);

  const uploadAndAppendBlobs = useCallback(
    async (blobs: Blob[], referenceName: string, labelHint: string) => {
      if (!blobs.length) return;
      setUploadingMedia(true);
      try {
        const sanitizedName = referenceName?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'frame';
        const uploaded: FrameDraft[] = [];
        for (let index = 0; index < blobs.length; index += 1) {
          const blob = blobs[index];
          const extension = blob.type.includes('png') ? 'png' : blob.type.includes('gif') ? 'gif' : blob.type.includes('heic') ? 'heic' : 'jpg';
          const filename = `${sanitizedName}-${Date.now()}-${index + 1}.${extension}`;
          // eslint-disable-next-line no-await-in-loop
          const result = await uploadMedia(blob, filename, blob.type);
          const baseFrame = createFrameDraft();
          const label = blobs.length === 1 ? labelHint : KEY_FRAME_LABELS[index] ?? `${labelHint} ${index + 1}`;
          uploaded.push({ ...baseFrame, url: result.url, label, capturedAt: new Date().toISOString() });
        }
        appendFrames(uploaded);
        setToast({ open: true, severity: 'success', msg: `Added ${uploaded.length} frame${uploaded.length > 1 ? 's' : ''}` });
      } catch {
        setToast({ open: true, severity: 'error', msg: 'Upload failed. Try again.' });
      } finally {
        setUploadingMedia(false);
      }
    },
    [appendFrames],
  );

  const startRecording = useCallback(async () => {
    if (!cameraSupported || typeof navigator === 'undefined' || typeof MediaRecorder === 'undefined') {
      setCaptureError('Camera capture is not supported in this browser.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
      mediaStreamRef.current = stream;
      const videoEl = previewVideoRef.current;
      if (videoEl) {
        (videoEl as any).srcObject = stream;
        try { await videoEl.play(); } catch {}
      }
      const mimeType =
        typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? 'video/webm;codecs=vp9'
          : typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('video/webm;codecs=vp8')
          ? 'video/webm;codecs=vp8'
          : 'video/webm';

      const recorder = new MediaRecorder(stream, { mimeType });
      recordedChunksRef.current = [];
      skipProcessingRef.current = false;
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => { if (event.data.size > 0) recordedChunksRef.current.push(event.data); };
      recorder.onstop = async () => {
        const chunks = recordedChunksRef.current;
        recordedChunksRef.current = [];
        const skip = skipProcessingRef.current;
        skipProcessingRef.current = false;
        mediaRecorderRef.current = null;
        stopCameraPreview();
        setIsRecording(false);

        if (skip || !chunks.length) return;

        const blob = new Blob(chunks, { type: recorder.mimeType || mimeType });
        const file = new File([blob], `capture-${Date.now()}.webm`, { type: blob.type });
        setProcessingVideo(true);
        try {
          const framesFromVideo = await extractFramesFromVideo(file, 3);
          if (!framesFromVideo.length) throw new Error('Unable to extract frames from recording.');
          await uploadAndAppendBlobs(framesFromVideo, file.name, 'Key frame');
        } catch (err) {
          setCaptureError((err as Error).message);
        } finally {
          setProcessingVideo(false);
        }
      };

      setCameraActive(true);
      setIsRecording(true);
      setCaptureError(null);
      try { recorder.start(); } catch {
        setCaptureError('Unable to start recording on this device.');
        skipProcessingRef.current = true;
        recorder.stop();
      }
    } catch {
      setCaptureError('Unable to access camera. Check permissions and try again.');
      stopCameraPreview();
      mediaRecorderRef.current = null;
      setIsRecording(false);
    }
  }, [cameraSupported, stopCameraPreview, uploadAndAppendBlobs]);

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      skipProcessingRef.current = false;
      recorder.stop();
    }
  }, []);

  const cancelRecording = useCallback(() => {
    skipProcessingRef.current = true;
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') recorder.stop();
    else {
      stopCameraPreview();
      mediaRecorderRef.current = null;
    }
    setIsRecording(false);
  }, [stopCameraPreview]);

  const handleVideoSelected = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = '';
      if (!file) return;
      setCaptureError(null);
      setProcessingVideo(true);
      try {
        const framesFromVideo = await extractFramesFromVideo(file, 3);
        if (!framesFromVideo.length) throw new Error('Unable to extract frames from the selected video.');
        await uploadAndAppendBlobs(framesFromVideo, file.name, 'Key frame');
      } catch (err) {
        setCaptureError((err as Error).message);
      } finally {
        setProcessingVideo(false);
      }
    },
    [uploadAndAppendBlobs],
  );

  const handlePhotoSelected = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = '';
      if (!file) return;
      setCaptureError(null);
      try {
        await uploadAndAppendBlobs([file], file.name, 'Captured frame');
      } catch (err) {
        setCaptureError((err as Error).message);
      }
    },
    [uploadAndAppendBlobs],
  );

  useEffect(() => () => {
    // cleanup on unmount
    skipProcessingRef.current = true;
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') recorder.stop();
    stopCameraPreview();
  }, [stopCameraPreview]);

  const canSubmit = useMemo(() => athleteId.trim().length > 0 && frames.some((f) => f.url.trim().length > 0), [athleteId, frames]);

  /* DATA: HISTORY */
  const loadHistory = useCallback(async () => {
    if (!athleteId.trim()) { setHistory([]); return; }
    setLoadingHistory(true);
    try {
      const response = await fetchMovementAssessments(athleteId.trim(), 10);
      setHistory(response.assessments);
    } catch {
      setToast({ open: true, severity: 'error', msg: 'Failed to load assessments' });
    } finally {
      setLoadingHistory(false);
    }
  }, [athleteId]);
  useEffect(() => { if (athleteId.trim()) loadHistory(); }, [athleteId, loadHistory]);

  /* SUBMIT */
  const handleSubmit = async () => {
    if (!canSubmit) { setError('Provide an athlete ID and at least one frame URL.'); return; }
    setSubmitting(true); setError(null);
    const payload: MovementAssessmentInput = {
      athleteId: athleteId.trim(),
      drillType,
      frames: frames.filter((f) => f.url.trim().length > 0).map((f) => ({ id: f.id, url: f.url.trim(), label: f.label?.trim() || undefined, capturedAt: f.capturedAt })),
      context: {
        surface: surface.trim() || undefined,
        environment: environment.trim() || undefined,
        temperatureF: temperatureF ? Number(temperatureF) : undefined,
        humidityPct: humidityPct ? Number(humidityPct) : undefined,
      },
    };
    try {
      const assessment = await createMovementAssessment(payload);
      speakCues(assessment.cues);

      // Sync video features into risk engine (best-effort)
      if (assessment.athleteId) {
        try { await postRiskVideoFeatures(assessment.athleteId, extractRiskVideoFeatures(assessment)); } catch (syncErr) { console.warn('Risk feature sync failed', syncErr); }
      }

      setFrames([createFrameDraft()]);
      setFrameMode('edit');
      await loadHistory();

      const lowViewQuality = assessment.viewQuality && assessment.viewQuality.score0to1 < 0.6;
      const viewMessage = assessment.viewQuality?.fixInstructions;
      setToast({
        open: true,
        severity: lowViewQuality ? 'warning' : 'success',
        msg: lowViewQuality
          ? viewMessage
            ? `Low view confidence • ${viewMessage}`
            : 'View confidence is low — consider retaking from a better angle.'
          : 'Coaching cues generated',
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  /* PROOF / MICRO-PLAN ACTIONS */
  const clonePlanDeep = useCallback(
    (plan?: MovementAssessment['microPlan'] | null): MovementAssessment['microPlan'] => {
      if (!plan) return null;
      return {
        ...plan,
        drills: Array.isArray(plan.drills) ? plan.drills.map((d) => ({ ...d })) : [],
        completion: plan.completion ? { ...plan.completion } : undefined,
      };
    },
    [],
  );

  const applyProofUpdate = useCallback(
    (assessmentId: string, proof?: MovementAssessment['proof'], targetFixAssigned?: boolean) => {
      setHistory((prev) =>
        prev.map((item) => {
          if (item.id !== assessmentId) return item;

          const proofPayload = proof ?? (targetFixAssigned !== undefined && item.proof
            ? { ...item.proof, fixAssigned: targetFixAssigned }
            : item.proof);

          if (!proofPayload && targetFixAssigned === undefined) return item;

          const normalizedProof = proofPayload
            ? {
                ...proofPayload,
                completion: proofPayload.completion ? { ...proofPayload.completion } : undefined,
                microPlan: proofPayload.microPlan ? clonePlanDeep(proofPayload.microPlan) ?? undefined : undefined,
              }
            : undefined;

          const fixAssigned = targetFixAssigned ?? normalizedProof?.fixAssigned ?? item.proof?.fixAssigned ?? false;
          if (normalizedProof) normalizedProof.fixAssigned = fixAssigned;

          const nextMicroPlan = normalizedProof?.microPlan ?? clonePlanDeep(item.microPlan);
          if (nextMicroPlan) {
            nextMicroPlan.quickAssignAvailable = normalizedProof?.completion?.completed ? false : !fixAssigned;
            nextMicroPlan.completion = normalizedProof?.completion
              ? { ...normalizedProof.completion }
              : nextMicroPlan.completion
              ? { ...nextMicroPlan.completion }
              : undefined;
          }

          return {
            ...item,
            proof: normalizedProof,
            microPlan: nextMicroPlan,
            bandSummary: normalizedProof?.band ?? item.bandSummary,
            uncertainty0to1: normalizedProof?.uncertainty0to1 ?? item.uncertainty0to1,
          };
        }),
      );
    },
    [clonePlanDeep],
  );

  const handleQuickAssign = async (assessment: MovementAssessment) => {
    if (!assessment.id) return;
    const currentAssigned = assessment.proof?.fixAssigned ?? false;
    const nextAssignedState = !currentAssigned;
    try {
      setAssigningProofId(assessment.id);
      const updatedProof = await updateMovementProof(assessment.id, { fixAssigned: nextAssignedState });
      applyProofUpdate(assessment.id, updatedProof ?? undefined, nextAssignedState);
      setToast({ open: true, severity: nextAssignedState ? 'success' : 'info', msg: nextAssignedState ? 'Micro-plan queued for today’s session.' : 'Assignment removed.' });
    } catch (error) {
      setToast({ open: true, severity: 'error', msg: (error as Error).message ?? 'Unable to update micro-plan assignment.' });
    } finally {
      setAssigningProofId(null);
    }
  };

  const validateScale = (value: number, label: string) => {
    if (!Number.isFinite(value) || value < 0 || value > 10) {
      setToast({ open: true, severity: 'warning', msg: `${label} must be between 0 and 10.` });
      return false;
    }
    return true;
  };

  const handleLogCompletion = async (assessment: MovementAssessment, rpe: number, pain: number) => {
    if (!assessment.id) return false;
    try {
      setCompletingProofId(assessment.id);
      const updatedProof = await updateMovementProof(assessment.id, { completed: true, rpe, pain });
      applyProofUpdate(assessment.id, updatedProof ?? undefined, assessment.proof?.fixAssigned);
      setToast({ open: true, severity: 'success', msg: 'Completion logged.' });
      return true;
    } catch (error) {
      setToast({ open: true, severity: 'error', msg: (error as Error).message ?? 'Unable to log completion.' });
      return false;
    } finally {
      setCompletingProofId(null);
    }
  };

  const handleClearCompletion = async (assessment: MovementAssessment) => {
    if (!assessment.id) return;
    try {
      setCompletingProofId(assessment.id);
      const updatedProof = await updateMovementProof(assessment.id, { completed: false });
      applyProofUpdate(assessment.id, updatedProof ?? undefined, assessment.proof?.fixAssigned);
      setToast({ open: true, severity: 'info', msg: 'Completion log cleared.' });
    } catch (error) {
      setToast({ open: true, severity: 'error', msg: (error as Error).message ?? 'Unable to clear completion.' });
    } finally {
      setCompletingProofId(null);
    }
  };

  const openCompletionDialog = (assessment: MovementAssessment) => {
    const existingCompletion = assessment.proof?.completion ?? assessment.microPlan?.completion;
    setCompletionDialog({
      open: true,
      assessment,
      rpe: existingCompletion?.rpe !== undefined && existingCompletion.rpe !== null ? String(existingCompletion.rpe) : '4',
      pain: existingCompletion?.pain !== undefined && existingCompletion.pain !== null ? String(existingCompletion.pain) : '0',
    });
  };
  const closeCompletionDialog = () => setCompletionDialog({ open: false, assessment: null, rpe: '4', pain: '0' });
  const handleCompletionDialogSubmit = async () => {
    if (!completionDialog.assessment) return;
    const rpe = Number(completionDialog.rpe);
    if (!validateScale(rpe, 'RPE')) return;
    const pain = Number(completionDialog.pain);
    if (!validateScale(pain, 'Pain')) return;
    const ok = await handleLogCompletion(completionDialog.assessment, rpe, pain);
    if (ok) closeCompletionDialog();
  };

  /* COMPUTED PER-ASSESSMENT */
  const getAssessmentComputed = (assessment: MovementAssessment) => {
    const verdict = (assessment.verdict ?? assessment.proof?.verdict) as MovementVerdict | undefined;
    const verdictReason = assessment.verdictReason ?? assessment.proof?.verdictReason ?? undefined;

    const viewQualitySummary = assessment.proof?.viewQuality
      ? { ...assessment.proof.viewQuality }
      : assessment.viewQuality
      ? {
          score0to1: assessment.viewQuality.score0to1,
          label: assessment.viewQuality.score0to1 >= 0.75 ? 'high' : assessment.viewQuality.score0to1 >= 0.55 ? 'medium' : 'low',
          fixInstructions: assessment.viewQuality.fixInstructions ?? undefined,
          retryRecommended: assessment.viewQuality.retryRecommended,
        }
      : undefined;

    const bandSummary = assessment.bandSummary ?? assessment.proof?.band ?? [];
    const microPlan = assessment.microPlan ?? assessment.proof?.microPlan ?? null;
    const proofTimestamp = assessment.proof?.proofAt ?? null;
    const proofAssigned = assessment.proof?.fixAssigned ?? false;
    const completion = assessment.proof?.completion ?? assessment.microPlan?.completion;
    const quickAssignAvailable = completion?.completed ? false : microPlan ? (microPlan.quickAssignAvailable ?? !proofAssigned) : false;
    const uncertainty = assessment.uncertainty0to1 ?? assessment.proof?.uncertainty0to1 ?? undefined;
    const viewScore = viewQualitySummary?.score0to1 ?? null;
    const viewLabel = (viewQualitySummary as any)?.label as 'low' | 'medium' | 'high' | undefined;

    return {
      verdict,
      verdictReason,
      viewQualitySummary,
      bandSummary,
      microPlan,
      proofTimestamp,
      proofAssigned,
      completion,
      quickAssignAvailable,
      uncertainty,
      viewScore,
      viewLabel,
      cues: assessment.cues ?? [],
      metrics: assessment.metrics,
    };
  };

  /* ENVIRONMENT SNAPSHOT */
  const fetchEnvironmentSnapshot = useCallback(() => {
    if (autoWeatherLoading) return;
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setAutoWeatherError('Geolocation is not supported in this browser.');
      setToast({ open: true, severity: 'warning', msg: 'Enable location access to auto-fill weather.' });
      return;
    }
    setAutoWeatherLoading(true);
    setAutoWeatherError(null);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const { latitude, longitude } = coords;
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m&temperature_unit=fahrenheit`;
          const response = await fetch(url);
          if (!response.ok) throw new Error('Weather service unavailable');
          const data = await response.json();
          const temp = data?.current?.temperature_2m;
          const humidity = data?.current?.relative_humidity_2m;
          if (typeof temp === 'number') setTemperatureF(String(Math.round(temp)));
          if (typeof humidity === 'number') setHumidityPct(String(Math.round(humidity)));
          setEnvironment((prev) => {
            if (prev?.trim()) return prev;
            const parts: string[] = [];
            if (typeof temp === 'number') parts.push(`${Math.round(temp)}°F`);
            if (typeof humidity === 'number') parts.push(`${Math.round(humidity)}% humidity`);
            parts.push('auto-detected conditions');
            return parts.join(' · ');
          });
          setAutoWeatherTimestamp(new Date().toISOString());
          setToast({ open: true, severity: 'success', msg: 'Environment details synced' });
        } catch (err) {
          const msg = (err as Error).message ?? 'Unable to fetch weather';
          setAutoWeatherError(msg);
          setToast({ open: true, severity: 'error', msg });
        } finally {
          setAutoWeatherLoading(false);
        }
      },
      (error) => {
        setAutoWeatherLoading(false);
        setAutoWeatherError(error.message);
        setToast({ open: true, severity: 'warning', msg: 'Location permission denied' });
      },
      { enableHighAccuracy: false, timeout: 8000 },
    );
  }, [autoWeatherLoading]);

  /* PASTE / KEYBOARD / DND */
  useEffect(() => {
    const onPaste = async (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      const item = Array.from(e.clipboardData.items).find((i) => i.type.startsWith('image/'));
      if (item) {
        const blob = item.getAsFile();
        if (blob) await uploadAndAppendBlobs([blob], 'pasted', 'Captured frame');
        return;
      }
      const text = e.clipboardData.getData('text');
      if (text && /^https?:\/\//i.test(text)) {
        setFrames((prev) => {
          const idx = prev.findIndex((f) => !f.url.trim());
          if (idx === -1) return [...prev, { ...createFrameDraft(), url: text }];
          const next = [...prev];
          next[idx] = { ...next[idx], url: text };
          return next;
        });
        setToast({ open: true, severity: 'info', msg: 'Pasted URL into empty frame' });
      }
    };
    window.addEventListener('paste', onPaste as unknown as EventListener);
    return () => window.removeEventListener('paste', onPaste as unknown as EventListener);
  }, [uploadAndAppendBlobs]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'r') { if (isRecording) stopRecording(); else startRecording(); }
      if (e.key === 'Escape' && (cameraActive || isRecording)) cancelRecording();
    };
    window.addEventListener('keydown', onKey as unknown as EventListener);
    return () => window.removeEventListener('keydown', onKey as unknown as EventListener);
  }, [cameraActive, isRecording, startRecording, stopRecording, cancelRecording]);

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;
    const images = files.filter((f) => f.type.startsWith('image/'));
    const video = files.find((f) => f.type.startsWith('video/'));
    if (images.length) await uploadAndAppendBlobs(images, images[0].name, 'Captured frame');
    if (video) {
      setProcessingVideo(true);
      try {
        const framesFromVideo = await extractFramesFromVideo(video, 3);
        if (!framesFromVideo.length) throw new Error('Unable to extract frames from the dropped video.');
        await uploadAndAppendBlobs(framesFromVideo, video.name, 'Key frame');
      } catch (err) {
        setCaptureError((err as Error).message);
      } finally {
        setProcessingVideo(false);
      }
    }
  };
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const analyzingCapture = processingVideo || uploadingMedia;

  /* RENDER */
  return (
    <>
      {/* hidden inputs */}
      <input type="file" accept="video/*" capture="environment" ref={videoInputRef} onChange={handleVideoSelected} style={{ display: 'none' }} />
      <input type="file" accept="image/*" capture="environment" ref={photoInputRef} onChange={handlePhotoSelected} style={{ display: 'none' }} />

      {/* TOAST */}
      <Snackbar open={!!toast?.open} autoHideDuration={3000} onClose={() => setToast(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setToast(null)} severity={toast?.severity || 'info'} variant="filled">{toast?.msg}</Alert>
      </Snackbar>

      {/* Completion dialog */}
      <Dialog
        open={completionDialog.open}
        onClose={() => {
          if (completingProofId && completionDialog.assessment && completingProofId === completionDialog.assessment.id) return;
          closeCompletionDialog();
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Log micro-plan completion</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              label="RPE (0-10)"
              type="number"
              inputProps={{ min: 0, max: 10, step: 1 }}
              value={completionDialog.rpe}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setCompletionDialog((prev) => ({ ...prev, rpe: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Pain / soreness (0-10)"
              type="number"
              inputProps={{ min: 0, max: 10, step: 1 }}
              value={completionDialog.pain}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setCompletionDialog((prev) => ({ ...prev, pain: event.target.value }))}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCompletionDialog} disabled={!!completionDialog.assessment && completingProofId === completionDialog.assessment.id}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCompletionDialogSubmit}
            disabled={!completionDialog.assessment || (completionDialog.assessment && completingProofId === completionDialog.assessment.id)}
          >
            {completionDialog.assessment && completingProofId === completionDialog.assessment.id ? 'Saving…' : 'Save log'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Details dialog */}
      <Dialog open={!!detailAssessment} onClose={() => setDetailAssessmentId(null)} fullWidth maxWidth="md">
        <DialogTitle>
          Assessment details
          <IconButton aria-label="close" onClick={() => setDetailAssessmentId(null)} sx={{ position: 'absolute', right: 12, top: 10 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {detailAssessment ? (
            <Stack spacing={2.5}>
              <Typography variant="overline" color="text.secondary">
                {detailAssessment.drillType.replace('_', ' ')} • {formatDateTime(detailAssessment.createdAt)}
              </Typography>
              <Typography variant="h6">{detailAssessment.overview?.headline ?? 'Movement assessment'}</Typography>
              {detailAssessment.overview?.summary && (
                <Typography variant="body2" color="text.secondary">{detailAssessment.overview.summary}</Typography>
              )}

              {/* verdict + view quality + bands */}
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {detailAssessment.verdict && (
                  <Chip size="small" color={verdictColorMap[detailAssessment.verdict as MovementVerdict]} label={verdictLabelMap[detailAssessment.verdict as MovementVerdict]} />
                )}
                {typeof detailAssessment.viewQuality?.score0to1 === 'number' && (
                  <Chip size="small" variant="outlined" label={`View ${(detailAssessment.viewQuality.score0to1 * 100).toFixed(0)}%`} />
                )}
                {typeof detailAssessment.uncertainty0to1 === 'number' && (
                  <Chip size="small" variant="outlined" color="warning" label={`Uncertainty ${(detailAssessment.uncertainty0to1 * 100).toFixed(0)}%`} />
                )}
              </Stack>

              {/* cues */}
              {detailAssessment.cues?.length ? (
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {detailAssessment.cues.map((cue) => <Chip key={cue} size="small" variant="outlined" label={cue} />)}
                </Stack>
              ) : null}

              {/* overlays */}
              {detailAssessment.overlays?.length ? (
                <Paper variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
                  <Stack spacing={1.5}>
                    <Typography variant="caption" color="text.secondary">Visual overlays</Typography>
                    <Stack spacing={1.5}>
                      {detailAssessment.overlays.map((overlay, i) => (
                        <OverlayPreviewCard
                          key={`${detailAssessment.id}-overlay-${i}`}
                          overlay={overlay}
                          fallbackBefore={detailAssessment.frames?.[0]?.snapshotUrl}
                          fallbackAfter={
                            detailAssessment.frames && detailAssessment.frames.length > 1
                              ? detailAssessment.frames[detailAssessment.frames.length - 1]?.snapshotUrl
                              : detailAssessment.frames?.[0]?.snapshotUrl
                          }
                        />
                      ))}
                    </Stack>
                  </Stack>
                </Paper>
              ) : null}

              {/* phases */}
              {detailAssessment.phaseScores && (
                <Paper variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
                  <Stack spacing={1}>
                    <Typography variant="caption" color="text.secondary">Phase breakdown</Typography>
                    <PhaseScoreChips
                      phaseScores={detailAssessment.phaseScores}
                      groundContactTimeMs={detailAssessment.groundContactTimeMs}
                      timeToStableMs={detailAssessment.timeToStableMs}
                      peakRiskPhase={detailAssessment.peakRiskPhase}
                    />
                  </Stack>
                </Paper>
              )}

              {/* baseline compare */}
              {(typeof detailAssessment.asymmetryIndex0to100 === 'number' ||
                (detailAssessment.deltaFromBaseline && Object.keys(detailAssessment.deltaFromBaseline).length > 0)) && (
                <Paper variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
                  <Stack spacing={1}>
                    <Typography variant="caption" color="text.secondary">Baseline comparison</Typography>
                    {typeof detailAssessment.asymmetryIndex0to100 === 'number' && (
                      <Chip
                        size="small"
                        variant="outlined"
                        color={getAsymmetryColor(detailAssessment.asymmetryIndex0to100)}
                        label={`Asymmetry ${detailAssessment.asymmetryIndex0to100.toFixed(0)}%`}
                        sx={{ alignSelf: 'flex-start' }}
                      />
                    )}
                    {detailAssessment.deltaFromBaseline &&
                      Object.entries(detailAssessment.deltaFromBaseline)
                        .filter(([, value]) => typeof value === 'number' && !Number.isNaN(value))
                        .map(([metric, value]) => (
                          <Stack key={`${detailAssessment.id}-${metric}`} direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" color="text.secondary">{formatDeltaMetric(metric)}</Typography>
                            <Typography variant="body2" color={(value as number) > 0 ? 'error.main' : (value as number) < 0 ? 'success.main' : 'text.secondary'}>
                              {(value as number) > 0 ? '+' : (value as number) < 0 ? '-' : ''}
                              {Math.abs(value as number).toFixed(1)}
                            </Typography>
                          </Stack>
                        ))}
                  </Stack>
                </Paper>
              )}

              {/* coaching plan & counterfactual */}
              {detailAssessment.coachingPlan && (
                <Paper variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
                  <Stack spacing={0.5}>
                    <Typography variant="caption" color="text.secondary">Coaching plan</Typography>
                    <Typography variant="body2">Immediate cue: {detailAssessment.coachingPlan.immediateCue}</Typography>
                    <Typography variant="body2">Practice focus: {detailAssessment.coachingPlan.practiceFocus}</Typography>
                    <Typography variant="body2">Monitoring: {detailAssessment.coachingPlan.monitoring}</Typography>
                  </Stack>
                </Paper>
              )}
              {detailAssessment.counterfactual && (
                <Paper variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
                  <Stack spacing={0.5}>
                    <Typography variant="caption" color="text.secondary">Counterfactual plan</Typography>
                    <Typography variant="body2">Tweak: {detailAssessment.counterfactual.tweak}</Typography>
                    <Typography variant="body2">Predicted risk drop: {detailAssessment.counterfactual.predictedRiskDrop.toFixed(2)}</Typography>
                    <Typography variant="body2">Next rep verify: {detailAssessment.counterfactual.nextRepVerify ? 'Yes' : 'No'}</Typography>
                    {detailAssessment.counterfactual.summary && (
                      <Typography variant="body2" color="text.secondary">{detailAssessment.counterfactual.summary}</Typography>
                    )}
                  </Stack>
                </Paper>
              )}
            </Stack>
          ) : null}
        </DialogContent>
        <DialogActions>
          {detailAssessment && (
            <>
              <Button
                size="small"
                variant="outlined"
                startIcon={<CheckCircleIcon />}
                disabled={assigningProofId === detailAssessment.id}
                onClick={() => handleQuickAssign(detailAssessment)}
              >
                {detailAssessment.proof?.fixAssigned ? 'Remove assignment' : 'Quick assign'}
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={() => openCompletionDialog(detailAssessment)}
                disabled={!!detailAssessment.proof?.completion?.completed}
              >
                {detailAssessment.proof?.completion?.completed ? 'Completed' : 'Log completion'}
              </Button>
            </>
          )}
          <Button onClick={() => setDetailAssessmentId(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Camera Backdrop Overlay */}
      <Backdrop open={cameraActive || isRecording} sx={{ color: '#fff', zIndex: (t) => t.zIndex.drawer + 10, backdropFilter: 'blur(6px)', background: 'rgba(4,6,18,0.78)' }}>
        <Box sx={{ width: { xs: '92vw', sm: 420 }, maxWidth: 520, borderRadius: 4, p: 2, border: '1px solid rgba(255,255,255,0.18)', boxShadow: '0 24px 64px rgba(0,0,0,0.6)', background: 'radial-gradient(circle at 50% 10%, rgba(255,255,255,0.10), transparent 60%), #0b0e2a' }}>
          <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.16)', aspectRatio: '9/16', backgroundColor: 'rgba(5,8,30,0.9)' }}>
            <video ref={previewVideoRef} muted autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', p: 2, background: 'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)' }}>
              <Chip label={isRecording ? 'REC' : 'Preview'} icon={<FiberManualRecordIcon htmlColor={isRecording ? '#ff5f6d' : '#49f2c2'} />} sx={{ bgcolor: 'rgba(0,0,0,0.48)', color: '#fff', borderColor: 'rgba(255,255,255,0.22)' }} variant="outlined" />
              <Stack direction="row" spacing={1.5}>
                <Button size="small" color="error" startIcon={<StopCircleIcon />} onClick={stopRecording} disabled={!isRecording} variant="contained">Stop</Button>
                <Button size="small" startIcon={<CancelIcon />} onClick={cancelRecording} variant="outlined">Cancel</Button>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Backdrop>

      <Stack spacing={4}>
        {/* HERO / CAPTURE */}
        <Box
          sx={{
            position: 'relative',
            borderRadius: { xs: 4, md: 5 },
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'stretch',
            gap: { xs: 3, md: 5 },
            flexDirection: { xs: 'column', md: 'row' },
            p: { xs: 3, md: 4 },
            border: '1px solid rgba(28,62,217,0.14)',
            background: 'linear-gradient(145deg, rgba(32, 58, 216, 0.18) 0%, rgba(16, 20, 48, 0.82) 55%, rgba(18, 21, 54, 0.88) 100%)',
            color: '#fff',
            boxShadow: '0 30px 60px rgba(17, 34, 120, 0.35)',
            backdropFilter: 'blur(18px)',
          }}
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <Box sx={{ position: 'relative', zIndex: 2, flex: 1 }}>
            <Typography variant="overline" sx={{ letterSpacing: '0.2em', opacity: 0.75 }}>MOVEMENT COACH</Typography>
            <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>Capture elite landing mechanics in real time</Typography>
            <Typography variant="body1" sx={{ mt: 1.5, color: 'rgba(255,255,255,0.76)', maxWidth: 620 }}>
              Auto-extract the landing, plant, and push-off frames, score mechanics instantly, and deliver concise coaching cues on the spot.
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Chip icon={<FiberManualRecordIcon sx={{ color: '#ff5f6d !important' }} />} label="Live capture" sx={{ bgcolor: 'rgba(255, 95, 109, 0.18)', borderColor: 'rgba(255, 95, 109, 0.3)', color: '#ffb3b8' }} variant="outlined" />
              <Chip label="AI scoring & cueing" variant="outlined" sx={{ borderColor: 'rgba(90, 170, 255, 0.4)', color: '#a6c9ff' }} />
              <Chip icon={<KeyboardIcon />} label="R = Record · Esc = Cancel · ⌘/Ctrl+V = Paste" size="small" sx={{ bgcolor: 'rgba(0,0,0,0.35)', color: '#fff' }} />
            </Stack>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* LEFT: session + frames */}
          <Grid item xs={12} md={7}>
            <Card sx={{ overflow: 'hidden' }}>
              {submitting && <LinearProgress />}
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                  <Box>
                    <Typography variant="h6">Session setup</Typography>
                    <Typography variant="body2" color="text.secondary">Identify the athlete and environment before analysing mechanics.</Typography>
                  </Box>
                  <Chip label={`Drill · ${drillType.replace('_', ' ')}`} color="primary" />
                </Stack>

                <ErrorAlert message={error} />

                <Stack spacing={3}>
                  <TextField label="Athlete ID" placeholder="rb-12" value={athleteId} onChange={(e) => setAthleteId(e.target.value)} required />
                  <TextField label="Drill type" select value={drillType} onChange={(e) => setDrillType(e.target.value as DrillType)}>
                    {DRILL_TYPES.map((type) => (<MenuItem key={type} value={type}>{type.replace('_', ' ')}</MenuItem>))}
                  </TextField>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}><TextField label="Surface" value={surface} onChange={(e) => setSurface(e.target.value)} /></Grid>
                    <Grid item xs={6} md={3}><TextField label="Temp °F" value={temperatureF} onChange={(e) => setTemperatureF(e.target.value)} type="number" /></Grid>
                    <Grid item xs={6} md={3}><TextField label="Humidity %" value={humidityPct} onChange={(e) => setHumidityPct(e.target.value)} type="number" /></Grid>
                  </Grid>

                  <TextField label="Environment notes" multiline minRows={2} value={environment} onChange={(e) => setEnvironment(e.target.value)} placeholder="High heat, turf, north endzone camera" />

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
                    <Button variant="outlined" startIcon={<MyLocationIcon />} onClick={fetchEnvironmentSnapshot} disabled={autoWeatherLoading}>
                      {autoWeatherLoading ? 'Fetching conditions…' : 'Auto-fill weather'}
                    </Button>
                    {autoWeatherTimestamp && <Chip label={`Updated ${formatDateTime(autoWeatherTimestamp)}`} variant="outlined" size="small" />}
                  </Stack>
                  {autoWeatherError && <Typography variant="caption" color="error">{autoWeatherError}</Typography>}

                  <Divider sx={{ borderStyle: 'dashed' }} />

                  {/* Capture toolkit */}
                  <Stack spacing={2}>
                    <Typography variant="subtitle1">Capture toolkit</Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flexWrap="wrap" alignItems="flex-start">
                      <Button variant="contained" startIcon={isRecording ? <StopCircleIcon /> : <VideocamIcon />} onClick={isRecording ? stopRecording : startRecording} disabled={!cameraSupported || processingVideo || uploadingMedia}>
                        {isRecording ? 'Stop & analyse clip' : 'Record landing clip'}
                      </Button>
                      {cameraActive && (
                        <Button variant="outlined" startIcon={<CancelIcon />} onClick={cancelRecording} disabled={processingVideo || uploadingMedia}>Cancel recording</Button>
                      )}
                      <Tooltip title="Upload a studio clip if you recorded externally"><span>
                        <Button variant="outlined" startIcon={<VideocamIcon />} onClick={() => videoInputRef.current?.click()} disabled={processingVideo || uploadingMedia || isRecording}>Upload video file</Button>
                      </span></Tooltip>
                      <Tooltip title="Bring in a still shot or freeze-frame"><span>
                        <Button variant="outlined" startIcon={<PhotoCameraIcon />} onClick={() => photoInputRef.current?.click()} disabled={processingVideo || uploadingMedia || isRecording}>Upload photo</Button>
                      </span></Tooltip>
                      <Tooltip title="Paste image or URL from clipboard (⌘/Ctrl+V)"><span>
                        <Button variant="text" startIcon={<ContentPasteIcon />} disabled={processingVideo || uploadingMedia}>Paste from clipboard</Button>
                      </span></Tooltip>
                    </Stack>

                    <ErrorAlert message={captureError} />

                    {analyzingCapture && (
                      <Paper
                        elevation={0}
                        sx={{
                          borderRadius: 3, p: { xs: 3, md: 3.5 },
                          border: '1px solid rgba(17, 38, 146, 0.18)',
                          background: 'linear-gradient(135deg, rgba(53,99,255,0.12) 0%, rgba(22,27,65,0.92) 65%)',
                          color: '#fff', boxShadow: '0 18px 45px rgba(17, 38, 146, 0.28)',
                        }}
                      >
                        <Stack spacing={2} alignItems="flex-start">
                          <Typography variant="subtitle1" fontWeight={600}>Analysing clip…</Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.72)' }}>
                            Extracting key frames and preparing them for the movement model.
                          </Typography>
                          <LinearProgress
                            sx={{
                              width: '100%', height: 8, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.18)',
                              '& .MuiLinearProgress-bar': { borderRadius: 999, backgroundImage: 'linear-gradient(90deg, #63f5c5 0%, #3590ff 100%)' },
                            }}
                          />
                        </Stack>
                      </Paper>
                    )}

                    {!analyzingCapture && frameMode === 'summary' && validFrames.length > 0 ? (
                      <Paper variant="outlined" sx={{ borderRadius: 3, border: '1px solid rgba(17, 38, 146, 0.16)', boxShadow: '0 16px 40px rgba(17, 38, 146, 0.12)', p: { xs: 3, md: 3.5 } }}>
                        <Stack spacing={2.5}>
                          <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Box>
                              <Typography variant="subtitle1" fontWeight={600}>{validFrames.length} key frame{validFrames.length > 1 ? 's' : ''} ready for scoring</Typography>
                              <Typography variant="body2" color="text.secondary">The assistant will submit these automatically when you generate cues.</Typography>
                            </Box>
                            <Button size="small" variant="outlined" startIcon={<KeyboardIcon />} onClick={() => setFrameMode('edit')}>Fine-tune frames</Button>
                          </Stack>
                          <Stack spacing={1.5}>
                            {validFrames.map((frame, idx) => (
                              <Paper key={frame.id} variant="outlined" sx={{ borderRadius: 2, p: 2, display: 'flex', alignItems: 'center', gap: 2, border: '1px solid rgba(13,74,255,0.12)', backgroundColor: 'rgba(53,99,255,0.04)' }}>
                                <Avatar variant="rounded" sx={{ width: 60, height: 60, bgcolor: 'rgba(53,99,255,0.1)', color: 'primary.main', fontWeight: 600 }} src={/^https?:\/\//.test(frame.url) ? frame.url : undefined}>
                                  {idx + 1}
                                </Avatar>
                                <Stack spacing={0.5} flex={1}>
                                  <Typography fontWeight={600}>{frame.label ?? `Frame ${idx + 1}`}</Typography>
                                  <Typography variant="caption" color="text.secondary">Captured {formatDateTime(frame.capturedAt)}</Typography>
                                </Stack>
                                <Tooltip title="Copy URL">
                                  <IconButton size="small" onClick={() => {
                                    if (navigator?.clipboard?.writeText) {
                                      navigator.clipboard.writeText(frame.url)
                                        .then(() => setToast({ open: true, severity: 'info', msg: 'Frame URL copied' }))
                                        .catch(() => setToast({ open: true, severity: 'warning', msg: 'Unable to copy URL automatically' }));
                                    }
                                  }}>
                                    <ContentPasteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Paper>
                            ))}
                          </Stack>
                          <Stack direction="row" spacing={1}>
                            <Button startIcon={<ReplayIcon />} variant="text" onClick={() => { setFrames([createFrameDraft()]); setFrameMode('edit'); }}>Retake clip</Button>
                            <Button startIcon={<AddPhotoAlternateIcon />} variant="text" onClick={() => setFrameMode('edit')}>Add or adjust frames</Button>
                          </Stack>
                        </Stack>
                      </Paper>
                    ) : (
                      !analyzingCapture && (
                        <Stack spacing={2}>
                          {frames.map((frame, index) => (
                            <Paper key={frame.id} variant="outlined" sx={{ borderRadius: 3, border: '1px solid rgba(13, 74, 255, 0.12)', boxShadow: '0 8px 30px rgba(13, 74, 255, 0.06)' }}>
                              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                                <Stack spacing={2}>
                                  <Box display="flex" alignItems="center" gap={1}>
                                    <Chip label={`Frame ${index + 1}`} color={index === 0 ? 'primary' : 'default'} size="small" />
                                    {!!frame.label && <Chip label={frame.label} size="small" variant="outlined" />}
                                    <Tooltip title="Remove frame"><IconButton size="small" onClick={() => setFrames((prev) => prev.filter((f) => f.id !== frame.id))}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                                  </Box>
                                  <Grid container spacing={2}>
                                    <Grid item xs={12} md={7}>
                                      <TextField label="Media URL" placeholder="https://..." value={frame.url} onChange={(e) => setFrames((prev) => prev.map((f) => (f.id === frame.id ? { ...f, url: e.target.value } : f)))} helperText="Upload stills or paste secure S3/HTTPS links." fullWidth />
                                    </Grid>
                                    <Grid item xs={12} md={5}>
                                      <Stack direction="row" spacing={2} alignItems="center">
                                        <Avatar variant="rounded" sx={{ width: 72, height: 72, bgcolor: 'background.default' }} src={/^https?:\/\//.test(frame.url) ? frame.url : undefined}>
                                          {!frame.url && 'No preview'}
                                        </Avatar>
                                        <Stack spacing={1} flex={1}>
                                          <TextField label="Label" placeholder="Landing frame" value={frame.label} onChange={(e) => setFrames((prev) => prev.map((f) => (f.id === frame.id ? { ...f, label: e.target.value } : f)))} />
                                          <TextField label="Captured at" type="datetime-local" value={frame.capturedAt.slice(0, 16)} onChange={(e) => setFrames((prev) => prev.map((f) => (f.id === frame.id ? { ...f, capturedAt: new Date(e.target.value).toISOString() } : f)))} />
                                        </Stack>
                                      </Stack>
                                    </Grid>
                                  </Grid>
                                </Stack>
                              </CardContent>
                            </Paper>
                          ))}
                          <Stack direction="row" spacing={1}>
                            <Button startIcon={<AddPhotoAlternateIcon />} onClick={() => { setFrameMode('edit'); setFrames((prev) => [...prev, createFrameDraft()]); }} variant="text">Add another frame</Button>
                            <Button startIcon={<ReplayIcon />} variant="text" onClick={() => { setFrames([createFrameDraft()]); setFrameMode('edit'); }}>Reset frames</Button>
                          </Stack>
                        </Stack>
                      )
                    )}
                  </Stack>
                </Stack>
              </CardContent>

              <CardActions sx={{ justifyContent: 'space-between', px: 3, pb: 3 }}>
                <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadHistory} disabled={loadingHistory}>Refresh history</Button>
                <Button variant="contained" disabled={!canSubmit || submitting} onClick={handleSubmit} sx={{ minWidth: 220 }}>
                  {submitting ? 'Scoring mechanics…' : 'Generate coaching cues'}
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* RIGHT: history */}
          <Grid item xs={12} md={5}>
            <Card sx={{ height: '100%' }}>
              {loadingHistory && <LinearProgress />}
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h6" gutterBottom>Recent AI assessments</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>Tracks risk rating, coaching cues, and frame evidence for the last 10 submissions.</Typography>

                <Stack spacing={2} sx={{ mt: 2 }}>
                  {!loadingHistory && history.length === 0 && (<Typography color="text.secondary">No assessments recorded yet.</Typography>)}

                  {history.map((assessment) => {
                    const { verdict, viewScore, viewLabel, uncertainty, proofTimestamp, cues } = getAssessmentComputed(assessment);
                    const summaryText = assessment.overview?.summary ?? 'Open the assessment to review cues, metrics, overlays, and micro-plan details.';
                    const cuesPreview = cues.slice(0, 3);
                    return (
                      <Paper key={assessment.id} variant="outlined" sx={{ borderRadius: 3, p: { xs: 2.5, md: 3 }, borderColor: 'divider' }}>
                        <Stack spacing={1.5}>
                          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                            <Box>
                              <Typography variant="overline" color="text.secondary">
                                {assessment.drillType.replace('_', ' ')} • {formatDateTime(assessment.createdAt)}
                              </Typography>
                              <Typography variant="subtitle1" fontWeight={600}>
                                {assessment.overview?.headline ?? 'Movement assessment'}
                              </Typography>
                            </Box>
                            <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}>
                              {verdict && <Chip size="small" color={verdictColorMap[verdict]} label={verdictLabelMap[verdict]} />}
                              <Chip size="small" color={assessment.riskRating >= 2 ? 'secondary' : 'primary'} label={`Risk ${assessment.riskRating}/3`} />
                              {typeof uncertainty === 'number' && <Chip size="small" variant="outlined" color="warning" label={`Uncertainty ${(uncertainty * 100).toFixed(0)}%`} />}
                              {viewScore !== null && <Chip size="small" variant="outlined" label={`Confidence ${(viewScore * 100).toFixed(0)}%`} />}
                              {viewLabel && <Chip size="small" variant="outlined" label={`View ${viewLabel}`} />}
                            </Stack>
                          </Stack>

                          <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3, overflow: 'hidden' }}>
                            {summaryText}
                          </Typography>

                          {cuesPreview.length > 0 && (
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              {cuesPreview.map((cue) => <Chip key={`${assessment.id}-cue-${cue}`} size="small" variant="outlined" label={cue} />)}
                            </Stack>
                          )}

                          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                              Proof updated {proofTimestamp ? formatDateTime(proofTimestamp) : formatDateTime(assessment.updatedAt ?? assessment.createdAt)}
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              <Button size="small" variant="outlined" onClick={() => setDetailAssessmentId(assessment.id)}>View details</Button>
                              <Button
                                size="small"
                                variant={assessment.proof?.fixAssigned ? 'contained' : 'outlined'}
                                startIcon={<CheckCircleIcon />}
                                onClick={() => handleQuickAssign(assessment)}
                                disabled={assigningProofId === assessment.id}
                              >
                                {assessment.proof?.fixAssigned ? 'Assigned' : 'Quick assign'}
                              </Button>
                              <Button
                                size="small"
                                onClick={() => openCompletionDialog(assessment)}
                                disabled={!!assessment.proof?.completion?.completed || completingProofId === assessment.id}
                              >
                                {assessment.proof?.completion?.completed ? 'Completed' : 'Log completion'}
                              </Button>
                            </Stack>
                          </Stack>
                        </Stack>
                      </Paper>
                    );
                  })}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </>
  );
};
