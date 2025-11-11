import { useCallback, useEffect, useMemo, useState, useRef, type ReactElement } from 'react';
import {
  Avatar,
  Alert,
  Autocomplete,
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
  Skeleton,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useMediaQuery,
  alpha,
} from '@mui/material';
import type { ChipProps } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningTwoToneIcon from '@mui/icons-material/WarningTwoTone';
import DangerousIcon from '@mui/icons-material/Dangerous';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TuneIcon from '@mui/icons-material/Tune';
import GroupIcon from '@mui/icons-material/Group';
import HistoryIcon from '@mui/icons-material/History';
import TodayIcon from '@mui/icons-material/Today';
import BoltIcon from '@mui/icons-material/Bolt';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { Link as RouterLink } from 'react-router-dom';

import {
  submitDailyRisk,
  fetchRiskSnapshots,
  fetchTeamRiskSnapshots,
  acknowledgeRisk,
  updateRiskAdherence,
} from '@/api/risk';
import type {
  DailyRiskInput,
  DailyRiskResponse,
  RiskSnapshot,
  RiskTrend,
  TeamRiskSnapshot,
} from '@/types';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { formatDateTime } from '@/utils/date';
import { useAuth } from '@/hooks/useAuth';

type AthleteOption = { id: string; label: string; subtitle?: string };

const SURFACES: DailyRiskInput['surface'][] = ['turf', 'grass', 'wet_grass', 'indoor', 'court'];

const RISK_META: Record<
  RiskSnapshot['riskLevel'],
  { label: string; icon: ReactElement; color: string; bg: (theme: any) => string }
> = {
  green: {
    label: 'Green',
    icon: <CheckCircleIcon fontSize="small" color="success" />,
    color: 'success.main',
    bg: (t) => alpha(t.palette.success.main, 0.12),
  },
  yellow: {
    label: 'Yellow',
    icon: <WarningTwoToneIcon fontSize="small" color="warning" />,
    color: 'warning.main',
    bg: (t) => alpha(t.palette.warning.main, 0.16),
  },
  red: {
    label: 'Red',
    icon: <DangerousIcon fontSize="small" color="error" />,
    color: 'error.main',
    bg: (t) => alpha(t.palette.error.main, 0.14),
  },
};

const RISK_TREND_META: Record<
  RiskTrend,
  { label: string; icon: ReactElement; chipColor: 'success' | 'default' | 'error' }
> = {
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

const riskValue = (riskLevel: RiskSnapshot['riskLevel']) => (riskLevel === 'red' ? 3 : riskLevel === 'yellow' ? 2 : 1);

const confidenceCategory = (uncertainty?: number | null): 'high' | 'medium' | 'low' => {
  if (typeof uncertainty !== 'number' || Number.isNaN(uncertainty)) return 'high';
  if (uncertainty <= 0.2) return 'high';
  if (uncertainty <= 0.5) return 'medium';
  return 'low';
};

const confidenceColor = (category: 'high' | 'medium' | 'low') =>
  category === 'high' ? 'success' : category === 'medium' ? 'warning' : 'error';

const sortTrendValue = (trend?: RiskTrend | null) => (!trend ? 1 : trend === 'up' ? 3 : trend === 'flat' ? 2 : 1);

const getTopDriverEntries = (snapshot: RiskSnapshot, limit = 2) => {
  const scoreEntries = snapshot.driverScores
    ? Object.entries(snapshot.driverScores as Record<string, number>)
        .filter(([, value]) => typeof value === 'number')
        .sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0))
    : [];
  if (scoreEntries.length > 0) return scoreEntries.slice(0, limit);
  const drivers = snapshot.drivers ?? [];
  return drivers.slice(0, limit).map((label) => [label, 0.5] as [string, number]);
};

