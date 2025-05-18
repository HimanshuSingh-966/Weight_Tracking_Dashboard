import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { subDays, format } from 'date-fns';

export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  note?: string;
}

interface WeightGoal {
  target: number;
  deadline?: string;
}

interface WeightContextType {
  entries: WeightEntry[];
  addEntry: (entry: Omit<WeightEntry, 'id'>) => void;
  removeEntry: (id: string) => void;
  updateEntry: (id: string, entry: Partial<WeightEntry>) => void;
  goal: WeightGoal | null;
  setGoal: (goal: WeightGoal | null) => void;
  loading: boolean;
}

const WeightContext = createContext<WeightContextType | undefined>(undefined);

// Generate some realistic sample data for the initial state
const generateSampleData = (): WeightEntry[] => {
  const today = new Date();
  const result: WeightEntry[] = [];
  
  let baseWeight = 75 + Math.random() * 5; // Starting weight around 75-80kg
  
  // Generate entries for the last 30 days with realistic fluctuations
  for (let i = 30; i >= 0; i--) {
    const date = subDays(today, i);
    
    // Add some realistic day-to-day fluctuation (±0.3kg)
    const dailyFluctuation = (Math.random() - 0.5) * 0.6;
    
    // Add a slight downward trend (average -0.05kg per day)
    const trendChange = -0.05;
    
    baseWeight += dailyFluctuation + trendChange;
    
    // Skip some days randomly to make the data more realistic
    if (Math.random() > 0.7 && i !== 0) continue;
    
    result.push({
      id: date.toISOString(),
      date: format(date, 'yyyy-MM-dd'),
      weight: parseFloat(baseWeight.toFixed(1)),
      note: i % 10 === 0 ? "Regular check-in" : undefined
    });
  }
  
  return result;
};

export const WeightProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<WeightEntry[]>(() => {
    const saved = localStorage.getItem('weightEntries');
    return saved ? JSON.parse(saved) : generateSampleData();
  });
  
  const [goal, setGoal] = useState<WeightGoal | null>(() => {
    const saved = localStorage.getItem('weightGoal');
    return saved ? JSON.parse(saved) : { target: 70 };
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading from an API
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('weightEntries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('weightGoal', JSON.stringify(goal));
  }, [goal]);

  const addEntry = (entry: Omit<WeightEntry, 'id'>) => {
    const newEntry = {
      ...entry,
      id: new Date().toISOString(),
    };
    setEntries(prev => [...prev, newEntry].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  };

  const removeEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const updateEntry = (id: string, updatedEntry: Partial<WeightEntry>) => {
    setEntries(prev => 
      prev.map(entry => 
        entry.id === id ? { ...entry, ...updatedEntry } : entry
      )
    );
  };

  return (
    <WeightContext.Provider value={{ 
      entries, 
      addEntry, 
      removeEntry, 
      updateEntry, 
      goal, 
      setGoal, 
      loading 
    }}>
      {children}
    </WeightContext.Provider>
  );
};

export const useWeight = () => {
  const context = useContext(WeightContext);
  if (context === undefined) {
    throw new Error('useWeight must be used within a WeightProvider');
  }
  return context;
};