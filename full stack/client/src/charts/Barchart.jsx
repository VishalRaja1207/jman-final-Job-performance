import React from 'react';
import Chart from 'react-apexcharts';

const Barchart = ({data}) => {
  // Chart options
  const categories = data.map(training => training.Name);
  const pass_percentage = data.map(training => Number(training.Percentage))
  
  const options = {
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: 'rounded',
        
      },
    },
    dataLabels: {
      enabled: true,
    },
    xaxis: {
      title: {
        text: 'Trainings'
      },
      categories: categories, // X-axis categories
    },
    yaxis: {
      title: {
        text: 'Values', // Y-axis title
      },
    },
    colors: ['#19105B']
  };

  // Data for the chart
  const series = [
    {
      name: 'Percentage Passed', // Dataset name
      data: pass_percentage, // Data values
    },
  ];

  return (
    <div className="chart-container">
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default Barchart;
