import React, { useState } from 'react';
import { useWeight } from '../context/WeightContext';
import WeightStats from './stats/WeightStats';
import WeightForm from './forms/WeightForm';
import WeightHistory from './weight/WeightHistory';
import WeightChart from './charts/WeightChart';
import GoalProgress from './goals/GoalProgress';
import BMICalculator from './calculators/BMICalculator';
import LoadingState from './ui/LoadingState';
import { CalendarDays, TrendingDown, Ruler } from 'lucide-react';
import DashboardCard from './ui/DashboardCard';

const Dashboard: React.FC = () => {
  const { entries, loading } = useWeight();
  const [activeTab, setActiveTab] = useState<'chart' | 'history' | 'bmi'>('chart');

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Ruler className="mr-2 text-cyan-600 dark:text-cyan-400" size={20} />
            Add Today's Weight
          </h2>
          <WeightForm />
        </DashboardCard>
        
        <DashboardCard>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <TrendingDown className="mr-2 text-cyan-600 dark:text-cyan-400" size={20} />
            Weight Goal Progress
          </h2>
          <GoalProgress />
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardCard className="h-full">
            <div className="flex flex-wrap gap-2 mb-4 border-b dark:border-gray-700 pb-2">
              <button
                onClick={() => setActiveTab('chart')}
                className={`px-4 py-2 rounded-t-lg transition-colors ${
                  activeTab === 'chart' 
                    ? 'bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 font-medium' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Trend Chart
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-t-lg transition-colors ${
                  activeTab === 'history' 
                    ? 'bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 font-medium' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span className="flex items-center">
                  <CalendarDays size={16} className="mr-1" />
                  History
                </span>
              </button>
              <button
                onClick={() => setActiveTab('bmi')}
                className={`px-4 py-2 rounded-t-lg transition-colors ${
                  activeTab === 'bmi' 
                    ? 'bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 font-medium' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                BMI Calculator
              </button>
            </div>
            
            <div className="min-h-[400px]">
              {activeTab === 'chart' && <WeightChart />}
              {activeTab === 'history' && <WeightHistory />}
              {activeTab === 'bmi' && <BMICalculator />}
            </div>
          </DashboardCard>
        </div>

        <div>
          <DashboardCard className="h-full">
            <h2 className="text-xl font-semibold mb-4">Stats & Insights</h2>
            <WeightStats />
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;