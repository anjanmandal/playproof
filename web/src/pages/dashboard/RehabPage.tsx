import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Paper,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import RefreshIcon from '@mui/icons-material/Refresh';
import VideocamIcon from '@mui/icons-material/Videocam';
import SensorsIcon from '@mui/icons-material/Sensors';
import { fetchRehabHistory, fetchRtsGateSummary, submitLiveCaptureSession } from '@/api/rehab';
import { uploadMedia } from '@/api/media';
import { generateEvidencePack, fetchEvidenceViews } from '@/api/evidence';
import type {
  RehabAssessmentRecord,
  RehabAssessmentResultDTO,
  RehabTestType,
  RtsGateSummary,
  EvidencePackResponse,
  EvidenceViewLogEntry,
} from '@/types';
import { formatDate } from '@/utils/date';
import { useAuth } from '@/hooks/useAuth';
import { WearablePage } from '@/pages/wearables/WearablePage';
import { isWearableIntegrationActive } from '@/config/features';

const FORM_GRADE_COLORS: Record<'A' | 'B' | 'C', 'success' | 'warning' | 'error'> = {
  A: 'success',
  B: 'warning',
  C: 'error',
};

const TEST_TYPES: RehabTestType[] = ['single_leg_hop', 'triple_hop', 'squat', 'lunge'];
interface RehabClip {
  id: string;
  testType: RehabTestType;
  url: string;
  capturedAt: string;
}
const createClipId = () =>
  `clip-${typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2)}`;

