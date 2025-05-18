import React from 'react';
import { useWeight } from '../../context/WeightContext';
import { format, subDays, parseISO, differenceInDays } from 'date-fns';
import { TrendingUp, TrendingDown, Activity, Award, Calendar } from 'lucide-react';

const WeightStats: React.FC = () => {
  const { entries } = useWeight();

  const sortedEntries = [...entries].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Calculate statistics
  const calculateStats = () => {
    if (entries.length === 0) {
      return {
        current: 0,
        start: 0,
        change: 0,
        changePercent: 0,
        streak: 0,
        avgWeeklyChange: 0,
        minWeight: 0,
        maxWeight: 0,
        totalDays: 0
      };
    }

    const now = new Date();
    const oneWeekAgo = subDays(now, 7);
    const fourWeeksAgo = subDays(now, 28);
    
    // Current and first weight
    const latest = sortedEntries[sortedEntries.length - 1];
    const first = sortedEntries[0];
    const current = latest.weight;
    const start = first.weight;
    
    // Get entry from a week ago, or the closest one
    const weekAgoEntry = [...sortedEntries]
      .reverse()
      .find(entry => parseISO(entry.date) <= oneWeekAgo);
    
    // Get entry from 4 weeks ago, or the closest one
    const fourWeeksAgoEntry = [...sortedEntries]
      .reverse()
      .find(entry => parseISO(entry.date) <= fourWeeksAgo);
    
    // Calculate changes
    const change = current - start;
    const changePercent = (change / start) * 100;
    
    const weekChange = weekAgoEntry 
      ? current - weekAgoEntry.weight 
      : 0;
    
    const fourWeekChange = fourWeeksAgoEntry 
      ? current - fourWeeksAgoEntry.weight 
      : 0;
    
    // Calculate average weekly change
    const totalDays = differenceInDays(
      parseISO(latest.date),
      parseISO(first.date)
    );
    
    const avgWeeklyChange = totalDays > 0 
      ? (change / totalDays) * 7 
      : 0;
    
    // Find min and max weights
    const weights = entries.map(e => e.weight);
    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);
    
    // Calculate current streak (consecutive days with entries)
    let streak = 0;
    const uniqueDates = new Set(entries.map(e => e.date));
    
    // Find the most recent date with an entry
    const latestDate = parseISO(latest.date);
    let currentDate = latestDate;
    
    while (uniqueDates.has(format(currentDate, 'yyyy-MM-dd'))) {
      streak++;
      currentDate = subDays(currentDate, 1);
    }
    
    return {
      current,
      start,
      change,
      changePercent,
      weekChange,
      fourWeekChange,
      streak,
      avgWeeklyChange,
      minWeight,
      maxWeight,
      totalDays
    };
  };

  const stats = calculateStats();

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend = null,
    iconColor = 'text-cyan-500' 
  }: { 
    title: string; 
    value: string; 
    icon: React.FC<{ size: number; className: string }>;
    trend?: 'up' | 'down' | null;
    iconColor?: string;
  }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center mb-1">
        <Icon size={18} className={iconColor} />
        <h3 className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xl font-semibold">{value}</p>
        {trend && (
          <span 
            className={`flex items-center text-sm font-medium ${
              trend === 'down' ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {trend === 'down' ? (
              <TrendingDown size={16} className="mr-1" />
            ) : (
              <TrendingUp size={16} className="mr-1" />
            )}
          </span>
        )}
      </div>
    </div>
  );

  if (entries.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500 dark:text-gray-400">
          Add weight entries to see statistics
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 transition-all">
      <StatCard
        title="Current Weight"
        value={`${stats.current.toFixed(1)} kg`}
        icon={Activity}
        iconColor="text-cyan-500 dark:text-cyan-400"
      />
      
      <StatCard
        title="Total Change"
        value={`${stats.change.toFixed(1)} kg (${stats.changePercent.toFixed(1)}%)`}
        icon={stats.change < 0 ? TrendingDown : TrendingUp}
        trend={stats.change < 0 ? 'down' : 'up'}
        iconColor={stats.change < 0 ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"}
      />
      
      <StatCard
        title="Weekly Average"
        value={`${Math.abs(stats.avgWeeklyChange).toFixed(2)} kg/week`}
        icon={stats.avgWeeklyChange < 0 ? TrendingDown : TrendingUp}
        trend={stats.avgWeeklyChange < 0 ? 'down' : 'up'}
        iconColor={stats.avgWeeklyChange < 0 ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"}
      />
      
      <StatCard
        title="Tracking Streak"
        value={`${stats.streak} day${stats.streak !== 1 ? 's' : ''}`}
        icon={Calendar}
        iconColor="text-yellow-500 dark:text-yellow-400"
      />
      
      <StatCard
        title="Weight Range"
        value={`${stats.minWeight.toFixed(1)} - ${stats.maxWeight.toFixed(1)} kg`}
        icon={Award}
        iconColor="text-purple-500 dark:text-purple-400"
      />
    </div>
  );
};

export default WeightStats;