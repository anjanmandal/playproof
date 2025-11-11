import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Drawer,
  IconButton,
  LinearProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HealingIcon from '@mui/icons-material/Healing';
import GroupsIcon from '@mui/icons-material/Groups';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import EventNoteIcon from '@mui/icons-material/EventNote';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import LockIcon from '@mui/icons-material/Lock';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ForumIcon from '@mui/icons-material/Forum';
import ScienceIcon from '@mui/icons-material/Science';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import type { Role } from '@/types';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '@/hooks/useAuth';
import type { NotificationRecord } from '@/types';
import { fetchNotifications } from '@/api/notifications';
import { formatDistanceToNow } from 'date-fns';

const drawerWidth = 260;

const BASE_NAV_ITEMS: Array<{
  label: string;
  icon: React.ReactNode;
  path: string;
  roles?: Role[];
}> = [
  { label: 'Overview', icon: <DashboardIcon />, path: '/' },
  { label: 'Home Session', icon: <TrendingUpIcon />, path: '/home-session' },
  { label: 'Edge Vision Coach', icon: <VisibilityIcon />, path: '/edge-coach' },
  { label: 'Movement Coach', icon: <DirectionsRunIcon />, path: '/movement', roles: ['COACH', 'AT_PT', 'ADMIN'] },
  { label: 'Daily Risk', icon: <AssessmentIcon />, path: '/risk', roles: ['COACH', 'AT_PT', 'ADMIN'] },
  { label: 'Case Channel', icon: <ForumIcon />, path: '/case-channel', roles: ['COACH', 'AT_PT', 'ADMIN'] },
  { label: 'Research Hub', icon: <ScienceIcon />, path: '/research' },
  { label: 'Tele-PT Clinic', icon: <VideoCameraFrontIcon />, path: '/tele-pt', roles: ['AT_PT', 'ADMIN'] },
  { label: 'Community Kiosk', icon: <QrCodeScannerIcon />, path: '/community-kiosk', roles: ['COACH', 'ADMIN'] },
  { label: 'eConsult', icon: <AssignmentIndIcon />, path: '/econsult', roles: ['COACH', 'AT_PT', 'ADMIN'] },
  { label: 'Team Planner', icon: <EventNoteIcon />, path: '/planner', roles: ['COACH', 'ADMIN'] },
  { label: 'Rehab Co-Pilot', icon: <HealingIcon />, path: '/rehab', roles: ['COACH', 'AT_PT', 'ADMIN'] },
  { label: 'Athlete Portal', icon: <GroupsIcon />, path: '/portal', roles: ['COACH', 'AT_PT', 'ADMIN'] },
];

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  const initials = useMemo(() => user?.email?.[0]?.toUpperCase?.() ?? '?', [user]);
  const navItems = useMemo(() => {
    const items = [...BASE_NAV_ITEMS];
    if (user?.role === 'ATHLETE') {
      items.push({
        label: 'My Tasks',
        icon: <AssignmentTurnedInIcon />,
        path: '/athlete/tasks',
        roles: ['ATHLETE'],
      });
      items.push({
        label: 'Cycle Privacy',
        icon: <LockIcon />,
        path: '/athlete/privacy/cycle',
        roles: ['ATHLETE'],
      });
    }
    return items.filter((item) => !item.roles || (user?.role ? item.roles.includes(user.role) : false));
  }, [user?.role]);

  const loadNotifications = useCallback(async () => {
    if (user?.role !== 'ATHLETE') return;
    setNotificationsLoading(true);
    try {
      const result = await fetchNotifications();
      setNotifications(result);
    } catch (error) {
      console.warn('Failed to load notifications', error);
    } finally {
      setNotificationsLoading(false);
    }
  }, [user?.role]);

  useEffect(() => {
    if (user?.role === 'ATHLETE') {
      void loadNotifications();
    }
  }, [loadNotifications, user?.role]);

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          PivotProof
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ACL Safety Platform
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {navItems.map((item) => {
          const selected =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);
          return (
            <ListItemButton
              key={item.path}
              selected={selected}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
      <Divider />
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>{initials}</Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2">{user?.email}</Typography>
          <Typography variant="caption" color="text.secondary">
          {user?.role?.toLowerCase()}
          </Typography>
        </Box>
        <IconButton color="inherit" onClick={logout}>
          <LogoutIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <Toolbar>
          {!isMdUp && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen((prev) => !prev)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div">
            {navItems.find((item) => location.pathname.startsWith(item.path))?.label ??
              'Dashboard'}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {user?.role === 'ATHLETE' && (
            <IconButton
              color="inherit"
              onClick={() => setNotificationsOpen(true)}
              aria-label="Notifications"
            >
              <Badge color="primary" badgeContent={notifications.length} max={99}>
                <NotificationsNoneIcon />
              </Badge>
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="navigation"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      {user?.role === 'ATHLETE' && (
        <Drawer
          anchor="right"
          open={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
          ModalProps={{ keepMounted: true }}
        >
          <Box sx={{ width: { xs: 300, sm: 360 }, p: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <Typography variant="h6">Notifications</Typography>
              <Button
                size="small"
                onClick={() => {
                  void loadNotifications();
                }}
                disabled={notificationsLoading}
              >
                Refresh
              </Button>
            </Stack>
            {notificationsLoading && <LinearProgress sx={{ mt: 1 }} />}
            <Stack spacing={1.5} sx={{ mt: 2 }}>
              {notifications.length === 0 && !notificationsLoading && (
                <Typography variant="body2" color="text.secondary">
                  Nothing new yet. You’ll see planner and daily risk alerts here.
                </Typography>
              )}
              {notifications.map((notification) => (
                <Card key={notification.id} variant="outlined">
                  <CardContent>
                    <Stack spacing={0.75}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {notification.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {notification.body}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        </Drawer>
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};
