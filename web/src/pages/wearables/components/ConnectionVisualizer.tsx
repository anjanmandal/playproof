import { Box, Stack, Typography } from '@mui/material';
import { keyframes } from '@mui/system';

export type VisualizerStatus = 'idle' | 'scanning' | 'connecting' | 'handshake' | 'streaming' | 'error';

const statusColors: Record<VisualizerStatus, string> = {
  idle: '#1f2937',
  scanning: '#2563eb',
  connecting: '#22d3ee',
  handshake: '#f59e0b',
  streaming: '#10b981',
  error: '#ef4444',
};

const pulse = keyframes`
  0% { opacity: 0.22; transform: scale(1); }
  70% { opacity: 0.02; transform: scale(1.55); }
  100% { opacity: 0; transform: scale(1.9); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-120%); }
  100% { transform: translateX(120%); }
`;

const STATUS_LABEL: Record<VisualizerStatus, string> = {
  idle: 'Link idle',
  scanning: 'Scanning...',
  connecting: 'Connecting...',
  handshake: 'Handshake in progress',
  streaming: 'Live stream',
  error: 'Error – retry',
};

export const ConnectionVisualizer = ({
  status,
  streamingIntensity = 0,
}: {
  status: VisualizerStatus;
  streamingIntensity?: number;
}) => {
  const accent = statusColors[status];
  const pulseOpacity = status === 'streaming' ? 0.35 + streamingIntensity * 0.4 : 0.25;
  const showActivity = status !== 'idle';

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: { xs: 240, sm: 260, md: 300 },
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative',
        border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(15,25,60,0.1)'}`,
        backgroundImage:
          "linear-gradient(160deg, rgba(13,18,40,0.85), rgba(5,9,18,0.7)), url('/wearable.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'linear-gradient(0deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.65) 100%)',
        }}
      />

      {showActivity && (
        <>
          <Box
            sx={{
              position: 'absolute',
              width: 260,
              height: 260,
              borderRadius: '50%',
              left: { xs: '8%', md: '12%' },
              top: { xs: '16%', md: '18%' },
              transform: 'translate(-20%, -20%)',
              background: `radial-gradient(circle, ${accent} ${pulseOpacity * 100}%, transparent 70%)`,
              opacity: 0.25,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              width: 220,
              height: 220,
              borderRadius: '50%',
              left: { xs: '15%', md: '18%' },
              top: { xs: '25%', md: '26%' },
              transform: 'translate(-20%, -20%)',
              border: `2px solid ${accent}`,
              opacity: 0.4,
              animation: `${pulse} 2.8s ease-out infinite`,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              top: 0,
              width: '60%',
              height: '100%',
              transform: 'skewX(-15deg)',
              background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.25) 40%, rgba(255,255,255,0) 80%)',
              mixBlendMode: 'screen',
              opacity: 0.35,
              animation: `${shimmer} 4s linear infinite`,
            }}
          />
        </>
      )}

    </Box>
  );
};
