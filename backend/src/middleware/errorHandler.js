const { logger } = require('../config/logging');

const errorHandler = (err, req, res, next) => {
  logger.error('Error:', err);

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized access' });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: 'Internal server error' });
};

module.exports = {
  errorHandler
};