import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  CircularProgress,
  Alert,
  SelectChangeEvent,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/axios';

interface Category {
  id: number;
  name: string;
}

interface FormData {
  title: string;
  content: string;
  categoryId: string;
}

interface PostResponse {
  id: number;
  title: string;
  content: string;
  categoryId: number;
}

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();

  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    categoryId: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get<Category[]>('/categories');
        setCategories(response.data);
      } catch (err) {
        setError('Kategoriler yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.categoryId) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await api.post<PostResponse>('/posts', {
        ...formData,
        categoryId: Number(formData.categoryId),
      });
      navigate(`/posts/${response.data.id}`);
    } catch (err) {
      setError('Gönderi oluşturulurken bir hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">
          Bu sayfaya erişim yetkiniz bulunmamaktadır.
        </Typography>
      </Box>
    );
  }

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
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 'bold',
              color: theme.palette.primary.main,
            }}
          >
            Yeni Gönderi
          </Typography>

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
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <TextField
            fullWidth
            label="Başlık"
            name="title"
            value={formData.title}
            onChange={handleTextChange}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />

          <FormControl
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          >
            <InputLabel>Kategori</InputLabel>
            <Select
              value={formData.categoryId}
              onChange={handleSelectChange}
              label="Kategori"
              startAdornment={
                <CategoryIcon
                  sx={{
                    ml: 1,
                    mr: -0.5,
                    color: theme.palette.action.active,
                  }}
                />
              }
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="İçerik"
            name="content"
            value={formData.content}
            onChange={handleTextChange}
            multiline
            rows={8}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              mt: 2,
            }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 4,
                py: 1.5,
              }}
            >
              {submitting ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreatePost; 