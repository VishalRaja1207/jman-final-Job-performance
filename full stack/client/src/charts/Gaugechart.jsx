import React from 'react';
import Chart from 'react-apexcharts';

const Gaugechart = ({ data }) => {
  // Log the incoming data for debugging
  console.log(data);

  // Check if data is valid; default to 0 if it's undefined
  const validData = data !== undefined ? data : 0;

  // Chart options
  const options = {
    chart: {
      type: 'radialBar', // Set chart type to radialBar for gauge
      height: 350,
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
        hollow: {
          margin: 15,
          size: '70%', // Controls the hollow size
        },
        dataLabels: {
          name: {
            offsetY: -10,
            color: '#888',
            fontSize: '17px',
          },
          value: {
            color: '#111',
            fontSize: '22px',
            show: true,
            formatter: function (val) {
              return `${val}%`; // Append percentage to the value
            },
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        gradientToColors: ['#71EAE1'], // End color of gradient
        stops: [0, 100],
      },
    },
    colors: ['#FF6196'], // Base color for the gauge
    labels: ["Success Rate"], // Label for the gauge
    title: {
      text: "Success Rate", // Chart title
      align: 'center',
    },
  };

  // Data for the chart (series must be an array with one value)
  const series = [validData]; // Pass percentage value (0-100)

  return (
    <div className="chart-container">
      <Chart options={options} series={series} type="radialBar" height={350} />
    </div>
  );
};

export default Gaugechart;
