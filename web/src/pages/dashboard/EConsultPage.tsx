import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AssignmentIcon from '@mui/icons-material/Assignment';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

type CaseSummary = {
  id: string;
  athlete: string;
  concern: string;
  priority: '24h' | '48h';
  status: 'Pending' | 'Needs info' | 'Returned' | 'Archived';
  trust: 'A' | 'B' | 'C';
  sport: string;
  waitingMinutes: number;
};

const MOCK_CASES: CaseSummary[] = [
  { id: 'case-1', athlete: 'RB-12', concern: 'Pain flare', priority: '24h', status: 'Pending', trust: 'B', sport: 'Football', waitingMinutes: 32 },
  { id: 'case-2', athlete: 'WR-08', concern: 'RTS lock', priority: '48h', status: 'Needs info', trust: 'A', sport: 'Football', waitingMinutes: 120 },
  { id: 'case-3', athlete: 'MF-09', concern: 'Drift alert', priority: '24h', status: 'Returned', trust: 'C', sport: 'Soccer', waitingMinutes: 300 },
];

export const EConsultPage = () => {
  const [form, setForm] = useState({
    athleteId: '',
    concern: 'RTS lock',
    history: '',
    attachments: [] as string[],
    priority: '24h',
    consent: false,
  });
  const [selectedCase, setSelectedCase] = useState<CaseSummary | null>(MOCK_CASES[0]);
  const [responsePlan, setResponsePlan] = useState({
    home: 'Continue neuromuscular block with lateral shuttles.',
    restrictions: 'No max-effort cutting until hop LSI ≥95%.',
    followup: 'Tele-PT check-in in 48h.',
    flags: 'In-person physical exam recommended if swelling persists.',
  });

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={700}>
        Asynchronous eConsult / Second-Opinion
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Structured PT/ortho reviews that sync footage, trust receipts, and plan adjustments into Case Channel + RTS gates.
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <CreateCaseCard form={form} onChange={setForm} />
        </Grid>
        <Grid item xs={12} md={6}>
          <SpecialistInbox cases={MOCK_CASES} selected={selectedCase} onSelect={setSelectedCase} />
        </Grid>
      </Grid>

      {selectedCase && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={7}>
            <CaseDetailCard caseSummary={selectedCase} />
          </Grid>
          <Grid item xs={12} md={5}>
            <ResponseComposer plan={responsePlan} onChange={setResponsePlan} />
          </Grid>
        </Grid>
      )}

      <CaseSummaryTimeline />
    </Stack>
  );
};

