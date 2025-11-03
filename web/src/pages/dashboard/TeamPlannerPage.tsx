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
import EventNoteIcon from '@mui/icons-material/EventNote';
import ScienceIcon from '@mui/icons-material/Science';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { format } from 'date-fns';
import {
  TeamPlannerSimulationInput,
  TeamPlannerSimulationResult,
  TeamPlanRecord,
} from '@/types';
import { simulateTeamPlan, applyTeamPlan, fetchLatestTeamPlan } from '@/api/planner';
import { LoadingScreen } from '@/components/common/LoadingScreen';
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

export const TeamPlannerPage = () => {
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

  const coachTeams = useMemo(() => (user?.role === 'COACH' ? user.teams ?? [] : []), [user]);

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

  const hydrationHint = useMemo(() => {
    if (!hydrationInterval || hydrationInterval <= 0) return 'Use every-15-min cooling interval (policy).';
    const breakCount = Math.floor(sessionLength / hydrationInterval) - 1;
    return breakCount > 0 ? `${breakCount} scheduled breaks at ${hydrationInterval}-min cadence.` : 'Single hydration reminder.';
  }, [sessionLength, hydrationInterval]);

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
                      <Chip label={`Expected team delta −${simulation.totalExpectedDelta.toFixed(2)}`} />
                    </Stack>

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
                              secondary={block.focus}
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
                        {simulation.athletes.map((athlete) => (
                          <Card key={athlete.athleteId} variant="outlined">
                            <CardContent>
                              <Stack spacing={1}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Typography variant="body2" fontWeight={600}>
                                    {athlete.displayName}
                                  </Typography>
                                  <Chip size="small" label={athlete.riskLevel.toUpperCase()} />
                                  {athlete.riskTrend && (
                                    <Chip size="small" variant="outlined" label={`Trend ${athlete.riskTrend}`} />
                                  )}
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
                        ))}
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
