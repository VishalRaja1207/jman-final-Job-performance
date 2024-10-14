import React from 'react';
import Chart from 'react-apexcharts';

const Donutchart = ({ header, data }) => {
  // Chart data
  const categories = data.map(item => item.categories);
  const percentage = data.map(item => Number(item.series));
  
  const options = {
    chart: {
      type: 'donut',
      height: 350,
    },
    labels: categories, // Labels for the donut slices
    title: {
    //   text: header, // Chart title
      align: 'center',
      style: {
        fontSize: '20px',
        color: '#333',
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%', // Inner radius for the donut hole
        },
      },
    },
    legend: {
      show: true,
      position: 'bottom',
      fontSize: '14px',
      labels: {
        colors: ['#19105B'],
      },
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      y: {
        formatter: function (val) {
          return val + '%';
        },
      },
    },
    colors: ['#19105B', '#FF6196', '#71EAE1', '#3411A3', '#A16BDB', '#A6265E', '#16978E'], // Custom slice colors
    responsive: [
      {
        breakpoint: 480, // For smaller screens
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  // Data for the chart
  const series = percentage; // Values for each category

  return (
    <div className="chart-container">
      <Chart options={options} series={series} type="donut" height={350} />
    </div>
  );
};

export default Donutchart;
