const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const { validateDateRange } = require('../middleware/validation');
const { getAnalyticsData, getRealTimeData } = require('../services/analytics');
const router = express.Router();

router.get('/data', 
  isAuthenticated,
  validateDateRange,
  async (req, res, next) => {
    try {
      const { startDate, endDate, metrics, dimensions } = req.query;
      const data = await getAnalyticsData(
        req.user.accessToken,
        {
          startDate,
          endDate,
          metrics: metrics?.split(',') || ['activeUsers'],
          dimensions: dimensions?.split(',') || ['date']
        }
      );
      res.json(data);
    } catch (error) {
      next(error);
    }
});

router.get('/realtime',
  isAuthenticated,
  async (req, res, next) => {
    try {
      const data = await getRealTimeData(req.user.accessToken);
      res.json(data);
    } catch (error) {
      next(error);
    }
});

module.exports = router;
