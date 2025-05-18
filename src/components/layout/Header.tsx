import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ActivitySquare } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <ActivitySquare className="h-8 w-8 text-cyan-600 dark:text-cyan-400 mr-2" />
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">WeightTrack</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Smart Weight Tracking Dashboard</p>
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors duration-200 ${
              isActive('/') 
                ? 'text-cyan-600 dark:text-cyan-400' 
                : 'text-gray-700 dark:text-gray-200 hover:text-cyan-600 dark:hover:text-cyan-400'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/reports"
            className={`text-sm font-medium transition-colors duration-200 ${
              isActive('/reports') 
                ? 'text-cyan-600 dark:text-cyan-400' 
                : 'text-gray-700 dark:text-gray-200 hover:text-cyan-600 dark:hover:text-cyan-400'
            }`}
          >
            Reports
          </Link>
          <Link
            to="/settings"
            className={`text-sm font-medium transition-colors duration-200 ${
              isActive('/settings') 
                ? 'text-cyan-600 dark:text-cyan-400' 
                : 'text-gray-700 dark:text-gray-200 hover:text-cyan-600 dark:hover:text-cyan-400'
            }`}
          >
            Settings
          </Link>
        </nav>
        
        <div className="flex items-center">
          <Link
            to="/share"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              isActive('/share')
                ? 'bg-cyan-700 text-white'
                : 'bg-cyan-600 text-white hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-600'
            }`}
          >
            Share Progress
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;