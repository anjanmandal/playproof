import { useCallback, useEffect, useMemo, useState, type ReactElement } from 'react';
import {
  Avatar,
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
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningTwoToneIcon from '@mui/icons-material/WarningTwoTone';
import DangerousIcon from '@mui/icons-material/Dangerous';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link as RouterLink } from 'react-router-dom';
import {
  submitDailyRisk,
  fetchRiskSnapshots,
  fetchTeamRiskSnapshots,
  acknowledgeRisk,
  updateRiskAdherence,
} from '@/api/risk';
import type { DailyRiskInput, DailyRiskResponse, RiskSnapshot, RiskTrend, TeamRiskSnapshot } from '@/types';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { formatDateTime } from '@/utils/date';
import { useAuth } from '@/hooks/useAuth';

const SURFACES: DailyRiskInput['surface'][] = ['turf', 'grass', 'wet_grass', 'indoor', 'court'];

const RISK_META: Record<RiskSnapshot['riskLevel'], { label: string; icon: ReactElement; color: string }> = {
  green: { label: 'Green', icon: <CheckCircleIcon color="success" />, color: 'success.main' },
  yellow: { label: 'Yellow', icon: <WarningTwoToneIcon color="warning" />, color: 'warning.main' },
  red: { label: 'Red', icon: <DangerousIcon color="error" />, color: 'error.main' },
};

const RISK_TREND_META: Record<RiskTrend, { label: string; icon: ReactElement; chipColor: 'success' | 'default' | 'error' }> =
  {
    up: { label: 'Trending up', icon: <ArrowUpwardIcon fontSize="inherit" />, chipColor: 'error' },
    flat: { label: 'Stable', icon: <ArrowForwardIcon fontSize="inherit" />, chipColor: 'default' },
    down: { label: 'Trending down', icon: <ArrowDownwardIcon fontSize="inherit" />, chipColor: 'success' },
  };

const ENVIRONMENT_FLAG_LABELS: Record<string, string> = {
  cooling_breaks_15m: 'Cooling breaks every 15 min',
  'reduce_cutting_20%': 'Reduce cutting volume 20%',
};

const UNCERTAINTY_THRESHOLD = 0.35;

const toConfidencePercent = (uncertainty?: number | null): number | null => {
  if (typeof uncertainty !== 'number' || Number.isNaN(uncertainty)) return null;
  const clamped = Math.min(Math.max(uncertainty, 0), 1);
  return Math.round((1 - clamped) * 100);
};

const riskValue = (riskLevel: RiskSnapshot['riskLevel']) => {
  switch (riskLevel) {
    case 'red':
      return 3;
    case 'yellow':
      return 2;
    default:
      return 1;
  }
};

const confidenceCategory = (uncertainty?: number | null): 'high' | 'medium' | 'low' => {
  if (typeof uncertainty !== 'number' || Number.isNaN(uncertainty)) return 'high';
  if (uncertainty <= 0.2) return 'high';
  if (uncertainty <= 0.5) return 'medium';
  return 'low';
};

const confidenceColor = (category: 'high' | 'medium' | 'low') => {
  if (category === 'high') return 'success';
  if (category === 'medium') return 'warning';
  return 'error';
};

const sortTrendValue = (trend?: RiskTrend | null) => {
  if (!trend) return 1;
  if (trend === 'up') return 3;
  if (trend === 'flat') return 2;
  return 1;
};

const getTopDriverEntries = (snapshot: RiskSnapshot, limit = 2) => {
  const scoreEntries = snapshot.driverScores
    ? Object.entries(snapshot.driverScores as Record<string, number>)
        .filter(([, value]) => typeof value === 'number')
        .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
    : [];

  if (scoreEntries.length > 0) {
    return scoreEntries.slice(0, limit);
  }

  const drivers = snapshot.drivers ?? [];
  return drivers.slice(0, limit).map((label) => [label, 0.5] as [string, number]);
};

