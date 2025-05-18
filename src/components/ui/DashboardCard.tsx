import React, { ReactNode } from 'react';

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
};

export default DashboardCard;