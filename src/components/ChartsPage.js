import React, { useState, useEffect } from 'react';
import {
  XYPlot,
  VerticalBarSeries,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  DiscreteColorLegend,
} from 'react-vis'; // Import Library for Charts
import ChartErrorBoundary from './ChartErrorBoundary';
import './ChartsPage.css'; // Import a CSS file for styling (create this file in the same directory as your component)

const ChartsPage = () => {
  const [chartData, setChartData] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    try {
      // Fetch data from Spring Boot backend
      const response = await fetch(`http://localhost:8080/api/electricity-connections/home`);
      const fetchedData = await response.json();

      if (!fetchedData || !Array.isArray(fetchedData)) {
        console.error('Invalid or empty data received from the backend:', fetchedData); 
        return;
      }

      setData(fetchedData); // Set the data to the state

      // Filter data based on the selected status filter
      const filteredData =
        statusFilter === 'all'
          ? fetchedData
          : fetchedData.filter((entry) => entry.status === statusFilter);

      // Process data for chart
      const monthCounts = {};
      filteredData.forEach((entry) => {
        const date = new Date(entry.dateOfApplication);
        const monthName = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);

        if (!monthCounts[monthName]) {
          monthCounts[monthName] = 1;
        } else {
          monthCounts[monthName] += 1;
        }
      });

      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      // Convert month counts to an array for react-vis
      const chartDataPoints = monthNames.map((month) => ({
        x: month,
        y: monthCounts[month] || 0,
      }));

      console.log('Processed data for chart:', chartDataPoints);

      // Update the chart data state
      setChartData(chartDataPoints);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const getUniqueStatusValues = () => {
    // Extract unique status values from your data
    const uniqueStatusValues = [...new Set(data.map((entry) => entry.status))];
    return uniqueStatusValues;
  };

  return (
    <div className="charts-container">
      <h1>Connection Requests Visualization</h1>

      {/* Status filter dropdown */}
      <label className='filter-label'>Status Filter:</label>
      <select value={statusFilter} onChange={handleStatusFilterChange}>
        {['all', ...getUniqueStatusValues()].map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {/* Bar chart with ChartErrorBoundary */}
      <div className="chart-wrapper">
        <ChartErrorBoundary>
          {chartData.length > 0 ? (
            <div>
              <XYPlot xType="ordinal" width={600} height={300}>
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis tickFormat={(v) => v} />
                <YAxis />
                <VerticalBarSeries data={chartData} />
              </XYPlot>
              <DiscreteColorLegend
                orientation="horizontal"
                items={[{ title: 'Number of Requests', color: 'rgba(245, 174, 10, 0.8)' }]}
              />
            </div>
          ) : (
            <p>No data available for chart.</p>
          )}
        </ChartErrorBoundary>
      </div>
    </div>
  );
};

export default ChartsPage;
