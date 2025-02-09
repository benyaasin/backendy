import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Person as PersonIcon,
  Article as ArticleIcon,
  Comment as CommentIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/axios';

interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  totalCategories: number;
}

interface RecentActivity {
  id: number;
  type: 'post' | 'comment' | 'user';
  title: string;
  username: string;
  createdAt: string;
}

const Dashboard = () => {
  const theme = useTheme();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPosts: 0,
    totalComments: 0,
    totalCategories: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, activityResponse] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/recent-activity'),
        ]);
        setStats(statsResponse.data);
        setRecentActivity(activityResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon, color }: any) => (
    <Card
      sx={{
        height: '100%',
        bgcolor: alpha(color, 0.1),
        '&:hover': {
          bgcolor: alpha(color, 0.15),
        },
        transition: 'background-color 0.3s',
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Avatar
            sx={{
              bgcolor: color,
              width: 48,
              height: 48,
            }}
          >
            {icon}
          </Avatar>
          <Box>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
              {value}
            </Typography>
            <Typography color="text.secondary">{title}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  return (
    <Box>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: theme.palette.primary.main,
          mb: 4,
        }}
      >
        Admin Paneli
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Toplam Kullanıcı"
            value={stats.totalUsers}
            icon={<PersonIcon />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Toplam Gönderi"
            value={stats.totalPosts}
            icon={<ArticleIcon />}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Toplam Yorum"
            value={stats.totalComments}
            icon={<CommentIcon />}
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Toplam Kategori"
            value={stats.totalCategories}
            icon={<CategoryIcon />}
            color={theme.palette.warning.main}
          />
        </Grid>
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Son Aktiviteler
        </Typography>
        <List>
          {recentActivity.map((activity, index) => (
            <React.Fragment key={activity.id}>
              {index > 0 && <Divider component="li" />}
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor:
                        activity.type === 'post'
                          ? theme.palette.success.main
                          : activity.type === 'comment'
                          ? theme.palette.info.main
                          : theme.palette.primary.main,
                    }}
                  >
                    {activity.type === 'post' ? (
                      <ArticleIcon />
                    ) : activity.type === 'comment' ? (
                      <CommentIcon />
                    ) : (
                      <PersonIcon />
                    )}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={activity.title}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {activity.username}
                      </Typography>
                      {' — '}
                      {formatDate(activity.createdAt)}
                    </>
                  }
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Dashboard; 