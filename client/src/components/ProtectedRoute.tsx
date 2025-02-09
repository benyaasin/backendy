import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
  permissions?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  roles = [],
  permissions = [],
}) => {
  const { user, loading, isAuthenticated, hasPermission } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography color="text.secondary">Yetkilendirme kontrol ediliyor...</Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    // Giriş yapılmamışsa, kullanıcıyı giriş sayfasına yönlendir ve mevcut sayfayı kaydet
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(user?.role || '')) {
    // Kullanıcının rolü uygun değilse ana sayfaya yönlendir
    return <Navigate to="/" replace />;
  }

  if (permissions.length > 0 && !permissions.every(permission => hasPermission(permission))) {
    // Kullanıcının gerekli izinleri yoksa ana sayfaya yönlendir
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}; 