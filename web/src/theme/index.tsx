import { alpha, createTheme, responsiveFontSizes, type PaletteMode, type Theme } from '@mui/material/styles';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type ThemeMode = Exclude<PaletteMode, undefined>;

interface ThemeModeContextValue {
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(undefined);

const primaryGradient = 'linear-gradient(128deg, #63f5c5 0%, #3563ff 100%)';
const THEME_STORAGE_KEY = 'healthtech_theme_mode';

const getInitialMode = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  const prefersDark =
    window.matchMedia && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false;

  return prefersDark ? 'dark' : 'light';
};

const getDesignTokens = (mode: ThemeMode) => {
  const isLight = mode === 'light';

  return {
    palette: {
      mode,
      primary: {
        main: '#3563ff',
        light: '#5b7bff',
        dark: '#163bcb',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#20c997',
        light: '#63e1b7',
        dark: '#118463',
        contrastText: '#041617',
      },
      error: {
        main: '#ff4d67',
      },
      warning: {
        main: '#ffb547',
      },
      info: {
        main: '#4dabff',
      },
      success: {
        main: '#21d07a',
      },
      text: {
        primary: isLight ? '#101321' : '#f4f6ff',
        secondary: isLight ? alpha('#101321', 0.64) : alpha('#f4f6ff', 0.7),
      },
      divider: alpha(isLight ? '#0b1a51' : '#98a9ff', isLight ? 0.1 : 0.22),
      background: {
        default: isLight ? '#f4f6fb' : '#050713',
        paper: isLight ? '#ffffff' : '#0d1229',
      },
      grey: {
        100: isLight ? '#f1f5ff' : '#262c46',
        200: isLight ? '#e6ebfb' : '#2f3652',
        300: isLight ? '#d7def5' : '#3a4360',
        400: isLight ? '#c2cae8' : '#4a5472',
        500: isLight ? '#9fa8c8' : '#5c6788',
        600: isLight ? '#757f9f' : '#6f7da2',
        700: isLight ? '#5b667f' : '#8c9bc0',
        800: isLight ? '#414a5f' : '#a9b6d8',
        900: isLight ? '#2c3241' : '#cbd3eb',
      },
    },
    typography: {
      fontFamily:
        '"Inter", "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 600,
      fontWeightBold: 700,
      h1: { fontSize: '3rem', fontWeight: 700, letterSpacing: '-0.04em' },
      h2: { fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.03em' },
      h3: { fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.025em' },
      h4: { fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' },
      h5: { fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.01em' },
      h6: { fontSize: '1.125rem', fontWeight: 600, letterSpacing: '-0.005em' },
      subtitle1: { fontWeight: 600 },
      subtitle2: { fontWeight: 600, letterSpacing: '0.01em' },
      button: { fontWeight: 600, letterSpacing: '0.01em', textTransform: 'none' as const },
      overline: { fontWeight: 600, letterSpacing: '0.2em' },
    },
    shape: {
      borderRadius: 16,
    },
  };
};

export const createAppTheme = (mode: ThemeMode = 'light'): Theme => {
  const tokens = getDesignTokens(mode);
  const theme = createTheme(tokens);
  const isLight = theme.palette.mode === 'light';

  theme.components = {
    ...theme.components,
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          colorScheme: isLight ? 'light' : 'dark',
        },
        body: {
          backgroundColor: theme.palette.background.default,
          backgroundImage: isLight
            ? 'radial-gradient(circle at 20% 20%, rgba(51, 88, 244, 0.12) 0, rgba(51, 88, 244, 0) 45%), radial-gradient(circle at 80% 0%, rgba(32, 201, 151, 0.12) 0, rgba(32, 201, 151, 0) 45%)'
            : 'radial-gradient(circle at 12% 18%, rgba(99, 245, 197, 0.12) 0%, transparent 45%), radial-gradient(circle at 88% -10%, rgba(53, 99, 255, 0.22) 0%, transparent 50%), radial-gradient(circle at 50% 100%, rgba(16, 20, 48, 0.75) 0%, rgba(5, 7, 19, 0.9) 65%)',
          color: theme.palette.text.primary,
          transition: 'background-color 0.3s ease, color 0.3s ease',
          minHeight: '100vh',
        },
        '*, *::before, *::after': {
          borderColor: alpha(theme.palette.common.white, isLight ? 0.1 : 0.18),
        },
        a: {
          color: theme.palette.primary.main,
        },
        '::-webkit-scrollbar': {
          width: 10,
        },
        '::-webkit-scrollbar-thumb': {
          backgroundColor: alpha('#1d2756', isLight ? 0.12 : 0.4),
          borderRadius: 999,
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: theme.shape.borderRadius * 1.15,
          border: `1px solid ${alpha(
            isLight ? theme.palette.primary.main : '#5661ff',
            isLight ? 0.08 : 0.18,
          )}`,
          backgroundImage: isLight
            ? 'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.9) 100%)'
            : 'linear-gradient(180deg, rgba(13,18,41,0.92) 0%, rgba(7,10,26,0.94) 100%)',
          backdropFilter: 'blur(14px)',
          boxShadow: isLight
            ? '0 18px 45px rgba(17, 38, 146, 0.08)'
            : '0 28px 60px rgba(4, 8, 28, 0.65)',
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: theme.shape.borderRadius * 1.25,
          backgroundColor: 'transparent',
          backgroundImage: isLight
            ? 'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(244,246,251,0.92) 100%)'
            : 'linear-gradient(180deg, rgba(13,18,41,0.92) 0%, rgba(6,9,24,0.95) 100%)',
          border: `1px solid ${alpha(
            isLight ? theme.palette.primary.main : '#63f5c5',
            isLight ? 0.08 : 0.22,
          )}`,
          boxShadow: isLight
            ? '0 18px 45px rgba(17, 38, 146, 0.12)'
            : '0 28px 70px rgba(5, 11, 27, 0.55)',
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        color: 'transparent',
      },
      styleOverrides: {
        root: {
          backdropFilter: 'blur(14px)',
          backgroundColor: alpha(
            isLight ? '#ffffff' : '#070b1c',
            isLight ? 0.9 : 0.75,
          ),
          borderBottom: `1px solid ${alpha(
            isLight ? theme.palette.primary.main : '#5661ff',
            isLight ? 0.04 : 0.18,
          )}`,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600,
          paddingInline: theme.spacing(3),
          paddingBlock: theme.spacing(1.25),
        },
        containedPrimary: {
          backgroundImage: primaryGradient,
          color: '#09112f',
          boxShadow: '0 12px 30px rgba(53, 99, 255, 0.25)',
          '&:hover': {
            backgroundImage: primaryGradient,
            boxShadow: '0 14px 38px rgba(53, 99, 255, 0.28)',
          },
        },
        outlined: {
          borderWidth: 1.5,
          '&:hover': {
            borderWidth: 1.5,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600,
          letterSpacing: '0.01em',
          backgroundColor: alpha(
            isLight ? theme.palette.primary.main : theme.palette.primary.light,
            isLight ? 0.08 : 0.22,
          ),
          color: isLight ? theme.palette.primary.dark : theme.palette.primary.light,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundColor: isLight ? '#ffffff' : alpha('#101534', 0.75),
          transition: 'background-color 0.2s ease, border-color 0.2s ease',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(
              isLight ? '#0b1a51' : '#6e7bff',
              isLight ? 0.18 : 0.3,
            ),
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(
              isLight ? theme.palette.primary.main : '#8a95ff',
              isLight ? 0.32 : 0.45,
            ),
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
            borderWidth: 2,
          },
        },
        input: {
          padding: '14px 16px',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backdropFilter: 'blur(6px)',
          borderRadius: 10,
          padding: '8px 12px',
          fontSize: '0.75rem',
          backgroundColor: alpha(isLight ? '#0b1a51' : '#e9ecff', isLight ? 0.88 : 0.92),
          color: isLight ? '#f5f6ff' : '#0a1025',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '&.Mui-selected': {
            backgroundColor: alpha(
              theme.palette.primary.main,
              isLight ? 0.12 : 0.24,
            ),
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(theme.palette.primary.main, isLight ? 0.12 : 0.35),
          color: isLight ? theme.palette.primary.dark : '#f5f6ff',
          fontWeight: 600,
        },
      },
    },
  };

  return responsiveFontSizes(theme);
};

export const AppThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_STORAGE_KEY, mode);
      document.documentElement.setAttribute('data-app-theme', mode);
    }
  }, [mode]);

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const contextValue = useMemo<ThemeModeContextValue>(
    () => ({
      mode,
      toggleMode: () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
      setMode,
    }),
    [mode],
  );

  return (
    <ThemeModeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within an AppThemeProvider');
  }
  return context;
};