const CreateCaseCard = ({
  form,
  onChange,
}: {
  form: typeof INITIAL_FORM;
  onChange: (next: typeof INITIAL_FORM) => void;
}) => {
  const handleField = (field: keyof typeof INITIAL_FORM, value: any) => {
    onChange({ ...form, [field]: value });
  };
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <AssignmentIcon color="primary" />
            <Typography variant="h6">Create case (Coach/AT)</Typography>
          </Stack>
          <TextField
            label="Athlete ID"
            value={form.athleteId}
            onChange={(event) => handleField('athleteId', event.target.value)}
            placeholder="e.g., RB-12"
            fullWidth
          />
          <TextField
            label="Concern"
            select
            value={form.concern}
            onChange={(event) => handleField('concern', event.target.value)}
            fullWidth
          >
            {['Pain flare', 'Drift alert', 'RTS lock', 'Other'].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Brief history"
            value={form.history}
            onChange={(event) => handleField('history', event.target.value)}
            placeholder="e.g., 12 weeks post-ACL; consistent lateral drift"
            multiline
            minRows={3}
          />
          <Stack spacing={1}>
            <Typography variant="subtitle2">Attachments</Typography>
            <Button variant="outlined">Attach proof clips / trust receipts</Button>
            <Typography variant="caption" color="text.secondary">
              Supported: Case channel clips, hop results, strength reports.
            </Typography>
          </Stack>
          <Stack spacing={1}>
            <Typography variant="subtitle2">Priority & turnaround</Typography>
            <ToggleButtonGroup
              exclusive
              value={form.priority}
              onChange={(_, value) => value && handleField('priority', value)}
              size="small"
            >
              <ToggleButton value="24h">24h</ToggleButton>
              <ToggleButton value="48h">48h</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={form.consent ? 'Consent on file' : 'Consent required'}
              color={form.consent ? 'success' : 'warning'}
              onClick={() => handleField('consent', !form.consent)}
            />
            <Typography variant="caption" color="text.secondary">
              Tap to toggle consent state
            </Typography>
          </Stack>
          <Button variant="contained" startIcon={<SendIcon />} disabled={!form.consent}>
            Send eConsult
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

const INITIAL_FORM = {
  athleteId: '',
  concern: 'RTS lock',
  history: '',
  attachments: [] as string[],
  priority: '24h',
  consent: false,
};

const SpecialistInbox = ({
  cases,
  selected,
  onSelect,
}: {
  cases: CaseSummary[];
  selected: CaseSummary | null;
  onSelect: (value: CaseSummary) => void;
}) => (
  <Card>
    <CardContent>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <VideoCameraFrontIcon color="primary" />
          <Typography variant="h6">Specialist inbox (PT/Ortho)</Typography>
        </Stack>
        <Grid container spacing={2}>
          {cases.map((caseItem) => (
            <Grid item xs={12} key={caseItem.id}>
              <Card
                variant="outlined"
                sx={{
                  borderColor: selected?.id === caseItem.id ? 'primary.main' : 'divider',
                  cursor: 'pointer',
                }}
                onClick={() => onSelect(caseItem)}
              >
                <CardContent>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="subtitle1" fontWeight={600}>
                        {caseItem.athlete} · {caseItem.concern}
                      </Typography>
                      <Chip size="small" color="primary" label={`${caseItem.waitingMinutes} min`} />
                    </Stack>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Chip size="small" variant="outlined" label={`Priority ${caseItem.priority}`} />
                      <Chip size="small" variant="outlined" label={caseItem.sport} />
                      <Chip size="small" variant="outlined" label={`Trust ${caseItem.trust}`} />
                      <Chip size="small" color={caseItem.status === 'Pending' ? 'warning' : 'default'} label={caseItem.status} />
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </CardContent>
  </Card>
);

const CaseDetailCard = ({ caseSummary }: { caseSummary: CaseSummary }) => (
  <Card>
    <CardContent>
      <Stack spacing={2}>
        <Typography variant="h6">Case detail</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" fontWeight={600}>
            {caseSummary.athlete}
          </Typography>
          <Chip size="small" label={caseSummary.concern} />
          <Chip size="small" color={caseSummary.status === 'Pending' ? 'warning' : 'default'} label={caseSummary.status} />
        </Stack>
        <Divider />
        <Typography variant="subtitle2">Timeline</Typography>
        <Stack spacing={1}>
          <TimelineEntry label="Coach request" detail="RTS gating locked · 4 clips attached" />
          <TimelineEntry label="Auto metrics" detail="LSI 92% · Trust B" />
          <TimelineEntry label="PT response" detail="Pending" />
        </Stack>
        <Divider />
        <Typography variant="subtitle2">Media viewer</Typography>
        <Paper variant="outlined" sx={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Proof clip placeholder
          </Typography>
        </Paper>
        <Divider />
        <Typography variant="subtitle2">LSI math</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h6">LSI 92%</Typography>
          <Chip size="small" label="Single hop" />
          <Chip size="small" label="Triple hop" />
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);

const TimelineEntry = ({ label, detail }: { label: string; detail: string }) => (
  <Stack direction="row" spacing={1} alignItems="center">
    <CheckCircleIcon fontSize="small" color="success" />
    <Typography variant="body2">
      <strong>{label}:</strong> {detail}
    </Typography>
  </Stack>
);

const ResponseComposer = ({
  plan,
  onChange,
}: {
  plan: typeof INITIAL_PLAN;
  onChange: (value: typeof INITIAL_PLAN) => void;
}) => (
  <Card>
    <CardContent>
      <Stack spacing={2}>
        <Typography variant="h6">Response composer</Typography>
        <Typography variant="caption" color="text.secondary">
          Structured plan blocks auto-sync to Case Channel + RTS context.
        </Typography>
        <TextField
          label="Home plan"
          value={plan.home}
          onChange={(event) => onChange({ ...plan, home: event.target.value })}
          multiline
          minRows={2}
        />
        <TextField
          label="Restrictions"
          value={plan.restrictions}
          onChange={(event) => onChange({ ...plan, restrictions: event.target.value })}
          multiline
          minRows={2}
        />
        <TextField
          label="Follow-up"
          value={plan.followup}
          onChange={(event) => onChange({ ...plan, followup: event.target.value })}
          multiline
          minRows={2}
        />
        <TextField
          label="Flags"
          value={plan.flags}
          onChange={(event) => onChange({ ...plan, flags: event.target.value })}
          multiline
          minRows={2}
        />
        <Button variant="contained" endIcon={<SendIcon />}>
          Publish response
        </Button>
      </Stack>
    </CardContent>
  </Card>
);

const INITIAL_PLAN = {
  home: '',
  restrictions: '',
  followup: '',
  flags: '',
};

const CaseSummaryTimeline = () => (
  <Card>
    <CardContent>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <AccessTimeIcon color="primary" />
          <Typography variant="h6">Case summary timeline</Typography>
        </Stack>
        <Stack spacing={1}>
          <TimelineEntry label="Request submitted" detail="Coach RB posted hop drift + trust receipts" />
          <TimelineEntry label="Specialist response" detail="PT Chen returned plan (Nov 8 · 14:22)" />
          <TimelineEntry label="Actions" detail="Plan applied · Tele-PT booked" />
        </Stack>
        <Divider />
        <Stack direction="row" spacing={1} alignItems="center">
          <Button variant="outlined" startIcon={<DownloadIcon />}>
            Download Evidence PDF
          </Button>
          <Button variant="outlined" startIcon={<VideoCameraFrontIcon />}>
            Book Tele-PT
          </Button>
          <Button variant="outlined" startIcon={<SendIcon />}>
            Request clarification
          </Button>
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);

export default EConsultPage;
