import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';

const Analytics = () => {
  const [visitData, setVisitData] = useState([]);
  const [revenueData, setRevenueData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const visits = JSON.parse(localStorage.getItem('visits')) || [];
    setVisitData(visits);

    // Generate some mock revenue data based on visits
    const restaurantRevenue = visits.reduce((acc, visit) => {
      const { restaurantId } = visit;
      if (!acc[restaurantId]) {
        acc[restaurantId] = { count: 0, revenue: 0 };
      }
      acc[restaurantId].count += 1;
      acc[restaurantId].revenue += Math.floor(Math.random() * 100) + 20; // Mock revenue value
      return acc;
    }, {});

    const labels = Object.keys(restaurantRevenue);
    const data = labels.map((key) => restaurantRevenue[key].revenue);
    const backgroundColor = labels.map(
      () => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`
    );

    setRevenueData({
      labels,
      datasets: [
        {
          label: 'Revenue',
          data,
          backgroundColor,
        },
      ],
    });
  }, []);

  return (
    <div>
      <h2>Analytics</h2>
      <div className="charts">
        <div className="chart">
          <h3>Visitor Analytics</h3>
          <Pie data={{
            labels: visitData.map(visit => visit.restaurantId),
            datasets: [{
              data: visitData.map(visit => visit.visitedAt),
              backgroundColor: ['red', 'blue', 'green'],
            }]
          }} />
        </div>
        <div className="chart">
          <h3>Revenue Analytics</h3>
          <Bar data={revenueData} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;