export const RehabPage = () => {
  const { user } = useAuth();
  const athleteIdFromProfile = user?.athleteId ?? '';
  const [athleteId, setAthleteId] = useState('');
  const [athleteIdTouched, setAthleteIdTouched] = useState(false);
  const [surgicalSide, setSurgicalSide] = useState<'left' | 'right'>('left');
  const [sessionDate, setSessionDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [clips, setClips] = useState<RehabClip[]>([]);
  const [history, setHistory] = useState<RehabAssessmentRecord[]>([]);
  const [liveSubmitting, setLiveSubmitting] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [liveDialogOpen, setLiveDialogOpen] = useState(false);
  const [wearableDialogOpen, setWearableDialogOpen] = useState(false);
  const [lastLiveResult, setLastLiveResult] = useState<RehabAssessmentResultDTO | null>(null);
  const [lastCaptureClips, setLastCaptureClips] = useState(0);
  const [toast, setToast] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [captureUploading, setCaptureUploading] = useState(false);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [nextTestType, setNextTestType] = useState<RehabTestType>('single_leg_hop');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [shareResult, setShareResult] = useState<EvidencePackResponse | null>(null);
  const [shareViews, setShareViews] = useState<EvidenceViewLogEntry[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const cameraSupported =
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia;

  const effectiveAthleteId = useMemo(
    () => athleteId.trim() || athleteIdFromProfile || '',
    [athleteId, athleteIdFromProfile],
  );
  const canSubmit = useMemo(
    () => Boolean(effectiveAthleteId) && clips.length > 0,
    [effectiveAthleteId, clips],
  );

  const loadHistory = useCallback(async () => {
    if (!effectiveAthleteId) {
      setHistory([]);
      return;
    }
    try {
      const response = await fetchRehabHistory(effectiveAthleteId, 6);
      setHistory(response.assessments);
    } catch (err) {
      console.warn('Failed to load rehab history', err);
    }
  }, [effectiveAthleteId]);

useEffect(() => {
  if (!athleteIdTouched && athleteIdFromProfile) {
    setAthleteId(athleteIdFromProfile);
  }
}, [athleteIdTouched, athleteIdFromProfile]);

useEffect(() => {
  void loadHistory();
}, [loadHistory]);

  const buildLiveCapturePayload = () => ({
    athleteId: athleteId.trim() || athleteIdFromProfile,
    surgicalSide,
    sessionDate,
    videos: clips.map((clip) => ({
      id: clip.id,
      url: clip.url,
      testType: clip.testType,
      capturedAt: clip.capturedAt,
    })),
  });
  const latestAssessment = history[0] ?? null;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const shareLink = useMemo(() => {
    if (!shareResult) return '';
    let base = apiBaseUrl;
    if (!base) {
      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname || 'localhost';
        const protocol = window.location.protocol || 'http:';
        base = `${protocol}//${hostname}:4000`;
      } else {
        base = 'http://localhost:4000';
      }
    }
    try {
      return new URL(shareResult.downloadUrl, base).toString();
    } catch {
      return shareResult.downloadUrl;
    }
  }, [shareResult, apiBaseUrl]);

  useEffect(() => {
    setShowPreview(false);
  }, [shareLink]);

  const previewLink = useMemo(() => {
    if (!shareLink) return '';
    return `${shareLink}${shareLink.includes('?') ? '&' : '?'}inline=true`;
  }, [shareLink]);

  const handleCopyShareLink = useCallback(async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setToast({ message: 'Link copied to clipboard', severity: 'success' });
    } catch {
      setToast({ message: 'Unable to copy link', severity: 'error' });
    }
  }, [shareLink]);
  const refreshShareViews = useCallback(async (evidenceId: string) => {
    try {
      const views = await fetchEvidenceViews(evidenceId);
      setShareViews(views);
    } catch (err) {
      console.warn('Failed to load viewer log', err);
    }
  }, []);

  const handleShareEvidence = useCallback(async () => {
    if (!effectiveAthleteId || !latestAssessment) {
      setShareError('Need a completed rehab assessment before sharing.');
      return;
    }
    setShareLoading(true);
    setShareError(null);
    try {
      const response = await generateEvidencePack({
        athleteId: effectiveAthleteId,
        rehabAssessmentId: latestAssessment.id,
      });
      setShareResult(response);
      setShowPreview(false);
      setShareDialogOpen(true);
      await refreshShareViews(response.evidenceId);
    } catch (err) {
      setShareError((err as Error).message);
    } finally {
      setShareLoading(false);
    }
  }, [effectiveAthleteId, latestAssessment, refreshShareViews]);

  const stopCameraPreview = useCallback(() => {
    const stream = mediaStreamRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    const videoEl = previewVideoRef.current;
    if (videoEl) {
      videoEl.pause();
      (videoEl as any).srcObject = null;
      videoEl.removeAttribute('src');
      videoEl.load();
    }
    setCameraActive(false);
  }, []);

  const uploadClip = useCallback(
    async (blob: Blob, type: RehabTestType) => {
      setCaptureUploading(true);
      try {
        const extension = blob.type.split('/')[1]?.split(';')[0] ?? 'png';
        const filename = `rehab-${type}-${Date.now()}.${extension}`;
        const result = await uploadMedia(blob, filename, blob.type);
        const clip: RehabClip = {
          id: createClipId(),
          testType: type,
          url: result.url,
          capturedAt: new Date().toISOString(),
        };
        setClips((prev) => [...prev, clip]);
        setCaptureError(null);
      } catch (err) {
        setCaptureError((err as Error).message || 'Upload failed. Try again.');
      } finally {
        setCaptureUploading(false);
      }
    },
    [],
  );

  const startCamera = useCallback(async () => {
    if (cameraActive || captureUploading) return;
    if (!cameraSupported) {
      setCaptureError('Camera capture is not supported in this browser.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
      });
      mediaStreamRef.current = stream;
      const videoEl = previewVideoRef.current;
      if (videoEl) {
        (videoEl as any).srcObject = stream;
        try {
          await videoEl.play();
        } catch {
          //
        }
      }
      setCaptureError(null);
      setCameraActive(true);
    } catch (error) {
      console.error('Live capture failed', error);
      setCaptureError('Unable to access camera. Check permissions and try again.');
    }
  }, [cameraActive, cameraSupported, captureUploading]);

  const captureSnapshot = useCallback(async () => {
    if (!cameraActive || captureUploading) return;
    const videoEl = previewVideoRef.current;
    if (!videoEl || videoEl.videoWidth === 0) {
      setCaptureError('Waiting for camera preview...');
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setCaptureError('Unable to capture frame.');
      return;
    }
    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob((value) => resolve(value), 'image/png'));
    if (!blob) {
      setCaptureError('Unable to create image.');
      return;
    }
    await uploadClip(blob, nextTestType);
  }, [cameraActive, captureUploading, nextTestType, uploadClip]);

  const removeClip = useCallback((id: string) => {
    setClips((prev) => prev.filter((clip) => clip.id !== id));
  }, []);

  const handleLiveDialogClose = useCallback(() => {
    stopCameraPreview();
    setLiveDialogOpen(false);
  }, [stopCameraPreview]);

  useEffect(
    () => () => {
      stopCameraPreview();
    },
    [stopCameraPreview],
  );

  const handleLiveCaptureSubmit = async () => {
    if (!canSubmit) {
      setLiveError('Provide at least one capture link and ensure an athlete is selected.');
      return;
    }
    const payload = buildLiveCapturePayload();
    const clipCount = payload.videos.length;
    if (!payload.athleteId) {
      setLiveError('Athlete ID is required.');
      return;
    }
    setLiveSubmitting(true);
    setLiveError(null);
    try {
      const response = await submitLiveCaptureSession(payload);
      setLastLiveResult(response.assessment);
      setLastCaptureClips(clipCount);
      setClips([]);
      setLiveDialogOpen(false);
      await loadHistory();
      setToast({
        severity: 'success',
        message: response.assessment.cleared
          ? 'Live capture synced · Ready badge unlocked'
          : 'Live capture synced · Gates still gated',
      });
    } catch (err) {
      setLiveError((err as Error).message);
      setToast({
        severity: 'error',
        message: (err as Error).message || 'Live capture failed',
      });
    } finally {
      setLiveSubmitting(false);
    }
  };

  return (
    <>
      <Stack spacing={4}>
        <Paper
          variant="outlined"
          sx={(theme) => ({
            px: { xs: 2.5, md: 3.5 },
            py: { xs: 2.5, md: 3 },
            borderRadius: 4,
            borderColor: alpha(theme.palette.primary.main, 0.25),
            background:
              theme.palette.mode === 'light'
                ? 'linear-gradient(135deg, rgba(53,99,255,0.08), rgba(78,225,197,0.05))'
                : 'linear-gradient(135deg, rgba(18,24,48,0.9), rgba(20,46,46,0.8))',
          })}
        >
          <Stack spacing={1.5}>
            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 2 }}>
              Rehab Command
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
              <Typography variant="h4" fontWeight={700}>
                Rehab Co-Pilot
              </Typography>
              <Chip
                size="small"
                color={latestAssessment?.cleared ? 'success' : 'default'}
                label={
                  latestAssessment
                    ? `Latest LSI ${latestAssessment.limbSymmetryScore.toFixed(0)}%`
                    : 'Awaiting capture'
                }
              />
            </Stack>
            <Typography variant="body1" color="text.secondary">
              Validate limb symmetry with AI capture, lock RTS gates, and share evidence with surgeons in one flow.
            </Typography>
          </Stack>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <RtsGateStack athleteId={effectiveAthleteId} />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              <Card
                variant="outlined"
                sx={(theme) => ({
                  borderRadius: 4,
                  borderColor: alpha(theme.palette.primary.main, 0.15),
                })}
              >
                <CardContent>
                  <Stack spacing={2}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      justifyContent="space-between"
                      spacing={1}
                      alignItems={{ xs: 'flex-start', sm: 'center' }}
                    >
                      <Box>
                        <Typography variant="h6" fontWeight={700}>
                          Session capture
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          OpenAI-powered hop analysis ingests clips, scores RTS metrics, and syncs trust cards.
                        </Typography>
                      </Box>
                      <Chip
                        size="small"
                        color={effectiveAthleteId ? 'primary' : 'default'}
                        label={
                          effectiveAthleteId ? `Athlete ${effectiveAthleteId}` : 'Select athlete'
                        }
                      />
                    </Stack>
                    <TextField
                      label="Athlete ID"
                      value={athleteId}
                      onChange={(event) => {
                        if (!athleteIdTouched) setAthleteIdTouched(true);
                        setAthleteId(event.target.value);
                      }}
                      placeholder={athleteIdFromProfile || 'athlete-id'}
                      helperText={
                        athleteIdFromProfile && !athleteIdTouched
                          ? `Defaulting to linked athlete ${athleteIdFromProfile}`
                          : 'Roster ID used for live capture + RTS logs'
                      }
                    />
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                      <Button
                        variant="contained"
                        startIcon={<VideocamIcon />}
                        onClick={() => setLiveDialogOpen(true)}
                        disabled={!effectiveAthleteId}
                        fullWidth
                      >
                        Live capture
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<SensorsIcon />}
                        onClick={() => setWearableDialogOpen(true)}
                        disabled={!effectiveAthleteId || !isWearableIntegrationActive}
                        fullWidth
                      >
                        Wearable ingest
                      </Button>
                    </Stack>
                    {lastLiveResult && (
                      <Paper
                        variant="outlined"
                        sx={(theme) => ({
                          p: 2,
                          borderRadius: 3,
                          borderColor: alpha(theme.palette.success.main, 0.4),
                          backgroundColor:
                            theme.palette.mode === 'light'
                              ? alpha(theme.palette.success.light, 0.1)
                              : alpha(theme.palette.success.dark, 0.2),
                        })}
                      >
                        <Stack spacing={0.5}>
                          <Typography variant="subtitle2">
                            Last capture · {formatDate(lastLiveResult.generatedAt)}
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            <Chip
                              size="small"
                              color={lastLiveResult.cleared ? 'success' : 'warning'}
                              label={lastLiveResult.cleared ? 'Ready badge' : 'Locked'}
                            />
                            <Chip
                              size="small"
                              variant="outlined"
                              label={`LSI ${lastLiveResult.limbSymmetryScore.toFixed(0)}%`}
                            />
                            <Chip
                              size="small"
                              variant="outlined"
                              label={`Form ${lastLiveResult.formGrade}`}
                              color={FORM_GRADE_COLORS[lastLiveResult.formGrade]}
                            />
                            {lastCaptureClips > 0 && (
                              <Chip size="small" variant="outlined" label={`${lastCaptureClips} clips`} />
                            )}
                          </Stack>
                          <Typography variant="body2" color="text.secondary">
                            {lastLiveResult.formCue}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {lastLiveResult.athleteSummary || 'Auto insights synced to RTS stack.'}
                          </Typography>
                        </Stack>
                      </Paper>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      Only live capture or wearable ingest can submit rehab data—manual fields are retired for privacy and trust.
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>

              <Card
                variant="outlined"
                sx={(theme) => ({
                  borderRadius: 4,
                  borderColor: alpha(theme.palette.success.main, 0.25),
                })}
              >
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <Typography variant="h6" fontWeight={600}>
                      Recent rehab gates
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      {latestAssessment && (
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<InsertDriveFileIcon fontSize="small" />}
                          onClick={handleShareEvidence}
                          disabled={shareLoading}
                        >
                          {shareLoading ? 'Preparing…' : 'Share with PT'}
                        </Button>
                      )}
                      <Chip size="small" variant="outlined" label={`${history.length} reports`} />
                    </Stack>
                  </Stack>
                  <Stack spacing={2} sx={{ mt: 2 }}>
                    {!effectiveAthleteId && (
                      <Typography color="text.secondary">
                        Select an athlete to load historical gates and evidence receipts.
                      </Typography>
                    )}
                    {effectiveAthleteId && history.length === 0 && (
                      <Typography color="text.secondary">
                        No captures yet. Submit live clips to unlock clearance summaries.
                      </Typography>
                    )}
                    {history.map((assessment) => (
                      <Card
                        key={assessment.id}
                        variant="outlined"
                        sx={(theme) => ({
                          borderColor: assessment.cleared
                            ? alpha(theme.palette.success.main, 0.4)
                            : alpha(theme.palette.error.main, 0.4),
                        })}
                      >
                        <CardContent>
                          <Stack spacing={1}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Typography variant="subtitle2" fontWeight={600}>
                                {formatDate(assessment.createdAt)}
                              </Typography>
                              <Chip
                                size="small"
                                color={assessment.cleared ? 'success' : 'error'}
                                label={assessment.cleared ? 'Cleared' : 'Locked'}
                              />
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                              LSI {assessment.limbSymmetryScore.toFixed(0)}%
                            </Typography>
                            <Typography variant="body2">{assessment.athleteSummary}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Clinician notes: {assessment.clinicianNotes || 'N/A'}
                            </Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
      <Dialog open={liveDialogOpen} onClose={handleLiveDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Run live capture</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">
              Guided AI flow calibrates your camera, records hops, and pushes metrics straight into RTS gates.
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Athlete ID"
                  value={effectiveAthleteId || 'Not set'}
                  disabled
                  fullWidth
                  helperText={
                    effectiveAthleteId
                      ? `Capture tied to ${effectiveAthleteId}`
                      : 'Select an athlete on the main card'
                  }
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  label="Session date"
                  type="date"
                  value={sessionDate}
                  fullWidth
                  onChange={(event) => setSessionDate(event.target.value)}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  label="Surgical side"
                  select
                  value={surgicalSide}
                  fullWidth
                  onChange={(event) => setSurgicalSide(event.target.value as 'left' | 'right')}
                >
                  <MenuItem value="left">Left</MenuItem>
                  <MenuItem value="right">Right</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={7}>
                <Box
                  sx={{
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    overflow: 'hidden',
                    backgroundColor: 'common.black',
                    minHeight: 220,
                  }}
                >
                  <Box
                    component="video"
                    ref={previewVideoRef}
                    autoPlay
                    muted
                    playsInline
                    loop
                    sx={{ width: '100%', height: 220, objectFit: 'cover' }}
                  />
                </Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                  <Button
                    variant={cameraActive ? 'outlined' : 'contained'}
                    color="primary"
                    startIcon={<VideocamIcon />}
                    onClick={cameraActive ? stopCameraPreview : startCamera}
                    disabled={captureUploading}
                  >
                    {cameraActive ? 'Close preview' : 'Open camera'}
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<VideocamIcon />}
                    onClick={captureSnapshot}
                    disabled={!cameraActive || captureUploading}
                  >
                    Capture snapshot
                  </Button>
                  {captureUploading && (
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <CircularProgress size={20} />
                      <Typography variant="caption" color="text.secondary">
                        Uploading…
                      </Typography>
                    </Stack>
                  )}
                </Stack>
                <Typography variant="caption" color={captureError ? 'error' : 'text.secondary'}>
                  {captureError ??
                    (cameraActive
                      ? 'Preview running—capture a snapshot when ready.'
                      : cameraSupported
                      ? 'Camera ready. Open preview to capture snapshots.'
                      : 'Camera not supported in this browser.')}
                </Typography>
            </Grid>
          <Grid item xs={12} md={5}>
                <TextField
                  select
                  label="Next test type"
                  value={nextTestType}
                  onChange={(event) => setNextTestType(event.target.value as RehabTestType)}
                  fullWidth
                >
                  {TEST_TYPES.map((test) => (
                    <MenuItem key={test} value={test}>
                      {test.replace('_', ' ')}
                    </MenuItem>
                  ))}
                </TextField>
                <Typography variant="caption" color="text.secondary">
                  Tag the snapshot with the drill you’re filming.
                </Typography>
                <Stack spacing={1} sx={{ mt: 1 }}>
                  {clips.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      Capture at least one snapshot to enable RTS submission.
                    </Typography>
                  ) : (
                    clips.map((clip) => (
                      <Card key={clip.id} variant="outlined">
                        <CardContent>
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Box>
                              <Typography variant="subtitle2" fontWeight={600}>
                                {clip.testType.replace('_', ' ')}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(clip.capturedAt).toLocaleString()}
                              </Typography>
                            </Box>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Chip size="small" label="Uploaded" color="success" />
                              <IconButton size="small" onClick={() => removeClip(clip.id)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </Stack>
              </Grid>
            </Grid>
            {liveError && (
              <Typography variant="caption" color="error">
                {liveError}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              Latest snapshot:{' '}
              {latestAssessment
                ? `${latestAssessment.limbSymmetryScore.toFixed(0)}% LSI · ${
                    latestAssessment.cleared ? 'Cleared' : 'Locked'
                  }`
                : 'No captures yet'}
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLiveDialogClose}>Close</Button>
          <Button
            variant="contained"
            disabled={!canSubmit || liveSubmitting || captureUploading}
            onClick={handleLiveCaptureSubmit}
          >
            {liveSubmitting ? 'Analyzing…' : 'Run capture'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Evidence pack</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            {shareError && (
              <Alert severity="error" onClose={() => setShareError(null)}>
                {shareError}
              </Alert>
            )}
            {shareResult ? (
              <>
                <Typography variant="body2" color="text.secondary">
                  Link expires {new Date(shareResult.expiresAt).toLocaleString()}.
                </Typography>
                <TextField label="Shareable link" value={shareLink} InputProps={{ readOnly: true }} fullWidth />
                <Stack direction="row" spacing={1}>
                  <Button variant="contained" onClick={handleCopyShareLink}>
                    Copy link
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      if (shareLink) {
                        window.open(shareLink, '_blank', 'noopener,noreferrer');
                      }
                    }}
                  >
                    Open PDF
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={() => shareResult && refreshShareViews(shareResult.evidenceId)}
                  >
                    Refresh viewers
                  </Button>
                  <Button
                    variant="outlined"
                    color={showPreview ? 'success' : 'primary'}
                    onClick={() => setShowPreview((prev) => !prev)}
                    disabled={!shareLink}
                  >
                    {showPreview ? 'Hide preview' : 'Preview'}
                  </Button>
                </Stack>
                {showPreview && previewLink && (
                  <Box
                    component="iframe"
                    src={previewLink}
                    title="Evidence preview"
                    sx={{
                      width: '100%',
                      height: 480,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                    }}
                  />
                )}
                <Divider />
                <Typography variant="subtitle2">Viewers</Typography>
                {shareViews.length === 0 ? (
                  <Typography variant="caption" color="text.secondary">
                    No views yet.
                  </Typography>
                ) : (
                  <List dense>
                    {shareViews.map((view) => (
                      <ListItem key={view.id} disableGutters>
                        <ListItemText
                          primary={view.viewer}
                          secondary={new Date(view.viewedAt).toLocaleString()}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </>
            ) : (
              <Stack spacing={1} alignItems="center" sx={{ py: 3 }}>
                <CircularProgress size={24} />
                <Typography variant="body2" color="text.secondary">
                  Generating pack…
                </Typography>
              </Stack>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={wearableDialogOpen}
        onClose={() => setWearableDialogOpen(false)}
        fullScreen
        scroll="paper"
      >
        <DialogTitle>Wearable ingest</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ width: '100%', minHeight: '80vh' }}>
            <WearablePage />
          </Box>
        </DialogContent>
      <DialogActions>
        <Button onClick={() => setWearableDialogOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={6000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {toast ? (
          <Alert
            severity={toast.severity}
            onClose={() => setToast(null)}
            sx={{ width: '100%' }}
          >
            {toast.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </>
  );
};

const sportLabels: Record<'pivot' | 'non_pivot', string> = {
  pivot: 'Pivoting / cutting sports',
  non_pivot: 'Linear / non-pivot sports',
};

const trustColors: Record<'A' | 'B' | 'C', 'success' | 'warning' | 'error'> = {
  A: 'success',
  B: 'warning',
  C: 'error',
};

const RtsGateStack = ({ athleteId }: { athleteId?: string | null }) => {
  const [sportFocus, setSportFocus] = useState<'pivot' | 'non_pivot'>('pivot');
  const [sex, setSex] = useState<'female' | 'male'>('female');
  const [age, setAge] = useState(20);
  const [expandedGate, setExpandedGate] = useState<string | null>(null);
  const [summary, setSummary] = useState<RtsGateSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resolvedAthleteId =
    athleteId && athleteId.trim().length > 0 ? athleteId.trim() : 'demo-athlete';

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchRtsGateSummary(resolvedAthleteId, {
      sport: sportFocus,
      sex,
      age,
    })
      .then((result) => {
        if (cancelled) return;
        setSummary(result);
      })
      .catch((err) => {
        console.warn('Failed to load RTS gates', err);
        if (cancelled) return;
        setError('Unable to load RTS gates right now.');
        setSummary(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [resolvedAthleteId, sportFocus, sex, age]);

  const gates = summary?.gates ?? [];
  const remaining = summary?.gatesRemaining ?? gates.filter((gate) => gate.status === 'fail').length;
  const progress =
    summary?.progressPct ?? (gates.length ? Math.round(((gates.length - remaining) / gates.length) * 100) : 0);
  const ready = summary?.ready ?? gates.length > 0 ? remaining === 0 : false;
  const lockedGate = gates.find((gate) => gate.status === 'fail');
  const explainText =
    summary?.explanation ??
    (lockedGate ? `${lockedGate.label} is below target.` : 'Collect RTS data to unlock badge.');

  const handleEvidence = () => {
    window.open(summary?.receiptUrl ?? '/docs/rts-evidence.pdf', '_blank', 'noopener,noreferrer');
  };

  const formatGateValue = (gate: RtsGateSummary['gates'][number], value: number) =>
    gate.scale === 'percent' ? `${(value * 100).toFixed(0)}%` : `${value.toFixed(2)} ${gate.units}`;

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            spacing={1.5}
            alignItems={{ xs: 'flex-start', md: 'center' }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6">RTS Gates (LSI-aware)</Typography>
              <Chip
                icon={ready ? <LockOpenIcon fontSize="small" /> : <LockIcon fontSize="small" />}
                color={ready ? 'success' : 'default'}
                label={ready ? 'Ready badge unlocked' : `${remaining} gates remaining`}
              />
              <Chip size="small" variant="outlined" label={`Progress ${progress}%`} />
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" size="small">
                View criteria
              </Button>
              <Button
                variant="contained"
                size="small"
                startIcon={<InsertDriveFileIcon />}
                onClick={handleEvidence}
              >
                Evidence receipt
              </Button>
            </Stack>
          </Stack>

          {loading && <LinearProgress sx={{ maxWidth: 320 }} />}
          {error && (
            <Typography variant="caption" color="error">
              {error}
            </Typography>
          )}

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <ToggleButtonGroup
              size="small"
              value={sportFocus}
              exclusive
              onChange={(_, value) => {
                if (!value) return;
                setSportFocus(value);
              }}
            >
              <ToggleButton value="pivot">Pivoting</ToggleButton>
              <ToggleButton value="non_pivot">Non-pivoting</ToggleButton>
            </ToggleButtonGroup>
            <TextField
              select
              label="Sex"
              size="small"
              sx={{ width: 130 }}
              value={sex}
              onChange={(event) => setSex(event.target.value as 'female' | 'male')}
            >
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="male">Male</MenuItem>
            </TextField>
            <TextField
              type="number"
              size="small"
              label="Age"
              sx={{ width: 110 }}
              value={age}
              onChange={(event) => setAge(Number(event.target.value))}
            />
            <Chip
              size="small"
              variant="outlined"
              label={sportLabels[sportFocus]}
            />
          </Stack>

          <Tooltip title={explainText}>
            <Chip
              size="small"
              icon={<InfoOutlinedIcon fontSize="small" />}
              label={lockedGate ? 'Why locked?' : 'All gates cleared'}
              color={lockedGate ? 'warning' : 'success'}
              variant={lockedGate ? 'filled' : 'outlined'}
            />
          </Tooltip>

          {!gates.length && !loading && (
            <Typography variant="body2" color="text.secondary">
              No RTS submissions yet. Upload hop and strength data to populate these gates.
            </Typography>
          )}

          <Grid container spacing={2}>
            {gates.map((gate) => (
              <Grid key={gate.id} item xs={12} md={6} lg={3}>
                <Card
                  variant="outlined"
                  sx={(theme) => ({
                    height: '100%',
                    borderColor:
                      gate.status === 'pass'
                        ? alpha(theme.palette.success.main, 0.4)
                        : alpha(theme.palette.warning.main, 0.6),
                  })}
                  onClick={() => setExpandedGate((prev) => (prev === gate.id ? null : gate.id))}
                >
                  <CardContent>
                    <Stack spacing={1.25}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2">{gate.label}</Typography>
                        <Chip
                          size="small"
                          color={trustColors[gate.trust]}
                          label={`Trust ${gate.trust}`}
                        />
                      </Stack>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Box position="relative" display="inline-flex">
                          <CircularProgress
                            variant="determinate"
                            value={
                              gate.scale === 'percent'
                                ? Math.min(100, Math.round(gate.latest * 100))
                                : gate.target > 0
                                ? Math.min(125, Math.round((gate.latest / gate.target) * 100))
                                : 0
                            }
                            size={72}
                            thickness={4.5}
                            color={gate.status === 'pass' ? 'success' : 'warning'}
                          />
                          <Box
                            sx={{
                              top: 0,
                              left: 0,
                              bottom: 0,
                              right: 0,
                              position: 'absolute',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Typography variant="subtitle2">
                              {formatGateValue(gate, gate.latest)}
                            </Typography>
                          </Box>
                        </Box>
                        <Stack spacing={0.5}>
                          <Typography variant="caption" color="text.secondary">
                            Latest
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {formatGateValue(gate, gate.latest)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Best {formatGateValue(gate, gate.best)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Target {formatGateValue(gate, gate.target)}
                          </Typography>
                        </Stack>
                      </Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          size="small"
                          variant="outlined"
                          color={gate.status === 'pass' ? 'success' : 'warning'}
                          label={gate.status === 'pass' ? 'Pass' : 'Needs work'}
                        />
                        {gate.driftLocked && (
                          <Chip size="small" color="error" label="Drift guard" />
                        )}
                        {(gate.trust === 'C' || (gate.trust === 'B' && gate.variance > 3)) && (
                          <Chip size="small" color="warning" label="Retest" />
                        )}
                      </Stack>
                      {expandedGate === gate.id && (
                        <>
                          <Divider />
                          <Typography variant="caption" color="text.secondary">
                            {gate.notes}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Variance {gate.variance}% • Drift {gate.driftPercent}%
                          </Typography>
                        </>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography variant="caption" color="text.secondary">
            {summary?.cameraHint ?? 'Trust score improves with consistent lighting (>=300 lux) and 60 FPS capture.'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {athleteId ? `Linked athlete: ${athleteId}` : 'Athlete not selected · demo targets shown'}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};
