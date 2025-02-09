import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  CircularProgress,
  InputAdornment,
  CardActionArea,
  CardActions,
  Avatar,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  CardMedia,
  Skeleton,
  SelectChangeEvent,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Comment as CommentIcon,
  Category as CategoryIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/axios';

interface Category {
  id: number;
  name: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  categoryId: number;
  category: Category;
  userId: number;
  username: string;
  commentCount: number;
  createdAt: string;
  readTime: number; // Tahmini okuma süresi
}

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { user } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsResponse, categoriesResponse] = await Promise.all([
          api.get<Post[]>('/posts'),
          api.get<Category[]>('/categories'),
        ]);
        setPosts(postsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (err) {
        setError('Gönderiler yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value);
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || post.categoryId === Number(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  const getRandomImage = (query: string) => {
    return `https://source.unsplash.com/800x400/?${encodeURIComponent(query)}`;
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

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 'bold',
            color: theme.palette.primary.main,
            fontSize: { xs: '1.75rem', sm: '2.125rem' },
          }}
        >
          Gönderiler
        </Typography>

        {user && (user.role === 'admin' || user.role === 'moderator') && (
          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/posts/create"
            startIcon={<AddIcon />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              py: 1,
            }}
          >
            Yeni Gönderi
          </Button>
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 4,
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Gönderi ara..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            flex: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />

        <FormControl
          variant="outlined"
          sx={{
            flex: 1,
            minWidth: { xs: '100%', sm: 200 },
          }}
        >
          <InputLabel>Kategori</InputLabel>
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            label="Kategori"
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="all">Tüm Kategoriler</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" width="30%" />
                  <Skeleton variant="text" height={60} />
                  <Skeleton variant="text" height={80} />
                </CardContent>
                <CardActions>
                  <Skeleton variant="circular" width={32} height={32} />
                  <Skeleton variant="text" width="60%" />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : filteredPosts.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            bgcolor: alpha(theme.palette.primary.main, 0.04),
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Gönderi bulunamadı
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Farklı bir arama terimi veya kategori deneyin
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredPosts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <PostCard post={post} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

const PostCard = ({ post }: { post: Post }) => {
  const theme = useTheme();
  const { user } = useAuth();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardActionArea component={RouterLink} to={`/posts/${post.id}`}>
        <CardMedia
          component="img"
          height="200"
          image={post.imageUrl || getRandomImage(post.category.name)}
          alt={post.title}
          sx={{
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ mb: 2 }}>
            <Chip
              label={post.category.name}
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                fontWeight: 500,
              }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ ml: 1 }}
            >
              {post.readTime} dk okuma
            </Typography>
          </Box>

          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.3,
              minHeight: '2.6em',
              fontWeight: 600,
            }}
          >
            {post.title}
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              mb: 2,
              minHeight: '4.5em',
            }}
          >
            {post.content}
          </Typography>
        </CardContent>
      </CardActionArea>

      <CardActions
        sx={{
          justifyContent: 'space-between',
          bgcolor: alpha(theme.palette.primary.main, 0.04),
          px: 2,
          py: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: theme.palette.primary.main,
              fontSize: '0.875rem',
            }}
          >
            {post.username[0].toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle2">{post.username}</Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDate(post.createdAt)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="Yorum sayısı">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CommentIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {post.commentCount}
              </Typography>
            </Box>
          </Tooltip>

          {user && (user.role === 'admin' || post.userId === user.id) && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Düzenle">
                <IconButton
                  size="small"
                  component={RouterLink}
                  to={`/posts/${post.id}/edit`}
                  sx={{
                    color: theme.palette.primary.main,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
      </CardActions>
    </Card>
  );
};

export default Posts; 