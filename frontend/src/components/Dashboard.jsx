import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart } from "react-google-charts";
import "./Dashboard.css"; // Add a dedicated CSS file

const Dashboard = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/analytics/data?startDate=7daysAgo&endDate=today",
          { withCredentials: true }
        );
        setAnalyticsData(response.data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        setError("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  const top8AnalyticsData = analyticsData.slice(0, 8);

  const geoChartData = [
    ["Country", "Active Users"],
    ...analyticsData.map(({ country, activeUsers }) => [country, activeUsers]),
  ];

  const geoChartOptions = {
    colorAxis: { colors: ["#e0f7fa", "#0066cc"] },
    backgroundColor: "#f8f9fa",
    datalessRegionColor: "#f0f0f0",
    defaultColor: "#f5f5f5",
  };

  const barChartData = [
    ["Country", "Active Users", "New Users"],
    ...top8AnalyticsData.map(({ country, activeUsers, newUsers }) => [
      country,
      activeUsers,
      newUsers,
    ]),
  ];

  const barChartOptions = {
    title: "Active and New Users by Country",
    hAxis: { title: "Users", minValue: 0 },
    vAxis: { title: "Country" },
    bars: "horizontal",
    legend: { position: "top" },
   chartArea: { width: "80%", height: "70%" },
    colors: ["#1e88e5", "#42a5f5"],
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Google Analytics Dashboard</h1>

      {loading ? (
        <p className="dashboard-loading">Loading data...</p>
      ) : error ? (
        <p className="dashboard-error">{error}</p>
      ) : (
        <>
          {/* GeoChart */}
          <div className="chart-container">
            <Chart
              chartType="GeoChart"
              data={geoChartData}
              options={geoChartOptions}
              width="100%"
              height="500px"
            />
          </div>

          {/* Bar Chart */}
          <div className="chart-container">
            <Chart
              chartType="BarChart"
              data={barChartData}
              options={barChartOptions}
              width="100%"
              height="400px"
            />
          </div>

          {/* Country-Wise Details Table */}
          <div className="table-container">
            <h2 className="table-title">Country-Wise Details</h2>
            <table className="details-table">
              <thead>
                <tr>
                  <th>Country</th>
                  <th>Active Users</th>
                  <th>New Users</th>
                  <th>Change (%)</th>
                </tr>
              </thead>
              <tbody>
                {top8AnalyticsData.map(
                  ({ country, activeUsers, newUsers, change }) => (
                    <tr key={country}>
                      <td>{country}</td>
                      <td>{activeUsers}</td>
                      <td>{newUsers}</td>
                      <td
                        style={{
                          color: change >= 0 ? "#1e88e5" : "#e53935",
                          fontWeight: "bold",
                        }}
                      >
                        {change}%
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
