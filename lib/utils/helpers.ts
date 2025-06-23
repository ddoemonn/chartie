import type { Color } from '../types';

// Color utilities
export const getColorArray = (colors: Color | Color[], length: number): Color[] => {
  if (Array.isArray(colors)) {
    return colors.length >= length 
      ? colors.slice(0, length)
      : [...colors, ...Array(length - colors.length).fill(colors[colors.length - 1] || '#3498db')];
  }
  return Array(length).fill(colors);
};

export const hexToRgba = (hex: string, alpha: number = 1): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result || !result[1] || !result[2] || !result[3]) return `rgba(52, 152, 219, ${alpha})`;
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Math utilities
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const lerp = (start: number, end: number, progress: number): number => {
  return start + (end - start) * progress;
};

export const getMinMax = (data: number[]): { min: number; max: number } => {
  if (data.length === 0) return { min: 0, max: 1 };
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  
  // Add padding to avoid edge cases
  const padding = (max - min) * 0.1;
  return {
    min: min - padding,
    max: max + padding
  };
};

// Canvas utilities
export const getDevicePixelRatio = (): number => {
  return window.devicePixelRatio || 1;
};

export const setupHighDPICanvas = (canvas: HTMLCanvasElement): CanvasRenderingContext2D => {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  
  const dpr = getDevicePixelRatio();
  const rect = canvas.getBoundingClientRect();
  
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  
  ctx.scale(dpr, dpr);
  
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  
  return ctx;
};

// Animation easing functions
export const easingFunctions = {
  linear: (t: number): number => t,
  easeInOut: (t: number): number => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeIn: (t: number): number => t * t,
  easeOut: (t: number): number => t * (2 - t)
};

// Generate nice looking default colors
export const defaultColors = [
  '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
  '#1abc9c', '#34495e', '#e67e22', '#95a5a6', '#d35400'
];

// Text measurement utilities
export const measureText = (ctx: CanvasRenderingContext2D, text: string): TextMetrics => {
  return ctx.measureText(text);
};

export const getTextHeight = (ctx: CanvasRenderingContext2D): number => {
  const metrics = ctx.measureText('M');
  return metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
};

// Angle utilities (for pie/doughnut charts)
export const degToRad = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

export const radToDeg = (radians: number): number => {
  return (radians * 180) / Math.PI;
}; 