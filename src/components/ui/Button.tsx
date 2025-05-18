import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  size = 'md',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  const defaultClasses = 'bg-cyan-600 text-white hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-600';
  const disabledClasses = 'opacity-60 cursor-not-allowed';
  
  return (
    <button 
      className={`
        ${baseClasses} 
        ${sizeClasses[size]} 
        ${props.disabled ? disabledClasses : ''} 
        ${className || defaultClasses}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;