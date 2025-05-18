import React, { useState } from 'react';
import { useWeight } from '../context/WeightContext';
import DashboardCard from '../components/ui/DashboardCard';
import Button from '../components/ui/Button';
import { Save, Trash2, Bell, Scale, Calendar } from 'lucide-react';

const Settings: React.FC = () => {
  const { entries, goal, setGoal } = useWeight();
  const [notifications, setNotifications] = useState(true);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [reminderTime, setReminderTime] = useState('08:00');
  const [showConfirm, setShowConfirm] = useState(false);
  
  const handleSaveSettings = () => {
    // In a real app, this would save to backend
    alert('Settings saved successfully!');
  };

  const handleClearData = () => {
    if (showConfirm) {
      // In a real app, this would clear data from backend
      setShowConfirm(false);
      alert('All data has been cleared');
    } else {
      setShowConfirm(true);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard>
          <div className="flex items-center mb-4">
            <Scale className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mr-2" />
            <h2 className="text-lg font-semibold">Weight Tracking</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Weight Unit
              </label>
              <select
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value as 'kg' | 'lbs')}
                className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 focus:ring-cyan-500 focus:border-cyan-500"
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="lbs">Pounds (lbs)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Target Weight ({weightUnit})
              </label>
              <input
                type="number"
                value={goal?.target || ''}
                onChange={(e) => setGoal({ target: parseFloat(e.target.value) })}
                className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 focus:ring-cyan-500 focus:border-cyan-500"
                step="0.1"
              />
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard>
          <div className="flex items-center mb-4">
            <Bell className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mr-2" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Daily Reminders</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600"></div>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Reminder Time
              </label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>
          </div>
        </DashboardCard>
      </div>
      
      <DashboardCard>
        <div className="flex items-center mb-4">
          <Calendar className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mr-2" />
          <h2 className="text-lg font-semibold">Data Management</h2>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            You have {entries.length} weight entries stored.
          </p>
          
          <div className="flex space-x-4">
            <Button
              onClick={handleSaveSettings}
              className="bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-600"
            >
              <Save size={16} className="mr-2" />
              Save Settings
            </Button>
            
            <Button
              onClick={handleClearData}
              className={`${
                showConfirm
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              <Trash2 size={16} className="mr-2" />
              {showConfirm ? 'Confirm Clear' : 'Clear All Data'}
            </Button>
          </div>
          
          {showConfirm && (
            <p className="text-sm text-red-600 dark:text-red-400 animate-pulse">
              ⚠️ This action cannot be undone. Click again to confirm.
            </p>
          )}
        </div>
      </DashboardCard>
    </div>
  );
};

export default Settings;