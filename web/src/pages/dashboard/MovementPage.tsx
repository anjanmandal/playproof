import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  AppBar,
  Autocomplete,
  Avatar,
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  MenuItem,
  Paper,
  CircularProgress,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import RefreshIcon from '@mui/icons-material/Refresh';
import VideocamIcon from '@mui/icons-material/Videocam';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CancelIcon from '@mui/icons-material/Cancel';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import ReplayIcon from '@mui/icons-material/Replay';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import SensorsIcon from '@mui/icons-material/Sensors';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import InsightsIcon from '@mui/icons-material/Insights';
import SpeedIcon from '@mui/icons-material/Speed';
import NorthEastIcon from '@mui/icons-material/NorthEast';

import { createMovementAssessment, fetchMovementAssessments, updateMovementProof } from '@/api/movement';
import { postRiskVideoFeatures } from '@/api/risk';
import { uploadMedia } from '@/api/media';
import type {
  DrillType,
  MovementAssessment,
  MovementAssessmentInput,
  MovementVerdict,
  AthleteProgressMetrics,
  AthleteSummary,
} from '@/types';
import { formatDateTime } from '@/utils/date';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import { extractFramesFromVideo, speakCues } from '@/utils/media';
import { useAuth } from '@/hooks/useAuth';
import { isWearableIntegrationActive } from '@/config/features';
import { fetchAthleteProgress, fetchAthletes } from '@/api/athletes';
import { alpha, useTheme } from '@mui/material/styles';

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

const DUMMY_PROGRESS_SERIES: Array<{ label: string; movement: number; risk: number }> = [
  { label: 'Mon', movement: 6.1, risk: 5.4 },
  { label: 'Tue', movement: 6.4, risk: 5.1 },
  { label: 'Wed', movement: 6.7, risk: 4.9 },
  { label: 'Thu', movement: 6.9, risk: 4.8 },
  { label: 'Fri', movement: 7.2, risk: 4.6 },
  { label: 'Sat', movement: 7.4, risk: 4.4 },
  { label: 'Sun', movement: 7.3, risk: 4.5 },
];

const DUMMY_LOAD_TREND: Array<{ label: string; load: number; risk: number }> = [
  { label: 'Mon', load: 62, risk: 32 },
  { label: 'Tue', load: 68, risk: 30 },
  { label: 'Wed', load: 54, risk: 36 },
  { label: 'Thu', load: 71, risk: 27 },
  { label: 'Fri', load: 64, risk: 29 },
  { label: 'Sat', load: 76, risk: 25 },
  { label: 'Sun', load: 58, risk: 34 },
];

const DUMMY_RISK_BANDS = { green: 9, yellow: 4, red: 2 };
const RISK_BAND_META = [
  { key: 'green', label: 'Green', color: '#34d399' },
  { key: 'yellow', label: 'Yellow', color: '#fbbf24' },
  { key: 'red', label: 'Red', color: '#f87171' },
] as const;

/* --------------------------------------------
 * OVERLAY INSIGHTS CARD
 * -------------------------------------------*/
const safeCardSx = (theme: any) => ({
  borderRadius: 4,
  p: { xs: 2, md: 2.5 },
  overflow: 'hidden',
  boxSizing: 'border-box',
  '& *': { minWidth: 0 },
  background:
    theme.palette.mode === 'light'
      ? 'linear-gradient(160deg, rgba(255,255,255,0.96) 0%, rgba(246,248,255,0.92) 100%)'
      : 'linear-gradient(160deg, rgba(16,20,38,0.82) 0%, rgba(10,14,28,0.92) 100%)',
  border: '1px solid',
  borderColor: theme.palette.mode === 'light' ? 'rgba(19,33,111,0.1)' : 'rgba(99,245,197,0.14)',
});

const chipWrapSx = { display: 'flex', flexWrap: 'wrap', gap: 0.75, minWidth: 0 };

const clamp1 = { display: '-webkit-box', WebkitBoxOrient: 'vertical' as const, WebkitLineClamp: 1, overflow: 'hidden' };
const clamp2 = { display: '-webkit-box', WebkitBoxOrient: 'vertical' as const, WebkitLineClamp: 2, overflow: 'hidden' };
const clamp3 = { display: '-webkit-box', WebkitBoxOrient: 'vertical' as const, WebkitLineClamp: 3, overflow: 'hidden' };

// (Overlay visuals removed per latest direction.)

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

