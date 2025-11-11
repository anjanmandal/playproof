import { useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Groups2Icon from '@mui/icons-material/Groups2';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import SendIcon from '@mui/icons-material/Send';
import SignalCellularConnectedNoInternet0BarIcon from '@mui/icons-material/SignalCellularConnectedNoInternet0Bar';

type ClinicSlot = {
  day: string;
  time: string;
  capacity: number;
  booked: number;
  ptName: string;
  badge: 'ready' | 'low_bandwidth' | 'waitlist';
};

const COLOR_BADGES: Record<ClinicSlot['badge'], { label: string; color: 'success' | 'warning' | 'error' }> = {
  ready: { label: 'Tele-ready', color: 'success' },
  low_bandwidth: { label: 'Low bandwidth', color: 'warning' },
  waitlist: { label: 'Waitlist only', color: 'error' },
};

const PREP_CHECKLIST = [
  'Quiet space with 6 ft clear',
  'Shorts + shoes off for hop tests',
  'Phone stand (waist height)',
  'Consent on file',
];

const TEST_CHECKLIST = [
  'Single hop (injured/healthy)',
  'Triple hop',
  'Crossover hop',
  'Iso quad (dynamometer)',
  'Psych readiness questionnaire',
];

export const TelePtPage = () => {
  const [selectedState, setSelectedState] = useState<'ready' | 'empty' | 'full' | 'low_bandwidth'>('ready');
  const [selectedSlot, setSelectedSlot] = useState<string>('Tue 4:00 PM');
  const [consentChecked, setConsentChecked] = useState(false);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [visitOutcome, setVisitOutcome] = useState<{ pass: boolean; notes: string }>({ pass: true, notes: '' });
  const [sendCaseChannel, setSendCaseChannel] = useState(true);

  const clinicSlots = useMemo<ClinicSlot[]>(() => {
    if (selectedState === 'empty') return [];
    const base: ClinicSlot[] = [
      { day: 'Tue', time: '4:00 PM', capacity: 6, booked: selectedState === 'full' ? 6 : 3, ptName: 'Dr. Bell', badge: 'ready' },
      { day: 'Tue', time: '5:00 PM', capacity: 6, booked: selectedState === 'full' ? 6 : 5, ptName: 'Dr. Bell', badge: selectedState === 'low_bandwidth' ? 'low_bandwidth' : 'ready' },
      { day: 'Thu', time: '4:00 PM', capacity: 6, booked: selectedState === 'full' ? 6 : 2, ptName: 'Dr. Wu', badge: 'ready' },
      { day: 'Thu', time: '5:00 PM', capacity: 6, booked: selectedState === 'full' ? 6 : 6, ptName: 'Dr. Wu', badge: selectedState === 'full' ? 'waitlist' : 'ready' },
    ];
    return base;
  }, [selectedState]);

  const recommendedSlots = clinicSlots.filter((slot) => slot.booked < slot.capacity).slice(0, 2);

  const evidencePack = {
    lsi: '93%',
    trust: 'B',
    lastVisit: 'Oct 28 • Coach Norris',
    summary: 'Single hop within RTS threshold, triple hop lagging 4%.',
  };

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Parish Tele-PT Clinic Days
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Book and run telehealth visits that stream hop metrics, evidence packs, and RTS updates in one console.
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="caption" color="text.secondary">
            State
          </Typography>
          <Select
            size="small"
            value={selectedState}
            onChange={(event) => setSelectedState(event.target.value as typeof selectedState)}
          >
            <MenuItem value="ready">Ready</MenuItem>
            <MenuItem value="empty">Empty clinics</MenuItem>
            <MenuItem value="full">Full / waitlist</MenuItem>
            <MenuItem value="low_bandwidth">Low bandwidth</MenuItem>
          </Select>
        </Stack>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <ClinicCalendarCard slots={clinicSlots} state={selectedState} />
        </Grid>
        <Grid item xs={12} md={5}>
          <SlotPickerCard
            slots={recommendedSlots}
            selectedSlot={selectedSlot}
            onSelectSlot={setSelectedSlot}
            consentChecked={consentChecked}
            onToggleConsent={() => setConsentChecked((prev) => !prev)}
            checklist={checklist}
            onToggleChecklist={(label) => setChecklist((prev) => ({ ...prev, [label]: !prev[label] }))}
          />
        </Grid>
      </Grid>

      <VisitConsoleCard
        evidence={evidencePack}
        checklistState={checklist}
        onToggleChecklist={(label) => setChecklist((prev) => ({ ...prev, [label]: !prev[label] }))}
        visitOutcome={visitOutcome}
        onChangeOutcome={setVisitOutcome}
        state={selectedState}
      />

      <PostVisitSummaryCard
        outcome={visitOutcome}
        sendCaseChannel={sendCaseChannel}
        onToggleCaseChannel={() => setSendCaseChannel((prev) => !prev)}
      />
    </Stack>
  );
};

