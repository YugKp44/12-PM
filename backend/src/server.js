const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { setupPassport } = require('./config/passport');
const { errorHandler } = require('./middleware/errorHandler');
const { setupLogging } = require('./config/logging');
const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const logger = setupLogging();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport initialization
setupPassport();
app.use(passport.initialize());
app.use(passport.session());

// Home page with authentication status and API documentation
app.get('/', (req, res) => {
  const html = req.isAuthenticated()
    ? `
      <h1>Google Analytics Dashboard</h1>
      <nav>
        <a href="/api/analytics/data?startDate=7daysAgo&endDate=today">View Analytics Data</a> | 
        <a href="/api/analytics/realtime">View Realtime Data</a> |
        <a href="/auth/logout">Logout</a>
      </nav>
      <p>Welcome, ${req.user.name}!</p>
      
      
    `
    : `
      <h1>Google Analytics Dashboard</h1>
      <p>Please <a href="/auth/google">Login with Google</a> to view analytics data.</p>
    `;
  
  res.send(html);
});

// Routes
app.use('/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
//testing routes
app.get('/test', (req, res) => {
  res.send('Hello World!');
});
// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});