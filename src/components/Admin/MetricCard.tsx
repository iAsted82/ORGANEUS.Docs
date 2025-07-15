import React from 'react';
import { DivideIcon as LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  color: string;
  subtitle?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  trend = 'neutral',
  icon: Icon,
  color,
  subtitle,
  onClick
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Minus;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const TrendIcon = getTrendIcon();

  return (
    <div 
      className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className={`p-2 rounded-lg ${color}`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
          </div>
          
          <div className="mb-2">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && (
              <p className="text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
          
          {change !== undefined && (
            <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
              <TrendIcon className="h-4 w-4" />
              <span className="text-sm font-medium">
                {change > 0 ? '+' : ''}{change}%
              </span>
              <span className="text-xs text-gray-500">vs précédent</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};