import React, { useState } from 'react';
import { useWeight } from '../../context/WeightContext';
import { format } from 'date-fns';
import Button from '../ui/Button';

const WeightForm: React.FC = () => {
  const { addEntry, entries } = useWeight();
  
  const today = format(new Date(), 'yyyy-MM-dd');
  const alreadyEnteredToday = entries.some(entry => entry.date === today);
  
  const [formData, setFormData] = useState({
    date: today,
    weight: '',
    note: '',
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.weight) {
      setError('Please enter your weight');
      return;
    }
    
    const weight = parseFloat(formData.weight);
    
    if (isNaN(weight) || weight <= 0 || weight > 500) {
      setError('Please enter a valid weight (0-500)');
      return;
    }
    
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      addEntry({
        date: formData.date,
        weight,
        note: formData.note || undefined,
      });
      
      setIsSaving(false);
      setSuccess('Weight entry saved successfully!');
      
      // Reset form except date
      setFormData({
        date: formData.date,
        weight: '',
        note: '',
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="date" className="block text-sm font-medium mb-1">
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          max={today}
          className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 focus:ring-cyan-500 focus:border-cyan-500"
        />
      </div>
      
      <div>
        <label htmlFor="weight" className="block text-sm font-medium mb-1">
          Weight (kg)
        </label>
        <input
          type="number"
          id="weight"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          step="0.1"
          min="0"
          placeholder="Enter weight in kg"
          className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 focus:ring-cyan-500 focus:border-cyan-500"
        />
      </div>
      
      <div>
        <label htmlFor="note" className="block text-sm font-medium mb-1">
          Note (optional)
        </label>
        <input
          type="text"
          id="note"
          name="note"
          value={formData.note}
          onChange={handleChange}
          placeholder="Add a note about today's weight"
          className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 focus:ring-cyan-500 focus:border-cyan-500"
        />
      </div>
      
      {error && (
        <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-sm animate-pulse">
          {success}
        </div>
      )}
      
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSaving}
          className="bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-600"
        >
          {isSaving ? 'Saving...' : alreadyEnteredToday ? 'Add Another Entry' : 'Save Weight'}
        </Button>
      </div>
    </form>
  );
};

export default WeightForm;