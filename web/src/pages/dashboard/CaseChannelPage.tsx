import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PushPinIcon from '@mui/icons-material/PushPin';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { fetchCaseChannel, createCaseEvent } from '@/api/caseChannel';
import { fetchAthletes } from '@/api/athletes';
import type { AthleteSummary, CaseChannelResponse, CaseEvent } from '@/types';
import { useAuth } from '@/providers/AuthProvider';
import { LoadingScreen } from '@/components/common/LoadingScreen';

const TRUST_COLORS: Record<string, 'success' | 'warning' | 'error'> = {
  A: 'success',
  B: 'warning',
  C: 'error',
};

const DEFAULT_EVENT_TYPES = ['risk', 'rehab', 'planner', 'note'];
const DEFAULT_TRUST = 'B';

const buildMentionsArray = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export const CaseChannelPage = () => {
  const { athleteId: routeAthleteId } = useParams<{ athleteId?: string }>();
  const { user } = useAuth();
  const [athleteId, setAthleteId] = useState(routeAthleteId ?? user?.athleteId ?? '');
  const [channel, setChannel] = useState<CaseChannelResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [athleteOptions, setAthleteOptions] = useState<AthleteSummary[]>([]);
  const [athleteLoading, setAthleteLoading] = useState(false);
  const [athleteInput, setAthleteInput] = useState('');
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [composer, setComposer] = useState({
    eventType: DEFAULT_EVENT_TYPES[0],
    title: '',
    summary: '',
    trustGrade: DEFAULT_TRUST,
    nextAction: '',
    pinned: false,
    mentions: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const availableTypes = useMemo(
    () => Array.from(new Set([...(channel?.availableTypes ?? []), ...DEFAULT_EVENT_TYPES])).filter(Boolean),
    [channel],
  );
  const availableRoles = useMemo(
    () => Array.from(new Set([...(channel?.availableRoles ?? []), 'Coach', 'AT/PT', 'Surgeon'])).filter(Boolean),
    [channel],
  );

  const filteredEvents = useMemo(() => {
    if (!channel) return [];
    return channel.events.filter((event) => {
      const typeMatches = eventFilter === 'all' || event.eventType === eventFilter;
      const roleMatches = roleFilter === 'all' || event.role === roleFilter;
      return typeMatches && roleMatches;
    });
  }, [channel, eventFilter, roleFilter]);

  const loadChannel = useCallback(async () => {
    if (!athleteId.trim()) {
      setChannel(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetchCaseChannel(athleteId.trim(), {
        eventType: eventFilter === 'all' ? undefined : eventFilter,
        role: roleFilter === 'all' ? undefined : roleFilter,
      });
      setChannel(response);
    } catch (err) {
      setError((err as Error).message);
      setChannel(null);
    } finally {
      setLoading(false);
    }
  }, [athleteId, eventFilter, roleFilter]);

  useEffect(() => {
    loadChannel();
  }, [loadChannel]);

  useEffect(() => {
    const loadAthletes = async () => {
      setAthleteLoading(true);
      try {
        const list = await fetchAthletes();
        setAthleteOptions(list);
      } catch (err) {
        console.warn('Failed to load athletes', err);
      } finally {
        setAthleteLoading(false);
      }
    };
    void loadAthletes();
  }, []);

  useEffect(() => {
    const match = athleteOptions.find((ath) => ath.id === athleteId);
    if (match) {
      setAthleteInput(match.displayName ?? match.id);
    } else if (!athleteId) {
      setAthleteInput('');
    }
  }, [athleteId, athleteOptions]);

  const handleCreate = async () => {
    if (!athleteId.trim() || !composer.title.trim()) {
      setError('Athlete ID and title are required.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await createCaseEvent(athleteId.trim(), {
        eventType: composer.eventType,
        title: composer.title.trim(),
        summary: composer.summary.trim() || undefined,
        trustGrade: composer.trustGrade,
        nextAction: composer.nextAction.trim() || undefined,
        pinned: composer.pinned,
        mentions: buildMentionsArray(composer.mentions),
      });
      setComposer({
        eventType: composer.eventType,
        title: '',
        summary: '',
        trustGrade: composer.trustGrade,
        nextAction: '',
        pinned: false,
        mentions: '',
      });
      await loadChannel();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !channel) {
    return <LoadingScreen label="Loading case channel…" />;
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h4" fontWeight={700}>
          Shared Case Channel
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Single source of truth for athlete handoffs across risk, rehab, planner, and on-field staff.
        </Typography>
      </Stack>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  fullWidth
                  freeSolo
                  options={athleteOptions}
                  loading={athleteLoading}
                  getOptionLabel={(option) =>
                    typeof option === 'string'
                      ? option
                      : `${option.displayName ?? option.id} (${option.id})`
                  }
                  value={athleteOptions.find((ath) => ath.id === athleteId) ?? null}
                  inputValue={athleteInput}
                  onInputChange={(_, value, reason) => {
                    setAthleteInput(value);
                    if (reason === 'input') {
                      setAthleteId(value.trim());
                    }
                  }}
                  onChange={(_, value) => {
                    if (typeof value === 'string') {
                      setAthleteId(value.trim());
                    } else if (value) {
                      setAthleteId(value.id);
                      setAthleteInput(value.displayName ?? value.id);
                    } else {
                      setAthleteId('');
                      setAthleteInput('');
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Athlete"
                      placeholder="Search name or enter ID"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {athleteLoading ? <CircularProgress color="inherit" size={16} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6} display="flex" alignItems="center" justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={loadChannel}
                  disabled={loading || !athleteId.trim()}
                >
                  Refresh timeline
                </Button>
              </Grid>
            </Grid>
            {channel?.pinnedNextAction && (
              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PushPinIcon fontSize="small" color="warning" />
                      <Typography variant="subtitle1" fontWeight={600}>
                        Next action
                      </Typography>
                      <Chip
                        size="small"
                        color={TRUST_COLORS[channel.pinnedNextAction.trustGrade ?? 'B'] ?? 'info'}
                        label={`Trust ${channel.pinnedNextAction.trustGrade ?? '—'}`}
                      />
                    </Stack>
                    <Typography variant="body1" fontWeight={600}>
                      {channel.pinnedNextAction.nextAction}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {channel.pinnedNextAction.title} · {channel.pinnedNextAction.role} ·{' '}
                      {format(new Date(channel.pinnedNextAction.createdAt), 'PPpp')}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            )}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  Event type
                </Typography>
                <Select
                  size="small"
                  value={eventFilter}
                  onChange={(event) => setEventFilter(event.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  {availableTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="caption" color="text.secondary">
                  Role
                </Typography>
                <Select
                  size="small"
                  value={roleFilter}
                  onChange={(event) => setRoleFilter(event.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  {availableRoles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Stack spacing={2}>
            {filteredEvents.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No events match the selected filters yet.
              </Typography>
            )}
            {filteredEvents.map((event) => (
              <CaseEventCard key={event.id} event={event} />
            ))}
          </Stack>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                  <AddCircleOutlineIcon fontSize="small" />
                  Add case update
                </Typography>
                <Select
                  label="Event type"
                  value={composer.eventType}
                  onChange={(event) => setComposer((prev) => ({ ...prev, eventType: event.target.value }))}
                  size="small"
                >
                  {availableTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                <TextField
                  label="Title"
                  value={composer.title}
                  onChange={(event) => setComposer((prev) => ({ ...prev, title: event.target.value }))}
                  fullWidth
                />
                <TextField
                  label="Summary"
                  value={composer.summary}
                  onChange={(event) => setComposer((prev) => ({ ...prev, summary: event.target.value }))}
                  multiline
                  minRows={2}
                />
                <TextField
                  label="Next action"
                  value={composer.nextAction}
                  onChange={(event) => setComposer((prev) => ({ ...prev, nextAction: event.target.value }))}
                  multiline
                  minRows={2}
                />
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="caption" color="text.secondary">
                    Trust grade
                  </Typography>
                  <Select
                    size="small"
                    value={composer.trustGrade}
                    onChange={(event) => setComposer((prev) => ({ ...prev, trustGrade: event.target.value }))}
                  >
                    {['A', 'B', 'C'].map((grade) => (
                      <MenuItem key={grade} value={grade}>
                        {grade}
                      </MenuItem>
                    ))}
                  </Select>
                  <Tooltip title="Pin as next action">
                    <IconButton
                      color={composer.pinned ? 'warning' : 'default'}
                      onClick={() => setComposer((prev) => ({ ...prev, pinned: !prev.pinned }))}
                      size="small"
                    >
                      <PushPinIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
                <TextField
                  label="Mentions (@coach, @pt)"
                  value={composer.mentions}
                  onChange={(event) => setComposer((prev) => ({ ...prev, mentions: event.target.value }))}
                  InputProps={{
                    startAdornment: (
                      <AlternateEmailIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                />
                <Button variant="contained" onClick={handleCreate} disabled={submitting}>
                  {submitting ? 'Posting…' : 'Post update'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
};

const CaseEventCard = ({ event }: { event: CaseEvent }) => {
  const trustColor = TRUST_COLORS[event.trustGrade ?? ''] ?? 'info';
  let thumbnail: string | undefined;
  if (event.attachments && typeof event.attachments === 'object' && 'thumbnailUrl' in event.attachments) {
    const candidate = (event.attachments as Record<string, unknown>).thumbnailUrl;
    if (typeof candidate === 'string') {
      thumbnail = candidate;
    }
  }
  const metrics: Array<[string, string]> =
    event.metadata && typeof event.metadata === 'object'
      ? Object.entries(event.metadata as Record<string, unknown>)
          .slice(0, 3)
          .map(([key, value]) => [key, String(value)])
      : [];

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={1.25}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} justifyContent="space-between">
            <Stack spacing={0.5}>
              <Typography variant="subtitle1" fontWeight={600}>
                {event.title}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <Chip size="small" variant="outlined" label={event.eventType} />
                <Chip size="small" color={trustColor} label={`Trust ${event.trustGrade ?? '—'}`} />
                <Typography variant="caption" color="text.secondary">
                  {event.role} · {event.actorName ?? event.actorId ?? 'Unknown'} ·{' '}
                  {format(new Date(event.createdAt), 'PPpp')}
                </Typography>
              </Stack>
            </Stack>
            {event.nextAction && (
              <Chip
                size="small"
                color={event.pinned ? 'warning' : 'default'}
                label={event.pinned ? 'Pinned next action' : 'Next action'}
              />
            )}
          </Stack>
          {event.summary && (
            <Typography variant="body2" color="text.secondary">
              {event.summary}
            </Typography>
          )}
          {event.nextAction && (
            <Typography variant="body2" fontWeight={600}>
              {event.nextAction}
            </Typography>
          )}
          {thumbnail && typeof thumbnail === 'string' && (
            <Box
              component="img"
              src={thumbnail}
              alt="Attachment thumbnail"
              sx={{
                width: '100%',
                maxHeight: 220,
                borderRadius: 2,
                objectFit: 'cover',
                border: '1px solid',
                borderColor: 'divider',
              }}
            />
          )}
          {metrics.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {metrics.map(([key, value]) => (
                <Chip
                  key={key}
                  size="small"
                  icon={<CameraAltIcon fontSize="small" />}
                  label={`${key}: ${value}`}
                  variant="outlined"
                />
              ))}
            </Stack>
          )}
          {event.mentions && event.mentions.length > 0 && (
            <>
              <Divider />
              <Stack direction="row" spacing={0.5} alignItems="center">
                <AlternateEmailIcon fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">
                  Mentions: {event.mentions.join(', ')}
                </Typography>
              </Stack>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CaseChannelPage;
