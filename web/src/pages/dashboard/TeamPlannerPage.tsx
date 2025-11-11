import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  LinearProgress,
  Link,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ScienceIcon from '@mui/icons-material/Science';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import VideocamIcon from '@mui/icons-material/Videocam';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import GavelIcon from '@mui/icons-material/Gavel';
import RouteIcon from '@mui/icons-material/Route';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { format } from 'date-fns';
import {
  CoachTriageItem,
  PracticeCompilerPayload,
  TeamPlannerSimulationInput,
  TeamPlannerSimulationResult,
  TeamPlanRecord,
  ShareScope,
  ProgressAction,
} from '@/types';
import {
  simulateTeamPlan,
  applyTeamPlan,
  fetchLatestTeamPlan,
  fetchCoachTriageQueue,
  compilePracticePlan as compilePracticePlanApi,
} from '@/api/planner';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';

const DEFAULT_BLOCKS = [
  { name: 'Warmup', minMinutes: 10, maxMinutes: 15 },
  { name: 'Position Drills', minMinutes: 35, maxMinutes: 45 },
  { name: 'Team Period', minMinutes: 20, maxMinutes: 30 },
];

const TWEAK_OPTIONS: Array<{
  key: string;
  label: string;
  helper: string;
}> = [
  {
    key: 'move_indoor',
    label: 'Move indoor (if available)',
    helper: 'Reduces heat and turf stress; pairs with cooling policy.',
  },
  {
    key: 'reduce_cutting_15',
    label: 'Reduce cutting 15% (skill groups)',
    helper: 'Lower lateral load for RB/WR wings.',
  },
  {
    key: 'add_fifa11',
    label: 'Add neuromuscular warmup (FIFA11+)',
    helper: 'Prime mechanics in the first block.',
  },
];

const constrainValue = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const PHASE_MODE_LABEL: Record<'private' | 'share_label', string> = {
  private: 'Phase-smart (private)',
  share_label: 'Phase-smart (shared)',
};

const TWEAK_DIFF_LOOKUP: Record<string, string> = {
  'Move indoor (if available)': 'Move indoor blocks',
  'Reduce cutting 15% (skill groups)': '−15% cutting in block 1',
  'Add neuromuscular warmup (FIFA11+)': '+ neuromuscular warmup',
};

const describeBlockDiffs = (labels: string[]): string | null => {
  const mapped = labels
    .map((label) => TWEAK_DIFF_LOOKUP[label])
    .filter((item): item is string => Boolean(item));
  if (!mapped.length) return null;
  return mapped.join(' · ');
};

const PROGRESSION_LABELS: Record<ProgressAction, string> = {
  step_up: 'Step-up',
  deload: 'Deload',
  steady: 'Steady',
};

const PROGRESSION_COLORS: Record<ProgressAction, 'success' | 'warning' | 'info'> = {
  step_up: 'success',
  deload: 'warning',
  steady: 'info',
};

const confidenceBucket = (value: number): 'success' | 'info' | 'warning' | 'error' => {
  if (value >= 80) return 'success';
  if (value >= 65) return 'info';
  if (value >= 50) return 'warning';
  return 'error';
};

const confidenceLabelFor = (value: number): string => {
  if (value >= 80) return 'High';
  if (value >= 65) return 'Solid';
  if (value >= 50) return 'Watch';
  return 'Verify';
};

const CONFIDENCE_COLORS: Record<'success' | 'info' | 'warning' | 'error', string> = {
  success: '#22c55e',
  info: '#38bdf8',
  warning: '#f97316',
  error: '#f87171',
};

const HEAT_STATUS_COLOR: Record<'safe' | 'caution' | 'danger', 'success' | 'warning' | 'error'> = {
  safe: 'success',
  caution: 'warning',
  danger: 'error',
};

const formatHeatTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const TRIAGE_SEVERITY_COLOR: Record<CoachTriageItem['severity'], 'error' | 'warning' | 'info'> = {
  high: 'error',
  medium: 'warning',
  low: 'info',
};

const TRIAGE_CATEGORY_LABEL: Record<CoachTriageItem['category'], string> = {
  risk: 'Risk twin',
  rehab: 'Rehab',
  environment: 'Environment',
  adherence: 'Adherence',
};