const SparklineMini = ({ points, color = '#3563ff' }: { points: number[]; color?: string }) => {
  if (!points.length) {
    return (
      <Typography variant="caption" color="text.secondary">
        Not enough data yet
      </Typography>
    );
  }
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = Math.max(max - min, 1);
  const coords = points.map((value, index) => {
    const x = (index / Math.max(1, points.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return { x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) };
  });
  const path = coords.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x},${point.y}`).join(' ');
  const areaPath = `${path} L100,100 L0,100 Z`;
  const lastPoint = coords[coords.length - 1];
  const fillColor = alpha(color, 0.18);
  return (
    <Box component="svg" viewBox="0 0 100 100" sx={{ width: '100%', height: 60 }} preserveAspectRatio="none">
      <path d={areaPath} fill={fillColor} />
      <path d={path} fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      {lastPoint && (
        <circle cx={lastPoint.x} cy={lastPoint.y} r={3} fill={color} stroke="#0b1020" strokeWidth={1.2} />
      )}
    </Box>
  );
};

const AthleteProgressCard = ({ data }: { data: AthleteProgressMetrics }) => {
  const theme = useTheme();
  const emerald = theme.palette.success.main;
  const indigo = theme.palette.primary.main;
  const amber = theme.palette.warning.main;

  const movementPoints = data.movementTrend.map((trend) => trend.verdictScore);
  const riskPoints = data.riskTrend.map((trend) => trend.riskScore);
  const plannerRows = data.plannerImpacts.slice(-3).reverse();
  const graphSeries = useMemo(() => {
    const count = Math.min(data.movementTrend.length, data.riskTrend.length);
    if (count >= 4) {
      const take = Math.min(7, count);
      return Array.from({ length: take }).map((_, idx) => {
        const movementEntry = data.movementTrend[data.movementTrend.length - take + idx];
        const riskEntry = data.riskTrend[data.riskTrend.length - take + idx];
        const labelDate = movementEntry?.createdAt ?? riskEntry?.createdAt ?? '';
        const label = labelDate
          ? new Date(labelDate).toLocaleDateString(undefined, { weekday: 'short' })
          : `Pt ${idx + 1}`;
        return {
          label,
          movement: movementEntry?.verdictScore ?? 0,
          risk: riskEntry?.riskScore ?? 0,
        };
      });
    }
    return DUMMY_PROGRESS_SERIES;
  }, [data.movementTrend, data.riskTrend]);
  const riskBandCounts = useMemo(() => {
    if (!data.riskTrend.length) return DUMMY_RISK_BANDS;
    return data.riskTrend.reduce(
      (acc, trend) => {
        const key = trend.riskLevel as keyof typeof acc;
        if (acc[key] !== undefined) acc[key] += 1;
        return acc;
      },
      { green: 0, yellow: 0, red: 0 },
    );
  }, [data.riskTrend]);

  const movementDelta =
    movementPoints.length >= 2
      ? movementPoints[movementPoints.length - 1] - movementPoints[0]
      : movementPoints.length === 1
        ? movementPoints[0]
        : 0;
  const riskDelta =
    riskPoints.length >= 2
      ? riskPoints[riskPoints.length - 1] - riskPoints[0]
      : riskPoints.length === 1
        ? riskPoints[0]
        : 0;

  const makeTileSx = (color: string) => ({
    flex: 1,
    borderRadius: 2,
    border: `1px solid ${alpha(color, 0.25)}`,
    background: `linear-gradient(135deg, ${alpha(color, 0.18)}, ${alpha(color, 0.04)})`,
    p: 2,
    minWidth: 0,
  });

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        borderColor: alpha(theme.palette.common.white, theme.palette.mode === 'dark' ? 0.08 : 0.05),
        background: `linear-gradient(165deg, ${alpha(theme.palette.background.paper, 0.96)}, ${alpha(
          theme.palette.background.default,
          0.92,
        )})`,
        boxShadow: `0 20px 45px ${alpha(theme.palette.common.black, 0.22)}`,
        backdropFilter: 'blur(10px)',
      }}
    >
      <CardContent sx={{ p: { xs: 2.25, md: 2.75 } }}>
        <Stack spacing={2.25}>
          <Typography variant="subtitle1" fontWeight={700} display="flex" alignItems="center" gap={1}>
            <TrendingUpIcon fontSize="small" color="success" /> Progress pulse
          </Typography>

          <Box
            sx={{
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
              background:
                theme.palette.mode === 'light'
                  ? 'linear-gradient(135deg, rgba(225,232,255,0.45), rgba(255,255,255,0.8))'
                  : 'linear-gradient(135deg, rgba(11,16,32,0.8), rgba(16,22,46,0.95))',
              p: { xs: 1.5, md: 2 },
            }}
          >
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Trend snapshot (dummy fallback shown when history is short)
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip size="small" label="Movement" color="primary" variant="outlined" />
                <Chip size="small" label="Risk" color="success" variant="outlined" />
              </Stack>
            </Stack>

            <ProgressMiniGraph series={graphSeries} />
          </Box>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.75}>
            <Box sx={makeTileSx(emerald)}>
              <Typography variant="overline" sx={{ letterSpacing: 1 }} color="text.secondary">
                Movement verdicts
              </Typography>
              <SparklineMini points={movementPoints} color={emerald} />
              <Typography variant="body2" color="text.secondary">
                {movementPoints.length
                  ? `${movementPoints.length} recent sessions • ${movementDelta >= 0 ? 'Improving +' : 'Needs attention '}${movementDelta.toFixed(1)}`
                  : 'Log additional sessions to populate this trend.'}
              </Typography>
            </Box>
            <Box sx={makeTileSx(indigo)}>
              <Typography variant="overline" sx={{ letterSpacing: 1 }} color="text.secondary">
                Daily risk bands
              </Typography>
              <SparklineMini points={riskPoints} color={indigo} />
              <Typography variant="body2" color="text.secondary">
                {riskPoints.length
                  ? `${riskPoints.length} daily snapshots • ${riskDelta <= 0 ? 'Risk down ' : 'Risk up +'}${Math.abs(riskDelta).toFixed(1)}`
                  : 'Collect daily risk entries to track change.'}
              </Typography>
            </Box>
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.75}>
            <Box sx={makeTileSx(emerald)}>
              <Typography variant="overline" sx={{ letterSpacing: 1 }} color="text.secondary">
                Micro-plan completion
              </Typography>
              <Typography variant="h4" sx={{ mt: 0.75 }}>
                {(data.microPlanStats.completionRate * 100).toFixed(0)}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(data.microPlanStats.completionRate ?? 0) * 100}
                sx={{
                  height: 6,
                  borderRadius: 999,
                  backgroundColor: alpha(emerald, 0.18),
                  mt: 1,
                  '& .MuiLinearProgress-bar': { backgroundColor: emerald },
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {data.microPlanStats.completed}/{data.microPlanStats.assigned} completed
              </Typography>
            </Box>
            <Box sx={makeTileSx(amber)}>
              <Typography variant="overline" sx={{ letterSpacing: 1 }} color="text.secondary">
                Next-rep verification
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                <Chip size="small" color="success" label={`Better ${data.verificationStats.better}`} />
                <Chip size="small" color="warning" variant="outlined" label={`Same ${data.verificationStats.same}`} />
                <Chip size="small" color="error" variant="outlined" label={`Worse ${data.verificationStats.worse}`} />
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Pending checks: {data.verificationStats.pending}
              </Typography>
            </Box>
            <Box sx={makeTileSx(indigo)}>
              <Typography variant="overline" sx={{ letterSpacing: 1 }} color="text.secondary">
                Planner impact
              </Typography>
              {plannerRows.length === 0 ? (
                <Typography variant="caption" color="text.secondary">
                  No planner-linked snapshots yet.
                </Typography>
              ) : (
                <Stack spacing={0.75} sx={{ mt: 0.5 }}>
                  {plannerRows.map((row) => (
                    <Stack key={row.snapshotId} direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2">Plan {row.planId.slice(0, 6)}</Typography>
                      <Chip
                        size="small"
                        color={row.delta <= 0 ? 'success' : 'warning'}
                        label={`Δ ${row.delta.toFixed(2)}`}
                      />
                    </Stack>
                  ))}
                </Stack>
              )}
            </Box>
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.75}>
            <RiskBandDistribution counts={riskBandCounts} />
            <ComplianceGauge stats={data.microPlanStats} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

const ProgressMiniGraph = ({ series }: { series: Array<{ label: string; movement: number; risk: number }> }) => {
  const theme = useTheme();
  const width = 520;
  const height = 150;
  const padX = 28;
  const padY = 20;
  const innerWidth = width - padX * 2;
  const innerHeight = height - padY * 2;

  const buildPoints = (key: 'movement' | 'risk') => {
    const values = series.map((point) => point[key]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = Math.max(max - min, 1e-6);
    return series.map((point, idx) => {
      const x = padX + (innerWidth * idx) / Math.max(series.length - 1, 1);
      const y = padY + innerHeight - ((point[key] - min) / span) * innerHeight;
      return { x, y, label: point.label, value: point[key] };
    });
  };

  const movementPoints = buildPoints('movement');
  const riskPoints = buildPoints('risk');
  const pathFromPoints = (points: Array<{ x: number; y: number }>) =>
    points.map((pt, idx) => `${idx === 0 ? 'M' : 'L'}${pt.x.toFixed(2)},${pt.y.toFixed(2)}`).join(' ');
  const movementPath = pathFromPoints(movementPoints);
  const movementAreaPath = `${movementPath} L ${padX + innerWidth},${padY + innerHeight} L ${padX},${padY + innerHeight} Z`;
  const riskPath = pathFromPoints(riskPoints);

  return (
    <Box component="svg" viewBox={`0 0 ${width} ${height}`} sx={{ width: '100%', height: 160, mt: 1 }}>
      <defs>
        <linearGradient id="movementGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={alpha(theme.palette.primary.main, 0.35)} />
          <stop offset="100%" stopColor={alpha(theme.palette.primary.main, 0.02)} />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
        const y = padY + innerHeight * ratio;
        return (
          <line
            key={`grid-${ratio}`}
            x1={padX}
            y1={y}
            x2={padX + innerWidth}
            y2={y}
            stroke={alpha(theme.palette.text.primary, 0.08)}
            strokeWidth={1}
          />
        );
      })}
      <path d={movementAreaPath} fill="url(#movementGradient)" />
      <path d={movementPath} fill="none" stroke={theme.palette.primary.main} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />
      <path
        d={riskPath}
        fill="none"
        stroke={theme.palette.success.main}
        strokeWidth={2.2}
        strokeDasharray="6 5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {movementPoints.map((pt, idx) => (
        <circle key={`m-${idx}`} cx={pt.x} cy={pt.y} r={3.5} fill={theme.palette.primary.main} />
      ))}
      {riskPoints.map((pt, idx) => (
        <circle
          key={`r-${idx}`}
          cx={pt.x}
          cy={pt.y}
          r={3}
          fill={theme.palette.background.paper}
          stroke={theme.palette.success.main}
          strokeWidth={2}
        />
      ))}
      {series.map((point, idx) => {
        const x = padX + (innerWidth * idx) / Math.max(series.length - 1, 1);
        return (
          <text
            key={`label-${point.label}`}
            x={x}
            y={height - 4}
            textAnchor="middle"
            fontSize={11}
            fill={alpha(theme.palette.text.primary, 0.72)}
          >
            {point.label}
          </text>
        );
      })}
    </Box>
  );
};

const RiskBandDistribution = ({ counts }: { counts: { green: number; yellow: number; red: number } }) => {
  const theme = useTheme();
  const total = Object.values(counts).reduce((acc, val) => acc + val, 0) || 1;
  return (
    <Box
      sx={{
        flex: 1,
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.warning.main, 0.25)}`,
        background:
          theme.palette.mode === 'light'
            ? 'linear-gradient(135deg, rgba(255,247,220,0.6), rgba(255,255,255,0.9))'
            : 'linear-gradient(135deg, rgba(48,34,6,0.8), rgba(21,14,3,0.95))',
        p: { xs: 2, md: 2.5 },
        minWidth: 0,
      }}
    >
      <Typography variant="overline" sx={{ letterSpacing: 1 }} color="text.secondary">
        Risk band distribution
      </Typography>
      <Stack direction="row" sx={{ mt: 1, borderRadius: 999, overflow: 'hidden', height: 32, border: '1px solid', borderColor: alpha('#000', 0.08) }}>
        {RISK_BAND_META.map((band) => {
          const pct = (counts[band.key] / total) * 100;
          return (
            <Box key={band.key} sx={{ width: `${pct}%`, backgroundColor: alpha(band.color, 0.85) }} />
          );
        })}
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 1.5 }}>
        {RISK_BAND_META.map((band) => (
          <Stack key={band.key} direction="row" spacing={1} alignItems="center">
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: band.color }} />
            <Typography variant="caption" color="text.secondary">
              {band.label}: {counts[band.key]} ({Math.round((counts[band.key] / total) * 100)}%)
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

const ComplianceGauge = ({ stats }: { stats: AthleteProgressMetrics['microPlanStats'] }) => {
  const theme = useTheme();
  const pct = (stats.completionRate ?? 0) * 100;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (pct / 100) * circumference;
  return (
    <Box
      sx={{
        flex: 1,
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.success.main, 0.25)}`,
        background:
          theme.palette.mode === 'light'
            ? 'linear-gradient(135deg, rgba(209,250,229,0.6), rgba(255,255,255,0.95))'
            : 'linear-gradient(135deg, rgba(9,34,24,0.8), rgba(5,18,12,0.95))',
        p: { xs: 2, md: 2.5 },
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Typography variant="overline" sx={{ letterSpacing: 1 }} color="text.secondary">
        Micro-plan compliance
      </Typography>
      <Box sx={{ position: 'relative', width: 140, height: 140 }}>
        <Box component="svg" viewBox="0 0 140 140" sx={{ width: '100%', height: '100%' }}>
          <circle cx="70" cy="70" r="54" stroke={alpha(theme.palette.success.main, 0.15)} strokeWidth="12" fill="none" />
          <circle
            cx="70"
            cy="70"
            r="54"
            stroke={theme.palette.success.main}
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 70 70)"
          />
        </Box>
        <Stack
          spacing={0}
          alignItems="center"
          sx={{ position: 'absolute', inset: 0, justifyContent: 'center' }}
        >
          <Typography variant="h4" fontWeight={700}>
            {Math.round(pct)}%
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {stats.completed}/{stats.assigned} completed
          </Typography>
        </Stack>
      </Box>
      <Typography variant="body2" color="text.secondary">
        Track completion momentum over the week; connect athlete app for real-time updates.
      </Typography>
    </Box>
  );
};

const AthletePerformanceGraph = () => {
  const theme = useTheme();
  const width = 720;
  const height = 260;
  const padX = 32;
  const padY = 24;
  const innerWidth = width - padX * 2;
  const innerHeight = height - padY * 2;
  const series = DUMMY_LOAD_TREND;

  const buildPoints = (key: 'load' | 'risk') => {
    const values = series.map((point) => point[key]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = Math.max(max - min, 1e-6);
    return series.map((point, idx) => ({
      x: padX + (innerWidth * idx) / Math.max(series.length - 1, 1),
      y: padY + innerHeight - ((point[key] - min) / span) * innerHeight,
      value: point[key],
      label: point.label,
    }));
  };

  const loadPoints = buildPoints('load');
  const riskPoints = buildPoints('risk');
  const loadPath = loadPoints.map((pt, idx) => `${idx === 0 ? 'M' : 'L'}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(' ');
  const riskPath = riskPoints.map((pt, idx) => `${idx === 0 ? 'M' : 'L'}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(' ');
  const loadArea = `${loadPath} L ${padX + innerWidth},${padY + innerHeight} L ${padX},${padY + innerHeight} Z`;
  const avgLoad = Math.round(series.reduce((acc, point) => acc + point.load, 0) / series.length);
  const avgRisk = Math.round(series.reduce((acc, point) => acc + point.risk, 0) / series.length);

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        borderColor: alpha(theme.palette.primary.main, 0.12),
        background:
          theme.palette.mode === 'light'
            ? 'linear-gradient(150deg, rgba(255,255,255,0.96), rgba(239,244,255,0.92))'
            : 'linear-gradient(150deg, rgba(8,11,25,0.96), rgba(7,11,24,0.92))',
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
            <Box>
              <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>
                Weekly load vs dummy risk
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                Preview graph
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Chip size="small" label="Load" color="primary" variant="outlined" />
              <Chip size="small" label="Risk" color="success" variant="outlined" />
            </Stack>
          </Stack>

          <Box component="svg" viewBox={`0 0 ${width} ${height}`} sx={{ width: '100%', height: { xs: 220, md: 260 } }}>
            <defs>
              <linearGradient id="perfLoad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={alpha(theme.palette.primary.main, 0.3)} />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = padY + innerHeight * ratio;
              return (
                <line
                  key={`gl-${ratio}`}
                  x1={padX}
                  y1={y}
                  x2={padX + innerWidth}
                  y2={y}
                  stroke={alpha(theme.palette.text.primary, 0.08)}
                  strokeWidth={1}
                />
              );
            })}
            <path d={loadArea} fill="url(#perfLoad)" />
            <path d={loadPath} fill="none" stroke={theme.palette.primary.main} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            <path
              d={riskPath}
              fill="none"
              stroke={theme.palette.success.main}
              strokeWidth={2.2}
              strokeDasharray="8 6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {loadPoints.map((pt, idx) => (
              <circle key={`load-${idx}`} cx={pt.x} cy={pt.y} r={4} fill={theme.palette.primary.main} />
            ))}
            {riskPoints.map((pt, idx) => (
              <circle
                key={`risk-${idx}`}
                cx={pt.x}
                cy={pt.y}
                r={3.2}
                fill={theme.palette.background.paper}
                stroke={theme.palette.success.main}
                strokeWidth={2}
              />
            ))}
            {series.map((point, idx) => {
              const x = padX + (innerWidth * idx) / Math.max(series.length - 1, 1);
              return (
                <text
                  key={`perf-${point.label}`}
                  x={x}
                  y={height - 4}
                  textAnchor="middle"
                  fontSize={12}
                  fill={alpha(theme.palette.text.primary, 0.75)}
                >
                  {point.label}
                </text>
              );
            })}
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Stack spacing={0.25}>
              <Typography variant="caption" color="text.secondary">
                Avg load
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {avgLoad}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dummy data – hook up wearable once ready.
              </Typography>
            </Stack>
            <Stack spacing={0.25}>
              <Typography variant="caption" color="text.secondary">
                Avg risk
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {avgRisk}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Trending toward green zone.
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

/* --------------------------------------------
 * MAIN COMPONENT
 * -------------------------------------------*/
export const MovementPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const wearableIntegrationActive = isWearableIntegrationActive;
  const athleteIdFromProfile = user?.athleteId ?? '';

  // Form state
  const [athleteId, setAthleteId] = useState('');
  const [athleteDirectory, setAthleteDirectory] = useState<AthleteSummary[]>([]);
  const [athleteDirectoryLoading, setAthleteDirectoryLoading] = useState(false);
  const [athleteDirectoryError, setAthleteDirectoryError] = useState<string | null>(null);
  const [athleteInputValue, setAthleteInputValue] = useState('');
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
  const [leftTab, setLeftTab] = useState<'setup' | 'capture' | 'frames'>('setup');

  // Proof / micro-plan actions
  const [assigningProofId, setAssigningProofId] = useState<string | null>(null);
  const [completingProofId, setCompletingProofId] = useState<string | null>(null);
  const [completionDialog, setCompletionDialog] = useState<{ open: boolean; assessment: MovementAssessment | null; rpe: string; pain: string; }>({ open: false, assessment: null, rpe: '4', pain: '0' });

  // Details dialog
  const [detailAssessmentId, setDetailAssessmentId] = useState<string | null>(null);
  const detailAssessment = useMemo(() => history.find((item) => item.id === detailAssessmentId) ?? null, [history, detailAssessmentId]);
  const [progressData, setProgressData] = useState<AthleteProgressMetrics | null>(null);
  const [progressLoading, setProgressLoading] = useState(false);

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

  useEffect(() => {
    let active = true;
    setAthleteDirectoryLoading(true);
    fetchAthletes()
      .then((athletes) => {
        if (!active) return;
        setAthleteDirectory(athletes);
        setAthleteDirectoryError(null);
      })
      .catch((err) => {
        console.warn('Failed to load athletes', err);
        if (!active) return;
        setAthleteDirectory([]);
        setAthleteDirectoryError('Unable to load roster. Type an athlete ID manually.');
      })
      .finally(() => {
        if (active) setAthleteDirectoryLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (athleteId) return;
    setAthleteInputValue('');
  }, [athleteId]);

  useEffect(() => {
    if (!athleteId) return;
    const match = athleteDirectory.find((athlete) => athlete.id === athleteId);
    const label = match?.displayName ?? athleteId;
    setAthleteInputValue(label);
  }, [athleteId, athleteDirectory]);

  useEffect(() => {
    if (!detailAssessment?.athleteId) {
      setProgressData(null);
      return;
    }
    let active = true;
    setProgressLoading(true);
    fetchAthleteProgress(detailAssessment.athleteId)
      .then((metrics) => {
        if (!active) return;
        setProgressData(metrics);
      })
      .catch((error) => {
        console.warn('Failed to load athlete progress', error);
        if (!active) return;
        setProgressData(null);
      })
      .finally(() => {
        if (active) setProgressLoading(false);
      });
    return () => {
      active = false;
    };
  }, [detailAssessment?.athleteId]);

  const handleAthleteSelect = useCallback(
    (next: AthleteSummary | string | null) => {
      if (!next) {
        setAthleteId('');
        setAthleteInputValue('');
        return;
      }
      if (typeof next === 'string') {
        const trimmed = next.trim();
        if (!trimmed.length) return;
        setAthleteId(trimmed);
        setAthleteInputValue(trimmed);
        return;
      }
      setAthleteId(next.id);
      setAthleteInputValue(next.displayName ?? next.id);
    },
    [],
  );

  const handleAthleteInputCommit = useCallback(() => {
    const trimmed = athleteInputValue.trim();
    if (!trimmed.length) return;
    setAthleteId(trimmed);
  }, [athleteInputValue]);

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
    setLeftTab('frames');
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
  const captureUnlocked = useMemo(() => athleteId.trim().length > 0, [athleteId]);

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
      setLeftTab('capture');
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
    if (!athleteId.trim()) return;
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

  const sessionInsights = useMemo(() => {
    if (!history.length) return null;
    const parseTimestamp = (assessment: MovementAssessment) => {
      const primary = assessment.createdAt ?? undefined;
      const fallback = assessment.updatedAt ?? undefined;
      return Date.parse(primary ?? '') || Date.parse(fallback ?? '') || 0;
    };
    const sorted = [...history].sort((a, b) => parseTimestamp(b) - parseTimestamp(a));
    const total = sorted.length;
    const avgRisk = sorted.reduce((acc, assessment) => acc + (assessment.riskRating ?? 0), 0) / total;
    const highRiskCount = sorted.filter((assessment) => (assessment.riskRating ?? 0) >= 2).length;
    const verdicts = sorted.map(
      (assessment) => (assessment.verdict ?? assessment.proof?.verdict) as MovementVerdict | undefined,
    );
    const retakeCount = verdicts.filter((verdict) => verdict === 'retake').length;
    const passCount = verdicts.filter((verdict) => verdict === 'pass').length;
    const avgViewConfidence =
      sorted.reduce(
        (acc, assessment) =>
          acc + (assessment.viewQuality?.score0to1 ?? assessment.proof?.viewQuality?.score0to1 ?? 0),
        0,
      ) / total;
    const latest = sorted[0];
    const previous = sorted[1];
    const trend = previous ? (latest.riskRating ?? 0) - (previous.riskRating ?? 0) : 0;

    return {
      avgRisk,
      highRiskCount,
      retakeRate: retakeCount / total,
      passRate: passCount / total,
      avgViewConfidence,
      trend,
      latest,
      sampleSize: total,
    };
  }, [history]);

  const totalAssessments = history.length;
  const latestAssessment = sessionInsights?.latest ?? history[0] ?? null;
  const latestComputed = latestAssessment ? getAssessmentComputed(latestAssessment) : null;

  const sessionStatCards = useMemo(() => {
    if (!sessionInsights || !totalAssessments) return [];
    const passReps = Math.round(sessionInsights.passRate * totalAssessments);
    const retakeReps = Math.round(sessionInsights.retakeRate * totalAssessments);
    const viewConfidenceRaw = Number.isFinite(sessionInsights.avgViewConfidence)
      ? sessionInsights.avgViewConfidence
      : 0;
    const viewConfidencePct = Math.round(viewConfidenceRaw * 100);
    const trendValue = sessionInsights.trend;
    const trendLabel =
      trendValue === 0
        ? 'No change vs last rep'
        : `${trendValue > 0 ? '+' : '-'}${Math.abs(trendValue).toFixed(1)} vs last rep`;
    const trendTone =
      trendValue === 0 ? 'text.secondary' : trendValue > 0 ? 'error.main' : 'success.main';

    return [
      {
        key: 'avg-risk',
        icon: <TrendingUpIcon fontSize="small" />,
        label: 'Avg risk score',
        value: Number.isFinite(sessionInsights.avgRisk) ? sessionInsights.avgRisk.toFixed(1) : '—',
        caption: `${sessionInsights.highRiskCount}/${totalAssessments} high-risk reps`,
        trend: trendValue,
        trendLabel,
        trendTone,
      },
      {
        key: 'pass-rate',
        icon: <InsightsIcon fontSize="small" />,
        label: 'Pass rate',
        value: `${Math.round(sessionInsights.passRate * 100)}%`,
        caption: `${passReps} passes`,
        trendLabel: '',
      },
      {
        key: 'retake-rate',
        icon: <ReplayIcon fontSize="small" />,
        label: 'Retake frequency',
        value: `${Math.round(sessionInsights.retakeRate * 100)}%`,
        caption: `${retakeReps} retakes`,
        trendLabel: '',
      },
      {
        key: 'view-confidence',
        icon: <SpeedIcon fontSize="small" />,
        label: 'View confidence',
        value: `${viewConfidencePct}%`,
        caption: 'Camera quality',
        trendLabel: '',
      },
    ];
  }, [sessionInsights, totalAssessments]);

  /* -------------------------
   * RENDER
   * ------------------------*/
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

              {progressLoading && <LinearProgress />}
              {progressData && <AthleteProgressCard data={progressData} />}

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

              {detailAssessment.cues?.length ? (
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {detailAssessment.cues.map((cue) => <Chip key={cue} size="small" variant="outlined" label={cue} />)}
                </Stack>
              ) : null}

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

      {/* HERO / HEADER */}
      <Box
        sx={(t) => ({
          position: 'relative',
          py: { xs: 5, md: 7 },
          px: { xs: 2, md: 6 },
          background:
            t.palette.mode === 'light'
              ? 'radial-gradient(1200px 300px at 20% -10%, rgba(99,245,197,0.20), transparent 60%), linear-gradient(180deg, #ffffff, #f6f8ff)'
              : 'radial-gradient(1200px 300px at 20% -10%, rgba(99,245,197,0.08), transparent 60%), linear-gradient(180deg, #0b0f26, #0a0e20)',
        })}
      >
        <Stack spacing={1} sx={{ maxWidth: 1400, mx: 'auto' }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
            <Stack spacing={1}>
              <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 2 }}>
                Movement coach
              </Typography>
              <Typography variant="h4" fontWeight={800} lineHeight={1.15}>
                Movement Intelligence Console
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 720 }}>
                Capture, analyze, and act on lower-extremity movement with a clear, coach-ready workflow.
              </Typography>
            </Stack>
            {latestComputed?.verdict && (
              <Chip
                color={verdictColorMap[latestComputed.verdict]}
                sx={{ alignSelf: { xs: 'flex-start', md: 'center' }, fontWeight: 600 }}
                label={`Latest verdict · ${verdictLabelMap[latestComputed.verdict]}`}
              />
            )}
          </Stack>

          {/* KPI STRIP */}
          {sessionStatCards.length > 0 && (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {sessionStatCards.map((card) => (
                <Grid key={card.key} item xs={12} sm={6} md={3}>
                  <Paper
                    variant="outlined"
                    sx={(theme) => ({
                      borderRadius: 4,
                      p: 2.25,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      background:
                        theme.palette.mode === 'light'
                          ? 'linear-gradient(160deg, rgba(255,255,255,0.92) 0%, rgba(241,244,253,0.85) 100%)'
                          : 'linear-gradient(160deg, rgba(17, 24, 51, 0.82) 0%, rgba(8, 12, 30, 0.92) 100%)',
                    })}
                  >
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <Box
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: '50%',
                          display: 'grid',
                          placeItems: 'center',
                          bgcolor: 'action.hover',
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        {card.icon}
                      </Box>
                      <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.5 }}>
                        {card.label}
                      </Typography>
                    </Stack>
                    <Typography variant="h4" fontWeight={800}>
                      {card.value}
                    </Typography>
                    {card.trendLabel && (
                      <Typography variant="caption" color={card.trendTone ?? 'text.secondary'}>
                        {card.trendLabel}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 'auto' }}>
                      {card.caption}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Stack>
      </Box>

      {/* BODY */}
      <Box sx={{ px: { xs: 2, md: 6 }, py: { xs: 4, md: 6 } }}>
        <Stack spacing={3} sx={{ maxWidth: 1400, mx: 'auto' }}>

          <Grid container spacing={3}>
            {/* LEFT: TABBED FLOW */}
            <Grid item xs={12} md={8}>
              <Paper
                variant="outlined"
                sx={(t) => ({
                  borderRadius: 4,
                  p: 0,
                  overflow: 'hidden',
                  background:
                    t.palette.mode === 'light'
                      ? 'linear-gradient(180deg, rgba(255,255,255,0.86), rgba(248,250,255,0.9))'
                      : 'linear-gradient(180deg, rgba(17,20,42,0.8), rgba(10,14,32,0.92))',
                })}
              >
                <Box sx={{ px: { xs: 2, md: 3 }, pt: 2 }}>
                  <Tabs
                    value={leftTab}
                    onChange={(_, v) => setLeftTab(v)}
                    aria-label="workflow tabs"
                    sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 } }}
                  >
                    <Tab value="setup" label="Setup" />
                    <Tab value="capture" label="Capture" />
                    <Tab value="frames" label={`Frames${validFrames.length ? ` (${validFrames.length})` : ''}`} />
                  </Tabs>
                </Box>

                <Divider />

                {/* SETUP */}
                {leftTab === 'setup' && (
                  <Stack spacing={3} sx={{ p: { xs: 2.5, md: 3.5 } }}>
                    {submitting && <LinearProgress sx={{ borderRadius: 999 }} />}

                    <ErrorAlert message={error} />

                    <Grid container spacing={2.5}>
                      <Grid item xs={12} md={6}>
                        <Paper variant="outlined" sx={{ p: 2.5 }}>
                          <Stack spacing={2}>
                            <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>
                              Athlete & drill
                            </Typography>
                            <Autocomplete
                              freeSolo
                              options={athleteDirectory}
                              loading={athleteDirectoryLoading}
                              value={athleteDirectory.find((ath) => ath.id === athleteId) ?? null}
                              inputValue={athleteInputValue}
                              onInputChange={(_, newValue, reason) => {
                                if (reason === 'reset') return;
                                setAthleteInputValue(newValue);
                                if (reason === 'clear') {
                                  setAthleteId('');
                                }
                              }}
                              onChange={(_, newValue) => handleAthleteSelect(newValue)}
                              getOptionLabel={(option) =>
                                typeof option === 'string' ? option : option.displayName ?? option.id
                              }
                              isOptionEqualToValue={(option, value) => option.id === value.id}
                              noOptionsText={athleteDirectoryLoading ? 'Loading roster…' : 'No matches'}
                              renderOption={(props, option) => (
                                <li {...props}>
                                  <Stack spacing={0}>
                                    <Typography fontWeight={600}>{option.displayName ?? option.id}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {(option.team ?? '—') + ' • ' + option.id}
                                    </Typography>
                                  </Stack>
                                </li>
                              )}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Select athlete"
                                  placeholder="Start typing a name or ID"
                                  onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                      event.preventDefault();
                                      handleAthleteInputCommit();
                                    }
                                  }}
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                      <>
                                        {athleteDirectoryLoading ? (
                                          <CircularProgress color="inherit" size={16} />
                                        ) : null}
                                        {params.InputProps.endAdornment}
                                      </>
                                    ),
                                  }}
                                />
                              )}
                            />
                            {athleteDirectoryError && (
                              <Typography variant="caption" color="error">
                                {athleteDirectoryError}
                              </Typography>
                            )}
                            <TextField
                              label="Drill type"
                              select
                              value={drillType}
                              onChange={(e) => setDrillType(e.target.value as DrillType)}
                              fullWidth
                            >
                              {DRILL_TYPES.map((type) => (
                                <MenuItem key={type} value={type}>
                                  {type.replace('_', ' ')}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Stack>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Paper variant="outlined" sx={{ p: 2.5, height: '100%' }}>
                          <Stack spacing={2}>
                            <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>
                              Environment
                            </Typography>
                            <TextField label="Surface" value={surface} onChange={(e) => setSurface(e.target.value)} />
                            <Stack direction="row" spacing={1.5}>
                              <TextField label="Temp °F" value={temperatureF} onChange={(e) => setTemperatureF(e.target.value)} type="number" />
                              <TextField label="Humidity %" value={humidityPct} onChange={(e) => setHumidityPct(e.target.value)} type="number" />
                            </Stack>
                            <Button
                              variant="outlined"
                              startIcon={<MyLocationIcon />}
                              onClick={fetchEnvironmentSnapshot}
                              disabled={autoWeatherLoading}
                            >
                              {autoWeatherLoading ? 'Fetching conditions…' : 'Auto-fill from location'}
                            </Button>
                            {autoWeatherTimestamp && (
                              <Typography variant="caption" color="text.secondary">
                                Synced {formatDateTime(autoWeatherTimestamp)}
                              </Typography>
                            )}
                            {autoWeatherError && <Typography variant="caption" color="error">{autoWeatherError}</Typography>}
                          </Stack>
                        </Paper>
                      </Grid>
                    </Grid>

                    <TextField
                      label="Additional context"
                      multiline
                      minRows={3}
                      value={environment}
                      onChange={(e) => setEnvironment(e.target.value)}
                      placeholder="Camera high-left · fatigue session · post-practice recovery"
                      fullWidth
                    />
                  </Stack>
                )}

                {/* CAPTURE */}
                {leftTab === 'capture' && (
                  <Box
                    onDrop={captureUnlocked ? onDrop : undefined}
                    onDragOver={captureUnlocked ? onDragOver : undefined}
                    sx={(theme) => ({
                      p: { xs: 2.5, md: 3.5 },
                      borderRadius: 0,
                      background:
                        theme.palette.mode === 'light'
                          ? 'linear-gradient(135deg, rgba(53,99,255,0.06) 0%, rgba(227,234,255,0.35) 100%)'
                          : 'linear-gradient(135deg, rgba(34,45,94,0.6) 0%, rgba(13,18,41,0.82) 100%)',
                    })}
                  >
                    {captureUnlocked ? (
                      <Stack spacing={3}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                        <Button
                          variant="contained"
                          startIcon={isRecording ? <StopCircleIcon /> : <VideocamIcon />}
                          onClick={isRecording ? stopRecording : startRecording}
                          disabled={!captureUnlocked || !cameraSupported || processingVideo || uploadingMedia}
                        >
                          {isRecording ? 'Stop & analyze clip' : 'Live capture'}
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<AddPhotoAlternateIcon />}
                          onClick={() => {
                            if (!captureUnlocked || processingVideo || uploadingMedia || isRecording) return;
                            videoInputRef.current?.click();
                          }}
                          disabled={!captureUnlocked || processingVideo || uploadingMedia || isRecording}
                        >
                          Upload media
                        </Button>
                        {wearableIntegrationActive && (
                          <Button
                            variant="outlined"
                            startIcon={<SensorsIcon />}
                            onClick={() => navigate('/wearables')}
                            disabled={!captureUnlocked}
                          >
                            Connect wearable
                          </Button>
                        )}
                        {cameraActive && (
                          <Button variant="text" startIcon={<CancelIcon />} onClick={cancelRecording}>
                            Cancel
                          </Button>
                        )}
                      </Stack>

                      <ErrorAlert message={captureError} />

                      {analyzingCapture && (
                        <Paper
                          elevation={0}
                          sx={{
                            borderRadius: 3,
                            p: { xs: 3, md: 3.5 },
                            border: '1px solid rgba(17, 38, 146, 0.18)',
                            background: 'linear-gradient(135deg, rgba(53,99,255,0.12) 0%, rgba(22,27,65,0.92) 65%)',
                            color: '#fff',
                            boxShadow: '0 18px 45px rgba(17, 38, 146, 0.28)',
                          }}
                        >
                          <Stack spacing={2} alignItems="flex-start">
                            <Typography variant="subtitle1" fontWeight={700}>Analyzing clip…</Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.72)' }}>
                              Extracting key frames and preparing them for the movement model.
                            </Typography>
                            <LinearProgress
                              sx={{
                                width: '100%',
                                height: 8,
                                borderRadius: 999,
                                backgroundColor: 'rgba(255,255,255,0.18)',
                                '& .MuiLinearProgress-bar': { borderRadius: 999, backgroundImage: 'linear-gradient(90deg, #63f5c5 0%, #3590ff 100%)' },
                              }}
                            />
                          </Stack>
                        </Paper>
                      )}

                      {!analyzingCapture && (
                        <Paper
                          variant="outlined"
                          sx={{
                            borderRadius: 3,
                            borderStyle: 'dashed',
                            borderColor: 'rgba(17,38,146,0.25)',
                            p: { xs: 3, md: 4 },
                          }}
                        >
                          <Stack spacing={1}>
                            <Typography fontWeight={700}>Drop zone</Typography>
                            <Typography variant="body2" color="text.secondary">
                              Drag & drop a clip or stills, or paste screenshots with ⌘/Ctrl + V. We’ll auto-label Landing, Plant, and Push-off.
                            </Typography>
                          </Stack>
                        </Paper>
                      )}
                      </Stack>
                    ) : (
                      <Stack
                        spacing={1.5}
                        alignItems="center"
                        justifyContent="center"
                        sx={{ minHeight: 320, textAlign: 'center' }}
                      >
                        <SensorsIcon color="primary" sx={{ fontSize: 48 }} />
                        <Typography variant="h6" fontWeight={600}>
                          Select an athlete to start capture
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Pick an athlete in Setup to unlock camera tools and uploads.
                        </Typography>
                      </Stack>
                    )}
                  </Box>
                )}

                {/* FRAMES */}
                {leftTab === 'frames' && (
                  <Stack spacing={2.5} sx={{ p: { xs: 2.5, md: 3.5 } }}>
                    {frameMode === 'summary' && validFrames.length > 0 ? (
                      <>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={700}>
                              {validFrames.length} key frame{validFrames.length > 1 ? 's' : ''} captured
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              These frames will be submitted when you create the AI assessment.
                            </Typography>
                          </Box>
                          <Stack direction="row" spacing={1}>
                            <Button size="small" variant="outlined" startIcon={<KeyboardIcon />} onClick={() => setFrameMode('edit')}>
                              Adjust frames
                            </Button>
                            <Button size="small" variant="text" startIcon={<ReplayIcon />} onClick={() => { setFrames([createFrameDraft()]); setFrameMode('edit'); }}>
                              Retake
                            </Button>
                          </Stack>
                        </Stack>
                        <Grid container spacing={1.5}>
                          {validFrames.map((frame, idx) => (
                            <Grid key={frame.id} item xs={12} sm={6}>
                              <Paper
                                variant="outlined"
                                sx={{
                                  borderRadius: 3,
                                  px: 2,
                                  py: 1.5,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 2,
                                }}
                              >
                                <Avatar
                                  variant="rounded"
                                  sx={{ width: 64, height: 64, borderRadius: 3 }}
                                  src={/^https?:\/\//.test(frame.url) ? frame.url : undefined}
                                >
                                  {frame.label?.slice(0, 1) ?? idx + 1}
                                </Avatar>
                                <Stack spacing={0.5} flex={1}>
                                  <Typography fontWeight={700}>{frame.label ?? `Frame ${idx + 1}`}</Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {formatDateTime(frame.capturedAt)}
                                  </Typography>
                                </Stack>
                                <Tooltip title="Copy URL">
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      if (navigator?.clipboard?.writeText) {
                                        navigator.clipboard
                                          .writeText(frame.url)
                                          .then(() => setToast({ open: true, severity: 'info', msg: 'Frame URL copied' }))
                                          .catch(() =>
                                            setToast({
                                              open: true,
                                              severity: 'warning',
                                              msg: 'Unable to copy URL automatically',
                                            }),
                                          );
                                      }
                                    }}
                                  >
                                    <ContentPasteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      </>
                    ) : (
                      <>
                        {frames.map((frame, index) => (
                          <Paper key={frame.id} variant="outlined" sx={{ borderRadius: 3 }}>
                            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                              <Stack spacing={2}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Chip label={`Frame ${index + 1}`} color={index === 0 ? 'primary' : 'default'} size="small" />
                                  {!!frame.label && <Chip label={frame.label} size="small" variant="outlined" />}
                                  <Tooltip title="Remove frame">
                                    <IconButton size="small" onClick={() => setFrames((prev) => prev.filter((f) => f.id !== frame.id))}>
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Stack>
                                <Grid container spacing={2}>
                                  <Grid item xs={12} md={7}>
                                    <TextField
                                      label="Media URL"
                                      placeholder="https://…"
                                      value={frame.url}
                                      onChange={(e) =>
                                        setFrames((prev) =>
                                          prev.map((f) => (f.id === frame.id ? { ...f, url: e.target.value } : f)),
                                        )
                                      }
                                      helperText="Upload stills or paste secure S3/HTTPS links."
                                      fullWidth
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={5}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                      <Avatar
                                        variant="rounded"
                                        sx={{ width: 72, height: 72, bgcolor: 'background.default' }}
                                        src={/^https?:\/\//.test(frame.url) ? frame.url : undefined}
                                      >
                                        {!frame.url && 'No preview'}
                                      </Avatar>
                                      <Stack spacing={1} flex={1}>
                                        <TextField
                                          label="Label"
                                          placeholder="Landing frame"
                                          value={frame.label}
                                          onChange={(e) =>
                                            setFrames((prev) =>
                                              prev.map((f) => (f.id === frame.id ? { ...f, label: e.target.value } : f)),
                                            )
                                          }
                                        />
                                        <TextField
                                          label="Captured at"
                                          type="datetime-local"
                                          value={frame.capturedAt.slice(0, 16)}
                                          onChange={(e) =>
                                            setFrames((prev) =>
                                              prev.map((f) =>
                                                f.id === frame.id
                                                  ? { ...f, capturedAt: new Date(e.target.value).toISOString() }
                                                  : f,
                                              ),
                                            )
                                          }
                                        />
                                      </Stack>
                                    </Stack>
                                  </Grid>
                                </Grid>
                              </Stack>
                            </CardContent>
                          </Paper>
                        ))}
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                          <Button
                            startIcon={<AddPhotoAlternateIcon />}
                            onClick={() => {
                              setFrameMode('edit');
                              setFrames((prev) => [...prev, createFrameDraft()]);
                            }}
                            variant="text"
                          >
                            Add another frame
                          </Button>
                          <Button startIcon={<ReplayIcon />} variant="text" onClick={() => { setFrames([createFrameDraft()]); setFrameMode('edit'); }}>
                            Reset frames
                          </Button>
                        </Stack>
                        {frames.every((frame) => !frame.url.trim()) && (
                          <Paper
                            variant="outlined"
                            sx={{
                              borderRadius: 3,
                              borderStyle: 'dashed',
                              borderColor: 'rgba(17,38,146,0.35)',
                              p: { xs: 3, md: 4 },
                              backgroundColor: 'rgba(53,99,255,0.06)',
                            }}
                          >
                            <Stack spacing={1}>
                              <Typography fontWeight={700}>Quick tips</Typography>
                              <Typography variant="body2" color="text.secondary">
                                Drag & drop a clip or stills here, or paste screenshots with ⌘/Ctrl + V. We’ll auto-label landing, plant, and push-off frames.
                              </Typography>
                            </Stack>
                          </Paper>
                        )}
                      </>
                    )}
                  </Stack>
                )}

                {/* STICKY ACTION BAR */}
                <Divider />
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.5}
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                  justifyContent="space-between"
                  sx={{ p: { xs: 2, md: 3 }, position: 'sticky', bottom: 0, backdropFilter: 'blur(8px)', backgroundColor: 'background.paper' }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {validFrames.length ? `${validFrames.length} frame${validFrames.length > 1 ? 's' : ''} ready` : 'No frames added yet'}
                  </Typography>
                  <Stack direction="row" spacing={1.25} justifyContent="flex-end">
                    <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => { setFrames([createFrameDraft()]); setLeftTab('capture'); setFrameMode('edit'); }}>
                      Reset
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<CheckCircleIcon />}
                      onClick={handleSubmit}
                      disabled={submitting || validFrames.length === 0 || !athleteId.trim()}
                    >
                      {submitting ? 'Creating assessment…' : 'Create AI assessment'}
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>

            {/* RIGHT: CONTEXT & HISTORY */}
            <Grid item xs={12} md={4}>
              {/* Latest */}
              <Paper sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 4 }}>
                {latestAssessment ? (
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <Box
                        sx={{
                          width: 38,
                          height: 38,
                          borderRadius: '50%',
                          display: 'grid',
                          placeItems: 'center',
                          bgcolor: 'action.hover',
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <QueryStatsIcon fontSize="small" />
                      </Box>
                      <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 2 }}>
                        Latest assessment
                      </Typography>
                    </Stack>
                    <Typography variant="h6" fontWeight={800}>
                      {latestAssessment.overview?.headline ?? 'Movement assessment'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {latestAssessment.overview?.summary ??
                        'Review the newest AI cues, risk signals, and overlays before you brief the athlete.'}
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Chip
                        size="small"
                        color={latestAssessment.riskRating >= 2 ? 'secondary' : 'success'}
                        label={`Risk ${latestAssessment.riskRating}/3`}
                      />
                      {latestComputed?.verdict && (
                        <Chip size="small" color={verdictColorMap[latestComputed.verdict]} label={verdictLabelMap[latestComputed.verdict]} />
                      )}
                      {typeof latestComputed?.viewScore === 'number' && (
                        <Chip size="small" variant="outlined" label={`View ${(latestComputed.viewScore * 100).toFixed(0)}%`} />
                      )}
                    </Stack>
                    {latestComputed?.cues?.length ? (
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {latestComputed.cues.slice(0, 3).map((cue) => (
                          <Chip key={`latest-cue-${cue}`} size="small" variant="outlined" label={cue} />
                        ))}
                      </Stack>
                    ) : null}
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                      <Typography variant="caption" color="text.secondary">
                        {formatDateTime(latestAssessment.createdAt ?? latestAssessment.updatedAt ?? new Date().toISOString())}
                      </Typography>
                      <Button
                        size="small"
                        variant="contained"
                        endIcon={<NorthEastIcon fontSize="small" />}
                        onClick={() => setDetailAssessmentId(latestAssessment.id)}
                      >
                        Review
                      </Button>
                    </Stack>
                  </Stack>
                ) : (
                  <Stack spacing={1.25}>
                    <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 2 }}>
                      Quick start
                    </Typography>
                    <Typography variant="h6" fontWeight={800}>
                      Record your first assessment
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Drag in a clip or grab three stills—landing, plant, push-off. We’ll build cues and a coach-ready micro-plan.
                    </Typography>
                  </Stack>
                )}
              </Paper>

              {/* History */}
              <Paper sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 4, mt: 3 }}>
                {loadingHistory && <LinearProgress sx={{ borderRadius: 999, mb: 2 }} />}
                <Stack spacing={1}>
                  <Typography variant="h6" fontWeight={800}>Recent assessments</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last 10 with verdicts & camera confidence.
                  </Typography>
                </Stack>

                <Stack spacing={2.25} sx={{ mt: 2 }}>
                  {!loadingHistory && history.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Nothing yet—create an assessment to see it here.
                    </Typography>
                  )}

                  {history.map((assessment) => {
                    const { verdict, viewScore, viewLabel, uncertainty, proofTimestamp, cues } = getAssessmentComputed(assessment);
                    const summaryText =
                      assessment.overview?.summary ?? 'Open to review cues, metrics, overlays, and micro-plan.';

                  return (
  <Paper
    key={assessment.id}
    variant="outlined"
    sx={(t) => ({
      ...safeCardSx(t),
      backgroundImage:
        'linear-gradient(140deg, rgba(53,99,255,0.06) 0%, rgba(99,245,197,0.06) 100%)',
    })}
  >
    <Stack spacing={1.75} sx={{ minWidth: 0 }}>
      {/* Header */}
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        sx={{ gap: 1.25, flexWrap: 'wrap', minWidth: 0 }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1, display: 'block' }}>
            {assessment.drillType.replace('_', ' ')} • {formatDateTime(assessment.createdAt)}
          </Typography>
          <Typography variant="subtitle1" fontWeight={700} sx={clamp1}>
            {assessment.overview?.headline ?? 'Movement assessment'}
          </Typography>
        </Box>

        {/* Right chip cluster (wrap-safe) */}
        <Box sx={chipWrapSx}>
          {verdict && (
            <Chip size="small" color={verdictColorMap[verdict]} label={verdictLabelMap[verdict]} />
          )}
          <Chip
            size="small"
            label={`Risk ${assessment.riskRating}/3`}
            color={assessment.riskRating >= 2 ? 'secondary' : 'primary'}
          />
          {typeof uncertainty === 'number' && (
            <Chip
              size="small"
              variant="outlined"
              color="warning"
              label={`Uncertainty ${(uncertainty * 100).toFixed(0)}%`}
            />
          )}
          {viewScore !== null && (
            <Chip size="small" variant="outlined" label={`Confidence ${(viewScore * 100).toFixed(0)}%`} />
          )}
          {viewLabel && <Chip size="small" variant="outlined" label={`View ${viewLabel}`} />}
        </Box>
      </Stack>

      {/* Summary (clamped to 3 lines) */}
      <Typography variant="body2" color="text.secondary" sx={clamp3}>
        {summaryText}
      </Typography>

      {/* Cues row */}
      {cues.length > 0 && (
        <Box sx={chipWrapSx}>
          {cues.slice(0, 3).map((cue) => (
            <Chip key={`${assessment.id}-cue-${cue}`} size="small" variant="outlined" label={cue} />
          ))}
        </Box>
      )}

      {/* Footer */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ gap: 1, flexWrap: 'wrap', minWidth: 0 }}
      >
        <Typography variant="caption" color="text.secondary" sx={clamp2}>
          Proof updated{' '}
          {proofTimestamp ? formatDateTime(proofTimestamp) : formatDateTime(assessment.updatedAt ?? assessment.createdAt)}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          <Button size="small" variant="outlined" onClick={() => setDetailAssessmentId(assessment.id)}>
            View
          </Button>
          <Button
            size="small"
            variant={assessment.proof?.fixAssigned ? 'contained' : 'outlined'}
            startIcon={<CheckCircleIcon />}
            onClick={() => handleQuickAssign(assessment)}
            disabled={assigningProofId === assessment.id}
          >
            {assessment.proof?.fixAssigned ? 'Assigned' : 'Assign'}
          </Button>
          <Button
            size="small"
            onClick={() => openCompletionDialog(assessment)}
            disabled={!!assessment.proof?.completion?.completed || completingProofId === assessment.id}
          >
            {assessment.proof?.completion?.completed ? 'Completed' : 'Log'}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  </Paper>
);

                  })}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </>
  );
};
