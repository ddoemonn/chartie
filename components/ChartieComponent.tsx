'use client';

import { useEffect, useRef } from 'react';
import { Chartie } from 'chartie';
import type { ChartConfig } from 'chartie';

interface ChartieComponentProps {
  config: ChartConfig;
  width?: number;
  height?: number;
  className?: string;
}

export default function ChartieComponent({ 
  config, 
  width = 400, 
  height = 300, 
  className = "" 
}: ChartieComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chartie | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy previous chart instance
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create new chart instance
    chartRef.current = new Chartie(canvasRef.current, config);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [config]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{ 
        width: `${width}px`, 
        height: `${height}px`
      }}
    />
  );
} 