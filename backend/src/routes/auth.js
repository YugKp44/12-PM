const express = require('express');
const passport = require('passport');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();

router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/analytics.readonly'],
    accessType: 'offline',
    prompt: 'consent'
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/auth/failed',
    successRedirect: 'http://localhost:5173/dashboard' // Redirect to frontend root instead of dashboard
  })
);

router.get('/failed', (req, res) => {
  res.status(401).json({ error: 'Authentication failed' });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/status', isAuthenticated, (req, res) => {
  res.json({ 
    isAuthenticated: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name
    }
  });
});

module.exports = router;