export const TeamPlannerPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [team, setTeam] = useState('');
  const [sessionLength, setSessionLength] = useState(90);
  const [sessionDate, setSessionDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [blocks, setBlocks] = useState(DEFAULT_BLOCKS);
  const [indoorAvailable, setIndoorAvailable] = useState(true);
  const [temperatureF, setTemperatureF] = useState(92);
  const [humidityPct, setHumidityPct] = useState(70);
  const [hydrationInterval, setHydrationInterval] = useState(15);
  const [selectedTweaks, setSelectedTweaks] = useState<string[]>(TWEAK_OPTIONS.map((option) => option.key));
  const [customTweak, setCustomTweak] = useState('');
  const [loadingSimulation, setLoadingSimulation] = useState(false);
  const [applyingPlan, setApplyingPlan] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [simulation, setSimulation] = useState<TeamPlannerSimulationResult | null>(null);
  const [latestPlan, setLatestPlan] = useState<TeamPlanRecord | null>(null);
  const [loadingLatest, setLoadingLatest] = useState(false);
  const [triageQueue, setTriageQueue] = useState<CoachTriageItem[]>([]);
  const [triageLoading, setTriageLoading] = useState(false);
  const [triageError, setTriageError] = useState<string | null>(null);
  const [triageRefreshedAt, setTriageRefreshedAt] = useState<string | null>(null);
  const [compilerResult, setCompilerResult] = useState<PracticeCompilerPayload | null>(null);
  const [compilerLoading, setCompilerLoading] = useState(false);
  const [compilerError, setCompilerError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const verificationQueue = simulation?.verificationCandidates ?? [];
  const nextVerificationTarget = verificationQueue[0];
  const overallConfidencePct = simulation ? Math.round(simulation.planConfidence * 100) : null;
  const overallConfidenceTone = overallConfidencePct !== null ? confidenceBucket(overallConfidencePct) : null;
  const heatClock = simulation?.heatClock ?? [];
  const fairnessSummary = simulation?.parishFairness;
  const accessRouter = simulation?.accessRouter;

  const coachTeams = useMemo(() => (user?.role === 'COACH' ? user.teams ?? [] : []), [user]);

  const handleQuickClip = useCallback(
    (athleteId: string) => {
      navigate(`/edge-coach?athleteId=${encodeURIComponent(athleteId)}&source=planner`);
    },
    [navigate],
  );

  useEffect(() => {
    if (!team && coachTeams.length > 0) {
      setTeam(coachTeams[0]);
    }
  }, [coachTeams, team]);

  const loadLatestPlan = useCallback(
    async (targetTeam: string) => {
      if (!targetTeam.trim()) {
        setLatestPlan(null);
        return;
      }
      setLoadingLatest(true);
      try {
        const plan = await fetchLatestTeamPlan(targetTeam.trim());
        setLatestPlan(plan);
      } catch {
        setLatestPlan(null);
      } finally {
        setLoadingLatest(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadLatestPlan(team);
  }, [team, loadLatestPlan]);

  const loadTriageQueue = useCallback(
    async (targetTeam: string) => {
      if (!targetTeam.trim()) {
        setTriageQueue([]);
        setTriageRefreshedAt(null);
        return;
      }
      setTriageLoading(true);
      setTriageError(null);
      try {
        const queue = await fetchCoachTriageQueue(targetTeam.trim());
        setTriageQueue(queue.items);
        setTriageRefreshedAt(queue.refreshedAt);
      } catch (err) {
        setTriageQueue([]);
        setTriageError((err as Error).message);
      } finally {
        setTriageLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadTriageQueue(team);
  }, [team, loadTriageQueue]);

  const hydrationHint = useMemo(() => {
    if (!hydrationInterval || hydrationInterval <= 0) return 'Use every-15-min cooling interval (policy).';
    const breakCount = Math.floor(sessionLength / hydrationInterval) - 1;
    return breakCount > 0 ? `${breakCount} scheduled breaks at ${hydrationInterval}-min cadence.` : 'Single hydration reminder.';
  }, [sessionLength, hydrationInterval]);

  const handleCompilePlan = useCallback(async () => {
    if (!team.trim()) {
      setCompilerError('Select a team before compiling.');
      return;
    }
    setCompilerLoading(true);
    setCompilerError(null);
    try {
      const result = await compilePracticePlanApi(team.trim());
      setCompilerResult(result);
    } catch (err) {
      setCompilerError((err as Error).message);
    } finally {
      setCompilerLoading(false);
    }
  }, [team]);

  useEffect(() => {
    setCopied(false);
  }, [compilerResult]);

  const handleCopyScript = useCallback(async () => {
    if (!compilerResult) return;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(compilerResult.script);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        throw new Error('Clipboard unavailable');
      }
    } catch (err) {
      setCompilerError('Unable to copy script right now.');
    }
  }, [compilerResult]);

  const handleBlockChange = (index: number, field: 'minMinutes' | 'maxMinutes', value: number) => {
    setBlocks((prev) => {
      const next = [...prev];
      const updated = { ...next[index], [field]: constrainValue(value, 5, 120) };
      if (field === 'minMinutes' && updated.minMinutes > updated.maxMinutes) {
        updated.maxMinutes = updated.minMinutes;
      }
      if (field === 'maxMinutes' && updated.maxMinutes < updated.minMinutes) {
        updated.minMinutes = updated.maxMinutes;
      }
      next[index] = updated;
      return next;
    });
  };

  const handleToggleTweak = (key: string) => {
    setSelectedTweaks((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
  };

  const formatTeamLabel = useCallback((value: string) =>
    value
      .split(/[-_]/)
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' '),
  []);

  const handleSimulate = async () => {
    if (!team.trim()) {
      setError('Enter a team name before simulating.');
      return;
    }
    setError(null);
    setLoadingSimulation(true);
    setSimulation(null);
    try {
      const payload: TeamPlannerSimulationInput = {
        team: team.trim(),
        sessionLengthMinutes: sessionLength,
        sessionDate: sessionDate ? `${sessionDate}T00:00:00.000Z` : undefined,
        blocks,
        facility: {
          indoorAvailable,
          surfacePreference: indoorAvailable ? 'indoor' : 'turf',
        },
        policy: {
          hydrationIntervalMinutes: hydrationInterval,
          temperatureF,
          humidityPct,
        },
        tweaks: selectedTweaks,
        customTweak: customTweak.trim() || undefined,
      };
      const result = await simulateTeamPlan(payload);
      setSimulation(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoadingSimulation(false);
    }
  };

  const handleApplyPlan = async () => {
    if (!simulation) return;
    setApplyingPlan(true);
    setError(null);
    try {
      await applyTeamPlan({
        simulation,
        selectedTweaks,
      });
      await loadLatestPlan(simulation.team);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setApplyingPlan(false);
    }
  };

  if (loadingSimulation && !simulation) {
    return <LoadingScreen label="Building team planner…" />;
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={700}>
        Team Planner
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Choose practice constraints, explore “what-if” tweaks, then publish a safer plan before practice starts.
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                  <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                    Coach triage queue
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {triageRefreshedAt && (
                      <Typography variant="caption" color="text.secondary">
                        Updated {format(new Date(triageRefreshedAt), 'PPpp')}
                      </Typography>
                    )}
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => loadTriageQueue(team)}
                      disabled={triageLoading || !team.trim()}
                    >
                      Refresh
                    </Button>
                  </Stack>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Low-trust captures, heat overrides, and rehab locks that need coach attention before publishing.
                </Typography>
                {triageError && (
                  <Alert severity="error" onClose={() => setTriageError(null)}>
                    {triageError}
                  </Alert>
                )}
                {triageLoading && <LinearProgress />}
                {!triageLoading && triageQueue.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    All clear — no athletes in the queue.
                  </Typography>
                ) : (
                  <Stack spacing={1.25}>
                    {triageQueue.slice(0, 6).map((item) => (
                      <Card key={item.id} variant="outlined" sx={{ borderColor: (theme) => theme.palette[TRIAGE_SEVERITY_COLOR[item.severity]].main }}>
                        <CardContent sx={{ py: 1.5 }}>
                          <Stack spacing={0.5}>
                            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                              <Typography variant="body2" fontWeight={600}>
                                {item.displayName}
                              </Typography>
                              <Chip size="small" color={TRIAGE_SEVERITY_COLOR[item.severity]} label={item.severity.toUpperCase()} />
                            </Stack>
                            <Typography variant="caption" color="text.secondary">
                              {TRIAGE_CATEGORY_LABEL[item.category]}
                            </Typography>
                            <Typography variant="body2">{item.reason}</Typography>
                            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                              <Typography variant="caption" color="text.secondary">
                                Updated {format(new Date(item.updatedAt), 'PPpp')}
                              </Typography>
                              <Button size="small" variant="outlined" onClick={() => navigate(item.actionUrl)}>
                                {item.actionLabel}
                              </Button>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                  <Typography variant="h6">Practice compiler</Typography>
                  {compilerResult && (
                    <Chip size="small" variant="outlined" label={`Share ${compilerResult.shareCode}`} />
                  )}
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  One-click plan-to-code publisher that turns the latest approved plan into field-ready instructions.
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button
                    variant="contained"
                    onClick={handleCompilePlan}
                    disabled={!team.trim() || compilerLoading}
                    startIcon={<AutoFixHighIcon fontSize="small" />}
                  >
                    {compilerLoading ? 'Compiling…' : 'Compile latest plan'}
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ContentCopyIcon fontSize="small" />}
                    disabled={!compilerResult}
                    onClick={handleCopyScript}
                  >
                    Copy script
                  </Button>
                  {copied && <Chip size="small" color="success" label="Copied" />}
                </Stack>
                {compilerError && (
                  <Alert severity="error" onClose={() => setCompilerError(null)}>
                    {compilerError}
                  </Alert>
                )}
                {compilerLoading && <LinearProgress />}
                {compilerResult && (
                  <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      {compilerResult.summary}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Hydration calls at{' '}
                      {compilerResult.hydrationCalls.length
                        ? compilerResult.hydrationCalls.join(' / ')
                        : 'default'}
                      {' '}minutes.
                    </Typography>
                    <Box
                      component="pre"
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        maxHeight: 220,
                        overflow: 'auto',
                        fontSize: 13,
                        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
                      }}
                    >
                      {compilerResult.script}
                    </Box>
                  </Stack>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Stack spacing={2.5}>
                <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                  <EventNoteIcon fontSize="small" /> Session setup
                </Typography>
                {coachTeams.length > 0 ? (
                  <FormControl fullWidth>
                    <InputLabel id="planner-team-select-label">Team</InputLabel>
                    <Select
                      labelId="planner-team-select-label"
                      label="Team"
                      value={coachTeams.includes(team) ? team : '__custom'}
                      onChange={(event) => {
                        const value = event.target.value;
                        if (value === '__custom') {
                          setTeam('');
                          return;
                        }
                        setTeam(String(value));
                      }}
                    >
                      {coachTeams.map((teamId) => (
                        <MenuItem key={teamId} value={teamId}>
                          {formatTeamLabel(teamId)}
                        </MenuItem>
                      ))}
                      <MenuItem value="__custom">Other team…</MenuItem>
                    </Select>
                  </FormControl>
                ) : (
                  <TextField label="Team" value={team} onChange={(event) => setTeam(event.target.value)} />
                )}
                {coachTeams.length > 0 && !coachTeams.includes(team) && (
                  <TextField
                    label="Custom team"
                    value={team}
                    onChange={(event) => setTeam(event.target.value)}
                    placeholder="Enter team id"
                  />
                )}
                <TextField
                  label="Session date"
                  type="date"
                  value={sessionDate}
                  onChange={(event) => setSessionDate(event.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Session length (minutes)"
                  type="number"
                  value={sessionLength}
                  onChange={(event) => setSessionLength(Number(event.target.value) || 0)}
                />
                <Divider />
                <Typography variant="subtitle1">Block constraints</Typography>
                {blocks.map((block, index) => (
                  <Grid container spacing={1.5} key={block.name}>
                    <Grid item xs={12}>
                      <Typography variant="body2" fontWeight={600}>
                        {block.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Min minutes"
                        type="number"
                        value={block.minMinutes}
                        onChange={(event) =>
                          handleBlockChange(index, 'minMinutes', Number(event.target.value) || 0)
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Max minutes"
                        type="number"
                        value={block.maxMinutes}
                        onChange={(event) =>
                          handleBlockChange(index, 'maxMinutes', Number(event.target.value) || 0)
                        }
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                ))}

                <Divider />
                <Typography variant="subtitle1">Environment & policy</Typography>
                <FormControlLabel
                  control={
                    <Switch checked={indoorAvailable} onChange={(event) => setIndoorAvailable(event.target.checked)} />
                  }
                  label="Indoor facility available"
                />
                <Grid container spacing={1.5}>
                  <Grid item xs={6}>
                    <TextField
                      label="Temperature °F"
                      type="number"
                      value={temperatureF}
                      onChange={(event) => setTemperatureF(Number(event.target.value) || 0)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Humidity %"
                      type="number"
                      value={humidityPct}
                      onChange={(event) => setHumidityPct(Number(event.target.value) || 0)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Hydration interval (minutes)"
                      type="number"
                      value={hydrationInterval}
                      helperText={hydrationHint}
                      onChange={(event) => setHydrationInterval(Number(event.target.value) || 0)}
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <Divider />
                <Typography variant="subtitle1">Candidate tweaks</Typography>
                <Stack spacing={1}>
                  {TWEAK_OPTIONS.map((option) => (
                    <Card
                      key={option.key}
                      variant={selectedTweaks.includes(option.key) ? 'outlined' : 'elevation'}
                      sx={{
                        borderColor: selectedTweaks.includes(option.key) ? 'primary.main' : 'divider',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleToggleTweak(option.key)}
                    >
                      <CardContent sx={{ py: 1.5 }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <CheckCircleIcon
                            color={selectedTweaks.includes(option.key) ? 'primary' : 'disabled'}
                            fontSize="small"
                          />
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {option.label}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {option.helper}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
                <TextField
                  label="Custom tweak"
                  placeholder="e.g. Swap outside-zone cuts → tempo routes"
                  value={customTweak}
                  onChange={(event) => setCustomTweak(event.target.value)}
                  multiline
                  minRows={2}
                />

                <Button
                  variant="contained"
                  onClick={handleSimulate}
                  disabled={loadingSimulation}
                  startIcon={<ScienceIcon />}
                >
                  {loadingSimulation ? 'Simulating…' : 'Simulate plan'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Stack spacing={3}>
            {simulation && (
              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                      <AutoFixHighIcon fontSize="small" /> Simulation results
                    </Typography>

                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Chip label={`Team: ${simulation.team}`} />
                      {simulation.environmentFlags.map((flag) => (
                        <Chip key={flag} color="warning" variant="outlined" label={flag} />
                      ))}
                      {typeof simulation.heatIndex === 'number' && (
                        <Chip label={`Heat index ${simulation.heatIndex.toFixed(1)}°F`} />
                      )}
                    {simulation.capacityCurve && (
                      <>
                        <Chip
                          size="small"
                          label={`Avg capacity ${simulation.capacityCurve.averageCapacity}`}
                            color="info"
                            variant="outlined"
                          />
                          <Chip
                            size="small"
                            label={`Next step ${PROGRESSION_LABELS[simulation.capacityCurve.nextStep]}`}
                            color={PROGRESSION_COLORS[simulation.capacityCurve.nextStep]}
                          />
                        </>
                      )}
                      <Chip label={`Expected team delta −${simulation.totalExpectedDelta.toFixed(2)}`} />
                    </Stack>

                    <Box
                      sx={(theme) => ({
                        borderRadius: 3,
                        p: 2,
                        background:
                          theme.palette.mode === 'light'
                            ? 'linear-gradient(120deg, rgba(59,130,246,0.12), rgba(34,197,94,0.12))'
                            : 'linear-gradient(120deg, rgba(59,130,246,0.18), rgba(34,197,94,0.2))',
                        border: '1px solid',
                        borderColor: alpha(theme.palette.primary.main, 0.15),
                      })}
                    >
                      <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={2}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', md: 'center' }}
                      >
                        <Stack spacing={0.5}>
                          <Typography variant="overline" color="text.secondary">
                            Plan confidence
                          </Typography>
                          <Typography variant="h4" fontWeight={700}>
                            {overallConfidencePct !== null ? `${overallConfidencePct}%` : '—'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {overallConfidencePct !== null
                              ? `${confidenceLabelFor(overallConfidencePct)} certainty across ${simulation.athletes.length} athletes.`
                              : 'Run a simulation to unlock live confidence scoring.'}
                          </Typography>
                        </Stack>
                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          spacing={1}
                          alignItems={{ xs: 'flex-start', sm: 'center' }}
                        >
                          <Chip
                            variant="outlined"
                            color={overallConfidenceTone ?? 'default'}
                            label={
                              overallConfidencePct !== null
                                ? `${confidenceLabelFor(overallConfidencePct)} • ${overallConfidencePct}%`
                                : 'Awaiting data'
                            }
                          />
                          <Button
                            variant="contained"
                            color={verificationQueue.length ? 'warning' : 'success'}
                            startIcon={<VideocamIcon />}
                            disabled={!verificationQueue.length}
                            onClick={() =>
                              nextVerificationTarget && handleQuickClip(nextVerificationTarget.athleteId)
                            }
                          >
                            {verificationQueue.length ? 'Record quick clip' : 'All verified'}
                          </Button>
                          {verificationQueue.length > 0 && (
                            <Typography variant="caption" color="text.secondary">
                              {verificationQueue.length} athlete
                              {verificationQueue.length > 1 ? 's' : ''} need proof captures.
                            </Typography>
                          )}
                        </Stack>
                      </Stack>
                    </Box>

                    {heatClock.length > 0 && (
                      <Card variant="outlined">
                        <CardContent>
                          <Stack spacing={1.5}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <LocalFireDepartmentIcon color="warning" fontSize="small" />
                              <Typography variant="subtitle1" fontWeight={700}>
                                Parish heat-index micro-forecast
                              </Typography>
                            </Stack>
                            <Grid container spacing={1}>
                              {heatClock.map((slot) => (
                                <Grid item xs={12} sm={6} key={slot.time}>
                                  <Card
                                    variant="outlined"
                                    sx={{
                                      borderColor: (theme) => theme.palette[HEAT_STATUS_COLOR[slot.status]].main,
                                    }}
                                  >
                                    <CardContent sx={{ py: 1.5 }}>
                                      <Stack spacing={0.25}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                          <Typography variant="body2" fontWeight={600}>
                                            {formatHeatTime(slot.time)}
                                          </Typography>
                                          <Chip
                                            size="small"
                                            color={HEAT_STATUS_COLOR[slot.status]}
                                            label={slot.status.toUpperCase()}
                                          />
                                        </Stack>
                                        <Typography variant="caption" color="text.secondary">
                                          Heat index {slot.heatIndex.toFixed(1)}°F
                                        </Typography>
                                        <Typography variant="caption">{slot.recommendation}</Typography>
                                      </Stack>
                                    </CardContent>
                                  </Card>
                                </Grid>
                              ))}
                            </Grid>
                          </Stack>
                        </CardContent>
                      </Card>
                    )}

                    {fairnessSummary && (
                      <Card variant="outlined">
                        <CardContent>
                          <Stack spacing={1.5}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <GavelIcon color={fairnessSummary.needsIntervention ? 'warning' : 'success'} fontSize="small" />
                              <Typography variant="subtitle1" fontWeight={700}>
                                Parish fairness guard
                              </Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                              Monitoring plan confidence vs. roster sub-groups to keep workloads fair.
                            </Typography>
                            <Grid container spacing={1}>
                              {fairnessSummary.groups.map((group) => (
                                <Grid item xs={12} sm={6} key={group.label}>
                                  <Card variant="outlined">
                                    <CardContent sx={{ py: 1.5 }}>
                                      <Stack spacing={0.5}>
                                        <Typography variant="caption" color="text.secondary">
                                          {group.label}
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600}>
                                          {(group.planConfidence * 100).toFixed(0)}% confidence
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          n={group.sampleSize}
                                        </Typography>
                                      </Stack>
                                    </CardContent>
                                  </Card>
                                </Grid>
                              ))}
                            </Grid>
                            {fairnessSummary.alerts.length > 0 ? (
                              <Stack spacing={0.5}>
                                {fairnessSummary.alerts.map((alert) => (
                                  <Stack direction="row" spacing={1} key={alert} alignItems="center">
                                    <WarningAmberIcon color="warning" fontSize="small" />
                                    <Typography variant="caption">{alert}</Typography>
                                  </Stack>
                                ))}
                              </Stack>
                            ) : (
                              <Chip size="small" color="success" variant="outlined" label="No fairness gaps detected" />
                            )}
                          </Stack>
                        </CardContent>
                      </Card>
                    )}

                    {accessRouter && (
                      <Card variant="outlined">
                        <CardContent>
                          <Stack spacing={1.5}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <RouteIcon color={accessRouter.flaggedAthletes.length ? 'warning' : 'success'} fontSize="small" />
                              <Typography variant="subtitle1" fontWeight={700}>
                                Rural access router
                              </Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                              {accessRouter.nextSteps}
                            </Typography>
                            {accessRouter.transportDifficulty && (
                              <Chip size="small" color="warning" variant="outlined" label={accessRouter.transportDifficulty} />
                            )}
                            {accessRouter.flaggedAthletes.length === 0 ? (
                              <Typography variant="caption" color="text.secondary">
                                No tele-routing required today.
                              </Typography>
                            ) : (
                              <List dense>
                                {accessRouter.flaggedAthletes.map((athlete) => (
                                  <ListItem key={athlete.athleteId}>
                                    <ListItemText
                                      primary={athlete.displayName}
                                      secondary={`${athlete.reason} · ${athlete.recommendedAction}`}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            )}
                          </Stack>
                        </CardContent>
                      </Card>
                    )}

                    <Box>
                      <Typography variant="subtitle1">Ranked tweaks</Typography>
                      <List dense>
                        {simulation.rankedTweaks.map((tweak) => (
                          <ListItem key={tweak.key} alignItems="flex-start">
                            <ListItemText
                              primary={`${tweak.label} · Δ ${tweak.expectedDelta.toFixed(2)}`}
                              secondary={tweak.rationale}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>

                    <Box>
                      <Typography variant="subtitle1">Compiled session</Typography>
                      <List dense>
                        {simulation.compiledSession.blocks.map((block, index) => (
                          <ListItem key={`${block.name}-${index}`}>
                            <ListItemText
                              primary={`${block.name} · ${block.minutes} min · ${block.location}`}
                              secondary={
                                <Stack spacing={0.25}>
                                  <Typography variant="body2" color="text.secondary">
                                    {block.focus}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Difficulty {block.difficultyIndex ?? '--'}
                                  </Typography>
                                </Stack>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                      <Typography variant="caption" color="text.secondary">
                        Hydration at {simulation.compiledSession.hydrationSchedule.join(' / ')} minutes.
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle1">Athlete focus</Typography>
                      <Stack spacing={1.5}>
                        {simulation.athletes.map((athlete) => {
                          const planConfidencePct = Math.round(athlete.planConfidence * 100);
                          const bucket = confidenceBucket(planConfidencePct);
                          const tone = CONFIDENCE_COLORS[bucket];
                          const blockDiff = describeBlockDiffs(athlete.recommendedTweaks);

                          return (
                            <Card key={athlete.athleteId} variant="outlined">
                              <CardContent>
                                <Stack spacing={1}>
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    flexWrap="wrap"
                                    useFlexGap
                                    sx={{ rowGap: 1 }}
                                  >
                                    <Typography variant="body2" fontWeight={600}>
                                      {athlete.displayName}
                                    </Typography>
                                    <Chip size="small" label={athlete.riskLevel.toUpperCase()} />
                                    {athlete.riskTrend && (
                                      <Chip size="small" variant="outlined" label={`Trend ${athlete.riskTrend}`} />
                                    )}
                                    {athlete.phaseSmart && (
                                      <Tooltip
                                        title={
                                          athlete.phaseSmart.mode === 'share_label'
                                            ? 'Athlete shared a sanitized phase label.'
                                            : 'Phase-smart mode active privately.'
                                        }
                                      >
                                        <Chip
                                          size="small"
                                          color={athlete.phaseSmart.mode === 'share_label' ? 'info' : 'default'}
                                          variant={athlete.phaseSmart.mode === 'share_label' ? 'filled' : 'outlined'}
                                          icon={
                                            athlete.phaseSmart.mode === 'share_label' ? (
                                              <LockOpenIcon fontSize="small" />
                                            ) : (
                                              <LockIcon fontSize="small" />
                                            )
                                          }
                                          label={
                                            athlete.phaseSmart.mode === 'share_label'
                                              ? `${PHASE_MODE_LABEL[athlete.phaseSmart.mode]}${
                                                  athlete.phaseSmart.label ? ` · ${athlete.phaseSmart.label}` : ''
                                                }`
                                              : PHASE_MODE_LABEL[athlete.phaseSmart.mode]
                                          }
                                        />
                                      </Tooltip>
                                    )}
                                    <Tooltip title={`Consecutive A grades: ${athlete.progression.consecutiveAGrades}`}>
                                      <Chip
                                        size="small"
                                        label={`Cap ${athlete.progression.capacityIndex} · ${PROGRESSION_LABELS[
                                          athlete.progression.action
                                        ]}`}
                                        color={PROGRESSION_COLORS[athlete.progression.action]}
                                        variant={athlete.progression.action === 'steady' ? 'outlined' : 'filled'}
                                      />
                                    </Tooltip>
                                  </Stack>

                                  <Stack spacing={0.75}>
                                    <Stack
                                      direction={{ xs: 'column', sm: 'row' }}
                                      spacing={1}
                                      alignItems={{ xs: 'flex-start', sm: 'center' }}
                                      justifyContent="space-between"
                                    >
                                      <Chip
                                        size="small"
                                        variant="outlined"
                                        color={bucket}
                                        label={`Plan confidence ${planConfidencePct}%`}
                                      />
                                      {athlete.needsVerification && (
                                        <Button
                                          size="small"
                                          variant="contained"
                                          color="warning"
                                          startIcon={<VideocamIcon fontSize="small" />}
                                          onClick={() => handleQuickClip(athlete.athleteId)}
                                        >
                                          Record quick clip
                                        </Button>
                                      )}
                                    </Stack>
                                    <LinearProgress
                                      variant="determinate"
                                      value={planConfidencePct}
                                      sx={{
                                        height: 6,
                                        borderRadius: 3,
                                        backgroundColor: alpha(tone, 0.2),
                                        '& .MuiLinearProgress-bar': {
                                          borderRadius: 3,
                                          backgroundColor: tone,
                                        },
                                      }}
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                      {athlete.needsVerification
                                        ? 'Low certainty — capture a 3s landing clip to unlock badge.'
                                        : 'Confidence within target range.'}
                                    </Typography>
                                  </Stack>

                                  <Typography variant="body2" color="text.secondary">
                                    Expected Δ {athlete.expectedDelta.toFixed(2)} ·{' '}
                                    {athlete.recommendedTweaks.length > 0
                                      ? athlete.recommendedTweaks.join(', ')
                                      : 'Monitor only'}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Substitution: {athlete.substitutions[0].from} → {athlete.substitutions[0].to} (
                                    {athlete.substitutions[0].minutes} min)
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    Capacity updated{' '}
                                    {athlete.progression.lastProgressionAt
                                      ? format(new Date(athlete.progression.lastProgressionAt), 'PPpp')
                                      : 'pending'}
                                  </Typography>
                                  {blockDiff && (
                                    <Typography variant="caption" color="text.secondary">
                                      Block diff: {blockDiff}
                                    </Typography>
                                  )}
                                  {athlete.microPlan && (
                                    <Box>
                                      <Typography variant="caption" color="text.secondary">
                                        Micro-plan drills:
                                      </Typography>
                                      <List dense sx={{ pl: 2 }}>
                                        {athlete.microPlan.drills.map((drill) => (
                                          <ListItem key={drill.name}>
                                            <ListItemText
                                              primary={drill.name}
                                              secondary={`${drill.sets} × ${drill.reps} · Rest ${drill.rest_s}s`}
                                            />
                                          </ListItem>
                                        ))}
                                      </List>
                                    </Box>
                                  )}
                                </Stack>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </Stack>
                    </Box>

                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleApplyPlan}
                        disabled={applyingPlan}
                      >
                        {applyingPlan ? 'Publishing…' : 'Apply plan'}
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6">Latest published plan</Typography>
                  {loadingLatest && <LinearProgress />}
                  {!loadingLatest && !latestPlan && (
                    <Typography variant="body2" color="text.secondary">
                      No plan published yet for this team.
                    </Typography>
                  )}
                  {latestPlan && (
                    <Stack spacing={1.5}>
                      <Typography variant="body2">
                        Published {format(new Date(latestPlan.createdAt), 'PPpp')}
                      </Typography>
                      <Typography variant="body2">
                        Session length {latestPlan.sessionLengthMinutes} min · Tweaks:{' '}
                        {latestPlan.selectedTweaks.length > 0
                          ? latestPlan.selectedTweaks.join(', ')
                          : 'none'}
                      </Typography>
                      <List dense>
                        {latestPlan.compiledPlan.blocks.map((block, index) => (
                          <ListItem key={`${latestPlan.id}-${index}`}>
                            <ListItemText
                              primary={`${block.name} · ${block.minutes} min (${block.location})`}
                              secondary={block.focus}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Stack>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <Box>
        <Typography variant="body2" color="text.secondary">
          Need other default tweaks or drill swaps?{' '}
          <Link href="mailto:support@causalkam.co">Let us know.</Link>
        </Typography>
      </Box>
    </Stack>
  );
};
