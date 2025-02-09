import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import categoryRoutes from './routes/categoryRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import tagRoutes from './routes/tagRoutes';
import authRoutes from './routes/authRoutes';
import { authenticate } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter, loginLimiter } from './middleware/rateLimit';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(helmet()); // Adds various HTTP headers for security
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// API Rate Limiting
app.use('/api', apiLimiter);
app.use('/auth/login', loginLimiter);
app.use('/auth/register', loginLimiter);

// API Version Prefix
const API_PREFIX = '/api/v1';

// Public Routes (Kimlik doğrulaması gerektirmeyen)
app.use(`${API_PREFIX}/posts`, postRoutes);
app.use(`${API_PREFIX}/comments`, commentRoutes);
app.use(`${API_PREFIX}/categories`, categoryRoutes);

// Protected Routes (Kimlik doğrulaması gerektiren)
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/tags`, authenticate, tagRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Blog API is running',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api-docs', express.static(path.join(__dirname, 'docs')));

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found',
    path: req.path
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
  console.log(`Documentation available at http://localhost:${PORT}/api-docs`);
});

export default app; 