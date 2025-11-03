import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { fetchAthletes, fetchAthleteDetail } from '@/api/athletes';
import { rewriteForAudience } from '@/api/audience';
import type { AthleteDashboard, AudienceRewriteInput, AudienceRewriteResponse, AthleteSummary } from '@/types';
import { formatDate } from '@/utils/date';
import { ErrorAlert } from '@/components/common/ErrorAlert';

const AUDIENCE_OPTIONS: Array<{ value: AudienceRewriteInput['audience']; label: string }> = [
  { value: 'coach', label: 'Coach' },
  { value: 'athlete', label: 'Athlete' },
  { value: 'parent', label: 'Parent' },
  { value: 'at_pt', label: 'AT / PT' },
];

const TONE_OPTIONS: Array<{ value: NonNullable<AudienceRewriteInput['tone']>; label: string }> = [
  { value: 'technical', label: 'Technical' },
  { value: 'supportive', label: 'Supportive' },
  { value: 'motivational', label: 'Motivational' },
];

const athleteColumns: GridColDef<AthleteSummary>[] = [
  { field: 'displayName', headerName: 'Name', flex: 1 },
  { field: 'jerseyNumber', headerName: '#', width: 80 },
  { field: 'sport', headerName: 'Sport', width: 120 },
  { field: 'position', headerName: 'Position', width: 140 },
  { field: 'team', headerName: 'Team', width: 160 },
];

export const PortalPage = () => {
  const [athletes, setAthletes] = useState<AthleteSummary[]>([]);
  const [selectedAthlete, setSelectedAthlete] = useState<AthleteDashboard | null>(null);
  const [loadingAthlete, setLoadingAthlete] = useState(false);
  const [baselineMessage, setBaselineMessage] = useState('');
  const [audience, setAudience] = useState<AudienceRewriteInput['audience']>('coach');
  const [tone, setTone] = useState<AudienceRewriteInput['tone']>('supportive');
  const [rewrite, setRewrite] = useState<AudienceRewriteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAthletes()
      .then(setAthletes)
      .catch((err) => console.warn('Failed to load athletes', err));
  }, []);

  const loadAthlete = async (athleteId: string) => {
    setLoadingAthlete(true);
    try {
      const detail = await fetchAthleteDetail(athleteId);
      setSelectedAthlete(detail);
      if (detail.movementSessions?.length) {
        setBaselineMessage(
          `Knee valgus risk ${detail.movementSessions[0].riskRating}/3 with cues: ${detail.movementSessions[0].cues.join(', ')}`,
        );
      }
    } catch (err) {
      console.warn('Failed to load athlete detail', err);
    } finally {
      setLoadingAthlete(false);
    }
  };

  const handleRewrite = async () => {
    if (!selectedAthlete?.movementSessions?.length) {
      setError('Select an athlete with at least one assessment to rewrite messaging.');
      return;
    }
    if (!baselineMessage.trim()) {
      setError('Provide a baseline message to adapt across audiences.');
      return;
    }
    setError(null);
    try {
      const response = await rewriteForAudience({
        assessmentId: selectedAthlete.movementSessions[0].id,
        baselineMessage: baselineMessage.trim(),
        audience,
        tone: tone ?? undefined,
      });
      setRewrite(response);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Coach / AT / Parent Portal
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Translate the same AI insight into language each stakeholder trusts.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 520, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                Roster
              </Typography>
              <DataGrid
                rows={athletes}
                columns={athleteColumns}
                autoHeight={false}
                density="comfortable"
                disableColumnMenu
                disableRowSelectionOnClick
                loading={athletes.length === 0 && !selectedAthlete}
                sx={{ flexGrow: 1, '& .MuiDataGrid-row': { cursor: 'pointer' } }}
                onRowClick={(params) => loadAthlete(params.row.id)}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Latest assessments
                </Typography>
                {loadingAthlete && <Typography>Loading athlete details…</Typography>}
                {!loadingAthlete && !selectedAthlete && (
                  <Typography color="text.secondary">
                    Select an athlete to see movement, risk, and rehab history.
                  </Typography>
                )}
                {selectedAthlete && (
                  <Stack spacing={2}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {selectedAthlete.displayName}
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {selectedAthlete.position && <Chip label={selectedAthlete.position} />}
                      {selectedAthlete.team && <Chip label={selectedAthlete.team} />}
                      {selectedAthlete.sport && <Chip label={selectedAthlete.sport} />}
                    </Stack>
                    <Typography variant="body2">
                      Last movement cue:{' '}
                      {selectedAthlete.movementSessions?.[0]?.cues?.join(', ') ?? '—'}
                    </Typography>
                    <Typography variant="body2">
                      Last risk change:{' '}
                      {selectedAthlete.riskSnapshots?.[0]?.changeToday ?? '—'}
                    </Typography>
                    <Typography variant="body2">
                      Last rehab clearance:{' '}
                      {selectedAthlete.rehabAssessments?.length
                        ? selectedAthlete.rehabAssessments[0].cleared
                          ? 'Cleared'
                          : 'Not cleared'
                        : '—'}
                    </Typography>
                  </Stack>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Rewrite for audience
                </Typography>

                <ErrorAlert message={error} />

                <Stack spacing={2}>
                  <TextField
                    label="Baseline message"
                    multiline
                    minRows={3}
                    value={baselineMessage}
                    onChange={(event) => setBaselineMessage(event.target.value)}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Audience"
                        select
                        value={audience}
                        onChange={(event) => setAudience(event.target.value as AudienceRewriteInput['audience'])}
                      >
                        {AUDIENCE_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Tone"
                        select
                        value={tone ?? ''}
                        onChange={(event) =>
                          setTone((event.target.value || undefined) as AudienceRewriteInput['tone'])
                        }
                      >
                        <MenuItem value="">Auto</MenuItem>
                        {TONE_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                  <Button variant="contained" onClick={handleRewrite} disabled={!selectedAthlete}>
                    Generate tailored message
                  </Button>
                  {rewrite && (
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom>
                          {AUDIENCE_OPTIONS.find((option) => option.value === rewrite.audience)?.label}{' '}
                          · {tone ? TONE_OPTIONS.find((t) => t.value === tone)?.label : 'Neutral'}
                        </Typography>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                          {rewrite.rewritten}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Generated {formatDate(rewrite.createdAt)}
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};

