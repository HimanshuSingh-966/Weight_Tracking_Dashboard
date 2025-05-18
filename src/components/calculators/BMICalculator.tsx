import React, { useState, useEffect } from 'react';
import { useWeight } from '../../context/WeightContext';
import Button from '../ui/Button';

interface BMIRange {
  category: string;
  range: string;
  color: string;
  description: string;
}

const bmiRanges: BMIRange[] = [
  {
    category: 'Underweight',
    range: '< 18.5',
    color: 'bg-blue-500',
    description: 'May indicate nutritional deficiency or other health issues'
  },
  {
    category: 'Normal',
    range: '18.5 - 24.9',
    color: 'bg-green-500',
    description: 'Generally associated with good health outcomes'
  },
  {
    category: 'Overweight',
    range: '25 - 29.9',
    color: 'bg-yellow-500',
    description: 'May increase risk for certain health conditions'
  },
  {
    category: 'Obese',
    range: '≥ 30',
    color: 'bg-red-500',
    description: 'Associated with increased risk for many health conditions'
  }
];

const BMICalculator: React.FC = () => {
  const { entries } = useWeight();
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBMI] = useState<number | null>(null);
  const [bmiCategory, setBMICategory] = useState<string>('');
  
  // Pre-fill weight from latest entry if available
  useEffect(() => {
    if (entries.length > 0) {
      const latestEntry = [...entries].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];
      
      setWeight(latestEntry.weight.toString());
    }
  }, [entries]);
  
  const calculateBMI = () => {
    const weightValue = parseFloat(weight);
    const heightValue = parseFloat(height) / 100; // Convert cm to m
    
    if (isNaN(weightValue) || isNaN(heightValue) || heightValue === 0) {
      setBMI(null);
      setBMICategory('');
      return;
    }
    
    const bmiValue = weightValue / (heightValue * heightValue);
    setBMI(bmiValue);
    
    // Determine BMI category
    if (bmiValue < 18.5) {
      setBMICategory('Underweight');
    } else if (bmiValue < 25) {
      setBMICategory('Normal');
    } else if (bmiValue < 30) {
      setBMICategory('Overweight');
    } else {
      setBMICategory('Obese');
    }
  };
  
  useEffect(() => {
    calculateBMI();
  }, [weight, height]);

  const getBMIColor = () => {
    if (!bmi) return 'bg-gray-400';
    if (bmi < 18.5) return 'bg-blue-500';
    if (bmi < 25) return 'bg-green-500';
    if (bmi < 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="height" className="block text-sm font-medium mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              id="height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Enter your height in cm"
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
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter your weight in kg"
              className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          
          <Button
            onClick={calculateBMI}
            className="bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-600 w-full"
            disabled={!height || !weight}
          >
            Calculate BMI
          </Button>
          
          {bmi !== null && (
            <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-2">Your BMI Result</h3>
              <div className="flex items-center mb-2">
                <div className={`h-4 w-4 rounded-full ${getBMIColor()} mr-2`}></div>
                <p className="text-2xl font-bold">{bmi.toFixed(1)}</p>
              </div>
              <p className="text-lg">{bmiCategory}</p>
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">BMI Categories</h3>
          <div className="space-y-3">
            {bmiRanges.map((range) => (
              <div 
                key={range.category}
                className={`p-3 rounded-lg border ${
                  bmiCategory === range.category 
                    ? 'border-cyan-500 dark:border-cyan-400 shadow-md animate-pulse' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <div className={`h-3 w-3 rounded-full ${range.color} mr-2`}></div>
                    <span className="font-medium">{range.category}</span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{range.range}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{range.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <p className="mb-2">
              <strong>Note:</strong> BMI is a simple calculation using height and weight. It doesn't 
              measure body fat directly or account for muscle mass, bone density, or overall body composition.
            </p>
            <p>
              Always consult with healthcare professionals for a more comprehensive health assessment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;