const ClinicCalendarCard = ({ slots, state }: { slots: ClinicSlot[]; state: 'ready' | 'empty' | 'full' | 'low_bandwidth' }) => (
  <Card>
    <CardContent>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <CalendarTodayIcon color="primary" />
          <Typography variant="h6">Clinic calendar (coach/admin)</Typography>
        </Stack>
        {state === 'empty' ? (
          <Alert severity="info">No tele-PT clinics scheduled yet. Add blocks from the admin console.</Alert>
        ) : (
          <Grid container spacing={2}>
            {slots.map((slot) => (
              <Grid item xs={12} sm={6} key={`${slot.day}-${slot.time}`}>
                <Card variant="outlined">
                  <CardContent>
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                        <Typography variant="subtitle1" fontWeight={600}>
                          {slot.day} {slot.time}
                        </Typography>
                        <Tooltip title="PT on duty">
                          <Avatar sx={{ width: 32, height: 32 }}>{slot.ptName[0]}</Avatar>
                        </Tooltip>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={(slot.booked / slot.capacity) * 100}
                        color={slot.booked >= slot.capacity ? 'error' : 'primary'}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" color="text.secondary">
                          {slot.booked}/{slot.capacity} booked
                        </Typography>
                        <Chip
                          size="small"
                          color={COLOR_BADGES[slot.badge].color}
                          label={COLOR_BADGES[slot.badge].label}
                          variant="outlined"
                        />
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>
    </CardContent>
  </Card>
);

const SlotPickerCard = ({
  slots,
  selectedSlot,
  onSelectSlot,
  consentChecked,
  onToggleConsent,
  checklist,
  onToggleChecklist,
}: {
  slots: ClinicSlot[];
  selectedSlot: string;
  onSelectSlot: (slot: string) => void;
  consentChecked: boolean;
  onToggleConsent: () => void;
  checklist: Record<string, boolean>;
  onToggleChecklist: (label: string) => void;
}) => (
  <Card>
    <CardContent>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Groups2Icon color="primary" />
          <Typography variant="h6">Slot picker (athlete/coach)</Typography>
        </Stack>
        {slots.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No recommended slots right now. Waitlist or check back later.
          </Typography>
        ) : (
          <Stack spacing={1}>
            {slots.map((slot) => {
              const slotLabel = `${slot.day} ${slot.time}`;
              return (
                <Card
                  key={slotLabel}
                  variant="outlined"
                  sx={{
                    borderColor: slotLabel === selectedSlot ? 'primary.main' : 'divider',
                    cursor: 'pointer',
                  }}
                  onClick={() => onSelectSlot(slotLabel)}
                >
                  <CardContent sx={{ py: 1.5 }}>
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                      <Typography variant="body2" fontWeight={600}>
                        {slotLabel}
                      </Typography>
                      <Chip size="small" color="primary" label="No conflicts" />
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      PT {slot.ptName} · {slot.booked}/{slot.capacity} booked
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        )}
        <Divider />
        <Typography variant="subtitle2">Prep checklist</Typography>
        <Stack spacing={0.5}>
          {PREP_CHECKLIST.map((item) => (
            <Stack
              key={item}
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ cursor: 'pointer' }}
              onClick={() => onToggleChecklist(item)}
            >
              <Chip
                size="small"
                color={checklist[item] ? 'success' : 'default'}
                label={checklist[item] ? 'Ready' : 'Pending'}
              />
              <Typography variant="body2">{item}</Typography>
            </Stack>
          ))}
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label={consentChecked ? 'Consent on file' : 'Consent needed'}
            color={consentChecked ? 'success' : 'warning'}
            onClick={onToggleConsent}
          />
          <Typography variant="caption" color="text.secondary">
            Tap to toggle consent state
          </Typography>
        </Stack>
        <Button
          variant="contained"
          startIcon={<VideoCallIcon />}
          disabled={!consentChecked}
          onClick={() => alert(`Booked ${selectedSlot}`)}
        >
          {consentChecked ? 'Book slot' : 'Consent required'}
        </Button>
        <Button variant="outlined" startIcon={<VideoCallIcon />} onClick={() => alert('Joining visit')}>
          Join visit
        </Button>
      </Stack>
    </CardContent>
  </Card>
);

const VisitConsoleCard = ({
  evidence,
  checklistState,
  onToggleChecklist,
  visitOutcome,
  onChangeOutcome,
  state,
}: {
  evidence: { lsi: string; trust: string; lastVisit: string; summary: string };
  checklistState: Record<string, boolean>;
  onToggleChecklist: (label: string) => void;
  visitOutcome: { pass: boolean; notes: string };
  onChangeOutcome: (value: { pass: boolean; notes: string }) => void;
  state: 'ready' | 'empty' | 'full' | 'low_bandwidth';
}) => (
  <Card>
    <CardContent>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <VideoCallIcon color="primary" />
          <Typography variant="h6">Visit console (PT)</Typography>
        </Stack>
        {state === 'low_bandwidth' && (
          <Alert severity="warning" icon={<SignalCellularConnectedNoInternet0BarIcon />}>
            Low bandwidth detected — fallback to metrics-first view.
          </Alert>
        )}
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Evidence pack
                </Typography>
                <Typography variant="h6">{evidence.lsi} LSI · Trust {evidence.trust}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {evidence.summary}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="caption" color="text.secondary">
                  Last visit
                </Typography>
                <Typography variant="body2">{evidence.lastVisit}</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Button size="small" variant="outlined" startIcon={<DownloadIcon />}>
                    Download PDF
                  </Button>
                  <Button size="small" variant="outlined" startIcon={<ShareIcon />}>
                    Share
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={state === 'low_bandwidth' ? 0 : 2}
              sx={{
                height: 280,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: state === 'low_bandwidth' ? '1px dashed' : 'none',
                borderColor: 'divider',
              }}
            >
              {state === 'low_bandwidth' ? (
                <Typography variant="body2" color="text.secondary">
                  Metrics-first fallback active
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Live video stream
                </Typography>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack spacing={1}>
              <Typography variant="subtitle2" color="text.secondary">
                Test checklist
              </Typography>
              {TEST_CHECKLIST.map((item) => (
                <Stack
                  key={item}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => onToggleChecklist(item)}
                >
                  <Chip
                    size="small"
                    color={checklistState[item] ? 'success' : 'default'}
                    icon={checklistState[item] ? <CheckCircleIcon /> : undefined}
                    label={item}
                  />
                </Stack>
              ))}
              <Divider />
              <Typography variant="subtitle2">Quick outcome</Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant={visitOutcome.pass ? 'contained' : 'outlined'}
                  color="success"
                  onClick={() => onChangeOutcome({ ...visitOutcome, pass: true })}
                >
                  Pass
                </Button>
                <Button
                  variant={!visitOutcome.pass ? 'contained' : 'outlined'}
                  color="error"
                  onClick={() => onChangeOutcome({ ...visitOutcome, pass: false })}
                >
                  Needs work
                </Button>
              </Stack>
              <TextField
                label="PT notes"
                multiline
                minRows={3}
                value={visitOutcome.notes}
                onChange={(event) => onChangeOutcome({ ...visitOutcome, notes: event.target.value })}
              />
            </Stack>
          </Grid>
        </Grid>
        <Divider />
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', md: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary">
            RTS gate update + home plan adjustments
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button variant="contained" endIcon={<SendIcon />}>
            Publish visit summary
          </Button>
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);

const PostVisitSummaryCard = ({
  outcome,
  sendCaseChannel,
  onToggleCaseChannel,
}: {
  outcome: { pass: boolean; notes: string };
  sendCaseChannel: boolean;
  onToggleCaseChannel: () => void;
}) => (
  <Card>
    <CardContent>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <AssignmentTurnedInIcon color="primary" />
          <Typography variant="h6">Post-visit summary</Typography>
        </Stack>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600}>
                  Plan deltas
                </Typography>
                <Typography variant="body2">
                  {outcome.pass
                    ? 'Cleared to progress: add controlled lateral shuffles, progress to 80% tempo drills.'
                    : 'Stay in neuromuscular block; emphasize crossover control and quad strength.'}
                </Typography>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="caption" color="text.secondary">
                  Next check
                </Typography>
                <Typography variant="body2">Nov 22 · Tele-PT + updated evidence pack</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600}>
                  Distribution
                </Typography>
                <Stack spacing={1}>
                  <Button fullWidth variant="outlined" startIcon={<DownloadIcon />}>
                    Download Evidence PDF
                  </Button>
                  <Button fullWidth variant="outlined" startIcon={<ShareIcon />}>
                    Share summary
                  </Button>
                  <Chip
                    label={sendCaseChannel ? 'Send to Case Channel ✓' : 'Send to Case Channel'}
                    color={sendCaseChannel ? 'success' : 'default'}
                    onClick={onToggleCaseChannel}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </CardContent>
  </Card>
);

export default TelePtPage;
