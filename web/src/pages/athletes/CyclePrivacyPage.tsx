import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import VideocamIcon from '@mui/icons-material/Videocam';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useAuth } from '@/hooks/useAuth';
import {
  fetchCyclePrivacySetting,
  shareCyclePhaseLabel,
  updateCyclePrivacySetting,
  requestCyclePhaseEstimate,
  requestWarmupSummary,
} from '@/api/athletes';
import type {
  CycleSignals,
  PhaseEstimate,
  PhasePolicy,
  ShareScope,
  CyclePrivacySetting,
  WarmupSummary,
} from '@/types';
import { DEFAULT_CYCLE_SIGNALS, derivePhasePolicy, inferPhase, confidenceBucket } from '@/utils/cycle';

type Symptom = NonNullable<CycleSignals['symptoms']>[number];

const SYMPTOM_OPTIONS: Array<{ value: Symptom; label: string }> = [
  { value: 'cramp', label: 'Cramps' },
  { value: 'fatigue', label: 'Fatigue' },
  { value: 'migraine', label: 'Migraine' },
  { value: 'heavy_flow', label: 'Heavy flow' },
  { value: 'none', label: 'No symptoms' },
];

const CONTRACEPTION_OPTIONS: Array<{ value: CycleSignals['contraception']; label: string }> = [
  { value: 'none', label: 'None' },
  { value: 'combined_ocp', label: 'Combined OCP' },
  { value: 'iud', label: 'IUD' },
  { value: 'implant', label: 'Implant' },
  { value: 'other', label: 'Other / prefer not to say' },
];

const TREND_OPTIONS: Array<{ value: CycleSignals['hrvTrend']; label: string }> = [
  { value: 'flat', label: 'Stable' },
  { value: 'up', label: 'Up' },
  { value: 'down', label: 'Down' },
];

const CYCLE_PRESETS = [26, 28, 30];

const fmtISO = (date: Date) => date.toISOString().slice(0, 10);
const parseISO = (iso: string) => new Date(`${iso}T00:00:00`);
const addDays = (iso: string, days: number) => {
  const base = parseISO(iso);
  base.setDate(base.getDate() + days);
  return fmtISO(base);
};
const daysBetween = (a: string, b: string) => {
  const da = parseISO(a).getTime();
  const db = parseISO(b).getTime();
  return Math.round((db - da) / (1000 * 60 * 60 * 24));
};
const monthMatrix = (year: number, monthIdx: number) => {
  const first = new Date(year, monthIdx, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  const grid: string[] = [];
  for (let i = 0; i < startDay; i += 1) grid.push('');
  for (let day = 1; day <= daysInMonth; day += 1) {
    grid.push(fmtISO(new Date(year, monthIdx, day)));
  }
  while (grid.length % 7 !== 0) grid.push('');
  while (grid.length < 42) grid.push('');
  return grid;
};
const isInRange = (target: string, start: string, len: number) => {
  if (!target || !start) return false;
  const delta = daysBetween(start, target);
  return delta >= 0 && delta < len;
};
const isInPredicted = (target: string, start: string, avg: number, len: number) => {
  if (!target || !start) return false;
  const nextStart = addDays(start, avg);
  return isInRange(target, nextStart, len);
};

const usePersistedSignals = () => {
  const [state, setState] = useState<CycleSignals>(() => {
    if (typeof window === 'undefined') return DEFAULT_CYCLE_SIGNALS;
    try {
      const raw = window.localStorage.getItem('cycle_signals');
      if (raw) {
        return { ...DEFAULT_CYCLE_SIGNALS, ...JSON.parse(raw) };
      }
    } catch {
      /* noop */
    }
    return DEFAULT_CYCLE_SIGNALS;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem('cycle_signals', JSON.stringify(state));
    } catch {
      /* noop */
    }
  }, [state]);

  return [state, setState] as const;
};

