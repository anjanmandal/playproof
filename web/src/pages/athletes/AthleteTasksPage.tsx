import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BoltIcon from '@mui/icons-material/Bolt';
import HistoryIcon from '@mui/icons-material/History';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import { useAuth } from '@/hooks/useAuth';
import { acknowledgeRisk, fetchRiskSnapshots, updateRiskAdherence } from '@/api/risk';
import type { RiskSnapshot, ShareScope, CyclePrivacySetting, PhasePolicy } from '@/types';
import {
  fetchCyclePrivacySetting,
  updateCyclePrivacySetting,
  shareCyclePhaseLabel,
} from '@/api/athletes';
import { confidenceBucket, derivePhasePolicy, inferPhase, DEFAULT_CYCLE_SIGNALS } from '@/utils/cycle';

const COMPLETION_THRESHOLD = 0.99;

export const AthleteTasksPage = () => {
  const { user } = useAuth();
  const athleteId = user?.athleteId ?? '';
  const [snapshots, setSnapshots] = useState<RiskSnapshot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadSnapshots = useCallback(async () => {
    if (!athleteId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetchRiskSnapshots(athleteId, 25);
      setSnapshots(response.snapshots);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [athleteId]);

  useEffect(() => {
    void loadSnapshots();
  }, [loadSnapshots]);

  const microPlanSnapshots = useMemo(
    () => snapshots.filter((snapshot) => snapshot.microPlan && snapshot.microPlan.drills?.length),
    [snapshots],
  );

  const activeTasks = useMemo(
    () =>
      microPlanSnapshots.filter(
        (snapshot) =>
          (snapshot.adherence0to1 ?? 0) < COMPLETION_THRESHOLD || !snapshot.recommendationAcknowledged,
      ),
    [microPlanSnapshots],
  );

  const completedTasks = useMemo(
    () =>
      microPlanSnapshots.filter(
        (snapshot) =>
          (snapshot.adherence0to1 ?? 0) >= COMPLETION_THRESHOLD && snapshot.recommendationAcknowledged,
      ),
    [microPlanSnapshots],
  );

  const handleAcknowledge = async (snapshotId: string) => {
    setUpdatingId(snapshotId);
    try {
      await acknowledgeRisk(snapshotId);
      await loadSnapshots();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleComplete = async (snapshotId: string) => {
    setUpdatingId(snapshotId);
    try {
      await updateRiskAdherence(snapshotId, {
        adherence0to1: 1,
        nextRepCheck: { required: true, received: true },
      });
      await loadSnapshots();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!athleteId) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Athlete tasks
          </Typography>
          <Typography color="text.secondary">
            This view is only available for athlete accounts linked to a roster profile.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" fontWeight={700}>
          My micro-plans
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Complete the drills your coach assigned via Team Planner or Daily Risk. Mark each block done after you
          finish it—Movement Coach uses this to tighten tomorrow’s estimate.
        </Typography>
      </Box>

      <CycleDailyCard athleteId={athleteId} />

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading && <LinearProgress />}

      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <BoltIcon color="primary" fontSize="small" />
          <Typography variant="h6">Active tasks ({activeTasks.length})</Typography>
        </Stack>
        {activeTasks.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No open micro-plans right now. Check back after your coach publishes the next Team Planner session.
          </Typography>
        )}
        {activeTasks.map((snapshot) => (
          <Card key={snapshot.id} variant="outlined">
            <CardContent>
              <Stack spacing={1.5}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {snapshot.changeToday}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Risk level {snapshot.riskLevel.toUpperCase()} •{' '}
                      {snapshot.recordedFor
                        ? new Date(snapshot.recordedFor).toLocaleDateString()
                        : new Date(snapshot.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    {!snapshot.recommendationAcknowledged && (
                      <Button
                        variant="outlined"
                        size="small"
                        disabled={updatingId === snapshot.id}
                        onClick={() => handleAcknowledge(snapshot.id)}
                      >
                        Acknowledge
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      size="small"
                      disabled={updatingId === snapshot.id}
                      onClick={() => handleComplete(snapshot.id)}
                    >
                      Mark done
                    </Button>
                  </Stack>
                </Stack>

                {snapshot.microPlan && snapshot.microPlan.drills?.length > 0 && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Drills ({snapshot.microPlan.drills.length})
                    </Typography>
                    <List dense>
                      {snapshot.microPlan.drills.map((drill) => (
                        <ListItem key={`${snapshot.id}-${drill.name}`} sx={{ pl: 0 }}>
                          <ListItemText
                            primary={drill.name}
                            secondary={`${drill.sets} × ${drill.reps} • Rest ${drill.rest_s}s`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
                {snapshot.nextRepCheck && snapshot.nextRepCheck.required && (
                  <Typography variant="caption" color="text.secondary">
                    Next rep check:{' '}
                    {
                      ((snapshot.nextRepCheck as unknown as { focus?: string })?.focus ??
                        'Record a quick clip after practice')
                    }
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Divider />

      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <HistoryIcon color="action" fontSize="small" />
          <Typography variant="h6">Completed ({completedTasks.length})</Typography>
        </Stack>
        {completedTasks.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            Once you finish a micro-plan it will show up here for reference.
          </Typography>
        )}
        {completedTasks.map((snapshot) => (
          <Card key={snapshot.id} variant="outlined" sx={{ opacity: 0.85 }}>
            <CardContent>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between">
                <Box>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {snapshot.changeToday}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Completed on {new Date(snapshot.updatedAt ?? snapshot.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Chip
                  icon={<CheckCircleIcon fontSize="small" />}
                  label="Done"
                  color="success"
                  size="small"
                  variant="outlined"
                />
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
};

const CycleDailyCard = ({ athleteId }: { athleteId: string }) => {
  const navigate = useNavigate();
  const [shareScope, setShareScope] = useState<ShareScope>('off');
  const [setting, setSetting] = useState<CyclePrivacySetting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [shareSyncing, setShareSyncing] = useState(false);
  const [lastSharedKey, setLastSharedKey] = useState<string | null>(null);

  const estimate = useMemo(() => inferPhase(DEFAULT_CYCLE_SIGNALS), []);
  const policy = useMemo(
    () => derivePhasePolicy(estimate, DEFAULT_CYCLE_SIGNALS),
    [estimate],
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchCyclePrivacySetting(athleteId)
      .then((result) => {
        if (!active) return;
        setSetting(result);
        setShareScope(result.shareScope);
        setLastSharedKey(
          result.lastSharedPhase && result.lastSharedConfidence
            ? `${result.lastSharedPhase}-${result.lastSharedConfidence}`
            : null,
        );
        setError(null);
      })
      .catch((err) => {
        console.warn('Failed to load cycle privacy', err);
        if (!active) return;
        setError('Unable to load cycle smart mode status.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [athleteId]);

  useEffect(() => {
    if (shareScope !== 'share_label') return;
    const payload = {
      phase: estimate.phase,
      confidenceBucket: confidenceBucket(estimate.confidence0to1),
    } as const;
    const key = `${payload.phase}-${payload.confidenceBucket}`;
    if (lastSharedKey === key) return;
    let active = true;
    setShareSyncing(true);
    shareCyclePhaseLabel(athleteId, payload)
      .then((result) => {
        if (!active) return;
        setSetting(result);
        setLastSharedKey(key);
        setError(null);
      })
      .catch((err) => {
        console.warn('Failed to share cycle label', err);
        if (!active) return;
        setError('Unable to sync phase label right now.');
      })
      .finally(() => {
        if (active) setShareSyncing(false);
      });
    return () => {
      active = false;
    };
  }, [athleteId, shareScope, estimate.phase, estimate.confidence0to1, lastSharedKey]);

  const handleScopeChange = (_: unknown, value: ShareScope | null) => {
    if (!value || updating || value === shareScope) return;
    const previous = shareScope;
    setShareScope(value);
    setUpdating(true);
    updateCyclePrivacySetting(athleteId, value)
      .then((result) => {
        setSetting(result);
        setError(null);
      })
      .catch((err) => {
        console.warn('Failed to update share scope', err);
        setError('Unable to update cycle smart mode.');
        setShareScope(previous);
      })
      .finally(() => setUpdating(false));
  };

  const nudges: Array<{ label: string; detail: string }> = [
    { label: 'Warmup', detail: `+${policy.warmupExtraMin} min neuromuscular prep` },
    {
      label: 'Cutting volume',
      detail:
        policy.cutDensityDelta < 0
          ? `Reduce by ${Math.abs(Math.round(policy.cutDensityDelta * 100))}%`
          : 'Standard',
    },
    {
      label: 'Landing cues',
      detail: policy.cueVigilance === 'high' ? 'Extra valgus vigilance' : 'Normal emphasis',
    },
  ];

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
            <Stack spacing={0.5}>
              <Typography variant="subtitle1" fontWeight={700}>
                Today’s phase-tuned plan
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Keep it on to auto-adjust warmup & landing cues. Data stays on device unless you choose to share a simple label.
              </Typography>
            </Stack>
            <ToggleButtonGroup
              size="small"
              exclusive
              value={shareScope}
              onChange={handleScopeChange}
              disabled={loading || updating}
            >
              <ToggleButton value="off">
                <LockIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="private">
                <SecurityIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="share_label">
                <LockOpenIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          {error && (
            <Typography variant="caption" color="error">
              {error}
            </Typography>
          )}

          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label={estimate.phase.toUpperCase()} color="primary" />
            <Chip
              label={`Confidence ${Math.round(estimate.confidence0to1 * 100)}%`}
              color={estimate.confidence0to1 >= 0.7 ? 'success' : 'warning'}
              variant="outlined"
            />
            {shareScope === 'share_label' && (
              <Chip
                label={
                  shareSyncing
                    ? 'Syncing label…'
                    : `Shared ${setting?.lastSharedPhase ?? estimate.phase}`
                }
                variant="outlined"
                color="info"
              />
            )}
          </Stack>

          <Stack spacing={1.25}>
            {nudges.map((nudge) => (
              <Stack
                key={nudge.label}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1 }}
              >
                <Typography fontWeight={600}>{nudge.label}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {nudge.detail}
                </Typography>
              </Stack>
            ))}
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">
              Need to tweak inputs or see privacy details? You can manage everything from the Cycle Privacy page.
            </Typography>
            <Button
              size="small"
              variant="outlined"
              endIcon={<NorthEastIcon fontSize="small" />}
              onClick={() => navigate('/athlete/privacy/cycle')}
            >
              Manage
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