export const RiskPage = () => {
  const { user } = useAuth();
  const athleteIdFromProfile = user?.athleteId ?? '';
  const [athleteId, setAthleteId] = useState('');
  const [form, setForm] = useState<DailyRiskInput>({
    athleteId: '',
    exposureMinutes: 45,
    surface: 'turf',
    temperatureF: 92,
    humidityPct: 65,
    priorLowerExtremityInjury: false,
    sorenessLevel: 1,
    fatigueLevel: 1,
  });
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState<RiskSnapshot[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<DailyRiskResponse | null>(null);
  const [autoWeatherLoading, setAutoWeatherLoading] = useState(false);
  const [autoWeatherError, setAutoWeatherError] = useState<string | null>(null);
  const [autoWeatherTimestamp, setAutoWeatherTimestamp] = useState<string | null>(null);
  const [adherenceUpdatingId, setAdherenceUpdatingId] = useState<string | null>(null);
  const [teamId, setTeamId] = useState('');
  const [teamDate, setTeamDate] = useState('');
  const [teamSnapshots, setTeamSnapshots] = useState<TeamRiskSnapshot[]>([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'red' | 'yellow' | 'green'>('all');
  const [trendFilter, setTrendFilter] = useState<'all' | 'up' | 'flat' | 'down'>('all');
  const [confidenceFilter, setConfidenceFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [sortKey, setSortKey] = useState<'risk' | 'confidence' | 'trend'>('risk');

  const canSubmit = useMemo(() => form.athleteId.trim().length > 0, [form.athleteId]);

  const coachTeams = useMemo(() => (user?.role === 'COACH' ? user.teams ?? [] : []), [user]);

  const loadHistory = useCallback(async () => {
    if (!athleteId.trim()) {
      setHistory([]);
      return;
    }
    try {
      const response = await fetchRiskSnapshots(athleteId.trim(), 15);
      setHistory(response.snapshots);
    } catch (err) {
      console.warn('Failed to load risk snapshots', err);
    }
  }, [athleteId]);

  useEffect(() => {
    if (!teamId && coachTeams.length > 0) {
      setTeamId(coachTeams[0]);
    }
  }, [coachTeams, teamId]);

  const loadTeamRoster = useCallback(async () => {
    if (!teamId.trim()) {
      setTeamSnapshots([]);
      return;
    }
    setTeamLoading(true);
    try {
      const data = await fetchTeamRiskSnapshots(
        teamId.trim(),
        teamDate ? `${teamDate}T00:00:00.000Z` : undefined,
      );
      setTeamSnapshots(data);
    } catch (err) {
      console.warn('Failed to load team risk snapshots', err);
      setTeamSnapshots([]);
    } finally {
      setTeamLoading(false);
    }
  }, [teamId, teamDate]);

  useEffect(() => {
    if (!athleteId && athleteIdFromProfile) {
      setAthleteId(athleteIdFromProfile);
    }
    setForm((prev) => ({ ...prev, athleteId }));
    if (athleteId.trim()) {
      loadHistory();
    }
  }, [athleteId, athleteIdFromProfile, loadHistory]);

  useEffect(() => {
    loadTeamRoster();
  }, [loadTeamRoster]);

  const rosterEntries = useMemo(
    () =>
      teamSnapshots.map((snapshot) => {
        const confidence = confidenceCategory(snapshot.uncertainty0to1);
        return {
          snapshot,
          confidence,
          riskScore: riskValue(snapshot.riskLevel),
          trendScore: sortTrendValue(snapshot.riskTrend),
        };
      }),
    [teamSnapshots],
  );

  const filteredRoster = useMemo(
    () =>
      rosterEntries
        .filter(({ snapshot, confidence }) => {
          if (riskFilter !== 'all' && snapshot.riskLevel !== riskFilter) return false;
          if (trendFilter !== 'all' && snapshot.riskTrend !== trendFilter) return false;
          if (confidenceFilter !== 'all' && confidence !== confidenceFilter) return false;
          if (searchTerm.trim()) {
            const term = searchTerm.trim().toLowerCase();
            const name = snapshot.athlete?.displayName?.toLowerCase() ?? '';
            const position = snapshot.athlete?.position?.toLowerCase() ?? '';
            if (!name.includes(term) && !position.includes(term)) return false;
          }
          return true;
        })
        .sort((a, b) => {
          if (sortKey === 'risk') return b.riskScore - a.riskScore;
          if (sortKey === 'confidence') {
            const order: Record<'low' | 'medium' | 'high', number> = { low: 2, medium: 1, high: 0 };
            return order[b.confidence] - order[a.confidence];
          }
          return b.trendScore - a.trendScore;
        }),
    [rosterEntries, riskFilter, trendFilter, confidenceFilter, searchTerm, sortKey],
  );

  const highUncertaintyEntry = useMemo(
    () =>
      filteredRoster.find(({ snapshot }) =>
        typeof snapshot.uncertainty0to1 === 'number'
          ? snapshot.uncertainty0to1 >= UNCERTAINTY_THRESHOLD
          : false,
      ),
    [filteredRoster],
  );

  const updateForm = <K extends keyof DailyRiskInput>(key: K, value: DailyRiskInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      setError('Provide an athlete ID to generate risk insights.');
      return;
    }
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await submitDailyRisk({
        ...form,
        exposureMinutes: Number(form.exposureMinutes),
        temperatureF: Number(form.temperatureF),
        humidityPct: Number(form.humidityPct),
      });
      setSuccess(response);
      await loadHistory();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcknowledge = async (snapshot: RiskSnapshot) => {
    if (snapshot.recommendationAcknowledged) return;
    try {
      await acknowledgeRisk(snapshot.id);
      await loadHistory();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleAdherenceToggle = async (snapshot: RiskSnapshot, checked: boolean) => {
    try {
      setAdherenceUpdatingId(snapshot.id);
      await updateRiskAdherence(snapshot.id, {
        adherence0to1: checked ? 1 : 0,
        nextRepCheck: snapshot.nextRepCheck
          ? { ...snapshot.nextRepCheck, received: checked }
          : { required: true, received: checked },
      });
      setTeamSnapshots((prev) =>
        prev.map((item) =>
          item.id === snapshot.id
            ? {
                ...item,
                adherence0to1: checked ? 1 : 0,
                nextRepCheck: snapshot.nextRepCheck
                  ? { ...snapshot.nextRepCheck, received: checked }
                  : { required: true, received: checked },
              }
            : item,
        ),
      );
      await loadHistory();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setAdherenceUpdatingId(null);
    }
  };

  const fetchEnvironmentSnapshot = useCallback(() => {
    if (autoWeatherLoading) return;
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setAutoWeatherError('Geolocation is not supported in this browser.');
      return;
    }

    setAutoWeatherLoading(true);
    setAutoWeatherError(null);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,relative_humidity_2m&temperature_unit=fahrenheit`;
          const response = await fetch(url);
          if (!response.ok) throw new Error('Weather service unavailable');
          const data = await response.json();
          const temp = data?.current?.temperature_2m;
          const humidity = data?.current?.relative_humidity_2m;

          setForm((prev) => ({
            ...prev,
            temperatureF: typeof temp === 'number' ? Math.round(temp) : prev.temperatureF,
            humidityPct: typeof humidity === 'number' ? Math.round(humidity) : prev.humidityPct,
          }));

          const timestamp = new Date().toISOString();
          setAutoWeatherTimestamp(timestamp);
        } catch (err) {
          setAutoWeatherError((err as Error).message ?? 'Unable to fetch weather');
        } finally {
          setAutoWeatherLoading(false);
        }
      },
      (error) => {
        setAutoWeatherLoading(false);
        setAutoWeatherError(error.message);
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }, [autoWeatherLoading]);

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Daily ACL Risk Twin
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Blend load, context, and AI heuristics to surface the single best change you can make
          today.
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Stack spacing={2.5}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'flex-end' }}>
              {coachTeams.length > 0 ? (
                <FormControl size="small" sx={{ minWidth: 220 }}>
                  <InputLabel id="team-select-label">Team</InputLabel>
                  <Select
                    labelId="team-select-label"
                    label="Team"
                    value={coachTeams.includes(teamId) ? teamId : '__custom'}
                    onChange={(event) => {
                      const value = event.target.value;
                      if (value === '__custom') {
                        if (!coachTeams.includes(teamId)) {
                          setTeamId('');
                        }
                      } else {
                        setTeamId(String(value));
                      }
                    }}
                  >
                    {coachTeams.map((team) => (
                      <MenuItem key={team} value={team}>
                        {team}
                      </MenuItem>
                    ))}
                    <MenuItem value="__custom">Other…</MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  label="Team"
                  value={teamId}
                  onChange={(event) => setTeamId(event.target.value)}
                  sx={{ minWidth: 200 }}
                />
              )}
              {coachTeams.length > 0 && !coachTeams.includes(teamId) && (
                <TextField
                  label="Custom team"
                  placeholder="Enter team id"
                  value={teamId}
                  onChange={(event) => setTeamId(event.target.value)}
                  sx={{ minWidth: 200 }}
                />
              )}
              <TextField
                label="Date"
                type="date"
                value={teamDate}
                onChange={(event) => setTeamDate(event.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Search roster"
                placeholder="Name or position"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                sx={{ minWidth: 200 }}
              />
              <Button variant="outlined" onClick={loadTeamRoster} disabled={teamLoading}>
                {teamLoading ? 'Refreshing…' : 'Load roster'}
              </Button>
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
              <ToggleButtonGroup
                value={riskFilter}
                exclusive
                onChange={(_, value) => value && setRiskFilter(value)}
                size="small"
              >
                <ToggleButton value="all">All risks</ToggleButton>
                <ToggleButton value="red">High</ToggleButton>
                <ToggleButton value="yellow">Mod</ToggleButton>
                <ToggleButton value="green">Low</ToggleButton>
              </ToggleButtonGroup>
              <ToggleButtonGroup
                value={trendFilter}
                exclusive
                onChange={(_, value) => value && setTrendFilter(value)}
                size="small"
              >
                <ToggleButton value="all">All trends</ToggleButton>
                <ToggleButton value="up">↑</ToggleButton>
                <ToggleButton value="flat">→</ToggleButton>
                <ToggleButton value="down">↓</ToggleButton>
              </ToggleButtonGroup>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel id="confidence-filter-label">Confidence</InputLabel>
                <Select
                  labelId="confidence-filter-label"
                  label="Confidence"
                  value={confidenceFilter}
                  onChange={(event) => setConfidenceFilter(event.target.value as typeof confidenceFilter)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel id="sort-filter-label">Sort by</InputLabel>
                <Select
                  labelId="sort-filter-label"
                  label="Sort by"
                  value={sortKey}
                  onChange={(event) => setSortKey(event.target.value as typeof sortKey)}
                >
                  <MenuItem value="risk">Risk level</MenuItem>
                  <MenuItem value="confidence">Confidence</MenuItem>
                  <MenuItem value="trend">Trend</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            {teamLoading && <LinearProgress />}

            {highUncertaintyEntry && (
              <Alert severity="warning">
                {`Low confidence on ${highUncertaintyEntry.snapshot.athlete?.displayName ?? highUncertaintyEntry.snapshot.athleteId}. `}
                <Link component={RouterLink} to="/movement" underline="hover">
                  Capture a quick clip
                </Link>{' '}
                to tighten tomorrow’s estimate.
              </Alert>
            )}

            <Stack spacing={1.5}>
              {filteredRoster.length === 0 && !teamLoading && (
                <Typography variant="body2" color="text.secondary">
                  {teamId.trim()
                    ? 'No roster snapshots matched the current filters.'
                    : 'Enter a team to view today’s roster risk snapshot.'}
                </Typography>
              )}

              {filteredRoster.map(({ snapshot, confidence }) => {
                const displayName = snapshot.athlete?.displayName ?? snapshot.athleteId;
                const initials = displayName
                  .split(' ')
                  .map((part) => part[0])
                  .join('')
                  .toUpperCase();
                const driverEntries = getTopDriverEntries(snapshot, 3);
                const confidenceLabel = confidence.charAt(0).toUpperCase() + confidence.slice(1);

                return (
                  <Card key={snapshot.id} variant="outlined" sx={{ borderRadius: 2.5 }}>
                    <CardContent>
                      <Stack spacing={1.5}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar>{initials}</Avatar>
                            <Box>
                              <Typography variant="body1" fontWeight={600}>
                                {displayName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {snapshot.athlete?.position ?? '—'}
                              </Typography>
                            </Box>
                          </Stack>
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            <Chip size="small" color={snapshot.riskLevel === 'green' ? 'success' : snapshot.riskLevel === 'yellow' ? 'warning' : 'error'} variant="outlined" label={RISK_META[snapshot.riskLevel].label} />
                            {snapshot.riskTrend && (
                              <Chip
                                size="small"
                                variant="outlined"
                                color={RISK_TREND_META[snapshot.riskTrend].chipColor}
                                icon={RISK_TREND_META[snapshot.riskTrend].icon}
                                label={RISK_TREND_META[snapshot.riskTrend].label}
                              />
                            )}
                            <Chip
                              size="small"
                              color={confidenceColor(confidence)}
                              variant="outlined"
                              label={`${confidenceLabel} confidence`}
                            />
                            {typeof snapshot.uncertainty0to1 === 'number' && (
                              <Chip size="small" variant="outlined" label={`± ${snapshot.uncertainty0to1.toFixed(2)}`} />
                            )}
                          </Stack>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 'auto' }}>
                            <Typography variant="caption" color="text.secondary">
                              Done
                            </Typography>
                            <Switch
                              checked={(snapshot.adherence0to1 ?? 0) >= 0.99}
                              onChange={(event) => handleAdherenceToggle(snapshot, event.target.checked)}
                              size="small"
                              disabled={adherenceUpdatingId === snapshot.id}
                            />
                          </Stack>
                        </Stack>

                        <Typography variant="body2" color="text.secondary">
                          {snapshot.changeToday}
                        </Typography>

                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {driverEntries.map(([driver, score]) => (
                            <Box
                              key={`${snapshot.id}-${driver}`}
                              sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, px: 1.5, py: 0.75, minWidth: 160 }}
                            >
                              <Typography variant="caption" fontWeight={600}>
                                {driver.replace(/_/g, ' ')}
                              </Typography>
                              <Box sx={{ mt: 0.5, height: 6, borderRadius: 3, backgroundColor: 'action.hover', overflow: 'hidden' }}>
                                <Box
                                  sx={{
                                    width: `${Math.min(Math.max(score, 0) * 100, 100)}%`,
                                    height: '100%',
                                    backgroundColor: 'primary.main',
                                  }}
                                />
                              </Box>
                            </Box>
                          ))}
                        </Stack>

                        {snapshot.environmentPolicyFlags && snapshot.environmentPolicyFlags.length > 0 && (
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            {snapshot.environmentPolicyFlags.map((flag) => (
                              <Chip
                                key={`${snapshot.id}-${flag}`}
                                size="small"
                                color="warning"
                                variant="outlined"
                                label={ENVIRONMENT_FLAG_LABELS[flag] ?? flag}
                              />
                            ))}
                          </Stack>
                        )}

                        {snapshot.microPlan && snapshot.microPlan.drills?.length > 0 && (
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Micro-plan drills:
                            </Typography>
                            <List dense sx={{ pl: 2 }}>
                              {snapshot.microPlan.drills.map((drill) => (
                                <ListItem key={`${snapshot.id}-${drill.name}`}>
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
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today&apos;s inputs
              </Typography>

              <ErrorAlert message={error} />

              <Stack spacing={3}>
                <TextField
                  label="Athlete ID"
                  value={athleteId}
                  onChange={(event) => setAthleteId(event.target.value)}
                  required
                />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Exposure minutes (yesterday)"
                      type="number"
                      value={form.exposureMinutes}
                      onChange={(event) => updateForm('exposureMinutes', Number(event.target.value))}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Surface"
                      select
                      value={form.surface}
                      onChange={(event) => updateForm('surface', event.target.value as DailyRiskInput['surface'])}
                    >
                      {SURFACES.map((surface) => (
                        <MenuItem key={surface} value={surface}>
                          {surface.replace('_', ' ')}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Temperature °F"
                      type="number"
                      value={form.temperatureF}
                      onChange={(event) => updateForm('temperatureF', Number(event.target.value))}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Humidity %"
                      type="number"
                      value={form.humidityPct}
                      onChange={(event) => updateForm('humidityPct', Number(event.target.value))}
                    />
                  </Grid>
                </Grid>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
                  <Button
                    variant="outlined"
                    startIcon={<MyLocationIcon />}
                    onClick={fetchEnvironmentSnapshot}
                    disabled={autoWeatherLoading}
                  >
                    {autoWeatherLoading ? 'Fetching weather…' : 'Auto-fill weather'}
                  </Button>
                  {autoWeatherTimestamp && (
                    <Chip
                      label={`Updated ${formatDateTime(autoWeatherTimestamp)}`}
                      variant="outlined"
                      size="small"
                    />
                  )}
                </Stack>
                {autoWeatherLoading && <LinearProgress sx={{ width: { xs: '100%', sm: 220 } }} />}
                {autoWeatherError && (
                  <Typography variant="caption" color="error">
                    {autoWeatherError}
                  </Typography>
                )}

                <ToggleButtonGroup
                  exclusive
                  color="primary"
                  value={form.priorLowerExtremityInjury ? 'yes' : 'no'}
                  onChange={(_event, value) => {
                    if (!value) return;
                    updateForm('priorLowerExtremityInjury', value === 'yes');
                  }}
                >
                  <ToggleButton value="yes">Prior knee/ankle injury</ToggleButton>
                  <ToggleButton value="no">No prior injury</ToggleButton>
                </ToggleButtonGroup>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Soreness (0-3)"
                      type="number"
                      inputProps={{ min: 0, max: 3 }}
                      value={form.sorenessLevel}
                      onChange={(event) =>
                        updateForm('sorenessLevel', Number(event.target.value) as DailyRiskInput['sorenessLevel'])
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Fatigue (0-3)"
                      type="number"
                      inputProps={{ min: 0, max: 3 }}
                      value={form.fatigueLevel}
                      onChange={(event) =>
                        updateForm('fatigueLevel', Number(event.target.value) as DailyRiskInput['fatigueLevel'])
                      }
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Body weight trend"
                      select
                      value={form.bodyWeightTrend ?? ''}
                      onChange={(event) =>
                        updateForm('bodyWeightTrend', (event.target.value || undefined) as DailyRiskInput['bodyWeightTrend'])
                      }
                    >
                      <MenuItem value="">No change</MenuItem>
                      <MenuItem value="up">Up</MenuItem>
                      <MenuItem value="down">Down</MenuItem>
                      <MenuItem value="stable">Stable</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Menstrual phase"
                      select
                      value={form.menstrualPhase ?? ''}
                      onChange={(event) =>
                        updateForm('menstrualPhase', (event.target.value || undefined) as DailyRiskInput['menstrualPhase'])
                      }
                    >
                      <MenuItem value="">Prefer not to say</MenuItem>
                      <MenuItem value="follicular">Follicular</MenuItem>
                      <MenuItem value="ovulatory">Ovulatory</MenuItem>
                      <MenuItem value="luteal">Luteal</MenuItem>
                      <MenuItem value="menstrual">Menstrual</MenuItem>
                      <MenuItem value="unspecified">Unspecified</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>

                <TextField
                  label="Notes"
                  multiline
                  minRows={2}
                  value={form.notes ?? ''}
                  onChange={(event) => updateForm('notes', event.target.value)}
                />

                <Button variant="contained" onClick={handleSubmit} disabled={!canSubmit || submitting}>
                  {submitting ? 'Calculating…' : 'Generate risk + plan'}
                </Button>

                {success && (
                  <Card variant="outlined">
                    <CardContent>
                      <Stack spacing={1.5}>
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                          <Typography variant="subtitle1" fontWeight={600} color={RISK_META[success.riskLevel].color}>
                            {RISK_META[success.riskLevel].label} flag
                          </Typography>
                          {success.riskTrend && (
                            <Chip
                              size="small"
                              color={RISK_TREND_META[success.riskTrend].chipColor}
                              variant="outlined"
                              icon={RISK_TREND_META[success.riskTrend].icon}
                              label={RISK_TREND_META[success.riskTrend].label}
                            />
                          )}
                          {typeof success.cohortPercentile0to100 === 'number' && (
                            <Chip
                              size="small"
                              variant="outlined"
                              label={`Percentile ${Math.round(success.cohortPercentile0to100)}`}
                            />
                          )}
                          {typeof success.uncertainty0to1 === 'number' && (
                            <Chip
                              size="small"
                              color="info"
                              variant="outlined"
                              label={`Confidence ${toConfidencePercent(success.uncertainty0to1) ?? '--'}%`}
                            />
                          )}
                        </Stack>

                        {typeof success.uncertainty0to1 === 'number' &&
                          success.uncertainty0to1 >= UNCERTAINTY_THRESHOLD && (
                            <Typography variant="body2" color="warning.main">
                              Model flagged low confidence —{' '}
                              <Link component={RouterLink} to="/dashboard/movement" underline="hover">
                                collect a 30s landing clip
                              </Link>{' '}
                              to tighten it up.
                            </Typography>
                          )}

                        <Typography variant="body2" color="text.secondary">
                          {success.rationale}
                        </Typography>

                        {success.drivers && success.drivers.length > 0 && (
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            {success.drivers.map((driver) => (
                              <Chip key={driver} size="small" variant="outlined" label={driver} />
                            ))}
                          </Stack>
                        )}

                        <Typography variant="body1" fontWeight={500}>
                          Change today: {success.changeToday}
                        </Typography>

                        {success.microPlan && success.microPlan.drills?.length > 0 && (
                          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                            <Box sx={{ px: 2, pt: 2 }}>
                              <Typography variant="subtitle2">Micro plan (run first rep today)</Typography>
                            </Box>
                            <List dense disablePadding>
                              {success.microPlan.drills.slice(0, 3).map((drill) => (
                                <ListItem key={drill.name} sx={{ px: 2 }}>
                                  <ListItemText
                                    primary={drill.name}
                                    secondary={`${drill.sets} × ${drill.reps} · Rest ${drill.rest_s}s`}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}

                        {success.environmentPolicyFlags && success.environmentPolicyFlags.length > 0 && (
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            {success.environmentPolicyFlags.map((flag) => (
                              <Chip
                                key={flag}
                                size="small"
                                color="warning"
                                variant="outlined"
                                label={ENVIRONMENT_FLAG_LABELS[flag] ?? flag}
                              />
                            ))}
                          </Stack>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Last 15 recommendations
              </Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                {history.length === 0 && (
                  <Typography color="text.secondary">No risk snapshots recorded yet.</Typography>
                )}
                {history.map((snapshot) => {
                  const meta = RISK_META[snapshot.riskLevel];
                  const trendMeta = snapshot.riskTrend ? RISK_TREND_META[snapshot.riskTrend] : undefined;
                  const confidence = toConfidencePercent(snapshot.uncertainty0to1);
                  const isComplete = (snapshot.adherence0to1 ?? 0) >= 0.99;
                  return (
                    <Card key={snapshot.id} variant="outlined">
                      <CardContent>
                        <Stack spacing={1.5}>
                          <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                            {meta.icon}
                            <Typography fontWeight={600} color={meta.color}>
                              {meta.label}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatDateTime(snapshot.createdAt)}
                            </Typography>
                            {trendMeta && (
                              <Chip
                                size="small"
                                color={trendMeta.chipColor}
                                variant="outlined"
                                icon={trendMeta.icon}
                                label={trendMeta.label}
                              />
                            )}
                            {typeof confidence === 'number' && (
                              <Chip size="small" variant="outlined" label={`Confidence ${confidence}%`} />
                            )}
                          </Stack>

                          {typeof snapshot.uncertainty0to1 === 'number' &&
                            snapshot.uncertainty0to1 >= UNCERTAINTY_THRESHOLD && (
                              <Typography variant="caption" color="warning.main">
                                Low confidence —{' '}
                                <Link component={RouterLink} underline="hover" to="/dashboard/movement">
                                  capture a short landing clip
                                </Link>{' '}
                                before next session.
                              </Typography>
                            )}

                          <Typography variant="body2" color="text.secondary">
                            {snapshot.rationale}
                          </Typography>

                          {snapshot.drivers && snapshot.drivers.length > 0 && (
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              {snapshot.drivers.map((driver) => (
                                <Chip key={`${snapshot.id}-${driver}`} size="small" variant="outlined" label={driver} />
                              ))}
                            </Stack>
                          )}

                          <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
                            <Chip
                              label={snapshot.changeToday}
                              color={snapshot.recommendationAcknowledged ? 'default' : 'primary'}
                              onClick={() => handleAcknowledge(snapshot)}
                            />
                            {snapshot.environmentPolicyFlags &&
                              snapshot.environmentPolicyFlags.map((flag) => (
                                <Chip
                                  key={`${snapshot.id}-${flag}`}
                                  size="small"
                                  color="warning"
                                  variant="outlined"
                                  label={ENVIRONMENT_FLAG_LABELS[flag] ?? flag}
                                />
                              ))}
                          </Stack>

                          {snapshot.microPlan && snapshot.microPlan.drills?.length > 0 && (
                            <Box sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
                              <Box sx={{ px: 2, pt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="subtitle2">Micro plan check-in</Typography>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={isComplete}
                                      onChange={(event) => handleAdherenceToggle(snapshot, event.target.checked)}
                                      size="small"
                                      disabled={adherenceUpdatingId === snapshot.id}
                                    />
                                  }
                                  label={isComplete ? 'Marked done' : 'Mark done'}
                                  componentsProps={{ typography: { variant: 'caption' } }}
                                  sx={{ m: 0 }}
                                />
                              </Box>
                              <Divider />
                              <List dense disablePadding>
                                {snapshot.microPlan.drills.slice(0, 3).map((drill) => (
                                  <ListItem key={`${snapshot.id}-${drill.name}`} sx={{ px: 2 }}>
                                    <ListItemText
                                      primary={drill.name}
                                      secondary={`${drill.sets} × ${drill.reps} · Rest ${drill.rest_s}s`}
                                      primaryTypographyProps={{ variant: 'body2' }}
                                      secondaryTypographyProps={{ variant: 'caption' }}
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};
