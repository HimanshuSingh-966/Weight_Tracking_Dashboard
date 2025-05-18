import React, { useState, useEffect } from 'react';
import { useWeight } from '../../context/WeightContext';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format, subDays, parseISO, isWithinInterval } from 'date-fns';
import Button from '../ui/Button';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type TimeRange = '1w' | '1m' | '3m' | 'all';

const WeightChart: React.FC = () => {
  const { entries, goal } = useWeight();
  const [timeRange, setTimeRange] = useState<TimeRange>('1m');
  const [showGoal, setShowGoal] = useState(true);

  // Sort entries by date
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Filter entries based on selected time range
  const filteredEntries = React.useMemo(() => {
    const now = new Date();
    
    if (timeRange === '1w') {
      const startDate = subDays(now, 7);
      return sortedEntries.filter(entry => 
        isWithinInterval(parseISO(entry.date), { start: startDate, end: now })
      );
    }
    
    if (timeRange === '1m') {
      const startDate = subDays(now, 30);
      return sortedEntries.filter(entry => 
        isWithinInterval(parseISO(entry.date), { start: startDate, end: now })
      );
    }
    
    if (timeRange === '3m') {
      const startDate = subDays(now, 90);
      return sortedEntries.filter(entry => 
        isWithinInterval(parseISO(entry.date), { start: startDate, end: now })
      );
    }
    
    return sortedEntries;
  }, [sortedEntries, timeRange]);

  // Calculate chart bounds to have proper scales
  const chartBounds = React.useMemo(() => {
    if (filteredEntries.length === 0) return { min: 60, max: 90 };
    
    const weights = filteredEntries.map(entry => entry.weight);
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    
    // Add goal weight to the bounds if showing goal
    const allValues = [...weights];
    if (showGoal && goal?.target) {
      allValues.push(goal.target);
    }
    
    const dataMin = Math.min(...allValues);
    const dataMax = Math.max(...allValues);
    
    // Add some padding to the bounds
    const padding = Math.max(5, (dataMax - dataMin) * 0.2);
    
    return {
      min: Math.max(0, Math.floor(dataMin - padding)),
      max: Math.ceil(dataMax + padding)
    };
  }, [filteredEntries, goal, showGoal]);

  const chartData = {
    labels: filteredEntries.map(entry => format(parseISO(entry.date), 'MMM d')),
    datasets: [
      {
        label: 'Weight',
        data: filteredEntries.map(entry => entry.weight),
        borderColor: 'rgb(8, 145, 178)',
        backgroundColor: 'rgba(8, 145, 178, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(8, 145, 178)',
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.3,
        fill: true,
      },
      ...(showGoal && goal ? [{
        label: 'Goal',
        data: Array(filteredEntries.length).fill(goal.target),
        borderColor: 'rgba(34, 197, 94, 0.8)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
      }] : [])
    ]
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 16
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1e293b',
        bodyColor: '#1e293b',
        borderColor: 'rgba(8, 145, 178, 0.2)',
        borderWidth: 1,
        padding: 10,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          title: (tooltipItems) => {
            return `${tooltipItems[0].label}`;
          },
          label: (context) => {
            if (context.dataset.label === 'Goal') {
              return `Goal: ${context.parsed.y} kg`;
            }
            return `Weight: ${context.parsed.y} kg`;
          }
        }
      }
    },
    scales: {
      y: {
        min: chartBounds.min,
        max: chartBounds.max,
        title: {
          display: true,
          text: 'Weight (kg)'
        },
        ticks: {
          stepSize: 5
        },
        grid: {
          drawBorder: false
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    elements: {
      point: {
        hoverBackgroundColor: 'white',
        hoverBorderWidth: 2,
        radius: 4,
        hitRadius: 8
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    }
  };

  // Handle empty state
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-lg font-medium">No data to display</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Add weight entries to see your progress chart
        </p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <div className="flex space-x-2 mb-2 md:mb-0">
          <Button 
            onClick={() => setTimeRange('1w')}
            className={
              timeRange === '1w' 
                ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }
            size="sm"
          >
            1 Week
          </Button>
          <Button 
            onClick={() => setTimeRange('1m')}
            className={
              timeRange === '1m' 
                ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }
            size="sm"
          >
            1 Month
          </Button>
          <Button 
            onClick={() => setTimeRange('3m')}
            className={
              timeRange === '3m' 
                ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }
            size="sm"
          >
            3 Months
          </Button>
          <Button 
            onClick={() => setTimeRange('all')}
            className={
              timeRange === 'all' 
                ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }
            size="sm"
          >
            All
          </Button>
        </div>
        
        <div className="flex items-center">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={showGoal}
              onChange={() => setShowGoal(!showGoal)}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Show Goal
            </span>
          </label>
        </div>
      </div>
      
      <div className="h-[350px]">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default WeightChart;