import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { WeightProvider } from './context/WeightContext';
import Header from './components/layout/Header';
import Dashboard from './components/Dashboard';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import ShareProgress from './pages/ShareProgress';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <Router>
      <WeightProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
          <Header />
          <div className="fixed top-4 right-4 z-50">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="text-yellow-400" size={20} /> : <Moon className="text-blue-700" size={20} />}
            </button>
          </div>
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/share" element={<ShareProgress />} />
            </Routes>
          </main>
        </div>
      </WeightProvider>
    </Router>
  );
}

export default App;