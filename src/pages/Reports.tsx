import React from 'react';
import { useWeight } from '../context/WeightContext';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, parseISO } from 'date-fns';
import DashboardCard from '../components/ui/DashboardCard';
import { LineChart, TrendingDown, Calendar, Activity } from 'lucide-react';

const Reports: React.FC = () => {
  const { entries } = useWeight();

  // Calculate weekly averages
  const getWeeklyAverages = () => {
    const weeklyData: { [key: string]: number[] } = {};
    
    entries.forEach(entry => {
      const date = parseISO(entry.date);
      const weekStart = format(startOfWeek(date), 'yyyy-MM-dd');
      
      if (!weeklyData[weekStart]) {
        weeklyData[weekStart] = [];
      }
      
      weeklyData[weekStart].push(entry.weight);
    });
    
    return Object.entries(weeklyData).map(([week, weights]) => ({
      week,
      average: weights.reduce((sum, weight) => sum + weight, 0) / weights.length
    }));
  };

  // Calculate completion rate
  const calculateCompletionRate = () => {
    if (entries.length === 0) return 0;
    
    const firstEntry = parseISO(entries[0].date);
    const lastEntry = parseISO(entries[entries.length - 1].date);
    
    const allDays = eachDayOfInterval({ start: firstEntry, end: lastEntry });
    const uniqueDates = new Set(entries.map(e => e.date));
    
    return (uniqueDates.size / allDays.length) * 100;
  };

  const weeklyAverages = getWeeklyAverages();
  const completionRate = calculateCompletionRate();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Weight Tracking Reports</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-cyan-100 dark:bg-cyan-900 rounded-lg">
              <Activity className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Entries</p>
              <p className="text-xl font-bold">{entries.length}</p>
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completion Rate</p>
              <p className="text-xl font-bold">{completionRate.toFixed(1)}%</p>
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <LineChart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Weekly Averages</p>
              <p className="text-xl font-bold">{weeklyAverages.length}</p>
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <TrendingDown className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Change</p>
              <p className="text-xl font-bold">
                {entries.length > 1
                  ? (entries[entries.length - 1].weight - entries[0].weight).toFixed(1)
                  : '0'} kg
              </p>
            </div>
          </div>
        </DashboardCard>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard>
          <h2 className="text-lg font-semibold mb-4">Weekly Averages</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Week Starting
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Average Weight
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {weeklyAverages.map(({ week, average }) => (
                  <tr key={week}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {format(parseISO(week), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap font-medium">
                      {average.toFixed(1)} kg
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>
        
        <DashboardCard>
          <h2 className="text-lg font-semibold mb-4">Tracking Consistency</h2>
          <div className="space-y-4">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-4">
              <div
                className="bg-cyan-600 dark:bg-cyan-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p>You've tracked your weight on {completionRate.toFixed(1)}% of days since you started.</p>
              <p className="mt-2">
                {completionRate >= 80
                  ? "Excellent tracking consistency! Keep up the great work!"
                  : completionRate >= 60
                  ? "Good tracking habits. Try to log your weight more regularly for better insights."
                  : "Consider tracking your weight more frequently for better progress monitoring."}
              </p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default Reports;