import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import InsightsIcon from '@mui/icons-material/Insights';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import HealingIcon from '@mui/icons-material/Healing';
import { formatDistanceToNow } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';
import { fetchAthleteDetail, fetchAthletes } from '@/api/athletes';
import { useAuth } from '@/hooks/useAuth';
import type { AthleteDashboard, AthleteSummary, DrillType, RiskLevel } from '@/types';

export const OverviewPage = () => {
  const { user } = useAuth();
  const [teamAthletes, setTeamAthletes] = useState<AthleteSummary[]>([]);
  const [personalAthlete, setPersonalAthlete] = useState<AthleteDashboard | null>(null);
  const [personalLoading, setPersonalLoading] = useState(false);
  const [personalError, setPersonalError] = useState<string | null>(null);

  const isAthleteView = Boolean(user?.role === 'ATHLETE' && user.athleteId);

  useEffect(() => {
    if (isAthleteView) {
      return;
    }
    let cancelled = false;
    fetchAthletes()
      .then((list) => {
        if (!cancelled) {
          setTeamAthletes(list);
        }
      })
      .catch((error) => {
        console.warn('Failed to load athletes', error);
      });
    return () => {
      cancelled = true;
    };
  }, [isAthleteView]);

  useEffect(() => {
    if (!isAthleteView || !user?.athleteId) {
      return;
    }
    let cancelled = false;
    setPersonalLoading(true);
    setPersonalError(null);
    fetchAthleteDetail(user.athleteId)
      .then((detail) => {
        if (!cancelled) {
          setPersonalAthlete(detail);
        }
      })
      .catch((error) => {
        console.warn('Failed to load athlete dashboard', error);
        if (!cancelled) {
          setPersonalError('Unable to load your latest readiness data.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setPersonalLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isAthleteView, user?.athleteId]);

  if (isAthleteView) {
    return (
      <PersonalOverview
        athlete={personalAthlete}
        loading={personalLoading}
        error={personalError}
      />
    );
  }

  return <TeamPulseOverview athletes={teamAthletes} />;
};

const TeamPulseOverview = ({ athletes }: { athletes: AthleteSummary[] }) => (
  <Box>
    <Typography variant="h4" fontWeight={600} gutterBottom>
      Team Pulse
    </Typography>
    <Typography variant="body1" color="text.secondary" gutterBottom>
      Live status across movement screenings, daily risk, and rehab readiness.
    </Typography>

    <Grid container spacing={3} sx={{ mt: 1 }}>
      <Grid item xs={12} md={4}>
        <SummaryCard
          icon={<EmojiEventsIcon color="primary" />}
          title="Active athletes"
          value={athletes.length}
          description="Profiles linked to daily monitoring"
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <SummaryCard
          icon={<MonitorHeartIcon color="error" />}
          title="Tracked teams"
          value={new Set(
            athletes
              .map((athlete) => athlete.team)
              .filter((team): team is string => Boolean(team))
          ).size}
          description="Distinct squads reporting daily risk"
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <SummaryCard
          icon={<InsightsIcon color="success" />}
          title="Positions covered"
          value={new Set(
            athletes
              .map((athlete) => athlete.position)
              .filter((pos): pos is string => Boolean(pos))
          ).size}
          description="Roles with validated baselines"
        />
      </Grid>
    </Grid>
  </Box>
);

const PersonalOverview = ({
  athlete,
  loading,
  error,
}: {
  athlete: AthleteDashboard | null;
  loading: boolean;
  error: string | null;
}) => {
  if (loading) {
    return (
      <Box>
        <Skeleton variant="rectangular" height={140} sx={{ mb: 3, borderRadius: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 3 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 3 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 3 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!athlete) {
    return (
      <Alert severity="warning">
        Your account is not currently linked to an athlete profile. Please contact your staff lead.
      </Alert>
    );
  }

  const latestMovement = pickLatest(athlete.movementSessions);
  const latestRisk = pickLatest(athlete.riskSnapshots);
  const latestRehab = pickLatest(athlete.rehabAssessments);

  return (
    <Box>
      <Card sx={{ mb: 3, borderRadius: 3, background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: '#fff' }}>
        <CardContent>
          <Stack spacing={1.2}>
            <Typography variant="overline" sx={{ letterSpacing: 1.1 }}>
              Personal ACL Readiness
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              Hey {athlete.displayName}, here is your pivot-proof pulse.
            </Typography>
            <Typography variant="body1" color="rgba(255,255,255,0.8)">
              {[athlete.team, athlete.sport, athlete.position].filter(Boolean).join(' • ') || 'Profile linked'}
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1.5}>
              <StatusChip
                label="Risk"
                value={latestRisk ? formatRiskLabel(latestRisk.riskLevel) : 'Awaiting check-in'}
                icon={<FavoriteIcon fontSize="small" />}
                tone={latestRisk?.riskLevel}
              />
              <StatusChip
                label="Movement"
                value={latestMovement ? `Risk ${latestMovement.riskRating}/3` : 'Capture pending'}
                icon={<DirectionsRunIcon fontSize="small" />}
                tone={latestMovement ? levelFromRiskScore(latestMovement.riskRating) : undefined}
              />
              <StatusChip
                label="Rehab"
                value={latestRehab ? `${latestRehab.limbSymmetryScore}% LSI` : 'No recent hop test'}
                icon={<HealingIcon fontSize="small" />}
                tone={latestRehab ? (latestRehab.cleared ? 'green' : 'yellow') : undefined}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <InsightCard
            title="Movement IQ"
            subtitle={latestMovement ? humanizeDrill(latestMovement.drillType) : 'No capture yet'}
            updatedAt={latestMovement?.createdAt}
            metrics={[
              {
                label: 'KAM score',
                value:
                  latestMovement?.metrics?.kneeValgusScore !== undefined
                    ? latestMovement.metrics.kneeValgusScore.toFixed(1)
                    : '—',
              },
              {
                label: 'Risk rating',
                value: latestMovement ? `${latestMovement.riskRating}/3` : '—',
              },
            ]}
            emptyMessage="Record a drop jump or cut to unlock personalized cues."
            actionHref="/movement"
            actionLabel="Open Movement Coach"
          >
            {latestMovement?.cues?.length ? (
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {latestMovement.cues.slice(0, 3).map((cue) => (
                  <Chip key={cue} label={cue} size="small" />
                ))}
              </Stack>
            ) : null}
          </InsightCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <InsightCard
            title="Daily Risk"
            subtitle={latestRisk ? formatRiskLabel(latestRisk.riskLevel) : 'No check-in yet'}
            updatedAt={latestRisk?.createdAt}
            metrics={[
              {
                label: 'Exposure',
                value: latestRisk ? `${latestRisk.exposureMinutes} min` : '—',
              },
              {
                label: 'Temperature',
                value: latestRisk ? `${latestRisk.temperatureF}°F` : '—',
              },
            ]}
            emptyMessage="Log today’s soreness & environment to unlock guidance."
            actionHref="/risk"
            actionLabel="Update risk snapshot"
          >
            {latestRisk?.changeToday ? (
              <Typography variant="body2" color="text.secondary">
                Change today: {latestRisk.changeToday}
              </Typography>
            ) : null}
          </InsightCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <InsightCard
            title="Rehab / RTS"
            subtitle={latestRehab ? (latestRehab.cleared ? 'Cleared' : 'Still building') : 'Awaiting assessment'}
            updatedAt={latestRehab?.createdAt ?? latestRehab?.sessionDate ?? undefined}
            metrics={[
              {
                label: 'LSI',
                value: latestRehab ? `${latestRehab.limbSymmetryScore}%` : '—',
              },
              {
                label: 'Form grade',
                value: latestRehab?.formGrade ?? '—',
              },
            ]}
            emptyMessage="Upload hop tests or iso strength to refresh your gate status."
            actionHref="/rehab"
            actionLabel="Review rehab gates"
          >
            {latestRehab?.concerns?.length ? (
              <Typography variant="body2" color="text.secondary">
                Focus: {latestRehab.concerns.slice(0, 2).join(', ')}
              </Typography>
            ) : null}
          </InsightCard>
        </Grid>
      </Grid>
    </Box>
  );
};

const SummaryCard = ({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  description: string;
}) => (
  <Card>
    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{ fontSize: 38, display: 'flex' }}>{icon}</Box>
      <Box>
        <Typography variant="overline" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h4" fontWeight={700}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

const InsightCard = ({
  title,
  subtitle,
  updatedAt,
  metrics,
  emptyMessage,
  actionHref,
  actionLabel,
  children,
}: {
  title: string;
  subtitle: string;
  updatedAt?: string;
  metrics: { label: string; value: string }[];
  emptyMessage: string;
  actionHref: string;
  actionLabel: string;
  children?: React.ReactNode;
}) => (
  <Card sx={{ height: '100%' }}>
    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
      <Box>
        <Typography variant="overline" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h6" fontWeight={600}>
          {subtitle}
        </Typography>
        {updatedAt && (
          <Typography variant="caption" color="text.secondary">
            Updated {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
          </Typography>
        )}
      </Box>
      {!updatedAt ? (
        <EmptyState title="No data yet" description={emptyMessage} />
      ) : (
        <Stack spacing={1}>
          {metrics.map((metric) => (
            <MetricBadge key={metric.label} label={metric.label} value={metric.value} />
          ))}
          {children}
        </Stack>
      )}
      <Box sx={{ flexGrow: 1 }} />
      <Button
        component={RouterLink}
        to={actionHref}
        variant="outlined"
        size="small"
        endIcon={<ArrowForwardIcon fontSize="small" />}
      >
        {actionLabel}
      </Button>
    </CardContent>
  </Card>
);

const MetricBadge = ({ label, value }: { label: string; value: string }) => (
  <Box
    sx={{
      p: 1.5,
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'divider',
      display: 'flex',
      flexDirection: 'column',
      gap: 0.5,
    }}
  >
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="subtitle1" fontWeight={600}>
      {value}
    </Typography>
  </Box>
);

const EmptyState = ({ title, description }: { title: string; description: string }) => (
  <Box
    sx={{
      border: '1px dashed',
      borderColor: 'divider',
      borderRadius: 2,
      p: 2,
    }}
  >
    <Typography variant="subtitle2">{title}</Typography>
    <Typography variant="body2" color="text.secondary">
      {description}
    </Typography>
  </Box>
);

const StatusChip = ({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string;
  icon?: React.ReactElement | null;
  tone?: RiskLevel | 'moderate';
}) => {
  const palette = getToneStyles(tone);
  const chipIcon = icon ?? undefined;
  return (
    <Chip
      icon={chipIcon}
      label={
        <Box>
          <Typography variant="caption" sx={{ display: 'block', lineHeight: 1 }}>
            {label}
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {value}
          </Typography>
        </Box>
      }
      sx={{
        backgroundColor: palette.bg,
        color: palette.color,
        '& .MuiChip-icon': { color: palette.color },
        height: 'auto',
        py: 1,
      }}
      variant="filled"
    />
  );
};

const formatRiskLabel = (level: RiskLevel) => {
  switch (level) {
    case 'green':
      return 'Low risk';
    case 'yellow':
      return 'Monitor';
    case 'red':
      return 'High risk';
    default:
      return 'Unknown';
  }
};

const getToneStyles = (tone?: RiskLevel | 'moderate') => {
  const map: Record<string, { bg: string; color: string }> = {
    green: { bg: 'rgba(34,197,94,0.15)', color: '#166534' },
    yellow: { bg: 'rgba(251,191,36,0.2)', color: '#92400e' },
    red: { bg: 'rgba(248,113,113,0.2)', color: '#991b1b' },
    moderate: { bg: 'rgba(59,130,246,0.15)', color: '#1d4ed8' },
    default: { bg: 'rgba(148,163,184,0.2)', color: '#0f172a' },
  };
  return tone ? map[tone] ?? map.default : map.default;
};

const humanizeDrill = (drill?: DrillType) => {
  if (!drill) return 'Drill pending';
  switch (drill) {
    case 'drop_jump':
      return 'Drop jump';
    case 'planned_cut':
      return 'Planned cut';
    case 'unplanned_cut':
      return 'Reactive cut';
    default:
      return drill;
  }
};

const pickLatest = <T extends { createdAt?: string | null }>(records?: T[]): T | null => {
  if (!records?.length) return null;
  return records.reduce((latest, current) => {
    const latestTime = latest?.createdAt ? new Date(latest.createdAt).getTime() : 0;
    const currentTime = current?.createdAt ? new Date(current.createdAt).getTime() : 0;
    return currentTime > latestTime ? current : latest;
  });
};

const levelFromRiskScore = (score: number): RiskLevel | 'moderate' => {
  if (score <= 1) return 'green';
  if (score === 2) return 'moderate';
  return 'red';
};
