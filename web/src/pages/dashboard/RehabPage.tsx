import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { submitRehabAssessment, fetchRehabHistory } from '@/api/rehab';
import type { RehabAssessmentInput, RehabAssessmentRecord, RehabTestType } from '@/types';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { formatDate } from '@/utils/date';
import { useAuth } from '@/hooks/useAuth';

interface VideoDraft {
  id: string;
  url: string;
  testType: RehabTestType;
  capturedAt: string;
}

const TEST_TYPES: RehabTestType[] = ['single_leg_hop', 'triple_hop', 'squat', 'lunge'];

const createVideoDraft = (): VideoDraft => ({
  id: `video-${typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2)}`,
  url: '',
  testType: 'single_leg_hop',
  capturedAt: new Date().toISOString(),
});

export const RehabPage = () => {
  const { user } = useAuth();
  const athleteIdFromProfile = user?.athleteId ?? '';
  const [athleteId, setAthleteId] = useState('');
  const [surgicalSide, setSurgicalSide] = useState<'left' | 'right'>('left');
  const [sessionDate, setSessionDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [videos, setVideos] = useState<VideoDraft[]>([createVideoDraft()]);
  const [limbInjuredHop, setLimbInjuredHop] = useState('140');
  const [limbHealthyHop, setLimbHealthyHop] = useState('155');
  const [strengthInjuredQuad, setStrengthInjuredQuad] = useState('70');
  const [strengthHealthyQuad, setStrengthHealthyQuad] = useState('82');
  const [history, setHistory] = useState<RehabAssessmentRecord[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return (
      athleteId.trim().length > 0 &&
      videos.some((video) => video.url.trim().length > 0)
    );
  }, [athleteId, videos]);

  const loadHistory = useCallback(async () => {
    if (!athleteId.trim()) {
      setHistory([]);
      return;
    }
    try {
      const response = await fetchRehabHistory(athleteId.trim(), 6);
      setHistory(response.assessments);
    } catch (err) {
      console.warn('Failed to load rehab history', err);
    }
  }, [athleteId]);

  useEffect(() => {
    if (!athleteId && athleteIdFromProfile) {
      setAthleteId(athleteIdFromProfile);
    }
    if (athleteId.trim()) {
      loadHistory();
    }
  }, [athleteId, athleteIdFromProfile, loadHistory]);

  const buildPayload = (): RehabAssessmentInput => ({
    athleteId: athleteId.trim(),
    surgicalSide,
    sessionDate,
    videos: videos
      .filter((video) => video.url.trim().length > 0)
      .map((video) => ({
        id: video.id,
        url: video.url.trim(),
        testType: video.testType,
        capturedAt: video.capturedAt,
      })),
    limbSymmetry: {
      injured: {
        hopDistance: Number(limbInjuredHop),
        tripleHopDistance: Number(limbInjuredHop) * 2.8,
      },
      healthy: {
        hopDistance: Number(limbHealthyHop),
        tripleHopDistance: Number(limbHealthyHop) * 2.8,
      },
    },
    strength: {
      injured: {
        quad: Number(strengthInjuredQuad),
        hamstring: Number(strengthInjuredQuad) * 0.7,
        units: 'lbs',
      },
      healthy: {
        quad: Number(strengthHealthyQuad),
        hamstring: Number(strengthHealthyQuad) * 0.7,
        units: 'lbs',
      },
    },
  });

  const handleSubmit = async () => {
    if (!canSubmit) {
      setError('Provide athlete ID and at least one rehab video url.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await submitRehabAssessment(buildPayload());
      setVideos([createVideoDraft()]);
      await loadHistory();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateVideo = (id: string, updates: Partial<VideoDraft>) => {
    setVideos((prev) => prev.map((video) => (video.id === id ? { ...video, ...updates } : video)));
  };

  const addVideo = () => setVideos((prev) => [...prev, createVideoDraft()]);
  const removeVideo = (id: string) => setVideos((prev) => prev.filter((video) => video.id !== id));

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Rehab Co-Pilot
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Validate limb symmetry and AI coaching to clear athletes for field return safely.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Session inputs
              </Typography>

              <ErrorAlert message={error} />

              <Stack spacing={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Athlete ID"
                      value={athleteId}
                      onChange={(event) => setAthleteId(event.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Session date"
                      type="date"
                      value={sessionDate}
                      onChange={(event) => setSessionDate(event.target.value)}
                    />
                  </Grid>
                </Grid>

                <TextField
                  label="Surgical side"
                  select
                  value={surgicalSide}
                  onChange={(event) => setSurgicalSide(event.target.value as 'left' | 'right')}
                >
                  <MenuItem value="left">Left</MenuItem>
                  <MenuItem value="right">Right</MenuItem>
                </TextField>

                <Stack spacing={2}>
                  <Typography variant="subtitle1">Uploaded tests</Typography>
                  {videos.map((video, index) => (
                    <Card key={video.id} variant="outlined">
                      <CardContent>
                        <Stack spacing={2}>
                          <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography variant="subtitle2" fontWeight={600}>
                              Test #{index + 1}
                            </Typography>
                            <IconButton onClick={() => removeVideo(video.id)} size="small">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                          <TextField
                            label="Video URL"
                            value={video.url}
                            onChange={(event) =>
                              updateVideo(video.id, { url: event.target.value })
                            }
                            placeholder="https://..."
                          />
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <TextField
                                label="Test type"
                                select
                                value={video.testType}
                                onChange={(event) =>
                                  updateVideo(video.id, { testType: event.target.value as RehabTestType })
                                }
                              >
                                {TEST_TYPES.map((test) => (
                                  <MenuItem key={test} value={test}>
                                    {test.replace('_', ' ')}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                label="Captured at"
                                type="datetime-local"
                                value={video.capturedAt.slice(0, 16)}
                                onChange={(event) =>
                                  updateVideo(video.id, {
                                    capturedAt: new Date(event.target.value).toISOString(),
                                  })
                                }
                              />
                            </Grid>
                          </Grid>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                  <Button startIcon={<AddCircleOutlineIcon />} onClick={addVideo}>
                    Add another test
                  </Button>
                </Stack>

                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <TextField
                      label="Injured hop (cm)"
                      type="number"
                      value={limbInjuredHop}
                      onChange={(event) => setLimbInjuredHop(event.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      label="Healthy hop (cm)"
                      type="number"
                      value={limbHealthyHop}
                      onChange={(event) => setLimbHealthyHop(event.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      label="Injured quad (lbs)"
                      type="number"
                      value={strengthInjuredQuad}
                      onChange={(event) => setStrengthInjuredQuad(event.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      label="Healthy quad (lbs)"
                      type="number"
                      value={strengthHealthyQuad}
                      onChange={(event) => setStrengthHealthyQuad(event.target.value)}
                    />
                  </Grid>
                </Grid>

                <Button variant="contained" disabled={!canSubmit || submitting} onClick={handleSubmit}>
                  {submitting ? 'Scoring…' : 'Generate clearance report'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent rehab gates
              </Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                {history.length === 0 && (
                  <Typography color="text.secondary">
                    Submit videos and strength data to unlock clearance reports.
                  </Typography>
                )}
                {history.map((assessment) => (
                  <Card key={assessment.id} variant="outlined">
                    <CardContent>
                      <Stack spacing={1}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {formatDate(assessment.createdAt)} · Limb symmetry{' '}
                          {assessment.limbSymmetryScore.toFixed(0)}%
                        </Typography>
                        <Typography
                          variant="body2"
                          color={assessment.cleared ? 'success.main' : 'error.main'}
                        >
                          {assessment.cleared ? 'Cleared for return' : 'Not cleared'}
                        </Typography>
                        <Typography variant="body2">{assessment.athleteSummary}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Clinician notes: {assessment.clinicianNotes}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};