export const RiskPage = () => {
  const { user } = useAuth();
  const athleteIdFromProfile = user?.athleteId ?? '';
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isMdUp = useMediaQuery('(min-width:900px)');

  // --- State
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

  // Team
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

  // Athlete picker
  const [athleteInputValue, setAthleteInputValue] = useState('');

  // Workspace tabs
  const [tab, setTab] = useState<'team' | 'today' | 'history'>('team');

  // --- Persist a couple of view prefs (tab & sort) locally
  useEffect(() => {
    const savedTab = localStorage.getItem('risk_tab');
    const savedSort = localStorage.getItem('risk_sortKey');
    if (savedTab === 'team' || savedTab === 'today' || savedTab === 'history') setTab(savedTab);
    if (savedSort === 'risk' || savedSort === 'confidence' || savedSort === 'trend') setSortKey(savedSort);
  }, []);
  useEffect(() => {
    localStorage.setItem('risk_tab', tab);
  }, [tab]);
  useEffect(() => {
    localStorage.setItem('risk_sortKey', sortKey);
  }, [sortKey]);

  // --- Shortcuts (g t / g h / g y)
  const keyBuffer = useRef<string>('');
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) || (e.target as HTMLElement)?.tagName?.toLowerCase() === 'input' || (e.target as HTMLElement)?.tagName?.toLowerCase() === 'textarea') return;
      keyBuffer.current = (keyBuffer.current + e.key.toLowerCase()).slice(-3);
      if (keyBuffer.current.endsWith('gt')) setTab('team');
      if (keyBuffer.current.endsWith('gy')) setTab('today');
      if (keyBuffer.current.endsWith('gh')) setTab('history');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const canSubmit = useMemo(() => form.athleteId.trim().length > 0, [form.athleteId]);
  const coachTeams = useMemo(() => (user?.role === 'COACH' ? user.teams ?? [] : []), [user]);

  const athleteOptions: AthleteOption[] = useMemo(() => {
    const map = new Map<string, AthleteOption>();
    teamSnapshots.forEach((snapshot) => {
      const id = snapshot.athleteId;
      if (!map.has(id)) {
        map.set(id, {
          id,
          label: snapshot.athlete?.displayName ?? id,
          subtitle: snapshot.athlete?.team ?? undefined,
        });
      }
    });
    history.forEach((snapshot) => {
      if (!map.has(snapshot.athleteId)) {
        map.set(snapshot.athleteId, { id: snapshot.athleteId, label: snapshot.athleteId });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [teamSnapshots, history]);

  const selectedAthleteOption = useMemo(
    () => athleteOptions.find((option) => option.id === athleteId) ?? null,
    [athleteOptions, athleteId],
  );

  useEffect(() => {
    if (selectedAthleteOption) {
      setAthleteInputValue((prev) => (prev === selectedAthleteOption.label ? prev : selectedAthleteOption.label));
    } else if (!athleteId) {
      setAthleteInputValue('');
    }
  }, [selectedAthleteOption, athleteId]);

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
    if (!teamId && coachTeams.length > 0) setTeamId(coachTeams[0]);
  }, [coachTeams, teamId]);

  const loadTeamRoster = useCallback(async () => {
    if (!teamId.trim()) {
      setTeamSnapshots([]);
      return;
    }
    setTeamLoading(true);
    try {
      const data = await fetchTeamRiskSnapshots(teamId.trim(), teamDate ? `${teamDate}T00:00:00.000Z` : undefined);
      setTeamSnapshots(data);
    } catch (err) {
      console.warn('Failed to load team risk snapshots', err);
      setTeamSnapshots([]);
    } finally {
      setTeamLoading(false);
    }
  }, [teamId, teamDate]);

  useEffect(() => {
    if (!athleteId && athleteIdFromProfile) setAthleteId(athleteIdFromProfile);
  }, [athleteId, athleteIdFromProfile]);

  useEffect(() => {
    setForm((prev) => (prev.athleteId === athleteId ? prev : { ...prev, athleteId }));
    if (athleteId.trim()) loadHistory();
    else setHistory([]);
  }, [athleteId, loadHistory]);

  useEffect(() => {
    loadTeamRoster();
  }, [loadTeamRoster]);

  const rosterEntries = useMemo(
    () =>
      teamSnapshots.map((snapshot) => {
        const confidence = confidenceCategory(snapshot.uncertainty0to1);
        return { snapshot, confidence, riskScore: riskValue(snapshot.riskLevel), trendScore: sortTrendValue(snapshot.riskTrend) };
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

  const anyHighUncertainty = useMemo(
    () =>
      rosterEntries.some(
        ({ snapshot }) => typeof snapshot.uncertainty0to1 === 'number' && snapshot.uncertainty0to1 >= UNCERTAINTY_THRESHOLD,
      ),
    [rosterEntries],
  );

  const updateForm = <K extends keyof DailyRiskInput>(key: K, value: DailyRiskInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      setError('Provide an athlete to generate risk insights.');
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
      setTab('today'); // focus result
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
                nextRepCheck: snapshot.nextRepCheck ? { ...snapshot.nextRepCheck, received: checked } : { required: true, received: checked },
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
          setAutoWeatherTimestamp(new Date().toISOString());
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
      { enableHighAccuracy: false, timeout: 8000 },
    );
  }, [autoWeatherLoading]);

  // --- UI Helpers
  const GlassCard: React.FC<React.PropsWithChildren<{ sx?: any }>> = ({ children, sx }) => (
    <Card
      variant="outlined"
      sx={(t) => ({
        borderRadius: 3,
        borderColor: alpha(t.palette.divider, 0.6),
        background: `linear-gradient(180deg, ${alpha(t.palette.background.paper, 0.7)} 0%, ${alpha(
          t.palette.background.paper,
          0.5,
        )} 100%)`,
        backdropFilter: 'saturate(140%) blur(8px)',
        ...sx,
      })}
    >
      {children}
    </Card>
  );

  const Header = (
    <GlassCard
      sx={{
        p: { xs: 2, sm: 3 },
        background: (t: any) =>
          `linear-gradient(135deg, ${alpha(t.palette.primary.main, 0.10)} 0%, ${alpha(
            t.palette.success.main,
            0.08,
          )} 100%)`,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
        <Typography variant="h4" fontWeight={900} letterSpacing={-0.2}>
          ACL Risk Coach
        </Typography>
        <Chip icon={<TuneIcon />} size="small" label="Modern" />
        <Box sx={{ flex: 1 }} />
        <Tooltip title="Keyboard: g t (team), g y (today), g h (history)">
          <Chip size="small" icon={<KeyboardIcon />} label="Shortcuts" variant="outlined" />
        </Tooltip>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Minimal input → clear action. AI blends load, context, and movement signals to recommend the single most useful change today.
      </Typography>
    </GlassCard>
  );

  const LeftRail = (
    <GlassCard
      sx={{
        position: { md: 'sticky' },
        top: { md: 24 },
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Stack spacing={2}>
          <Typography variant="overline" color="text.secondary">
            Athlete
          </Typography>
          <Autocomplete<AthleteOption, false, false, true>
            size="small"
            options={athleteOptions}
            getOptionLabel={(o) => (typeof o === 'string' ? o : o.label)}
            value={selectedAthleteOption}
            inputValue={athleteInputValue}
            freeSolo
            onInputChange={(_, v) => {
              setAthleteInputValue(v);
              const id = v?.trim() ? v.trim() : '';
              setAthleteId(id);
              setForm((prev) => ({ ...prev, athleteId: id }));
            }}
            onChange={(_, opt) => {
              const id = typeof opt === 'string' ? opt.trim() : opt?.id ?? '';
              setAthleteId(id);
              setForm((prev) => ({ ...prev, athleteId: id }));
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderOption={(props, option) => (
              <li {...props}>
                <Stack spacing={0.25}>
                  <Typography fontWeight={700}>{option.label}</Typography>
                  {option.subtitle && (
                    <Typography variant="caption" color="text.secondary">
                      {option.subtitle}
                    </Typography>
                  )}
                </Stack>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select or type athlete"
                placeholder="Name or ID"
                required
                InputProps={{
                  ...params.InputProps,
                  startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'text.disabled' }} />,
                }}
              />
            )}
          />

          <Divider flexItem />

          <Typography variant="overline" color="text.secondary">
            Context
          </Typography>
          <Grid container spacing={1.25}>
            <Grid item xs={12}>
              <TextField
                size="small"
                label="Exposure min (yday)"
                type="number"
                value={form.exposureMinutes}
                onChange={(e) => updateForm('exposureMinutes', Number(e.target.value))}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                label="Surface"
                select
                value={form.surface}
                onChange={(e) => updateForm('surface', e.target.value as DailyRiskInput['surface'])}
                fullWidth
              >
                {SURFACES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s.replace('_', ' ')}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                size="small"
                label="Temp °F"
                type="number"
                value={form.temperatureF}
                onChange={(e) => updateForm('temperatureF', Number(e.target.value))}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                size="small"
                label="Humidity %"
                type="number"
                value={form.humidityPct}
                onChange={(e) => updateForm('humidityPct', Number(e.target.value))}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Button
                  variant="outlined"
                  startIcon={<MyLocationIcon />}
                  onClick={fetchEnvironmentSnapshot}
                  disabled={autoWeatherLoading}
                >
                  {autoWeatherLoading ? 'Fetching…' : 'Auto-fill weather'}
                </Button>
                {autoWeatherTimestamp && (
                  <Chip size="small" variant="outlined" label={`Updated ${formatDateTime(autoWeatherTimestamp)}`} />
                )}
              </Stack>
              {autoWeatherLoading && <LinearProgress sx={{ mt: 1 }} />}
              {autoWeatherError && (
                <Typography variant="caption" color="error">
                  {autoWeatherError}
                </Typography>
              )}
            </Grid>
          </Grid>

          <Divider flexItem />

          <Typography variant="overline" color="text.secondary">
            Flags
          </Typography>
          <ToggleButtonGroup
            exclusive
            color="primary"
            value={form.priorLowerExtremityInjury ? 'yes' : 'no'}
            onChange={(_e, v) => v && updateForm('priorLowerExtremityInjury', v === 'yes')}
            size="small"
            fullWidth
          >
            <ToggleButton value="yes">Prior knee/ankle</ToggleButton>
            <ToggleButton value="no">No prior injury</ToggleButton>
          </ToggleButtonGroup>

          <Grid container spacing={1.25}>
            <Grid item xs={6}>
              <TextField
                size="small"
                label="Soreness (0-3)"
                type="number"
                inputProps={{ min: 0, max: 3 }}
                value={form.sorenessLevel}
                onChange={(e) => updateForm('sorenessLevel', Number(e.target.value) as DailyRiskInput['sorenessLevel'])}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                size="small"
                label="Fatigue (0-3)"
                type="number"
                inputProps={{ min: 0, max: 3 }}
                value={form.fatigueLevel}
                onChange={(e) => updateForm('fatigueLevel', Number(e.target.value) as DailyRiskInput['fatigueLevel'])}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                size="small"
                label="Weight trend"
                select
                value={form.bodyWeightTrend ?? ''}
                onChange={(e) =>
                  updateForm('bodyWeightTrend', (e.target.value || undefined) as DailyRiskInput['bodyWeightTrend'])
                }
                fullWidth
              >
                <MenuItem value="">No change</MenuItem>
                <MenuItem value="up">Up</MenuItem>
                <MenuItem value="down">Down</MenuItem>
                <MenuItem value="stable">Stable</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                size="small"
                label="Menstrual phase"
                select
                value={form.menstrualPhase ?? ''}
                onChange={(e) =>
                  updateForm('menstrualPhase', (e.target.value || undefined) as DailyRiskInput['menstrualPhase'])
                }
                fullWidth
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
            size="small"
            label="Notes"
            multiline
            minRows={2}
            value={form.notes ?? ''}
            onChange={(e) => updateForm('notes', e.target.value)}
            fullWidth
          />

          <ErrorAlert message={error} />

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            fullWidth
            startIcon={<BoltIcon />}
            sx={{
              transition: prefersReducedMotion ? 'none' : 'transform .12s ease',
              '&:hover': { transform: prefersReducedMotion ? 'none' : 'translateY(-1px)' },
            }}
          >
            {submitting ? 'Calculating…' : 'Generate risk + plan'}
          </Button>

          {!athleteId.trim() && (
            <Typography variant="caption" color="text.secondary">
              Select an athlete to unlock today’s recommendation.
            </Typography>
          )}
        </Stack>
      </CardContent>
    </GlassCard>
  );

  const TeamToolbar = (
    <GlassCard>
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
            {coachTeams.length > 0 ? (
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel id="team-select-label">Team</InputLabel>
                <Select
                  labelId="team-select-label"
                  label="Team"
                  value={coachTeams.includes(teamId) ? teamId : '__custom'}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === '__custom') {
                      if (!coachTeams.includes(teamId)) setTeamId('');
                    } else setTeamId(String(v));
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
                size="small"
                label="Team"
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                sx={{ minWidth: 200 }}
              />
            )}
            {coachTeams.length > 0 && !coachTeams.includes(teamId) && (
              <TextField
                size="small"
                label="Custom team"
                placeholder="Enter team id"
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                sx={{ minWidth: 200 }}
              />
            )}
            <TextField
              size="small"
              label="Date"
              type="date"
              value={teamDate}
              onChange={(e) => setTeamDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              size="small"
              label="Search roster"
              placeholder="Name or position"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 200 }}
            />
            <Button variant="outlined" onClick={loadTeamRoster} disabled={teamLoading}>
              {teamLoading ? 'Refreshing…' : 'Load roster'}
            </Button>
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems="center" flexWrap="wrap">
            <ToggleButtonGroup size="small" value={riskFilter} exclusive onChange={(_, v) => v && setRiskFilter(v)}>
              <ToggleButton value="all">All risks</ToggleButton>
              <ToggleButton value="red">High</ToggleButton>
              <ToggleButton value="yellow">Mod</ToggleButton>
              <ToggleButton value="green">Low</ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup size="small" value={trendFilter} exclusive onChange={(_, v) => v && setTrendFilter(v)}>
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
                onChange={(e) => setConfidenceFilter(e.target.value as typeof confidenceFilter)}
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
                onChange={(e) => setSortKey(e.target.value as typeof sortKey)}
              >
                <MenuItem value="risk">Risk level</MenuItem>
                <MenuItem value="confidence">Confidence</MenuItem>
                <MenuItem value="trend">Trend</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          {teamLoading && <LinearProgress />}

          {anyHighUncertainty && (
            <Alert severity="warning">
              Low-confidence estimates detected.{' '}
              <Link component={RouterLink} to="/movement" underline="hover">
                Capture a quick clip
              </Link>{' '}
              to tighten tomorrow’s estimate.
            </Alert>
          )}
        </Stack>
      </CardContent>
    </GlassCard>
  );

  const TeamBoard = (
    <Stack spacing={1.5}>
      {filteredRoster.length === 0 && !teamLoading && (
        <GlassCard>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {teamId.trim()
                ? 'No roster snapshots matched the current filters.'
                : 'Select a team to view today’s roster risk snapshot.'}
            </Typography>
          </CardContent>
        </GlassCard>
      )}

      <Grid container spacing={1.5}>
        {filteredRoster.map(({ snapshot, confidence }) => {
          const displayName = snapshot.athlete?.displayName ?? snapshot.athleteId;
          const initials = displayName.split(' ').map((p) => p[0]).join('').toUpperCase();
          const driverEntries = getTopDriverEntries(snapshot, 3);
          const confidenceLabel = confidence.charAt(0).toUpperCase() + confidence.slice(1);

          return (
            <Grid item xs={12} sm={6} lg={4} key={snapshot.id}>
              <GlassCard
                sx={{
                  overflow: 'hidden',
                  transition: prefersReducedMotion ? 'none' : 'transform .12s ease, box-shadow .12s ease',
                  '&:hover': {
                    transform: prefersReducedMotion ? 'none' : 'translateY(-2px)',
                    boxShadow: (t: any) => `0 10px 24px ${alpha(t.palette.common.black, 0.15)}`,
                  },
                  borderLeft: (t: any) => `4px solid ${t.palette[RISK_META[snapshot.riskLevel].color.split('.')[0]].main}`,
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                      <Avatar>{initials}</Avatar>
                      <Box sx={{ minWidth: 120 }}>
                        <Typography fontWeight={800}>{displayName}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {snapshot.athlete?.position ?? '—'}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ rowGap: 1 }}>
                        <Chip
                          size="small"
                          label={RISK_META[snapshot.riskLevel].label}
                          sx={(t) => ({
                            bgcolor: RISK_META[snapshot.riskLevel].bg(t),
                            color: RISK_META[snapshot.riskLevel].color,
                            borderColor: alpha(t.palette.divider, 0.6),
                          })}
                          variant="outlined"
                          icon={RISK_META[snapshot.riskLevel].icon}
                        />
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
                          label={`${confidenceLabel} conf.`}
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
                          size="small"
                          checked={(snapshot.adherence0to1 ?? 0) >= 0.99}
                          onChange={(e) => handleAdherenceToggle(snapshot, e.target.checked)}
                          disabled={adherenceUpdatingId === snapshot.id}
                        />
                      </Stack>
                    </Stack>

                    <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
                      {snapshot.changeToday}
                    </Typography>

                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ rowGap: 1 }}>
                      {driverEntries.map(([driver, score]) => (
                        <Box
                          key={`${snapshot.id}-${driver}`}
                          sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            px: 1.5,
                            py: 0.75,
                            minWidth: 160,
                            maxWidth: '100%',
                          }}
                        >
                          <Typography variant="caption" fontWeight={800}>
                            {driver.replace(/_/g, ' ')}
                          </Typography>
                          <Box sx={{ mt: 0.5, height: 6, borderRadius: 3, bgcolor: 'action.hover', overflow: 'hidden' }}>
                            <Box sx={{ width: `${Math.min(Math.max(score, 0) * 100, 100)}%`, height: '100%', bgcolor: 'primary.main' }} />
                          </Box>
                        </Box>
                      ))}
                    </Stack>

                    {snapshot.environmentPolicyFlags && snapshot.environmentPolicyFlags.length > 0 && (
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ rowGap: 1 }}>
                        {snapshot.environmentPolicyFlags.map((flag) => (
                          <Chip key={`${snapshot.id}-${flag}`} size="small" color="warning" variant="outlined" label={ENVIRONMENT_FLAG_LABELS[flag] ?? flag} />
                        ))}
                      </Stack>
                    )}

                    {snapshot.microPlan && snapshot.microPlan.drills?.length > 0 && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Micro-plan drills
                        </Typography>
                        <List dense sx={{ pl: 2 }}>
                          {snapshot.microPlan.drills.map((drill) => (
                            <ListItem key={`${snapshot.id}-${drill.name}`}>
                              <ListItemText primary={drill.name} secondary={`${drill.sets} × ${drill.reps} · Rest ${drill.rest_s}s`} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </GlassCard>
            </Grid>
          );
        })}

        {teamLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <Grid item xs={12} sm={6} lg={4} key={`skeleton-${i}`}>
              <GlassCard>
                <CardContent>
                  <Skeleton variant="text" width={160} />
                  <Skeleton variant="rectangular" height={60} sx={{ mt: 1, borderRadius: 1 }} />
                  <Skeleton variant="text" width={220} sx={{ mt: 1 }} />
                </CardContent>
              </GlassCard>
            </Grid>
          ))}
      </Grid>
    </Stack>
  );

  const TodayCard = (
    <GlassCard>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {!success && (
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              Generate today’s recommendation from the left panel to view the AI card here.
            </Typography>
            <Box>
              <Button variant="contained" onClick={handleSubmit} disabled={!canSubmit || submitting} startIcon={<TodayIcon />}>
                {submitting ? 'Calculating…' : 'Generate risk + plan'}
              </Button>
            </Box>
          </Stack>
        )}

        {success && (
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap sx={{ rowGap: 1 }}>
              <Typography
                variant="h6"
                fontWeight={900}
              
              >
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
                <Chip size="small" variant="outlined" label={`Percentile ${Math.round(success.cohortPercentile0to100)}`} />
              )}
              {typeof success.uncertainty0to1 === 'number' && (
                <Chip size="small" color="info" variant="outlined" label={`Confidence ${toConfidencePercent(success.uncertainty0to1) ?? '--'}%`} />
              )}
            </Stack>

            {typeof success.uncertainty0to1 === 'number' && success.uncertainty0to1 >= UNCERTAINTY_THRESHOLD && (
              <Alert severity="warning">
                Model flagged low confidence —{' '}
                <Link component={RouterLink} to="/movement" underline="hover">
                  collect a 30s landing clip
                </Link>{' '}
                to tighten it up.
              </Alert>
            )}

            <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
              {success.rationale}
            </Typography>

            {success.drivers && success.drivers.length > 0 && (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ rowGap: 1 }}>
                {success.drivers.map((driver) => {
                  const phaseSmart = driver.toLowerCase().includes('phase-smart');
                  const chipProps: ChipProps = {
                    size: 'small',
                    variant: phaseSmart ? 'filled' : 'outlined',
                    color: phaseSmart ? 'info' : 'default',
                    icon: phaseSmart ? <BoltIcon fontSize="inherit" /> : undefined,
                    label: driver,
                  };
                  if (phaseSmart) {
                    return (
                      <Tooltip key={driver} title="Athlete shared a sanitized phase label with staff.">
                        <Chip {...chipProps} />
                      </Tooltip>
                    );
                  }
                  return <Chip key={driver} {...chipProps} />;
                })}
              </Stack>
            )}

            <Typography variant="body1" fontWeight={900}>
              Change today: {success.changeToday}
            </Typography>

            {success.microPlan && success.microPlan.drills?.length > 0 && (
              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ px: 2, pt: 2 }}>
                  <Typography variant="subtitle2">Micro plan (run first rep today)</Typography>
                </Box>
                <List dense disablePadding>
                  {success.microPlan.drills.slice(0, 3).map((drill) => (
                    <ListItem key={drill.name} sx={{ px: 2 }}>
                      <ListItemText primary={drill.name} secondary={`${drill.sets} × ${drill.reps} · Rest ${drill.rest_s}s`} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {success.environmentPolicyFlags && success.environmentPolicyFlags.length > 0 && (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ rowGap: 1 }}>
                {success.environmentPolicyFlags.map((flag) => (
                  <Chip key={flag} size="small" color="warning" variant="outlined" label={ENVIRONMENT_FLAG_LABELS[flag] ?? flag} />
                ))}
              </Stack>
            )}
          </Stack>
        )}
      </CardContent>
    </GlassCard>
  );

  const HistoryList = (
    <GlassCard>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {history.length === 0 ? (
          <Typography color="text.secondary">No risk snapshots recorded yet.</Typography>
        ) : (
          <Stack spacing={1.5}>
            {history.map((snapshot) => {
              const meta = RISK_META[snapshot.riskLevel];
              const trendMeta = snapshot.riskTrend ? RISK_TREND_META[snapshot.riskTrend] : undefined;
              const confidence = toConfidencePercent(snapshot.uncertainty0to1);
              const isComplete = (snapshot.adherence0to1 ?? 0) >= 0.99;

              return (
                <GlassCard key={snapshot.id} sx={{ borderRadius: 2.5 }}>
                  <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                    <Stack spacing={1.5}>
                      <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap sx={{ rowGap: 1 }}>
                        {meta.icon}
                        <Typography fontWeight={800} sx={{ color: meta.color }}>
                          {meta.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDateTime(snapshot.createdAt)}
                        </Typography>
                        {trendMeta && (
                          <Chip size="small" color={trendMeta.chipColor} variant="outlined" icon={trendMeta.icon} label={trendMeta.label} />
                        )}
                        {typeof confidence === 'number' && <Chip size="small" variant="outlined" label={`Confidence ${confidence}%`} />}
                      </Stack>

                      {typeof snapshot.uncertainty0to1 === 'number' && snapshot.uncertainty0to1 >= UNCERTAINTY_THRESHOLD && (
                        <Typography variant="caption" color="warning.main">
                          Low confidence —{' '}
                          <Link component={RouterLink} underline="hover" to="/movement">
                            capture a short landing clip
                          </Link>{' '}
                          before next session.
                        </Typography>
                      )}

                      <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
                        {snapshot.rationale}
                      </Typography>

                      {snapshot.drivers && snapshot.drivers.length > 0 && (
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ rowGap: 1 }}>
                          {snapshot.drivers.map((driver) => {
                            const phaseSmart = driver.toLowerCase().includes('phase-smart');
                            const key = `${snapshot.id}-${driver}`;
                            const chipProps: ChipProps = {
                              size: 'small',
                              variant: phaseSmart ? 'filled' : 'outlined',
                              color: phaseSmart ? 'info' : 'default',
                              icon: phaseSmart ? <BoltIcon fontSize="inherit" /> : undefined,
                              label: driver,
                            };
                            if (phaseSmart) {
                              return (
                                <Tooltip key={key} title="Athlete shared a sanitized phase label with staff.">
                                  <Chip {...chipProps} />
                                </Tooltip>
                              );
                            }
                            return <Chip key={key} {...chipProps} />;
                          })}
                        </Stack>
                      )}

                      <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center" useFlexGap sx={{ rowGap: 1 }}>
                        <Chip
                          label={snapshot.changeToday}
                          color={snapshot.recommendationAcknowledged ? 'default' : 'primary'}
                          onClick={() => handleAcknowledge(snapshot)}
                          disabled={snapshot.recommendationAcknowledged}
                        />
                        {snapshot.environmentPolicyFlags &&
                          snapshot.environmentPolicyFlags.map((flag) => (
                            <Chip key={`${snapshot.id}-${flag}`} size="small" color="warning" variant="outlined" label={ENVIRONMENT_FLAG_LABELS[flag] ?? flag} />
                          ))}
                      </Stack>

                      {snapshot.microPlan && snapshot.microPlan.drills?.length > 0 && (
                        <Box sx={{ border: '1px dashed', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                          <Box sx={{ px: 2, pt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2">Micro plan check-in</Typography>
                            <FormControlLabel
                              control={
                                <Switch
                                  size="small"
                                  checked={isComplete}
                                  onChange={(e) => handleAdherenceToggle(snapshot, e.target.checked)}
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
                </GlassCard>
              );
            })}
          </Stack>
        )}
      </CardContent>
    </GlassCard>
  );

  return (
    <Stack spacing={3} sx={{ pb: 4 }}>
      {Header}

      <Grid container spacing={3}>
        {/* Sticky, frosted control rail */}
        <Grid item xs={12} md={4} lg={3}>
          {LeftRail}
        </Grid>

        {/* Right workspace */}
        <Grid item xs={12} md={8} lg={9}>
          <GlassCard sx={{ overflow: 'hidden' }}>
            <Box
              sx={(t) => ({
                px: { xs: 1, sm: 2 },
                pt: 1,
                backgroundColor: alpha(t.palette.background.paper, 0.6),
                borderBottom: '1px solid',
                borderColor: 'divider',
              })}
            >
              <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="Workspace tabs"
                TabIndicatorProps={{
                  sx: (theme) => ({
                    height: 0,
                    '&:after': {
                      content: '""',
                      display: 'block',
                      height: 32,
                      borderRadius: 999,
                      background: alpha(theme.palette.primary.main, 0.16),
                      position: 'relative',
                      top: -30,
                    },
                  }),
                }}
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: 999,
                    minHeight: 38,
                    mx: 0.5,
                    px: 1.25,
                  },
                }}
              >
                <Tab icon={<GroupIcon />} iconPosition="start" label="Team board" value="team" />
                <Tab icon={<TodayIcon />} iconPosition="start" label="Today’s result" value="today" />
                <Tab icon={<HistoryIcon />} iconPosition="start" label="Athlete history" value="history" />
              </Tabs>
            </Box>

            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              {tab === 'team' && (
                <Stack spacing={2.5}>
                  {TeamToolbar}
                  {TeamBoard}
                </Stack>
              )}

              {tab === 'today' && <>{TodayCard}</>}

              {tab === 'history' && <>{HistoryList}</>}
            </Box>
          </GlassCard>
        </Grid>
      </Grid>
    </Stack>
  );
};
