import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
  Avatar,
  IconButton,
  Paper,
  useTheme,
  alpha,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  Category as CategoryIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Comment as CommentIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/axios';

interface Category {
  id: number;
  name: string;
}

interface Comment {
  id: number;
  content: string;
  userId: number;
  username: string;
  createdAt: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  categoryId: number;
  category: Category;
  userId: number;
  username: string;
  createdAt: string;
}

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postResponse, commentsResponse] = await Promise.all([
          api.get<Post>(`/posts/${id}`),
          api.get<Comment[]>(`/posts/${id}/comments`),
        ]);
        setPost(postResponse.data);
        setComments(commentsResponse.data);
      } catch (err) {
        setError('Gönderi yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleCommentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!newComment.trim()) {
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await api.post<Comment>(`/posts/${id}/comments`, {
        content: newComment,
      });
      setComments((prev) => [...prev, response.data]);
      setNewComment('');
    } catch (err) {
      setError('Yorum eklenirken bir hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/posts/${id}`);
      navigate('/posts');
    } catch (err) {
      setError('Gönderi silinirken bir hata oluştu.');
    }
    setDeleteDialogOpen(false);
  };

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

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!post) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">Gönderi bulunamadı.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 4 },
          bgcolor: 'background.default',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            mb: 4,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/posts')}
              startIcon={<ArrowBackIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
              }}
            >
              Gönderilere Dön
            </Button>

            {user && (user.role === 'admin' || post.userId === user.id) && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Düzenle">
                  <IconButton
                    color="primary"
                    component={RouterLink}
                    to={`/posts/${post.id}/edit`}
                    sx={{
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Sil">
                  <IconButton
                    color="error"
                    onClick={() => setDeleteDialogOpen(true)}
                    sx={{
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: theme.palette.primary.main,
            }}
          >
            {post.title}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              mb: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CategoryIcon
                fontSize="small"
                sx={{ color: theme.palette.primary.main }}
              />
              <Chip
                label={post.category.name}
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  bgcolor: theme.palette.primary.main,
                  fontSize: '0.875rem',
                }}
              >
                {post.username[0].toUpperCase()}
              </Avatar>
              <Typography variant="body2" color="text.secondary">
                {post.username}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ScheduleIcon
                fontSize="small"
                sx={{ color: theme.palette.text.secondary }}
              />
              <Typography variant="body2" color="text.secondary">
                {formatDate(post.createdAt)}
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="body1"
            sx={{
              whiteSpace: 'pre-wrap',
              lineHeight: 1.8,
            }}
          >
            {post.content}
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: theme.palette.text.primary,
            }}
          >
            <CommentIcon /> Yorumlar ({comments.length})
          </Typography>

          {user ? (
            <Box
              component="form"
              onSubmit={handleCommentSubmit}
              sx={{ mb: 4 }}
            >
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Yorumunuzu yazın..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={submitting}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitting || !newComment.trim()}
                startIcon={submitting ? <CircularProgress size={20} /> : <SendIcon />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 3,
                }}
              >
                {submitting ? 'Gönderiliyor...' : 'Gönder'}
              </Button>
            </Box>
          ) : (
            <Alert
              severity="info"
              sx={{
                mb: 4,
                borderRadius: 2,
                '& .MuiAlert-message': {
                  display: 'flex',
                  gap: 1,
                },
              }}
            >
              Yorum yapmak için
              <Button
                component={RouterLink}
                to="/login"
                color="primary"
                size="small"
                sx={{ textTransform: 'none' }}
              >
                giriş yapın
              </Button>
            </Alert>
          )}

          {comments.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 4,
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                borderRadius: 2,
              }}
            >
              <Typography color="text.secondary">
                Henüz yorum yapılmamış. İlk yorumu siz yapın!
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {comments.map((comment) => (
                <Card
                  key={comment.id}
                  elevation={0}
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                    borderRadius: 2,
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          bgcolor: theme.palette.primary.main,
                          fontSize: '0.875rem',
                        }}
                      >
                        {comment.username[0].toUpperCase()}
                      </Avatar>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: theme.palette.text.primary }}
                      >
                        {comment.username}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        • {formatDate(comment.createdAt)}
                      </Typography>
                    </Box>
                    <Typography variant="body2">{comment.content}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            width: '100%',
            maxWidth: 400,
          },
        }}
      >
        <DialogTitle>Gönderiyi Sil</DialogTitle>
        <DialogContent>
          <Typography>
            Bu gönderiyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
            }}
          >
            İptal
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
            }}
          >
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PostDetail; 