export const CyclePrivacyPage = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const athleteId = user?.athleteId ?? '';

  const [shareScope, setShareScope] = useState<ShareScope>('off');
  const [pendingScope, setPendingScope] = useState<ShareScope>('off');
  const [consentOpen, setConsentOpen] = useState(false);
  const [signals, setSignals] = usePersistedSignals();
  const [estimate, setEstimate] = useState<PhaseEstimate>(() => inferPhase(DEFAULT_CYCLE_SIGNALS));
  const [policy, setPolicy] = useState<PhasePolicy>(() =>
    derivePhasePolicy(inferPhase(DEFAULT_CYCLE_SIGNALS), DEFAULT_CYCLE_SIGNALS),
  );
  const [settingLoading, setSettingLoading] = useState(true);
  const [settingError, setSettingError] = useState<string | null>(null);
  const [serverSetting, setServerSetting] = useState<CyclePrivacySetting | null>(null);
  const [shareSaving, setShareSaving] = useState(false);
  const [shareSyncing, setShareSyncing] = useState(false);
  const [lastSharedKey, setLastSharedKey] = useState<string | null>(null);
  const [wearableLink, setWearableLink] = useState(false);
  const [calendarCursor, setCalendarCursor] = useState(() => new Date());
  const [periodLength, setPeriodLength] = useState(5);
  const [toast, setToast] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [warmupSummary, setWarmupSummary] = useState<WarmupSummary | null>(null);
  const [warmupLoading, setWarmupLoading] = useState(false);
  const [warmupError, setWarmupError] = useState<string | null>(null);
  const symptomLoad = (signals.symptoms?.filter((symptom) => symptom && symptom !== 'none').length ?? 0) || 0;
  const confidenceTrend = useMemo(() => {
    const base = estimate.confidence0to1 * 100;
    return Array.from({ length: 8 }, (_, idx) => {
      const modifier = (idx - 4) * 2 - symptomLoad * 1.5;
      return Math.max(35, Math.min(100, base + modifier));
    });
  }, [estimate.confidence0to1, symptomLoad]);
  const warmupTrend = useMemo(() => {
    const base = policy.warmupExtraMin || 4;
    return Array.from({ length: 8 }, (_, idx) =>
      Math.max(0, base + Math.sin(idx / 2) * 1.5 + (policy.cutDensityDelta < 0 ? 0.5 : -0.5)),
    );
  }, [policy.warmupExtraMin, policy.cutDensityDelta]);

  const symptomChecked = (value: Symptom) => Boolean(signals.symptoms?.includes(value));

  useEffect(() => {
    let cancelled = false;
    const applyLocal = () => {
      const nextEstimate = inferPhase(signals);
      if (cancelled) return;
      setEstimate(nextEstimate);
      setPolicy(derivePhasePolicy(nextEstimate, signals));
    };

    if (!athleteId) {
      setAiError(null);
      setAiLoading(false);
      applyLocal();
      return () => {
        cancelled = true;
      };
    }

    setAiLoading(true);
    requestCyclePhaseEstimate(athleteId, signals)
      .then((remoteEstimate) => {
        if (cancelled) return;
        setEstimate(remoteEstimate);
        setPolicy(derivePhasePolicy(remoteEstimate, signals));
        setAiError(null);
      })
      .catch((error) => {
        console.warn('AI phase inference failed', error);
        if (cancelled) return;
        setAiError('AI inference unavailable, using local estimate.');
        applyLocal();
      })
      .finally(() => {
        if (!cancelled) {
          setAiLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [signals, athleteId]);

  useEffect(() => {
    if (!athleteId) {
      setWarmupSummary(buildLocalWarmupSummary(policy, estimate));
      return;
    }
    let cancelled = false;
    setWarmupLoading(true);
    requestWarmupSummary(athleteId, { signals, estimate, policy })
      .then((summary) => {
        if (cancelled) return;
        setWarmupSummary(summary);
        setWarmupError(null);
      })
      .catch((error) => {
        console.warn('Warmup summary generation failed', error);
        if (cancelled) return;
        setWarmupError('Personalized warmup unavailable. Showing default guidance.');
        setWarmupSummary(buildLocalWarmupSummary(policy, estimate));
      })
      .finally(() => {
        if (!cancelled) setWarmupLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [athleteId, signals, estimate, policy]);

  useEffect(() => {
    if (!signals.lastPeriodISO) return;
    const isoDate = parseISO(signals.lastPeriodISO);
    if (Number.isNaN(isoDate.getTime())) return;
    setCalendarCursor(new Date(isoDate.getFullYear(), isoDate.getMonth(), 1));
  }, [signals.lastPeriodISO]);

  useEffect(() => {
    if (!athleteId) {
      setSettingLoading(false);
      return;
    }
    let active = true;
    setSettingLoading(true);
    fetchCyclePrivacySetting(athleteId)
      .then((setting) => {
        if (!active) return;
        setServerSetting(setting);
        setShareScope(setting.shareScope);
        setLastSharedKey(
          setting.lastSharedPhase && setting.lastSharedConfidence
            ? `${setting.lastSharedPhase}-${setting.lastSharedConfidence}`
            : null,
        );
        setSettingError(null);
      })
      .catch((error) => {
        console.warn('Failed to load cycle privacy setting', error);
        if (!active) return;
        setSettingError('Unable to load privacy setting.');
      })
      .finally(() => {
        if (active) setSettingLoading(false);
      });
    return () => {
      active = false;
    };
  }, [athleteId]);

  useEffect(() => {
    if (!athleteId || shareScope !== 'share_label') return;
    const payload = {
      phase: estimate.phase,
      confidenceBucket: confidenceBucket(estimate.confidence0to1),
    } as const;
    const key = `${payload.phase}-${payload.confidenceBucket}`;
    if (lastSharedKey === key) return;
    let active = true;
    setShareSyncing(true);
    shareCyclePhaseLabel(athleteId, payload)
      .then((setting) => {
        if (!active) return;
        setServerSetting(setting);
        setLastSharedKey(key);
        setSettingError(null);
        setToast('Phase label shared with staff.');
      })
      .catch((error) => {
        console.warn('Failed to share phase label', error);
        if (!active) return;
        setSettingError('Unable to sync phase label right now.');
      })
      .finally(() => {
        if (active) setShareSyncing(false);
      });
    return () => {
      active = false;
    };
  }, [athleteId, shareScope, estimate.phase, estimate.confidence0to1, lastSharedKey]);

  const persistShareScope = async (value: ShareScope) => {
    if (!athleteId) return;
    setShareSaving(true);
    try {
      const setting = await updateCyclePrivacySetting(athleteId, value);
      setServerSetting(setting);
      setSettingError(null);
    } catch (error) {
      console.warn('Failed to update share scope', error);
      setSettingError('Unable to update privacy mode.');
    } finally {
      setShareSaving(false);
    }
  };

  const handleScopeChange = (_: unknown, value: ShareScope | null) => {
    if (!value || value === shareScope) return;
    if (value === 'off' || value === 'private') {
      setShareScope(value);
      void persistShareScope(value);
      return;
    }
    setPendingScope(value);
    setConsentOpen(true);
  };

  const handleConsent = () => {
    setShareScope(pendingScope);
    setConsentOpen(false);
    void persistShareScope(pendingScope);
  };

  const updateSignals = <K extends keyof CycleSignals>(key: K, value: CycleSignals[K]) => {
    setSignals((prev) => ({ ...prev, [key]: value }));
  };

  if (!athleteId) {
    return (
      <Box sx={{ px: { xs: 2, md: 6 }, py: 4 }}>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={700}>
            Athlete profile required
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Menstrual Cycle Smart Mode is available only for signed-in athletes. Please log in with an
            athlete account to configure privacy options.
          </Typography>
        </Paper>
      </Box>
    );
  }

  const lastSharedAtLabel = serverSetting?.lastSharedAt
    ? new Date(serverSetting.lastSharedAt).toLocaleString()
    : null;
  const sharedPhaseLabel =
    shareScope === 'share_label'
      ? serverSetting?.lastSharedPhase ?? (shareSyncing ? 'Syncing…' : null)
      : null;
  const sharedConfidenceLabel =
    shareScope === 'share_label'
      ? serverSetting?.lastSharedConfidence ?? (shareSyncing ? 'Syncing…' : null)
      : null;

  return (
    <Box sx={{ px: { xs: 2, md: 6 }, py: 4 }}>
      <Stack spacing={3} sx={{ maxWidth: 1080, mx: 'auto' }}>
        <Stack spacing={1}>
          <Typography variant="h4" fontWeight={800} display="flex" alignItems="center" gap={1}>
            <CalendarMonthIcon color="primary" /> Menstrual Cycle Smart Mode
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Adapt warmups, workload, and cues to physiology—without exposing private data. Nothing is
            shared until you opt in.
          </Typography>
          {settingLoading && <LinearProgress sx={{ maxWidth: 320 }} />}
          {settingError && (
            <Typography variant="caption" color="error">
              {settingError}
            </Typography>
          )}
        </Stack>

        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: 3,
            borderColor: alpha(theme.palette.info.main, 0.2),
            background:
              theme.palette.mode === 'light'
                ? 'linear-gradient(145deg, rgba(226,240,255,0.55), rgba(255,255,255,0.9))'
                : 'linear-gradient(145deg, rgba(9,14,24,0.9), rgba(6,10,20,0.92))',
          }}
        >
          <Stack spacing={2}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={1.5}
              alignItems={{ xs: 'flex-start', md: 'center' }}
              justifyContent="space-between"
            >
              <Stack spacing={0.5}>
                <Typography variant="subtitle1" fontWeight={700}>
                  Privacy mode
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Data stays on device unless you choose to share a simple phase label.
                </Typography>
              </Stack>
              <ToggleButtonGroup
                color="primary"
                value={shareScope}
                exclusive
                onChange={handleScopeChange}
                size="small"
                disabled={settingLoading || shareSaving}
              >
                <ToggleButton value="off">
                  <LockIcon fontSize="small" sx={{ mr: 0.5 }} />
                  Off
                </ToggleButton>
                <ToggleButton value="private">
                  <SecurityIcon fontSize="small" sx={{ mr: 0.5 }} />
                  Private
                </ToggleButton>
                <ToggleButton value="share_label">
                  <LockOpenIcon fontSize="small" sx={{ mr: 0.5 }} />
                  Share label
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
            {lastSharedAtLabel && (
              <Typography variant="caption" color="text.secondary">
                Last shared with staff: {lastSharedAtLabel}
              </Typography>
            )}
            {aiLoading && (
              <Stack spacing={0.5}>
                <Typography variant="caption" color="text.secondary">
                  Calibrating phase with AI…
                </Typography>
                <LinearProgress sx={{ maxWidth: 240 }} />
              </Stack>
            )}
            {aiError && (
              <Typography variant="caption" color="error">
                {aiError}
              </Typography>
            )}
          </Stack>
        </Paper>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <Card
            variant="outlined"
            sx={(t) => ({
              flex: 1,
              borderRadius: 3,
              borderColor: alpha(t.palette.success.main, 0.25),
              background:
                t.palette.mode === 'light'
                  ? 'linear-gradient(135deg, rgba(73,242,194,0.08), rgba(73,242,194,0.02))'
                  : 'linear-gradient(135deg, rgba(18,51,44,0.9), rgba(9,26,22,0.9))',
            })}
          >
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack spacing={0.25}>
                  <Typography variant="subtitle2">Confidence pulse</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Rolling phase certainty ({(estimate.confidence0to1 * 100).toFixed(0)}%)
                  </Typography>
                </Stack>
                <Chip size="small" color="success" label={`${(estimate.confidence0to1 * 100).toFixed(0)}%`} />
              </Stack>
              <SparklineMini points={confidenceTrend} color="#49f2c2" />
              <Typography variant="caption" color="text.secondary">
                Symptoms logged: {symptomLoad} • Last entry{' '}
                {signals.lastPeriodISO ? new Date(signals.lastPeriodISO).toLocaleDateString() : 'n/a'}
              </Typography>
            </CardContent>
          </Card>
          <Card
            variant="outlined"
            sx={(t) => ({
              flex: 1,
              borderRadius: 3,
              borderColor: alpha(t.palette.info.main, 0.25),
              background:
                t.palette.mode === 'light'
                  ? 'linear-gradient(135deg, rgba(53,99,255,0.08), rgba(53,99,255,0.02))'
                  : 'linear-gradient(135deg, rgba(15,24,56,0.9), rgba(9,14,32,0.9))',
            })}
          >
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack spacing={0.25}>
                  <Typography variant="subtitle2">Warmup load trend</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Extra minutes + cutting delta
                  </Typography>
                </Stack>
                <Chip
                  size="small"
                  variant="outlined"
                  label={`+${policy.warmupExtraMin} min · ${
                    policy.cutDensityDelta < 0 ? `-${Math.abs(Math.round(policy.cutDensityDelta * 100))}% cuts` : '+0% cuts'
                  }`}
                />
              </Stack>
              <SparklineMini points={warmupTrend} color="#3563ff" />
              <Typography variant="caption" color="text.secondary">
                Landing focus {policy.landingFocus ? 'ON' : 'OFF'} • Cue vigilance {policy.cueVigilance}
              </Typography>
            </CardContent>
          </Card>
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3 }}>
              <Stack spacing={3}>
                <Stack spacing={0.5}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    Log cycle & signals
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Calendar stays on device. Quick-select cycle length presets and symptom overrides.
                  </Typography>
                </Stack>

                <CycleCalendar
                  lastStartISO={signals.lastPeriodISO}
                  avgCycleDays={signals.avgCycleDays || 28}
                  periodLen={periodLength}
                  cursor={calendarCursor}
                  onCursorChange={setCalendarCursor}
                  onPickDate={(iso) => updateSignals('lastPeriodISO', iso)}
                  onCyclePreset={(value) => updateSignals('avgCycleDays', value)}
                  onStartToday={() => updateSignals('lastPeriodISO', fmtISO(new Date()))}
                  onClear={() => updateSignals('lastPeriodISO', '')}
                  onPeriodLengthChange={setPeriodLength}
                />

                <Stack spacing={2}>
                  <TextField
                    type="number"
                    label="Typical cycle length (days)"
                    value={signals.avgCycleDays ?? ''}
                    onChange={(event) => updateSignals('avgCycleDays', Number(event.target.value))}
                    fullWidth
                  />
                  <FormControl fullWidth>
                    <InputLabel id="contraception-label">Contraception</InputLabel>
                    <Select
                      labelId="contraception-label"
                      label="Contraception"
                      value={signals.contraception ?? 'none'}
                      onChange={(event) =>
                        updateSignals('contraception', event.target.value as CycleSignals['contraception'])
                      }
                    >
                      {CONTRACEPTION_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>

                <Stack spacing={1}>
                  <Typography variant="subtitle2">Symptoms today (optional)</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {SYMPTOM_OPTIONS.map((option) => (
                      <Chip
                        key={option.value}
                        size="small"
                        label={option.label}
                        color={symptomChecked(option.value) ? 'secondary' : 'default'}
                        variant={symptomChecked(option.value) ? 'filled' : 'outlined'}
                        onClick={() =>
                          setSignals((prev) => {
                            const current = prev.symptoms ?? [];
                            if (current.includes(option.value)) {
                              return { ...prev, symptoms: current.filter((item) => item !== option.value) };
                            }
                            return { ...prev, symptoms: [...current, option.value] };
                          })
                        }
                      />
                    ))}
                  </Stack>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel id="hrv-label">HRV trend</InputLabel>
                    <Select
                      labelId="hrv-label"
                      label="HRV trend"
                      value={signals.hrvTrend ?? 'flat'}
                      onChange={(event) => updateSignals('hrvTrend', event.target.value as CycleSignals['hrvTrend'])}
                    >
                      {TREND_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="temp-label">Temperature trend</InputLabel>
                    <Select
                      labelId="temp-label"
                      label="Temperature trend"
                      value={signals.tempTrend ?? 'flat'}
                      onChange={(event) => updateSignals('tempTrend', event.target.value as CycleSignals['tempTrend'])}
                    >
                      {TREND_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>

                <FormControlLabel
                  control={
                    <Switch
                      checked={wearableLink}
                      onChange={(event) => setWearableLink(event.target.checked)}
                    />
                  }
                  label="Link wearable HRV/temperature (optional)"
                />
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} md={5}>
            <PhasePreviewCard
              estimate={estimate}
              policy={policy}
              shareScope={shareScope}
              lastShared={serverSetting}
            />
          </Grid>
        </Grid>

        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              {warmupSummary?.title ?? "Today’s phase-tuned warmup"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {warmupSummary?.description ??
                'FIFA11+ variant with neuromuscular focus. Adjusts automatically per phase, confidence, and symptoms.'}
            </Typography>
            {warmupLoading && (
              <LinearProgress sx={{ mt: 1.5, maxWidth: 320 }} color="secondary" />
            )}
            {warmupSummary?.nudges && warmupSummary.nudges.length > 0 && (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2, rowGap: 1 }}>
                {warmupSummary.nudges.map((nudge) => (
                  <Chip key={nudge} size="small" variant="outlined" label={nudge} />
                ))}
              </Stack>
            )}
            {warmupSummary?.cta && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block' }}>
                {warmupSummary.cta}
              </Typography>
            )}
            {warmupError && (
              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                {warmupError}
              </Typography>
            )}
            <WarmupList policy={policy} confidence={estimate.confidence0to1} />
            {estimate.confidence0to1 < 0.7 && (
              <Paper
                variant="outlined"
                sx={{
                  mt: 2,
                  p: 2,
                  background:
                    theme.palette.mode === 'light'
                      ? 'rgba(255, 243, 205, 0.6)'
                      : 'rgba(97, 86, 45, 0.3)',
                  borderColor: alpha(theme.palette.warning.main, 0.4),
                }}
              >
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1}
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  justifyContent="space-between"
                >
                  <Stack spacing={0.5}>
                    <Typography variant="subtitle2">
                      Confidence is moderate—capture a 30s readiness clip to tighten it.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Because confidence is below 70%, we ease cutting changes and cues.
                    </Typography>
                  </Stack>
                  <Button startIcon={<VideocamIcon />} variant="outlined">
                    Record readiness clip
                  </Button>
                </Stack>
              </Paper>
            )}
          </CardContent>
        </Card>


        {shareScope === 'share_label' && (
          <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3 }}>
            <Stack spacing={1}>
              <Typography variant="subtitle1" fontWeight={700}>
                Coach preview (phase label only)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Staff see only a neutral badge, never dates or symptoms.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                {sharedPhaseLabel && <Chip label={`Phase-smart: ${sharedPhaseLabel}`} color="info" variant="outlined" />}
                {sharedConfidenceLabel && (
                  <Chip label={`Confidence: ${sharedConfidenceLabel}`} variant="outlined" />
                )}
                {shareSyncing && <Chip label="Syncing…" variant="outlined" />}
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Example coach summary: “Phase-adaptive warmup suggested (↑ glute prime, ↓ high-cutting drills)”
              </Typography>
            </Stack>
          </Paper>
        )}
      </Stack>

      <Dialog open={consentOpen} onClose={() => setConsentOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Enable Cycle Smart Mode</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1.5}>
            <Typography variant="body2">
              Data stays on this device. Phase inference runs locally and only a simple label is shared
              if you choose “Share label”.
            </Typography>
            <Stack spacing={0.75}>
              <Stack direction="row" spacing={1} alignItems="center">
                <SecurityIcon fontSize="small" color="primary" />
                <Typography variant="body2">We never transmit dates, symptoms, or fertility info.</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <InfoOutlinedIcon fontSize="small" color="primary" />
                <Typography variant="body2">
                  Scope: performance &amp; injury risk only. Consent can be revoked instantly.
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConsentOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleConsent}>
            I understand
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        message={toast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

const CycleCalendar = ({
  lastStartISO,
  avgCycleDays,
  periodLen,
  cursor,
  onCursorChange,
  onPickDate,
  onCyclePreset,
  onStartToday,
  onClear,
  onPeriodLengthChange,
}: {
  lastStartISO?: string;
  avgCycleDays: number;
  periodLen: number;
  cursor: Date;
  onCursorChange: (date: Date) => void;
  onPickDate: (iso: string) => void;
  onCyclePreset: (value: number) => void;
  onStartToday: () => void;
  onClear: () => void;
  onPeriodLengthChange: (len: number) => void;
}) => {
  const theme = useTheme();
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const grid = useMemo(() => monthMatrix(year, month), [year, month]);
  const label = cursor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const startISO = lastStartISO ?? '';
  const predictedNext =
    startISO && avgCycleDays ? new Date(addDays(startISO, avgCycleDays)).toLocaleDateString() : null;

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton size="small" onClick={() => onCursorChange(new Date(year, month - 1, 1))}>
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onCursorChange(new Date(year, month + 1, 1))}>
            <ChevronRightIcon fontSize="small" />
          </IconButton>
          <Typography variant="subtitle2">{label}</Typography>
        </Stack>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={CYCLE_PRESETS.includes(avgCycleDays) ? avgCycleDays : undefined}
          onChange={(_, value) => {
            if (typeof value === 'number') onCyclePreset(value);
          }}
        >
          {CYCLE_PRESETS.map((value) => (
            <ToggleButton key={value} value={value}>
              {value}d
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
          gap: 0.5,
          textAlign: 'center',
          color: 'text.secondary',
          fontSize: 12,
        }}
      >
        {'SMTWTFS'.split('').map((day) => (
          <Box key={day} sx={{ py: 0.5 }}>
            {day}
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
          gap: 0.5,
        }}
      >
        {grid.map((iso, index) => {
          if (!iso) return <Box key={`empty-${index}`} sx={{ height: 36 }} />;
          const picked = iso === startISO;
          const inActual = !!startISO && isInRange(iso, startISO, periodLen);
          const inPred = !!startISO && isInPredicted(iso, startISO, avgCycleDays, periodLen);
          const isToday = iso === fmtISO(new Date());
          return (
            <Button
              key={iso}
              onClick={() => onPickDate(iso)}
              sx={{
                height: 36,
                minWidth: 0,
                borderRadius: 1,
                border: '1px solid',
                borderColor: picked
                  ? theme.palette.error.main
                  : theme.palette.mode === 'light'
                    ? alpha(theme.palette.text.primary, 0.1)
                    : alpha(theme.palette.common.white, 0.1),
                backgroundColor: inActual
                  ? alpha(theme.palette.error.main, 0.18)
                  : inPred
                    ? alpha(theme.palette.error.main, 0.08)
                    : 'transparent',
                color: picked ? theme.palette.error.main : 'text.primary',
                fontWeight: isToday ? 600 : 400,
              }}
            >
              {parseISO(iso).getDate()}
            </Button>
          );
        })}
      </Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
        <Button variant="contained" size="small" onClick={onStartToday}>
          Started today
        </Button>
        <Button variant="outlined" size="small" onClick={onClear}>
          Clear
        </Button>
        <ToggleButtonGroup
          size="small"
          value={periodLen}
          exclusive
          onChange={(_, value) => {
            if (typeof value === 'number') onPeriodLengthChange(value);
          }}
          sx={{ ml: { sm: 'auto' } }}
        >
          {[4, 5, 6].map((value) => (
            <ToggleButton key={value} value={value}>
              {value}d flow
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
      {!!startISO && (
        <Typography variant="caption" color="text.secondary">
          Last start: {new Date(startISO).toLocaleDateString()}
          {predictedNext ? ` • Predicted next: ${predictedNext}` : ''}
        </Typography>
      )}
    </Stack>
  );
};

const PhasePreviewCard = ({
  estimate,
  policy,
  shareScope,
  lastShared,
}: {
  estimate: PhaseEstimate;
  policy: PhasePolicy;
  shareScope: ShareScope;
  lastShared?: CyclePrivacySetting | null;
}) => {
  const theme = useTheme();
  const confidencePct = Math.round(estimate.confidence0to1 * 100);
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        borderColor: alpha(theme.palette.primary.main, 0.15),
        background:
          theme.palette.mode === 'light'
            ? 'linear-gradient(135deg, rgba(236,240,255,0.7), rgba(255,255,255,0.9))'
            : 'linear-gradient(135deg, rgba(9,12,26,0.9), rgba(7,10,20,0.95))',
        height: '100%',
      }}
    >
      <CardContent>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2" fontWeight={700}>
            On-device phase inference
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label={estimate.phase.toUpperCase()} color="primary" />
            <Chip
              label={`Confidence ${confidencePct}%`}
              color={confidencePct >= 70 ? 'success' : 'warning'}
              variant="outlined"
            />
          </Stack>
          <Stack spacing={0.5}>
            {estimate.reasons.map((reason) => (
              <Typography key={reason} variant="caption" color="text.secondary">
                • {reason}
              </Typography>
            ))}
          </Stack>
          <DividerLight />
          <Stack spacing={0.5}>
            <Typography variant="body2" fontWeight={600}>
              Warmup adjustments
            </Typography>
            <Typography variant="caption" color="text.secondary">
              +{policy.warmupExtraMin} min neuromuscular prep • {Math.round(Math.abs(policy.cutDensityDelta) * 100)}% cutting
              change • {policy.cueVigilance === 'high' ? 'High cue vigilance' : 'Normal cues'}
            </Typography>
          </Stack>
          <DividerLight />
          <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
              Share scope
            </Typography>
            <Chip
              size="small"
              variant="outlined"
              label={
                shareScope === 'off'
                  ? 'Off'
                  : shareScope === 'private'
                  ? 'Private (athlete only)'
                  : 'Phase label shared'
              }
            />
            {lastShared?.lastSharedPhase && lastShared.lastSharedAt && (
              <Typography variant="caption" color="text.secondary">
                Last shared {new Date(lastShared.lastSharedAt).toLocaleString()} • Phase{' '}
                {lastShared.lastSharedPhase} ({lastShared.lastSharedConfidence ?? 'n/a'})
              </Typography>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

const WarmupList = ({ policy, confidence }: { policy: PhasePolicy; confidence: number }) => {
  const drills = [
    { label: 'Glute/hamstring activation', detail: `+${policy.warmupExtraMin} min bands & holds` },
    { label: 'Landing control block', detail: policy.landingFocus ? 'Add 2 landing mechanics reps' : 'Standard reps' },
    {
      label: 'Cutting density',
      detail: policy.cutDensityDelta < 0 ? `Reduce by ${Math.abs(Math.round(policy.cutDensityDelta * 100))}%` : 'No change',
    },
    {
      label: 'Cue vigilance',
      detail: policy.cueVigilance === 'high' ? 'Reinforce knee-valgus cues' : 'Normal cues',
    },
  ];
  return (
    <Stack spacing={1.25} sx={{ mt: 2 }}>
      {drills.map((drill) => (
        <Stack
          key={drill.label}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1.25 }}
        >
          <Typography fontWeight={600}>{drill.label}</Typography>
          <Typography variant="body2" color="text.secondary">
            {drill.detail}
          </Typography>
        </Stack>
      ))}
      {confidence < 0.7 && (
        <Typography variant="caption" color="text.secondary">
          Confidence &lt; 70% → we ease workload changes.
        </Typography>
      )}
    </Stack>
  );
};

const DividerLight = () => (
  <Box
    sx={{
      height: 1,
      backgroundColor: 'divider',
      opacity: 0.4,
      my: 1,
    }}
  />
);

const buildLocalWarmupSummary = (policy: PhasePolicy, estimate: PhaseEstimate): WarmupSummary => ({
  title: "Today’s phase-tuned warmup",
  description: `${estimate.phase === 'unsure' ? 'General neuromuscular focus' : `${estimate.phase} focus`} • Confidence ${(estimate.confidence0to1 * 100).toFixed(0)}% • +${policy.warmupExtraMin} min prep`,
  nudges: [
    `Glute/ham activation +${policy.warmupExtraMin} min`,
    policy.landingFocus ? 'Landing control block adds two sticks' : 'Standard landing block',
    policy.cutDensityDelta < 0
      ? `Reduce sharp cutting by ${Math.abs(Math.round(policy.cutDensityDelta * 100))}%`
      : 'Maintain cutting density',
  ],
  cta: policy.cueVigilance === 'high' ? 'Flag knee-valgus cues block 1.' : undefined,
});

const SparklineMini = ({
  points,
  color = '#49f2c2',
}: {
  points: number[];
  color?: string;
}) => {
  const width = 220;
  const height = 48;
  const pad = 6;
  if (!points.length) {
    return (
      <Box sx={{ height, mt: 1.5, borderRadius: 1, backgroundColor: alpha(color, 0.1) }} />
    );
  }
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = Math.max(1e-3, max - min);
  const step = points.length > 1 ? (width - pad * 2) / (points.length - 1) : 0;
  const path = points
    .map((value, index) => {
      const x = pad + index * step;
      const y = pad + (1 - (value - min) / span) * (height - pad * 2);
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
  const lastValue = points.length ? points[points.length - 1] : min;
  const lastY = pad + (1 - (lastValue - min) / span) * (height - pad * 2);
  return (
    <Box component="svg" width={width} height={height} sx={{ display: 'block', my: 1.5 }}>
      <path d={path} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <circle cx={width - pad} cy={lastY} r={3.5} fill={color} />
    </Box>
  );
};
