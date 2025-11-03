import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import InsightsIcon from '@mui/icons-material/Insights';
import { fetchAthletes } from '@/api/athletes';
import type { AthleteSummary } from '@/types';

export const OverviewPage = () => {
  const [athletes, setAthletes] = useState<AthleteSummary[]>([]);

  useEffect(() => {
    fetchAthletes()
      .then(setAthletes)
      .catch((error) => {
        console.warn('Failed to load athletes', error);
      });
  }, []);

  return (
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
            value={new Set(athletes
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
            value={new Set(athletes
              .map((athlete) => athlete.position)
              .filter((pos): pos is string => Boolean(pos))
            ).size}
            description="Roles with validated baselines"
          />
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
