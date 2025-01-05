const { google } = require('googleapis');
const { logger } = require('../config/logging');

const analyticsData = google.analyticsdata('v1beta');

// Function to calculate percentage difference
const calculatePercentageDifference = (currentValue, previousValue) => {
  if (previousValue === 0) return 0;
  return ((currentValue - previousValue) / previousValue) * 100;
};

// Fetch standard analytics data and calculate percentage difference
const getAnalyticsData = async (accessToken, options) => {
  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const response = await analyticsData.properties.runReport({
      auth,
      property: `properties/${process.env.GOOGLE_ANALYTICS_PROPERTY_ID}`,
      requestBody: {
        dimensions: [{ name: 'country' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'newUsers' }
        ],
        dateRanges: [
          {
            startDate: '7daysAgo',
            endDate: 'today',
          }
        ]
      }
    });

    // Process the response data and calculate the percentage difference
    const rows = response.data?.rows || [];
    const aggregatedData = rows.map(row => {
      const country = row.dimensionValues[0]?.value || 'Unknown';
      const activeUsers = parseInt(row.metricValues[0]?.value || '0', 10);
      const newUsers = parseInt(row.metricValues[1]?.value || '0', 10);

      // Calculate the percentage difference between activeUsers and newUsers
      const change = calculatePercentageDifference(activeUsers, newUsers);

      return {
        country,
        activeUsers,
        newUsers,
        change: change.toFixed(2), // Round to 2 decimal places
      };
    });

    return aggregatedData;
  } catch (error) {
    logger.error('Error fetching analytics data:', error);
    throw error;
  }
};

// Fetch real-time analytics data
const getRealTimeData = async (accessToken) => {
  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const response = await analyticsData.properties.runRealtimeReport({
      auth,
      property: `properties/${process.env.GOOGLE_ANALYTICS_PROPERTY_ID}`,
      requestBody: {
        metrics: [{ name: 'activeUsers' }],
        dimensions: [{ name: 'country' }]
      }
    });

    return response.data;
  } catch (error) {
    logger.error('Error fetching realtime data:', error);
    throw error;
  }
};

module.exports = {
  getAnalyticsData,
  getRealTimeData
};
