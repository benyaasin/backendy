import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  CircularProgress,
  Chip,
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import api from '../../lib/axios';

interface Post {
  id: number;
  title: string;
  content: string;
  published_at: string;
  category: {
    name: string;
  };
}

interface Comment {
  id: number;
  content: string;
  created_at: string;
  post: {
    id: number;
    title: string;
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Profile = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [postsResponse, commentsResponse] = await Promise.all([
          api.get<Post[]>(`/posts?user=${user?.id}`),
          api.get<Comment[]>(`/comments?user=${user?.id}`),
        ]);
        setPosts(postsResponse.data);
        setComments(commentsResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  if (!user) return null;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box mb={4}>
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {user.name}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              @{user.username}
            </Typography>
            <Chip
              label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              color={
                user.role === 'admin'
                  ? 'error'
                  : user.role === 'moderator'
                  ? 'warning'
                  : 'default'
              }
              size="small"
            />
          </CardContent>
        </Card>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
            <Tab label={`Gönderiler (${posts.length})`} />
            <Tab label={`Yorumlar (${comments.length})`} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {posts.map((post) => (
              <Grid item xs={12} key={post.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {post.content.substring(0, 200)}...
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Chip label={post.category.name} size="small" />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(post.published_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {comments.map((comment) => (
              <Grid item xs={12} key={comment.id}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      Re: {comment.post.title}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {comment.content}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Box>
    </Container>
  );
};

export default Profile; 