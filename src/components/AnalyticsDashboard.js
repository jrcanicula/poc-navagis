import React from 'react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLegend, VictoryLabel } from 'victory';

const AnalyticsDashboard = ({ visitsByRestaurant, revenueByRestaurant, restaurantNames, showDashboard }) => {

  const visitsData = Object.keys(visitsByRestaurant).map((id) => ({
    restaurant: restaurantNames[id],
    visits: visitsByRestaurant[id],
  }));

  const revenueData = Object.keys(revenueByRestaurant).map((id) => ({
    restaurant: restaurantNames[id],
    revenue: revenueByRestaurant[id],
  }));


  if (!showDashboard)
    return <> </>

  return (
    <div className="analytics-dashboard" style={{ marginTop: '400px' }}>
      <h2 className="dashboard-title">Analytics Dashboard</h2>

      <div className="analytics-section">
        <h3 className="section-title">Visits by Restaurant</h3>
        <VictoryChart domainPadding={20} height={1200}>
          <VictoryLegend x={50} y={10}
            orientation="horizontal"
            gutter={20}
            data={[{ name: 'Visits', symbol: { fill: '#007BFF' } }]}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(x) => `${x}`}
            style={{
              axis: { stroke: "transparent" },
              tickLabels: { fontSize: 5, padding: 5 }
            }}
          />
          <VictoryAxis
            tickFormat={(x) => `${x}`}
            style={{
              tickLabels: { fontSize: 5, padding: 10 }
            }}
          />
          <VictoryBar horizontal
            data={visitsData}
            x="restaurant"
            y="visits"
            style={{
              data: { fill: '#007BFF' },
            }}
            labelComponent={<VictoryLabel dy={30} />}
          />
        </VictoryChart>
      </div>

      <div className="analytics-section">
        <h3 className="section-title">Revenue by Restaurant</h3>
        <VictoryChart domainPadding={20} height={1200}>
          <VictoryLegend x={50} y={10}
            orientation="horizontal"
            gutter={20}
            data={[{ name: 'Revenue', symbol: { fill: 'red' } }]}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(x) => `$${x}`}
            style={{
              axis: { stroke: "transparent" },
              tickLabels: { fontSize: 5, padding: 5 }
            }}
          />
          <VictoryAxis
            tickFormat={(x) => `${x}`}
            style={{
              tickLabels: { fontSize: 5, padding: 5 }
            }}
          />
          <VictoryBar horizontal
            data={revenueData}
            x="restaurant"
            y="revenue"
            style={{
              data: { fill: 'red' },
            }}
          />
        </VictoryChart>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;