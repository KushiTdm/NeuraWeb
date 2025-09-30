// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

// Routes
import contactRoutes from './routes/contact';
import quoteRoutes from './routes/quotes';
import bookingRoutes from './routes/booking';
import adminRoutes from './routes/admin';
import clientRoutes from './routes/client';
import wizardRoutes from './routes/wizard';
import authRoutes from './routes/auth';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const isDevelopment = process.env.NODE_ENV === 'development';

app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 1000 : 200, // Plus permissif en dev
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://neuraweb.tech',
  'https://www.neuraweb.tech',
];

// Ajouter FRONTEND_URL si définie
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

console.log('CORS allowed origins:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origin (Postman, mobile apps, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // En développement, être plus permissif
    if (isDevelopment) {
      return callback(null, true);
    }
    
    // Vérifier si l'origin est autorisée
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS blocked origin: ${origin}`);
      console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-Access-Token',
    'Cache-Control',
    'Pragma',
  ],
  exposedHeaders: ['X-Total-Count'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request timeout middleware
app.use((req, res, next) => {
  res.setTimeout(30000, () => {
    console.log(`Request timeout: ${req.method} ${req.url}`);
    if (!res.headersSent) {
      res.status(408).json({ 
        error: 'Request timeout',
        message: 'The request took too long to process' 
      });
    }
  });
  next();
});

// Logging middleware
if (isDevelopment) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Request debugging middleware
app.use((req, res, next) => {
  const origin = req.get('Origin') || req.get('Referer') || 'none';
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Origin: ${origin}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    cors: {
      allowedOrigins: allowedOrigins,
      requestOrigin: req.get('Origin') || 'none'
    }
  });
});

// Test CORS endpoint
app.post('/api/test-cors', (req, res) => {
  res.json({
    success: true,
    message: 'CORS test successful',
    origin: req.get('Origin'),
    method: req.method,
    headers: req.headers,
    timestamp: new Date().toISOString()
  });
});

// Preflight handling pour toutes les routes API
app.options('/api/*', (req, res) => {
  console.log(`Preflight request: ${req.method} ${req.url} - Origin: ${req.get('Origin')}`);
  res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization,X-Access-Token');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// API Routes
app.use('/api/contact', contactRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/wizard', wizardRoutes);
app.use('/api/auth', authRoutes);

// Catch-all pour routes API non trouvées
app.use('/api/*', (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.path,
    method: req.method,
    availableRoutes: [
      '/api/health', 
      '/api/contact', 
      '/api/quotes', 
      '/api/booking', 
      '/api/auth'
    ]
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Global error handler:', err);
  
  if (err.message && err.message.includes('CORS')) {
    res.status(403).json({
      error: 'CORS Error',
      message: 'Cross-origin request blocked',
      origin: req.get('Origin'),
      allowedOrigins: allowedOrigins
    });
    return;
  }
  
  if (!res.headersSent) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: isDevelopment ? err.message : 'Something went wrong'
    });
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API Health: http://localhost:${PORT}/api/health`);
  console.log(`CORS Origins: ${allowedOrigins.join(', ')}`);
  
  // Log environment variables pour debugging
  console.log('Environment check:');
  console.log(`   FRONTEND_URL: ${process.env.FRONTEND_URL || 'NOT SET'}`);
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'NOT SET'}`);
  console.log(`   SENDGRID_API_KEY: ${process.env.SENDGRID_API_KEY ? 'SET' : 'NOT SET'}`);
});

server.timeout = 30000;

export default app;