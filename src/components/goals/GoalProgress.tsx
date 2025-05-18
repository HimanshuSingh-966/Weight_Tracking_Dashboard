import React, { useState } from 'react';
import { useWeight } from '../../context/WeightContext';
import { format } from 'date-fns';
import { Target, Pencil } from 'lucide-react';
import Button from '../ui/Button';

const GoalProgress: React.FC = () => {
  const { entries, goal, setGoal } = useWeight();
  const [isEditing, setIsEditing] = useState(false);
  const [goalWeight, setGoalWeight] = useState(goal?.target?.toString() || '');
  const [goalDate, setGoalDate] = useState(goal?.deadline || '');

  // Get current weight from the latest entry
  const currentWeight = entries.length > 0
    ? [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].weight
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(goalWeight);
    
    if (!isNaN(target) && target > 0) {
      setGoal({
        target,
        deadline: goalDate || undefined
      });
      setIsEditing(false);
    }
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!goal || entries.length === 0) return 0;
    
    // Find starting weight (earliest entry)
    const startWeight = [...entries].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )[0].weight;
    
    // Calculate total needed change
    const totalChange = startWeight - goal.target;
    
    // Calculate current change
    const currentChange = startWeight - currentWeight;
    
    // Calculate progress percentage
    const progress = (currentChange / totalChange) * 100;
    
    // Limit to 0-100%
    return Math.min(100, Math.max(0, progress));
  };

  const progress = calculateProgress();
  
  // Calculate weight left to lose
  const weightLeft = goal && currentWeight > goal.target
    ? currentWeight - goal.target
    : 0;
  
  // Determine color based on progress
  const getProgressColor = () => {
    if (progress < 25) return 'bg-red-500';
    if (progress < 50) return 'bg-orange-500';
    if (progress < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="goalWeight" className="block text-sm font-medium mb-1">
              Target Weight (kg)
            </label>
            <input
              type="number"
              id="goalWeight"
              value={goalWeight}
              onChange={(e) => setGoalWeight(e.target.value)}
              step="0.1"
              min="0"
              className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 focus:ring-cyan-500 focus:border-cyan-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="goalDate" className="block text-sm font-medium mb-1">
              Target Date (optional)
            </label>
            <input
              type="date"
              id="goalDate"
              value={goalDate}
              onChange={(e) => setGoalDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
              className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-600"
            >
              Save Goal
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Target className="text-cyan-600 dark:text-cyan-400 mr-2" size={20} />
              <h3 className="text-lg font-medium">
                {goal ? `Goal: ${goal.target} kg` : 'No goal set'}
              </h3>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Pencil size={16} />
            </button>
          </div>
          
          {goal && entries.length > 0 && (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current: {currentWeight.toFixed(1)} kg</span>
                  <span>Goal: {goal.target.toFixed(1)} kg</span>
                </div>
                
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div 
                    className={`h-full ${getProgressColor()} transition-all duration-1000 ease-out`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{progress.toFixed(0)}% complete</span>
                  {weightLeft > 0 && (
                    <span className="text-sm">
                      {weightLeft.toFixed(1)} kg to go
                    </span>
                  )}
                </div>
              </div>
              
              {goal.deadline && (
                <div className="bg-cyan-50 dark:bg-cyan-900/30 p-3 rounded text-sm">
                  <p className="text-cyan-800 dark:text-cyan-300">
                    Target date: {format(new Date(goal.deadline), 'MMMM d, yyyy')}
                  </p>
                </div>
              )}
            </>
          )}
          
          {(!goal || entries.length === 0) && (
            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded">
              <p className="text-yellow-800 dark:text-yellow-300 text-sm">
                {entries.length === 0 
                  ? 'Add weight entries to track progress towards your goal'
                  : 'Set a weight goal to track your progress'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GoalProgress;