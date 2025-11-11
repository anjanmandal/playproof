import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SaveIcon from '@mui/icons-material/Save';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ScienceIcon from '@mui/icons-material/Science';
import { fetchEvidenceCards, searchResearchPapers } from '@/api/research';
import type { EvidenceCard, ResearchPaper } from '@/types';

const DEFAULT_QUERY_CHIPS = [
  { label: 'ACL prevention', value: 'acl prevention' },
  { label: 'Neuromuscular training', value: 'neuromuscular training' },
  { label: 'Female athletes', value: 'female' },
  { label: 'Return-to-sport', value: 'return-to-sport' },
];

const LEVEL_FILTERS = ['RCT', 'Systematic review', 'Prospective cohort'];

export const ResearchHubPage = () => {
  const [cards, setCards] = useState<EvidenceCard[]>([]);
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [savedPapers, setSavedPapers] = useState<Record<string, ResearchPaper>>({});
  const [query, setQuery] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [levelFilter, setLevelFilter] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCards = async () => {
      try {
        const data = await fetchEvidenceCards();
        setCards(data);
      } catch (err) {
        console.warn('Failed to load evidence cards', err);
      }
    };
    void loadCards();
  }, []);

  const runSearch = async (opts?: { q?: string; tags?: string[]; level?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchResearchPapers({
        q: opts?.q ?? query,
        tags: opts?.tags ?? activeTags,
        level: opts?.level ?? levelFilter,
      });
      setPapers(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void runSearch();
  }, []);

  const toggleTag = (value: string) => {
    setActiveTags((prev) =>
      prev.includes(value) ? prev.filter((tag) => tag !== value) : [...prev, value],
    );
  };

  const filteredSavedPapers = useMemo(() => Object.values(savedPapers), [savedPapers]);

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h4" fontWeight={700}>
          Research Hub
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Evidence cards and curated literature to answer coach/AT/PT questions fast.
        </Typography>
      </Stack>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6" display="flex" alignItems="center" gap={1}>
              <ScienceIcon fontSize="small" /> Evidence cards
            </Typography>
            <Grid container spacing={2}>
              {cards.map((card) => (
                <Grid item xs={12} md={6} key={card.id}>
                  <EvidenceCardView card={card} />
                </Grid>
              ))}
            </Grid>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6" display="flex" alignItems="center" gap={1}>
              <SearchIcon fontSize="small" /> Search studies
            </Typography>
            <Stack spacing={1}>
              <TextField
                label="Search"
                placeholder="e.g., neuromuscular training female athletes"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                fullWidth
              />
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {DEFAULT_QUERY_CHIPS.map((chip) => (
                  <Chip
                    key={chip.value}
                    label={chip.label}
                    variant="outlined"
                    onClick={() => {
                      setQuery(chip.value);
                      void runSearch({ q: chip.value });
                    }}
                  />
                ))}
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Filters
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {['nmt', 'return-to-sport', 'female', 'heat'].map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    color={activeTags.includes(tag) ? 'primary' : 'default'}
                    variant={activeTags.includes(tag) ? 'filled' : 'outlined'}
                    onClick={() => {
                      toggleTag(tag);
                      setTimeout(() => {
                        void runSearch({
                          tags: activeTags.includes(tag)
                            ? activeTags.filter((t) => t !== tag)
                            : [...activeTags, tag],
                        });
                      }, 0);
                    }}
                  />
                ))}
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {LEVEL_FILTERS.map((level) => (
                  <Chip
                    key={level}
                    label={level}
                    color={levelFilter === level ? 'primary' : 'default'}
                    variant={levelFilter === level ? 'filled' : 'outlined'}
                    onClick={() => {
                      const next = levelFilter === level ? undefined : level;
                      setLevelFilter(next);
                      void runSearch({ level: next });
                    }}
                  />
                ))}
              </Stack>
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={() => runSearch()}
                disabled={loading}
                sx={{ alignSelf: 'flex-start' }}
              >
                {loading ? 'Searching…' : 'Run search'}
              </Button>
              {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Results</Typography>
              <Chip size="small" label={`${papers.length} papers`} />
            </Stack>
            <Grid container spacing={2}>
              {papers.map((paper) => {
                const saved = Boolean(savedPapers[paper.paperId]);
                return (
                  <Grid item xs={12} key={paper.paperId}>
                    <Card variant="outlined">
                      <CardContent>
                        <Stack spacing={1}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle1" fontWeight={600}>
                              {paper.title}
                            </Typography>
                            <Chip size="small" label={paper.levelOfEvidence} />
                          </Stack>
                          <Typography variant="body2" color="text.secondary">
                            {paper.authors} · {paper.journal} ({paper.year})
                          </Typography>
                          <Typography variant="body2">{paper.abstract}</Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            {paper.tags.map((tag) => (
                              <Chip key={tag} size="small" label={tag} variant="outlined" />
                            ))}
                            <Chip size="small" color="success" label={paper.impactTag} />
                          </Stack>
                          <Stack direction="row" spacing={1}>
                            {paper.doi && (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => window.open(`https://doi.org/${paper.doi}`, '_blank')}
                              >
                                View DOI
                              </Button>
                            )}
                            <Button
                              size="small"
                              variant={saved ? 'contained' : 'outlined'}
                              color={saved ? 'success' : 'primary'}
                              startIcon={saved ? <BookmarkIcon /> : <SaveIcon />}
                              onClick={() =>
                                setSavedPapers((prev) => {
                                  const next = { ...prev };
                                  if (saved) {
                                    delete next[paper.paperId];
                                  } else {
                                    next[paper.paperId] = paper;
                                  }
                                  return next;
                                })
                              }
                            >
                              {saved ? 'Saved' : 'Save'}
                            </Button>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Stack>
        </CardContent>
      </Card>

      {filteredSavedPapers.length > 0 && (
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Reading list</Typography>
                <Chip size="small" label={`${filteredSavedPapers.length} saved`} />
              </Stack>
              <Grid container spacing={2}>
                {filteredSavedPapers.map((paper) => (
                  <Grid item xs={12} md={6} key={paper.paperId}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {paper.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {paper.journal} ({paper.year})
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
};

const EvidenceCardView = ({ card }: { card: EvidenceCard }) => (
  <Card variant="outlined" sx={{ height: '100%' }}>
    <CardContent>
      <Stack spacing={1.5}>
        <Typography variant="subtitle1" fontWeight={600}>
          {card.title}
        </Typography>
        <Typography variant="body2">{card.takeaway}</Typography>
        <Divider />
        <Stack spacing={0.5}>
          <Typography variant="caption" color="text.secondary">
            Findings
          </Typography>
          {card.bullets.map((bullet, index) => (
            <Typography key={index} variant="body2">
              • {bullet}
            </Typography>
          ))}
        </Stack>
        <Stack spacing={0.5}>
          <Typography variant="caption" color="text.secondary">
            Limits
          </Typography>
          {card.limitations.map((limit, index) => (
            <Typography key={index} variant="body2" color="text.secondary">
              • {limit}
            </Typography>
          ))}
        </Stack>
        <Stack spacing={0.5}>
          <Typography variant="caption" color="text.secondary">
            Citations
          </Typography>
          {card.citations.map((citation, index) => (
            <Typography key={index} variant="caption">
              {citation.title} — {citation.authors} ({citation.year}) · {citation.levelOfEvidence}{' '}
              {citation.doi && (
                <Button
                  size="small"
                  variant="text"
                  onClick={() => window.open(`https://doi.org/${citation.doi}`, '_blank')}
                >
                  DOI
                </Button>
              )}
              {citation.url && (
                <Button size="small" variant="text" onClick={() => window.open(citation.url, '_blank')}>
                  Link
                </Button>
              )}
            </Typography>
          ))}
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);

export default ResearchHubPage;
