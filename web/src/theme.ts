import { alpha, createTheme } from '@mui/material/styles';

const primaryGradient = 'linear-gradient(135deg, #3358f4 0%, #1d8cf8 50%, #45c4ff 100%)';

export const theme = createTheme({
  palette: {
    mode: 'light',
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
    },
    background: {
      default: '#f4f6fb',
      paper: '#ffffff',
    },
    divider: alpha('#0b1a51', 0.08),
  },
  typography: {
    fontFamily: 'Inter, SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0px 4px 16px rgba(13, 74, 255, 0.06)',
    '0px 10px 30px rgba(13, 74, 255, 0.08)',
    ...Array(22).fill('0px 10px 30px rgba(13, 74, 255, 0.08)'),
  ] as any,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(51, 88, 244, 0.12) 0, rgba(51, 88, 244, 0) 45%), radial-gradient(circle at 80% 0%, rgba(32, 201, 151, 0.12) 0, rgba(32, 201, 151, 0) 40%)',
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
          paddingLeft: 20,
          paddingRight: 20,
        },
        containedPrimary: {
          backgroundImage: primaryGradient,
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: '1px solid rgba(12, 34, 118, 0.08)',
          boxShadow: '0 18px 40px rgba(17, 38, 146, 0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
    },
  },
});
