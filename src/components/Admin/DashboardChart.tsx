import React, { useEffect, useRef } from 'react';
import { ChartData } from '../../services/dashboardService';

interface DashboardChartProps {
  data: ChartData;
  height?: number;
  type?: 'line' | 'bar';
}

export const DashboardChart: React.FC<DashboardChartProps> = ({ 
  data, 
  height = 300, 
  type = 'line' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !data.datasets.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;

    // Get data
    const dataset = data.datasets[0];
    const maxValue = Math.max(...dataset.data);
    const minValue = Math.min(...dataset.data);
    const range = maxValue - minValue || 1;

    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Horizontal lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + chartWidth, y);
      ctx.stroke();
    }

    // Vertical lines
    const stepX = chartWidth / (data.labels.length - 1);
    for (let i = 0; i < data.labels.length; i++) {
      const x = padding + stepX * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, padding + chartHeight);
      ctx.stroke();
    }

    // Draw data
    if (type === 'line') {
      // Draw area fill
      if (dataset.fill) {
        ctx.fillStyle = dataset.backgroundColor;
        ctx.beginPath();
        ctx.moveTo(padding, padding + chartHeight);
        
        dataset.data.forEach((value, index) => {
          const x = padding + stepX * index;
          const y = padding + chartHeight - ((value - minValue) / range) * chartHeight;
          ctx.lineTo(x, y);
        });
        
        ctx.lineTo(padding + chartWidth, padding + chartHeight);
        ctx.closePath();
        ctx.fill();
      }

      // Draw line
      ctx.strokeStyle = dataset.borderColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      dataset.data.forEach((value, index) => {
        const x = padding + stepX * index;
        const y = padding + chartHeight - ((value - minValue) / range) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();

      // Draw points
      ctx.fillStyle = dataset.borderColor;
      dataset.data.forEach((value, index) => {
        const x = padding + stepX * index;
        const y = padding + chartHeight - ((value - minValue) / range) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
      });
    }

    // Draw labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    
    data.labels.forEach((label, index) => {
      const x = padding + stepX * index;
      ctx.fillText(label, x, canvas.height - 10);
    });

    // Draw Y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = minValue + (range / 5) * (5 - i);
      const y = padding + (chartHeight / 5) * i;
      ctx.fillText(Math.round(value).toString(), padding - 10, y + 4);
    }

  }, [data, type, height]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={height}
      className="w-full h-full"
    />
  );
};